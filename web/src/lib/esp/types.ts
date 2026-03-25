// ─── Shared ESP types ────────────────────────────────────────────────────────

export type EspSlug = 'mailchimp' | 'klaviyo' | 'brevo' | 'mailerlite';

export type EspAuthType = 'oauth' | 'apikey';

export interface EspCredentials {
  accessToken: string;
  /** Extra per-ESP data: e.g. mailchimp needs { dc: "us21" } */
  metadata: Record<string, string>;
}

export interface EspList {
  id: string;
  name: string;
  memberCount?: number;
}

export interface TemplateParams {
  name: string;
  html: string;
  /** Sender name — required by some ESPs (e.g. Brevo) even for templates */
  fromName?: string;
  /** Sender email — must be a verified sender in the ESP account (e.g. Brevo) */
  fromEmail?: string;
}

export interface CampaignParams {
  name: string;
  subject: string;
  previewText?: string;
  html: string;
  fromName?: string;
  fromEmail?: string;
  listId?: string;
}

export interface PushResult {
  id: string;
  /** Deep-link into the ESP UI to view the created template/campaign */
  url?: string;
  name: string;
}

export interface ValidateResult {
  /** Display name for the connected account, e.g. "Acme Corp (us21)" */
  accountName: string;
  /** Any extra metadata to persist (e.g. { dc: "us21" } for Mailchimp) */
  metadata?: Record<string, string>;
}

// ─── Adapter contract ────────────────────────────────────────────────────────

export interface EspAdapter {
  /** Verify credentials and return account name (called at connect time) */
  validateCredentials(creds: EspCredentials): Promise<ValidateResult>;

  /** Fetch mailing lists (for campaign draft picker) */
  fetchLists(creds: EspCredentials): Promise<EspList[]>;

  /** Create a reusable template in the ESP */
  createTemplate(creds: EspCredentials, params: TemplateParams): Promise<PushResult>;

  /** Create a campaign draft (subject/from/list pre-filled, ready to schedule) */
  createCampaignDraft(creds: EspCredentials, params: CampaignParams): Promise<PushResult>;
}
