import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
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

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Shell />}>
      <Route index element={<DashboardPage />} />
      <Route path="agenda" element={<AgendaPage />} />
      <Route path="pacientes" element={<PacientesPage />} />
      <Route path="marketing" element={<MarketingPage />} />
      <Route path="comunicacao" element={<ComunicacaoPage />} />
      <Route path="telemedicina" element={<TelemedicinaPage />} />
      <Route path="financeiro" element={<FinanceiroPage />} />
      <Route path="relatorios" element={<RelatoriosPage />} />
      <Route path="configuracoes" element={<ConfiguracoesPage />} />
    </Route>
  )
);