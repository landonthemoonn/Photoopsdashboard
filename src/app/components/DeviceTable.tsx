import { Monitor, Circle, RefreshCw, WifiOff, Settings, Loader } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useJamfDevices, FetchState } from '../hooks/useJamfDevices';

type Filter = 'all' | 'online' | 'needs-update';

export function DeviceTable() {
  const { devices, fetchState, lastSync, reload: load } = useJamfDevices();
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const filtered = devices.filter(d => {
    if (activeFilter === 'online') return d.status === 'online';
    if (activeFilter === 'needs-update') return d.updateStatus === 'needs-update';
    return true;
  });

  const glass = { background: 'rgba(22,16,12,0.6)', backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)', boxShadow: '0 4px 30px rgba(0,0,0,0.4)' };

  const stateMessages: Partial<Record<FetchState, { icon: React.ReactNode; title: string; sub: string }>> = {
    'no-creds': { icon: <Settings size={20} style={{ color: '#E09040' }} />, title: 'No Jamf credentials', sub: 'Go to Settings and add your Client ID and Secret' },
    'cors': { icon: <WifiOff size={20} style={{ color: '#E07060' }} />, title: 'Not on Gap network', sub: 'Connect to the studio network to load device data' },
    'network': { icon: <WifiOff size={20} style={{ color: '#E07060' }} />, title: 'Cannot reach Jamf', sub: 'Check your network connection' },
    'auth': { icon: <Settings size={20} style={{ color: '#E07060' }} />, title: 'Invalid credentials', sub: 'Check your Client ID and Secret in Settings' },
    'error': { icon: <WifiOff size={20} style={{ color: '#E07060' }} />, title: 'Something went wrong', sub: 'Try refreshing or check Settings' },
  };

  const stateMsg = stateMessages[fetchState];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} style={glass} className="overflow-hidden">
      <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--muted-foreground)' }}>Device Inventory</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
            {fetchState === 'success' ? `${filtered.length} of ${devices.length} devices · synced ${lastSync}` : 'gapinc.jamfcloud.com'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {fetchState === 'success' && (
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {(['all', 'online', 'needs-update'] as Filter[]).map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className="px-3 py-1.5 rounded-md text-[10px] font-semibold capitalize transition-all duration-200" style={{ background: activeFilter === f ? 'rgba(224,112,96,0.12)' : 'transparent', color: activeFilter === f ? 'var(--neon-blue)' : 'var(--muted-foreground)', border: activeFilter === f ? '1px solid rgba(224,112,96,0.2)' : '1px solid transparent' }}>
                  {f === 'needs-update' ? 'Needs Update' : f === 'all' ? 'All' : 'Online'}
                </button>
              ))}
            </div>
          )}
          <button onClick={load} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--muted-foreground)' }}>
            <RefreshCw size={13} className={fetchState === 'loading' ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {fetchState === 'loading' && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader size={20} className="animate-spin" style={{ color: '#E07060' }} />
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Connecting to Jamf Pro…</p>
        </div>
      )}

      {stateMsg && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          {stateMsg.icon}
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--foreground)' }}>{stateMsg.title}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stateMsg.sub}</p>
        </div>
      )}

      {fetchState === 'success' && (
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Device', 'Category', 'Location', 'IP Address', 'OS Version', 'Status', 'Updates', 'ARD'].map((col, i) => (
                <th key={col} className={`py-3 px-4 text-[10px] font-semibold tracking-[0.1em] uppercase ${i === 7 ? 'text-right' : 'text-left'}`} style={{ color: 'var(--muted-foreground)' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((device, index) => (
              <motion.tr key={device.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: index * 0.04 }} className="transition-colors duration-150" style={{ borderBottom: index < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(224,112,96,0.025)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <td className="py-3.5 px-4"><span className="text-xs font-medium font-mono" style={{ color: 'var(--foreground)' }}>{device.name}</span></td>
                <td className="py-3.5 px-4"><span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.category}</span></td>
                <td className="py-3.5 px-4"><span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.location}</span></td>
                <td className="py-3.5 px-4"><span className="text-xs font-mono" style={{ color: 'var(--foreground)', opacity: device.ipAddress === '—' ? 0.25 : 0.75 }}>{device.ipAddress}</span></td>
                <td className="py-3.5 px-4"><span className="text-xs font-mono" style={{ color: 'var(--foreground)', opacity: 0.75 }}>{device.os}</span></td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold" style={device.status === 'online' ? { background: 'rgba(143,191,138,0.08)', color: '#8FBF8A', border: '1px solid rgba(143,191,138,0.2)' } : { background: 'rgba(255,255,255,0.04)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <Circle size={5} fill="currentColor" strokeWidth={0} className={device.status === 'online' ? 'animate-pulse' : ''} />
                    {device.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold" style={device.updateStatus === 'current' ? { background: 'rgba(143,191,138,0.08)', color: '#8FBF8A', border: '1px solid rgba(143,191,138,0.2)' } : { background: 'rgba(224,144,64,0.08)', color: '#E09040', border: '1px solid rgba(224,144,64,0.2)' }}>
                    {device.updateStatus === 'current' ? 'Current' : 'Update'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {device.status === 'online' && device.ipAddress !== '—' ? (
                    <motion.a href={`vnc://${device.ipAddress}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" title="Apple Remote Desktop" style={{ background: 'rgba(224,112,96,0.08)', color: 'var(--neon-blue)', border: '1px solid rgba(224,112,96,0.2)' }} whileHover={{ background: 'rgba(224,112,96,0.15)', boxShadow: '0 0 16px rgba(224,112,96,0.2)' }} whileTap={{ scale: 0.96 }}>
                      <Monitor size={12} /> Connect
                    </motion.a>
                  ) : <span className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }}>—</span>}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}

      {fetchState === 'success' && (
        <div className="px-5 py-3 flex items-center justify-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: '#8FBF8A' }} />
          <p className="text-[10px]" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>Live · gapinc.jamfcloud.com</p>
        </div>
      )}
    </motion.div>
  );
}
