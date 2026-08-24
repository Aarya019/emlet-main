import Link from 'next/link';
import type { Metadata } from 'next';
import TocSidebar from './TocSidebar';

export const metadata: Metadata = {
  title: 'How to Connect Your Email Service Provider to Emlet | Emlet Blog',
  description:
    'Step-by-step guide to connecting Mailchimp, Klaviyo, Brevo, and Mailerlite to Emlet — so you can push AI-generated emails directly into your ESP with one click.',
  alternates: { canonical: 'https://emlet.app/blog/connect-esp-guide' },
  openGraph: {
    title: 'How to Connect Your ESP to Emlet',
    description:
      'Connect Mailchimp, Klaviyo, Brevo, or Mailerlite to Emlet and push AI-generated emails straight into your account in one click.',
    type: 'article',
    publishedTime: '2026-03-25',
  },
};

// ─── Prose helpers ────────────────────────────────────────────────────────────

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

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-white/65 leading-relaxed mb-2 pl-2">
      {children}
    </li>
  );
}

function Ol({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal list-outside ml-5 mb-6 space-y-1">{children}</ol>;
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc list-outside ml-5 mb-6 space-y-1">{children}</ul>;
}

function Callout({ type = 'tip', children }: { type?: 'tip' | 'warning' | 'info'; children: React.ReactNode }) {
  const styles = {
    tip: 'bg-[#00ffff]/5 border-[#00ffff]/30 text-[#00ffff]/80',
    warning: 'bg-yellow-400/5 border-yellow-400/30 text-yellow-400/80',
    info: 'bg-white/5 border-white/15 text-white/60',
  };
  const labels = { tip: 'Tip', warning: 'Watch out', info: 'Note' };
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

function EspCard({
  name,
  authType,
  freeLabel,
  children,
}: {
  name: string;
  authType: string;
  freeLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-6 mb-6">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-white mb-2">{name}</h4>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/50">{authType}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#00ff80]/10 text-[#00ff80]">{freeLabel}</span>
        </div>
      </div>
      <div className="text-sm text-white/60 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#00ff80]/20 border border-[#00ffff]/30 flex items-center justify-center text-xs font-black text-[#00ffff] flex-shrink-0 mt-0.5">
        {n}
      </div>
      <div className="flex-1 text-white/65 leading-relaxed text-sm">{children}</div>
    </div>
  );
}

// ─── TOC ──────────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'what-you-can-do', label: 'What you can do with integrations' },
  { id: 'connect', label: 'Connecting your ESP' },
  { id: 'mailchimp', label: '→ Mailchimp' },
  { id: 'klaviyo', label: '→ Klaviyo' },
  { id: 'brevo', label: '→ Brevo' },
  { id: 'mailerlite', label: '→ Mailerlite' },
  { id: 'push', label: 'Pushing an email to your ESP' },
  { id: 'template-vs-campaign', label: 'Template vs. Campaign Draft' },
  { id: 'sender-address', label: 'Verified sender addresses' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'faq', label: 'FAQ' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConnectEspGuide() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 lg:items-start">

        <TocSidebar toc={TOC} />

        <article className="min-w-0">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
            <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#00ffff]/60">Integrations</span>
          </div>

          {/* Title block */}
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-4">
              Integrations, 8 min read
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              How to Connect Your ESP to Emlet
            </h1>
            <p className="text-white/50 text-lg sm:text-xl leading-relaxed max-w-2xl">
              Generate a beautiful email in Emlet, then push it straight into Mailchimp, Klaviyo, Brevo, or
              Mailerlite — as a ready-to-send template or a campaign draft — in a single click.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-white/30">
              <span>March 25, 2026, by the Emlet Team</span>
            </div>
          </div>



          {/* ── Overview ── */}
          <H2 id="overview">Overview</H2>
          <P>
            Emlet's ESP integrations let you go from brand inputs to a fully designed, deliverable HTML email
            — and into your sending platform — without copying a single line of code. You connect your ESP once
            in <strong className="text-white/80">Settings → Integrations</strong>, and from then on a{' '}
            <strong className="text-white/80">Publish</strong> button appears inside every email you generate.
          </P>
          <P>
            We currently support four of the most widely-used ESPs:
          </P>
          <div className="grid sm:grid-cols-2 gap-3 my-6">
            {[
              { name: 'Mailchimp', desc: 'OAuth, no API key needed' },
              { name: 'Klaviyo', desc: 'Private API key' },
              { name: 'Brevo', desc: 'API key + verified sender' },
              { name: 'Mailerlite', desc: 'API token + verified sender' },
            ].map(({ name, desc }) => (
              <div key={name} className="rounded-xl border border-white/10 bg-white/3 px-4 py-3">
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-xs text-white/40 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

          {/* ── What you can do ── */}
          <H2 id="what-you-can-do">What you can do with integrations</H2>
          <P>Once connected you can push any Emlet-generated email as:</P>
          <Ul>
            <Li>
              <strong className="text-white/80">Template</strong> — saved to your ESP's template library, ready
              to use in any future campaign. Great for building a reusable library.
            </Li>
            <Li>
              <strong className="text-white/80">Campaign Draft</strong> — a pre-built campaign that already has
              your subject line, sender details, and audience list attached. You just review and hit send.
            </Li>
          </Ul>
          <Callout type="tip">
            If you just want to reuse the design later, choose <strong>Template</strong>. If you're ready to
            schedule a send, choose <strong>Campaign Draft</strong> so your list and subject line are already
            pre-filled.
          </Callout>

          {/* ── Connecting ── */}
          <H2 id="connect">Connecting your ESP</H2>
          <P>
            All connections are managed from <strong className="text-white/80">Dashboard → Settings → Integrations</strong>.
            The steps differ slightly per ESP — here's exactly what to do for each one.
          </P>

          {/* Mailchimp */}
          <H3>
            <span id="mailchimp" className="scroll-mt-24 block">Mailchimp</span>
          </H3>
          <EspCard
            name="Mailchimp"
            authType="OAuth 2.0"
            freeLabel="Free up to 500 contacts"
          >
            <p>
              Mailchimp uses OAuth, so you never paste an API key — you just approve the connection in your browser.
            </p>
          </EspCard>
          <Step n={1}>
            In your Emlet dashboard go to <strong className="text-white/80">Settings → Integrations</strong>.
          </Step>
          <Step n={2}>
            Click <strong className="text-white/80">Connect</strong> next to Mailchimp. You'll be redirected to
            Mailchimp's login page.
          </Step>
          <Step n={3}>
            Log in to your Mailchimp account and click <strong className="text-white/80">Allow</strong> when
            prompted to grant Emlet access.
          </Step>
          <Step n={4}>
            You'll be sent back to Emlet automatically. The Mailchimp card will now show your account name in green.
          </Step>
          <Callout type="info">
            Emlet requests the minimum scopes needed: read/write access to templates and campaigns only.
            We never read your subscriber data.
          </Callout>

          {/* Klaviyo */}
          <H3>
            <span id="klaviyo" className="scroll-mt-24 block">Klaviyo</span>
          </H3>
          <EspCard
            name="Klaviyo"
            authType="Private API Key"
            freeLabel="Free up to 250 contacts"
          >
            <p>Klaviyo uses private API keys scoped to specific permissions.</p>
          </EspCard>
          <Step n={1}>Log in to <strong className="text-white/80">Klaviyo</strong> and go to <strong className="text-white/80">Account → Settings → API Keys</strong>.</Step>
          <Step n={2}>
            Click <strong className="text-white/80">Create Private API Key</strong>. Give it a name like{' '}
            <Code>Emlet</Code>.
          </Step>
          <Step n={3}>
            Set the following scopes (at minimum):
            <Ul>
              <Li><Code>Lists — Read/Write</Code> — to fetch your lists and create campaigns</Li>
              <Li><Code>Templates — Read/Write</Code> — to create email templates</Li>
              <Li><Code>Campaigns — Read/Write</Code> — to create campaign drafts</Li>
            </Ul>
          </Step>
          <Step n={4}>Copy the key and paste it into the <strong className="text-white/80">API Key</strong> field in Emlet's Integrations panel, then click <strong className="text-white/80">Save</strong>.</Step>
          <Callout type="tip">
            Adding <Code>Accounts — Read</Code> scope is optional but lets Emlet show your real account/company name
            in the Integrations panel instead of the generic "Klaviyo Account" label.
          </Callout>

          {/* Brevo */}
          <H3>
            <span id="brevo" className="scroll-mt-24 block">Brevo</span>
          </H3>
          <EspCard
            name="Brevo"
            authType="API Key + Verified Sender"
            freeLabel="Free up to 300 emails/day"
          >
            <p>
              Brevo requires your API key <em>and</em> a verified sender email address. The sender address is
              stored with the connection so you don't have to re-enter it on every push.
            </p>
          </EspCard>
          <Step n={1}>
            Log in to <strong className="text-white/80">Brevo</strong> and go to{' '}
            <strong className="text-white/80">SMTP & API → API Keys</strong>. Click{' '}
            <strong className="text-white/80">Generate a new API key</strong>.
          </Step>
          <Step n={2}>Copy the key.</Step>
          <Step n={3}>
            Make sure the email address you want to send from is verified. Go to{' '}
            <strong className="text-white/80">Senders & Domains → Senders</strong> and add/verify it if you
            haven't already.
          </Step>
          <Step n={4}>
            In Emlet's Integrations panel, paste the API key into <strong className="text-white/80">API Key</strong>{' '}
            and your verified email into <strong className="text-white/80">Verified sender email</strong>, then
            click <strong className="text-white/80">Save</strong>.
          </Step>
          <Callout type="warning">
            Brevo will reject any push with a 400 error if the sender email isn't verified in your Brevo account.
            Double-check the address matches exactly what you've verified.
          </Callout>

          {/* Mailerlite */}
          <H3>
            <span id="mailerlite" className="scroll-mt-24 block">Mailerlite</span>
          </H3>
          <EspCard
            name="Mailerlite"
            authType="API Token + Verified Sender"
            freeLabel="Free up to 1,000 subscribers"
          >
            <p>
              Like Brevo, Mailerlite requires a verified sender address alongside your API token.
            </p>
          </EspCard>
          <Step n={1}>
            Log in to <strong className="text-white/80">Mailerlite</strong> and go to{' '}
            <strong className="text-white/80">Integrations → Mailerlite API</strong>. Click{' '}
            <strong className="text-white/80">Generate new token</strong>.
          </Step>
          <Step n={2}>Copy the token.</Step>
          <Step n={3}>
            Verify your sender domain/email under{' '}
            <strong className="text-white/80">Settings → Sender domains & addresses</strong>.
          </Step>
          <Step n={4}>
            In Emlet's Integrations panel, paste the token into{' '}
            <strong className="text-white/80">API Key</strong> and your verified email into{' '}
            <strong className="text-white/80">Verified sender email</strong>, then click{' '}
            <strong className="text-white/80">Save</strong>.
          </Step>

          {/* ── Pushing ── */}
          <H2 id="push">Pushing an email to your ESP</H2>
          <P>
            Once at least one ESP is connected, every email in your dashboard will show a{' '}
            <strong className="text-white/80">Publish</strong> button in the top-right corner of the editor.
          </P>
          <Step n={1}>Open an email from the dashboard or generate a new one.</Step>
          <Step n={2}>Click the <strong className="text-white/80">Publish ↑</strong> button.</Step>
          <Step n={3}>Select the ESP you want to push to.</Step>
          <Step n={4}>Choose <strong className="text-white/80">Template</strong> or <strong className="text-white/80">Campaign Draft</strong>.</Step>
          <Step n={5}>
            If creating a Campaign Draft, fill in the optional{' '}
            <strong className="text-white/80">From Name</strong>,{' '}
            <strong className="text-white/80">From Email</strong>, and choose an audience{' '}
            <strong className="text-white/80">List</strong> (Mailchimp / Klaviyo).
          </Step>
          <Step n={6}>Click <strong className="text-white/80">Push to [ESP]</strong>. A link to the created asset will appear so you can open it directly in your ESP.</Step>

          {/* ── Template vs Campaign ── */}
          <H2 id="template-vs-campaign">Template vs. Campaign Draft</H2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  {['', 'Template', 'Campaign Draft'].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Saved to template library', '✓', '—'],
                  ['Pre-attached to an audience list', '—', '✓'],
                  ['Subject line pre-filled', '—', '✓'],
                  ['Sender details pre-filled', '—', '✓'],
                  ['Ready to schedule / send', '—', '✓'],
                  ['Reusable for future campaigns', '✓', '—'],
                ].map(([label, a, b], i) => (
                  <tr key={i} className="border-t border-white/8 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-white/65">{label}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={a === '✓' ? 'text-[#00ff80]' : 'text-white/20'}>{a}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={b === '✓' ? 'text-[#00ff80]' : 'text-white/20'}>{b}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout type="info">
            Mailerlite doesn't have a standalone "template" resource in its API, so both push types create a
            campaign draft in Mailerlite. You can save it as a template from within the Mailerlite editor.
          </Callout>

          {/* ── Sender address ── */}
          <H2 id="sender-address">Verified sender addresses</H2>
          <P>
            Brevo and Mailerlite both require that the <em>From</em> email address is verified in their respective
            dashboards before you can send or save templates. This is an anti-spam measure enforced at the API
            level — Emlet cannot bypass it.
          </P>
          <P>
            You enter your verified sender email once when you connect the ESP. It is stored securely with your
            connection and used automatically every time you push. You can override it per-push using the{' '}
            <strong className="text-white/80">From Email</strong> field in the Publish modal — just make sure the
            override address is also verified.
          </P>
          <P>Where to verify sender addresses:</P>
          <Ul>
            <Li><strong className="text-white/80">Brevo</strong> → Senders & Domains → Senders</Li>
            <Li><strong className="text-white/80">Mailerlite</strong> → Settings → Sender domains & addresses</Li>
          </Ul>

          {/* ── Troubleshooting ── */}
          <H2 id="troubleshooting">Troubleshooting</H2>

          <H3>403 — permission denied (Klaviyo)</H3>
          <P>
            Your Klaviyo API key is missing one or more required scopes. Edit the key in{' '}
            <strong className="text-white/80">Klaviyo → Account → Settings → API Keys</strong> and ensure{' '}
            <Code>Lists</Code>, <Code>Templates</Code>, and <Code>Campaigns</Code> are all set to{' '}
            <strong className="text-white/80">Read/Write</strong>.
          </P>

          <H3>400 — Sender is invalid/inactive (Brevo or Mailerlite)</H3>
          <P>
            The sender email stored with your connection, or the one you typed in the Publish modal, hasn't been
            verified in the ESP yet. Verify it first, then try again. If you need to update the stored sender email,
            disconnect and reconnect the ESP with the correct address.
          </P>

          <H3>Mailchimp OAuth redirect not working</H3>
          <P>
            Make sure you're accessing Emlet at <Code>http://127.0.0.1:3000</Code> (not{' '}
            <Code>localhost:3000</Code>) during local development. Mailchimp's OAuth does not allow{' '}
            <Code>localhost</Code> as a redirect URI.
          </P>

          <H3>Push succeeds but I can't see the template/campaign</H3>
          <P>
            The Publish modal returns a direct link — click it to open the asset in your ESP immediately. For
            campaigns, check the <strong className="text-white/80">Drafts</strong> folder; for templates look
            in <strong className="text-white/80">Templates → Saved templates</strong>.
          </P>

          {/* ── FAQ ── */}
          <H2 id="faq">FAQ</H2>

          <H3>Can I connect more than one ESP at the same time?</H3>
          <P>Yes — you can have all four ESPs connected simultaneously. Each push lets you choose which one to send to.</P>

          <H3>Is my API key stored securely?</H3>
          <P>
            Yes. API keys are encrypted with AES-256-GCM before being stored in the database. They are decrypted
            only at the moment of an API call, never exposed in the UI or logs.
          </P>

          <H3>What HTML does Emlet send to my ESP?</H3>
          <P>
            Emlet renders the full inline-styled, table-based HTML that it generates for each email — the same
            code you can download or preview. No transformation is applied before pushing.
          </P>

          <H3>Can I disconnect an ESP?</H3>
          <P>
            Yes. Click the <strong className="text-white/80">Disconnect</strong> button on the ESP card in{' '}
            <strong className="text-white/80">Settings → Integrations</strong>. This removes the stored credentials
            immediately. You can reconnect at any time.
          </P>

          <H3>Will Emlet send emails on my behalf?</H3>
          <P>
            No. Emlet only creates templates or campaign <em>drafts</em>. It never schedules or sends emails
            — that action always stays with you inside your ESP.
          </P>

          <div className="mt-16 mb-10" />

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[#00ffff]/8 to-[#00ff80]/5 border border-[#00ffff]/20 p-8 text-center">
            <p className="text-2xl font-black text-white mb-2">Ready to connect your ESP?</p>
            <p className="text-white/50 mb-6 text-sm">Generate your first email and push it live in minutes.</p>
            <Link
              href="/sign-up"
              className="inline-block rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff80] text-black text-sm font-black px-8 py-3 hover:shadow-lg hover:shadow-[#00ffff]/25 transition-all hover:-translate-y-px"
            >
              Get started free →
            </Link>
          </div>

          {/* Back link */}
          <div className="mt-10">
            <Link href="/blog" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              ← Back to blog
            </Link>
          </div>

        </article>
      </div>
    </div>
  );
}
