
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomeView from './views/HomeView';
import IncidentsView from './views/IncidentsView';
import ReportIncidentView from './views/ReportIncidentView';
import IncidentDetailView from './views/IncidentDetailView';
import BookingsView from './views/BookingsView';
import WalletView from './views/WalletView';
import CommunityView from './views/CommunityView';
import AccessQRView from './views/AccessQRView';
import { Screen } from './types';

const Navigation: React.FC<{ active: Screen }> = ({ active }) => {
  const navigate = useNavigate();
  const tabs = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'incidents', label: 'Incidencias', icon: 'build_circle' },
    { id: 'bookings', label: 'Reservas', icon: 'calendar_month' },
    { id: 'community', label: 'Comunidad', icon: 'chat_bubble_outline' },
    { id: 'wallet', label: 'Cartera', icon: 'account_balance_wallet' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-8 pt-2 px-4 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => navigate(tab.id === 'home' ? '/' : `/${tab.id}`)}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            active === tab.id ? 'text-primary' : 'text-muted-light'
          }`}
        >
          <span className="material-icons-outlined text-2xl">{tab.icon}</span>
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
      {/* Central Plus Button hack */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <button 
          onClick={() => navigate('/report')}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-icons-outlined text-2xl">add</span>
        </button>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="max-w-md mx-auto bg-background-light min-h-screen relative overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomeWrapper />} />
          <Route path="/incidents" element={<IncidentsWrapper />} />
          <Route path="/incidents/:id" element={<IncidentDetailWrapper />} />
          <Route path="/report" element={<ReportIncidentView />} />
          <Route path="/bookings" element={<BookingsWrapper />} />
          <Route path="/wallet" element={<WalletWrapper />} />
          <Route path="/community" element={<CommunityWrapper />} />
          <Route path="/access-qr" element={<AccessQRView />} />
        </Routes>
      </div>
    </Router>
  );
};

const HomeWrapper = () => (
  <>
    <HomeView />
    <Navigation active="home" />
  </>
);

const IncidentsWrapper = () => (
  <>
    <IncidentsView />
    <Navigation active="incidents" />
  </>
);

const IncidentDetailWrapper = () => (
  <>
    <IncidentDetailView />
    <Navigation active="incidents" />
  </>
);

const BookingsWrapper = () => (
  <>
    <BookingsView />
    <Navigation active="bookings" />
  </>
);

const WalletWrapper = () => (
  <>
    <WalletView />
    <Navigation active="wallet" />
  </>
);

const CommunityWrapper = () => (
  <>
    <CommunityView />
    <Navigation active="community" />
  </>
);

export default App;
