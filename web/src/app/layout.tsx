import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import { Suspense } from 'react';
import GoogleAnalytics from '@/components/GoogleAnalytics';
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
  title: "Emlet — Generate High Converting Marketing Emails in Seconds",
  description: "Generate high converting marketing emails in seconds with AI. Just describe your campaign and get beautiful, brand-matched HTML emails ready to send. No design skills needed.",
  keywords: ["AI email generator", "high converting emails", "email marketing", "marketing email generator", "email template builder", "HTML email", "email campaigns"],
  openGraph: {
    title: "Emlet — Generate High Converting Marketing Emails in Seconds",
    description: "Generate high converting marketing emails in seconds with AI. Just describe your campaign and get beautiful, brand-matched HTML emails ready to send.",
    url: "https://emlet.app",
    siteName: "Emlet",
    type: "website",
    images: [
      {
        url: "https://emlet.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emlet — Generate High Converting Marketing Emails in Seconds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emlet — Generate High Converting Marketing Emails in Seconds",
    description: "Generate high converting marketing emails in seconds with AI. Just describe your campaign and get beautiful, brand-matched HTML emails ready to send.",
    images: ["https://emlet.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-79R1XR82LB"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-79R1XR82LB');
        `}</Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Suspense fallback={null}><GoogleAnalytics /></Suspense>
        <Analytics />
      </body>
    </html>
  );
}
