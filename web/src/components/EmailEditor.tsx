'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { EmailGeneration } from '@/lib/db/types';
import type { GeneratedEmail, EmailSection } from '@/lib/ai/claude';
import { FONT_REGISTRY, fontFamilyCSS, buildAllFontsGoogleUrl } from '@/lib/email/renderer';
import { runEmailChecklist } from '@/lib/email/checklist';
import ImageUploadInput from '@/components/ImageUploadInput';
import IconPicker from '@/components/IconPicker';
import EmailVerifyModal from '@/components/EmailVerifyModal';
import UpgradeModal from '@/components/UpgradeModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EmailEditorProps {
  emailId: string;
}

function SortableSectionItem({ id, children }: { id: number; children: (dragHandleProps: React.HTMLAttributes<HTMLElement>) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    zIndex: isDragging ? 50 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children({ ...attributes, ...listeners })}
    </div>
  );
}

// Soft check, not a hard block — catches the common typos (stray spaces,
// missing scheme) without rejecting legitimate relative paths, anchors, or
// mailto:/tel: links.
function isLikelyValidUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (/\s/.test(trimmed)) return false;
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed);
}

function UrlWarning({ url }: { url: string | undefined }) {
  if (!url || isLikelyValidUrl(url)) return null;
  return (
    <p className="text-[10px] text-yellow-500/80 mt-1">
      Doesn&apos;t look like a valid link — expected https://, /path, #anchor, mailto:, or tel:
    </p>
  );
}

/** Swaps the item at `index` with its neighbor in `direction` — a no-op past either end. */
function moveArrayItem<T>(arr: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** Small up/down pair for reordering one item within an array field — pairs with the existing delete button on each array-item row. */
function ReorderButtons({ index, count, onMove }: { index: number; count: number; onMove: (direction: -1 | 1) => void }) {
  return (
    <div className="flex items-center flex-shrink-0">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        title="Move up"
        className="p-1 rounded text-white/30 hover:text-white transition-colors disabled:opacity-20 disabled:hover:text-white/30"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={index === count - 1}
        title="Move down"
        className="p-1 rounded text-white/30 hover:text-white transition-colors disabled:opacity-20 disabled:hover:text-white/30"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
    </div>
  );
}

export default function EmailEditor({ emailId }: EmailEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<EmailGeneration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingThisEmail, setDeletingThisEmail] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<Array<{ role: 'user' | 'ai'; content: string; isUpgradeError?: boolean }>>([]);
  const [trialStatus, setTrialStatus] = useState<{ planType: string; creditsRemaining: number; testSendCreditsRemaining: number } | null>(null);
  const aiInputRef = useRef<HTMLInputElement | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Editor state
  const [editedEmail, setEditedEmail] = useState<GeneratedEmail | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Undo/redo — a capped stack of full editedEmail snapshots. Rapid edits
  // (typing) are coalesced into one entry via debounce; structural actions
  // (delete/duplicate/add/reorder section) flush immediately so Ctrl+Z right
  // after one of those always undoes exactly that action.
  const MAX_HISTORY = 50;
  const [historyState, setHistoryState] = useState<{ stack: GeneratedEmail[]; index: number }>({ stack: [], index: -1 });
  const historyStateRef = useRef(historyState);
  useEffect(() => { historyStateRef.current = historyState; }, [historyState]);
  const applyingHistoryRef = useRef(false);
  const forceImmediateHistoryRef = useRef(false);
  const historyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [sendToEmail, setSendToEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string; isUpgradeError?: boolean } | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [defaultColors, setDefaultColors] = useState<{ bodyBg: string; bodyColor: string; primaryColor: string; secondaryColor: string } | null>(null);
  const [regeneratingSection, setRegeneratingSection] = useState<number | null>(null);
  const [blockError, setBlockError] = useState<{ index: number; message: string; isUpgradeError?: boolean } | null>(null);
  const [upgradeModalMessage, setUpgradeModalMessage] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [aiOpenSection, setAiOpenSection] = useState<number | null>(null);
  const [headingFontDropdownOpen, setHeadingFontDropdownOpen] = useState(false);
  const [bodyFontDropdownOpen, setBodyFontDropdownOpen] = useState(false);

  // Always-current ref so the iframe onLoad handler reads latest sections without stale closure

  // Live preview state
  const [livePreviewHtml, setLivePreviewHtml] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const previewDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewAbortRef = useRef<AbortController | null>(null);
  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const BLOCK_TYPES: Array<{ type: EmailSection['type']; label: string; description: string; icon: string }> = [
    { type: 'hero',          label: 'Hero',          description: 'Large banner with heading & image',   icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { type: 'content',       label: 'Content',       description: 'Heading + body text block',           icon: 'M4 6h16M4 12h16M4 18h7' },
    { type: 'cta',           label: 'Call to Action', description: 'Heading, text & button',             icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5' },
    { type: 'announcement',  label: 'Announcement',  description: 'Highlighted notice or alert',         icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.952 9.168-5v14c-1.543-3.048-5.068-5-9.168-5H7a3.988 3.988 0 01-1.564-.317z' },
    { type: 'image-text',    label: 'Image + Text',  description: 'Side-by-side image and copy',        icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
    { type: 'feature-list',  label: 'Feature List',  description: 'Icon + title + description rows',    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { type: 'testimonial',   label: 'Testimonial',   description: 'Quote with author attribution',      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { type: 'testimonials',  label: 'Testimonials Grid', description: 'Multiple quote cards with ratings', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4' },
    { type: 'stats',         label: 'Stats',         description: 'Key numbers / metrics',              icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { type: 'gallery',       label: 'Gallery',       description: 'Grid of images',                     icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { type: 'image-block',   label: 'Image Block',   description: 'Full-bleed photo(s), no padding',    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h16M4 4h16v16H4V4z' },
    { type: 'pricing-table', label: 'Pricing Table', description: 'Plan comparison cards',              icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { type: 'coupon',        label: 'Coupon',        description: 'Promo code with expiry',             icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { type: 'columns',       label: 'Columns',       description: 'Multi-column layout',                icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7' },
    { type: 'social-links',  label: 'Social Links',  description: 'Social media icon links',            icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { type: 'header',        label: 'Header',        description: 'Logo + navigation bar',              icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z' },
    { type: 'footer',        label: 'Footer',        description: 'Unsubscribe + fine print',           icon: 'M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { type: 'divider',       label: 'Divider',       description: 'Horizontal rule spacer',             icon: 'M5 12h14' },
    { type: 'quote',         label: 'Quote',         description: 'Large pull-quote with attribution',   icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { type: 'code-block',    label: 'Code Block',    description: 'Syntax-highlighted code snippet',    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  ];

  const DEFAULT_SECTION: Record<EmailSection['type'], Partial<EmailSection>> = {
    hero:          { heading: 'Welcome', subheading: 'Your subtitle here', text: '', buttonText: '', buttonUrl: '' },
    content:       { heading: 'Section Heading', text: 'Your content goes here.' },
    cta:           { heading: 'Take Action', text: 'Convince them to click.', buttonText: 'Get Started', buttonUrl: 'https://' },
    announcement:  { heading: 'Important Update', text: 'Details of your announcement here.', buttonText: '', buttonUrl: '' },
    'image-text':  { heading: 'Feature Title', text: 'Describe the feature.', imageUrl: '', imagePosition: 'left', buttonText: '', buttonUrl: '' },
    'feature-list': { heading: 'Our Features', features: [{ title: 'Feature 1', description: 'Description here.' }] },
    testimonial:   { quote: 'This product changed my life.', author: 'Jane Doe', authorTitle: 'CEO, Acme Inc.' },
    testimonials:  { heading: 'What Our Customers Say', testimonials: [{ quote: 'This product changed my life.', author: 'Jane Doe', authorTitle: 'CEO, Acme Inc.', rating: 5 }, { quote: 'Highly recommend to everyone.', author: 'John Smith', authorTitle: 'Founder, StartupXYZ', rating: 5 }] },
    stats:         { heading: 'By the Numbers', stats: [{ value: '1,000+', label: 'Customers' }, { value: '99%', label: 'Satisfaction' }] },
    gallery:       { heading: 'Gallery', images: [{ url: '', alt: 'Image 1' }, { url: '', alt: 'Image 2' }] },
    'image-block': { images: [{ url: '', alt: 'Image 1' }, { url: '', alt: 'Image 2' }] },
    'pricing-table': { heading: 'Pricing', plans: [{ name: 'Pro', price: '$29', period: '/mo', features: ['Feature A', 'Feature B'], buttonText: 'Start Free Trial' }] },
    coupon:        { heading: 'Special Offer', text: 'Use this code at checkout.', code: 'SAVE20', expiryText: 'Expires soon' },
    columns:       { heading: '', columns: [{ heading: 'Column 1', text: 'Content here.' }, { heading: 'Column 2', text: 'Content here.' }] },
    'social-links': { heading: '', text: 'Follow us on social media', socialLinks: [{ platform: 'Twitter', url: 'https://' }, { platform: 'Instagram', url: 'https://' }] },
    header:        { logoUrl: '', logoAlt: 'Logo', tagline: '', columns: [] },
    footer:        { text: 'You received this email because you subscribed. Unsubscribe.', buttonText: '', buttonUrl: '', logoUrl: '' },
    divider:       { text: '' },
    quote:         { text: 'A memorable insight or statement that stands on its own.', author: 'Author Name', authorTitle: 'Title, Company' },
    'code-block':  { heading: 'Code Example', text: 'console.log("Hello, world!");', language: 'javascript', subheading: 'Caption or explanation of the code.' },
  };

  const GRADIENT_PRESETS: Array<{ label: string; css: string }> = [
    { label: 'Midnight',  css: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { label: 'Sunset',    css: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)' },
    { label: 'Ocean',     css: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
    { label: 'Violet',    css: 'linear-gradient(135deg, #5f2c82 0%, #49a09d 100%)' },
    { label: 'Emerald',   css: 'linear-gradient(135deg, #0f3d3e 0%, #1a936f 100%)' },
    { label: 'Peach',     css: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { label: 'Blush',     css: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { label: 'Cyan Glow', css: 'linear-gradient(135deg, #00c2c2 0%, #005f5f 100%)' },
    { label: 'Slate',     css: 'linear-gradient(135deg, #414345 0%, #232526 100%)' },
  ];

  useEffect(() => {
    loadEmail();
  }, [emailId]);

  // Warn before closing/refreshing the tab with unsaved edits — the browser
  // shows its own generic message; custom text is ignored by modern browsers.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Load every registered font's webfont once so the font picker can render live previews.
  useEffect(() => {
    const id = 'font-picker-preview-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = buildAllFontsGoogleUrl();
    document.head.appendChild(link);
  }, []);

  // Sync editedEmail when email loads (only on first load), seeding section colors from brand defaults
  useEffect(() => {
    if (email && !editedEmail && defaultColors && email.content_json) {
      const raw = email.content_json as GeneratedEmail;
      const seeded: GeneratedEmail = {
        ...raw,
        sections: raw.sections.map(s => ({
          ...s,
          backgroundColor: s.backgroundColor ?? defaultColors.bodyBg,
          textColor:       s.textColor       ?? defaultColors.bodyColor,
          buttonColor:     s.buttonColor     ?? defaultColors.primaryColor,
        })),
      };
      setEditedEmail(seeded);
      // Collapse all sections by default
      setCollapsedSections(new Set(seeded.sections.map((_, i) => i)));
      // Baseline for undo/redo — the loaded state is index 0, nothing to undo past it.
      applyingHistoryRef.current = true;
      setHistoryState({ stack: [seeded], index: 0 });
    }
  }, [email, editedEmail, defaultColors]);

  const pushHistorySnapshot = useCallback((snapshot: GeneratedEmail) => {
    setHistoryState(prev => {
      const trimmed = prev.stack.slice(0, prev.index + 1);
      const top = trimmed[trimmed.length - 1];
      if (top && JSON.stringify(top) === JSON.stringify(snapshot)) return prev;
      const next = [...trimmed, snapshot];
      const overflow = next.length - MAX_HISTORY;
      const capped = overflow > 0 ? next.slice(overflow) : next;
      return { stack: capped, index: capped.length - 1 };
    });
  }, []);

  // Records a debounced snapshot after every settled edit, coalescing rapid
  // typing into one undo step. Structural actions (delete/duplicate/add/
  // reorder section) set forceImmediateHistoryRef first so they commit on the
  // next tick instead of waiting out the full debounce — otherwise Ctrl+Z
  // pressed right after one of those would skip past it.
  useEffect(() => {
    if (!editedEmail) return;
    if (applyingHistoryRef.current) { applyingHistoryRef.current = false; return; }
    if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
    const delay = forceImmediateHistoryRef.current ? 0 : 600;
    forceImmediateHistoryRef.current = false;
    historyDebounceRef.current = setTimeout(() => pushHistorySnapshot(editedEmail), delay);
    return () => { if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current); };
  }, [editedEmail, pushHistorySnapshot]);

  const undo = useCallback(() => {
    const { stack, index } = historyStateRef.current;
    if (index <= 0) return;
    const newIndex = index - 1;
    applyingHistoryRef.current = true;
    setEditedEmail(stack[newIndex]);
    setIsDirty(true);
    setHistoryState({ stack, index: newIndex });
  }, []);

  const redo = useCallback(() => {
    const { stack, index } = historyStateRef.current;
    if (index >= stack.length - 1) return;
    const newIndex = index + 1;
    applyingHistoryRef.current = true;
    setEditedEmail(stack[newIndex]);
    setIsDirty(true);
    setHistoryState({ stack, index: newIndex });
  }, []);

  // Global Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z — skipped while focus is inside a
  // text input/textarea so the browser's native per-character undo in that
  // field still works as expected; the toolbar buttons remain the reliable
  // way to undo/redo regardless of focus.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'z' || !(e.metaKey || e.ctrlKey)) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // Debounced live preview: re-render on every edit with 700ms debounce
  useEffect(() => {
    if (!editedEmail) return;
    if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);
    previewDebounceRef.current = setTimeout(async () => {
      if (previewAbortRef.current) previewAbortRef.current.abort();
      const controller = new AbortController();
      previewAbortRef.current = controller;
      setPreviewing(true);
      try {
        const res = await fetch(`/api/email-generations/${emailId}/preview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content_json: editedEmail }),
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setLivePreviewHtml(data.html);
          setPreviewKey(k => k + 1);
        }
      } catch (e) {
        if ((e as Error).name !== 'AbortError') console.error('Preview error:', e);
      } finally {
        setPreviewing(false);
      }
    }, 700);
    return () => {
      if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);
      previewAbortRef.current?.abort();
    };
  }, [editedEmail, emailId]);

  const loadEmail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/email-generations/${emailId}`);
      
      if (!res.ok) {
        setError('Failed to load email');
        return;
      }

      const data = await res.json();
      setEmail(data.generation);
      if (data.defaultColors) setDefaultColors(data.defaultColors);
      if (data.trialStatus) setTrialStatus(data.trialStatus);
    } catch (err) {
      console.error('Error loading email:', err);
      setError('An error occurred while loading the email');
    } finally {
      setLoading(false);
    }
  };

  const updateEmailField = useCallback((field: keyof GeneratedEmail, value: string) => {
    setEditedEmail(prev => prev ? { ...prev, [field]: value } : prev);
    setIsDirty(true);
  }, []);

  const updateSection = useCallback((index: number, updates: Partial<EmailSection>) => {
    setEditedEmail(prev => {
      if (!prev) return prev;
      const sections = prev.sections.map((s, i) => i === index ? { ...s, ...updates } : s);
      return { ...prev, sections };
    });
    setIsDirty(true);
  }, []);

  // Shared iframe onLoad: section click-to-select + double-click inline field editing
  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument?.body) return;
    const doc = iframe.contentDocument;

    const style = doc.createElement('style');
    style.textContent = `
      .em-section { cursor: pointer !important; outline: 2px solid transparent !important; outline-offset: 2px !important; transition: outline 0.12s ease !important; }
      .em-section:hover { outline: 1px dashed rgba(150,150,150,0.5) !important; outline-offset: -1px !important; }
      .em-section.em-selected { outline: 1px dashed rgba(180,180,180,0.8) !important; outline-offset: -1px !important; }
      [data-em-field]:not([contenteditable="true"]):hover { outline: 1px solid rgba(96,165,250,0.45) !important; border-radius: 2px !important; cursor: text !important; }
      [data-em-field][contenteditable="true"] { outline: 2px solid rgba(0,200,200,0.8) !important; outline-offset: 1px !important; border-radius: 2px !important; cursor: text !important; }
    `;
    doc.head.appendChild(style);

    const script = doc.createElement('script');
    script.textContent = `(function() {
  var sections = Array.from(document.querySelectorAll('.em-section'));

  // Section click-to-select
  sections.forEach(function(sectionEl) {
    // Derive the true JSON section index from the first renderer-tagged child field.
    // We can't use the querySelectorAll loop index because header/footer/divider/social-links
    // sections don't have the em-section class, so the DOM index != JSON index.
    var firstField = sectionEl.querySelector('[data-em-si]');
    var si = firstField ? parseInt(firstField.getAttribute('data-em-si'), 10) : -1;
    if (isNaN(si) || si < 0) return;
    sectionEl.setAttribute('data-em-index', si);
    sectionEl.addEventListener('click', function(e) {
      if (document.querySelector('[contenteditable="true"]')) return;
      e.stopPropagation();
      sections.forEach(function(s) { s.classList.remove('em-selected'); });
      sectionEl.classList.add('em-selected');
      window.parent.postMessage({ type: 'section-click', index: si }, '*');
    });
  });

  // Double-click inline editing — relies on data-em-field attrs stamped by renderer in preview mode
  Array.from(document.querySelectorAll('[data-em-field]')).forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      if (el.getAttribute('contenteditable') === 'true') return;
      startEdit(el);
    });
  });

  function startEdit(el) {
    var field = el.getAttribute('data-em-field');
    var si = parseInt(el.getAttribute('data-em-si'), 10);
    if (!field || isNaN(si)) return;
    var isText = field === 'text';
    // Walk up from the clicked element itself rather than indexing the
    // \`sections\` array by \`si\` — that array only contains elements with the
    // em-section class, which header/footer/divider/social-links sections
    // don't have, so its DOM-order index doesn't line up with the true JSON
    // section index \`si\`. Using closest() is correct regardless of that gap.
    var sectionEl = el.closest('.em-section');
    var textGroup = isText
      ? Array.from(sectionEl ? sectionEl.querySelectorAll('[data-em-field="text"]') : [el])
      : null;
    var origContent = el.textContent || '';
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('data-em-editing', '1');
    el.focus();
    try {
      var r = document.createRange();
      r.selectNodeContents(el);
      var sel = window.getSelection();
      if (sel) { sel.removeAllRanges(); sel.addRange(r); }
    } catch(err) {}
    var done = false;
    function commit() {
      if (done) return; done = true;
      el.setAttribute('contenteditable', 'false');
      el.removeAttribute('data-em-editing');
      var value = isText && textGroup && textGroup.length > 1
        ? textGroup.map(function(p) { return (p.textContent || '').trim(); }).join('\\n\\n')
        : (el.textContent || '').trim();
      if (value !== origContent.trim()) {
        window.parent.postMessage({ type: 'field-update', sectionIndex: si, field: field, value: value }, '*');
      }
    }
    function cancel() {
      if (done) return; done = true;
      el.setAttribute('contenteditable', 'false');
      el.removeAttribute('data-em-editing');
      el.textContent = origContent;
    }
    el.addEventListener('blur', function() { setTimeout(commit, 80); }, { once: true });
    el.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); el.removeEventListener('keydown', onKey); cancel(); return; }
      if (e.key === 'Enter' && !e.shiftKey && !isText) { e.preventDefault(); el.removeEventListener('keydown', onKey); el.blur(); }
    });
  }
})();`;
    doc.body.appendChild(script);
  }, []);

  const deleteSection = useCallback((index: number) => {
    forceImmediateHistoryRef.current = true;
    setEditedEmail(prev => {
      if (!prev) return prev;
      return { ...prev, sections: prev.sections.filter((_, i) => i !== index) };
    });
    setCollapsedSections(prev => {
      const next = new Set<number>();
      prev.forEach(i => { if (i < index) next.add(i); else if (i > index) next.add(i - 1); });
      return next;
    });
    // Same reindexing every other section index below has to do — otherwise
    // deleting a section above the selected/AI-open one leaves that state
    // pointing at whatever section slid into the old index.
    const shiftOrClear = (i: number | null) => i === null ? null : i === index ? null : i > index ? i - 1 : i;
    setSelectedSection(shiftOrClear);
    setAiOpenSection(shiftOrClear);
    setIsDirty(true);
  }, []);

  const duplicateSection = useCallback((index: number) => {
    forceImmediateHistoryRef.current = true;
    setEditedEmail(prev => {
      if (!prev) return prev;
      const sections = [...prev.sections];
      sections.splice(index + 1, 0, structuredClone(sections[index]));
      return { ...prev, sections };
    });
    // Existing collapsed/selected/AI-open state below the insertion point needs
    // to shift down by one, same reasoning as deleteSection/reorderSections —
    // otherwise it ends up pointing at whatever slid into its old index.
    setCollapsedSections(prev => {
      const next = new Set<number>();
      prev.forEach(i => next.add(i > index ? i + 1 : i));
      return next;
    });
    const shiftForInsert = (i: number | null) => i === null ? null : i > index ? i + 1 : i;
    setSelectedSection(shiftForInsert);
    setAiOpenSection(shiftForInsert);
    setIsDirty(true);
  }, []);

  const toggleCollapse = useCallback((index: number) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }, []);

  const reorderSections = useCallback((oldIndex: number, newIndex: number) => {
    forceImmediateHistoryRef.current = true;
    setEditedEmail(prev => {
      if (!prev) return prev;
      return { ...prev, sections: arrayMove(prev.sections, oldIndex, newIndex) };
    });
    setCollapsedSections(prev => {
      if (prev.size === 0) return prev;
      const next = new Set<number>();
      prev.forEach(i => {
        if (i === oldIndex) { next.add(newIndex); return; }
        if (oldIndex < newIndex && i > oldIndex && i <= newIndex) { next.add(i - 1); return; }
        if (oldIndex > newIndex && i >= newIndex && i < oldIndex) { next.add(i + 1); return; }
        next.add(i);
      });
      return next;
    });
    const shiftForMove = (prev: number | null) => {
      if (prev === null) return null;
      if (prev === oldIndex) return newIndex;
      if (oldIndex < newIndex && prev > oldIndex && prev <= newIndex) return prev - 1;
      if (oldIndex > newIndex && prev >= newIndex && prev < oldIndex) return prev + 1;
      return prev;
    };
    setSelectedSection(shiftForMove);
    setAiOpenSection(shiftForMove);
    setIsDirty(true);
  }, []);

  const addSection = useCallback((type: EmailSection['type']) => {
    forceImmediateHistoryRef.current = true;
    const newSection: EmailSection = { type, ...DEFAULT_SECTION[type] } as EmailSection;
    setEditedEmail(prev => {
      if (!prev) return prev;
      return { ...prev, sections: [...prev.sections, newSection] };
    });
    setIsDirty(true);
    setShowAddBlock(false);
  }, []);

  const handleCancelChanges = useCallback(() => {
    if (!email) return;
    const reverted = JSON.parse(JSON.stringify(email.content_json)) as GeneratedEmail;
    applyingHistoryRef.current = true;
    setEditedEmail(reverted);
    setIsDirty(false);
    // Any selection/AI-panel state may reference sections that no longer
    // exist (or moved) once the array reverts to the last-saved shape.
    setSelectedSection(null);
    setAiOpenSection(null);
    setCollapsedSections(new Set());
    // Reverting to the saved state discards whatever was undoable before it —
    // it becomes the new baseline, same as a fresh load.
    setHistoryState({ stack: [reverted], index: 0 });
  }, [email]);

  const handleSave = async (): Promise<boolean> => {
    if (!editedEmail) return false;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/email-generations/${emailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_json: editedEmail }),
      });
      if (!res.ok) {
        setSaveError('Failed to save changes');
        return false;
      }
      const data = await res.json();
      setEmail(data.generation);
      setPreviewKey(k => k + 1);
      setIsDirty(false);
      setLastSavedAt(new Date());
      return true;
    } catch (err) {
      console.error('Save error:', err);
      setSaveError('An error occurred while saving');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAiEdit = async () => {
    const instruction = aiMessage.trim();
    if (!instruction || aiLoading) return;

    setAiMessage('');
    setAiLoading(true);
    setAiHistory(prev => [...prev, { role: 'user', content: instruction }]);

    try {
      const res = await fetch('/api/edit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailGenerationId: emailId, instruction, currentContent: editedEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setAiHistory(prev => [...prev, { role: 'ai', content: data.error || "You've used all your free AI actions this month.", isUpgradeError: true }]);
          setTrialStatus(prev => prev ? { ...prev, creditsRemaining: 0 } : prev);
          setUpgradeModalMessage(data.error || "You've used all your free AI actions this month. Upgrade to Professional for unlimited use.");
        } else {
          setAiHistory(prev => [...prev, { role: 'ai', content: `Sorry, something went wrong: ${data.error || 'Unknown error'}` }]);
        }
        return;
      }

      setEditedEmail(data.content_json);
      setLivePreviewHtml(data.html_code);
      setPreviewKey(k => k + 1);
      // The server already persisted this result (built from our current edits,
      // not stale DB content — see currentContent above), so there's nothing
      // left unsaved; showing "Save Changes" here would just be a no-op save.
      setIsDirty(false);
      // This request just consumed one unit from the pooled free-plan AI
      // actions allowance (shared with generation and block regeneration) —
      // reflect that immediately instead of waiting for a second attempt to 402.
      setTrialStatus(prev => prev ? { ...prev, creditsRemaining: Math.max(0, prev.creditsRemaining - 1) } : prev);
      setAiHistory(prev => [...prev, { role: 'ai', content: 'Done! The email has been updated. You can keep refining or close this panel.' }]);
    } catch {
      setAiHistory(prev => [...prev, { role: 'ai', content: 'Network error. Please try again.' }]);
    } finally {
      setAiLoading(false);
      setTimeout(() => aiInputRef.current?.focus(), 50);
    }
  };

  const handleSendTestEmail = async () => {
    if (!sendToEmail.trim() || !email) return;
    setSending(true);
    setSendResult(null);
    // Test sends always email out the last-saved html_code — with unsaved edits
    // sitting in editedEmail, the recipient would silently get a stale version
    // (and, for a free-plan user, that could burn one of their monthly test sends on it).
    if (isDirty) {
      const saved = await handleSave();
      if (!saved) {
        setSendResult({ success: false, message: 'Could not save your changes before sending — please try again.' });
        setSending(false);
        return;
      }
    }
    try {
      const res = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: email.id, toEmail: sendToEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendResult({ success: false, message: data.error || 'Failed to send', isUpgradeError: res.status === 402 });
        if (res.status === 402) {
          setTrialStatus(prev => prev ? { ...prev, testSendCreditsRemaining: 0 } : prev);
          setUpgradeModalMessage(data.error || "You've used all 3 of your free test sends this month. Upgrade to Professional for unlimited test sends.");
        }
      } else {
        setSendResult({ success: true, message: `Sent! Check your inbox at ${sendToEmail.trim()}` });
        // This request just consumed one unit from the separate test-send
        // allowance — reflect that immediately instead of waiting for a
        // second attempt to 402.
        setTrialStatus(prev => prev ? { ...prev, testSendCreditsRemaining: Math.max(0, prev.testSendCreditsRemaining - 1) } : prev);
      }
    } catch {
      setSendResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  // Listen for postMessages from the preview iframe (section-click + field-update)
  useEffect(() => {
    const EDITABLE_FIELDS = new Set(['heading','subheading','intro','text','eyebrow',
      'buttonText','secondaryButtonText','quote','author','authorTitle',
      'tagline','expiryText','code','imageAlt']);
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'section-click' && typeof e.data.index === 'number') {
        const idx = e.data.index;
        setSelectedSection(idx);
        setCollapsedSections(prev => {
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
        setTimeout(() => {
          sectionRefs.current.get(idx)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
      }
      if (
        e.data?.type === 'field-update' &&
        typeof e.data.sectionIndex === 'number' &&
        typeof e.data.field === 'string' &&
        typeof e.data.value === 'string' &&
        EDITABLE_FIELDS.has(e.data.field)
      ) {
        updateSection(e.data.sectionIndex, { [e.data.field as keyof EmailSection]: e.data.value });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [updateSection]);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = active.id as number;
      const newIndex = over.id as number;
      reorderSections(oldIndex, newIndex);
    }
  }, [reorderSections]);

  const emailContent = email?.content_json as GeneratedEmail | null;

  const verifyIssueCount = useMemo(() => {
    if (!editedEmail || !defaultColors) return 0;
    return runEmailChecklist(editedEmail, defaultColors, email?.html_code ?? null)
      .flatMap((c) => c.checks)
      .filter((c) => c.status === 'fail').length;
  }, [editedEmail, defaultColors, email?.html_code]);

  const isFreePlan = trialStatus !== null && trialStatus.planType !== 'pro';
  // AI edit and block regeneration draw from the same pooled monthly
  // allowance as email generation (see credits_remaining), not separate
  // one-time grants.
  const aiEditLocked = isFreePlan && trialStatus!.creditsRemaining < 1;
  const regenerateLocked = isFreePlan && trialStatus!.creditsRemaining < 1;
  const testSendLocked = isFreePlan && trialStatus!.testSendCreditsRemaining < 1;

  // Block type → accent color for left border
  const BLOCK_COLORS: Record<string, string> = {
    hero: '#a855f7', content: '#3b82f6', cta: '#00ffff', announcement: '#f59e0b',
    'image-text': '#10b981', 'feature-list': '#6366f1', testimonial: '#ec4899',
    testimonials: '#ec4899', stats: '#f97316', gallery: '#14b8a6', 'image-block': '#2dd4bf',
    'pricing-table': '#8b5cf6', coupon: '#ef4444', columns: '#06b6d4',
    'social-links': '#84cc16', header: '#94a3b8', footer: '#64748b',
    divider: '#475569', quote: '#d946ef', 'code-block': '#22d3ee',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  if (error || !email || !emailContent) {
    const isFailed = email?.status === 'failed';
    // Only reachable if a prior generate-email request crashed/timed out mid-flight —
    // generation completes synchronously within one request, so a lingering
    // 'generating' row means it never finished and never will on its own.
    const isStuckGenerating = email?.status === 'generating';

    const handleDeleteAndGoBack = async () => {
      if (!email) return;
      setDeletingThisEmail(true);
      try {
        await fetch(`/api/email-generations/${email.id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Error deleting email:', err);
      } finally {
        router.push('/dashboard');
      }
    };

    const title = isFailed ? 'Generation failed' : isStuckGenerating ? 'Generation interrupted' : 'Error';
    const message = isFailed
      ? (email?.error_message || 'This email failed to generate.')
      : isStuckGenerating
      ? "This email got interrupted while generating and never finished. Try generating a new one."
      : (error || 'Email not found');

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">{title}</h2>
          <p className="text-red-300 mb-6">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {(isFailed || isStuckGenerating) && email && (
              <button
                onClick={handleDeleteAndGoBack}
                disabled={deletingThisEmail}
                className="px-6 py-3 rounded-full border border-red-500/40 text-red-300 font-medium hover:bg-red-500/10 transition-all disabled:opacity-50"
              >
                {deletingThisEmail ? 'Deleting…' : 'Delete this email'}
              </button>
            )}
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 rounded-full bg-white text-black font-medium hover:shadow-xl transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isDirty && !window.confirm('You have unsaved changes. Leave without saving?')) return;
                  router.push('/dashboard');
                }}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </button>
              <div className="h-6 w-px bg-white/10"></div>
              <h2 className="text-white font-semibold truncate max-w-md">
                {emailContent?.subject || 'Untitled Email'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 mr-1">
                <button
                  onClick={undo}
                  disabled={historyState.index <= 0}
                  title="Undo (Ctrl+Z)"
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L4 10m0 0l5-5m-5 5h11a4 4 0 010 8h-1" />
                  </svg>
                </button>
                <button
                  onClick={redo}
                  disabled={historyState.index >= historyState.stack.length - 1}
                  title="Redo (Ctrl+Shift+Z)"
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l5-5m0 0l-5-5m5 5H9a4 4 0 000 8h1" />
                  </svg>
                </button>
              </div>
              {!isDirty && lastSavedAt && !saveError && (
                <span className="text-white/30 text-xs whitespace-nowrap">
                  Saved at {lastSavedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
              )}
              {saveError && (
                <span className="text-red-400 text-xs">{saveError}</span>
              )}
              <div className="relative">
                <button
                  onClick={() => setAiChatOpen(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-[#00ffff]/30 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Edit with AI
                </button>
              </div>
              {isDirty && (
                <button
                  onClick={handleCancelChanges}
                  className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-white/20 text-white/60 hover:border-white/40 hover:text-white/80"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                  isDirty
                    ? 'bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black hover:shadow-lg hover:shadow-[#00ffff]/30'
                    : 'border border-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black/80 rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isDirty ? 'Save Changes' : 'Saved'}
                  </>
                )}
              </button>
              <button
                onClick={() => setShowVerifyModal(true)}
                disabled={!editedEmail}
                className="relative px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-40"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify
                {verifyIssueCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {verifyIssueCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setSendResult(null);
                  setSendToEmail('');
                  setShowSendModal(true);
                }}
                disabled={!email.html_code}
                title={testSendLocked ? "You've used all 3 of your free test sends this month — upgrade to Professional for unlimited use." : undefined}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-40"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Test
              </button>
              <button
                onClick={() => {
                  if (!email.html_code) return;
                  const blob = new Blob([email.html_code], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${emailContent.subject?.replace(/[^a-z0-9]/gi, '_') || 'email'}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                disabled={!email.html_code}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-40"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export HTML
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          
          {/* Editor Panel - LEFT (1/3 width) */}
          <div className="lg:col-span-1 relative border-r border-white/10">
            <div className="h-[calc(100vh-73px)] overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">Blocks</h2>
                    {editedEmail && (
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wide">
                        {editedEmail.sections.length} blocks
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">
                    {isDirty ? (
                      <span className="text-yellow-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
                        Unsaved changes
                      </span>
                    ) : 'Drag to reorder · click to edit'}
                  </p>
                </div>
              </div>

              {editedEmail && (
                <>
                  {/* Subject Line */}
                  <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
                    <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Subject Line</label>
                    <input
                      type="text"
                      value={editedEmail.subject || ''}
                      onChange={e => updateEmailField('subject', e.target.value)}
                      className="w-full px-0 py-1 bg-transparent border-0 text-white text-base font-semibold focus:outline-none focus:ring-0 placeholder-white/30"
                      placeholder="Enter subject line…"
                    />
                  </div>

                  {/* Preview Text */}
                  <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
                    <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Preview Text</label>
                    <input
                      type="text"
                      value={editedEmail.previewText || ''}
                      onChange={e => updateEmailField('previewText', e.target.value)}
                      className="w-full px-0 py-1 bg-transparent border-0 text-white focus:outline-none focus:ring-0 placeholder-white/30"
                      placeholder="Enter preview text…"
                    />
                  </div>

                  {/* Email Type */}
                  <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
                    <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Email Type</label>
                    <select
                      value={editedEmail.emailType || 'other'}
                      onChange={e => updateEmailField('emailType', e.target.value)}
                      className="w-full px-0 py-1 bg-transparent border-0 text-white focus:outline-none focus:ring-0"
                    >
                      {['promotional', 'newsletter', 'educational', 'transactional', 'other'].map(t => (
                        <option key={t} value={t} className="bg-[#0a0a0a] capitalize">{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Picker */}
                  {(() => {
                    const fontNames = Object.keys(FONT_REGISTRY);
                    const currentHeading = editedEmail.fontPairing?.heading ?? '';
                    const currentBody    = editedEmail.fontPairing?.body    ?? '';
                    const setPairing = (heading: string, body: string) => {
                      setEditedEmail(prev => prev ? { ...prev, fontPairing: { heading, body }, fontVariant: undefined } : prev);
                      setIsDirty(true);
                    };

                    const FontDropdown = ({
                      label, value, onSelect, isOpen, setIsOpen,
                    }: {
                      label: string;
                      value: string;
                      onSelect: (name: string) => void;
                      isOpen: boolean;
                      setIsOpen: (open: boolean) => void;
                    }) => (
                      <div>
                        <span className="block text-[11px] text-white/40 mb-1">{label}</span>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex items-center justify-between bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white hover:border-white/30 focus:outline-none focus:border-white/30"
                          >
                            <span className="truncate" style={{ fontFamily: value ? fontFamilyCSS(value) : undefined }}>
                              {value || '— style default —'}
                            </span>
                            <svg className={`w-3.5 h-3.5 text-white/40 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {isOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                              <div className="absolute left-0 top-full mt-1 w-full max-h-[260px] bg-gradient-to-b from-black via-black to-black/95 border border-white/20 rounded-lg shadow-2xl shadow-black/50 overflow-y-auto z-20 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40 backdrop-blur-xl">
                                <button
                                  type="button"
                                  onClick={() => { onSelect(''); setIsOpen(false); }}
                                  className={`w-full px-3 py-2 text-left text-xs hover:bg-white/10 transition-colors border-b border-white/5 ${value === '' ? 'text-[#00ffff] bg-[#00ffff]/10' : 'text-white/50'}`}
                                >
                                  — style default —
                                </button>
                                {fontNames.map(name => (
                                  <button
                                    key={name}
                                    type="button"
                                    onClick={() => { onSelect(name); setIsOpen(false); }}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 ${value === name ? 'text-[#00ffff] bg-[#00ffff]/10' : 'text-white'}`}
                                    style={{ fontFamily: fontFamilyCSS(name) }}
                                  >
                                    {name}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );

                    return (
                      <div className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-3">
                        <label className="block text-xs font-medium text-white/40 uppercase tracking-wider">Fonts</label>
                        <FontDropdown
                          label="Heading"
                          value={currentHeading}
                          onSelect={name => setPairing(name, currentBody || name)}
                          isOpen={headingFontDropdownOpen}
                          setIsOpen={setHeadingFontDropdownOpen}
                        />
                        <FontDropdown
                          label="Body"
                          value={currentBody}
                          onSelect={name => setPairing(currentHeading || name, name)}
                          isOpen={bodyFontDropdownOpen}
                          setIsOpen={setBodyFontDropdownOpen}
                        />
                        {(currentHeading || currentBody) && (
                          <button
                            onClick={() => {
                              setEditedEmail(prev => prev ? { ...prev, fontPairing: undefined, fontVariant: 0 } : prev);
                              setIsDirty(true);
                            }}
                            className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
                          >
                            ✕ reset to style default
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Sections */}
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={editedEmail.sections.map((_, i) => i)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {editedEmail.sections.map((section, index) => {
                      const isCollapsed = collapsedSections.has(index);
                      const isSelected = selectedSection === index;
                      const blockColor = BLOCK_COLORS[section.type] ?? '#94a3b8';
                      const blockMeta = BLOCK_TYPES.find(b => b.type === section.type);
                      return (
                        <SortableSectionItem key={index} id={index}>
                          {(dragHandleProps) => (
                        <div
                          ref={el => { if (el) sectionRefs.current.set(index, el); else sectionRefs.current.delete(index); }}
                          className={`group rounded-lg border bg-white/5 transition-all ${
                            isSelected
                              ? 'border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                          style={{ borderLeftColor: blockColor, borderLeftWidth: '3px' }}
                        >
                          {/* Section header */}
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer select-none"
                            onClick={() => { toggleCollapse(index); setSelectedSection(index); }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {/* Drag handle */}
                              <div
                                {...dragHandleProps}
                                className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 -m-1 rounded text-white/20 hover:text-white/50 transition-colors touch-none"
                                onClick={e => e.stopPropagation()}
                                title="Drag to reorder"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                                </svg>
                              </div>
                              {/* Block type icon */}
                              {blockMeta && (
                                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${blockColor}20` }}>
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: blockColor }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={blockMeta.icon} />
                                  </svg>
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-white/80 uppercase tracking-wide">{blockMeta?.label ?? section.type}</span>
                                  <span className="text-[10px] text-white/25 font-normal">#{index + 1}</span>
                                </div>
                                {(section.heading || section.quote || section.text) && (
                                  <span className="text-[11px] text-white/35 truncate block max-w-[130px]">
                                    {section.heading || section.quote || section.text}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                              {/* AI Rewrite button */}
                              {!['divider', 'header', 'social-links'].includes(section.type) && (
                                <div className="relative group/ai">
                                  <button
                                    onClick={() => setAiOpenSection(prev => prev === index ? null : index)}
                                    className={`p-1.5 rounded transition-all ${
                                      regeneratingSection === index
                                        ? 'text-[#00ffff] cursor-wait'
                                        : aiOpenSection === index || section.sectionPrompt
                                          ? 'text-[#00ffff] bg-[#00ffff]/10'
                                          : 'text-white/25 hover:text-[#00ffff] hover:bg-[#00ffff]/10 opacity-0 group-hover:opacity-100'
                                    }`}
                                    title="Rewrite with AI"
                                  >
                                    {regeneratingSection === index ? (
                                      <div className="w-3.5 h-3.5 border-2 border-[#00ffff]/30 border-t-[#00ffff] rounded-full animate-spin" />
                                    ) : (
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                      </svg>
                                    )}
                                  </button>
                                  {/* Hover tooltip */}
                                  <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-30 opacity-0 group-hover/ai:opacity-100 transition-opacity duration-150">
                                    <div className="px-2 py-1 rounded bg-[#1a1a1a] border border-white/10 text-[10px] text-white/70 whitespace-nowrap shadow-lg">
                                      {section.sectionPrompt ? 'Edit AI instructions' : 'Rewrite with AI'}
                                    </div>
                                  </div>
                                </div>
                              )}
                              <button
                                onClick={() => duplicateSection(index)}
                                className="p-1.5 rounded text-white/20 hover:text-[#00ffff] hover:bg-[#00ffff]/10 transition-all opacity-0 group-hover:opacity-100"
                                title="Duplicate section"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => { if (window.confirm('Delete this section?')) deleteSection(index); }}
                                className="p-1.5 rounded text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                title="Delete section"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                              <button
                                onClick={() => { toggleCollapse(index); setSelectedSection(index); }}
                                className="p-1.5 rounded text-white/30 hover:text-white hover:bg-white/10 transition-all ml-1"
                                title={isCollapsed ? 'Expand section' : 'Collapse section'}
                              >
                                <svg
                                  className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* AI rewrite panel */}
                          {aiOpenSection === index && !['divider', 'header', 'social-links'].includes(section.type) && (
                            <div className="px-3 py-2.5 border-t border-[#00ffff]/20 bg-[#00ffff]/[0.04]">
                              <div className="flex gap-2 items-start">
                                <textarea
                                  autoFocus
                                  value={section.sectionPrompt || ''}
                                  onChange={e => updateSection(index, { sectionPrompt: e.target.value || undefined })}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                      e.preventDefault();
                                      e.currentTarget.closest('div')?.parentElement?.querySelector<HTMLButtonElement>('[data-ai-run]')?.click();
                                    }
                                    if (e.key === 'Escape') setAiOpenSection(null);
                                  }}
                                  rows={2}
                                  placeholder="Instructions… e.g. make it more urgent, write for startup founders, use bullet points"
                                  className="flex-1 px-2.5 py-1.5 bg-black/30 border border-[#00ffff]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#00ffff]/60 transition-colors resize-none placeholder-white/20 leading-relaxed"
                                />
                                <div className="flex flex-col gap-1.5">
                                  <button
                                    data-ai-run
                                    disabled={regeneratingSection !== null || regenerateLocked}
                                    title={regenerateLocked ? "You've used all your free AI actions this month — upgrade to Professional for unlimited use." : undefined}
                                    onClick={async () => {
                                      if (!email || regeneratingSection !== null || regenerateLocked) return;
                                      setBlockError(null);
                                      setRegeneratingSection(index);
                                      try {
                                        const res = await fetch('/api/regenerate-block', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            emailGenerationId: email.id,
                                            sectionIndex: index,
                                            designStyle: email.design_style,
                                            currentContent: editedEmail,
                                          }),
                                        });
                                        const data = await res.json();
                                        if (!res.ok) {
                                          setBlockError({ index, message: data.error || 'Failed to regenerate', isUpgradeError: res.status === 402 });
                                          if (res.status === 402) {
                                            setTrialStatus(prev => prev ? { ...prev, creditsRemaining: 0 } : prev);
                                            setUpgradeModalMessage(data.error || "You've used all your free AI actions this month. Upgrade to Professional for unlimited use.");
                                          }
                                          return;
                                        }
                                        updateSection(index, data.section);
                                        // updateSection marks the email dirty (correct for manual
                                        // edits), but the server already persisted this exact merged
                                        // result (see currentContent above) — override back to clean.
                                        setIsDirty(false);
                                        // This request just consumed one unit from the pooled free-plan
                                        // AI actions allowance (shared with generation and AI edit) —
                                        // reflect that immediately instead of waiting for a second
                                        // attempt to 402.
                                        setTrialStatus(prev => prev ? { ...prev, creditsRemaining: Math.max(0, prev.creditsRemaining - 1) } : prev);
                                        if (data.html_code) {
                                          setLivePreviewHtml(data.html_code);
                                          setPreviewKey(k => k + 1);
                                        }
                                        setAiOpenSection(null);
                                      } catch (err) {
                                        setBlockError({ index, message: err instanceof Error ? err.message : 'Regeneration failed' });
                                      } finally {
                                        setRegeneratingSection(null);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-[#00ffff]/15 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap"
                                  >
                                    {regeneratingSection === index ? (
                                      <div className="w-3 h-3 border-2 border-[#00ffff]/30 border-t-[#00ffff] rounded-full animate-spin" />
                                    ) : (
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                      </svg>
                                    )}
                                    Run
                                  </button>
                                </div>
                              </div>
                              {blockError?.index === index && (
                                <p className="mt-1.5 text-[11px] text-red-400 leading-relaxed">
                                  {blockError.message}
                                  {blockError.isUpgradeError && (
                                    <>
                                      {' '}
                                      <Link href="/#pricing" className="underline font-semibold text-red-300 hover:text-white transition-colors">
                                        Upgrade to Professional →
                                      </Link>
                                    </>
                                  )}
                                </p>
                              )}
                              {!blockError && regenerateLocked && (
                                <p className="mt-1.5 text-[11px] text-white/30">
                                  Free plan: out of AI actions this month —{' '}
                                  <Link href="/#pricing" className="underline hover:text-white/60 transition-colors">upgrade</Link> for unlimited.
                                </p>
                              )}
                            </div>
                          )}

                          {/* Section fields */}
                          {!isCollapsed && (
                            <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">

                              {/* ── Common fields ── */}
                              {['hero','content','cta','announcement','feature-list','testimonial','quote'].includes(section.type) && (
                                <div>
                                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Eyebrow <span className="normal-case text-white/20 font-normal">(small label above heading)</span></label>
                                  <input type="text" value={section.eyebrow || ''} onChange={e => updateSection(index, { eyebrow: e.target.value })}
                                    className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="e.g. New Feature, Announcement…" />
                                </div>
                              )}
                              {section.heading !== undefined && (
                                <div>
                                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Heading</label>
                                  <input type="text" value={section.heading || ''} onChange={e => updateSection(index, { heading: e.target.value })}
                                    className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white font-bold focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Enter heading…" />
                                </div>
                              )}
                              {section.subheading !== undefined && (
                                <div>
                                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Subheading</label>
                                  <input type="text" value={section.subheading || ''} onChange={e => updateSection(index, { subheading: e.target.value })}
                                    className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Enter subheading…" />
                                </div>
                              )}
                              {['hero','content','cta','announcement'].includes(section.type) && (
                                <div>
                                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Intro <span className="normal-case text-white/20 font-normal">(large lead paragraph)</span></label>
                                  <textarea value={section.intro || ''} onChange={e => updateSection(index, { intro: e.target.value })} rows={2}
                                    className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors resize-none placeholder-white/20" placeholder="Opening statement or key summary…" />
                                </div>
                              )}
                              {section.text !== undefined && !['footer', 'divider', 'social-links', 'hero', 'testimonial', 'testimonials', 'feature-list', 'pricing-table', 'stats', 'gallery', 'image-block', 'header', 'columns'].includes(section.type) && (
                                <div>
                                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Content</label>
                                  <textarea value={section.text || ''} onChange={e => updateSection(index, { text: e.target.value })} rows={3}
                                    className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors resize-none placeholder-white/20" placeholder="Enter content…" />
                                </div>
                              )}
                              {section.buttonText !== undefined && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Button Text</label>
                                    <input type="text" value={section.buttonText || ''} onChange={e => updateSection(index, { buttonText: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Click here" />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Button URL</label>
                                    <input type="text" value={section.buttonUrl || ''} onChange={e => updateSection(index, { buttonUrl: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="https://…" />
                                    <UrlWarning url={section.buttonUrl} />
                                  </div>
                                </div>
                              )}
                              {section.buttonText !== undefined && ['cta', 'hero', 'announcement'].includes(section.type) && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Secondary Button</label>
                                    <input type="text" value={section.secondaryButtonText || ''} onChange={e => updateSection(index, { secondaryButtonText: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Learn more" />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Secondary URL</label>
                                    <input type="text" value={section.secondaryButtonUrl || ''} onChange={e => updateSection(index, { secondaryButtonUrl: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="https://…" />
                                    <UrlWarning url={section.secondaryButtonUrl} />
                                  </div>
                                </div>
                              )}
                              {section.imageUrl !== undefined && (
                                <ImageUploadInput
                                  label="Image URL"
                                  value={section.imageUrl || ''}
                                  onChange={url => updateSection(index, { imageUrl: url })}
                                  onRemove={section.imageUrl ? () => updateSection(index, { imageUrl: '' }) : undefined}
                                />
                              )}
                              {section.imageUrl !== undefined && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Image Alt Text</label>
                                    <input type="text" value={section.imageAlt || ''} onChange={e => updateSection(index, { imageAlt: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Describe the image…" />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Pexels Keyword <span className="normal-case text-white/20 font-normal">(auto-fetch)</span></label>
                                    <input type="text" value={section.imageKeyword || ''} onChange={e => updateSection(index, { imageKeyword: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="e.g. coffee shop, team meeting…" />
                                  </div>
                                </div>
                              )}

                              {/* ── Background image (hero & cta sections) ── */}
                              {['hero', 'cta'].includes(section.type) && (
                                <div className="pt-2 border-t border-white/10">
                                  <ImageUploadInput
                                    label="Background Image"
                                    value={section.backgroundImageUrl || ''}
                                    onChange={url => updateSection(index, { backgroundImageUrl: url || undefined })}
                                    onRemove={section.backgroundImageUrl ? () => updateSection(index, { backgroundImageUrl: undefined }) : undefined}
                                  />
                                  {section.backgroundImageUrl && (
                                    <div className="mt-2">
                                      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Background Keyword <span className="normal-case text-white/20 font-normal">(auto-fetch)</span></label>
                                      <input type="text" value={section.backgroundImageKeyword || ''} onChange={e => updateSection(index, { backgroundImageKeyword: e.target.value || undefined })}
                                        className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="e.g. mountain sunrise horizon…" />
                                      <p className="text-[11px] text-white/25 mt-1">Regenerate to fetch a new photo, or paste a URL above.</p>
                                    </div>
                                  )}
                                  {section.backgroundImageUrl && (
                                    <div className="mt-2">
                                      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Overlay <span className="normal-case text-white/20 font-normal">(CSS color/rgba over the photo)</span></label>
                                      <input type="text" value={section.backgroundImageOverlay || ''} onChange={e => updateSection(index, { backgroundImageOverlay: e.target.value || undefined })}
                                        className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="default dark gradient — e.g. rgba(0,0,0,0.55)" />
                                    </div>
                                  )}
                                  {!section.backgroundImageUrl && (
                                    <div className="mt-2">
                                      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Background Keyword <span className="normal-case text-white/20 font-normal">(auto-fetch)</span></label>
                                      <input type="text" value={section.backgroundImageKeyword || ''} onChange={e => updateSection(index, { backgroundImageKeyword: e.target.value || undefined })}
                                        className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="e.g. city lights panorama…" />
                                      <p className="text-[11px] text-white/25 mt-1">A Pexels photo will be used as the full-width background with a dark gradient overlay for readability.</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ── image-text: position toggle ── */}
                              {section.type === 'image-text' && (
                                <>
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Image Position</label>
                                    <div className="flex gap-2">
                                      {(['left', 'right'] as const).map(pos => (
                                        <button key={pos} onClick={() => updateSection(index, { imagePosition: pos })}
                                          className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${section.imagePosition === pos ? 'border-[#00ffff] text-[#00ffff] bg-[#00ffff]/10' : 'border-white/10 text-white/40 hover:text-white'}`}>
                                          {pos.charAt(0).toUpperCase() + pos.slice(1)}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Byline <span className="normal-case text-white/20 font-normal">(optional)</span></label>
                                      <input type="text" value={section.author || ''} onChange={e => updateSection(index, { author: e.target.value })}
                                        className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Name" />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Byline Title</label>
                                      <input type="text" value={section.authorTitle || ''} onChange={e => updateSection(index, { authorTitle: e.target.value })}
                                        className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Title, Company" />
                                    </div>
                                  </div>
                                </>
                              )}

                              {/* ── code-block ── */}
                              {section.type === 'code-block' && (
                                <div>
                                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Language</label>
                                  <select value={section.language || 'javascript'} onChange={e => updateSection(index, { language: e.target.value })}
                                    className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors">
                                    {['javascript','typescript','python','bash','json','html','css','sql','yaml','rust','go'].map(lang => (
                                      <option key={lang} value={lang} className="bg-[#0a0a0a]">{lang}</option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {/* ── header: logo + tagline ── */}
                              {section.type === 'header' && (
                                <>
                                  <ImageUploadInput
                                    label="Logo URL"
                                    value={section.logoUrl || ''}
                                    onChange={url => updateSection(index, { logoUrl: url })}
                                    onRemove={section.logoUrl ? () => updateSection(index, { logoUrl: '' }) : undefined}
                                  />
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Logo Alt Text</label>
                                    <input type="text" value={section.logoAlt || ''} onChange={e => updateSection(index, { logoAlt: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Brand name" />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Tagline</label>
                                    <input type="text" value={section.tagline || ''} onChange={e => updateSection(index, { tagline: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Optional tagline…" />
                                    <p className="text-[11px] text-white/25 mt-1">Hidden if nav links are added below.</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <label className="block text-xs text-white/40 uppercase tracking-wider">Nav Links</label>
                                      <button
                                        onClick={() => updateSection(index, { columns: [...(section.columns || []), { heading: 'Link', buttonUrl: 'https://' }] })}
                                        className="text-[11px] text-[#00ffff]/70 hover:text-[#00ffff] transition-colors"
                                      >
                                        + Add link
                                      </button>
                                    </div>
                                    <div className="space-y-2">
                                      {(section.columns || []).map((nav, ni) => (
                                        <div key={ni} className="flex items-center gap-2">
                                          <input type="text" value={nav.heading || ''} onChange={e => {
                                            const next = [...(section.columns || [])];
                                            next[ni] = { ...next[ni], heading: e.target.value };
                                            updateSection(index, { columns: next });
                                          }} className="w-24 flex-shrink-0 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Label" />
                                          <div className="flex-1 min-w-0">
                                            <input type="text" value={nav.buttonUrl || ''} onChange={e => {
                                              const next = [...(section.columns || [])];
                                              next[ni] = { ...next[ni], buttonUrl: e.target.value };
                                              updateSection(index, { columns: next });
                                            }} className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="https://…" />
                                            <UrlWarning url={nav.buttonUrl} />
                                          </div>
                                          <ReorderButtons index={ni} count={(section.columns || []).length} onMove={d => updateSection(index, { columns: moveArrayItem(section.columns || [], ni, d) })} />
                                          <button onClick={() => updateSection(index, { columns: (section.columns || []).filter((_, i) => i !== ni) })} className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}

                              {/* ── testimonial ── */}
                              {section.type === 'testimonial' && (
                                <>
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Quote</label>
                                    <textarea value={section.quote || ''} onChange={e => updateSection(index, { quote: e.target.value })} rows={3}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors resize-none placeholder-white/20" placeholder="Customer quote…" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Author Name</label>
                                      <input type="text" value={section.author || ''} onChange={e => updateSection(index, { author: e.target.value })}
                                        className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Jane Doe" />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Author Title</label>
                                      <input type="text" value={section.authorTitle || ''} onChange={e => updateSection(index, { authorTitle: e.target.value })}
                                        className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="CEO, Acme" />
                                    </div>
                                  </div>
                                  <ImageUploadInput
                                    label="Author Image URL"
                                    value={section.authorImage || ''}
                                    onChange={url => updateSection(index, { authorImage: url })}
                                    onRemove={section.authorImage ? () => updateSection(index, { authorImage: '' }) : undefined}
                                  />
                                </>
                              )}

                              {/* ── testimonials (plural, 2-per-row grid) ── */}
                              {section.type === 'testimonials' && (
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Subheading</label>
                                    <input type="text" value={section.subheading || ''} onChange={e => updateSection(index, { subheading: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Optional subheading…" />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs text-white/40 uppercase tracking-wider">Quotes</label>
                                    <button onClick={() => updateSection(index, { testimonials: [...(section.testimonials || []), { quote: '', author: '', rating: 5 }] })}
                                      className="text-xs text-[#00ffff] hover:text-[#00ffff]/70 transition-colors flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                      Add quote
                                    </button>
                                  </div>
                                  {(section.testimonials || []).map((t, ti) => (
                                    <div key={ti} className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-white/30 uppercase tracking-wider">{ti + 1}</span>
                                        <div className="flex items-center gap-1">
                                          <ReorderButtons index={ti} count={(section.testimonials || []).length} onMove={d => updateSection(index, { testimonials: moveArrayItem(section.testimonials || [], ti, d) })} />
                                          <button onClick={() => updateSection(index, { testimonials: (section.testimonials || []).filter((_, i) => i !== ti) })}
                                            className="text-white/30 hover:text-red-400 transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                          </button>
                                        </div>
                                      </div>
                                      <textarea value={t.quote} onChange={e => { const arr = (section.testimonials || []).map((x, i) => i === ti ? { ...x, quote: e.target.value } : x); updateSection(index, { testimonials: arr }); }} rows={2}
                                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-white/10 text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors resize-none placeholder-white/20" placeholder="Quote…" />
                                      <div className="grid grid-cols-2 gap-1.5">
                                        <input type="text" value={t.author} onChange={e => { const arr = (section.testimonials || []).map((x, i) => i === ti ? { ...x, author: e.target.value } : x); updateSection(index, { testimonials: arr }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Author name" />
                                        <input type="text" value={t.authorTitle || ''} onChange={e => { const arr = (section.testimonials || []).map((x, i) => i === ti ? { ...x, authorTitle: e.target.value } : x); updateSection(index, { testimonials: arr }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Title, Company" />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <label className="text-[10px] text-white/30 uppercase tracking-wider flex-shrink-0">Rating</label>
                                        <input type="number" min={1} max={5} value={t.rating ?? 5} onChange={e => { const r = Math.min(5, Math.max(1, parseInt(e.target.value, 10) || 5)); const arr = (section.testimonials || []).map((x, i) => i === ti ? { ...x, rating: r } : x); updateSection(index, { testimonials: arr }); }}
                                          className="w-14 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors" />
                                      </div>
                                      <ImageUploadInput
                                        label="Author Image URL"
                                        value={t.authorImage || ''}
                                        onChange={url => { const arr = (section.testimonials || []).map((x, i) => i === ti ? { ...x, authorImage: url } : x); updateSection(index, { testimonials: arr }); }}
                                        onRemove={t.authorImage ? () => { const arr = (section.testimonials || []).map((x, i) => i === ti ? { ...x, authorImage: '' } : x); updateSection(index, { testimonials: arr }); } : undefined}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ── quote: author attribution ── */}
                              {section.type === 'quote' && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Author Name</label>
                                    <input type="text" value={section.author || ''} onChange={e => updateSection(index, { author: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Jane Doe" />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Author Title</label>
                                    <input type="text" value={section.authorTitle || ''} onChange={e => updateSection(index, { authorTitle: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="CEO, Acme" />
                                  </div>
                                </div>
                              )}

                              {/* ── coupon ── */}
                              {section.type === 'coupon' && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Promo Code</label>
                                    <input type="text" value={section.code || ''} onChange={e => updateSection(index, { code: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white font-mono focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="SAVE20" />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Expiry Text</label>
                                    <input type="text" value={section.expiryText || ''} onChange={e => updateSection(index, { expiryText: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Expires soon" />
                                  </div>
                                </div>
                              )}

                              {/* ── stats ── */}
                              {section.type === 'stats' && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs text-white/40 uppercase tracking-wider">Stats</label>
                                    <button onClick={() => updateSection(index, { stats: [...(section.stats || []), { value: '', label: '' }] })}
                                      className="text-xs text-[#00ffff] hover:text-[#00ffff]/70 transition-colors flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                      Add stat
                                    </button>
                                  </div>
                                  {(section.stats || []).map((stat, si) => (
                                    <div key={si} className="flex gap-2 items-center">
                                      <IconPicker
                                        iconName={stat.iconName}
                                        icon={stat.icon}
                                        onChange={upd => { const s = (section.stats || []).map((x, i) => i === si ? { ...x, ...upd } : x); updateSection(index, { stats: s }); }}
                                      />
                                      <input type="text" value={stat.value} onChange={e => { const s = (section.stats || []).map((x, i) => i === si ? { ...x, value: e.target.value } : x); updateSection(index, { stats: s }); }}
                                        className="w-1/4 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="99%" />
                                      <input type="text" value={stat.label} onChange={e => { const s = (section.stats || []).map((x, i) => i === si ? { ...x, label: e.target.value } : x); updateSection(index, { stats: s }); }}
                                        className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Label" />
                                      <ReorderButtons index={si} count={(section.stats || []).length} onMove={d => updateSection(index, { stats: moveArrayItem(section.stats || [], si, d) })} />
                                      <button onClick={() => updateSection(index, { stats: (section.stats || []).filter((_, i) => i !== si) })}
                                        className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ── feature-list ── */}
                              {section.type === 'feature-list' && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-4 pb-1">
                                    <div>
                                      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Layout</label>
                                      <div className="flex gap-1.5">
                                        {(['list', 'grid'] as const).map(opt => (
                                          <button key={opt} onClick={() => updateSection(index, { layout: opt })}
                                            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${(section.layout ?? 'list') === opt ? 'border-[#00ffff] text-[#00ffff] bg-[#00ffff]/10' : 'border-white/10 text-white/40 hover:text-white'}`}>
                                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Style</label>
                                      <div className="flex gap-1.5">
                                        <button onClick={() => updateSection(index, { numbered: false })}
                                          className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${!section.numbered ? 'border-[#00ffff] text-[#00ffff] bg-[#00ffff]/10' : 'border-white/10 text-white/40 hover:text-white'}`}>
                                          Icons
                                        </button>
                                        <button onClick={() => updateSection(index, { numbered: true })}
                                          className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${section.numbered ? 'border-[#00ffff] text-[#00ffff] bg-[#00ffff]/10' : 'border-white/10 text-white/40 hover:text-white'}`}>
                                          Numbered
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs text-white/40 uppercase tracking-wider">Features</label>
                                    <button onClick={() => updateSection(index, { features: [...(section.features || []), { title: '', description: '' }] })}
                                      className="text-xs text-[#00ffff] hover:text-[#00ffff]/70 transition-colors flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                      Add feature
                                    </button>
                                  </div>
                                  {(section.features || []).map((feat, fi) => (
                                    <div key={fi} className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                                      <div className="flex items-center gap-2">
                                        <IconPicker
                                          iconName={feat.iconName}
                                          icon={feat.icon}
                                          onChange={upd => { const f = (section.features || []).map((x, i) => i === fi ? { ...x, ...upd } : x); updateSection(index, { features: f }); }}
                                        />
                                        <input type="text" value={feat.title} onChange={e => { const f = (section.features || []).map((x, i) => i === fi ? { ...x, title: e.target.value } : x); updateSection(index, { features: f }); }}
                                          className="flex-1 px-0 py-1 bg-transparent border-0 border-b border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Feature title" />
                                        <ReorderButtons index={fi} count={(section.features || []).length} onMove={d => updateSection(index, { features: moveArrayItem(section.features || [], fi, d) })} />
                                        <button onClick={() => updateSection(index, { features: (section.features || []).filter((_, i) => i !== fi) })}
                                          className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                      </div>
                                      <input type="text" value={feat.description} onChange={e => { const f = (section.features || []).map((x, i) => i === fi ? { ...x, description: e.target.value } : x); updateSection(index, { features: f }); }}
                                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-white/10 text-white/70 text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Description…" />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ── gallery ── */}
                              {section.type === 'gallery' && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs text-white/40 uppercase tracking-wider">Images</label>
                                    <button onClick={() => updateSection(index, { images: [...(section.images || []), { url: '', alt: '' }] })}
                                      className="text-xs text-[#00ffff] hover:text-[#00ffff]/70 transition-colors flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                      Add image
                                    </button>
                                  </div>
                                  {(section.images || []).map((img, ii) => (
                                    <div key={ii} className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                                      <div className="flex gap-2 items-center">
                                        <span className="text-[10px] text-white/30 uppercase tracking-wider w-5 flex-shrink-0">{ii + 1}</span>
                                        <ReorderButtons index={ii} count={(section.images || []).length} onMove={d => updateSection(index, { images: moveArrayItem(section.images || [], ii, d) })} />
                                        <button onClick={() => updateSection(index, { images: (section.images || []).filter((_, i) => i !== ii) })}
                                          className="ml-auto text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                      </div>
                                      <ImageUploadInput
                                        label=""
                                        value={img.url}
                                        onChange={url => { const imgs = (section.images || []).map((x, i) => i === ii ? { ...x, url } : x); updateSection(index, { images: imgs }); }}
                                        compact
                                        placeholder="Image URL"
                                      />
                                      <div className="grid grid-cols-2 gap-1.5">
                                        <input type="text" value={img.alt} onChange={e => { const imgs = (section.images || []).map((x, i) => i === ii ? { ...x, alt: e.target.value } : x); updateSection(index, { images: imgs }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Alt text" />
                                        <input type="text" value={img.keyword || ''} onChange={e => { const imgs = (section.images || []).map((x, i) => i === ii ? { ...x, keyword: e.target.value } : x); updateSection(index, { images: imgs }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Pexels keyword" />
                                      </div>
                                      <input type="text" value={img.caption || ''} onChange={e => { const imgs = (section.images || []).map((x, i) => i === ii ? { ...x, caption: e.target.value } : x); updateSection(index, { images: imgs }); }}
                                        className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Caption (optional)" />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ── image-block ── */}
                              {section.type === 'image-block' && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs text-white/40 uppercase tracking-wider">Images</label>
                                    {(section.images || []).length < 4 && (
                                      <button onClick={() => updateSection(index, { images: [...(section.images || []), { url: '', alt: '' }] })}
                                        className="text-xs text-[#00ffff] hover:text-[#00ffff]/70 transition-colors flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Add image
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-white/30">1 image = full width &middot; 2 = side by side &middot; 4 = 2&times;2 grid. No padding between images.</p>
                                  {(section.images || []).map((img, ii) => (
                                    <div key={ii} className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                                      <div className="flex gap-2 items-center">
                                        <span className="text-[10px] text-white/30 uppercase tracking-wider w-5 flex-shrink-0">{ii + 1}</span>
                                        <ReorderButtons index={ii} count={(section.images || []).length} onMove={d => updateSection(index, { images: moveArrayItem(section.images || [], ii, d) })} />
                                        <button onClick={() => updateSection(index, { images: (section.images || []).filter((_, i) => i !== ii) })}
                                          className="ml-auto text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                      </div>
                                      <ImageUploadInput
                                        label=""
                                        value={img.url}
                                        onChange={url => { const imgs = (section.images || []).map((x, i) => i === ii ? { ...x, url } : x); updateSection(index, { images: imgs }); }}
                                        compact
                                        placeholder="Image URL"
                                      />
                                      <div className="grid grid-cols-2 gap-1.5">
                                        <input type="text" value={img.alt} onChange={e => { const imgs = (section.images || []).map((x, i) => i === ii ? { ...x, alt: e.target.value } : x); updateSection(index, { images: imgs }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Alt text" />
                                        <input type="text" value={img.keyword || ''} onChange={e => { const imgs = (section.images || []).map((x, i) => i === ii ? { ...x, keyword: e.target.value } : x); updateSection(index, { images: imgs }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Pexels keyword" />
                                      </div>
                                    </div>
                                  ))}
                                  <input type="text" value={section.subheading || ''} onChange={e => updateSection(index, { subheading: e.target.value })}
                                    className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Caption below the block (optional)" />
                                </div>
                              )}

                              {/* ── pricing-table ── */}
                              {section.type === 'pricing-table' && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs text-white/40 uppercase tracking-wider">Plans</label>
                                    <button onClick={() => updateSection(index, { plans: [...(section.plans || []), { name: 'New Plan', price: '$0', features: [], buttonText: 'Get Started' }] })}
                                      className="text-xs text-[#00ffff] hover:text-[#00ffff]/70 transition-colors flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                      Add plan
                                    </button>
                                  </div>
                                  {(section.plans || []).map((plan, pi) => (
                                    <div key={pi} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-white/60">Plan {pi + 1}</span>
                                        <div className="flex items-center gap-2">
                                          <label className="flex items-center gap-1 text-xs text-white/40 cursor-pointer">
                                            <input type="checkbox" checked={plan.highlighted || false} onChange={e => { const p = (section.plans || []).map((x, i) => i === pi ? { ...x, highlighted: e.target.checked } : x); updateSection(index, { plans: p }); }} className="accent-[#00ffff]" />
                                            Highlighted
                                          </label>
                                          <ReorderButtons index={pi} count={(section.plans || []).length} onMove={d => updateSection(index, { plans: moveArrayItem(section.plans || [], pi, d) })} />
                                          <button onClick={() => updateSection(index, { plans: (section.plans || []).filter((_, i) => i !== pi) })}
                                            className="text-white/30 hover:text-red-400 transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                          </button>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-3 gap-2">
                                        <input type="text" value={plan.name} onChange={e => { const p = (section.plans || []).map((x, i) => i === pi ? { ...x, name: e.target.value } : x); updateSection(index, { plans: p }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Name" />
                                        <input type="text" value={plan.price} onChange={e => { const p = (section.plans || []).map((x, i) => i === pi ? { ...x, price: e.target.value } : x); updateSection(index, { plans: p }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="$29" />
                                        <input type="text" value={plan.period || ''} onChange={e => { const p = (section.plans || []).map((x, i) => i === pi ? { ...x, period: e.target.value } : x); updateSection(index, { plans: p }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="/mo" />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <input type="text" value={plan.buttonText || ''} onChange={e => { const p = (section.plans || []).map((x, i) => i === pi ? { ...x, buttonText: e.target.value } : x); updateSection(index, { plans: p }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Button text" />
                                        <div>
                                          <input type="text" value={plan.buttonUrl || ''} onChange={e => { const p = (section.plans || []).map((x, i) => i === pi ? { ...x, buttonUrl: e.target.value } : x); updateSection(index, { plans: p }); }}
                                            className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Button URL" />
                                          <UrlWarning url={plan.buttonUrl} />
                                        </div>
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[11px] text-white/30">Features</span>
                                          <button onClick={() => { const p = (section.plans || []).map((x, i) => i === pi ? { ...x, features: [...x.features, ''] } : x); updateSection(index, { plans: p }); }}
                                            className="text-[11px] text-[#00ffff]/60 hover:text-[#00ffff] transition-colors">+ feature</button>
                                        </div>
                                        {plan.features.map((feat, fii) => (
                                          <div key={fii} className="flex gap-1 items-center">
                                            <input type="text" value={feat} onChange={e => { const p = (section.plans || []).map((x, i) => i === pi ? { ...x, features: x.features.map((f, fi) => fi === fii ? e.target.value : f) } : x); updateSection(index, { plans: p }); }}
                                              className="flex-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Feature…" />
                                            <button onClick={() => { const p = (section.plans || []).map((x, i) => i === pi ? { ...x, features: x.features.filter((_, fi) => fi !== fii) } : x); updateSection(index, { plans: p }); }}
                                              className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0">
                                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ── columns ── */}
                              {section.type === 'columns' && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs text-white/40 uppercase tracking-wider">Columns</label>
                                    <button onClick={() => updateSection(index, { columns: [...(section.columns || []), { heading: '', text: '' }] })}
                                      className="text-xs text-[#00ffff] hover:text-[#00ffff]/70 transition-colors flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                      Add column
                                    </button>
                                  </div>
                                  {(section.columns || []).map((col, ci) => (
                                    <div key={ci} className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-white/30">Col {ci + 1}</span>
                                        <div className="flex items-center gap-1">
                                          <ReorderButtons index={ci} count={(section.columns || []).length} onMove={d => updateSection(index, { columns: moveArrayItem(section.columns || [], ci, d) })} />
                                          <button onClick={() => updateSection(index, { columns: (section.columns || []).filter((_, i) => i !== ci) })}
                                          className="text-white/30 hover:text-red-400 transition-colors">
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <IconPicker
                                          iconName={col.iconName}
                                          icon={col.icon}
                                          onChange={upd => { const c = (section.columns || []).map((x, i) => i === ci ? { ...x, ...upd } : x); updateSection(index, { columns: c }); }}
                                        />
                                        <input type="text" value={col.heading || ''} onChange={e => { const c = (section.columns || []).map((x, i) => i === ci ? { ...x, heading: e.target.value } : x); updateSection(index, { columns: c }); }}
                                          className="flex-1 px-0 py-1 bg-transparent border-0 border-b border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Column heading" />
                                      </div>
                                      <textarea value={col.text || ''} onChange={e => { const c = (section.columns || []).map((x, i) => i === ci ? { ...x, text: e.target.value } : x); updateSection(index, { columns: c }); }} rows={2}
                                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-white/10 text-white/70 text-xs focus:outline-none focus:border-[#00ffff] transition-colors resize-none placeholder-white/20" placeholder="Column text…" />
                                      <ImageUploadInput
                                        label=""
                                        value={col.imageUrl || ''}
                                        onChange={url => { const c = (section.columns || []).map((x, i) => i === ci ? { ...x, imageUrl: url } : x); updateSection(index, { columns: c }); }}
                                        compact
                                        placeholder="Column image URL (optional)"
                                      />
                                      <div className="grid grid-cols-2 gap-2">
                                        <input type="text" value={col.buttonText || ''} onChange={e => { const c = (section.columns || []).map((x, i) => i === ci ? { ...x, buttonText: e.target.value } : x); updateSection(index, { columns: c }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Button text" />
                                        <div>
                                          <input type="text" value={col.buttonUrl || ''} onChange={e => { const c = (section.columns || []).map((x, i) => i === ci ? { ...x, buttonUrl: e.target.value } : x); updateSection(index, { columns: c }); }}
                                            className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="https://…" />
                                          <UrlWarning url={col.buttonUrl} />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ── social-links ── */}
                              {section.type === 'social-links' && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs text-white/40 uppercase tracking-wider">Social Links</label>
                                    <button onClick={() => updateSection(index, { socialLinks: [...(section.socialLinks || []), { platform: '', url: '' }] })}
                                      className="text-xs text-[#00ffff] hover:text-[#00ffff]/70 transition-colors flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                      Add link
                                    </button>
                                  </div>
                                  {(section.socialLinks || []).map((link, li) => (
                                    <div key={li} className="space-y-1.5 p-2 rounded-lg bg-white/5 border border-white/10">
                                      <div className="flex gap-2 items-center">
                                        <input type="text" value={link.platform} onChange={e => { const sl = (section.socialLinks || []).map((x, i) => i === li ? { ...x, platform: e.target.value } : x); updateSection(index, { socialLinks: sl }); }}
                                          className="w-1/3 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Twitter" />
                                        <div className="flex-1">
                                          <input type="text" value={link.url} onChange={e => { const sl = (section.socialLinks || []).map((x, i) => i === li ? { ...x, url: e.target.value } : x); updateSection(index, { socialLinks: sl }); }}
                                            className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="https://…" />
                                          <UrlWarning url={link.url} />
                                        </div>
                                        <ReorderButtons index={li} count={(section.socialLinks || []).length} onMove={d => updateSection(index, { socialLinks: moveArrayItem(section.socialLinks || [], li, d) })} />
                                        <button onClick={() => updateSection(index, { socialLinks: (section.socialLinks || []).filter((_, i) => i !== li) })}
                                          className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-white/30 uppercase tracking-wider w-10 flex-shrink-0">Icon</span>
                                        <ImageUploadInput
                                          label=""
                                          value={link.iconUrl || ''}
                                          onChange={url => { const sl = (section.socialLinks || []).map((x, i) => i === li ? { ...x, iconUrl: url } : x); updateSection(index, { socialLinks: sl }); }}
                                          compact
                                          placeholder="Upload or paste icon URL"
                                        />
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] text-white/30 uppercase tracking-wider w-10 flex-shrink-0">Fallback</span>
                                        {['🐦','📷','💼','👍','▶️','🎵','📌','💬'].map(emoji => (
                                          <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => { const sl = (section.socialLinks || []).map((x, i) => i === li ? { ...x, icon: emoji } : x); updateSection(index, { socialLinks: sl }); }}
                                            className={`w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-white/10 transition-colors ${link.icon === emoji ? 'bg-[#00ffff]/15 border border-[#00ffff]/50' : 'border border-transparent'}`}
                                          >
                                            {emoji}
                                          </button>
                                        ))}
                                        {link.icon && (
                                          <button type="button" onClick={() => { const sl = (section.socialLinks || []).map((x, i) => i === li ? { ...x, icon: undefined } : x); updateSection(index, { socialLinks: sl }); }}
                                            className="text-[10px] text-white/30 hover:text-red-400 transition-colors ml-0.5">
                                            Clear
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ── divider: optional centered label ── */}
                              {section.type === 'divider' && (
                                <div>
                                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Label <span className="normal-case text-white/20 font-normal">(optional, shown centered under the rule)</span></label>
                                  <input type="text" value={section.text || ''} onChange={e => updateSection(index, { text: e.target.value })}
                                    className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="e.g. OR, AND MORE…" />
                                </div>
                              )}

                              {/* ── footer ── */}
                              {section.type === 'footer' && (
                                <>
                                  <ImageUploadInput
                                    label="Logo URL (optional)"
                                    value={section.logoUrl || ''}
                                    onChange={url => updateSection(index, { logoUrl: url })}
                                    onRemove={section.logoUrl ? () => updateSection(index, { logoUrl: '' }) : undefined}
                                  />
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Footer Text</label>
                                    <textarea value={section.text || ''} onChange={e => updateSection(index, { text: e.target.value })} rows={2}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors resize-none placeholder-white/20" placeholder="Company Name · 123 Street, City" />
                                  </div>
                                  {/* Extra link Button Text/URL fields are rendered by the common block below */}
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Unsubscribe URL</label>
                                    <input type="text" value={section.unsubscribeUrl || ''} onChange={e => updateSection(index, { unsubscribeUrl: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="https://yourapp.com/unsubscribe" />
                                    <UrlWarning url={section.unsubscribeUrl} />
                                    <p className="text-[11px] text-white/25 mt-1">Leave blank to use your ESP's merge tag</p>
                                  </div>
                                </>
                              )}



                              {/* ── Color overrides ── */}
                              {section.type !== 'divider' && (
                                <div className="pt-3 mt-1 border-t border-white/10">
                                  <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Colors <span className="normal-case text-white/20 font-normal">(override brand defaults)</span></label>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-wider">Background</label>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="color"
                                          value={section.backgroundColor || '#ffffff'}
                                          onChange={e => updateSection(index, { backgroundColor: e.target.value })}
                                          className="w-7 h-7 rounded cursor-pointer border border-white/20 bg-transparent p-0.5 flex-shrink-0"
                                        />
                                        <input
                                          type="text"
                                          value={section.backgroundColor || ''}
                                          onChange={e => updateSection(index, { backgroundColor: e.target.value || undefined })}
                                          className="flex-1 min-w-0 px-1.5 py-1 bg-white/5 border border-white/10 rounded text-white text-[11px] font-mono focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20"
                                          placeholder="default"
                                        />
                                      </div>
                                      <div className="mt-1.5">
                                        <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-wider">Gradient <span className="normal-case text-white/20">(overrides background)</span></label>
                                        <div className="flex flex-wrap gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => updateSection(index, { backgroundGradient: undefined })}
                                            title="None"
                                            className={`w-7 h-7 rounded border flex items-center justify-center bg-white/5 transition-colors ${!section.backgroundGradient ? 'border-[#00ffff]' : 'border-white/15 hover:border-white/30'}`}
                                          >
                                            <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                          </button>
                                          {GRADIENT_PRESETS.map(preset => (
                                            <button
                                              key={preset.label}
                                              type="button"
                                              onClick={() => updateSection(index, { backgroundGradient: preset.css })}
                                              title={preset.label}
                                              style={{ background: preset.css }}
                                              className={`w-7 h-7 rounded border transition-transform hover:scale-110 ${section.backgroundGradient === preset.css ? 'border-[#00ffff] ring-1 ring-[#00ffff]' : 'border-white/15'}`}
                                            />
                                          ))}
                                        </div>
                                        <input
                                          type="text"
                                          value={section.backgroundGradient || ''}
                                          onChange={e => updateSection(index, { backgroundGradient: e.target.value || undefined })}
                                          className="mt-1.5 w-full px-1.5 py-1 bg-white/5 border border-white/10 rounded text-white text-[11px] font-mono focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20"
                                          placeholder="custom CSS, e.g. linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-wider">Text</label>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="color"
                                          value={section.textColor || '#000000'}
                                          onChange={e => updateSection(index, { textColor: e.target.value })}
                                          className="w-7 h-7 rounded cursor-pointer border border-white/20 bg-transparent p-0.5 flex-shrink-0"
                                        />
                                        <input
                                          type="text"
                                          value={section.textColor || ''}
                                          onChange={e => updateSection(index, { textColor: e.target.value || undefined })}
                                          className="flex-1 min-w-0 px-1.5 py-1 bg-white/5 border border-white/10 rounded text-white text-[11px] font-mono focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20"
                                          placeholder="default"
                                        />
                                      </div>
                                    </div>
                                    {!['gallery', 'image-block', 'code-block'].includes(section.type) ? (
                                      <div>
                                        <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-wider">Accent</label>
                                        <div className="flex items-center gap-1.5">
                                          <input
                                            type="color"
                                            value={section.buttonColor || '#5c5cf0'}
                                            onChange={e => updateSection(index, { buttonColor: e.target.value })}
                                            className="w-7 h-7 rounded cursor-pointer border border-white/20 bg-transparent p-0.5 flex-shrink-0"
                                          />
                                          <input
                                            type="text"
                                            value={section.buttonColor || ''}
                                            onChange={e => updateSection(index, { buttonColor: e.target.value || undefined })}
                                            className="flex-1 min-w-0 px-1.5 py-1 bg-white/5 border border-white/10 rounded text-white text-[11px] font-mono focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20"
                                            placeholder="default"
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <div />
                                    )}
                                  </div>
                                  {(section.backgroundColor || section.textColor || section.buttonColor || section.backgroundGradient) && (
                                    <button
                                      onClick={() => updateSection(index, { backgroundColor: undefined, textColor: undefined, buttonColor: undefined, backgroundGradient: undefined })}
                                      className="mt-2 text-[11px] text-white/30 hover:text-red-400 transition-colors"
                                    >
                                      Reset to defaults
                                    </button>
                                  )}
                                </div>
                              )}

                            </div>
                          )}
                        </div>
                          )}
                        </SortableSectionItem>
                      );
                    })}
                  </div>
                    </SortableContext>
                  </DndContext>

                  {/* Add Block button */}
                  <button
                    onClick={() => setShowAddBlock(true)}
                    className="w-full py-2.5 rounded-lg border border-dashed border-white/20 text-white/50 hover:border-[#00ffff]/50 hover:text-[#00ffff] transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Block
                  </button>

                  {/* Save button at bottom for convenience */}
                  {isDirty && (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#00ffff]/30 transition-all"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black/80 rounded-full animate-spin" />
                          Saving & refreshing preview…
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save & Refresh Preview
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Add Block Modal */}
            {showAddBlock && (
              <>
                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10"
                  onClick={() => setShowAddBlock(false)}
                />
                <div className="absolute inset-x-0 bottom-0 bg-[#0a0a0a] border border-white/10 rounded-t-2xl z-20 max-h-[80%] flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h3 className="text-base font-bold text-white">Add a Block</h3>
                    <button onClick={() => setShowAddBlock(false)} className="text-white/40 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="overflow-y-auto p-4 grid grid-cols-2 gap-2">
                    {BLOCK_TYPES.map(({ type, label, description, icon }) => (
                      <button
                        key={type}
                        onClick={() => addSection(type)}
                        className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:border-[#00ffff]/40 hover:bg-[#00ffff]/5 transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#00ffff]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00ffff]/20">
                          <svg className="w-4 h-4 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-[#00ffff] transition-colors">{label}</p>
                          <p className="text-[11px] text-white/40 leading-snug mt-0.5">{description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Send Test Email Modal */}
            {showSendModal && (
              <>
                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 animate-in fade-in duration-200"
                  onClick={() => { setShowSendModal(false); setSendResult(null); }}
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff80] flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        Send Test Email
                      </h3>
                      <button
                        onClick={() => { setShowSendModal(false); setSendResult(null); }}
                        className="text-white/40 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-sm text-white/60 mb-4">
                      Send a preview of this email to any inbox to see how it looks.
                    </p>

                    {/* Result Banner */}
                    {sendResult && (
                      <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${sendResult.success ? 'bg-[#00ff80]/10 border border-[#00ff80]/30 text-[#00ff80]' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                        {sendResult.message}
                        {sendResult.isUpgradeError && (
                          <>
                            {' '}
                            <Link href="/#pricing" className="underline font-semibold text-red-300 hover:text-white transition-colors">
                              Upgrade to Professional →
                            </Link>
                          </>
                        )}
                      </div>
                    )}

                    {/* Email Input */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Recipient email address</label>
                      <input
                        type="email"
                        value={sendToEmail}
                        onChange={(e) => setSendToEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !sending) handleSendTestEmail(); }}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00ffff] text-sm"
                        disabled={sending}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setShowSendModal(false); setSendResult(null); }}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm font-medium"
                        disabled={sending}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendTestEmail}
                        disabled={sending || !sendToEmail.trim()}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00ffff] to-[#00ff80] text-black font-semibold text-sm hover:shadow-lg hover:shadow-[#00ffff]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Send Email'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Verify Email Modal */}
            {showVerifyModal && editedEmail && defaultColors && (
              <EmailVerifyModal
                email={editedEmail}
                colors={defaultColors}
                htmlCode={email?.html_code ?? null}
                onClose={() => setShowVerifyModal(false)}
              />
            )}

            {upgradeModalMessage && (
              <UpgradeModal message={upgradeModalMessage} onClose={() => setUpgradeModalMessage(null)} />
            )}

            {/* AI Chat Panel - OVERLAY */}
            {aiChatOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 animate-in fade-in duration-300"
                  onClick={() => { if (!aiLoading) setAiChatOpen(false); }}
                />
                
                {/* AI Chat Overlay */}
                <div className="absolute inset-0 bg-black border-l border-white/10 z-20 animate-in slide-in-from-right duration-300">
                  <div className="h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] flex items-center justify-center">
                            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          AI Assistant
                        </h3>
                        <button 
                          onClick={() => { if (!aiLoading) setAiChatOpen(false); }}
                          className="text-white/40 hover:text-white transition-colors disabled:opacity-30"
                          disabled={aiLoading}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-white/60">
                        Describe any change — AI will rewrite the content across the whole email.
                      </p>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Welcome message (shown only before any messages) */}
                      {aiHistory.length === 0 && (
                        <>
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <p className="text-sm text-white mb-2">
                                  Hi! Tell me how to improve your email. Try:
                                </p>
                                <ul className="space-y-1 text-xs text-white/70">
                                  <li>• Make the tone more casual</li>
                                  <li>• Shorten the content</li>
                                  <li>• Add urgency to the CTA</li>
                                  <li>• Rewrite for enterprise buyers</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Quick suggestions */}
                          <div className="space-y-2">
                            <p className="text-xs text-white/40 font-medium">Quick suggestions:</p>
                            {[
                              'Make it more professional',
                              'Make the CTA more urgent',
                              'Shorten all sections',
                              'Rewrite for a younger audience',
                            ].map((suggestion, i) => (
                              <button
                                key={i}
                                disabled={aiLoading}
                                onClick={() => {
                                  setAiMessage(suggestion);
                                  setTimeout(() => aiInputRef.current?.focus(), 50);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#00ffff]/50 transition-all text-sm text-white/70 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Chat history */}
                      {aiHistory.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          {msg.role === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            msg.role === 'user'
                              ? 'bg-[#00ffff]/10 border border-[#00ffff]/20 text-white ml-auto'
                              : msg.isUpgradeError
                              ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                              : 'bg-white/5 border border-white/10 text-white/90'
                          }`}>
                            {msg.content}
                            {msg.isUpgradeError && (
                              <>
                                {' '}
                                <Link href="/#pricing" className="underline font-semibold text-red-200 hover:text-white transition-colors">
                                  Upgrade to Professional →
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Loading indicator */}
                      {aiLoading && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] flex items-center justify-center flex-shrink-0 animate-pulse">
                            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff] animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff] animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff] animate-bounce [animation-delay:300ms]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-white/10">
                      {aiEditLocked ? (
                        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300">
                          You've used all your free AI actions this month —{' '}
                          <Link href="/#pricing" className="underline font-semibold text-red-200 hover:text-white transition-colors">
                            upgrade to Professional
                          </Link>{' '}
                          for unlimited use.
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            ref={aiInputRef}
                            type="text"
                            value={aiMessage}
                            onChange={(e) => setAiMessage(e.target.value)}
                            placeholder="Describe what to change..."
                            disabled={aiLoading}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] text-sm disabled:opacity-50"
                            onKeyDown={async (e) => {
                              if (e.key === 'Enter' && aiMessage.trim() && !aiLoading) {
                                await handleAiEdit();
                              }
                            }}
                          />
                          <button
                            disabled={!aiMessage.trim() || aiLoading}
                            onClick={handleAiEdit}
                            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black font-medium hover:shadow-lg hover:shadow-[#00ffff]/50 transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                          >
                            {aiLoading ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Preview Panel - RIGHT (2/3 width) */}
          <div className="lg:col-span-2 relative">
            <div className="h-[calc(100vh-73px)] overflow-y-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Live Preview</h3>
                    {previewing && (
                      <span className="flex items-center gap-1 text-xs text-cyan-400 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                        Updating…
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">Click a section in the preview to jump to it</p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/10">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                      previewMode === 'desktop'
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                      previewMode === 'mobile'
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Mobile
                  </button>
                </div>
              </div>

              <div className={`mx-auto transition-all duration-300 ${
                previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
              }`}>
                {email.html_code ? (
                  previewMode === 'desktop' ? (
                    // Desktop: browser chrome frame
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#1c1c1e]">
                      {/* Chrome bar */}
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.07] bg-[#2a2a2d]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="flex-1 mx-3">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1c1c1e] rounded-md border border-white/[0.07]">
                            <svg className="w-3 h-3 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[11px] text-white/30 truncate">Email Preview</span>
                          </div>
                        </div>
                        {previewing && (
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin flex-shrink-0" />
                        )}
                      </div>
                      <iframe
                        ref={iframeRef}
                        key={previewKey}
                        srcDoc={livePreviewHtml ?? email.html_code}
                        title="Email Preview"
                        className="w-full border-0 block"
                        style={{ height: '700px' }}
                        sandbox="allow-same-origin allow-scripts"
                        onLoad={handleIframeLoad}
                      />
                    </div>
                  ) : (
                    // Mobile: iPhone 15 Pro frame
                    <div className="mx-auto select-none" style={{ width: '390px' }}>
                      {/* Outer shell */}
                      <div className="relative rounded-[3rem] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_80px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)]" style={{ padding: '14px' }}>

                        {/* Side buttons — volume up */}
                        <div className="absolute rounded-l-sm bg-[#2e2e2e]" style={{ left: '-3px', top: '108px', width: '3px', height: '32px' }} />
                        {/* Side buttons — volume down */}
                        <div className="absolute rounded-l-sm bg-[#2e2e2e]" style={{ left: '-3px', top: '152px', width: '3px', height: '32px' }} />
                        {/* Side buttons — action button */}
                        <div className="absolute rounded-l-sm bg-[#2e2e2e]" style={{ left: '-3px', top: '72px', width: '3px', height: '24px' }} />
                        {/* Side buttons — power/lock */}
                        <div className="absolute rounded-r-sm bg-[#2e2e2e]" style={{ right: '-3px', top: '120px', width: '3px', height: '56px' }} />

                        {/* Inner screen bezel */}
                        <div className="rounded-[2.4rem] overflow-hidden bg-black relative" style={{ height: '814px' }}>

                          {/* Status bar */}
                          <div className="flex items-center justify-between bg-black px-6 pt-3 pb-1" style={{ height: '50px' }}>
                            <span className="text-white text-xs font-semibold" style={{ fontSize: '13px' }}>9:41</span>
                            {/* Dynamic Island */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-3 bg-black rounded-full z-10 flex items-center justify-center gap-2" style={{ width: '120px', height: '34px', boxShadow: '0 0 0 1px rgba(255,255,255,0.08)' }}>
                              {/* Camera dot */}
                              <div className="rounded-full bg-[#1c1c1e]" style={{ width: '11px', height: '11px' }} />
                              {/* FaceID sensors */}
                              <div className="rounded-full bg-[#2a2a2c]" style={{ width: '8px', height: '8px' }} />
                            </div>
                            {/* Status icons */}
                            <div className="flex items-center gap-1.5">
                              {/* Signal */}
                              <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
                                <rect x="0" y="7" width="3" height="5" rx="0.5" opacity="0.4"/>
                                <rect x="4.5" y="5" width="3" height="7" rx="0.5" opacity="0.6"/>
                                <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" opacity="0.8"/>
                                <rect x="13.5" y="0" width="3" height="12" rx="0.5"/>
                              </svg>
                              {/* WiFi */}
                              <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
                                <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
                                <path d="M3.5 6.5a6.5 6.5 0 019 0" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                                <path d="M1 4A9.8 9.8 0 0115 4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3"/>
                              </svg>
                              {/* Battery */}
                              <div className="flex items-center gap-0.5">
                                <div className="rounded-sm border border-white/70 relative flex items-center" style={{ width: '24px', height: '12px', padding: '2px' }}>
                                  <div className="bg-white rounded-sm h-full" style={{ width: '70%' }} />
                                </div>
                                <div className="rounded-r-sm bg-white/50" style={{ width: '2px', height: '5px' }} />
                              </div>
                            </div>
                          </div>

                          {/* Scrollable email content */}
                          <div className="overflow-hidden" style={{ height: '764px' }}>
                            <iframe
                              ref={iframeRef}
                              key={previewKey}
                              srcDoc={livePreviewHtml ?? email.html_code}
                              title="Email Preview"
                              className="w-full border-0 block"
                              style={{ height: '764px' }}
                              sandbox="allow-same-origin allow-scripts"
                              onLoad={handleIframeLoad}
                            />
                          </div>

                          {/* Home indicator */}
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                            <div className="rounded-full bg-white/40" style={{ width: '120px', height: '4px' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  // Fallback: manual render from JSON
                  <div className="bg-white rounded-lg overflow-hidden shadow-2xl border-4 border-black">
                    <div className="p-8 space-y-6">
                      <div className="text-xs text-gray-500 border-b border-gray-200 pb-4">
                        <div className="font-bold text-gray-900 mb-1">{emailContent.subject}</div>
                        <div>{emailContent.previewText}</div>
                      </div>
                      {emailContent.sections.map((section, index) => (
                        <div key={index} className="space-y-3">
                          {section.type === 'hero' && (
                            <div className="text-center">
                              {section.imageUrl && <img src={section.imageUrl} alt={section.imageAlt} className="w-full mb-4 rounded" />}
                              {section.heading && <h1 className="text-3xl font-black text-gray-900 mb-2">{section.heading}</h1>}
                              {section.subheading && <p className="text-lg text-gray-600">{section.subheading}</p>}
                            </div>
                          )}
                          {section.type === 'content' && (
                            <div>
                              {section.heading && <h2 className="text-2xl font-black text-gray-900 mb-2">{section.heading}</h2>}
                              {section.text && <p className="text-gray-700 leading-relaxed">{section.text}</p>}
                            </div>
                          )}
                          {section.type === 'cta' && (
                            <div className="text-center py-6">
                              {section.heading && <h3 className="text-xl font-black text-gray-900 mb-2">{section.heading}</h3>}
                              {section.text && <p className="text-gray-600 mb-4">{section.text}</p>}
                              {section.buttonText && (
                                <a href={section.buttonUrl || '#'} className="inline-block px-8 py-4 bg-black text-white font-bold text-lg rounded">
                                  {section.buttonText}
                                </a>
                              )}
                            </div>
                          )}
                          {section.type === 'footer' && (
                            <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                              {section.text && <p>{section.text}</p>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
