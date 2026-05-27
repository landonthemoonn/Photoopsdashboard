import { CalendarDays, CalendarX } from 'lucide-react';
import { motion } from 'motion/react';

export function OutlookCalendar() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden col-span-2 cursor-default"
      style={{ background: 'rgba(22,16,12,0.6)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)', borderRadius: 'var(--radius)', border: '1px solid rgba(232,192,112,0.15)', padding: '1.5rem', boxShadow: '0 4px 30px rgba(0,0,0,0.4)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,192,112,0.5), transparent)' }} />

      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--muted-foreground)' }}>Studio Calendar</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>{today}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--muted-foreground)' }}>
          <CalendarDays size={11} strokeWidth={2} style={{ color: '#E8C070', opacity: 0.7 }} />
          <span>Today</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <CalendarX size={28} style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
        <p className="text-sm font-medium" style={{ color: 'var(--foreground)', opacity: 0.5 }}>Calendar not connected</p>
        <p className="text-xs text-center max-w-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>
          Microsoft Outlook integration coming soon. Configure credentials in Settings when ready.
        </p>
      </div>
    </motion.div>
  );
}
