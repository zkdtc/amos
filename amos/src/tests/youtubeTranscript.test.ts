import { describe, it, expect } from 'vitest';
import {
  extractVideoId,
  parseTimedtextJson3,
  searchTranscripts,
  tokenize,
  formatTimestamp,
  youtubeWatchUrl,
  type VideoTranscript
} from '../data/youtubeTranscript';

describe('extractVideoId', () => {
  it('parses standard /watch?v= URL', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });
  it('parses youtu.be short URL', () => {
    expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ?si=abc')).toBe('dQw4w9WgXcQ');
  });
  it('parses /embed/<id>', () => {
    expect(extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });
  it('parses /shorts/<id>', () => {
    expect(extractVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });
  it('accepts bare 11-char id', () => {
    expect(extractVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });
  it('returns null for garbage', () => {
    expect(extractVideoId('hello world')).toBe(null);
    expect(extractVideoId('')).toBe(null);
  });
  it('handles URLs with extra query params', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&list=PL123'))
      .toBe('dQw4w9WgXcQ');
  });
});

describe('parseTimedtextJson3', () => {
  it('parses events into cues', () => {
    const raw = JSON.stringify({
      events: [
        { tStartMs: 1000, dDurationMs: 2000, segs: [{ utf8: 'Hello' }, { utf8: ' world' }] },
        { tStartMs: 3500, dDurationMs: 1500, segs: [{ utf8: 'NVDA earnings' }] }
      ]
    });
    const cues = parseTimedtextJson3(raw);
    expect(cues.length).toBeGreaterThanOrEqual(1);
    expect(cues[0].text).toContain('Hello world');
    expect(cues[cues.length - 1].text).toContain('NVDA');
  });
  it('drops [Music] cues', () => {
    const raw = JSON.stringify({
      events: [{ tStartMs: 0, dDurationMs: 5000, segs: [{ utf8: '[Music]' }] }]
    });
    expect(parseTimedtextJson3(raw)).toHaveLength(0);
  });
  it('returns empty on invalid JSON', () => {
    expect(parseTimedtextJson3('not json')).toEqual([]);
  });
});

describe('tokenize', () => {
  it('strips stopwords and short tokens', () => {
    expect(tokenize('The NVDA earnings is a major event'))
      .toEqual(['nvda', 'earnings', 'major', 'event']);
  });
  it('keeps $TICKER tokens', () => {
    const toks = tokenize('Watching $NVDA and $CRDO');
    // $TICKER tokens retain the $ so they're distinct from bare ticker words
    expect(toks).toContain('$nvda');
    expect(toks).toContain('$crdo');
    expect(toks).toContain('watching');
  });
});

describe('searchTranscripts', () => {
  const mkVideo = (id: string, cues: Array<[number, string]>): VideoTranscript => ({
    videoId: id,
    url: youtubeWatchUrl(id),
    title: `Video ${id}`,
    fetchedAt: '2026-05-25T00:00:00Z',
    language: 'en',
    source: 'live',
    cues: cues.map(([t, text]) => ({ start: t, duration: 3, text }))
  });

  const videos = [
    mkVideo('aaaaaaaaaaa', [
      [10, 'NVDA earnings beat expectations'],
      [25, 'macro tightening could pressure semis'],
      [40, 'CRDO sees AI infra tailwind']
    ]),
    mkVideo('bbbbbbbbbbb', [
      [5, 'Robinhood crypto volumes are surging'],
      [60, 'NVDA AI accelerator demand stays strong']
    ])
  ];

  it('returns scored hits with jump URLs', () => {
    const hits = searchTranscripts(videos, 'NVDA earnings');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].cue.text).toContain('NVDA');
    expect(hits[0].jumpUrl).toMatch(/t=10s/);
  });
  it('returns empty for no-match query', () => {
    expect(searchTranscripts(videos, 'XYZ-quantum-banana')).toEqual([]);
  });
  it('limits results', () => {
    const hits = searchTranscripts(videos, 'NVDA', 1);
    expect(hits).toHaveLength(1);
  });
  it('escapes HTML in highlight output', () => {
    const v = mkVideo('ccccccccccc', [[1, 'Bad <script>alert(1)</script> tag']]);
    const hits = searchTranscripts([v], 'tag');
    expect(hits[0].highlightHtml).not.toContain('<script>');
    expect(hits[0].highlightHtml).toContain('&lt;script&gt;');
  });
});

describe('formatTimestamp', () => {
  it('mm:ss for <1h', () => {
    expect(formatTimestamp(75)).toBe('1:15');
  });
  it('h:mm:ss for ≥1h', () => {
    expect(formatTimestamp(3665)).toBe('1:01:05');
  });
});

describe('youtubeWatchUrl', () => {
  it('builds base URL', () => {
    expect(youtubeWatchUrl('abc12345678')).toBe('https://www.youtube.com/watch?v=abc12345678');
  });
  it('appends timestamp', () => {
    expect(youtubeWatchUrl('abc12345678', 123.7)).toBe('https://www.youtube.com/watch?v=abc12345678&t=123s');
  });
});
