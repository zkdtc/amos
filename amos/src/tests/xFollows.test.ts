import { describe, it, expect, beforeEach, vi } from "vitest";

// Force-install an in-memory localStorage shim for the Node test env.
{
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => { store.set(k, String(v)); },
      removeItem: (k: string) => { store.delete(k); },
      clear: () => { store.clear(); },
      get length() { return store.size; },
      key: (i: number) => Array.from(store.keys())[i] ?? null,
    }
  });
}
import {
  isValidHandle,
  normaliseHandle,
  loadFollows,
  saveFollows,
  mergePosts,
  type XPost,
  type XFollow
} from '../data/xPosts';

beforeEach(() => {
  if (typeof localStorage !== 'undefined') localStorage.clear();
});

describe('isValidHandle', () => {
  it('accepts valid handles', () => {
    expect(isValidHandle('elonmusk')).toBe(true);
    expect(isValidHandle('@cathiedwood')).toBe(true);
    expect(isValidHandle('semianalysis_')).toBe(true);
    expect(isValidHandle('abc123')).toBe(true);
    expect(isValidHandle('a')).toBe(true);
    expect(isValidHandle('abcdefghijklmno')).toBe(true);
  });
  it('rejects invalid handles', () => {
    expect(isValidHandle('')).toBe(false);
    expect(isValidHandle('with space')).toBe(false);
    expect(isValidHandle('with-dash')).toBe(false);
    expect(isValidHandle('abcdefghijklmnop')).toBe(false);
  });
});

describe('normaliseHandle', () => {
  it('strips @ and trims whitespace', () => {
    expect(normaliseHandle('@elonmusk')).toBe('elonmusk');
    expect(normaliseHandle('  cathiedwood  ')).toBe('cathiedwood');
  });
});

describe('saveFollows + loadFollows', () => {
  it('round-trips', () => {
    const list: XFollow[] = [
      { handle: 'jack', addedAt: '2026-05-25T00:00:00Z', enabled: true },
      { handle: 'elonmusk', addedAt: '2026-05-25T00:01:00Z', enabled: false, lastError: 'rate' }
    ];
    saveFollows(list);
    expect(loadFollows()).toEqual(list);
  });
  it('returns [] when empty', () => {
    expect(loadFollows()).toEqual([]);
  });
  it('survives corruption', () => {
    localStorage.setItem('amos-x-follows-v1', 'not json');
    expect(loadFollows()).toEqual([]);
  });
});

describe('mergePosts', () => {
  const mk = (id: string, when: string, text: string): XPost => ({
    id, url: `https://x.com/jack/status/${id}`, author: 'jack', text,
    createdAt: when, fetchedAt: when, source: 'syndication'
  });
  it('adds new posts and dedupes by id', () => {
    const existing = [mk('1', '2026-05-24T00:00:00Z', 'a'), mk('2', '2026-05-23T00:00:00Z', 'b')];
    const incoming = [mk('3', '2026-05-25T00:00:00Z', 'c'), mk('1', '2026-05-24T00:00:00Z', 'dup')];
    const merged = mergePosts(existing, incoming);
    expect(merged.map(p => p.id)).toEqual(['3', '1', '2']);
    expect(merged.length).toBe(3);
  });
  it('returns existing unchanged when incoming is empty', () => {
    const existing = [mk('1', '2026-05-24T00:00:00Z', 'a')];
    expect(mergePosts(existing, [])).toEqual(existing);
  });
});
