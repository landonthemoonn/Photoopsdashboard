import { motion } from 'motion/react';
import { Monitor, Search, RefreshCw, Circle, ExternalLink, Loader, Settings, WifiOff } from 'lucide-react';
import { useState } from 'react';
import { useJamfDevices } from '../hooks/useJamfDevices';

type Filter = 'all' | 'online' | 'offline' | 'needs-update';

function getJamfUrl() {
  try { return JSON.parse(localStorage.getItem('photoops_studio_config') ?? '{}').jamfUrl ?? 'https://gapinc.jamfcloud.com'; }
  catch { return 'https://gapinc.jamfcloud.com'; }
}

export function Inventory() {
  const { devices, fetchState, fetchError, lastSync, reload } = useJamfDevices();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const jamfUrl = getJamfUrl();

  const filtered = devices.filter(d => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'online' && d.status === 'online') ||
      (filter === 'offline' && d.status === 'offline') ||
      (filter === 'needs-update' && d.updateStatus === 'needs-update');
    const q = search.toLowerCase();
    const matchesSearch = !q || d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q) || d.category.toLowerCase().includes(q) || d.serial.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const glassCard = { background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)', boxShadow: '0 4px 30px rgba(0,0,0,0.4)' };
  const loading = fetchState === 'idle' || fetchState === 'loading';

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: '#E07060' }}>Jamf Pro</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Device Inventory</h1>
        </div>
        <a href={jamfUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200" style={{ background: 'rgba(224,112,96,0.1)', border: '1px solid rgba(224,112,96,0.2)', color: '#E07060' }}>
          <ExternalLink size={14} /> Open Jamf Pro
        </a>
      </motion.div>

      {/* Summary pills */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Devices', value: loading ? '—' : devices.length, accent: '#E07060' },
          { label: 'Online', value: loading ? '—' : devices.filter(d => d.status === 'online').length, accent: '#8FBF8A' },
          { label: 'Offline', value: loading ? '—' : devices.filter(d => d.status === 'offline').length, accent: '#D86040' },
          { label: 'Needs Update', value: loading ? '—' : devices.filter(d => d.updateStatus === 'needs-update').length, accent: '#E09040' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl" style={{ ...glassCard, borderColor: `${s.accent}25` }}>
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
            <p className="text-2xl font-light font-mono" style={{ color: s.accent, textShadow: `0 0 12px ${s.accent}50` }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="p-4 mb-4 flex items-center gap-3" style={glassCard}>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input type="text" placeholder="Search by name, location, category, serial..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm rounded-lg focus:outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--foreground)' }} />
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {(['all', 'online', 'offline', 'needs-update'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-200" style={{ background: filter === f ? 'rgba(224,112,96,0.12)' : 'transparent', color: filter === f ? '#E07060' : 'var(--muted-foreground)', border: filter === f ? '1px solid rgba(224,112,96,0.2)' : '1px solid transparent' }}>
              {f === 'needs-update' ? 'Needs Update' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={reload} className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted-foreground)' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={glassCard} className="overflow-hidden">

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader size={20} className="animate-spin" style={{ color: '#E07060' }} />
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Connecting to Jamf Pro…</p>
          </div>
        )}

        {fetchState === 'no-creds' && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Settings size={20} style={{ color: '#E09040' }} />
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--foreground)' }}>No Jamf credentials</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Go to Settings → Setup Wizard to add your Client ID and Secret</p>
          </div>
        )}

        {fetchState === 'auth' && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Settings size={20} style={{ color: '#E07060' }} />
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--foreground)' }}>Invalid credentials</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Check your Client ID and Secret in Settings</p>
          </div>
        )}

        {fetchState === 'network' && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <WifiOff size={20} style={{ color: '#E07060' }} />
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--foreground)' }}>Cannot reach Jamf</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Check your network connection</p>
          </div>
        )}

        {fetchState === 'error' && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <WifiOff size={20} style={{ color: '#E07060' }} />
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--foreground)' }}>Error{fetchError?.status ? ` (${fetchError.status})` : ''}</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{fetchError?.detail ?? 'Try refreshing or check Settings'}</p>
          </div>
        )}

        {fetchState === 'success' && (
          <>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Device', 'Category', 'Location', 'IP', 'Serial', 'OS', 'Status', 'Updates', 'ARD'].map((col, i) => (
                    <th key={col} className={`py-3 px-4 text-[10px] font-semibold tracking-[0.1em] uppercase ${i === 8 ? 'text-right' : 'text-left'}`} style={{ color: 'var(--muted-foreground)' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((device, idx) => (
                  <tr key={device.jamfId ?? device.name} className="transition-colors duration-150" style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.018)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td className="py-3 px-4"><span className="text-xs font-medium font-mono" style={{ color: 'var(--foreground)' }}>{device.name}</span></td>
                    <td className="py-3 px-4"><span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.category}</span></td>
                    <td className="py-3 px-4"><span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.location}</span></td>
                    <td className="py-3 px-4"><span className="text-xs font-mono" style={{ color: 'var(--foreground)', opacity: device.ipAddress === '—' ? 0.3 : 0.75 }}>{device.ipAddress}</span></td>
                    <td className="py-3 px-4"><span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{device.serial}</span></td>
                    <td className="py-3 px-4"><span className="text-xs font-mono" style={{ color: 'var(--foreground)', opacity: 0.75 }}>{device.os}</span></td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold" style={device.status === 'online' ? { background: 'rgba(143,191,138,0.1)', color: '#8FBF8A', border: '1px solid rgba(143,191,138,0.2)' } : { background: 'rgba(255,255,255,0.04)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Circle size={5} fill="currentColor" strokeWidth={0} className={device.status === 'online' ? 'animate-pulse' : ''} />
                        {device.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold" style={device.updateStatus === 'current' ? { background: 'rgba(143,191,138,0.08)', color: '#8FBF8A', border: '1px solid rgba(143,191,138,0.2)' } : { background: 'rgba(224,144,64,0.1)', color: '#E09040', border: '1px solid rgba(224,144,64,0.2)' }}>
                        {device.updateStatus === 'current' ? 'Current' : 'Update'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {device.status === 'online' && device.ipAddress !== '—' ? (
                        <a href={`vnc://${device.ipAddress}`} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: 'rgba(224,112,96,0.08)', color: '#E07060', border: '1px solid rgba(224,112,96,0.2)' }}>
                          <Monitor size={11} /> Connect
                        </a>
                      ) : <span style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} className="text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-[10px]" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
                Showing {filtered.length} of {devices.length} devices · synced {lastSync}
              </p>
              <a href={jamfUrl} target="_blank" rel="noreferrer" className="text-[10px] flex items-center gap-1" style={{ color: '#E07060', opacity: 0.6 }}>
                <ExternalLink size={10} /> {jamfUrl.replace('https://', '')}
              </a>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
