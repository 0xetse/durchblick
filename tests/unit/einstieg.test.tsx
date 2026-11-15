// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import type { GuideCard, ServiceCard } from '~/domain/client-types';
import Einstieg from '~/islands/Einstieg';

const service = (id: string, shortName: string): ServiceCard => ({
  id,
  name: shortName,
  company: id,
  companyName: id,
  category: 'social',
  shortName,
  summary: '',
  surprise: `${shortName} erfährt mehr, als du denkst.`,
  surpriseSources: [],
  surpriseAction: `${id}-ads`,
  points: [{ service: id, category: 'location', title: 'Standort', provenance: 'observed' }],
  categories: ['location'],
  offplatform: false,
  adFunded: true,
  linkedWith: [],
});
const guide = (service: string): GuideCard => ({
  id: `${service}-ads`,
  service,
  serviceName: service,
  kind: 'setting',
  title: 'Werbung ohne Partnerdaten',
  goal: '',
  whyItMatters: '',
  whatChanges: 'Weniger zugeschnittene Werbung.',
  whatDoesNotChange: 'Die Daten selbst bleiben.',
  impact: 'high',
  minutes: 3,
  difficulty: 'easy',
  officialUrl: 'https://example.com/settings',
  platforms: ['web'],
  steps: [],
  status: 'verified',
  checkedAt: '2026-10-15',
  sources: [],
});

const services = [service('instagram', 'Instagram'), service('google', 'Google')];
const guides = [guide('instagram'), guide('google')];

describe('<Einstieg>', () => {
  afterEach(() => {
    cleanup();
    history.replaceState(null, '', '/');
    localStorage.clear();
    sessionStorage.clear();
  });

  it('walks one question per screen from apps to an action', () => {
    render(<Einstieg services={services} guides={guides} />);
    expect(screen.getByRole('heading', { name: 'Welche Apps nutzt du?' })).toBeTruthy();
    const next = screen.getByRole('button', { name: 'Weiter' });
    expect(next.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(next);
    expect(screen.getByText('Tippe zuerst mindestens eine App an.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Instagram' }));
    fireEvent.click(screen.getByRole('button', { name: /Weiter · 1 App gewählt/ }));
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain('Deine App Instagram kann etwas über 1 von 9 Bereichen');
    expect(screen.getByText('Wo du bist')).toBeTruthy();
    // the step heading takes focus so screen readers follow along
    expect(document.activeElement?.id).toBe('wiz-h');

    fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));
    expect(screen.getByRole('heading', { name: 'Das wissen die wenigsten' })).toBeTruthy();
    expect(screen.getByText('Instagram erfährt mehr, als du denkst.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Was kann ich tun?' }));
    expect(screen.getByRole('heading', { name: 'Das kannst du in etwa 3 Minuten ändern' })).toBeTruthy();
    const open = screen.getByRole('link', { name: /Einstellung bei Instagram öffnen/ });
    expect(open.getAttribute('rel')).toContain('noreferrer');
    // D-N24: the link carries no selection; the next page reads it from this tab.
    expect(screen.getByRole('link', { name: /Mein Plan: deine wichtigsten Schritte/ }).getAttribute('href')).toBe('/plan/');
    expect(JSON.parse(sessionStorage.getItem('durchblick:selection')!)).toEqual(['instagram']);
    expect(location.hash).toBe('');

    fireEvent.click(screen.getByRole('button', { name: 'Andere Apps wählen' }));
    expect(screen.getByRole('button', { name: 'Instagram' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('never suggests deleting the account as the one change, and says "1 Minute"', () => {
    const netflix = { ...service('netflix', 'Netflix'), surpriseAction: 'netflix-delete' };
    const del = { ...guide('netflix'), id: 'netflix-delete', kind: 'deletion' as const, title: 'Konto löschen' };
    const quick = { ...guide('netflix'), id: 'netflix-quick', title: 'Werbung ohne Verhalten', minutes: 1 };
    render(<Einstieg services={[netflix]} guides={[del, quick]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Netflix' }));
    fireEvent.click(screen.getByRole('button', { name: /Weiter · 1 App gewählt/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));
    fireEvent.click(screen.getByRole('button', { name: 'Was kann ich tun?' }));
    expect(screen.getByRole('heading', { name: 'Das kannst du in etwa 1 Minute ändern' })).toBeTruthy();
    expect(screen.getByText('Werbung ohne Verhalten')).toBeTruthy();
    expect(screen.queryByText('Konto löschen')).toBeNull();
  });

  it('shows checked steps right in the wizard instead of sending you away', () => {
    const checked = { ...guide('instagram'), steps: ['Öffne die Einstellungen.', 'Tippe auf „Werbung“.'] };
    render(<Einstieg services={[services[0]!]} guides={[checked]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Instagram' }));
    fireEvent.click(screen.getByRole('button', { name: /Weiter · 1 App gewählt/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));
    fireEvent.click(screen.getByRole('button', { name: 'Was kann ich tun?' }));
    expect(screen.queryByRole('link', { name: 'Schritt für Schritt' })).toBeNull();
    expect(screen.getByText('Schritt für Schritt').tagName).toBe('SUMMARY');
    expect(screen.getByText('Tippe auf „Werbung“.')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Ganze Anleitung mit Quellen/ }).getAttribute('href')).toBe('/anleitungen/instagram-ads/');
    history.replaceState(null, '', '/');
  });

  it('speaks English with English links when locale is en', () => {
    render(<Einstieg services={services} guides={guides} locale="en" />);
    expect(screen.getByRole('heading', { name: 'Which apps do you use?' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Instagram' }));
    fireEvent.click(screen.getByRole('button', { name: /Next · 1 app selected/ }));
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain('Your app Instagram can learn something about 1 of 9 areas');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'What can I do?' }));
    expect(screen.getByRole('heading', { name: 'You can change this in about 3 minutes' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /My plan: your most important steps/ }).getAttribute('href')).toBe('/en/plan/');
    expect(JSON.parse(sessionStorage.getItem('durchblick:selection')!)).toEqual(['instagram']);
    expect(screen.getByRole('link', { name: 'Step by step' }).getAttribute('href')).toBe('/en/guides/instagram-ads/');
    history.replaceState(null, '', '/');
  });

  it('keeps keyboard focus when showing more apps', async () => {
    const many = ['instagram', 'whatsapp', 'google', 'youtube', 'amazon', 'tiktok', 'facebook', 'chatgpt', 'spotify'].map((id) =>
      service(id, id[0]!.toUpperCase() + id.slice(1)),
    );
    render(<Einstieg services={many} guides={[]} />);
    expect(screen.queryByRole('button', { name: 'Spotify' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '1 weitere Apps zeigen' }));
    await new Promise((r) => setTimeout(r, 0));
    expect(document.activeElement?.textContent).toBe('Spotify');
  });
});
