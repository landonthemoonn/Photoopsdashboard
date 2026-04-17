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
    <header className="bg-[var(--neutral-card)] border-b border-[var(--border)] px-8 py-5 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-2xl tracking-tight text-[var(--foreground)] font-medium">
          Tech + Photo Studio Ops Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            whileHover={{ rotate: 15, scale: 1.1 }}
          >
            <Search
              className="text-[var(--muted-foreground)] transition-colors"
              size={18}
              strokeWidth={2}
            />
          </motion.div>
          <input
            type="text"
            placeholder="Search devices, docs..."
            className="pl-12 pr-6 py-3 w-80 rounded-[0.875rem] bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none transition-all"
            style={{
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 3px var(--blue-glow), 0 0 25px var(--blue-glow)';
              e.target.style.borderColor = 'var(--blue-accent)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = 'var(--border)';
            }}
          />
        </motion.div>

        <motion.div
          className="flex items-center gap-2 px-4 py-3 rounded-[0.875rem] bg-[var(--background)] border border-[var(--border)]"
          whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
        >
          <Calendar size={16} className="text-[var(--muted-foreground)]" strokeWidth={2} />
          <span className="text-sm text-[var(--foreground)]">{formatDate(currentTime)}</span>
        </motion.div>
      </div>
    </header>
  );
}
