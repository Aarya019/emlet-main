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
  // Free plan gets a pooled allowance of 5 AI actions per calendar month
  // (email generation + AI edit + block regeneration share this pool),
  // recurring — see refresh_monthly_credits() in the DB, which tops this
  // back up on the first request of a new month rather than this being a
  // one-time lifetime grant.
  free: 5,
  // pro is unlimited — the API bypasses the credit check entirely via plan_type,
  // this value is only stored for display purposes.
  pro: 999999,
} as const;

// Test send has no AI cost, so it's a separate allowance from PLAN_CREDITS —
// see refresh_monthly_test_sends() in the DB.
export const FREE_TEST_SEND_LIMIT = 3;
