import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { FileText, ChevronRight, CheckCircle, Clock, AlertCircle, Plus, Pencil, Trash2, X } from 'lucide-react';

interface SOP {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'review' | 'draft';
  steps: number;
  owner: string;
  updated: string;
  color: string;
}

const ACCENT_COLORS = ['#9888C8', '#8FBF8A', '#E07060', '#E8C070', '#E09040', '#F0A870', '#D86040', '#4BC8C8'];

const STATUS_CONFIG = {
  active: { label: 'Active', color: '#8FBF8A', bg: 'rgba(143,191,138,0.1)', border: 'rgba(143,191,138,0.2)', icon: CheckCircle },
  review: { label: 'In Review', color: '#E09040', bg: 'rgba(224,144,64,0.1)', border: 'rgba(224,144,64,0.2)', icon: Clock },
  draft: { label: 'Draft', color: '#4B5060', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.08)', icon: AlertCircle },
};

const DEFAULT_SOPS: SOP[] = [
  { id: '1', title: 'New Mac Enrollment — Jamf Pro', category: 'IT Setup', status: 'active', steps: 12, owner: 'Tech Team', updated: 'Apr 10', color: '#9888C8' },
  { id: '2', title: 'Studio Startup Procedure', category: 'Operations', status: 'active', steps: 8, owner: 'Studio Team', updated: 'Apr 8', color: '#8FBF8A' },
  { id: '3', title: 'Production Laydown — End of Day', category: 'Operations', status: 'active', steps: 6, owner: 'Studio Team', updated: 'Apr 5', color: '#E07060' },
  { id: '4', title: 'Capture One Session Setup', category: 'Photo Ops', status: 'active', steps: 9, owner: 'Photo Team', updated: 'Apr 3', color: '#E8C070' },
  { id: '5', title: 'Network Troubleshooting Runbook', category: 'IT Setup', status: 'active', steps: 15, owner: 'Tech Team', updated: 'Mar 30', color: '#E09040' },
  { id: '6', title: 'Resilio Sync — New Node Setup', category: 'File Sync', status: 'review', steps: 7, owner: 'Tech Team', updated: 'Mar 25', color: '#F0A870' },
  { id: '7', title: 'Equipment Checkout & Return', category: 'Operations', status: 'draft', steps: 5, owner: 'Studio Team', updated: 'Mar 20', color: '#D86040' },
  { id: '8', title: 'macOS Update Deployment via Jamf', category: 'IT Setup', status: 'active', steps: 11, owner: 'Tech Team', updated: 'Mar 18', color: '#9888C8' },
];

function loadSOPs(): SOP[] {
  try {
    const s = localStorage.getItem('photoops_sops');
    return s ? JSON.parse(s) : DEFAULT_SOPS;
  } catch { return DEFAULT_SOPS; }
}

function saveSOPs(sops: SOP[]) {
  localStorage.setItem('photoops_sops', JSON.stringify(sops));
}

function SOPModal({ initial, categories, onSave, onClose }: { initial: SOP | null; categories: string[]; onSave: (s: SOP) => void; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState(initial?.category ?? categories[0] ?? 'Operations');
  const [newCat, setNewCat] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [status, setStatus] = useState<SOP['status']>(initial?.status ?? 'active');
  const [steps, setSteps] = useState(initial?.steps ?? 5);
  const [owner, setOwner] = useState(initial?.owner ?? '');
  const [color, setColor] = useState(initial?.color ?? ACCENT_COLORS[0]);

  const allCats = [...new Set([...categories, category])].filter(Boolean);

  const handleSave = () => {
    if (!title.trim()) return;
    const cat = (showNewCat && newCat.trim()) ? newCat.trim() : category;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      category: cat,
      status,
      steps,
      owner: owner.trim(),
      updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      color,
    });
  };

  const inp = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--foreground)', padding: '8px 12px', fontSize: 13, width: '100%', outline: 'none' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden"
        style={{ background: 'rgba(18,13,10,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{initial ? 'Edit SOP' : 'New SOP'}</h2>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}><X size={16} /></button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Title</label>
            <input style={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="SOP title" />
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Category</label>
            {!showNewCat ? (
              <div className="flex gap-2">
                <select style={{ ...inp, flex: 1 }} value={category} onChange={e => setCategory(e.target.value)}>
                  {allCats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => setShowNewCat(true)} className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>+ New</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input style={{ ...inp, flex: 1 }} value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category name" autoFocus />
                <button onClick={() => setShowNewCat(false)} className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Status</label>
              <select style={inp} value={status} onChange={e => setStatus(e.target.value as SOP['status'])}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Steps</label>
              <input style={inp} type="number" min={1} value={steps} onChange={e => setSteps(Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Owner</label>
            <input style={inp} value={owner} onChange={e => setOwner(e.target.value)} placeholder="Tech Team" />
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-2 block" style={{ color: 'var(--muted-foreground)' }}>Color</label>
            <div className="flex gap-2">
              {ACCENT_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} className="w-7 h-7 rounded-full transition-transform" style={{ background: c, transform: color === c ? 'scale(1.2)' : 'scale(1)', boxShadow: color === c ? `0 0 12px ${c}80` : 'none' }} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(224,112,96,0.15)', color: '#E07060', border: '1px solid rgba(224,112,96,0.3)' }}>Save</button>
        </div>
      </motion.div>
    </div>
  );
}

export function SOPs() {
  const [sops, setSOPs] = useState<SOP[]>(loadSOPs);
  const [activeCategory, setActiveCategory] = useState('All');
  const [modal, setModal] = useState<{ open: boolean; editing: SOP | null }>({ open: false, editing: null });

  useEffect(() => { saveSOPs(sops); }, [sops]);

  const categories = ['All', ...Array.from(new Set(sops.map(s => s.category))).sort()];

  const filtered = sops.filter(s => activeCategory === 'All' || s.category === activeCategory);

  const handleSave = (sop: SOP) => {
    setSOPs(prev => {
      const idx = prev.findIndex(s => s.id === sop.id);
      return idx >= 0 ? prev.map(s => s.id === sop.id ? sop : s) : [sop, ...prev];
    });
    setModal({ open: false, editing: null });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this SOP?')) setSOPs(prev => prev.filter(s => s.id !== id));
  };

  const glass = { background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Procedures</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Standard Operating Procedures</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            {Object.entries(STATUS_CONFIG).map(([key, s]) => (
              <div key={key} className="flex items-center gap-1.5 text-[10px]" style={{ color: s.color }}>
                <s.icon size={11} />
                <span>{sops.filter(p => p.status === key).length} {s.label}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setModal({ open: true, editing: null })} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: 'rgba(224,112,96,0.1)', border: '1px solid rgba(224,112,96,0.2)', color: '#E07060' }}>
            <Plus size={15} /> New SOP
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 mb-5 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200" style={{ background: activeCategory === cat ? 'rgba(224,112,96,0.12)' : 'rgba(255,255,255,0.04)', color: activeCategory === cat ? '#E07060' : 'var(--muted-foreground)', border: activeCategory === cat ? '1px solid rgba(224,112,96,0.25)' : '1px solid rgba(255,255,255,0.06)' }}>
            {cat}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((sop, i) => {
          const sc = STATUS_CONFIG[sop.status];
          const StatusIcon = sc.icon;
          return (
            <motion.div key={sop.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl transition-all duration-200 group relative"
              style={{ ...glass, borderColor: `${sop.color}20` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${sop.color}40`; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${sop.color}12`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${sop.color}20`; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${sop.color}12`, border: `1px solid ${sop.color}25` }}>
                  <FileText size={16} style={{ color: sop.color }} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    <StatusIcon size={9} /> {sc.label}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal({ open: true, editing: sop })} className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--muted-foreground)' }}><Pencil size={10} /></button>
                    <button onClick={() => handleDelete(sop.id)} className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(216,96,64,0.1)', color: '#D86040' }}><Trash2 size={10} /></button>
                  </div>
                </div>
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
        {filtered.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-20 gap-2" style={{ ...glass }}>
            <FileText size={20} style={{ color: 'var(--muted-foreground)' }} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No SOPs in this category</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal.open && (
          <SOPModal initial={modal.editing} categories={Array.from(new Set(sops.map(s => s.category)))} onSave={handleSave} onClose={() => setModal({ open: false, editing: null })} />
        )}
      </AnimatePresence>
    </div>
  );
}
