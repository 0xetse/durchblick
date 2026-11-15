/**
 * Slim, serialisable shapes passed from Astro pages to client islands.
 * Islands never import the YAML loader; pages project content into these.
 */
import type { AreaPoint } from './areas';
import type { DataCategory, ServiceCategory } from './schema';

export interface SourceCard {
  title: string;
  publisher: string;
  url: string;
  tier: 1 | 2 | 3;
  type: string;
  retrievedAt: string;
  /** Language of the source document (e.g. "de"), if known. */
  language?: string | undefined;
}

export interface ServiceCard {
  id: string;
  name: string;
  company: string;
  companyName: string;
  category: ServiceCategory;
  shortName: string;
  summary: string;
  surprise: string;
  surpriseSources: SourceCard[];
  /** guide id addressing the surprise fact */
  surpriseAction?: string | undefined;
  points: AreaPoint[];
  categories: DataCategory[];
  /** service can receive data about activity outside of it (partners, pixels) */
  offplatform: boolean;
  /** personalised advertising is important or core (adUse >= 3) */
  adFunded: boolean;
  linkedWith: string[];
}

export interface GuideCard {
  id: string;
  service: string;
  serviceName: string;
  kind: 'setting' | 'review' | 'deletion' | 'export' | 'permission';
  title: string;
  goal: string;
  whyItMatters: string;
  whatChanges: string;
  whatDoesNotChange: string;
  impact: 'high' | 'medium' | 'low';
  minutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  officialUrl?: string | undefined;
  /** Where the change can be made: browser, Android/iPhone app, desktop program. */
  platforms: ('web' | 'android' | 'ios' | 'desktop-app')[];
  steps: string[];
  status: 'verified' | 'needs-verification';
  checkedAt: string;
  tradeOff?: string | undefined;
  sources: SourceCard[];
}

export interface CompanyCard {
  id: string;
  name: string;
  description: string;
}
