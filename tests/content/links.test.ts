/**
 * Guards against phishing-style mistakes: "official" setting links must point
 * to a domain that belongs to the company operating the service.
 */
import { describe, expect, it } from 'vitest';
import { getContent } from '~/domain/content';

const OFFICIAL_DOMAINS: Record<string, string[]> = {
  google: ['google.com', 'youtube.com'],
  meta: ['facebook.com', 'instagram.com', 'whatsapp.com', 'meta.com'],
  bytedance: ['tiktok.com'],
  amazon: ['amazon.de', 'amazon.com', 'amazon.eu'],
  openai: ['openai.com', 'chatgpt.com'],
  spotify: ['spotify.com'],
  microsoft: ['linkedin.com', 'microsoft.com'],
  telegram: ['telegram.org'],
  snap: ['snapchat.com', 'snap.com'],
  paypal: ['paypal.com'],
  netflix: ['netflix.com'],
};

describe('official links', () => {
  const { guides, services } = getContent();
  it.each(guides.filter((g) => g.officialUrl).map((g) => [g.id, g] as const))('%s', (_id, g) => {
    const company = services.find((s) => s.id === g.service)!.company;
    const allowed = OFFICIAL_DOMAINS[company];
    expect(allowed, `no domain allowlist for ${company}`).toBeDefined();
    const host = new URL(g.officialUrl!).hostname;
    expect(allowed!.some((d) => host === d || host.endsWith(`.${d}`)), `${host} not in ${allowed}`).toBe(true);
  });
});
