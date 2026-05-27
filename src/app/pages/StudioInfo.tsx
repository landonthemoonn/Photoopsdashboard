import { motion } from 'motion/react';
import { MapPin, Wifi, Camera, Monitor, HardDrive, Users, Phone } from 'lucide-react';

const spaces = [
  { name: 'Main Stage', type: 'Shooting', capacity: '8 people', macs: 2, color: '#E8C070', status: 'active' },
  { name: 'Edit Bay 1', type: 'Editing', capacity: '3 people', macs: 2, color: '#E07060', status: 'active' },
  { name: 'Edit Bay 2', type: 'Editing', capacity: '3 people', macs: 1, color: '#9888C8', status: 'active' },
  { name: 'Tech Desk', type: 'IT / Tech', capacity: '2 people', macs: 1, color: '#F0A870', status: 'active' },
  { name: 'Storage', type: 'Equipment', capacity: '—', macs: 1, color: '#E09040', status: 'staging' },
];

const equipment = [
  { name: 'Mac Studio M2 Ultra (×4)', category: 'Computers', icon: Monitor, color: '#E07060' },
  { name: 'iMac Pro 27" (×1)', category: 'Computers', icon: Monitor, color: '#9888C8' },
  { name: 'MacBook Pro M3 (×2)', category: 'Computers', icon: Monitor, color: '#F0A870' },
  { name: 'Mac mini M2 (×1)', category: 'Computers', icon: Monitor, color: '#E09040' },
  { name: 'NAS — Synology DS1821+', category: 'Storage', icon: HardDrive, color: '#E8C070' },
  { name: 'Wireless network — Ubiquiti', category: 'Network', icon: Wifi, color: '#8FBF8A' },
  { name: 'Phase One IQ4 150MP', category: 'Cameras', icon: Camera, color: '#D86040' },
  { name: 'Canon EOS R5 (×2)', category: 'Cameras', icon: Camera, color: '#E09040' },
];

const contacts = [
  { name: 'Landon Strempel', role: 'Lead Tech / IT', email: 'lstrempel@gap.com', color: '#E07060' },
  { name: 'Sarah Chen', role: 'Photo Director', email: 'schen@gap.com', color: '#E8C070' },
  { name: 'Mike Rodriguez', role: 'Studio Manager', email: 'mrodriguez@gap.com', color: '#9888C8' },
  { name: 'Gap IT Helpdesk', role: 'IT Support', phone: '+1 (415) 555-0100', color: '#8FBF8A' },
];

export function StudioInfo() {
  const glass = { background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Reference</p>
        <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Studio Info</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Gap Inc. Photo Studio — San Francisco, CA</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-5">
        {/* Floor plan / spaces */}
        <div className="col-span-2">
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>Studio Spaces</p>
          <div className="space-y-2 mb-5">
            {spaces.map((space, i) => (
              <motion.div key={space.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 p-4 rounded-xl" style={{ ...glass, borderColor: `${space.color}20` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${space.color}10`, border: `1px solid ${space.color}25` }}>
                  <MapPin size={16} style={{ color: space.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{space.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{space.type} · {space.capacity} · {space.macs} Mac{space.macs !== 1 ? 's' : ''}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={space.status === 'active' ? { background: 'rgba(143,191,138,0.1)', color: '#8FBF8A', border: '1px solid rgba(143,191,138,0.2)' } : { background: 'rgba(224,144,64,0.1)', color: '#E09040', border: '1px solid rgba(224,144,64,0.2)' }}>
                  {space.status === 'active' ? 'Active' : 'Staging'}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Equipment */}
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>Equipment</p>
          <div className="grid grid-cols-2 gap-2">
            {equipment.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.04 }} className="flex items-center gap-3 p-3 rounded-xl" style={glass}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}12` }}>
                    <Icon size={13} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{item.name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{item.category}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Contacts */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>Contacts</p>
          <div className="space-y-2">
            {contacts.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="p-4 rounded-xl" style={glass}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${c.color}15`, color: c.color }}>
                    {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{c.role}</p>
                  </div>
                </div>
                {c.email && <p className="text-[10px] font-mono" style={{ color: c.color, opacity: 0.8 }}>{c.email}</p>}
                {c.phone && (
                  <div className="flex items-center gap-1">
                    <Phone size={10} style={{ color: c.color }} />
                    <p className="text-[10px] font-mono" style={{ color: c.color, opacity: 0.8 }}>{c.phone}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Quick facts */}
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3 mt-5" style={{ color: 'var(--muted-foreground)' }}>Quick Facts</p>
          <div className="p-4 rounded-xl space-y-2" style={glass}>
            {[
              { label: 'Network', value: '10.0.1.0/24' },
              { label: 'Gateway', value: '10.0.1.1' },
              { label: 'DNS', value: '8.8.8.8 / 8.8.4.4' },
              { label: 'Jamf URL', value: 'gapinc.jamfcloud.com' },
              { label: 'MDM', value: 'Jamf Pro' },
              { label: 'File Sync', value: 'Resilio Sync' },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{f.label}</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--foreground)', opacity: 0.75 }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
