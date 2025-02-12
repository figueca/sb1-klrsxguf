import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/shell';
import { DashboardPage } from './pages/dashboard';
import { AgendaPage } from './pages/agenda';
import { PacientesPage } from './pages/pacientes';
import { MarketingPage } from './pages/marketing';
import { ComunicacaoPage } from './pages/comunicacao';
import { TelemedicinaPage } from './pages/telemedicina';
import { FinanceiroPage } from './pages/financeiro';
import { RelatoriosPage } from './pages/relatorios';
import { ConfiguracoesPage } from './pages/configuracoes';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Shell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/comunicacao" element={<ComunicacaoPage />} />
            <Route path="/telemedicina" element={<TelemedicinaPage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="/configuracoes" element={<ConfiguracoesPage />} />
          </Routes>
        </Shell>
      </Router>
    </ThemeProvider>
  );
}

export default App;