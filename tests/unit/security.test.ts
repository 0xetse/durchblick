import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import config from '../../astro.config.mjs';

/** Guards for the security configuration (audit 2026-11). */
describe('Content-Security-Policy', () => {
  const header = readFileSync('public/_headers', 'utf8')
    .split('\n')
    .find((l) => l.trim().startsWith('Content-Security-Policy:'))!
    .split(':')
    .slice(1)
    .join(':');
  const directives = new Map(
    header
      .split(';')
      .map((d) => d.trim().split(/\s+/))
      .filter((d) => d[0])
      .map(([name, ...values]) => [name, values]),
  );

  it('the header never falls back on script or style (it would block the hashed inline scripts)', () => {
    for (const d of ['default-src', 'script-src', 'style-src', 'script-src-elem', 'style-src-elem']) {
      expect(directives.has(d), d).toBe(false);
    }
  });

  it('the header allows no connection, image, font or worker from other hosts', () => {
    for (const d of ['connect-src', 'img-src', 'font-src', 'worker-src', 'manifest-src']) {
      const values = directives.get(d) ?? [];
      expect(values, d).toContain("'self'");
      expect(values.every((v) => ["'self'", 'data:'].includes(v)), `${d}: ${values.join(' ')}`).toBe(true);
    }
    expect(directives.get('frame-ancestors')).toEqual(["'none'"]);
  });

  it('the page policy (meta tag) locks every fetch to this site', () => {
    const list = (config.security?.csp as { directives: string[] }).directives;
    expect(list).toContain("default-src 'self'");
    expect(list).toContain("connect-src 'self'");
    expect(list.join(' ')).not.toMatch(/https?:|\*|unsafe/);
  });
});

describe('links in the content files', async () => {
  const { sourceSchema } = await import('~/domain/schema');
  const urlOk = (url: string) =>
    !sourceSchema.safeParse({ url }).error?.issues.some((i) => i.path.join('.') === 'url');

  it('accept full https addresses only, never with user name or password', () => {
    expect(urlOk('https://support.google.com/accounts/answer/1')).toBe(true);
    for (const bad of ['http://example.com', 'javascript:alert(1)', 'https:example.com', 'https://user:pw@evil.example', 'https://user@evil.example']) {
      expect(urlOk(bad), bad).toBe(false);
    }
  });
});

describe('JSON-LD in the built pages (P2-7)', () => {
  it('never contains a raw "<" inside the script element', async () => {
    const { readdirSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');
    const pages: string[] = [];
    const walk = (dir: string) => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (f.endsWith('.html')) pages.push(p);
      }
    };
    try {
      walk('dist');
    } catch {
      return; // not built yet: the E2E run covers the built site
    }
    let checked = 0;
    for (const p of pages) {
      for (const m of readFileSync(p, 'utf8').matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        expect(m[1], p).not.toContain('<');
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});
