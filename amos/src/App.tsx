import { Route, Routes } from 'react-router-dom';
import AppShell from './components/shell/AppShell';
import { LiveDataProvider } from './data/LiveDataContext';
import { LangProvider } from './data/LangContext';
import MasterIndexPage from './pages/MasterIndexPage';
import GannRegistryPage from './pages/GannRegistryPage';
import StockIntelligencePage from './pages/StockIntelligencePage';
import DailyBriefPage from './pages/DailyBriefPage';
import MacroEventCalendarPage from './pages/MacroEventCalendarPage';
import EvidencePacketPage from './pages/EvidencePacketPage';
import AnchorVerificationPage from './pages/AnchorVerificationPage';
import HomeCommandCenterPage from './pages/HomeCommandCenterPage';
import PortfolioBattleMapPage from './pages/PortfolioBattleMapPage';
import PeerMapPage from './pages/PeerMapPage';
import ManualWorkbookPage from './pages/ManualWorkbookPage';
import YouTubeTranscriptsPage from './pages/YouTubeTranscriptsPage';
import XPostsPage from './pages/XPostsPage';
import TickerManagerPage from './pages/TickerManagerPage';

export default function App() {
  return (
    <LangProvider>
    <LiveDataProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<MasterIndexPage />} />
          <Route path="/command-center" element={<HomeCommandCenterPage />} />
          <Route path="/gann-registry" element={<GannRegistryPage />} />
          <Route path="/stocks/:ticker" element={<StockIntelligencePage />} />
          <Route path="/daily-brief" element={<DailyBriefPage />} />
          <Route path="/events" element={<MacroEventCalendarPage />} />
          <Route path="/evidence" element={<EvidencePacketPage />} />
          <Route path="/anchors" element={<AnchorVerificationPage />} />
          <Route path="/portfolio" element={<PortfolioBattleMapPage />} />
          <Route path="/peer-map" element={<PeerMapPage />} />
          <Route path="/manual-workbook" element={<ManualWorkbookPage />} />
          <Route path="/youtube" element={<YouTubeTranscriptsPage />} />
          <Route path="/x" element={<XPostsPage />} />
          <Route path="/tickers" element={<TickerManagerPage />} />
          <Route path="*" element={<MasterIndexPage />} />
        </Routes>
      </AppShell>
    </LiveDataProvider>
    </LangProvider>
  );
}
