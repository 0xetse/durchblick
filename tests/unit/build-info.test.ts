import { describe, expect, it } from 'vitest';
import { COMMIT_LENGTH, REPOSITORY_URL, commitUrl, normalizeCommit, readBuildInfo, resolveBuildInfo } from '~/build/build-info';

const SHA = '5e77537a323e6c7d7b4bbfc57b75887e9ddfa95a';
const OTHER = '000950f4b540e7c2ef9ea97abf463a1858512698';
const clean = () => false;

describe('build info: commit id', () => {
  it('shortens a valid commit id to 12 lowercase hex characters', () => {
    expect(COMMIT_LENGTH).toBe(12);
    expect(normalizeCommit(SHA)).toBe('5e77537a323e');
    expect(normalizeCommit(SHA.toUpperCase())).toBe('5e77537a323e');
    expect(normalizeCommit(`  ${SHA}\n`)).toBe('5e77537a323e');
    expect(normalizeCommit('5e77537a323e')).toBe('5e77537a323e');
    expect(normalizeCommit('a'.repeat(64))).toBe('a'.repeat(12)); // SHA-256 repositories
  });

  it('rejects anything that is not a commit id', () => {
    for (const v of ['5e77537a323', 'main', 'v0.5.1', '', ' ', 'g'.repeat(40), 'a'.repeat(65), `${SHA};rm -rf /`, '5e77537a 323e', 'refs/heads/main', '/Users/someone']) {
      expect(normalizeCommit(v), JSON.stringify(v)).toBeNull();
    }
    for (const v of [undefined, null, 123, {}, []]) expect(normalizeCommit(v)).toBeNull();
  });
});

describe('build info: sources', () => {
  it('prefers the explicit build variable, then GITHUB_SHA, then git', () => {
    const git = () => SHA;
    expect(resolveBuildInfo({ explicit: OTHER, github: SHA, gitHead: git, gitModified: clean })).toEqual({ commit: '000950f4b540', modified: false, source: 'env' });
    expect(resolveBuildInfo({ github: OTHER, gitHead: git, gitModified: clean })).toEqual({ commit: '000950f4b540', modified: false, source: 'github' });
    expect(resolveBuildInfo({ gitHead: git, gitModified: clean })).toEqual({ commit: '5e77537a323e', modified: false, source: 'git' });
  });

  it('skips invalid values and falls back to the next source', () => {
    expect(resolveBuildInfo({ explicit: 'not-a-commit', github: OTHER, gitHead: () => SHA }).source).toBe('github');
    expect(resolveBuildInfo({ explicit: 'x', github: 'refs/pull/24/merge', gitHead: () => SHA }).source).toBe('git');
  });

  it('reports an unknown commit when no source has a valid value', () => {
    expect(resolveBuildInfo({})).toEqual({ commit: null, modified: false, source: 'none' });
    expect(resolveBuildInfo({ explicit: 'x', github: '', gitHead: () => null, gitModified: () => null })).toEqual({ commit: null, modified: false, source: 'none' });
  });

  it('marks a build from a working tree with uncommitted changes as modified', () => {
    expect(resolveBuildInfo({ gitHead: () => SHA, gitModified: () => true })).toMatchObject({ commit: '5e77537a323e', modified: true });
    // Also when the commit comes from the environment: the files still differ from it.
    expect(resolveBuildInfo({ explicit: SHA, gitModified: () => true }).modified).toBe(true);
    // Without git there is nothing to compare against.
    expect(resolveBuildInfo({ explicit: SHA, gitModified: () => null }).modified).toBe(false);
  });
});

describe('build info: link', () => {
  it('links only a known commit that the build actually matches', () => {
    expect(commitUrl({ commit: '5e77537a323e', modified: false, source: 'git' })).toBe(`${REPOSITORY_URL}/commit/5e77537a323e`);
    expect(commitUrl({ commit: '5e77537a323e', modified: true, source: 'git' })).toBeNull();
    expect(commitUrl({ commit: null, modified: false, source: 'none' })).toBeNull();
    expect(REPOSITORY_URL).toBe('https://github.com/0xetse/durchblick');
  });
});

describe('build info: this build', () => {
  it('holds nothing but a commit id or "unknown" – no paths, names or times', () => {
    const info = readBuildInfo();
    expect(['env', 'github', 'git', 'none']).toContain(info.source);
    if (info.commit === null) expect(info.source).toBe('none');
    else expect(info.commit).toMatch(/^[0-9a-f]{12}$/);
    expect(Object.keys(info).sort()).toEqual(['commit', 'modified', 'source']);
    expect(typeof info.modified).toBe('boolean');
  });

  it('matches GITHUB_SHA in GitHub Actions', () => {
    const sha = process.env.GITHUB_SHA;
    if (!sha || process.env.DURCHBLICK_COMMIT) return;
    expect(readBuildInfo().commit).toBe(sha.slice(0, 12).toLowerCase());
  });
});
