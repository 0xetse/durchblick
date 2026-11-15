/** Evaluation logic for "Fünf harmlose Spuren". Pure and deterministic. */
export interface SimSignal {
  id: string;
  label: string;
  observedAs: string;
  provenance: 'provided' | 'observed' | 'derived';
  theme: string;
}
export interface SimRule {
  id: string;
  title: string;
  explanation: string;
  requires: string[];
  level: 'derived' | 'documented' | 'possible';
  sensitive: boolean;
  sources: { title: string; publisher: string; url: string }[];
  /** a guide that limits the underlying data */
  action?: { id: string; title: string } | undefined;
}

export interface SimResult {
  /** rules whose required signals are all selected, strongest (most signals) first */
  fired: SimRule[];
  /** multi-signal rules missing exactly one signal */
  near: { rule: SimRule; missing: string }[];
}

const levelRank = { derived: 0, documented: 1, possible: 2 } as const;

export function evaluate(selected: ReadonlySet<string>, rules: readonly SimRule[]): SimResult {
  const fired = rules
    .filter((r) => r.requires.every((s) => selected.has(s)))
    .sort((a, b) => b.requires.length - a.requires.length || levelRank[a.level] - levelRank[b.level]);
  const near = rules
    .filter((r) => r.requires.length > 1)
    .map((rule) => ({ rule, missingIds: rule.requires.filter((s) => !selected.has(s)) }))
    .filter((x) => x.missingIds.length === 1 && x.rule.requires.some((s) => selected.has(s)))
    .map(({ rule, missingIds }) => ({ rule, missing: missingIds[0] as string }));
  return { fired, near };
}
