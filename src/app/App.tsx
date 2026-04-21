import { Routes, Route, Navigate } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Inventory } from './pages/Inventory';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { SOPs } from './pages/SOPs';
import { Learnings } from './pages/Learnings';
import { Checklists } from './pages/Checklists';
import { StudioInfo } from './pages/StudioInfo';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <div className="size-full flex relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Warm analog orbs — soft, blurry, grainy */}
      <div className="absolute pointer-events-none animate-float" style={{ top: '-15%', right: '-10%', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(216,96,64,0.18) 0%, rgba(224,112,96,0.08) 40%, transparent 70%)', animationDuration: '8s', filter: 'blur(8px)' }} />
      <div className="absolute pointer-events-none animate-float" style={{ bottom: '-20%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(152,136,200,0.14) 0%, rgba(152,136,200,0.06) 45%, transparent 70%)', animationDuration: '10s', animationDelay: '2s', filter: 'blur(8px)' }} />
      <div className="absolute pointer-events-none animate-float" style={{ top: '30%', left: '30%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,144,64,0.1) 0%, transparent 65%)', animationDuration: '12s', animationDelay: '4s', filter: 'blur(6px)' }} />
      <div className="absolute pointer-events-none animate-float" style={{ top: '5%', left: '25%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,168,112,0.09) 0%, transparent 65%)', animationDuration: '14s', animationDelay: '1s', filter: 'blur(6px)' }} />
      <div className="absolute pointer-events-none animate-float" style={{ bottom: '5%', right: '15%', width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,192,112,0.08) 0%, transparent 65%)', animationDuration: '11s', animationDelay: '3s', filter: 'blur(6px)' }} />

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-7 py-6 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/kb" element={<KnowledgeBase />} />
            <Route path="/sops" element={<SOPs />} />
            <Route path="/learnings" element={<Learnings />} />
            <Route path="/checklists" element={<Checklists />} />
            <Route path="/studio" element={<StudioInfo />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
