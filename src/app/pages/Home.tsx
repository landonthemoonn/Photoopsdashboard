import { motion } from 'motion/react';
import { Wifi, Activity, AlertCircle, ArrowRight, Calendar, HardDrive } from 'lucide-react';
import { Link } from 'react-router';

const quickStats = [
  { label: 'Macs Online', value: '21', accent: '#FFD60A', glow: 'rgba(255,214,10,0.2)' },
  { label: 'In Production', value: '18', accent: '#FF9500', glow: 'rgba(255,149,0,0.2)' },
  { label: 'System Health', value: '98%', accent: '#00E5FF', glow: 'rgba(0,229,255,0.2)' },
  { label: 'Needs Update', value: '2', accent: '#FF2D78', glow: 'rgba(255,45,120,0.2)' },
];

const recentActivity = [
  { time: '9:14 AM', event: 'Photo-Mac-02 came online', icon: Wifi, color: '#00FF90' },
  { time: '8:52 AM', event: 'macOS 14.3 update pushed via Jamf', icon: HardDrive, color: '#00B4FF' },
  { time: '8:30 AM', event: 'Production Shoot — Spring Collection started', icon: Activity, color: '#FFD60A' },
  { time: 'Yesterday', event: 'Tech-Mac-01 went offline', icon: AlertCircle, color: '#FF2D78' },
  { time: 'Yesterday', event: 'Checklist: Weekly maintenance completed', icon: Calendar, color: '#BF5AF2' },
];

const shortcuts = [
  { label: 'View All Devices', to: '/inventory', accent: '#00B4FF' },
  { label: 'Open Checklists', to: '/checklists', accent: '#00FF90' },
  { label: 'Browse SOPs', to: '/sops', accent: '#BF5AF2' },
  { label: 'Studio Calendar', to: '/dashboard', accent: '#FFD60A' },
  { label: 'Knowledge Base', to: '/kb', accent: '#FF9500' },
  { label: 'Settings & Integrations', to: '/settings', accent: '#FF2D78' },
];

export function Home() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>
          {greeting}
        </p>
        <h1 className="text-3xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.03em' }}>
          Photo Studio Ops
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Here's what's happening in the studio today.
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-5">
        {/* Quick stats */}
        <div className="col-span-2">
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>Quick Stats</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {quickStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-4 rounded-xl"
                style={{ background: 'rgba(10,12,22,0.55)', backdropFilter: 'blur(24px)', border: `1px solid ${s.glow.replace('0.2', '0.25')}`, boxShadow: `0 4px 24px rgba(0,0,0,0.3)` }}
              >
                <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                <p className="text-3xl font-light font-mono" style={{ color: s.accent, textShadow: `0 0 16px ${s.glow}` }}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Shortcuts */}
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>Quick Access</p>
          <div className="grid grid-cols-3 gap-2">
            {shortcuts.map((s, i) => (
              <motion.div key={s.to} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <Link
                  to={s.to}
                  className="flex items-center justify-between p-3 rounded-xl group transition-all duration-200"
                  style={{ background: 'rgba(10,12,22,0.55)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${s.accent}40`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${s.accent}15`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{s.label}</span>
                  <ArrowRight size={13} style={{ color: s.accent }} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>Recent Activity</p>
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(10,12,22,0.55)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="flex items-start gap-3 p-4"
                  style={{ borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}15` }}>
                    <Icon size={13} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs leading-snug" style={{ color: 'var(--foreground)' }}>{item.event}</p>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--muted-foreground)' }}>{item.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
