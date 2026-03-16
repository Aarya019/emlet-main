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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.paddle.com https://public.profitwell.com",
              "style-src 'self' 'unsafe-inline' https://cdn.paddle.com",
              "frame-src https://buy.paddle.com https://checkout.paddle.com https://*.paddle.com",
              "connect-src 'self' https://*.paddle.com https://checkout-service.paddle.com https://*.supabase.co",
              "img-src 'self' data: blob: https://*.paddle.com https://*.supabase.co https://images.pexels.com",
              "font-src 'self' data:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
