import { Search, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header
      className="px-8 py-4 flex items-center justify-between"
      style={{
        background: 'rgba(12, 14, 23, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-3">
        <div>
          <p className="text-[10px] font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--gold-accent)', opacity: 0.85 }}>
            Tech + Photo Studio
          </p>
          <h1
            className="text-xl font-medium tracking-tight"
            style={{ color: 'var(--foreground)', lineHeight: 1.2, letterSpacing: '-0.025em' }}
          >
            Ops Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.01 }}
        >
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            size={14}
            style={{ color: 'var(--muted-foreground)' }}
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search devices, docs..."
            className="pl-10 pr-4 py-2.5 w-72 text-sm focus:outline-none transition-all duration-300"
            style={{
              background: 'var(--input-background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--foreground)',
              letterSpacing: '0.01em',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 2px rgba(200, 167, 90, 0.25), 0 0 20px rgba(200, 167, 90, 0.08)';
              e.target.style.borderColor = 'rgba(200, 167, 90, 0.4)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = 'var(--border)';
            }}
          />
        </motion.div>

        <motion.div
          className="flex items-center gap-2 px-3.5 py-2.5 text-sm"
          style={{
            background: 'var(--input-background)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--muted-foreground)',
            letterSpacing: '0.01em',
          }}
          whileHover={{ borderColor: 'rgba(200, 167, 90, 0.3)' }}
        >
          <Calendar size={13} strokeWidth={2} style={{ color: 'var(--gold-accent)', opacity: 0.7 }} />
          <span className="text-xs" style={{ color: 'var(--foreground)' }}>{formatDate(currentTime)}</span>
        </motion.div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'var(--teal-accent)' }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--teal-accent)' }} />
          </span>
          <span className="text-xs font-medium tracking-wide" style={{ color: 'var(--muted-foreground)' }}>LIVE</span>
        </div>
      </div>
    </header>
  );
}
