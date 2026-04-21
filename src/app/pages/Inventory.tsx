import { motion } from 'motion/react';
import { Monitor, Search, RefreshCw, Circle, ExternalLink, Filter } from 'lucide-react';
import { useState } from 'react';

const devices = [
  { name: 'Photo-Mac-01', category: 'iMac Pro', location: 'Main Stage', os: 'macOS 14.3', status: 'online', updateStatus: 'current', ip: '10.0.1.101', serial: 'C02X1234ABCD', ram: '64 GB', storage: '2 TB SSD', jamfId: 'JMF-001' },
  { name: 'Photo-Mac-02', category: 'Mac Studio', location: 'Main Stage', os: 'macOS 14.2', status: 'online', updateStatus: 'needs-update', ip: '10.0.1.102', serial: 'C02X5678EFGH', ram: '32 GB', storage: '1 TB SSD', jamfId: 'JMF-002' },
  { name: 'Tech-Mac-01', category: 'MacBook Pro', location: 'Tech Desk', os: 'macOS 14.3', status: 'offline', updateStatus: 'current', ip: '—', serial: 'C02X9012IJKL', ram: '16 GB', storage: '512 GB SSD', jamfId: 'JMF-003' },
  { name: 'Photo-Mac-03', category: 'iMac', location: 'Edit Bay 1', os: 'macOS 14.1', status: 'online', updateStatus: 'needs-update', ip: '10.0.1.103', serial: 'C02X3456MNOP', ram: '32 GB', storage: '1 TB SSD', jamfId: 'JMF-004' },
  { name: 'Photo-Mac-04', category: 'Mac Studio', location: 'Edit Bay 2', os: 'macOS 14.3', status: 'online', updateStatus: 'current', ip: '10.0.1.104', serial: 'C02X7890QRST', ram: '64 GB', storage: '2 TB SSD', jamfId: 'JMF-005' },
  { name: 'Photo-Mac-05', category: 'Mac Studio', location: 'Edit Bay 1', os: 'macOS 14.3', status: 'online', updateStatus: 'current', ip: '10.0.1.105', serial: 'C02X2345UVWX', ram: '64 GB', storage: '2 TB SSD', jamfId: 'JMF-006' },
  { name: 'Tether-Mac-01', category: 'MacBook Pro', location: 'Main Stage', os: 'macOS 14.3', status: 'online', updateStatus: 'current', ip: '10.0.1.106', serial: 'C02X6789YZAB', ram: '16 GB', storage: '512 GB SSD', jamfId: 'JMF-007' },
  { name: 'Laydown-Mac-01', category: 'Mac mini', location: 'Storage', os: 'macOS 14.0', status: 'offline', updateStatus: 'needs-update', ip: '—', serial: 'C02X0123CDEF', ram: '16 GB', storage: '256 GB SSD', jamfId: 'JMF-008' },
];

type Filter = 'all' | 'online' | 'offline' | 'needs-update';

const JAMF_URL = 'https://gapinc.jamfcloud.com';

export function Inventory() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = devices.filter(d => {
    const matchesFilter = filter === 'all' || (filter === 'online' && d.status === 'online') || (filter === 'offline' && d.status === 'offline') || (filter === 'needs-update' && d.updateStatus === 'needs-update');
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const glassCard = { background: 'rgba(10,12,22,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)', boxShadow: '0 4px 30px rgba(0,0,0,0.4)' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Jamf Pro</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Device Inventory</h1>
        </div>
        <a href={JAMF_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200" style={{ background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.2)', color: 'var(--neon-blue)' }}>
          <ExternalLink size={14} /> Open Jamf Pro
        </a>
      </motion.div>

      {/* Summary pills */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Devices', value: devices.length, accent: '#00B4FF' },
          { label: 'Online', value: devices.filter(d => d.status === 'online').length, accent: '#00FF90' },
          { label: 'Offline', value: devices.filter(d => d.status === 'offline').length, accent: '#FF2D78' },
          { label: 'Needs Update', value: devices.filter(d => d.updateStatus === 'needs-update').length, accent: '#FF9500' },
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
          <input
            type="text"
            placeholder="Search by name, location, category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--foreground)' }}
          />
        </div>

        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {(['all', 'online', 'offline', 'needs-update'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-200" style={{ background: filter === f ? 'rgba(0,180,255,0.12)' : 'transparent', color: filter === f ? 'var(--neon-blue)' : 'var(--muted-foreground)', border: filter === f ? '1px solid rgba(0,180,255,0.2)' : '1px solid transparent' }}>
              {f === 'needs-update' ? 'Needs Update' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted-foreground)' }}>
          <RefreshCw size={14} />
        </button>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={glassCard} className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Device', 'Category', 'Location', 'IP', 'Serial', 'RAM', 'OS', 'Status', 'Updates', 'ARD'].map((col, i) => (
                <th key={col} className={`py-3 px-4 text-[10px] font-semibold tracking-[0.1em] uppercase ${i === 9 ? 'text-right' : 'text-left'}`} style={{ color: 'var(--muted-foreground)' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((device, idx) => (
              <tr key={device.name} className="transition-colors duration-150" style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.018)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <td className="py-3 px-4"><span className="text-xs font-medium font-mono" style={{ color: 'var(--foreground)' }}>{device.name}</span></td>
                <td className="py-3 px-4"><span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.category}</span></td>
                <td className="py-3 px-4"><span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.location}</span></td>
                <td className="py-3 px-4"><span className="text-xs font-mono" style={{ color: 'var(--foreground)', opacity: device.ip === '—' ? 0.3 : 0.75 }}>{device.ip}</span></td>
                <td className="py-3 px-4"><span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{device.serial}</span></td>
                <td className="py-3 px-4"><span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{device.ram}</span></td>
                <td className="py-3 px-4"><span className="text-xs font-mono" style={{ color: 'var(--foreground)', opacity: 0.75 }}>{device.os}</span></td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold" style={device.status === 'online' ? { background: 'rgba(0,255,144,0.1)', color: '#00FF90', border: '1px solid rgba(0,255,144,0.2)' } : { background: 'rgba(255,255,255,0.04)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Circle size={5} fill="currentColor" strokeWidth={0} className={device.status === 'online' ? 'animate-pulse' : ''} />
                    {device.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold" style={device.updateStatus === 'current' ? { background: 'rgba(0,180,255,0.1)', color: '#00B4FF', border: '1px solid rgba(0,180,255,0.2)' } : { background: 'rgba(255,149,0,0.1)', color: '#FF9500', border: '1px solid rgba(255,149,0,0.2)' }}>
                    {device.updateStatus === 'current' ? 'Current' : 'Update'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {device.status === 'online' ? (
                    <a href={`vnc://${device.ip}`} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: 'rgba(0,180,255,0.08)', color: 'var(--neon-blue)', border: '1px solid rgba(0,180,255,0.2)' }}>
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
            Showing {filtered.length} of {devices.length} devices · Live sync via Jamf Pro API pending
          </p>
          <a href={JAMF_URL} target="_blank" rel="noreferrer" className="text-[10px] flex items-center gap-1" style={{ color: 'var(--neon-blue)', opacity: 0.6 }}>
            <ExternalLink size={10} /> gapinc.jamfcloud.com
          </a>
        </div>
      </motion.div>
    </div>
  );
}
