/**
 * AMOS Ticker Manager — add, edit, or remove individually-tracked tickers.
 *
 * Tickers are persisted to localStorage. Changes immediately trigger a fresh
 * data fetch (prices, RSI, EMA, Gann engines, daily brief, leadership board)
 * across the whole app and automatically appear in the sidebar STOCKS nav.
 */

import { useState, type FormEvent } from 'react';
import GuardrailBanner from '../components/guardrails/GuardrailBanner';
import { useLang } from '../data/LangContext';
import { useLiveData, useLiveDataActions } from '../data/LiveDataContext';
import type { Ticker } from '../data/schemas';

const ROLES: Ticker['role'][] = ['Core', 'Swing', 'Tactical', 'Research'];
const PRIORITIES: Ticker['priority'][] = ['P1', 'P2', 'P3'];
const CLASSIFICATIONS: Ticker['classification'][] = [
  'Leader', 'Leader-Follower', 'Follower', 'Meme-Hybrid', 'Quality-Compounder', 'Speculative'
];

const EMPTY_FORM: Ticker = {
  symbol: '',
  companyName: '',
  role: 'Research',
  priority: 'P3',
  tags: [],
  archetype: '',
  sectorBranch: '',
  classification: 'Speculative'
};

export default function TickerManagerPage() {
  const { t } = useLang();
  const { tickers, liveMap } = useLiveData();
  const { addTicker, removeTicker, updateTicker, resetTickersToDefault, refreshNow } = useLiveDataActions();

  const [form, setForm] = useState<Ticker>({ ...EMPTY_FORM });
  const [tagsRaw, setTagsRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null);
    const tags = tagsRaw.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
    const result = addTicker({ ...form, tags });
    if (!result.ok) {
      setError(result.reason ?? 'Could not add ticker.');
      return;
    }
    setInfo(t.tickerAdded.replace('{sym}', form.symbol.toUpperCase()));
    setForm({ ...EMPTY_FORM });
    setTagsRaw('');
  }

  function handleRemove(sym: string) {
    if (confirm(t.tickerConfirmRemove.replace('{sym}', sym))) {
      removeTicker(sym);
      setInfo(t.tickerRemoved.replace('{sym}', sym));
    }
  }

  function handleReset() {
    if (confirm(t.tickerConfirmReset)) {
      resetTickersToDefault();
      setInfo(t.tickerResetDone);
    }
  }

  return (
    <>
      <div className="card">
        <h1>{t.tickerManagerTitle}</h1>
        <div className="badge badge--gold">{t.tickerManagerSubtitle}</div>{' '}
        <span className="badge badge--cyan">{t.tickerManagerBadge.replace('{n}', String(tickers.length))}</span>{' '}
        <button onClick={refreshNow} className="badge badge--cyan" style={{ cursor: 'pointer' }}>
          ↻ {t.tickerRefreshNow}
        </button>{' '}
        <button onClick={handleReset} className="badge badge--red" style={{ cursor: 'pointer' }}>
          {t.tickerResetToDefault}
        </button>
      </div>

      <GuardrailBanner
        title={t.tickerGuardrailsTitle}
        items={[t.tickerGuardrail1, t.tickerGuardrail2, t.tickerGuardrail3, t.tickerGuardrail4]}
      />

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
        <h2>{t.tickerAddTitle}</h2>
        <p style={{ color: 'var(--fg-mute)', fontSize: 12 }}>{t.tickerAddHint}</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8, marginBottom: 6 }}>
            <Field label={t.tickerSymbol + ' *'}>
              <input
                type="text" required maxLength={10}
                placeholder="e.g. AMD, AVGO, MSTR, BABA"
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
                style={inputStyle}
              />
            </Field>
            <Field label={t.tickerCompanyName}>
              <input
                type="text"
                placeholder="e.g. Advanced Micro Devices"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                style={inputStyle}
              />
            </Field>
            <Field label={t.tickerRole}>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Ticker['role'] })}
                style={inputStyle}
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label={t.tickerPriority}>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Ticker['priority'] })}
                style={inputStyle}
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label={t.tickerClassification}>
              <select
                value={form.classification}
                onChange={(e) => setForm({ ...form, classification: e.target.value as Ticker['classification'] })}
                style={inputStyle}
              >
                {CLASSIFICATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label={t.tickerArchetype}>
              <input
                type="text" placeholder="e.g. AI Infra Leader, BTC-AI Hybrid"
                value={form.archetype}
                onChange={(e) => setForm({ ...form, archetype: e.target.value })}
                style={inputStyle}
              />
            </Field>
            <Field label={t.tickerSector}>
              <input
                type="text" placeholder="e.g. AI Infrastructure / GPU"
                value={form.sectorBranch}
                onChange={(e) => setForm({ ...form, sectorBranch: e.target.value })}
                style={inputStyle}
              />
            </Field>
            <Field label={t.tickerTags}>
              <input
                type="text" placeholder="comma-separated, e.g. AI Infra, Compute"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>
          <button type="submit" className="badge badge--cyan" style={{ cursor: 'pointer', padding: '8px 18px', fontSize: 13 }}>
            ＋ {t.tickerAddButton}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>{t.tickerCurrentTitle.replace('{n}', String(tickers.length))}</h2>
        {tickers.length === 0 ? (
          <div className="badge badge--mute">{t.tickerEmpty}</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t.tickerSymbol}</th>
                <th>{t.tickerCompanyName}</th>
                <th>{t.tickerRole}</th>
                <th>{t.tickerPriority}</th>
                <th>{t.tickerClassification}</th>
                <th>{t.tickerArchetype}</th>
                <th>{t.tickerLiveStatus}</th>
                <th>{t.ytActions}</th>
              </tr>
            </thead>
            <tbody>
              {tickers.map((tk) => {
                const live = liveMap.get(tk.symbol);
                return (
                  <tr key={tk.symbol}>
                    <td><strong>{tk.symbol}</strong></td>
                    <td style={{ fontSize: 12 }}>
                      <input
                        type="text"
                        value={tk.companyName}
                        onChange={(e) => updateTicker(tk.symbol, { companyName: e.target.value })}
                        style={{ ...inputStyle, padding: '3px 6px', fontSize: 12 }}
                      />
                    </td>
                    <td>
                      <select
                        value={tk.role}
                        onChange={(e) => updateTicker(tk.symbol, { role: e.target.value as Ticker['role'] })}
                        style={{ ...inputStyle, padding: '3px 6px', fontSize: 12 }}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        value={tk.priority}
                        onChange={(e) => updateTicker(tk.symbol, { priority: e.target.value as Ticker['priority'] })}
                        style={{ ...inputStyle, padding: '3px 6px', fontSize: 12 }}
                      >
                        {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        value={tk.classification}
                        onChange={(e) => updateTicker(tk.symbol, { classification: e.target.value as Ticker['classification'] })}
                        style={{ ...inputStyle, padding: '3px 6px', fontSize: 12 }}
                      >
                        {CLASSIFICATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--fg-mute)' }}>{tk.archetype}</td>
                    <td>
                      {live ? (
                        <span className="badge badge--green" title={live.fetchedAt}>
                          ${live.quote.regularMarketPrice.toFixed(2)}
                        </span>
                      ) : (
                        <span className="badge badge--mute">{t.tickerNoLive}</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleRemove(tk.symbol)}
                        className="badge badge--red"
                        style={{ cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  background: '#0a0f17',
  color: 'var(--fg)',
  border: '1px solid var(--border)',
  borderRadius: 4,
  fontFamily: 'var(--mono)',
  fontSize: 13
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ fontSize: 11, color: 'var(--fg-mute)', display: 'block', marginBottom: 2 }}>
        {label}
      </span>
      {children}
    </label>
  );
}
