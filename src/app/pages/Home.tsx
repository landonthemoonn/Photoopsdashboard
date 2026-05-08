import { motion } from 'motion/react';
import { Wifi, Activity, AlertCircle, ArrowRight, HardDrive, WifiOff, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { useJamfDevices } from '../hooks/useJamfDevices';

const shortcuts = [
  { label: 'View All Devices', to: '/inventory', accent: '#E07060' },
  { label: 'Open Checklists', to: '/checklists', accent: '#8FBF8A' },
  { label: 'Browse SOPs', to: '/sops', accent: '#9888C8' },
  { label: 'Studio Calendar', to: '/dashboard', accent: '#E8C070' },
  { label: 'Knowledge Base', to: '/kb', accent: '#E09040' },
  { label: 'Settings & Integrations', to: '/settings', accent: '#D86040' },
];

export function Home() {
  const { devices, fetchState, reload } = useJamfDevices();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const online = devices.filter(d => d.status === 'online').length;
  const total = devices.length;
  const needsUpdate = devices.filter(d => d.updateStatus === 'needs-update').length;
  const noContact = devices.filter(d => d.status === 'offline').length;

  const loading = fetchState === 'loading';
  const noCreds = fetchState === 'no-creds';

  const quickStats = [
    { label: 'Macs Online', value: loading ? '…' : String(online), accent: '#E8C070', glow: 'rgba(232,192,112,0.2)' },
    { label: 'Total Devices', value: loading ? '…' : String(total), accent: '#E09040', glow: 'rgba(224,144,64,0.2)' },
    { label: 'Needs Update', value: loading ? '…' : String(needsUpdate), accent: '#D86040', glow: 'rgba(216,96,64,0.2)' },
    { label: 'No Sign of Life', value: loading ? '…' : String(noContact), accent: '#9888C8', glow: 'rgba(152,136,200,0.2)' },
  ];

  const recentActivity = devices
    .filter(d => d.status === 'online')
    .slice(0, 5)
    .map(d => ({ event: `${d.name} is online`, icon: Wifi, color: '#8FBF8A' }))
    .concat(
      devices.filter(d => d.updateStatus === 'needs-update').slice(0, 3).map(d => ({
        event: `${d.name} needs a macOS update`, icon: HardDrive, color: '#E07060',
      }))
    )
    .concat(
      devices.filter(d => d.status === 'offline').slice(0, 3).map(d => ({
        event: `${d.name} is offline`, icon: WifiOff, color: '#D86040',
      }))
    )
    .slice(0, 5);

  return (
    <div>
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
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--muted-foreground)' }}>Quick Stats</p>
            {!noCreds && (
              <button onClick={reload} className="flex items-center gap-1 text-[10px] transition-opacity hover:opacity-100 opacity-50" style={{ color: 'var(--muted-foreground)' }}>
                <RefreshCw size={10} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            )}
          </div>

          {noCreds ? (
            <div className="rounded-xl p-6 mb-5 flex flex-col items-center gap-2 text-center" style={{ background: 'rgba(22,16,12,0.55)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <AlertCircle size={20} style={{ color: '#E07060' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Jamf not connected</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Enter your credentials in Settings to see live stats.</p>
              <Link to="/settings" className="text-xs mt-1 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(224,112,96,0.1)', color: '#E07060', border: '1px solid rgba(224,112,96,0.2)' }}>Go to Settings</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-5">
              {quickStats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="p-4 rounded-xl"
                  style={{ background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', border: `1px solid ${s.glow.replace('0.2', '0.25')}`, boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
                  <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                  <p className="text-3xl font-light font-mono" style={{ color: s.accent, textShadow: `0 0 16px ${s.glow}` }}>{s.value}</p>
                </motion.div>
              ))}
            </div>
          )}

          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>Quick Access</p>
          <div className="grid grid-cols-3 gap-2">
            {shortcuts.map((s, i) => (
              <motion.div key={s.to} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <Link to={s.to} className="flex items-center justify-between p-3 rounded-xl group transition-all duration-200"
                  style={{ background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${s.accent}40`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${s.accent}15`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                  <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{s.label}</span>
                  <ArrowRight size={13} style={{ color: s.accent }} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>Device Activity</p>
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {recentActivity.length > 0 ? recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                  className="flex items-start gap-3 p-4" style={{ borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}15` }}>
                    <Icon size={13} style={{ color: item.color }} />
                  </div>
                  <p className="text-xs leading-snug pt-1.5" style={{ color: 'var(--foreground)' }}>{item.event}</p>
                </motion.div>
              );
            }) : (
              <div className="p-6 flex flex-col items-center gap-2 text-center">
                <Activity size={18} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {noCreds ? 'Connect Jamf to see activity' : loading ? 'Loading…' : 'No device activity'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
