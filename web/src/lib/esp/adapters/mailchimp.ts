/**
 * Mailchimp adapter — OAuth
 *
 * Docs: https://mailchimp.com/developer/marketing/api/
 * Base URL: https://<dc>.api.mailchimp.com/3.0  (dc stored in metadata)
 */
import type { EspAdapter, EspCredentials, EspList, TemplateParams, CampaignParams, PushResult, ValidateResult } from '../types';

function base(dc: string) {
  return `https://${dc}.api.mailchimp.com/3.0`;
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function apiFetch(dc: string, token: string, path: string, init?: RequestInit) {
  const res = await fetch(`${base(dc)}${path}`, {
    ...init,
    headers: { ...headers(token), ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mailchimp API error ${res.status}: ${body}`);
  }
  return res.json();
}

export const mailchimpAdapter: EspAdapter = {
  async validateCredentials(creds: EspCredentials): Promise<ValidateResult> {
    // Get dc from metadata if already stored, otherwise discover via metadata endpoint
    let dc = creds.metadata?.dc;
    if (!dc) {
      // The /3.0/ endpoint on the generic host returns account info including dc
      const res = await fetch('https://login.mailchimp.com/oauth2/metadata', {
        headers: { Authorization: `OAuth ${creds.accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch Mailchimp account metadata');
      const meta = await res.json();
      dc = meta.dc as string;
    }
    const info = await apiFetch(dc, creds.accessToken, '/');
    return {
      accountName: `${info.account_name} (${dc})`,
      metadata: { dc },
    };
  },

  async fetchLists(creds: EspCredentials): Promise<EspList[]> {
    const dc = creds.metadata.dc;
    const data = await apiFetch(dc, creds.accessToken, '/lists?count=100&fields=lists.id,lists.name,lists.stats.member_count');
    return (data.lists ?? []).map((l: any) => ({
      id: l.id,
      name: l.name,
      memberCount: l.stats?.member_count,
    }));
  },

  async createTemplate(creds: EspCredentials, params: TemplateParams): Promise<PushResult> {
    const dc = creds.metadata.dc;
    const data = await apiFetch(dc, creds.accessToken, '/templates', {
      method: 'POST',
      body: JSON.stringify({ name: params.name, html: params.html }),
    });
    return {
      id: String(data.id),
      name: data.name,
      url: `https://us1.admin.mailchimp.com/templates/design?id=${data.id}`,
    };
  },

  async createCampaignDraft(creds: EspCredentials, params: CampaignParams): Promise<PushResult> {
    const dc = creds.metadata.dc;

    // Step 1 — create campaign shell
    const campaign = await apiFetch(dc, creds.accessToken, '/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        type: 'regular',
        recipients: params.listId ? { list_id: params.listId } : undefined,
        settings: {
          subject_line: params.subject,
          preview_text: params.previewText ?? '',
          title: params.name,
          from_name: params.fromName ?? 'Emlet',
          reply_to: params.fromEmail ?? '',
        },
      }),
    });

    // Step 2 — set HTML content
    await apiFetch(dc, creds.accessToken, `/campaigns/${campaign.id}/content`, {
      method: 'PUT',
      body: JSON.stringify({ html: params.html }),
    });

    return {
      id: campaign.id,
      name: campaign.settings?.title ?? params.name,
      url: `https://us1.admin.mailchimp.com/campaigns/edit?id=${campaign.id}`,
    };
  },
};
