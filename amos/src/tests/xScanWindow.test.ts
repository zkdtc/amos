import { describe, it, expect } from 'vitest';
import {
  windowSinceSec,
  filterPostsByWindow,
  SCAN_WINDOWS,
  type ScanWindow,
  type XPost
} from '../data/xPosts';

const NOW = new Date('2026-05-25T22:00:00Z').getTime();
const post = (id: string, createdAt?: string, fetchedAt = '2026-05-25T22:00:00Z'): XPost => ({
  id, url: `https://x.com/u/status/${id}`, author: 'u', text: id,
  createdAt, fetchedAt, source: 'syndication'
});

describe('SCAN_WINDOWS', () => {
  it('has four canonical entries', () => {
    expect(SCAN_WINDOWS.map(w => w.value)).toEqual(['1h', '1d', '1w', '1mo', '3mo', '6mo', '1y', 'all']);
  });
  it('all has null hours (meaning no filter)', () => {
    expect(SCAN_WINDOWS.find(w => w.value === 'all')?.hours).toBeNull();
  });
});

describe('windowSinceSec', () => {
  it('returns undefined for "all"', () => {
    expect(windowSinceSec('all', NOW)).toBeUndefined();
  });
  it('1h returns now-3600', () => {
    expect(windowSinceSec('1h', NOW)).toBe(Math.floor(NOW / 1000) - 3600);
  });
  it('1d returns now-86400', () => {
    expect(windowSinceSec('1d', NOW)).toBe(Math.floor(NOW / 1000) - 86400);
  });
  it('1w returns now-604800', () => {
    expect(windowSinceSec('1w', NOW)).toBe(Math.floor(NOW / 1000) - 604800);
  });
});

describe('filterPostsByWindow', () => {
  const posts: XPost[] = [
    post('30m', '2026-05-25T21:30:00Z'),   // 30 min old
    post('6h',  '2026-05-25T16:00:00Z'),   // 6 h old
    post('2d',  '2026-05-23T22:00:00Z'),   // 2 d old
    post('10d', '2026-05-15T22:00:00Z'),   // 10 d old
    post('nodate', undefined, '2026-05-25T21:55:00Z') // no createdAt → uses fetchedAt
  ];

  it('all → returns everything unchanged', () => {
    expect(filterPostsByWindow(posts, 'all', NOW)).toEqual(posts);
  });

  it('1h → only 30m + nodate (fetchedAt 5 min ago)', () => {
    const ids = filterPostsByWindow(posts, '1h', NOW).map(p => p.id);
    expect(ids.sort()).toEqual(['30m', 'nodate']);
  });

  it('1d → 30m + 6h + nodate', () => {
    const ids = filterPostsByWindow(posts, '1d', NOW).map(p => p.id);
    expect(ids.sort()).toEqual(['30m', '6h', 'nodate']);
  });

  it('1w → all but 10d', () => {
    const ids = filterPostsByWindow(posts, '1w', NOW).map(p => p.id);
    expect(ids.sort()).toEqual(['2d', '30m', '6h', 'nodate']);
  });

  it('empty input is safe', () => {
    (['1h', '1d', '1w', 'all'] as ScanWindow[]).forEach(w => {
      expect(filterPostsByWindow([], w, NOW)).toEqual([]);
    });
  });
});

describe('new extended windows', () => {
  it('SCAN_WINDOWS has 8 entries', () => {
    expect(SCAN_WINDOWS.map(w => w.value)).toEqual(['1h', '1d', '1w', '1mo', '3mo', '6mo', '1y', 'all']);
  });
  it('1mo = 30 days', () => {
    expect(windowSinceSec('1mo', NOW)).toBe(Math.floor(NOW / 1000) - 24 * 30 * 3600);
  });
  it('3mo = 90 days', () => {
    expect(windowSinceSec('3mo', NOW)).toBe(Math.floor(NOW / 1000) - 24 * 90 * 3600);
  });
  it('6mo = 180 days', () => {
    expect(windowSinceSec('6mo', NOW)).toBe(Math.floor(NOW / 1000) - 24 * 180 * 3600);
  });
  it('1y = 365 days', () => {
    expect(windowSinceSec('1y', NOW)).toBe(Math.floor(NOW / 1000) - 24 * 365 * 3600);
  });
});
