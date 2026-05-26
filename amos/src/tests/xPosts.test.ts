import { describe, it, expect } from 'vitest';
import {
  parsePostUrl,
  canonicalPostUrl,
  parseManualPaste,
  searchPosts,
  tokenize,
  formatRelativeTime,
  type XPost
} from '../data/xPosts';

describe('parsePostUrl', () => {
  it('parses x.com', () => {
    expect(parsePostUrl('https://x.com/elonmusk/status/1234567890123456789'))
      .toEqual({ author: 'elonmusk', id: '1234567890123456789' });
  });
  it('parses twitter.com', () => {
    expect(parsePostUrl('https://twitter.com/cathiedwood/status/1111111111111111111'))
      .toEqual({ author: 'cathiedwood', id: '1111111111111111111' });
  });
  it('parses mobile + www variants', () => {
    expect(parsePostUrl('https://mobile.x.com/abc/status/9999999999999999'))
      .toEqual({ author: 'abc', id: '9999999999999999' });
  });
  it('parses Nitter mirror URL', () => {
    expect(parsePostUrl('https://nitter.net/jack/status/2222222222222222'))
      .toEqual({ author: 'jack', id: '2222222222222222' });
  });
  it('accepts bare numeric ID', () => {
    expect(parsePostUrl('1234567890123456789'))
      .toEqual({ author: '', id: '1234567890123456789' });
  });
  it('rejects garbage', () => {
    expect(parsePostUrl('hello world')).toBe(null);
    expect(parsePostUrl('')).toBe(null);
    expect(parsePostUrl('https://example.com/foo')).toBe(null);
  });
});

describe('canonicalPostUrl', () => {
  it('builds full URL', () => {
    expect(canonicalPostUrl('elon', '123')).toBe('https://x.com/elon/status/123');
  });
  it('uses i when author missing', () => {
    expect(canonicalPostUrl('', '123')).toBe('https://x.com/i/status/123');
  });
});

describe('parseManualPaste', () => {
  it('parses plain text', () => {
    const p = parseManualPaste('NVDA earnings looks like a beat')!;
    expect(p.text).toContain('NVDA');
    expect(p.author).toBe('unknown');
    expect(p.source).toBe('manual');
  });
  it('extracts author + url + text', () => {
    const p = parseManualPaste('@elonmusk\nGreat news for X\nhttps://x.com/elonmusk/status/1234567890123456789')!;
    expect(p.author).toBe('elonmusk');
    expect(p.id).toBe('1234567890123456789');
    expect(p.text).toBe('Great news for X');
  });
  it('parses oEmbed JSON', () => {
    const raw = JSON.stringify({
      html: '<blockquote><p lang="en">$NVDA AI demand stays strong</p></blockquote>',
      author_name: '@semiwarrior',
      url: 'https://x.com/semiwarrior/status/4444444444444444444'
    });
    const p = parseManualPaste(raw)!;
    expect(p.author).toBe('semiwarrior');
    expect(p.id).toBe('4444444444444444444');
    expect(p.text).toContain('$NVDA');
  });
  it('strips HTML', () => {
    const p = parseManualPaste('<p>NVDA <a href="x">$NVDA</a> rally</p>')!;
    expect(p.text).toContain('NVDA');
    expect(p.text).not.toContain('<p>');
    expect(p.text).not.toContain('<a');
  });
  it('returns null on empty input', () => {
    expect(parseManualPaste('')).toBe(null);
    expect(parseManualPaste('   ')).toBe(null);
  });
});

describe('tokenize', () => {
  it('preserves $TICKER and @handle', () => {
    const t = tokenize('Buying $NVDA per @semianalysis macro thesis');
    expect(t).toContain('$nvda');
    expect(t).toContain('@semianalysis');
    expect(t).toContain('macro');
  });
});

describe('searchPosts', () => {
  const mk = (id: string, author: string, text: string, tags?: string[]): XPost => ({
    id, url: `https://x.com/${author}/status/${id}`,
    author, text, tags,
    fetchedAt: '2026-05-25T00:00:00Z',
    source: 'manual'
  });
  const lib = [
    mk('1', 'cathiedwood', '$NVDA AI accelerator demand stays strong', ['NVDA', 'AI']),
    mk('2', 'jpmorgan', 'Macro tightening puts pressure on semis'),
    mk('3', 'iren_corp', 'IREN ARR build accelerating; AI infra contracts signed', ['IREN'])
  ];
  it('finds posts by text', () => {
    const hits = searchPosts(lib, 'IREN ARR');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].post.id).toBe('3');
  });
  it('gives bonus to $TICKER hits', () => {
    const hits = searchPosts(lib, '$NVDA');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].post.id).toBe('1');
    expect(hits[0].score).toBeGreaterThanOrEqual(3); // 1 hit + 2 bonus
  });
  it('searches tags and authors', () => {
    expect(searchPosts(lib, '@cathiedwood').length).toBeGreaterThan(0);
    expect(searchPosts(lib, 'NVDA').length).toBeGreaterThan(0);
  });
  it('escapes HTML in highlights', () => {
    const p = mk('h', 'a', '<script>x</script> rally');
    const hits = searchPosts([p], 'rally');
    expect(hits[0].highlightHtml).not.toContain('<script>');
    expect(hits[0].highlightHtml).toContain('&lt;script&gt;');
  });
});

describe('formatRelativeTime', () => {
  it('returns "Ns ago" for recent', () => {
    const recent = new Date(Date.now() - 30 * 1000).toISOString();
    expect(formatRelativeTime(recent)).toMatch(/s ago/);
  });
  it('returns "Nd ago" for days', () => {
    const old = new Date(Date.now() - 5 * 86400 * 1000).toISOString();
    expect(formatRelativeTime(old)).toMatch(/d ago/);
  });
  it('handles invalid input', () => {
    expect(formatRelativeTime('not a date')).toBe('—');
  });
});
