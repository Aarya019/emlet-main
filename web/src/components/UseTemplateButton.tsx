'use client';

import { useActionState } from 'react';
import { startTemplate, type StartTemplateState } from '@/app/actions/templates';
import SubmitButton from '@/components/SubmitButton';

/** The one call to action on a template page. Works without JavaScript (plain form post). */
export default function UseTemplateButton({ slug }: { slug: string }) {
  const [state, formAction] = useActionState<StartTemplateState, FormData>(startTemplate, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="slug" value={slug} />
      <SubmitButton
        pendingText="Opening in the editor..."
        className="w-full px-6 py-3.5 rounded-xl bg-[#00ffff] text-black font-bold text-sm hover:shadow-lg hover:shadow-[#00ffff]/30 hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Use this template, free
      </SubmitButton>
      {state?.error && (
        <p role="alert" className="mt-3 text-sm text-red-400">{state.error}</p>
      )}
      <p className="mt-3 text-xs text-white/40 text-center">
        Free account. Opens in the editor in your brand colours, no AI credit used.
      </p>
    </form>
  );
}
