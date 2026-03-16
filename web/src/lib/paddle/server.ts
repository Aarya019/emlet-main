import { Paddle, Environment } from '@paddle/paddle-node-sdk';

if (!process.env.PADDLE_API_KEY) {
  throw new Error('PADDLE_API_KEY environment variable is not set');
}

export const paddle = new Paddle(process.env.PADDLE_API_KEY, {
  environment:
    process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production'
      ? Environment.production
      : Environment.sandbox,
});

export const PLAN_CREDITS = {
  free: 5,
  pro: 50,
  // enterprise is unlimited — bypass the credit check entirely in the API
  enterprise: 0,
} as const;
