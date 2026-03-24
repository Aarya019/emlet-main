import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Ultimate Guide to Email Fonts | Emlet Blog',
  description:
    'Everything you need to know about choosing, embedding, and fallback-stacking fonts in HTML email — client support matrix, recommended stacks, and sizing best practices.',
  openGraph: {
    title: 'The Ultimate Guide to Email Fonts',
    description:
      'Client support matrix, web-safe stacks, Google Fonts embedding, sizing guidelines, and the most common mistakes — all in one place.',
    type: 'article',
    publishedTime: '2026-03-24',
  },
};

// ─── tiny prose helpers ───────────────────────────────────────────────────────

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-4 mt-14 scroll-mt-24">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg sm:text-xl font-bold text-white/90 mb-3 mt-8">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-white/65 leading-relaxed mb-4">{children}</p>;
}

function Callout({ type = 'tip', children }: { type?: 'tip' | 'warning' | 'info'; children: React.ReactNode }) {
  const styles = {
    tip: 'bg-[#00ffff]/5 border-[#00ffff]/30 text-[#00ffff]/80',
    warning: 'bg-yellow-400/5 border-yellow-400/30 text-yellow-400/80',
    info: 'bg-white/5 border-white/15 text-white/60',
  };
  const labels = { tip: '💡 Tip', warning: '⚠️ Watch out', info: 'ℹ️ Note' };
  return (
    <div className={`rounded-xl border px-5 py-4 my-6 text-sm leading-relaxed ${styles[type]}`}>
      <span className="font-bold block mb-1">{labels[type]}</span>
      {children}
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code className="bg-white/8 text-[#00ffff] text-[0.82em] px-1.5 py-0.5 rounded font-mono">
      {children}
    </code>
  );
}

function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-white/10">
      {label && (
        <div className="bg-white/5 border-b border-white/10 px-4 py-2 text-xs text-white/40 font-mono">
          {label}
        </div>
      )}
      <pre className="bg-[#0a0a0a] overflow-x-auto px-5 py-4 text-sm text-white/75 font-mono leading-relaxed whitespace-pre">
        {children}
      </pre>
    </div>
  );
}

function TableRow({ cells, header }: { cells: string[]; header?: boolean }) {
  const Tag = header ? 'th' : 'td';
  return (
    <tr className={header ? 'bg-white/5' : 'border-t border-white/8 hover:bg-white/3 transition-colors'}>
      {cells.map((cell, i) => (
        <Tag
          key={i}
          className={`px-4 py-3 text-sm text-left ${header ? 'text-white/50 font-semibold uppercase tracking-wide text-xs' : 'text-white/65'
            }`}
        >
          {cell}
        </Tag>
      ))}
    </tr>
  );
}

function SupportBadge({ level }: { level: 'full' | 'partial' | 'none' }) {
  const config = {
    full: { label: '✓ Full', cls: 'text-emerald-400 bg-emerald-400/10' },
    partial: { label: '~ Partial', cls: 'text-yellow-400 bg-yellow-400/10' },
    none: { label: '✗ None', cls: 'text-red-400 bg-red-400/10' },
  };
  const { label, cls } = config[level];
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

// ─── Table of contents ────────────────────────────────────────────────────────

const TOC = [
  { id: 'why-fonts-matter', label: 'Why fonts matter in email' },
  { id: 'web-safe-fonts', label: 'Web-safe fonts: the safe foundation' },
  { id: 'custom-fonts', label: 'Custom & Google Fonts via @font-face' },
  { id: 'client-support', label: 'Client-by-client support matrix' },
  { id: 'font-stacks', label: 'Recommended font stacks' },
  { id: 'sizing', label: 'Font sizing & line-height guidelines' },
  { id: 'weight-spacing', label: 'Weight, style & letter-spacing' },
  { id: 'accessibility', label: 'Readability & accessibility' },
  { id: 'mistakes', label: '8 common mistakes to avoid' },
  { id: 'cheat-sheet', label: 'Quick-reference cheat sheet' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmailFontsGuide() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center px-4 py-3 md:grid-cols-3 md:px-6 md:py-4">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Emlet" className="h-7 w-auto md:h-8" />
          </Link>
          <nav className="hidden items-center justify-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/pricing" className="transition-colors hover:text-white">Pricing</Link>
            <Link href="/#features" className="transition-colors hover:text-white">Features</Link>
            <Link href="/blog" className="transition-colors hover:text-white">Blog</Link>
          </nav>
          <div className="flex items-center justify-end gap-3">
            <Link href="/sign-in" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-all hover:border-[#00ffff] hover:text-[#00ffff]">
              Sign in
            </Link>
            <Link href="/sign-up" className="hidden sm:block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-px">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Article layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:grid lg:grid-cols-[1fr_260px] lg:gap-16">

        {/* Main content */}
        <article className="min-w-0">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
            <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#00ffff]/60">Design</span>
          </div>

          {/* Title block */}
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-4">
              Design · 12 min read
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              The Ultimate Guide to Email Fonts
            </h1>
            <p className="text-white/50 text-lg sm:text-xl leading-relaxed max-w-2xl">
              Everything you need to know about choosing, embedding, and fallback-stacking fonts in HTML email —
              from web-safe classics to Google Fonts, with a full client support matrix.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-white/30">
              <span>March 24, 2026</span>
              <span>·</span>
              <span>By the Emlet Team</span>
            </div>
          </div>

          {/* Intro */}
          <P>
            Typography is one of the most powerful tools in an email designer&apos;s kit.
            The right font makes copy feel trustworthy, premium, or playful — and{' '}
            <strong className="text-white/85">the wrong font choice</strong>, or a missing fallback, can
            turn a polished campaign into a wall of Times New Roman.
          </P>
          <P>
            The challenge? Email clients are not browsers. The same CSS rules that work perfectly
            on your website may be stripped, ignored, or overridden the moment your email hits a Gmail inbox.
            Understanding how fonts work in email is one of the most important — and most frequently
            misunderstood — skills in email development.
          </P>
          <P>
            This guide covers everything: web-safe fonts, custom font embedding via{' '}
            <Code>@font-face</Code>, Google Fonts, the full client support matrix, recommended stacks,
            sizing guidelines, and the eight most common mistakes that silently break your typography.
          </P>

          {/* ── 1 ── */}
          <H2 id="why-fonts-matter">Why fonts matter (differently) in email</H2>

          <P>
            On the web, if a custom font fails to load, the browser shows a flash of invisible or
            unstyled text, then settles on the fallback. Users barely notice.
            In email, the story is different:
          </P>

          <ul className="space-y-3 mb-6 list-none">
            {[
              { title: 'No live reload.', body: 'Once delivered, an email is static. If your font stack has no usable fallback, the recipient sees whatever the email client decides — often Times New Roman.' },
              { title: 'Client rendering diversity.', body: 'Gmail strips most <style> blocks. Outlook for Windows uses Microsoft Word\'s layout engine, which ignores @font-face entirely. Apple Mail renders web fonts beautifully. These clients share the same inbox.' },
              { title: 'Deliverability side-effects.', body: 'Bloated font imports or inline styles add to message weight, which can tip you over limits on some ESPs or cause clipping in Gmail (which clips emails over ~102 KB).' },
              { title: 'Brand perception.', body: 'Typography is a brand signal. A brand that uses Inter or DM Sans on its website but delivers Times New Roman emails signals inconsistency — even if subscribers can\'t articulate why.' },
            ].map(({ title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00ffff]/50 flex-shrink-0" />
                <span className="text-white/65 leading-relaxed">
                  <strong className="text-white/85">{title}</strong> {body}
                </span>
              </li>
            ))}
          </ul>

          <P>
            The good news: with the right font stack strategy, your email looks great on every client —
            custom font where supported, a well-chosen fallback everywhere else.
          </P>

          {/* ── 2 ── */}
          <H2 id="web-safe-fonts">Web-safe fonts: the reliable foundation</H2>

          <P>
            Web-safe fonts are typefaces that ship pre-installed on virtually every operating system —
            Windows, macOS, Linux, iOS, and Android. Because they live on the device, no downloading is
            needed and they render identically across every email client.
          </P>
          <P>
            You should always end your font stack with a web-safe font. No exceptions.
          </P>

          <H3>Sans-serif</H3>
          <div className="overflow-x-auto rounded-xl border border-white/10 mb-6">
            <table className="w-full">
              <thead>
                <TableRow header cells={['Font', 'Best for', 'Notes']} />
              </thead>
              <tbody>
                <TableRow cells={['Arial', 'Body text, UI-style emails', 'The de-facto standard. Neutral, legible at any size.']} />
                <TableRow cells={['Helvetica', 'Brand-forward, neutral layouts', 'macOS/iOS default; Arial renders on Windows where Helvetica is absent.']} />
                <TableRow cells={['Verdana', 'Small body text, accessibility', 'Wider letter-spacing aids legibility at small sizes.']} />
                <TableRow cells={['Trebuchet MS', 'Friendly, slightly quirky tone', 'More personality than Arial without being unusual.']} />
                <TableRow cells={['Tahoma', 'Compact UIs, smaller text', 'Slightly narrower than Verdana; good for dense layouts.']} />
                <TableRow cells={['Geneva', 'macOS/iOS only fallback', 'Only include after Verdana in stacks — rare on Windows.']} />
              </tbody>
            </table>
          </div>

          <H3>Serif</H3>
          <div className="overflow-x-auto rounded-xl border border-white/10 mb-6">
            <table className="w-full">
              <thead>
                <TableRow header cells={['Font', 'Best for', 'Notes']} />
              </thead>
              <tbody>
                <TableRow cells={['Georgia', 'Editorial, premium, storytelling', 'High readability on screens. The best web-safe serif by far.']} />
                <TableRow cells={['Times New Roman', 'Avoid as a choice; accept as fallback', 'Email-client default if nothing else matches. Design for its appearance.']} />
                <TableRow cells={['Palatino Linotype', 'Publishing, long-form newsletters', 'Elegant but rarer — use with Georgia as a prior fallback.']} />
              </tbody>
            </table>
          </div>

          <H3>Monospace</H3>
          <div className="overflow-x-auto rounded-xl border border-white/10 mb-6">
            <table className="w-full">
              <thead>
                <TableRow header cells={['Font', 'Best for', 'Notes']} />
              </thead>
              <tbody>
                <TableRow cells={['Courier New', 'Code snippets, dev-focused emails, retro aesthetic', 'Safe everywhere; the standard monospace fallback.']} />
                <TableRow cells={['Courier', 'macOS/iOS variation', 'Virtually identical to Courier New; add it before for macOS users.']} />
              </tbody>
            </table>
          </div>

          <Callout type="tip">
            Georgia is widely considered the finest web-safe serif for screen reading. If your brand uses
            a serif, base your fallback stack around Georgia rather than Times New Roman.
          </Callout>

          {/* ── 3 ── */}
          <H2 id="custom-fonts">Custom & Google Fonts via @font-face</H2>

          <P>
            Custom web fonts bring your brand typography into the inbox — but only where the email
            client allows it. The two common methods are:
          </P>

          <H3>Method 1: Google Fonts via &lt;link&gt; (recommended)</H3>
          <P>
            Place a <Code>&lt;link&gt;</Code> tag inside the <Code>&lt;head&gt;</Code> of your email HTML.
            This is the most reliable method for clients that support remote stylesheets.
          </P>
          <CodeBlock label="email.html">
{`<head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
  />
</head>

<body>
  <p style="font-family: 'Inter', Arial, sans-serif; font-size: 16px;">
    Your email body text here.
  </p>
</body>`}
          </CodeBlock>

          <H3>Method 2: @import inside &lt;style&gt;</H3>
          <P>
            Some email clients support <Code>@import</Code> inside a <Code>&lt;style&gt;</Code> block.
            It is slightly less reliable than <Code>&lt;link&gt;</Code> but useful as a fallback when
            you cannot control the <Code>&lt;head&gt;</Code> tag.
          </P>
          <CodeBlock label="email.html">
{`<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  body {
    font-family: 'Inter', Arial, sans-serif;
  }
</style>`}
          </CodeBlock>

          <H3>Method 3: Self-hosted @font-face</H3>
          <P>
            For brand fonts not on Google Fonts, or when you need offline reliability, host the font
            files yourself and declare them via <Code>@font-face</Code>.
          </P>
          <CodeBlock label="email.html">
{`<style>
  @font-face {
    font-family: 'BrandFont';
    src: url('https://yourdomain.com/fonts/brandfont-regular.woff2') format('woff2'),
         url('https://yourdomain.com/fonts/brandfont-regular.woff')  format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'BrandFont';
    src: url('https://yourdomain.com/fonts/brandfont-bold.woff2') format('woff2'),
         url('https://yourdomain.com/fonts/brandfont-bold.woff')  format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
</style>`}
          </CodeBlock>

          <Callout type="warning">
            Only declare the font weights you actually use. Unused weights still download in clients
            that parse the <Code>@font-face</Code> block, adding unnecessary overhead and increasing
            the chance your email gets clipped by Gmail&apos;s 102 KB limit.
          </Callout>

          <Callout type="info">
            Variable fonts (<Code>.woff2</Code> with a range axis) are not broadly supported in email
            clients. Stick to individual weight files for maximum compatibility.
          </Callout>

          {/* ── 4 ── */}
          <H2 id="client-support">Client-by-client support matrix</H2>

          <P>
            This is the data that saves campaigns. Knowing which clients render custom fonts — and
            which silently fall back — determines how much you invest in custom font polish.
          </P>

          <div className="overflow-x-auto rounded-xl border border-white/10 mb-6">
            <table className="w-full">
              <thead>
                <TableRow header cells={['Email client', 'Market share*', '@font-face', 'Google Fonts <link>', 'Notes']} />
              </thead>
              <tbody>
                <tr className="border-t border-white/8">
                  <td className="px-4 py-3 text-sm text-white/80 font-medium">Apple Mail (macOS)</td>
                  <td className="px-4 py-3 text-sm text-white/55">~11 %</td>
                  <td className="px-4 py-3"><SupportBadge level="full" /></td>
                  <td className="px-4 py-3"><SupportBadge level="full" /></td>
                  <td className="px-4 py-3 text-sm text-white/45">Best custom-font support of any desktop client.</td>
                </tr>
                <tr className="border-t border-white/8 bg-white/1">
                  <td className="px-4 py-3 text-sm text-white/80 font-medium">Apple Mail (iOS)</td>
                  <td className="px-4 py-3 text-sm text-white/55">~28 %</td>
                  <td className="px-4 py-3"><SupportBadge level="full" /></td>
                  <td className="px-4 py-3"><SupportBadge level="full" /></td>
                  <td className="px-4 py-3 text-sm text-white/45">Full support. The largest single client — worth investing in custom fonts.</td>
                </tr>
                <tr className="border-t border-white/8">
                  <td className="px-4 py-3 text-sm text-white/80 font-medium">Gmail (browser)</td>
                  <td className="px-4 py-3 text-sm text-white/55">~26 %</td>
                  <td className="px-4 py-3"><SupportBadge level="none" /></td>
                  <td className="px-4 py-3"><SupportBadge level="none" /></td>
                  <td className="px-4 py-3 text-sm text-white/45">Strips all <code className="text-white/60 text-xs">&lt;style&gt;</code> and external link tags. Fallback font always renders.</td>
                </tr>
                <tr className="border-t border-white/8 bg-white/1">
                  <td className="px-4 py-3 text-sm text-white/80 font-medium">Gmail (Android)</td>
                  <td className="px-4 py-3 text-sm text-white/55">~9 %</td>
                  <td className="px-4 py-3"><SupportBadge level="none" /></td>
                  <td className="px-4 py-3"><SupportBadge level="none" /></td>
                  <td className="px-4 py-3 text-sm text-white/45">Same as Gmail web — no custom font support.</td>
                </tr>
                <tr className="border-t border-white/8">
                  <td className="px-4 py-3 text-sm text-white/80 font-medium">Outlook 2016–2021 (Windows)</td>
                  <td className="px-4 py-3 text-sm text-white/55">~9 %</td>
                  <td className="px-4 py-3"><SupportBadge level="none" /></td>
                  <td className="px-4 py-3"><SupportBadge level="none" /></td>
                  <td className="px-4 py-3 text-sm text-white/45">Uses Word rendering engine. Respects inline <code className="text-white/60 text-xs">font-family</code> only for installed system fonts.</td>
                </tr>
                <tr className="border-t border-white/8 bg-white/1">
                  <td className="px-4 py-3 text-sm text-white/80 font-medium">Outlook for Mac</td>
                  <td className="px-4 py-3 text-sm text-white/55">~4 %</td>
                  <td className="px-4 py-3"><SupportBadge level="partial" /></td>
                  <td className="px-4 py-3"><SupportBadge level="partial" /></td>
                  <td className="px-4 py-3 text-sm text-white/45">Outlook 2019+ for Mac is WebKit-based — respects web fonts. 2011 does not.</td>
                </tr>
                <tr className="border-t border-white/8">
                  <td className="px-4 py-3 text-sm text-white/80 font-medium">Outlook.com (new)</td>
                  <td className="px-4 py-3 text-sm text-white/55">~3 %</td>
                  <td className="px-4 py-3"><SupportBadge level="full" /></td>
                  <td className="px-4 py-3"><SupportBadge level="full" /></td>
                  <td className="px-4 py-3 text-sm text-white/45">The new Outlook.com web client (2023+) has solid web font support.</td>
                </tr>
                <tr className="border-t border-white/8 bg-white/1">
                  <td className="px-4 py-3 text-sm text-white/80 font-medium">Samsung Mail</td>
                  <td className="px-4 py-3 text-sm text-white/55">~3 %</td>
                  <td className="px-4 py-3"><SupportBadge level="full" /></td>
                  <td className="px-4 py-3"><SupportBadge level="full" /></td>
                  <td className="px-4 py-3 text-sm text-white/45">Good support. Renders web fonts reliably.</td>
                </tr>
                <tr className="border-t border-white/8">
                  <td className="px-4 py-3 text-sm text-white/80 font-medium">Yahoo Mail</td>
                  <td className="px-4 py-3 text-sm text-white/55">~3 %</td>
                  <td className="px-4 py-3"><SupportBadge level="none" /></td>
                  <td className="px-4 py-3"><SupportBadge level="none" /></td>
                  <td className="px-4 py-3 text-sm text-white/45">Strips most <code className="text-white/60 text-xs">&lt;style&gt;</code> tags. Fallback renders.</td>
                </tr>
                <tr className="border-t border-white/8 bg-white/1">
                  <td className="px-4 py-3 text-sm text-white/80 font-medium">Thunderbird</td>
                  <td className="px-4 py-3 text-sm text-white/55">&lt; 1 %</td>
                  <td className="px-4 py-3"><SupportBadge level="full" /></td>
                  <td className="px-4 py-3"><SupportBadge level="full" /></td>
                  <td className="px-4 py-3 text-sm text-white/45">Full support — Gecko-based renderer.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-white/30 mb-8 -mt-2">
            * Approximate global market share, 2025–2026. Figures vary significantly by industry and audience.
          </p>

          <Callout type="info">
            A rough rule of thumb: about <strong className="text-white/70">55–60 % of your recipients</strong> will
            see your custom font (Apple Mail + Samsung Mail + supported webmail clients).
            The remaining ~40 % — mostly Gmail and Windows Outlook — will always see the fallback.
            Design your fallback stack to look intentional, not accidental.
          </Callout>

          {/* ── 5 ── */}
          <H2 id="font-stacks">Recommended font stacks</H2>

          <P>
            A font stack is the ordered list you pass to <Code>font-family</Code>. The email client
            tries each font in order, using the first one it can find. The last entry should always
            be a generic family (<Code>serif</Code>, <Code>sans-serif</Code>, or <Code>monospace</Code>)
            so the OS picks a reasonable default if nothing else matches.
          </P>

          <H3>Modern sans-serif (custom + safe fallback)</H3>
          <CodeBlock label="CSS / inline style">
{`font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;`}
          </CodeBlock>
          <P>
            This stack shows <strong className="text-white/80">Inter</strong> on Apple Mail, iOS, and
            Outlook.com (all load the Google Font). On Gmail it falls back to
            <strong className="text-white/80"> Helvetica Neue</strong> (macOS/iOS) or
            <strong className="text-white/80"> Arial</strong> (Windows/Android) — both clean, neutral
            sans-serifs that barely break the design.
          </P>

          <H3>Elegant serif (editorial, storytelling, newsletters)</H3>
          <CodeBlock label="CSS / inline style">
{`font-family: 'Playfair Display', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif;`}
          </CodeBlock>
          <P>
            <strong className="text-white/80">Playfair Display</strong> on supporting clients.
            Georgia on Gmail and Windows Outlook — a graceful serif that still looks intentional.
            Never falls back to bare Times New Roman without a fight.
          </P>

          <H3>Friendly rounded (consumer / lifestyle brands)</H3>
          <CodeBlock label="CSS / inline style">
{`font-family: 'Nunito', 'Trebuchet MS', Verdana, Geneva, Arial, sans-serif;`}
          </CodeBlock>

          <H3>Technical / developer (SaaS, development tools)</H3>
          <CodeBlock label="CSS / inline style">
{`font-family: 'DM Mono', 'Courier New', Courier, monospace;`}
          </CodeBlock>

          <H3>System UI (no external font dependency)</H3>
          <CodeBlock label="CSS / inline style">
{`font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
             Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif;`}
          </CodeBlock>
          <P>
            The system UI stack means subscribers always see the native default sans-serif
            for their OS — SF Pro on Apple, Segoe UI on Windows, Roboto on Android.
            Loads instantly, zero external dependency, always looks clean. A strong default
            choice when custom fonts are not a priority.
          </P>

          <Callout type="tip">
            Use the same font stack everywhere in an email: headings, body, buttons, and footers.
            Switching stacks mid-email creates subtle inconsistency on clients where only the
            first or last name in each stack resolves.
          </Callout>

          {/* ── 6 ── */}
          <H2 id="sizing">Font sizing & line-height guidelines</H2>

          <P>
            Sizing rules for email are stricter than for the web. Email is read on everything from
            a 5-inch phone screen to a 32-inch monitor, often at arm&apos;s length — and you cannot
            rely on the reader zooming in.
          </P>

          <H3>Recommended sizes</H3>
          <div className="overflow-x-auto rounded-xl border border-white/10 mb-6">
            <table className="w-full">
              <thead>
                <TableRow header cells={['Element', 'Minimum', 'Recommended', 'Notes']} />
              </thead>
              <tbody>
                <TableRow cells={['Body / paragraph', '14 px', '15–16 px', 'Use 16 px to prevent iOS auto-zoom on form inputs.']} />
                <TableRow cells={['Caption / legal text', '12 px', '13 px', 'Never go below 11 px — many clients will ignore smaller text.']} />
                <TableRow cells={['CTA button', '15 px', '16–18 px', 'Larger text improves tap target legibility on mobile.']} />
                <TableRow cells={['H3 / sub-heading', '16 px', '18–20 px', 'Just enough to differentiate from body without dominating.']} />
                <TableRow cells={['H2 / section heading', '20 px', '22–28 px', 'Should read clearly at a glance when scanning.']} />
                <TableRow cells={['H1 / hero headline', '28 px', '32–48 px', 'Scale down on mobile (use max-width + fluid sizing).']} />
                <TableRow cells={['Preheader text', '—', '0 px (hidden)', 'Hidden with font-size:0; line-height:0; max-height:0; overflow:hidden.']} />
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            iOS Safari auto-zooms any focusable element (like an <Code>&lt;a&gt;</Code> styled as a
            button) when the page font size is below 16 px. Set the minimum body{' '}
            <Code>font-size</Code> to <Code>16px</Code> in mobile-targeted styles, or set{' '}
            <Code>-webkit-text-size-adjust: 100%</Code> on the <Code>&lt;body&gt;</Code>.
          </Callout>

          <H3>Line height</H3>
          <P>
            Line height is the single most impactful readability setting and is routinely under-used
            in email. Tight line height feels dense and exhausting; too loose feels disconnected.
          </P>
          <div className="overflow-x-auto rounded-xl border border-white/10 mb-6">
            <table className="w-full">
              <thead>
                <TableRow header cells={['Element', 'Value', 'Reasoning']} />
              </thead>
              <tbody>
                <TableRow cells={['Body text', '1.5–1.6', 'The sweet spot for comfortable reading across all screen sizes.']} />
                <TableRow cells={['Headings (H1/H2)', '1.1–1.25', 'Tight but not cramped — keeps multi-line headlines visually tied.']} />
                <TableRow cells={['Sub-headings (H3)', '1.3–1.4', 'Slightly more breathing room than H1/H2.']} />
                <TableRow cells={['CTA buttons', '1.2–1.4', 'Consistent with tap target height; don\'t let text wrap inside a button.']} />
                <TableRow cells={['Legal / caption', '1.4–1.5', 'Small text needs generous spacing to stay readable.']} />
              </tbody>
            </table>
          </div>

          <Callout type="info">
            Outlook for Windows ignores unitless <Code>line-height</Code> values (like{' '}
            <Code>1.5</Code>). Always add a pixel value fallback:{' '}
            <Code>line-height: 1.5; mso-line-height-rule: exactly;</Code> — the{' '}
            <Code>mso-line-height-rule</Code> property prevents Outlook from adding extra spacing
            between lines.
          </Callout>

          {/* ── 7 ── */}
          <H2 id="weight-spacing">Weight, style & letter-spacing</H2>

          <H3>Font weight</H3>
          <P>
            Not all font weights render consistently across email clients, even when the font is loaded.
          </P>
          <ul className="space-y-3 mb-6 list-none">
            {[
              { label: '400 (regular)', note: 'Safe. Universal. Use for body copy.' },
              { label: '700 (bold)', note: 'Safe. Renders as bold in virtually every client.' },
              { label: '500 / 600 (medium / semi-bold)', note: 'Supported in modern clients but Outlook for Windows may round to 400 or 700. If visual accuracy matters, test in Outlook and consider using only 400/700.' },
              { label: '100–300 (thin / light)', note: 'Often too faint on low-contrast screens. Not recommended for body text.' },
              { label: '800–900 (extra-bold / black)', note: 'Useful for impactful hero headlines, but verify the custom font supports this weight before loading it.' },
            ].map(({ label, note }) => (
              <li key={label} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00ffff]/50 flex-shrink-0" />
                <span className="text-white/65 leading-relaxed">
                  <Code>{label}</Code> — {note}
                </span>
              </li>
            ))}
          </ul>

          <H3>Italic</H3>
          <P>
            Italic works reliably in most clients when using web-safe fonts. For custom fonts,
            load the italic variant explicitly via a separate <Code>@font-face</Code> rule with{' '}
            <Code>font-style: italic</Code>. If you don&apos;t, the browser will synthesise an
            italic by slanting the regular variant — which often looks poor.
          </P>

          <H3>Letter-spacing</H3>
          <P>
            <Code>letter-spacing</Code> is widely supported across modern email clients.
            Use it sparingly:
          </P>
          <ul className="space-y-3 mb-6 list-none">
            {[
              'Headings: 0.5–1 px (or -0.5 px to tighten large display text)',
              'Small caps / labels: 1–2 px — greatly improves legibility of all-caps text',
              'Body text: 0 px — extra tracking on small text reduces readability',
              'Never use letter-spacing on preheader / hidden text (breaks reading order in some accessibility tools)',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00ffff]/50 flex-shrink-0" />
                <span className="text-white/65 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {/* ── 8 ── */}
          <H2 id="accessibility">Readability & accessibility</H2>

          <P>
            Email accessibility is often the first thing cut for speed, and the first thing that
            costs you subscribers. The good news: accessible typography is also just better typography.
          </P>

          <H3>Colour contrast</H3>
          <P>
            The WCAG AA standard requires a contrast ratio of at least{' '}
            <strong className="text-white/85">4.5:1</strong> for normal text and{' '}
            <strong className="text-white/85">3:1</strong> for large text (18 px+ or 14 px bold).
            In practice:
          </P>
          <ul className="space-y-3 mb-6 list-none">
            {[
              { label: 'Dark text on white: ', note: '#222 or #333 is safer than #999, which fails AA at any size.' },
              { label: 'Light text on dark: ', note: 'White (#fff) on a mid-dark background (#444 or below) typically passes. Off-white (e.g. #e5e5e5) on pure black can feel harsh — try #d0d0d0 for a softer pairing.' },
              { label: 'Coloured text: ', note: 'Brand colours often fail contrast checks when used for body text. Use them for headings or on appropriately dark/light backgrounds.' },
            ].map(({ label, note }) => (
              <li key={label} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00ffff]/50 flex-shrink-0" />
                <span className="text-white/65 leading-relaxed"><strong className="text-white/80">{label}</strong>{note}</span>
              </li>
            ))}
          </ul>

          <H3>Don&apos;t rely on font style alone to convey meaning</H3>
          <P>
            Screen readers do not announce bold or italic by default. If content is critical — an
            expiry date, a warning — supplement font styling with explicit text (e.g. "Expires:
            March 31" rather than just bolding "March 31").
          </P>

          <H3>Minimum touch target size</H3>
          <P>
            Apple and Google recommend a minimum tap target of <strong className="text-white/85">44 × 44 px</strong>.
            For text links inline in a paragraph, this cannot always be achieved — but CTA buttons
            should always meet this threshold, both in height (via <Code>padding</Code>) and in the
            font size used.
          </P>

          <Callout type="tip">
            Use a tool like <strong className="text-white/80">WebAIM&apos;s Contrast Checker</strong>{' '}
            or <strong className="text-white/80">Squiz Contrast Analyser</strong> while designing
            your email template to catch contrast failures before you send.
          </Callout>

          {/* ── 9 ── */}
          <H2 id="mistakes">8 common font mistakes to avoid</H2>

          {[
            {
              n: '01',
              title: 'No fallback font',
              body: 'Setting font-family to only a custom web font means Gmail users see Times New Roman. Always end every stack with a web-safe font and the generic family.',
            },
            {
              n: '02',
              title: 'Fallback looks nothing like the custom font',
              body: 'Using a decorative display font as primary with Arial as the fallback creates a jarring visual switch for the 40 % who don\'t get the web font. Pick a fallback that has similar proportions: Inter → Helvetica Neue / Arial; Playfair Display → Georgia.',
            },
            {
              n: '03',
              title: 'Loading too many font weights',
              body: 'Google Fonts URLs grow with each weight. &family=Inter:wght@100;200;300;400;500;600;700;800;900 loads nine weights and can add 150–200 KB to the email before the message even begins — triggering Gmail\'s clipping threshold.',
            },
            {
              n: '04',
              title: 'Font size below 14 px for body',
              body: 'Sub-14 px text fails legibility checks on mobile, fails accessibility contrast checks at lower weights, and triggers auto-zoom in iOS Safari. Set a 15–16 px minimum and use font-size-adjust or mso-line-height-rule for Outlook.',
            },
            {
              n: '05',
              title: 'Tight line-height on long copy',
              body: 'A line-height of 1.0–1.2 on body text (not headlines) is tiring to read, especially on mobile. The minimum for comfortable reading is 1.4; 1.5–1.6 is the standard for prose.',
            },
            {
              n: '06',
              title: 'Omitting mso-line-height-rule for Outlook',
              body: 'Outlook for Windows adds extra space between lines by default. Without mso-line-height-rule: exactly, a line-height of 1.5 may render as 2.2 in Outlook, disrupting spacing-dependent layouts.',
            },
            {
              n: '07',
              title: 'Using more than two typefaces',
              body: 'Two fonts maximum: one for headings, one for body (or a single font family with weight variation). More than two creates visual noise and slows load time. The exception: monospace code snippets in dev-focused emails.',
            },
            {
              n: '08',
              title: 'Never testing in Gmail',
              body: 'Because Gmail strips all web fonts and all <style> blocks, it is the most important test environment. If your email looks polished in Gmail with the fallback font, it will look great everywhere. Test in Gmail — both browser and mobile app.',
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-5 mb-7">
              <div className="text-3xl font-black text-white/10 tabular-nums flex-shrink-0 w-10 leading-none mt-0.5">
                {n}
              </div>
              <div>
                <h3 className="text-base font-bold text-white/90 mb-1.5">{title}</h3>
                <p className="text-white/55 leading-relaxed text-sm">{body}</p>
              </div>
            </div>
          ))}

          {/* ── 10 ── */}
          <H2 id="cheat-sheet">Quick-reference cheat sheet</H2>

          <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden mb-10">
            <div className="bg-white/5 px-5 py-3 border-b border-white/10">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Email Font Cheat Sheet</p>
            </div>
            <div className="divide-y divide-white/8">
              {[
                { label: 'Safest sans-serif font', value: 'Arial / Helvetica' },
                { label: 'Safest serif font', value: 'Georgia' },
                { label: 'System UI stack', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" },
                { label: 'Min body font size', value: '15–16 px' },
                { label: 'Min caption font size', value: '12–13 px' },
                { label: 'Hero headline range', value: '32–48 px' },
                { label: 'Body line-height', value: '1.5–1.6' },
                { label: 'Headline line-height', value: '1.1–1.25' },
                { label: 'Safest font weights', value: '400 and 700' },
                { label: 'Max font families per email', value: '2' },
                { label: 'Outlook line-height fix', value: 'mso-line-height-rule: exactly' },
                { label: 'Gmail custom font support', value: 'None — always test the fallback' },
                { label: 'Best-supported custom font source', value: 'Google Fonts via <link> in <head>' },
                { label: 'Gmail 102 KB clipping limit', value: 'Keep HTML under 96 KB to be safe' },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-start px-5 py-3.5 gap-1.5 sm:gap-4">
                  <span className="text-xs text-white/40 sm:w-56 flex-shrink-0">{label}</span>
                  <span className="text-sm text-white/80 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-8 text-center mt-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00ffff]/60 mb-3">Put it into practice</p>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Ship better-looking emails — starting now.
            </h2>
            <p className="text-white/50 mb-6 max-w-md mx-auto leading-relaxed">
              Emlet applies all of these font-stack best practices automatically. Every email it
              generates uses proper fallback stacks, correct sizing, and tested line-heights — across
              Gmail, Outlook, and Apple Mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/sign-up"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-px"
              >
                Generate a free email
              </Link>
              <Link
                href="/blog"
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/70 transition-all hover:border-white/40 hover:text-white"
              >
                More articles
              </Link>
            </div>
          </div>

        </article>

        {/* Sidebar TOC — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
              On this page
            </p>
            <nav className="space-y-1.5">
              {TOC.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block text-sm text-white/40 transition-colors hover:text-white/80 leading-snug"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-8 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Emlet" className="h-6 w-auto" />
          </Link>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link>
          </div>
          <p className="text-xs text-white/20">© 2026 Emlet. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
