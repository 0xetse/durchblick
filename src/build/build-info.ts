/**
 * Technical build state: which Git commit a build was made from.
 *
 * Determined once while building (Node only; never in the browser). It holds
 * no time stamp, branch name, host name, user name or path, so the same clean
 * commit always produces the same output.
 *
 * Sources, first valid one wins:
 *   1. DURCHBLICK_COMMIT – explicit value from the build environment
 *   2. GITHUB_SHA        – set by GitHub Actions
 *   3. `git rev-parse HEAD` in the local repository
 * A value counts only if it is a hexadecimal commit id (12–64 characters);
 * anything else is ignored. Without a valid value the commit is unknown.
 * If the working tree has uncommitted changes, the build is marked as locally
 * modified: it then does not match any published commit.
 */
import { execFileSync } from 'node:child_process';

export const COMMIT_LENGTH = 12;
export const REPOSITORY_URL = 'https://github.com/0xetse/durchblick';

export type BuildSource = 'env' | 'github' | 'git' | 'none';

export interface BuildInfo {
  /** 12 lowercase hex characters, or null when unknown. */
  commit: string | null;
  /** Built from a working tree with uncommitted changes. */
  modified: boolean;
  source: BuildSource;
}

export interface BuildInputs {
  explicit?: string | undefined;
  github?: string | undefined;
  gitHead?: () => string | null;
  /** true/false from `git status`; null when Git is not available. */
  gitModified?: () => boolean | null;
}

/** A commit id shortened to 12 characters, or null if the value is not a commit id. */
export function normalizeCommit(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  return /^[0-9a-f]{12,64}$/.test(v) ? v.slice(0, COMMIT_LENGTH) : null;
}

export function resolveBuildInfo(inputs: BuildInputs): BuildInfo {
  const modified = inputs.gitModified?.() === true;
  const candidates: [BuildSource, () => unknown][] = [
    ['env', () => inputs.explicit],
    ['github', () => inputs.github],
    ['git', () => inputs.gitHead?.() ?? null],
  ];
  for (const [source, read] of candidates) {
    const commit = normalizeCommit(read());
    if (commit) return { commit, modified, source };
  }
  return { commit: null, modified, source: 'none' };
}

/** Link to the public commit – only for a known commit that the build actually matches. */
export function commitUrl(info: BuildInfo): string | null {
  return info.commit && !info.modified ? `${REPOSITORY_URL}/commit/${info.commit}` : null;
}

function git(args: string[]): string | null {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 10_000 }).trim();
  } catch {
    return null;
  }
}

let cached: BuildInfo | undefined;

/** The build state of the current build (read once per build). */
export function readBuildInfo(): BuildInfo {
  cached ??= resolveBuildInfo({
    explicit: process.env.DURCHBLICK_COMMIT,
    github: process.env.GITHUB_SHA,
    gitHead: () => git(['rev-parse', 'HEAD']),
    gitModified: () => {
      const status = git(['status', '--porcelain']);
      return status === null ? null : status.length > 0;
    },
  });
  return cached;
}
