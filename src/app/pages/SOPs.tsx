import { motion } from 'motion/react';
import { FileText, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const sops = [
  { id: 1, title: 'New Mac Enrollment — Jamf Pro', category: 'IT Setup', status: 'active', steps: 12, owner: 'Tech Team', updated: 'Apr 10', color: '#BF5AF2' },
  { id: 2, title: 'Studio Startup Procedure', category: 'Operations', status: 'active', steps: 8, owner: 'Studio Team', updated: 'Apr 8', color: '#00FF90' },
  { id: 3, title: 'Production Laydown — End of Day', category: 'Operations', status: 'active', steps: 6, owner: 'Studio Team', updated: 'Apr 5', color: '#00B4FF' },
  { id: 4, title: 'Capture One Session Setup', category: 'Photo Ops', status: 'active', steps: 9, owner: 'Photo Team', updated: 'Apr 3', color: '#FFD60A' },
  { id: 5, title: 'Network Troubleshooting Runbook', category: 'IT Setup', status: 'active', steps: 15, owner: 'Tech Team', updated: 'Mar 30', color: '#FF9500' },
  { id: 6, title: 'Resilio Sync — New Node Setup', category: 'File Sync', status: 'review', steps: 7, owner: 'Tech Team', updated: 'Mar 25', color: '#00E5FF' },
  { id: 7, title: 'Equipment Checkout & Return', category: 'Operations', status: 'draft', steps: 5, owner: 'Studio Team', updated: 'Mar 20', color: '#FF2D78' },
  { id: 8, title: 'macOS Update Deployment via Jamf', category: 'IT Setup', status: 'active', steps: 11, owner: 'Tech Team', updated: 'Mar 18', color: '#BF5AF2' },
];

const statusConfig = {
  active: { label: 'Active', color: '#00FF90', bg: 'rgba(0,255,144,0.1)', border: 'rgba(0,255,144,0.2)', icon: CheckCircle },
  review: { label: 'In Review', color: '#FF9500', bg: 'rgba(255,149,0,0.1)', border: 'rgba(255,149,0,0.2)', icon: Clock },
  draft: { label: 'Draft', color: '#4B5060', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.08)', icon: AlertCircle },
};

const categories = ['All', 'Operations', 'IT Setup', 'Photo Ops', 'File Sync'];

export function SOPs() {
  const glass = { background: 'rgba(10,12,22,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Procedures</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Standard Operating Procedures</h1>
        </div>
        <div className="flex gap-3">
          {Object.entries(statusConfig).map(([key, s]) => (
            <div key={key} className="flex items-center gap-1.5 text-[10px]" style={{ color: s.color }}>
              <s.icon size={11} />
              <span>{sops.filter(p => p.status === key).length} {s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Category filter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 mb-5">
        {categories.map(cat => (
          <button key={cat} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {cat}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {sops.map((sop, i) => {
          const sc = statusConfig[sop.status as keyof typeof statusConfig];
          const StatusIcon = sc.icon;
          return (
            <motion.div key={sop.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-5 rounded-xl cursor-pointer transition-all duration-200 group" style={{ ...glass, borderColor: `${sop.color}20` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${sop.color}40`; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${sop.color}12`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${sop.color}20`; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${sop.color}12`, border: `1px solid ${sop.color}25` }}>
                  <FileText size={16} style={{ color: sop.color }} />
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                  <StatusIcon size={9} /> {sc.label}
                </span>
              </div>

              <h3 className="text-sm font-medium mb-1 leading-snug group-hover:text-white transition-colors" style={{ color: 'var(--foreground)' }}>{sop.title}</h3>
              <p className="text-[10px] mb-4" style={{ color: 'var(--muted-foreground)' }}>{sop.category} · {sop.steps} steps · {sop.owner}</p>

              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>Updated {sop.updated}</span>
                <ChevronRight size={14} style={{ color: sop.color }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
