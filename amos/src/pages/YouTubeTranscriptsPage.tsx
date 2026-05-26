/**
 * AMOS YouTube Transcripts page.
 *
 * Lets you:
 *   - Paste a YouTube URL (or video ID) → fetches the transcript via the
 *     Vite-proxied timedtext endpoint.
 *   - Stores the transcript in localStorage so the library persists.
 *   - Search across ALL loaded transcripts. Results show the matched cue
 *     with a clickable timestamp that opens YouTube at that second.
 *
 * Research-only: transcripts are evidence candidates, never trade signals.
 */

import { useEffect, useMemo, useState } from 'react';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import { useLang } from '../data/LangContext';
import {
  extractVideoId,
  fetchTranscript,
  formatTimestamp,
  loadLibrary,
  saveLibrary,
  hydrateYTLibraryFromDisk,
  searchTranscripts,
  youtubeWatchUrl,
  type SearchHit,
  type VideoTranscript
} from '../data/youtubeTranscript';

export default function YouTubeTranscriptsPage() {
  const { t } = useLang();
  const [library, setLibrary] = useState<VideoTranscript[]>(() => loadLibrary());
  const [urlInput, setUrlInput] = useState('');
  const [langInput, setLangInput] = useState<'en' | 'zh' | 'auto'>('auto');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [openedVideoId, setOpenedVideoId] = useState<string | null>(null);

  // Persist whenever library changes
  useEffect(() => { saveLibrary(library); }, [library]);

  // On mount: hydrate from disk → merge with localStorage
  useEffect(() => {
    void hydrateYTLibraryFromDisk().then(merged => {
      if (merged.length > 0) setLibrary(merged);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hits = useMemo<SearchHit[]>(
    () => (query.trim() ? searchTranscripts(library, query) : []),
    [library, query]
  );

  async function handleAdd() {
    setError(null);
    setInfo(null);
    const id = extractVideoId(urlInput);
    if (!id) {
      setError(t.ytInvalidUrl);
      return;
    }
    if (library.some((v) => v.videoId === id)) {
      setInfo(t.ytAlreadyInLibrary.replace('{id}', id));
      return;
    }
    setLoading(true);
    try {
      const preferred =
        langInput === 'auto' ? (navigator.language?.startsWith('zh') ? 'zh' : 'en')
        : langInput;
      const v = await fetchTranscript(id, preferred);
      setLibrary((prev) => [v, ...prev]);
      setUrlInput('');
      setInfo(t.ytLoaded.replace('{title}', v.title).replace('{n}', String(v.cues.length)));
      setOpenedVideoId(v.videoId);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleRemove(videoId: string) {
    setLibrary((prev) => prev.filter((v) => v.videoId !== videoId));
    if (openedVideoId === videoId) setOpenedVideoId(null);
  }

  function handleClear() {
    if (confirm(t.ytConfirmClear)) {
      setLibrary([]);
      setOpenedVideoId(null);
      setQuery('');
    }
  }

  const openedVideo = openedVideoId
    ? library.find((v) => v.videoId === openedVideoId) ?? null
    : null;

  return (
    <>
      <div className="card">
        <h1>{t.ytPageTitle}</h1>
        <div className="badge badge--gold">{t.ytPageSubtitle}</div>{' '}
        <div className="badge badge--cyan">{t.ytPageBadge}</div>
      </div>

      <GuardrailBanner
        title={t.ytGuardrailsTitle}
        items={[
          t.ytGuardrail1,
          t.ytGuardrail2,
          t.ytGuardrail3,
          t.ytGuardrail4
        ]}
      />

      <div className="card">
        <h2>{t.ytAddVideo}</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder={t.ytUrlPlaceholder}
            style={{ flex: 1, minWidth: 320, padding: '6px 10px', background: '#0a0f17', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 13 }}
          />
          <select
            value={langInput}
            onChange={(e) => setLangInput(e.target.value as 'en' | 'zh' | 'auto')}
            style={{ padding: '6px 10px', background: '#0a0f17', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 4 }}
          >
            <option value="auto">{t.ytLangAuto}</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
          <button
            className="badge badge--cyan"
            onClick={handleAdd}
            disabled={loading || !urlInput.trim()}
            style={{ cursor: 'pointer', padding: '6px 14px' }}
          >
            {loading ? t.ytLoading : t.ytFetchTranscript}
          </button>
        </div>
        {error && (
          <div className="badge badge--red" style={{ marginTop: 8 }}>
            ⚠ {error}
          </div>
        )}
        {info && (
          <div className="badge badge--green" style={{ marginTop: 8 }}>
            ✓ {info}
          </div>
        )}
      </div>

      <div className="card">
        <h2>{t.ytSearchTitle}</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.ytSearchPlaceholder}
          style={{ width: '100%', padding: '8px 12px', background: '#0a0f17', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 14, marginBottom: 10 }}
        />
        {query.trim() && (
          <div style={{ color: 'var(--fg-mute)', fontSize: 12, marginBottom: 8 }}>
            {t.ytSearchHits.replace('{n}', String(hits.length)).replace('{lib}', String(library.length))}
          </div>
        )}
        {hits.length > 0 && (
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>{t.ytScore}</th>
                <th style={{ width: 80 }}>{t.ytTime}</th>
                <th>{t.ytSnippet}</th>
                <th style={{ width: 200 }}>{t.ytVideo}</th>
                <th style={{ width: 80 }}>{t.ytJump}</th>
              </tr>
            </thead>
            <tbody>
              {hits.map((h, i) => (
                <tr key={`${h.video.videoId}:${h.cueIndex}:${i}`}>
                  <td><span className="badge badge--gold">{h.score}</span></td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{formatTimestamp(h.cue.start)}</td>
                  <td>
                    <span dangerouslySetInnerHTML={{ __html: h.highlightHtml }} />
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--fg-mute)' }}>
                    <a
                      onClick={(e) => { e.preventDefault(); setOpenedVideoId(h.video.videoId); }}
                      href="#"
                      style={{ color: 'var(--cyan)' }}
                    >
                      {h.video.title}
                    </a>
                    {h.video.channel && <div style={{ fontSize: 11 }}>{h.video.channel}</div>}
                  </td>
                  <td>
                    <a href={h.jumpUrl} target="_blank" rel="noreferrer" className="badge badge--cyan">
                      ▶ {t.ytOpen}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{t.ytLibrary.replace('{n}', String(library.length))}</h2>
          {library.length > 0 && (
            <button onClick={handleClear} className="badge badge--red" style={{ cursor: 'pointer' }}>
              {t.ytClearLibrary}
            </button>
          )}
        </div>
        {library.length === 0 ? (
          <div className="badge badge--mute" style={{ marginTop: 8 }}>{t.ytEmptyLibrary}</div>
        ) : (
          <table style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>{t.ytTitle}</th>
                <th>{t.ytChannel}</th>
                <th>{t.ytLanguage}</th>
                <th>{t.ytCues}</th>
                <th>{t.ytFetched}</th>
                <th>{t.ytActions}</th>
              </tr>
            </thead>
            <tbody>
              {library.map((v) => (
                <tr key={v.videoId}>
                  <td>
                    <a onClick={(e) => { e.preventDefault(); setOpenedVideoId(v.videoId); }} href="#" style={{ color: 'var(--cyan)' }}>
                      {v.title}
                    </a>
                    <div style={{ fontSize: 11, color: 'var(--fg-mute)', fontFamily: 'var(--mono)' }}>
                      {v.videoId}
                    </div>
                  </td>
                  <td style={{ fontSize: 12 }}>{v.channel ?? '—'}</td>
                  <td><span className="badge badge--mute">{v.language}</span></td>
                  <td>{v.cues.length}</td>
                  <td style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{new Date(v.fetchedAt).toLocaleString()}</td>
                  <td>
                    <a href={youtubeWatchUrl(v.videoId)} target="_blank" rel="noreferrer" className="badge badge--cyan">▶</a>{' '}
                    <button onClick={() => handleRemove(v.videoId)} className="badge badge--red" style={{ cursor: 'pointer' }}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {openedVideo && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0 }}>{openedVideo.title}</h2>
            <a href={youtubeWatchUrl(openedVideo.videoId)} target="_blank" rel="noreferrer" className="badge badge--cyan">
              ▶ {t.ytOpenInYouTube}
            </a>
          </div>
          {openedVideo.channel && (
            <div style={{ color: 'var(--fg-mute)', fontSize: 12, marginBottom: 8 }}>{openedVideo.channel}</div>
          )}
          <div style={{ maxHeight: 480, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 4, padding: 8 }}>
            {openedVideo.cues.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '3px 0' }}>
                <a
                  href={youtubeWatchUrl(openedVideo.videoId, c.start)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--cyan)', minWidth: 60 }}
                >
                  {formatTimestamp(c.start)}
                </a>
                <span style={{ fontSize: 13 }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
