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
  // Free plan gets 3 email generations per calendar month, recurring — see
  // refresh_monthly_credits() in the DB, which tops this back up on the first
  // request of a new month rather than this being a one-time lifetime grant.
  free: 3,
  // pro is unlimited — the API bypasses the credit check entirely via plan_type,
  // this value is only stored for display purposes.
  pro: 999999,
} as const;
