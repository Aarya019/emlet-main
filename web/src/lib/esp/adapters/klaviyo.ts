/**
 * Klaviyo adapter — API key
 *
 * Docs: https://developers.klaviyo.com/en/reference/api_overview
 * API version: 2024-02-15
 */
import type { EspAdapter, EspCredentials, EspList, TemplateParams, CampaignParams, PushResult, ValidateResult } from '../types';

const BASE = 'https://a.klaviyo.com/api';
const REVISION = '2024-02-15';

function headers(apiKey: string) {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    revision: REVISION,
    'Content-Type': 'application/json',
    accept: 'application/json',
  };
}

async function apiFetch(apiKey: string, path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...headers(apiKey), ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Klaviyo API error ${res.status}: ${body}`);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

export const klaviyoAdapter: EspAdapter = {
  async validateCredentials(creds: EspCredentials): Promise<ValidateResult> {
    // Try /accounts/ first (requires accounts:read scope); fall back to /lists/ (lists:read)
    // so that narrower-scoped API keys still connect successfully.
    try {
      const data = await apiFetch(creds.accessToken, '/accounts/');
      const account = data?.data?.[0];
      return {
        accountName: account?.attributes?.contact_information?.company_name ?? 'Klaviyo Account',
      };
    } catch {
      // accounts:read not granted — verify the key is valid via /lists/ instead
      await apiFetch(creds.accessToken, '/lists/');
      return { accountName: 'Klaviyo Account' };
    }
  },

  async fetchLists(creds: EspCredentials): Promise<EspList[]> {
    const data = await apiFetch(creds.accessToken, '/lists/?fields[list]=name,created,updated,profile_count');
    return (data?.data ?? []).map((l: any) => ({
      id: l.id,
      name: l.attributes?.name ?? l.id,
      memberCount: l.attributes?.profile_count,
    }));
  },

  async createTemplate(creds: EspCredentials, params: TemplateParams): Promise<PushResult> {
    const data = await apiFetch(creds.accessToken, '/templates/', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'template',
          attributes: {
            name: params.name,
            editor_type: 'CODE',
            html: params.html,
          },
        },
      }),
    });
    const id = data?.data?.id ?? '';
    return {
      id,
      name: data?.data?.attributes?.name ?? params.name,
      url: `https://www.klaviyo.com/email-marketing/templates`,
    };
  },

  async createCampaignDraft(creds: EspCredentials, params: CampaignParams): Promise<PushResult> {
    // Step 1 — create campaign
    const campaign = await apiFetch(creds.accessToken, '/campaigns/', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'campaign',
          attributes: {
            name: params.name,
            channel: 'email',
            audiences: params.listId
              ? { included: [{ type: 'list', id: params.listId }] }
              : undefined,
            send_options: { use_smart_sending: true },
            send_strategy: { method: 'immediate' },
            tracking_options: { is_tracking_opens: true, is_tracking_clicks: true },
          },
        },
      }),
    });
    const campaignId = campaign?.data?.id;

    // Step 2 — create message for the campaign
    await apiFetch(creds.accessToken, '/campaign-messages/', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'campaign-message',
          attributes: {
            channel: 'email',
            label: params.name,
            content: {
              subject: params.subject,
              preview_text: params.previewText ?? '',
              from_label: params.fromName ?? 'Emlet',
              from_email: params.fromEmail ?? '',
              html: params.html,
            },
          },
          relationships: {
            campaign: { data: { type: 'campaign', id: campaignId } },
          },
        },
      }),
    });

    return {
      id: campaignId,
      name: params.name,
      url: `https://www.klaviyo.com/email-marketing/campaigns`,
    };
  },
};
