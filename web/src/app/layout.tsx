import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
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
  title: "Emlet — AI Email Generator | Create Pro Emails in Seconds",
  description: "Generate production-ready marketing emails with AI. Describe your campaign, get beautiful HTML emails instantly. Export to Mailchimp, SendGrid, Resend and more.",
  keywords: ["AI email generator", "email marketing", "React Email", "email template builder", "HTML email"],
  openGraph: {
    title: "Emlet — AI Email Generator",
    description: "Describe your email. Get beautiful, production-ready HTML in seconds.",
    url: "https://emlet.app",
    siteName: "Emlet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emlet — AI Email Generator",
    description: "Describe your email. Get beautiful, production-ready HTML in seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
