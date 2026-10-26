import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'one-click-unsubscribe-what-it-is-and-how-to-set-it-up',
  title: 'One-Click Unsubscribe: Why It Is No Longer Optional and What Setting It Up Involves',
  description:
    "Gmail, Yahoo and Microsoft now expect a real one-click unsubscribe, not just a link in the footer. Here is what the requirement actually means, who it applies to, and how to check that your emails have it.",
  date: '2026-10-26',
  readTime: '7 min read',
  category: 'Deliverability',
  image: 'https://images.pexels.com/photos/8284724/pexels-photo-8284724.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A laptop showing a list of email messages with sender names visible',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Every marketing email has an unsubscribe link in the footer. That has been true for years, and it is a legal requirement in most places. What changed is that the big mailbox providers now also want a second, separate mechanism: a one-click unsubscribe that the mail app itself offers, right next to the sender's name, without the reader ever opening your email or your website.",
  },
  {
    type: 'h2',
    text: 'What one-click unsubscribe actually is',
  },
  {
    type: 'p',
    text: "You have probably seen it without knowing what it was: a small \"Unsubscribe\" link beside the sender in Gmail or Apple Mail. That link is not part of the message body. It is built from two invisible headers your sending system adds to every email:",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'List-Unsubscribe:',
        text: "contains a web address (and sometimes a mailto: address) the mail app can use to unsubscribe the person.",
      },
      {
        bold: 'List-Unsubscribe-Post:',
        text: "tells the mail app that it can do this with a single automatic request, with the value List-Unsubscribe=One-Click. This pair is defined in a standard called RFC 8058.",
      },
    ],
  },
  {
    type: 'p',
    text: "When the reader clicks the mail app's unsubscribe button, the app sends a small request to your address and the person is removed. No landing page, no \"are you sure?\", no login. That is the point, and it is also why providers like it: it takes the pressure off the spam button.",
  },
  {
    type: 'h2',
    text: 'Who it applies to',
  },
  {
    type: 'p',
    text: "Google's and Yahoo's sender rules, which Microsoft later echoed for its consumer mailboxes, require one-click unsubscribe from bulk senders. Google defines a bulk sender as one sending roughly 5,000 or more messages a day to Gmail addresses. The details differ slightly between providers and have been revised over time, so check each provider's current sender guidelines rather than trusting any summary, including this one.",
  },
  {
    type: 'p',
    text: "Most small businesses are far below that volume, so the strict requirement may not formally apply to you. There are still two good reasons to have it. First, it is free if your sending platform supports it, and nearly all of them do. Second, a reader who can unsubscribe in one tap does not hit the spam button, and spam complaints are what actually damage a small sender's reputation.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/7662059/pexels-photo-7662059.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A smartphone screen showing a notification for a new email',
    caption: "The easier you make it to leave, the less likely a reader is to report you instead.",
  },
  {
    type: 'h2',
    text: 'What the rules ask for beyond the header',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Keep the visible footer link too.',
        text: "The header does not replace the link inside the email. Law and good practice both call for a clear, working unsubscribe link in the body.",
      },
      {
        bold: 'Honor requests promptly.',
        text: "Google's guidance for bulk senders is within two days. Treat that as a ceiling and aim for immediately.",
      },
      {
        bold: 'Send from an authenticated domain.',
        text: "The one-click mechanism is expected on mail signed with DKIM, which ties into the SPF, DKIM and DMARC setup covered elsewhere on this blog.",
      },
      {
        bold: 'Do not put obstacles in the way.',
        text: "A one-click request must unsubscribe the person on its own. Asking them to log in or confirm defeats the purpose.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'How to set it up',
  },
  {
    type: 'p',
    text: "If you send through a mainstream email platform, the honest answer is that you probably already have it. Look in your platform's deliverability or compliance settings for a one-click or List-Unsubscribe option, and leave it on. The platform adds the headers and handles the request for you.",
  },
  {
    type: 'p',
    text: "If you send through your own code or a transactional service, you have more to do: add both headers to every marketing message, point the web address at an endpoint that accepts a POST request and unsubscribes that exact recipient (with a token in the link so it cannot be used on someone else), and make the endpoint work without any login. Transactional messages such as receipts and password resets do not need the header and should not carry it.",
  },
  {
    type: 'h2',
    text: 'How to check your own emails',
  },
  {
    type: 'p',
    text: "Send yourself a campaign. In Gmail, open it, choose the three dots, then \"Show original\". Search the raw text for List-Unsubscribe and List-Unsubscribe-Post. If both are there, and the second contains One-Click, you are set. If neither appears, the mail app will not show its unsubscribe button, and it is worth asking your platform why.",
  },
  {
    type: 'p',
    text: "None of this is exciting, but it is one of the few deliverability tasks you can finish in an afternoon. Turn it on, check the headers once, and keep your footer link honest. You will lose the people who wanted to leave a little faster, and your complaint rate will thank you.",
  },
];
