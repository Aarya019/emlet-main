/**
 * Mailerlite adapter — API key
 *
 * Docs: https://developers.mailerlite.com/docs
 * API v2 (current REST API as of 2024)
 */
import type { EspAdapter, EspCredentials, EspList, TemplateParams, CampaignParams, PushResult, ValidateResult } from '../types';

const BASE = 'https://connect.mailerlite.com/api';

function headers(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
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
    throw new Error(`Mailerlite API error ${res.status}: ${body}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const mailerliteAdapter: EspAdapter = {
  async validateCredentials(creds: EspCredentials): Promise<ValidateResult> {
    // MailerLite has no /me endpoint — validate by fetching account info via /groups
    await apiFetch(creds.accessToken, '/groups?limit=1');
    return { accountName: 'Mailerlite Account' };
  },

  async fetchLists(creds: EspCredentials): Promise<EspList[]> {
    const data = await apiFetch(creds.accessToken, '/groups?limit=100');
    return (data?.data ?? []).map((g: any) => ({
      id: String(g.id),
      name: g.name,
      memberCount: g.active_count,
    }));
  },

  async createTemplate(creds: EspCredentials, params: TemplateParams): Promise<PushResult> {
    // Mailerlite doesn't have a standalone "template" resource — campaigns are the closest.
    // We create a campaign in draft status to serve as a template.
    return mailerliteAdapter.createCampaignDraft(creds, {
      name: params.name,
      subject: params.name,
      html: params.html,
    });
  },

  async createCampaignDraft(creds: EspCredentials, params: CampaignParams): Promise<PushResult> {
    const body: Record<string, any> = {
      name: params.name,
      type: 'regular',
      status: 'draft',
      emails: [
        {
          subject: params.subject,
          from_name: params.fromName ?? params.fromEmail ?? creds.metadata.sender_email ?? 'Emlet',
          from: params.fromEmail ?? creds.metadata.sender_email ?? 'noreply@emlet.app',
          content: params.html,
        },
      ],
    };

    if (params.listId) {
      body.groups = [params.listId];
    }

    const data = await apiFetch(creds.accessToken, '/campaigns', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const id = String(data?.data?.id ?? '');
    return {
      id,
      name: data?.data?.name ?? params.name,
      url: `https://dashboard.mailerlite.com/campaigns/${id}/overview`,
    };
  },
};
