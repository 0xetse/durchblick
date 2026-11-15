/**
 * Turns the ten-dimension Datenprofil into plain-language summaries.
 * Deliberately produces words, never a total number (see
 * docs/content/assessment-methodology.md).
 */
import {
  CONTROL_DIMENSIONS,
  EXPOSURE_DIMENSIONS,
  type ControlDimension,
  type ExposureDimension,
  type Rating,
} from './schema';

type Assessment = Record<ExposureDimension | ControlDimension, Rating>;

export interface ProfileSummary {
  /** e.g. "hoch" – the typical (median) exposure level, as 1–4 */
  exposure: number;
  /** typical control level 1–4 */
  control: number;
  /** dimensions at the highest exposure level present */
  topExposure: ExposureDimension[];
  /** control dimensions rated 1 or 2 */
  weakControls: ControlDimension[];
  /** true if any rating has low confidence */
  provisional: boolean;
}

/** Median of ordinal levels, rounding half up (ordinal, not arithmetic). */
export function medianLevel(levels: number[]): number {
  if (levels.length === 0) throw new Error('no levels');
  const sorted = [...levels].sort((a, b) => a - b);
  const mid = (sorted.length - 1) / 2;
  return sorted[Math.ceil(mid)] as number;
}

export function summarise(a: Assessment): ProfileSummary {
  const expo = EXPOSURE_DIMENSIONS.map((d) => a[d].level);
  const ctrl = CONTROL_DIMENSIONS.map((d) => a[d].level);
  const max = Math.max(...expo);
  return {
    exposure: medianLevel(expo),
    control: medianLevel(ctrl),
    topExposure: EXPOSURE_DIMENSIONS.filter((d) => a[d].level === max),
    weakControls: CONTROL_DIMENSIONS.filter((d) => a[d].level <= 2),
    provisional: [...EXPOSURE_DIMENSIONS, ...CONTROL_DIMENSIONS].some((d) => a[d].confidence === 'low'),
  };
}
