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
      {/* Vivid ambient blobs — glass cards blur over these */}
      <div className="absolute pointer-events-none animate-float" style={{ top: '-10%', right: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,255,0.12) 0%, transparent 65%)', animationDuration: '7s' }} />
      <div className="absolute pointer-events-none animate-float" style={{ bottom: '-15%', left: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,90,242,0.1) 0%, transparent 65%)', animationDuration: '9s', animationDelay: '2s' }} />
      <div className="absolute pointer-events-none animate-float" style={{ top: '40%', left: '35%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 65%)', animationDuration: '11s', animationDelay: '4s' }} />
      <div className="absolute pointer-events-none animate-float" style={{ top: '10%', left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,120,0.07) 0%, transparent 65%)', animationDuration: '13s', animationDelay: '1s' }} />
      <div className="absolute pointer-events-none animate-float" style={{ bottom: '10%', right: '20%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,144,0.06) 0%, transparent 65%)', animationDuration: '10s', animationDelay: '3s' }} />

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
