import { Search, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router';

const pageTitles: Record<string, string> = {
  '/home': 'Home',
  '/dashboard': 'Dashboard',
  '/inventory': 'Device Inventory',
  '/kb': 'Knowledge Base',
  '/sops': 'SOPs',
  '/learnings': 'Learnings',
  '/checklists': 'Checklists',
  '/studio': 'Studio Info',
  '/settings': 'Settings',
};

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? 'Dashboard';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header
      className="px-7 py-4 flex items-center justify-between flex-shrink-0"
      style={{
        background: 'rgba(4, 5, 10, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div>
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: 'var(--neon-blue)', opacity: 0.7 }}>
          Photo Ops
        </p>
        <motion.h1
          key={pageTitle}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-lg font-medium"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
        >
          {pageTitle}
        </motion.h1>
      </div>

      <div className="flex items-center gap-3">
        <motion.div className="relative" whileHover={{ scale: 1.01 }}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" size={13} style={{ color: 'var(--muted-foreground)' }} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 w-56 text-sm focus:outline-none transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)', color: 'var(--foreground)' }}
            onFocus={(e) => { e.target.style.boxShadow = '0 0 0 2px rgba(0,180,255,0.2), 0 0 16px rgba(0,180,255,0.08)'; e.target.style.borderColor = 'rgba(0,180,255,0.35)'; }}
            onBlur={(e) => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = 'rgba(255,255,255,0.07)'; }}
          />
        </motion.div>

        <div className="flex items-center gap-2 px-3 py-2 text-xs" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius)', color: 'var(--muted-foreground)' }}>
          <Calendar size={12} strokeWidth={2} style={{ color: 'var(--neon-blue)', opacity: 0.6 }} />
          <span>{formatDate(currentTime)}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: 'var(--neon-green)' }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--neon-green)' }} />
          </span>
          <span className="text-[10px] font-semibold tracking-widest" style={{ color: 'var(--muted-foreground)' }}>LIVE</span>
        </div>
      </div>
    </header>
  );
}
