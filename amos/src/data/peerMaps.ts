/**
 * AMOS Peer Maps — per-ticker peer cohorts for "Portfolio Battle Map" and
 * "Capital Migration" decisions (single-jianwei doctrine: 资金从弱标的迁移到强标的).
 *
 * Peers are research classifications, NOT investment advice.
 */

export interface PeerCohort {
  ticker: string;
  archetype: string; // e.g. "AI Infra Leader"
  branch: string;   // e.g. "GPU"
  peers: { symbol: string; relation: 'leader' | 'follower' | 'laggard' | 'adjacent'; note?: string }[];
}

export const PEER_MAP: Record<string, PeerCohort> = {
  NVDA: {
    ticker: 'NVDA',
    archetype: 'AI Infra Leader (GPU)',
    branch: 'AI Compute / GPU',
    peers: [
      { symbol: 'AMD', relation: 'follower', note: 'Closest accelerator peer' },
      { symbol: 'AVGO', relation: 'adjacent', note: 'AI ASIC + networking' },
      { symbol: 'TSM', relation: 'adjacent', note: 'GPU foundry' },
      { symbol: 'MRVL', relation: 'laggard', note: 'Custom ASIC' }
    ]
  },
  CRDO: {
    ticker: 'CRDO',
    archetype: 'AI Connectivity (SerDes/AEC)',
    branch: 'AI Networking / Optical-SerDes',
    peers: [
      { symbol: 'AVGO', relation: 'leader', note: 'Networking ASIC king' },
      { symbol: 'MRVL', relation: 'adjacent', note: 'Custom silicon for AI' },
      { symbol: 'LITE', relation: 'adjacent', note: 'Optical components' },
      { symbol: 'CIEN', relation: 'follower', note: 'Optical networking' }
    ]
  },
  LITE: {
    ticker: 'LITE',
    archetype: 'AI Optics (CPO)',
    branch: 'AI Infrastructure / Optical-CPO',
    peers: [
      { symbol: 'COHR', relation: 'leader', note: 'Datacom transceivers' },
      { symbol: 'AAOI', relation: 'follower', note: 'AI transceivers' },
      { symbol: 'FN', relation: 'adjacent', note: 'Optical manufacturing' },
      { symbol: 'NVDA', relation: 'adjacent', note: 'Demand engine' }
    ]
  },
  IREN: {
    ticker: 'IREN',
    archetype: 'BTC-AI Compute Hybrid',
    branch: 'BTC Miner / AI Compute Pivot',
    peers: [
      { symbol: 'CIFR', relation: 'leader', note: 'AI compute pivot' },
      { symbol: 'CORZ', relation: 'follower', note: 'AI/HPC pivot' },
      { symbol: 'WULF', relation: 'follower', note: 'AI compute pivot' },
      { symbol: 'MARA', relation: 'adjacent', note: 'Pure BTC miner' },
      { symbol: 'RIOT', relation: 'adjacent', note: 'Pure BTC miner' }
    ]
  },
  HOOD: {
    ticker: 'HOOD',
    archetype: 'Retail-Crypto Fintech',
    branch: 'Fintech / Crypto-Adjacent',
    peers: [
      { symbol: 'COIN', relation: 'leader', note: 'Crypto venue' },
      { symbol: 'SQ', relation: 'adjacent', note: 'Payments + Bitcoin' },
      { symbol: 'SOFI', relation: 'follower', note: 'Retail fintech' },
      { symbol: 'IBKR', relation: 'adjacent', note: 'Broker' }
    ]
  }
};

export function getPeerCohort(symbol: string): PeerCohort | null {
  return PEER_MAP[symbol.toUpperCase()] ?? null;
}
