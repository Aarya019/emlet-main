'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { EmailGeneration } from '@/lib/db/types';
import type { GeneratedEmail, EmailSection } from '@/lib/ai/gemini';
import ImageUploadInput from '@/components/ImageUploadInput';

interface EmailEditorProps {
  emailId: string;
}

export default function EmailEditor({ emailId }: EmailEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<EmailGeneration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Editor state
  const [editedEmail, setEditedEmail] = useState<GeneratedEmail | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendToEmail, setSendToEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [defaultColors, setDefaultColors] = useState<{ bodyBg: string; bodyColor: string; primaryColor: string; secondaryColor: string } | null>(null);

  // Live preview state
  const [livePreviewHtml, setLivePreviewHtml] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const previewDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewAbortRef = useRef<AbortController | null>(null);

  const BLOCK_TYPES: Array<{ type: EmailSection['type']; label: string; description: string; icon: string }> = [
    { type: 'hero',          label: 'Hero',          description: 'Large banner with heading & image',   icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { type: 'content',       label: 'Content',       description: 'Heading + body text block',           icon: 'M4 6h16M4 12h16M4 18h7' },
    { type: 'cta',           label: 'Call to Action', description: 'Heading, text & button',             icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5' },
    { type: 'announcement',  label: 'Announcement',  description: 'Highlighted notice or alert',         icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.952 9.168-5v14c-1.543-3.048-5.068-5-9.168-5H7a3.988 3.988 0 01-1.564-.317z' },
    { type: 'image-text',    label: 'Image + Text',  description: 'Side-by-side image and copy',        icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
    { type: 'feature-list',  label: 'Feature List',  description: 'Icon + title + description rows',    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { type: 'testimonial',   label: 'Testimonial',   description: 'Quote with author attribution',      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { type: 'stats',         label: 'Stats',         description: 'Key numbers / metrics',              icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { type: 'gallery',       label: 'Gallery',       description: 'Grid of images',                     icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
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
    hero:          { heading: 'Welcome', subheading: 'Your subtitle here', text: '' },
    content:       { heading: 'Section Heading', text: 'Your content goes here.' },
    cta:           { heading: 'Take Action', text: 'Convince them to click.', buttonText: 'Get Started', buttonUrl: 'https://' },
    announcement:  { heading: 'Important Update', text: 'Details of your announcement here.' },
    'image-text':  { heading: 'Feature Title', text: 'Describe the feature.', imageUrl: '', imagePosition: 'left' },
    'feature-list': { heading: 'Our Features', features: [{ title: 'Feature 1', description: 'Description here.' }] },
    testimonial:   { quote: 'This product changed my life.', author: 'Jane Doe', authorTitle: 'CEO, Acme Inc.' },
    stats:         { heading: 'By the Numbers', stats: [{ value: '1,000+', label: 'Customers' }, { value: '99%', label: 'Satisfaction' }] },
    gallery:       { heading: 'Gallery', images: [{ url: '', alt: 'Image 1' }, { url: '', alt: 'Image 2' }] },
    'pricing-table': { heading: 'Pricing', plans: [{ name: 'Pro', price: '$29', period: '/mo', features: ['Feature A', 'Feature B'], buttonText: 'Start Free Trial' }] },
    coupon:        { heading: 'Special Offer', text: 'Use this code at checkout.', code: 'SAVE20', expiryText: 'Expires soon' },
    columns:       { columns: [{ heading: 'Column 1', text: 'Content here.' }, { heading: 'Column 2', text: 'Content here.' }] },
    'social-links': { text: 'Follow us on social media', socialLinks: [{ platform: 'Twitter', url: 'https://' }, { platform: 'Instagram', url: 'https://' }] },
    header:        { logoUrl: '', logoAlt: 'Logo', tagline: '' },
    footer:        { text: 'You received this email because you subscribed. Unsubscribe.' },
    divider:       {},
    quote:         { text: 'A memorable insight or statement that stands on its own.', author: 'Author Name', authorTitle: 'Title, Company' },
    'code-block':  { heading: 'Code Example', text: 'console.log("Hello, world!");', language: 'javascript', subheading: 'Caption or explanation of the code.' },
  };

  useEffect(() => {
    loadEmail();
  }, [emailId]);

  // Sync editedEmail when email loads (only on first load), seeding section colors from brand defaults
  useEffect(() => {
    if (email && !editedEmail && defaultColors) {
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
    }
  }, [email, editedEmail, defaultColors]);

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

  const deleteSection = useCallback((index: number) => {
    setEditedEmail(prev => {
      if (!prev) return prev;
      return { ...prev, sections: prev.sections.filter((_, i) => i !== index) };
    });
    setCollapsedSections(prev => {
      const next = new Set<number>();
      prev.forEach(i => { if (i < index) next.add(i); else if (i > index) next.add(i - 1); });
      return next;
    });
    setIsDirty(true);
  }, []);

  const moveSection = useCallback((index: number, direction: 'up' | 'down') => {
    setEditedEmail(prev => {
      if (!prev) return prev;
      const sections = [...prev.sections];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= sections.length) return prev;
      [sections[index], sections[swapIndex]] = [sections[swapIndex], sections[index]];
      return { ...prev, sections };
    });
    setIsDirty(true);
  }, []);

  const toggleCollapse = useCallback((index: number) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }, []);

  const addSection = useCallback((type: EmailSection['type']) => {
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
    setEditedEmail(JSON.parse(JSON.stringify(email.content_json)) as GeneratedEmail);
    setIsDirty(false);
  }, [email]);

  const handleSave = async () => {
    if (!editedEmail) return;
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
        return;
      }
      const data = await res.json();
      setEmail(data.generation);
      setPreviewKey(k => k + 1);
      setIsDirty(false);
    } catch (err) {
      console.error('Save error:', err);
      setSaveError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const copyHtml = () => {
    if (!email?.html_code) return;
    navigator.clipboard.writeText(email.html_code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSendTestEmail = async () => {
    if (!sendToEmail.trim() || !email) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: email.id, toEmail: sendToEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendResult({ success: false, message: data.error || 'Failed to send' });
      } else {
        setSendResult({ success: true, message: `Sent! Check your inbox at ${sendToEmail.trim()}` });
      }
    } catch {
      setSendResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const emailContent = email?.content_json as GeneratedEmail | null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  if (error || !email || !emailContent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-red-300 mb-6">{error || 'Email not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 rounded-full bg-white text-black font-medium hover:shadow-xl transition-all"
          >
            Back to Dashboard
          </button>
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
                onClick={() => router.push('/dashboard')}
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
              {saveError && (
                <span className="text-red-400 text-xs">{saveError}</span>
              )}
              <div className="relative">
                <button
                  disabled
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00ffff]/40 to-[#00ff00]/40 text-black/60 text-sm font-bold flex items-center gap-2 cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Edit with AI
                </button>
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-black leading-none whitespace-nowrap">
                  Coming soon
                </span>
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
                onClick={() => {
                  setSendResult(null);
                  setSendToEmail('');
                  setShowSendModal(true);
                }}
                disabled={!email.html_code}
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
          
          {/* Preview Panel - LEFT (2/3 width) */}
          <div className="lg:col-span-2 border-r border-white/10">
            <div className="h-[calc(100vh-73px)] overflow-y-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white mb-1">Live Preview</h3>
                    {previewing && (
                      <span className="flex items-center gap-1 text-xs text-cyan-400 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                        Updating…
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60">See how your email looks</p>
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
                  // Use generated HTML for accurate design-style preview
                  <div className="rounded-lg overflow-hidden shadow-2xl border border-white/20">
                    <iframe
                      key={previewKey}
                      srcDoc={livePreviewHtml ?? email.html_code}
                      title="Email Preview"
                      className="w-full border-0"
                      style={{ height: '700px' }}
                      sandbox="allow-same-origin"
                    />
                  </div>
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

          {/* Editor Panel - RIGHT (1/3 width) */}
          <div className="lg:col-span-1 relative">
            <div className="h-[calc(100vh-73px)] overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Content Editor</h2>
                  <p className="text-sm text-white/60">
                    {isDirty ? (
                      <span className="text-yellow-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
                        Unsaved changes
                      </span>
                    ) : 'All changes saved'}
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

                  {/* Sections */}
                  <div className="space-y-3">
                    {editedEmail.sections.map((section, index) => {
                      const isCollapsed = collapsedSections.has(index);
                      const canMoveUp = index > 0;
                      const canMoveDown = index < editedEmail.sections.length - 1;
                      return (
                        <div key={index} className="group rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-all">
                          {/* Section header */}
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer select-none"
                            onClick={() => toggleCollapse(index)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded bg-[#00ffff]/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-[#00ffff]">{index + 1}</span>
                              </div>
                              <span className="text-xs font-bold text-white/60 uppercase tracking-wide">{section.type}</span>
                              {section.heading && (
                                <span className="text-xs text-white/30 truncate max-w-[100px]">{section.heading}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                              <button
                                disabled={!canMoveUp}
                                onClick={() => moveSection(index, 'up')}
                                className="p-1.5 rounded text-white/30 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                disabled={!canMoveDown}
                                onClick={() => moveSection(index, 'down')}
                                className="p-1.5 rounded text-white/30 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteSection(index)}
                                className="p-1.5 rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                title="Delete section"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                              <svg
                                className={`w-3.5 h-3.5 text-white/30 ml-1 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>

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
                              {section.text !== undefined && (
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

                              {/* ── image-text: position toggle ── */}
                              {section.type === 'image-text' && (
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
                                      <input type="text" value={stat.value} onChange={e => { const s = (section.stats || []).map((x, i) => i === si ? { ...x, value: e.target.value } : x); updateSection(index, { stats: s }); }}
                                        className="w-1/3 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="99%" />
                                      <input type="text" value={stat.label} onChange={e => { const s = (section.stats || []).map((x, i) => i === si ? { ...x, label: e.target.value } : x); updateSection(index, { stats: s }); }}
                                        className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Label" />
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
                                        <input type="text" value={feat.title} onChange={e => { const f = (section.features || []).map((x, i) => i === fi ? { ...x, title: e.target.value } : x); updateSection(index, { features: f }); }}
                                          className="flex-1 px-0 py-1 bg-transparent border-0 border-b border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Feature title" />
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
                                      <input type="text" value={plan.buttonText || ''} onChange={e => { const p = (section.plans || []).map((x, i) => i === pi ? { ...x, buttonText: e.target.value } : x); updateSection(index, { plans: p }); }}
                                        className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Button text" />
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
                                        <button onClick={() => updateSection(index, { columns: (section.columns || []).filter((_, i) => i !== ci) })}
                                          className="text-white/30 hover:text-red-400 transition-colors">
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                      </div>
                                      <input type="text" value={col.heading || ''} onChange={e => { const c = (section.columns || []).map((x, i) => i === ci ? { ...x, heading: e.target.value } : x); updateSection(index, { columns: c }); }}
                                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="Column heading" />
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
                                        <input type="text" value={col.buttonUrl || ''} onChange={e => { const c = (section.columns || []).map((x, i) => i === ci ? { ...x, buttonUrl: e.target.value } : x); updateSection(index, { columns: c }); }}
                                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="https://…" />
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
                                        <input type="text" value={link.url} onChange={e => { const sl = (section.socialLinks || []).map((x, i) => i === li ? { ...x, url: e.target.value } : x); updateSection(index, { socialLinks: sl }); }}
                                          className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="https://…" />
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
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ── divider: nothing to edit ── */}
                              {section.type === 'divider' && (
                                <p className="text-xs text-white/30 italic">No editable content for a divider.</p>
                              )}

                              {/* ── footer ── */}
                              {section.type === 'footer' && (
                                <>
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Footer Text</label>
                                    <textarea value={section.text || ''} onChange={e => updateSection(index, { text: e.target.value })} rows={2}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors resize-none placeholder-white/20" placeholder="Company Name · 123 Street, City" />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Unsubscribe URL</label>
                                    <input type="text" value={section.unsubscribeUrl || ''} onChange={e => updateSection(index, { unsubscribeUrl: e.target.value })}
                                      className="w-full px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20" placeholder="https://yourapp.com/unsubscribe" />
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
                                    {section.buttonText !== undefined || ['cta','hero','announcement'].includes(section.type) ? (
                                      <div>
                                        <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-wider">Button</label>
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
                                  {(section.backgroundColor || section.textColor || section.buttonColor) && (
                                    <button
                                      onClick={() => updateSection(index, { backgroundColor: undefined, textColor: undefined, buttonColor: undefined })}
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
                      );
                    })}
                  </div>

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

            {/* AI Chat Panel - OVERLAY */}
            {aiChatOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 animate-in fade-in duration-300"
                  onClick={() => setAiChatOpen(false)}
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
                          onClick={() => setAiChatOpen(false)}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-white/60">
                        Ask AI to modify your email content
                      </p>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Welcome message */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-sm text-white mb-2">
                              Hi! I can help you edit your email. Try asking me to:
                            </p>
                            <ul className="space-y-1 text-xs text-white/70">
                              <li>• Make the tone more casual</li>
                              <li>• Shorten the content</li>
                              <li>• Add urgency to the CTA</li>
                              <li>• Change the hero heading</li>
                            </ul>
                          </div>
                          <p className="text-xs text-white/40 mt-1">Just now</p>
                        </div>
                      </div>

                      {/* Quick suggestions */}
                      <div className="space-y-2">
                        <p className="text-xs text-white/40 font-medium">Quick suggestions:</p>
                        {[
                          'Make it more professional',
                          'Add a discount code section',
                          'Shorten the hero text',
                          'Make CTA more urgent'
                        ].map((suggestion, i) => (
                          <button
                            key={i}
                            className="w-full text-left px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#00ffff]/50 transition-all text-sm text-white/70 hover:text-white"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={aiMessage}
                          onChange={(e) => setAiMessage(e.target.value)}
                          placeholder="Ask AI to modify your email..."
                          className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && aiMessage.trim()) {
                              console.log('Send:', aiMessage);
                            }
                          }}
                        />
                        <button className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black font-medium hover:shadow-lg hover:shadow-[#00ffff]/50 transition-all flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
