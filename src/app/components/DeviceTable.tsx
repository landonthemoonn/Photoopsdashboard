import { Monitor, Circle } from 'lucide-react';
import { motion } from 'motion/react';

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

// Mock data - will be replaced with real Jamf Pro API data via Supabase
const devices: Device[] = [
  {
    name: 'Photo-Mac-01',
    category: 'iMac Pro',
    location: 'Main Stage',
    os: 'macOS 14.3',
    status: 'online',
    updateStatus: 'current',
    ipAddress: '10.0.1.101',
    jamfId: 'JMF-001'
  },
  {
    name: 'Photo-Mac-02',
    category: 'Mac Studio',
    location: 'Main Stage',
    os: 'macOS 14.2',
    status: 'online',
    updateStatus: 'needs-update',
    ipAddress: '10.0.1.102',
    jamfId: 'JMF-002'
  },
  {
    name: 'Tech-Mac-01',
    category: 'MacBook Pro',
    location: 'Tech Desk',
    os: 'macOS 14.3',
    status: 'offline',
    updateStatus: 'current',
    ipAddress: '—',
    jamfId: 'JMF-003'
  },
  {
    name: 'Photo-Mac-03',
    category: 'iMac',
    location: 'Edit Bay 1',
    os: 'macOS 14.1',
    status: 'online',
    updateStatus: 'needs-update',
    ipAddress: '10.0.1.103',
    jamfId: 'JMF-004'
  },
  {
    name: 'Photo-Mac-04',
    category: 'Mac Studio',
    location: 'Edit Bay 2',
    os: 'macOS 14.3',
    status: 'online',
    updateStatus: 'current',
    ipAddress: '10.0.1.104',
    jamfId: 'JMF-005'
  },
  {
    name: 'Photo-Mac-05',
    category: 'Mac Studio',
    location: 'Edit Bay 1',
    os: 'macOS 14.3',
    status: 'online',
    updateStatus: 'current',
    ipAddress: '10.0.1.105',
    jamfId: 'JMF-006'
  }
];

export function DeviceTable() {
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
          <motion.button
            className="px-4 py-2 rounded-[0.75rem] bg-[var(--charcoal-accent)] text-white text-sm transition-all duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 20px var(--charcoal-glow)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            All Devices
          </motion.button>
          <motion.button
            className="px-4 py-2 rounded-[0.75rem] bg-[var(--background)] text-[var(--foreground)] text-sm border border-[var(--border)] transition-all duration-300"
            whileHover={{
              scale: 1.05,
              borderColor: 'var(--green-accent)',
              boxShadow: '0 0 15px var(--green-glow)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            Online Only
          </motion.button>
          <motion.button
            className="px-4 py-2 rounded-[0.75rem] bg-[var(--background)] text-[var(--foreground)] text-sm border border-[var(--border)] transition-all duration-300"
            whileHover={{
              scale: 1.05,
              borderColor: 'var(--orange-accent)',
              boxShadow: '0 0 15px var(--orange-glow)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            Needs Update
          </motion.button>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                Device Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                Category
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                Location
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                IP Address
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                OS Version
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                Updates
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                ARD
              </th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <motion.tr
                key={device.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{
                  backgroundColor: 'var(--background)',
                  boxShadow: device.status === 'online'
                    ? '0 0 15px var(--green-glow)'
                    : '0 0 10px rgba(0,0,0,0.05)'
                }}
                className="border-b border-[var(--border)] last:border-0 transition-all duration-300"
              >
                <td className="py-4 px-4">
                  <span className="font-medium text-sm text-[var(--foreground)]">
                    {device.name}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[var(--foreground)]">{device.category}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[var(--foreground)]">{device.location}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-mono text-[var(--foreground)]">{device.ipAddress}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[var(--foreground)]">{device.os}</span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium relative ${
                      device.status === 'online'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    style={
                      device.status === 'online'
                        ? {
                            boxShadow: '0 0 15px rgba(78, 205, 196, 0.4)',
                            animation: 'glow 2s ease-in-out infinite'
                          }
                        : undefined
                    }
                  >
                    <Circle
                      size={6}
                      fill="currentColor"
                      strokeWidth={0}
                      className={device.status === 'online' ? 'animate-pulse' : ''}
                    />
                    {device.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      device.updateStatus === 'current'
                        ? 'bg-blue-100 text-blue-800'
                        : device.updateStatus === 'needs-update'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {device.updateStatus === 'current'
                      ? 'Current'
                      : device.updateStatus === 'needs-update'
                      ? 'Needs Update'
                      : 'Pending'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  {device.status === 'online' ? (
                    <motion.a
                      href={`vnc://${device.ipAddress}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--charcoal-accent)] text-white rounded-lg text-xs transition-all duration-300 relative overflow-hidden group"
                      title="Connect via Apple Remote Desktop"
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--charcoal-glow)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Monitor size={14} strokeWidth={2} />
                      </motion.div>
                      Connect
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-[shimmer_1.5s_ease-in-out]" />
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

      <div className="mt-4 p-3 rounded-[0.875rem] bg-[var(--background)] border border-[var(--border)] text-center">
        <p className="text-xs text-[var(--muted-foreground)]">
          🔗 Connect to Jamf Pro API via Supabase for live device inventory and IP addresses
        </p>
      </div>
    </motion.div>
  );
}
