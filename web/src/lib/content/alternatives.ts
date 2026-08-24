export interface AlternativeMeta {
  slug: string;
  competitor: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const ALTERNATIVES: AlternativeMeta[] = [
  {
    slug: 'mailchimp',
    competitor: 'Mailchimp',
    title: 'Emlet vs Mailchimp: Which Should You Use in 2026?',
    description: "They're not really solving the same problem. Here's how the email creation side compares, and why a lot of people end up using both.",
    image: 'https://images.pexels.com/photos/16675632/pexels-photo-16675632.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
    imageAlt: 'A laptop open to an email campaign on a modern office desk',
  },
  {
    slug: 'canva',
    competitor: 'Canva',
    title: 'Emlet vs Canva for Email Templates: What Actually Happens When You Send a Canva Design',
    description: 'Canva is great for graphics. It was never built to output real email HTML, and that catches people out.',
    image: 'https://images.pexels.com/photos/30889258/pexels-photo-30889258.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
    imageAlt: 'Digital artwork being edited on a graphics tablet',
  },
  {
    slug: 'chatgpt',
    competitor: 'ChatGPT',
    title: 'Emlet vs ChatGPT for Writing Marketing Emails',
    description: "ChatGPT can write email copy fine. Whether it can write an email that survives Outlook is a different question.",
    image: 'https://images.pexels.com/photos/16094043/pexels-photo-16094043.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
    imageAlt: 'A person typing on a laptop while using an AI chat assistant',
  },
];
