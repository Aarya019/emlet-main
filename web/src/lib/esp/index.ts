import type { EspAdapter, EspSlug, EspAuthType } from './types';
import { mailchimpAdapter } from './adapters/mailchimp';
import { klaviyoAdapter } from './adapters/klaviyo';
import { brevoAdapter } from './adapters/brevo';
import { mailerliteAdapter } from './adapters/mailerlite';

export interface EspMeta {
  slug: EspSlug;
  name: string;
  authType: EspAuthType;
  /** Path under /public/images/esp/ */
  logo: string;
  /** Short hint shown in the API key input */
  apiKeyHint?: string;
  /** Extra fields needed besides API key (e.g. account URL) */
  extraFields?: { key: string; label: string; placeholder: string }[];
}

export const ESP_META: Record<EspSlug, EspMeta> = {
  mailchimp: {
    slug: 'mailchimp',
    name: 'Mailchimp',
    authType: 'oauth',
    logo: 'mailchimp.svg',
  },
  klaviyo: {
    slug: 'klaviyo',
    name: 'Klaviyo',
    authType: 'apikey',
    logo: 'klaviyo.svg',
    apiKeyHint: 'Private API Key from Klaviyo → Settings → API Keys',
  },
  brevo: {
    slug: 'brevo',
    name: 'Brevo',
    authType: 'apikey',
    logo: 'brevo.svg',
    apiKeyHint: 'API Key from Brevo → SMTP & API → API Keys',
    extraFields: [
      { key: 'sender_email', label: 'Verified sender email', placeholder: 'you@yourdomain.com' },
    ],
  },
  mailerlite: {
    slug: 'mailerlite',
    name: 'Mailerlite',
    authType: 'apikey',
    logo: 'mailerlite.svg',
    apiKeyHint: 'API token from Mailerlite → Integrations → Mailerlite API',
    extraFields: [
      { key: 'sender_email', label: 'Verified sender email', placeholder: 'you@yourdomain.com' },
    ],
  },
};

export const ESP_SLUGS: EspSlug[] = ['mailchimp', 'klaviyo', 'brevo', 'mailerlite'];

const adapters: Record<EspSlug, EspAdapter> = {
  mailchimp: mailchimpAdapter,
  klaviyo: klaviyoAdapter,
  brevo: brevoAdapter,
  mailerlite: mailerliteAdapter,
};

export function getAdapter(slug: EspSlug): EspAdapter {
  const adapter = adapters[slug];
  if (!adapter) throw new Error(`No adapter found for ESP: ${slug}`);
  return adapter;
}
