import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'email-deliverability-spf-dkim-dmarc-explained',
  title: 'Email Deliverability Basics: What SPF, DKIM, and DMARC Actually Do',
  description:
    "Three different acronyms that get treated as interchangeable checkboxes. They're not redundant, each one closes a gap the others leave open, and understanding the gap is the difference between copying a DNS record and actually knowing what it protects.",
  date: '2026-10-07',
  readTime: '7 min read',
  category: 'Deliverability',
  image: 'https://images.pexels.com/photos/17489157/pexels-photo-17489157.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A server rack with glowing blue indicator lights',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "SPF, DKIM, and DMARC usually show up together in setup guides as three DNS records to paste in and forget about. Most people do exactly that, which works fine until something breaks, at which point it helps enormously to actually know what each one is checking, since they're not redundant and they're not interchangeable. Each one closes a specific gap the other two leave open.",
  },
  {
    type: 'h2',
    text: 'SPF: a list of who is allowed to send',
  },
  {
    type: 'p',
    text: "SPF (Sender Policy Framework) is a DNS record that lists which mail servers are authorized to send email on behalf of your domain. When a message arrives, the receiving server checks the sending server's IP address against that list. If your ESP's servers aren't on it, the message fails the check. It's a straightforward allowlist, and it has one well-known gap: SPF breaks on forwarded mail. If someone forwards your email through their own mail server, that server almost certainly isn't in your SPF record, so the forwarded copy can fail a check that the original send would have passed.",
  },
  {
    type: 'h2',
    text: "DKIM: proof the message wasn't altered",
  },
  {
    type: 'p',
    text: "DKIM (DomainKeys Identified Mail) works differently. Your sending server attaches a cryptographic signature to the message, generated with a private key. The receiving server looks up the matching public key in your DNS and verifies the signature. A valid signature proves two things: the message came from a server that had access to your private key, and the content wasn't altered in transit. Because the signature travels with the message itself rather than depending on the sending IP, DKIM survives forwarding in a way SPF doesn't, which is exactly the gap it closes.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/17155842/pexels-photo-17155842.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A finger pressing a fingerprint scanner on a security access panel',
    caption: "DKIM is closer to a fingerprint on the message itself than a guard checking a list at the door.",
  },
  {
    type: 'h2',
    text: 'DMARC: the policy that ties the other two together',
  },
  {
    type: 'p',
    text: "SPF and DKIM can each pass on their own without actually protecting what most people assume they protect: the domain name a recipient sees in their inbox. A message can pass SPF and DKIM for one domain while displaying a completely different domain in the visible \"From\" field, which is exactly how a lot of spoofing works. DMARC closes that gap with a concept called alignment: it requires the domain in the visible From address to match, or be a subdomain of, the domain that SPF or DKIM actually verified. DMARC also defines what should happen when a message fails that alignment check, do nothing but report it (p=none), send it to spam (p=quarantine), or block it outright (p=reject), and it gives domain owners a reporting feed showing who's sending mail that claims to be from their domain, legitimate or not.",
  },
  {
    type: 'h2',
    text: 'Why all three, not just one',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'SPF alone is spoofable where it matters most.',
        text: "It checks the sending server, not the address a recipient actually sees, so it does nothing to stop a forged From address that still passes on paper.",
      },
      {
        bold: 'DKIM alone has no enforcement policy.',
        text: "A valid signature proves authenticity when present, but without DMARC there's no instruction telling receiving servers what to do with mail that isn't signed at all.",
      },
      {
        bold: 'DMARC alone has nothing to align.',
        text: "It depends on SPF and DKIM actually being set up correctly first, it's the policy layer on top, not a replacement for either.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Setting it up without breaking your own mail',
  },
  {
    type: 'p',
    text: "Most ESPs handle SPF and DKIM setup through a handful of DNS records provided in their dashboard, a one-time copy-paste job. DMARC is the one worth adding carefully rather than all at once: start at p=none, which does nothing but generate reports, and watch those reports for a few weeks to confirm your own legitimate mail is passing before moving to p=quarantine and eventually p=reject. Jumping straight to reject without that monitoring period is a common mistake, and it can silently block your own real email if anything in the setup was slightly off, which is a worse outcome than the spoofing risk you were trying to close in the first place.",
  },
];
