import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import AuthErrorRedirect from '@/components/AuthErrorRedirect';
import ConsentManager from '@/components/ConsentManager';
import { DEFAULT_THEME, THEME_INIT_SCRIPT } from '@/lib/theme';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.emlet.app'),
  title: "Emlet - Generate High Converting Marketing Emails in Seconds",
  description: "Generate high converting marketing emails in seconds with AI. Just describe your campaign and get beautiful, brand-matched HTML emails ready to send. No design skills needed.",
  keywords: ["AI email generator", "high converting emails", "email marketing", "marketing email generator", "email template builder", "HTML email", "email campaigns"],
  alternates: {
    // './' resolves to each page's own URL (without the query string), so pages that do not set a canonical
    // are not all declared duplicates of the homepage. A page can still override it.
    canonical: './',
  },
  openGraph: {
    title: "Emlet - Generate High Converting Marketing Emails in Seconds",
    description: "Generate high converting marketing emails in seconds with AI. Just describe your campaign and get beautiful, brand-matched HTML emails ready to send.",
    url: "https://www.emlet.app",
    siteName: "Emlet",
    type: "website",
    images: [
      {
        url: "https://www.emlet.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emlet - Generate High Converting Marketing Emails in Seconds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emlet - Generate High Converting Marketing Emails in Seconds",
    description: "Generate high converting marketing emails in seconds with AI. Just describe your campaign and get beautiful, brand-matched HTML emails ready to send.",
    images: ["https://www.emlet.app/og-image.png"],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Emlet',
  url: 'https://www.emlet.app',
  logo: 'https://www.emlet.app/icon.png',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the theme script below sets data-theme on <html> before React hydrates it.
    // data-theme is only written here for a dark default, so the very first HTML is already dark; light is the CSS default.
    <html lang="en" data-theme={DEFAULT_THEME === 'dark' ? 'dark' : undefined} suppressHydrationWarning>
      <head>
        {/* Applies the saved theme (light by default) before first paint, so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AuthErrorRedirect />
        {/* Google Analytics + the attribution cookie, behind cookie consent where the law requires it. */}
        <ConsentManager />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
