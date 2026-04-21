import { motion } from 'motion/react';
import { Lightbulb, Tag, Plus } from 'lucide-react';

const learnings = [
  { id: 1, title: 'Capture One crashes when tethering via hub — use direct USB', category: 'Photo Ops', tags: ['Capture One', 'USB', 'Hardware'], date: 'Apr 18', author: 'LT', color: '#E8C070', impact: 'high' },
  { id: 2, title: 'Jamf policies fail silently if device is on VPN — disable VPN first', category: 'IT', tags: ['Jamf', 'VPN', 'Networking'], date: 'Apr 15', author: 'MR', color: '#9888C8', impact: 'high' },
  { id: 3, title: 'Mac Studios run hot in the Edit Bay — open rack door during production', category: 'Hardware', tags: ['Mac Studio', 'Thermal'], date: 'Apr 12', author: 'SC', color: '#E09040', impact: 'medium' },
  { id: 4, title: 'Resilio Sync is faster with SMB disabled on macOS Sonoma', category: 'File Sync', tags: ['Resilio', 'Networking', 'Performance'], date: 'Apr 10', author: 'LT', color: '#F0A870', impact: 'medium' },
  { id: 5, title: 'Apple Remote Desktop needs re-auth after macOS update — schedule update windows', category: 'IT', tags: ['ARD', 'macOS Update'], date: 'Apr 8', author: 'MR', color: '#E07060', impact: 'medium' },
  { id: 6, title: 'Capture One sessions should live on SSD not NAS for tethering latency', category: 'Photo Ops', tags: ['Capture One', 'Storage', 'Performance'], date: 'Apr 5', author: 'JL', color: '#8FBF8A', impact: 'low' },
];

const impactConfig = {
  high: { label: 'High Impact', color: '#D86040', bg: 'rgba(216,96,64,0.1)' },
  medium: { label: 'Medium', color: '#E09040', bg: 'rgba(224,144,64,0.1)' },
  low: { label: 'Low', color: '#4B5060', bg: 'rgba(255,255,255,0.05)' },
};

export function Learnings() {
  const glass = { background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Team</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Learnings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Hard-won knowledge from the floor.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: 'rgba(224,112,96,0.1)', border: '1px solid rgba(224,112,96,0.2)', color: 'var(--neon-blue)' }}>
          <Plus size={15} /> Add Learning
        </button>
      </motion.div>

      <div className="space-y-3">
        {learnings.map((item, i) => {
          const ic = impactConfig[item.impact as keyof typeof impactConfig];
          return (
            <motion.div key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-stretch gap-4 p-5 rounded-xl transition-all duration-200 group" style={glass}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${item.color}30`; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${item.color}10`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              {/* Left accent */}
              <div className="w-0.5 rounded-full flex-shrink-0" style={{ background: item.color, opacity: 0.7 }} />

              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 self-start" style={{ background: `${item.color}12` }}>
                <Lightbulb size={15} style={{ color: item.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug mb-2" style={{ color: 'var(--foreground)' }}>{item.title}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: ic.bg, color: ic.color }}>{ic.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--muted-foreground)' }}>{item.category}</span>
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] flex items-center gap-1" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
                      <Tag size={8} /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ml-auto" style={{ background: `${item.color}15`, color: item.color }}>{item.author}</div>
                <p className="text-[10px]" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>{item.date}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
