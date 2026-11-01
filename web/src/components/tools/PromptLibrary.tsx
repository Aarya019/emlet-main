'use client';

import { useMemo, useState } from 'react';
import CopyButton from '@/components/tools/CopyButton';
import { buttonClass, inputClass, primaryButtonClass } from '@/components/tools/ui';
import {
  EMAIL_PROMPTS,
  PROMPT_CATEGORIES,
  countPlaceholders,
  promptsMatching,
  type EmailPrompt,
} from '@/lib/tools/prompt-library';
import { startGenerating } from '@/lib/start-generating';

const categoryLabel = (id: string) => PROMPT_CATEGORIES.find((c) => c.id === id)?.label ?? id;

/** The prompt text with its [bracketed] gaps picked out, so it is obvious what to replace. */
function Highlighted({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/g).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="rounded bg-[#00ffff]/10 px-1 text-[#00ffff]">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function PromptCard({ item }: { item: EmailPrompt }) {
  const [text, setText] = useState(item.prompt);
  const [editing, setEditing] = useState(false);
  const gaps = countPlaceholders(text);

  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#00ffff]/60">{categoryLabel(item.category)}</p>
      <h3 className="mb-3 text-lg font-bold leading-snug text-white">{item.title}</h3>

      {editing ? (
        <textarea
          aria-label={`Edit prompt: ${item.title}`}
          className={`${inputClass} mb-3 min-h-[9rem] flex-1 leading-relaxed`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <p className="mb-3 flex-1 text-sm leading-relaxed text-white/65">
          <Highlighted text={text} />
        </p>
      )}

      {gaps > 0 && (
        <p className="mb-3 text-xs text-white/35">
          {gaps} {gaps === 1 ? 'gap' : 'gaps'} in [brackets] to fill in{editing ? '' : '. Press Edit to change them.'}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <CopyButton getText={() => text} label="Copy prompt" />
        <button type="button" className={buttonClass} onClick={() => setEditing((v) => !v)} aria-pressed={editing}>
          {editing ? 'Done' : 'Edit'}
        </button>
        <button type="button" className={primaryButtonClass} onClick={() => void startGenerating(text)}>
          Make this email
        </button>
      </div>
    </article>
  );
}

export default function PromptLibrary() {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const results = useMemo(() => promptsMatching(query, category), [query, category]);

  const chip = (id: string | null, label: string) => (
    <button
      key={id ?? 'all'}
      type="button"
      onClick={() => setCategory(id)}
      aria-pressed={category === id}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        category === id ? 'border-white bg-white text-black' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          aria-label="Search prompts"
          className={`${inputClass} sm:max-w-xs`}
          placeholder="Search, e.g. event, discount, SaaS"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="text-sm text-white/40">
          {results.length} of {EMAIL_PROMPTS.length} prompts
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {chip(null, 'All')}
        {PROMPT_CATEGORIES.map((c) => chip(c.id, c.label))}
      </div>

      {results.length === 0 ? (
        <p className="py-10 text-white/45">No prompts match that. Try a shorter search, or clear the filter.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {results.map((item) => (
            <PromptCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
