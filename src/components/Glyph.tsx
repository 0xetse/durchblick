/**
 * Certainty glyphs. Certainty is encoded by FILL STYLE (solid → hollow →
 * dashed), never by colour alone, and always accompanied by a text label.
 */
export type GlyphKind = 'provided' | 'observed' | 'derived' | 'documented' | 'possible';

export function Glyph({ kind, size = 14 }: { kind: GlyphKind; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true as const, class: 'glyph' };
  switch (kind) {
    case 'provided':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6" fill="currentColor" />
        </svg>
      );
    case 'observed':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="3.6" fill="currentColor" />
          <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.4" />
        </svg>
      );
    case 'derived':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.6" />
          <path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" />
        </svg>
      );
    case 'documented':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.8" fill="none" stroke="currentColor" stroke-width="1.8" />
        </svg>
      );
    case 'possible':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2.6 2.2" />
        </svg>
      );
  }
}

export function Badge({ kind, label, hint }: { kind: GlyphKind; label: string; hint?: string }) {
  return (
    <span class={`tag badge badge-${kind}`} title={hint}>
      <Glyph kind={kind} />
      {label}
    </span>
  );
}
