export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  imageAlt: string;
}

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: 'email-design-without-a-designer',
    title: "How to Design a Marketing Email When You're Not a Designer",
    description: "You don't need Figma skills to make an email look professional. Here's the actual structural stuff that matters, and the stuff you can safely ignore.",
    date: '2026-06-02',
    readTime: '7 min read',
    category: 'Design',
    image: 'https://images.pexels.com/photos/3850210/pexels-photo-3850210.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
    imageAlt: 'A minimal desk workspace with a laptop, drawing tablet, and design documents laid out',
  },
  {
    slug: 'why-your-emails-look-broken-in-gmail-outlook',
    title: 'Why Your Marketing Emails Look Broken in Gmail and Outlook',
    description: 'Looks perfect in your inbox, falls apart for half your list. A walkthrough of the specific things that break, and why email HTML is stuck in 2003.',
    date: '2026-06-11',
    readTime: '8 min read',
    category: 'Deliverability',
    image: 'https://images.pexels.com/photos/16675632/pexels-photo-16675632.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
    imageAlt: 'Close-up of a laptop screen showing an email inbox',
  },
  {
    slug: 'email-marketing-statistics-2026',
    title: '13 Email Marketing Statistics Worth Knowing in 2026',
    description: 'Open rates, ROI, and what actually moves the needle this year, with sources, not vibes.',
    date: '2026-06-23',
    readTime: '6 min read',
    category: 'Research',
    image: 'https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
    imageAlt: 'A laptop displaying data analytics charts and graphs',
  },
  {
    slug: 'send-html-emails-from-react-app',
    title: 'How to Send HTML Emails From a React App Without Losing Your Mind',
    description: 'Your app is React. Email HTML is not. A practical guide to the gap between them, and how React Email closes it.',
    date: '2026-07-03',
    readTime: '9 min read',
    category: 'Engineering',
    image: 'https://images.pexels.com/photos/256502/pexels-photo-256502.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
    imageAlt: 'Close-up of colorful code on a computer screen',
  },
  {
    slug: 'email-fonts-guide',
    title: 'The Ultimate Guide to Email Fonts',
    description: 'Everything you need to know about choosing, embedding, and fallback-stacking fonts in HTML email — client support matrix, recommended stacks, and sizing best practices.',
    date: '2026-03-24',
    readTime: '8 min read',
    category: 'Design',
    image: 'https://images.pexels.com/photos/4140925/pexels-photo-4140925.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
    imageAlt: 'Vintage wooden letterpress type drawers in a printing house',
  },
];
