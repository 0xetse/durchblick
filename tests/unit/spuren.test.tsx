// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import Spuren from '~/islands/Spuren';

const signals = [
  { id: 'a', label: 'Kauft Laufschuhe', observedAs: '', provenance: 'observed' as const, theme: 'sport' },
  { id: 'b', label: 'Liked Fitnessstudio', observedAs: '', provenance: 'observed' as const, theme: 'sport' },
];
const rules = [
  {
    id: 'r',
    title: 'Treibt wahrscheinlich Sport',
    explanation: 'Erklärung',
    requires: ['a', 'b'],
    level: 'documented' as const,
    sensitive: false,
    sources: [{ title: 'Doku', publisher: 'Google', url: 'https://support.google.com/' }],
  },
];

afterEach(cleanup);

describe('<Spuren>', () => {
  it('combines signals into an inference with a certainty label and source', () => {
    render(<Spuren signals={signals} rules={rules} />);
    const a = screen.getByRole('button', { name: 'Kauft Laufschuhe' });
    fireEvent.click(a);
    expect(a.getAttribute('aria-pressed')).toBe('true');
    expect(screen.queryByText('Treibt wahrscheinlich Sport')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Liked Fitnessstudio' }));
    expect(screen.getByText('Treibt wahrscheinlich Sport')).toBeTruthy();
    expect(screen.getByText('Von Werbeplattformen dokumentiert', { selector: '.badge' })).toBeTruthy();
    const link = screen.getByRole('link', { name: /Google: Doku/ });
    expect(link.getAttribute('rel')).toContain('noreferrer');
  });

  it('renders English UI text and marks German sources for English readers', () => {
    render(
      <Spuren signals={signals} rules={rules} locale="en" sourceLanguages={{ 'https://support.google.com/': 'de' }} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Kauft Laufschuhe' }));
    fireEvent.click(screen.getByRole('button', { name: 'Liked Fitnessstudio' }));
    expect(screen.getByText('2 traces lead to 1 conclusion:')).toBeTruthy();
    expect(screen.getByText('Documented by ad platforms', { selector: '.badge' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Google: Doku \(in German\)/ })).toBeTruthy();
  });
});
