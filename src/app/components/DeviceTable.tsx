import { Monitor, Circle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Device {
  name: string;
  category: string;
  location: string;
  os: string;
  status: 'online' | 'offline';
  updateStatus: 'current' | 'needs-update' | 'pending';
  ipAddress: string;
  jamfId?: string;
}

const devices: Device[] = [
  { name: 'Photo-Mac-01', category: 'iMac Pro', location: 'Main Stage', os: 'macOS 14.3', status: 'online', updateStatus: 'current', ipAddress: '10.0.1.101', jamfId: 'JMF-001' },
  { name: 'Photo-Mac-02', category: 'Mac Studio', location: 'Main Stage', os: 'macOS 14.2', status: 'online', updateStatus: 'needs-update', ipAddress: '10.0.1.102', jamfId: 'JMF-002' },
  { name: 'Tech-Mac-01', category: 'MacBook Pro', location: 'Tech Desk', os: 'macOS 14.3', status: 'offline', updateStatus: 'current', ipAddress: '—', jamfId: 'JMF-003' },
  { name: 'Photo-Mac-03', category: 'iMac', location: 'Edit Bay 1', os: 'macOS 14.1', status: 'online', updateStatus: 'needs-update', ipAddress: '10.0.1.103', jamfId: 'JMF-004' },
  { name: 'Photo-Mac-04', category: 'Mac Studio', location: 'Edit Bay 2', os: 'macOS 14.3', status: 'online', updateStatus: 'current', ipAddress: '10.0.1.104', jamfId: 'JMF-005' },
  { name: 'Photo-Mac-05', category: 'Mac Studio', location: 'Edit Bay 1', os: 'macOS 14.3', status: 'online', updateStatus: 'current', ipAddress: '10.0.1.105', jamfId: 'JMF-006' },
];

type Filter = 'all' | 'online' | 'needs-update';

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All Devices' },
  { key: 'online', label: 'Online' },
  { key: 'needs-update', label: 'Needs Update' },
];

export function DeviceTable() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const filtered = devices.filter((d) => {
    if (activeFilter === 'online') return d.status === 'online';
    if (activeFilter === 'needs-update') return d.updateStatus === 'needs-update';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden"
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '1.5rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--muted-foreground)' }}>
            Device Inventory
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
            {filtered.length} of {devices.length} devices
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter pills */}
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--accent)', border: '1px solid var(--border)' }}>
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                style={{
                  background: activeFilter === f.key ? 'rgba(200, 167, 90, 0.12)' : 'transparent',
                  color: activeFilter === f.key ? 'var(--gold-accent)' : 'var(--muted-foreground)',
                  border: activeFilter === f.key ? '1px solid rgba(200, 167, 90, 0.2)' : '1px solid transparent',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{ background: 'var(--accent)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
            title="Refresh"
          >
            <RefreshCw size={13} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              {['Device', 'Category', 'Location', 'IP Address', 'OS Version', 'Status', 'Updates', 'ARD'].map((col, i) => (
                <th
                  key={col}
                  className={`py-3 px-4 text-[10px] font-semibold tracking-[0.12em] uppercase ${i === 7 ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((device, index) => (
              <motion.tr
                key={device.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="group transition-colors duration-150"
                style={{ borderBottom: index < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.018)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <td className="py-3.5 px-4">
                  <span className="text-sm font-medium font-mono" style={{ color: 'var(--foreground)', letterSpacing: '0.01em' }}>
                    {device.name}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.category}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.location}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs font-mono" style={{ color: 'var(--foreground)', opacity: device.ipAddress === '—' ? 0.3 : 0.8 }}>
                    {device.ipAddress}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs font-mono" style={{ color: 'var(--foreground)', opacity: 0.8 }}>{device.os}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide"
                    style={
                      device.status === 'online'
                        ? { background: 'rgba(45, 212, 191, 0.1)', color: '#2DD4BF', border: '1px solid rgba(45, 212, 191, 0.2)' }
                        : { background: 'rgba(255,255,255,0.04)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }
                    }
                  >
                    <Circle
                      size={5}
                      fill="currentColor"
                      strokeWidth={0}
                      className={device.status === 'online' ? 'animate-pulse' : ''}
                    />
                    {device.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide"
                    style={
                      device.updateStatus === 'current'
                        ? { background: 'rgba(123, 130, 240, 0.1)', color: '#7B82F0', border: '1px solid rgba(123, 130, 240, 0.2)' }
                        : device.updateStatus === 'needs-update'
                        ? { background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)' }
                        : { background: 'rgba(255,255,255,0.04)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }
                    }
                  >
                    {device.updateStatus === 'current' ? 'Current' : device.updateStatus === 'needs-update' ? 'Update' : 'Pending'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {device.status === 'online' ? (
                    <motion.a
                      href={`vnc://${device.ipAddress}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      title="Connect via Apple Remote Desktop"
                      style={{
                        background: 'rgba(200, 167, 90, 0.1)',
                        color: 'var(--gold-accent)',
                        border: '1px solid rgba(200, 167, 90, 0.2)',
                        letterSpacing: '0.01em',
                      }}
                      whileHover={{
                        background: 'rgba(200, 167, 90, 0.18)',
                        boxShadow: '0 0 16px rgba(200, 167, 90, 0.2)',
                      }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Monitor size={12} strokeWidth={2} />
                      Connect
                    </motion.a>
                  ) : (
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>—</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold-accent)', opacity: 0.4 }} />
        <p className="text-[10px] tracking-wide" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
          Jamf Pro API via Supabase — live sync pending
        </p>
      </div>
    </motion.div>
  );
}
