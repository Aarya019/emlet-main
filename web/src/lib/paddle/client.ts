'use client';

import type { Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | null = null;

export async function getPaddle(): Promise<Paddle> {
  if (paddleInstance) return paddleInstance;

  // Dynamic import — @paddle/paddle-js is only fetched/parsed/executed when a
  // user actually clicks Upgrade, not bundled into every homepage load. It
  // was previously a static import, which meant its full weight loaded (and
  // blocked the main thread) on every visit regardless of whether the user
  // ever opens checkout.
  const { initializePaddle } = await import('@paddle/paddle-js');

  const instance = await initializePaddle({
    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production') ?? 'sandbox',
  });

  if (!instance) throw new Error('Failed to initialize Paddle');

  paddleInstance = instance;
  return instance;
}
