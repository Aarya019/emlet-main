import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.paddle.com https://sandbox-cdn.paddle.com https://public.profitwell.com https://vercel.live https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://cdn.paddle.com https://sandbox-cdn.paddle.com https://fonts.googleapis.com",
              "frame-src https://buy.paddle.com https://checkout.paddle.com https://*.paddle.com https://sandbox-buy.paddle.com https://sandbox-checkout.paddle.com https://www.youtube.com https://www.youtube-nocookie.com",
              "connect-src 'self' https://*.paddle.com https://checkout-service.paddle.com https://sandbox-checkout-service.paddle.com https://*.supabase.co https://www.youtube.com https://www.google-analytics.com https://analytics.google.com https://*.api.mailchimp.com https://login.mailchimp.com https://a.klaviyo.com https://api.brevo.com https://connect.mailerlite.com",
              "img-src 'self' data: blob: https://*.paddle.com https://*.supabase.co https://images.pexels.com https://i.ytimg.com https://*.gstatic.com https://*.googleusercontent.com https://api.iconify.design https://www.googletagmanager.com",
              "font-src 'self' data: https://fonts.gstatic.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
