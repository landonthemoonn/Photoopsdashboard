import { Monitor, Circle, RefreshCw, WifiOff, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useJamfDevices } from '../hooks/useJamfDevices';

type Filter = 'all' | 'online' | 'needs-update';

export function DeviceTable() {
  const { devices, fetchState, reload } = useJamfDevices();
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const filtered = devices.filter(d => {
    if (activeFilter === 'online') return d.status === 'online';
    if (activeFilter === 'needs-update') return d.updateStatus === 'needs-update';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[var(--neutral-card)] rounded-[1.5rem] p-7 border border-[var(--border)] shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-[var(--foreground)]">Device Inventory</h3>

        <div className="flex gap-2">
          {(['all', 'online', 'needs-update'] as Filter[]).map(f => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-2 rounded-[0.75rem] text-sm transition-all duration-300"
              style={activeFilter === f
                ? { background: 'var(--charcoal-accent)', color: 'white' }
                : { background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }
              }
              whileHover={{ scale: 1.05, boxShadow: activeFilter === f ? '0 0 20px var(--charcoal-glow)' : '0 0 15px var(--green-glow)' }}
              whileTap={{ scale: 0.95 }}
            >
              {f === 'all' ? 'All Devices' : f === 'online' ? 'Online Only' : 'Needs Update'}
            </motion.button>
          ))}
          <motion.button
            onClick={reload}
            className="p-2 rounded-[0.75rem] bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={14} className={fetchState === 'loading' ? 'animate-spin' : ''} />
          </motion.button>
        </div>
      </div>

      {/* Loading state */}
      {fetchState === 'loading' && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={20} className="animate-spin text-[var(--muted-foreground)]" />
          <span className="ml-3 text-sm text-[var(--muted-foreground)]">Connecting to Jamf Pro…</span>
        </div>
      )}

      {/* Error / no-creds states */}
      {(fetchState === 'no-creds' || fetchState === 'cors' || fetchState === 'auth' || fetchState === 'network' || fetchState === 'error') && (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
          {fetchState === 'no-creds'
            ? <><Settings size={20} className="text-[var(--muted-foreground)]" /><p className="text-sm text-[var(--foreground)]">No credentials</p><p className="text-xs text-[var(--muted-foreground)]">Click the settings icon in the header to add your Jamf Client ID and Secret</p></>
            : fetchState === 'cors' || fetchState === 'network'
            ? <><WifiOff size={20} className="text-[var(--muted-foreground)]" /><p className="text-sm text-[var(--foreground)]">Cannot reach Jamf Pro</p><p className="text-xs text-[var(--muted-foreground)]">Make sure the dashboard server is running and you're on the Gap network</p></>
            : fetchState === 'auth'
            ? <><Settings size={20} className="text-[var(--muted-foreground)]" /><p className="text-sm text-[var(--foreground)]">Invalid credentials</p><p className="text-xs text-[var(--muted-foreground)]">Check your Client ID and Secret in the header settings</p></>
            : <><WifiOff size={20} className="text-[var(--muted-foreground)]" /><p className="text-sm text-[var(--foreground)]">Something went wrong</p><p className="text-xs text-[var(--muted-foreground)]">Try refreshing</p></>
          }
        </div>
      )}

      {/* Device table */}
      {fetchState === 'success' && (
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Device Name', 'Category', 'Location', 'IP Address', 'OS Version', 'Status', 'Updates', 'ARD'].map((col, i) => (
                  <th key={col} className={`py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide ${i === 7 ? 'text-right' : 'text-left'}`}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((device, index) => (
                <motion.tr
                  key={device.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    backgroundColor: 'var(--background)',
                    boxShadow: device.status === 'online' ? '0 0 15px var(--green-glow)' : '0 0 10px rgba(0,0,0,0.05)'
                  }}
                  className="border-b border-[var(--border)] last:border-0 transition-all duration-300"
                >
                  <td className="py-4 px-4"><span className="font-medium text-sm text-[var(--foreground)]">{device.name}</span></td>
                  <td className="py-4 px-4"><span className="text-sm text-[var(--foreground)]">{device.category}</span></td>
                  <td className="py-4 px-4"><span className="text-sm text-[var(--foreground)]">{device.location}</span></td>
                  <td className="py-4 px-4"><span className="text-sm font-mono text-[var(--foreground)]">{device.ipAddress}</span></td>
                  <td className="py-4 px-4"><span className="text-sm text-[var(--foreground)]">{device.os}</span></td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      style={device.status === 'online' ? { boxShadow: '0 0 15px rgba(78,205,196,0.4)' } : undefined}
                    >
                      <Circle size={6} fill="currentColor" strokeWidth={0} className={device.status === 'online' ? 'animate-pulse' : ''} />
                      {device.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${device.updateStatus === 'current' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                      {device.updateStatus === 'current' ? 'Current' : 'Needs Update'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {device.status === 'online' && device.ipAddress !== '—' ? (
                      <motion.a href={`vnc://${device.ipAddress}`} title="Connect via Apple Remote Desktop"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--charcoal-accent)] text-white rounded-lg text-xs"
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--charcoal-glow)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Monitor size={14} strokeWidth={2} /> Connect
                      </motion.a>
                    ) : (
                      <span className="text-xs text-[var(--muted-foreground)]">Offline</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 p-3 rounded-[0.875rem] bg-[var(--background)] border border-[var(--border)] text-center">
        <p className="text-xs text-[var(--muted-foreground)]">
          {fetchState === 'success'
            ? `Live · ${filtered.length} of ${devices.length} devices · gapinc.jamfcloud.com`
            : '🔗 Connect to Jamf Pro — click the settings icon above to add credentials'}
        </p>
      </div>
    </motion.div>
  );
}
