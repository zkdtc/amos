// Local JSON loaders. No live APIs.

import type {
  AnchorVerification,
  DailyBrief,
  EvidencePacket,
  GannRegistry,
  MacroEvent,
  ManualInput,
  MasterIndex,
  Ticker
} from './schemas';

const base = (path: string) => `${import.meta.env.BASE_URL || '/'}sample-data/${path}`;

async function loadJSON<T>(path: string): Promise<T> {
  const res = await fetch(base(path));
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return (await res.json()) as T;
}

export const loadMasterIndex = () => loadJSON<MasterIndex>('master-index.json');
export const loadTickers = () =>
  loadJSON<{ tickers: Ticker[] }>('tickers.json').then((d) => d.tickers);
export const loadGannRegistry = () => loadJSON<GannRegistry>('gann-registry.json');
export const loadDailyBrief = () => loadJSON<DailyBrief>('daily-brief.json');
export const loadEvents = () =>
  loadJSON<{ events: MacroEvent[] }>('events.json').then((d) => d.events);
export const loadEvidence = () =>
  loadJSON<{ packets: EvidencePacket[] }>('evidence.json').then((d) => d.packets);
export const loadAnchors = () =>
  loadJSON<{ anchors: AnchorVerification[] }>('anchors.json').then((d) => d.anchors);
export const loadManualInputs = () =>
  loadJSON<{ inputs: ManualInput[] }>('manual-inputs.json').then((d) => d.inputs);
