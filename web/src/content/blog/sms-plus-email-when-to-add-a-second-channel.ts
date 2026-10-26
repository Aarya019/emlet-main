import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'sms-plus-email-when-to-add-a-second-channel',
  title: 'SMS Plus Email: When a Small Business Should Add a Second Channel, and When It Is Just More Noise',
  description:
    "Text messages get read, and they also cost more, feel more personal, and come with stricter rules. Here is how to decide whether SMS belongs next to your email list, and what to send if it does.",
  date: '2026-10-26',
  readTime: '7 min read',
  category: 'Small Business',
  image: 'https://images.pexels.com/photos/5965635/pexels-photo-5965635.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A person checking their phone while walking outside',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Every few months a text-message marketing company announces that SMS has a 98% open rate and email is dead. The first number is roughly true for texts and the second is not. Both are also the wrong frame for a small business, because the real question is not which channel is better. It is whether a second channel would earn its extra cost and effort for the specific things you need to say.",
  },
  {
    type: 'h2',
    text: 'What SMS genuinely does better',
  },
  {
    type: 'p',
    text: "Texts land on the lock screen, are usually read within minutes, and feel personal. Vendors quote open rates above 90%, which is plausible given how the channel works, but treat those figures as vendor claims rather than neutral research. Open rate for texts is also not comparable to email's, which is inflated by image preloading. What holds up across sources is the pattern: for time-sensitive messages, texts get seen faster.",
  },
  {
    type: 'p',
    text: "That makes SMS a good fit for things that are urgent, short and expected:",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Appointment reminders and confirmations.',
        text: "A salon, clinic or tutor that texts the day before sees fewer no-shows, and the recipient is glad to get it.",
      },
      {
        bold: 'Order and delivery updates.',
        text: "\"Your order is out for delivery\" is exactly the kind of message people want on their phone.",
      },
      {
        bold: 'Flash sales and limited stock.',
        text: "If a sale ends tonight, a text will reach more people in time than an email will.",
      },
      {
        bold: 'Waitlists and last-minute openings.',
        text: "A cancellation slot or a restock that someone asked about is a welcome interruption.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Why it is not simply "more reach"',
  },
  {
    type: 'p',
    text: "SMS is a more intimate channel, and people punish businesses that misuse it. A weekly newsletter is easy to skim and ignore. A weekly promotional text feels like a stranger tapping you on the shoulder, and unsubscribes (people replying STOP) climb quickly when the messages are not clearly useful.",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'It costs money per message.',
        text: "Email to a small list is close to free. Texts are charged per message, and the cost rises with volume, with carrier fees and with picture messages.",
      },
      {
        bold: 'Consent is stricter.',
        text: "In the United States, marketing texts generally require clear, written opt-in consent under the TCPA, and carriers expect you to register your sending number. Other countries have their own rules. Buying or scraping a list of numbers is a fast way to a fine or a blocked number. This is not legal advice, so check the rules where your customers live.",
      },
      {
        bold: 'You get less room.',
        text: "A text has one sentence and one link. If your message needs a story, an image or a comparison, it belongs in an email.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/5053846/pexels-photo-5053846.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A finger tapping an app icon on a smartphone screen',
    caption: "A text gets one line and one tap. Use it for things that deserve the lock screen.",
  },
  {
    type: 'h2',
    text: 'A simple way to decide',
  },
  {
    type: 'p',
    text: "Add SMS when you can answer yes to most of these:",
  },
  {
    type: 'ul',
    items: [
      {
        text: "Do you regularly have messages where timing matters (appointments, deliveries, expiring offers)?",
      },
      {
        text: "Is your email list already healthy, with decent engagement, so that you are not reaching for SMS to rescue a neglected list?",
      },
      {
        text: "Can you collect clear opt-in (a checkbox at checkout, a keyword, a form) rather than guess?",
      },
      {
        text: "Can you commit to sending only a few texts a month, each one worth reading?",
      },
    ],
  },
  {
    type: 'p',
    text: "If you are mostly sending long-form newsletters, product education or stories, SMS adds cost and risk and little else. Improve the email first. If your business runs on bookings, deliveries or short-lived offers, a small, well-behaved text list can be one of the best additions you make.",
  },
  {
    type: 'h2',
    text: 'If you do start, start small',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Make the first text a welcome.',
        text: "Say who you are, what they will get, how often, and how to stop. \"Reply STOP to opt out\" is expected and builds trust.",
      },
      {
        bold: 'Keep a separate opt-in from email.',
        text: "Someone on your email list has not agreed to texts. Ask for the number and the consent on its own.",
      },
      {
        bold: 'Cap the frequency.',
        text: "Two to four a month is a reasonable starting range for a small business. Watch the STOP rate and let it tell you when you have gone too far.",
      },
      {
        bold: 'Let email and SMS do different jobs.',
        text: "Email tells the story and carries the detail. SMS delivers the short, urgent nudge, usually pointing back to a page. Do not send the same message on both.",
      },
    ],
  },
  {
    type: 'p',
    text: "A second channel is not a growth hack. It is another place where you have to earn the right to be read. Add it when it fits the kind of messages you send, and skip it when it would only be more noise.",
  },
];
