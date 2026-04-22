import { Search, Calendar, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'photoops_credentials';

function SettingsModal({ onClose }: { onClose: () => void }) {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  const [clientId, setClientId] = useState(stored.jamf?.clientId ?? '');
  const [clientSecret, setClientSecret] = useState(stored.jamf?.clientSecret ?? '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    const next = { ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'), jamf: { clientId, clientSecret } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        className="relative bg-[var(--neutral-card)] border border-[var(--border)] rounded-[1.5rem] p-7 shadow-xl w-[420px]"
      >
        <h3 className="text-base font-medium text-[var(--foreground)] mb-1">Jamf Pro Credentials</h3>
        <p className="text-xs text-[var(--muted-foreground)] mb-5">Saved locally to your browser. Never sent anywhere else.</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Client ID</label>
            <input value={clientId} onChange={e => setClientId(e.target.value)} placeholder="Paste Client ID from Jamf" className="w-full px-3 py-2 rounded-[0.75rem] bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none font-mono" />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Client Secret</label>
            <input type="password" value={clientSecret} onChange={e => setClientSecret(e.target.value)} placeholder="Paste Client Secret from Jamf" className="w-full px-3 py-2 rounded-[0.75rem] bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none font-mono" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-[0.75rem] bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--muted-foreground)]">Cancel</button>
          <button onClick={save} className="px-4 py-2 rounded-[0.75rem] bg-[var(--charcoal-accent)] text-white text-sm">
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);

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

      <AnimatePresence>{showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}</AnimatePresence>

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

        <motion.button
          onClick={() => setShowSettings(true)}
          className="p-3 rounded-[0.875rem] bg-[var(--background)] border border-[var(--border)]"
          whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
          title="Jamf Pro credentials"
        >
          <Settings size={16} className="text-[var(--muted-foreground)]" strokeWidth={2} />
        </motion.button>
      </div>
    </header>
  );
}
