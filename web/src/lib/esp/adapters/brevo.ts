/**
 * Brevo (Sendinblue) adapter — API key
 *
 * Docs: https://developers.brevo.com/reference
 */
import type { EspAdapter, EspCredentials, EspList, TemplateParams, CampaignParams, PushResult, ValidateResult } from '../types';

const BASE = 'https://api.brevo.com/v3';

function headers(apiKey: string) {
  return {
    'api-key': apiKey,
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
    throw new Error(`Brevo API error ${res.status}: ${body}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const brevoAdapter: EspAdapter = {
  async validateCredentials(creds: EspCredentials): Promise<ValidateResult> {
    const data = await apiFetch(creds.accessToken, '/account');
    return {
      accountName: data?.companyName ?? data?.email ?? 'Brevo Account',
    };
  },

  async fetchLists(creds: EspCredentials): Promise<EspList[]> {
    const data = await apiFetch(creds.accessToken, '/contacts/lists?limit=50&offset=0');
    return (data?.lists ?? []).map((l: any) => ({
      id: String(l.id),
      name: l.name,
      memberCount: l.totalSubscribers,
    }));
  },

  async createTemplate(creds: EspCredentials, params: TemplateParams): Promise<PushResult> {
    const senderEmail = params.fromEmail ?? creds.metadata.sender_email;
    if (!senderEmail) {
      throw new Error('Brevo requires a verified sender email to create a template. Please provide a From Email address.');
    }
    const data = await apiFetch(creds.accessToken, '/smtp/templates', {
      method: 'POST',
      body: JSON.stringify({
        templateName: params.name,
        htmlContent: params.html,
        subject: params.name,
        isActive: true,
        sender: { name: params.fromName ?? senderEmail, email: senderEmail },
      }),
    });
    const id = String(data?.id ?? '');
    return {
      id,
      name: params.name,
      url: `https://app.brevo.com/email-marketing/templates/details/${id}`,
    };
  },

  async createCampaignDraft(creds: EspCredentials, params: CampaignParams): Promise<PushResult> {
    const body: Record<string, any> = {
      name: params.name,
      subject: params.subject,
      htmlContent: params.html,
      type: 'classic',
      sender: {
        name: params.fromName ?? (params.fromEmail ?? creds.metadata.sender_email),
        email: params.fromEmail ?? creds.metadata.sender_email ?? 'noreply@emlet.app',
      },
    };
    if (params.listId) {
      body.recipients = { listIds: [Number(params.listId)] };
    }

    const data = await apiFetch(creds.accessToken, '/emailCampaigns', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const id = String(data?.id ?? '');
    return {
      id,
      name: params.name,
      url: `https://app.brevo.com/email-marketing/campaign/send/id/${id}`,
    };
  },
};
