'use client';

import { initializePaddle, Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | null = null;

export async function getPaddle(): Promise<Paddle> {
  if (paddleInstance) return paddleInstance;

  const instance = await initializePaddle({
    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production') ?? 'sandbox',
  });

  if (!instance) throw new Error('Failed to initialize Paddle');

  paddleInstance = instance;
  return instance;
}
