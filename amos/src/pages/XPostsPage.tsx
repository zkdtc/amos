/**
 * AMOS X (Twitter) Posts page.
 *
 * Three input modes:
 *   1. Paste a URL → server tries Nitter / syndication
 *   2. Paste raw text/HTML/JSON → parsed locally as a manual entry
 *   3. Search across loaded posts (across all fields)
 *
 * Like YouTube transcripts, posts are RESEARCH ONLY.
 */

import { useEffect, useMemo, useState } from 'react';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import { useLang } from '../data/LangContext';
import {
  canonicalPostUrl,
  fetchPost,
  formatRelativeTime,
  isValidHandle,
  loadFollows,
  loadLibrary,
  mergePosts,
  normaliseHandle,
  parseManualPaste,
  parsePostUrl,
  saveFollows,
  saveLibrary,
  hydrateLibraryFromDisk,
  hydrateFollowsFromDisk,
  scanProfile,
  searchPosts,
  filterPostsByWindow,
  SCAN_WINDOWS,
  type ScanWindow,
  type XFollow,
  type XPost,
  type XSearchHit
} from '../data/xPosts';

export default function XPostsPage() {
  const { t } = useLang();
  const [library, setLibrary] = useState<XPost[]>(() => loadLibrary());
  const [follows, setFollows] = useState<XFollow[]>(() => loadFollows());
  const [followInput, setFollowInput] = useState('');
  const [scanInfo, setScanInfo] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [pasteInput, setPasteInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [query, setQuery] = useState('');
  const [scanWindow, setScanWindow] = useState<ScanWindow>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => { saveLibrary(library); }, [library]);
  useEffect(() => { saveFollows(follows); }, [follows]);

  // On mount: hydrate from disk → merge with localStorage
  useEffect(() => {
    void hydrateLibraryFromDisk().then(setLibrary);
    void hydrateFollowsFromDisk().then(setFollows);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-scan timer: every 15 minutes scan all enabled follows
  useEffect(() => {
    if (follows.length === 0) return;
    const id = setInterval(() => { void scanAllFollows(); }, 15 * 60 * 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(follows.filter(f => f.enabled).map(f => f.handle)), scanWindow]);

  // ── Follow-list actions ───────────────────────────────────────────
  function handleAddFollow() {
    const h = normaliseHandle(followInput);
    if (!isValidHandle(h)) { setError(t.xFollowInvalid); return; }
    if (follows.some(f => f.handle.toLowerCase() === h.toLowerCase())) {
      setError(t.xFollowAlready.replace('{h}', h));
      return;
    }
    setFollows(prev => [...prev, { handle: h, addedAt: new Date().toISOString(), enabled: true }]);
    setFollowInput('');
    setError(null);
  }
  function handleRemoveFollow(h: string) {
    setFollows(prev => prev.filter(f => f.handle !== h));
  }
  function handleToggleFollow(h: string) {
    setFollows(prev => prev.map(f => f.handle === h ? { ...f, enabled: !f.enabled } : f));
  }
  async function scanOne(handle: string, addedSoFar: { count: number }, window: ScanWindow) {
    try {
      // Always fetch ALL available posts from Nitter (no since-filter on fetch).
      // The display library view is filtered by `scanWindow`; storage keeps everything.
      const posts = await scanProfile(handle, { limit: 50 });
      setLibrary(prev => {
        const merged = mergePosts(prev, posts);
        addedSoFar.count += merged.length - prev.length;
        return merged;
      });
      setFollows(prev => prev.map(f => f.handle === handle
        ? { ...f, lastScanAt: new Date().toISOString(), lastError: undefined }
        : f));
    } catch (e) {
      const msg = (e as Error).message;
      setFollows(prev => prev.map(f => f.handle === handle
        ? { ...f, lastScanAt: new Date().toISOString(), lastError: msg }
        : f));
    }
  }
  async function scanAllFollows() {
    if (scanning) return;
    setScanning(true); setScanInfo(t.xScanRunning); setError(null);
    const enabled = follows.filter(f => f.enabled);
    const added = { count: 0 };
    for (const f of enabled) {
      // 800 ms stagger to be polite to the syndication CDN
      await new Promise(r => setTimeout(r, 800));
      await scanOne(f.handle, added, scanWindow);
    }
    setScanning(false);
    setScanInfo(t.xScanDone.replace('{n}', String(enabled.length)).replace('{added}', String(added.count)));
  }
  async function scanSingleFollow(handle: string) {
    setScanning(true); setScanInfo(null); setError(null);
    const added = { count: 0 };
    await scanOne(handle, added, scanWindow);
    setScanning(false);
    setScanInfo(t.xScanOneDone.replace('{h}', handle).replace('{added}', String(added.count)));
  }

  const hits = useMemo<XSearchHit[]>(
    () => (query.trim() ? searchPosts(library, query) : []),
    [library, query]
  );

  const recentPosts = useMemo(
    () => filterPostsByWindow(library, scanWindow).sort(
      (a, b) => +new Date(b.fetchedAt) - +new Date(a.fetchedAt)
    ),
    [library, scanWindow]
  );

  async function handleFetchUrl() {
    setError(null); setInfo(null);
    const parsed = parsePostUrl(urlInput);
    if (!parsed) { setError(t.xInvalidUrl); return; }
    if (library.some((p) => p.id === parsed.id)) {
      setInfo(t.xAlreadyInLibrary.replace('{id}', parsed.id));
      return;
    }
    setLoading(true);
    try {
      const post = await fetchPost(urlInput);
      if (tagInput.trim()) post.tags = tagInput.split(/[,\s]+/).filter(Boolean);
      setLibrary((prev) => [post, ...prev]);
      setUrlInput(''); setTagInput('');
      setInfo(t.xLoaded.replace('{source}', post.source).replace('{author}', post.author));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleManualPaste() {
    setError(null); setInfo(null);
    const post = parseManualPaste(pasteInput);
    if (!post) { setError(t.xInvalidPaste); return; }
    if (tagInput.trim()) post.tags = tagInput.split(/[,\s]+/).filter(Boolean);
    if (library.some((p) => p.id === post.id)) {
      setInfo(t.xAlreadyInLibrary.replace('{id}', post.id));
      return;
    }
    setLibrary((prev) => [post, ...prev]);
    setPasteInput(''); setTagInput('');
    setInfo(t.xManualLoaded.replace('{n}', String(post.text.length)));
  }

  function handleRemove(id: string) {
    setLibrary((prev) => prev.filter((p) => p.id !== id));
  }

  function handleClear() {
    if (confirm(t.xConfirmClear)) {
      setLibrary([]); setQuery('');
    }
  }

  return (
    <>
      <div className="card">
        <h1>{t.xPageTitle}</h1>
        <div className="badge badge--gold">{t.xPageSubtitle}</div>{' '}
        <div className="badge badge--cyan">{t.xPageBadge}</div>
      </div>

      <GuardrailBanner
        title={t.xGuardrailsTitle}
        items={[t.xGuardrail1, t.xGuardrail2, t.xGuardrail3, t.xGuardrail4]}
      />

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ margin: 0 }}>{t.xFollowListTitle} ({follows.length})</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-mute)' }}>{t.xScanWindowLabel}:</span>
            <div className="seg" role="tablist" aria-label={t.xScanWindowLabel}>
              {SCAN_WINDOWS.map(w => (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => setScanWindow(w.value)}
                  className={'seg-btn' + (scanWindow === w.value ? ' seg-btn--active' : '')}
                  style={{
                    cursor: 'pointer',
                    padding: '4px 10px',
                    background: scanWindow === w.value ? 'var(--cyan)' : 'transparent',
                    color: scanWindow === w.value ? '#0a0f17' : 'var(--fg)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    fontWeight: scanWindow === w.value ? 600 : 400
                  }}
                  title={t.xScanWindowHint}
                >
                  {(t as any)[w.labelKey] || w.value}
                </button>
              ))}
            </div>
            <button
              onClick={() => { void scanAllFollows(); }}
              disabled={scanning || follows.length === 0}
              className="badge badge--cyan"
              style={{ cursor: 'pointer', padding: '6px 14px' }}
            >
              {scanning ? t.xScanRunning : `↻ ${t.xScanAllNow}`}
            </button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--fg-mute)' }}>{t.xFollowHint}</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <input
            type="text"
            value={followInput}
            onChange={e => setFollowInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddFollow(); }}
            placeholder="@handle (e.g. cathiedwood, semianalysis_, elonmusk)"
            style={{ flex: 1, padding: '6px 10px', background: '#0a0f17', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 13 }}
          />
          <button onClick={handleAddFollow} className="badge badge--cyan" style={{ cursor: 'pointer', padding: '6px 14px' }}>
            ＋ {t.xFollowAdd}
          </button>
        </div>
        {scanInfo && (
          <div className="badge badge--green" style={{ marginBottom: 6 }}>✓ {scanInfo}</div>
        )}
        {follows.length === 0 ? (
          <div className="badge badge--mute">{t.xFollowEmpty}</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: 30 }}>{t.xFollowEnabled}</th>
                <th>{t.xAuthor}</th>
                <th>{t.xFollowLastScan}</th>
                <th>{t.xFollowStatus}</th>
                <th>{t.ytActions}</th>
              </tr>
            </thead>
            <tbody>
              {follows.map(f => (
                <tr key={f.handle}>
                  <td>
                    <input type="checkbox" checked={f.enabled} onChange={() => handleToggleFollow(f.handle)} />
                  </td>
                  <td>
                    <a href={`https://x.com/${f.handle}`} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>
                      @{f.handle}
                    </a>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--fg-mute)' }}>
                    {f.lastScanAt ? formatRelativeTime(f.lastScanAt) : t.xFollowNever}
                  </td>
                  <td>
                    {f.lastError
                      ? <span className="badge badge--red" title={f.lastError}>err</span>
                      : f.lastScanAt
                        ? <span className="badge badge--green">ok</span>
                        : <span className="badge badge--mute">—</span>}
                  </td>
                  <td>
                    <button onClick={() => { void scanSingleFollow(f.handle); }} className="badge badge--cyan" style={{ cursor: 'pointer' }}>↻</button>{' '}
                    <button onClick={() => handleRemoveFollow(f.handle)} className="badge badge--red" style={{ cursor: 'pointer' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>{t.xAddViaUrl}</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-mute)' }}>{t.xUrlHint}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleFetchUrl(); }}
            placeholder={t.xUrlPlaceholder}
            style={{ flex: 1, minWidth: 320, padding: '6px 10px', background: '#0a0f17', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 13 }}
          />
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder={t.xTagsPlaceholder}
            style={{ width: 160, padding: '6px 10px', background: '#0a0f17', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13 }}
          />
          <button
            className="badge badge--cyan"
            onClick={handleFetchUrl}
            disabled={loading || !urlInput.trim()}
            style={{ cursor: 'pointer', padding: '6px 14px' }}
          >
            {loading ? t.ytLoading : t.xFetchPost}
          </button>
        </div>
      </div>

      <div className="card">
        <h2>{t.xManualPaste}</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-mute)' }}>{t.xManualHint}</p>
        <textarea
          value={pasteInput}
          onChange={(e) => setPasteInput(e.target.value)}
          placeholder={t.xManualPlaceholder}
          rows={6}
          style={{ width: '100%', padding: 8, background: '#0a0f17', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 13 }}
        />
        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder={t.xTagsPlaceholder}
            style={{ width: 220, padding: '6px 10px', background: '#0a0f17', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13 }}
          />
          <button
            className="badge badge--cyan"
            onClick={handleManualPaste}
            disabled={!pasteInput.trim()}
            style={{ cursor: 'pointer', padding: '6px 14px' }}
          >
            {t.xParsePaste}
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ borderLeft: '3px solid var(--red)' }}>
          <span className="badge badge--red">⚠ {error}</span>
        </div>
      )}
      {info && (
        <div className="card" style={{ borderLeft: '3px solid var(--green)' }}>
          <span className="badge badge--green">✓ {info}</span>
        </div>
      )}

      <div className="card">
        <h2>{t.xSearchTitle}</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.xSearchPlaceholder}
          style={{ width: '100%', padding: '8px 12px', background: '#0a0f17', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 14, marginBottom: 10 }}
        />
        {query.trim() && (
          <div style={{ color: 'var(--fg-mute)', fontSize: 12, marginBottom: 8 }}>
            {t.xSearchHits.replace('{n}', String(hits.length)).replace('{lib}', String(library.length))}
          </div>
        )}
        {hits.length > 0 && (
          <table>
            <thead>
              <tr>
                <th style={{ width: 70 }}>{t.ytScore}</th>
                <th style={{ width: 140 }}>{t.xAuthor}</th>
                <th>{t.xText}</th>
                <th style={{ width: 110 }}>{t.xWhen}</th>
                <th style={{ width: 80 }}>{t.ytOpen}</th>
              </tr>
            </thead>
            <tbody>
              {hits.map((h) => (
                <tr key={h.post.id}>
                  <td><span className="badge badge--gold">{h.score}</span></td>
                  <td style={{ fontSize: 12 }}>
                    <a href={`https://x.com/${h.post.author}`} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>
                      @{h.post.author}
                    </a>
                    {h.post.authorDisplay && <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{h.post.authorDisplay}</div>}
                  </td>
                  <td>
                    <span dangerouslySetInnerHTML={{ __html: h.highlightHtml }} />
                    {h.post.tags && h.post.tags.length > 0 && (
                      <div style={{ marginTop: 4 }}>
                        {h.post.tags.map((tg) => <span key={tg} className="tag" style={{ marginRight: 4 }}>{tg}</span>)}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--fg-mute)' }}>
                    {h.post.createdAt ? formatRelativeTime(h.post.createdAt) : formatRelativeTime(h.post.fetchedAt)}
                  </td>
                  <td>
                    <a href={h.post.url} target="_blank" rel="noreferrer" className="badge badge--cyan">
                      ↗ x.com
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
          <h2 style={{ margin: 0 }}>{t.xLibrary.replace('{n}', String(library.length))}</h2>
          {library.length > 0 && (
            <button onClick={handleClear} className="badge badge--red" style={{ cursor: 'pointer' }}>
              {t.ytClearLibrary}
            </button>
          )}
        </div>
        {library.length === 0 ? (
          <div className="badge badge--mute" style={{ marginTop: 8 }}>{t.xEmptyLibrary}</div>
        ) : (
          <table style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>{t.xAuthor}</th>
                <th>{t.xText}</th>
                <th>{t.xSource}</th>
                <th>{t.ytFetched}</th>
                <th>{t.ytActions}</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontSize: 12 }}>
                    <a href={`https://x.com/${p.author}`} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>
                      @{p.author}
                    </a>
                    {p.authorDisplay && <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{p.authorDisplay}</div>}
                  </td>
                  <td style={{ fontSize: 13 }}>
                    <div style={{
                      fontSize: 10, fontFamily: 'var(--mono)',
                      color: 'var(--fg-mute)', marginBottom: 4
                    }}>
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York'
                          }) + ' ET'
                        : p.fetchedAt
                          ? 'fetched ' + p.fetchedAt.slice(0, 16).replace('T', ' ') + ' UTC'
                          : ''}
                    </div>
                    {p.text.length > 240 ? p.text.slice(0, 240) + '…' : p.text}
                    {p.tags && p.tags.length > 0 && (
                      <div style={{ marginTop: 4 }}>
                        {p.tags.map((tg) => <span key={tg} className="tag" style={{ marginRight: 4 }}>{tg}</span>)}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${sourceBadge(p.source)}`}>{p.source}</span>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--fg-mute)' }}>
                    {formatRelativeTime(p.fetchedAt)}
                  </td>
                  <td>
                    <a href={p.url || canonicalPostUrl(p.author, p.id)} target="_blank" rel="noreferrer" className="badge badge--cyan">↗</a>{' '}
                    <button onClick={() => handleRemove(p.id)} className="badge badge--red" style={{ cursor: 'pointer' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function sourceBadge(s: XPost['source']): string {
  switch (s) {
    case 'nitter':       return 'badge--cyan';
    case 'syndication':  return 'badge--gold';
    case 'manual':       return 'badge--mute';
  }
}
