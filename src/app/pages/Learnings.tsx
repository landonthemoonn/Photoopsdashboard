import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Lightbulb, Tag, Plus, Pencil, Trash2, X } from 'lucide-react';

interface Learning {
  id: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  author: string;
  color: string;
  impact: 'high' | 'medium' | 'low';
}

const ACCENT_COLORS = ['#E8C070', '#9888C8', '#E09040', '#F0A870', '#E07060', '#8FBF8A', '#D86040', '#4BC8C8'];

const IMPACT_CONFIG = {
  high: { label: 'High Impact', color: '#D86040', bg: 'rgba(216,96,64,0.1)' },
  medium: { label: 'Medium', color: '#E09040', bg: 'rgba(224,144,64,0.1)' },
  low: { label: 'Low', color: '#4B5060', bg: 'rgba(255,255,255,0.05)' },
};

const DEFAULT_LEARNINGS: Learning[] = [
  { id: '1', title: 'Capture One crashes when tethering via hub — use direct USB', category: 'Photo Ops', tags: ['Capture One', 'USB', 'Hardware'], date: 'Apr 18', author: 'LT', color: '#E8C070', impact: 'high' },
  { id: '2', title: 'Jamf policies fail silently if device is on VPN — disable VPN first', category: 'IT', tags: ['Jamf', 'VPN', 'Networking'], date: 'Apr 15', author: 'MR', color: '#9888C8', impact: 'high' },
  { id: '3', title: 'Mac Studios run hot in the Edit Bay — open rack door during production', category: 'Hardware', tags: ['Mac Studio', 'Thermal'], date: 'Apr 12', author: 'SC', color: '#E09040', impact: 'medium' },
  { id: '4', title: 'Resilio Sync is faster with SMB disabled on macOS Sonoma', category: 'File Sync', tags: ['Resilio', 'Networking', 'Performance'], date: 'Apr 10', author: 'LT', color: '#F0A870', impact: 'medium' },
  { id: '5', title: 'Apple Remote Desktop needs re-auth after macOS update — schedule update windows', category: 'IT', tags: ['ARD', 'macOS Update'], date: 'Apr 8', author: 'MR', color: '#E07060', impact: 'medium' },
  { id: '6', title: 'Capture One sessions should live on SSD not NAS for tethering latency', category: 'Photo Ops', tags: ['Capture One', 'Storage', 'Performance'], date: 'Apr 5', author: 'JL', color: '#8FBF8A', impact: 'low' },
];

function loadLearnings(): Learning[] {
  try {
    const s = localStorage.getItem('photoops_learnings');
    return s ? JSON.parse(s) : DEFAULT_LEARNINGS;
  } catch { return DEFAULT_LEARNINGS; }
}

function saveLearnings(items: Learning[]) {
  localStorage.setItem('photoops_learnings', JSON.stringify(items));
}

function LearningModal({ initial, onSave, onClose }: { initial: Learning | null; onSave: (l: Learning) => void; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [tagsRaw, setTagsRaw] = useState(initial?.tags.join(', ') ?? '');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [impact, setImpact] = useState<Learning['impact']>(initial?.impact ?? 'medium');
  const [color, setColor] = useState(initial?.color ?? ACCENT_COLORS[0]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      category: category.trim() || 'General',
      tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      author: author.trim() || '—',
      color,
      impact,
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
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{initial ? 'Edit Learning' : 'Add Learning'}</h2>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}><X size={16} /></button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>What did you learn?</label>
            <textarea style={{ ...inp, height: 80, resize: 'vertical' as const }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Describe the learning concisely..." autoFocus />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Category</label>
              <input style={inp} value={category} onChange={e => setCategory(e.target.value)} placeholder="Photo Ops, IT, Hardware…" />
            </div>
            <div className="w-24">
              <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Author</label>
              <input style={inp} value={author} onChange={e => setAuthor(e.target.value)} placeholder="LT" maxLength={4} />
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Tags <span style={{ opacity: 0.5 }}>(comma separated)</span></label>
            <input style={inp} value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} placeholder="Capture One, USB, Hardware" />
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-2 block" style={{ color: 'var(--muted-foreground)' }}>Impact</label>
            <div className="flex gap-2">
              {(Object.entries(IMPACT_CONFIG) as [Learning['impact'], (typeof IMPACT_CONFIG)[keyof typeof IMPACT_CONFIG]][]).map(([k, v]) => (
                <button key={k} onClick={() => setImpact(k)} className="flex-1 py-2 rounded-lg text-xs font-medium transition-all" style={{ background: impact === k ? v.bg : 'rgba(255,255,255,0.04)', color: impact === k ? v.color : 'var(--muted-foreground)', border: impact === k ? `1px solid ${v.color}40` : '1px solid rgba(255,255,255,0.07)' }}>
                  {v.label}
                </button>
              ))}
            </div>
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

export function Learnings() {
  const [learnings, setLearnings] = useState<Learning[]>(loadLearnings);
  const [modal, setModal] = useState<{ open: boolean; editing: Learning | null }>({ open: false, editing: null });

  useEffect(() => { saveLearnings(learnings); }, [learnings]);

  const handleSave = (l: Learning) => {
    setLearnings(prev => {
      const idx = prev.findIndex(x => x.id === l.id);
      return idx >= 0 ? prev.map(x => x.id === l.id ? l : x) : [l, ...prev];
    });
    setModal({ open: false, editing: null });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this learning?')) setLearnings(prev => prev.filter(l => l.id !== id));
  };

  const glass = { background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Team</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Learnings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Hard-won knowledge from the floor.</p>
        </div>
        <button onClick={() => setModal({ open: true, editing: null })} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: 'rgba(224,112,96,0.1)', border: '1px solid rgba(224,112,96,0.2)', color: '#E07060' }}>
          <Plus size={15} /> Add Learning
        </button>
      </motion.div>

      <div className="space-y-3">
        {learnings.map((item, i) => {
          const ic = IMPACT_CONFIG[item.impact];
          return (
            <motion.div key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-stretch gap-4 p-5 rounded-xl transition-all duration-200 group"
              style={glass}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${item.color}30`; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${item.color}10`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
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
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal({ open: true, editing: item })} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.08)' }}><Pencil size={11} /></button>
                  <button onClick={() => handleDelete(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(216,96,64,0.08)', color: '#D86040', border: '1px solid rgba(216,96,64,0.15)' }}><Trash2 size={11} /></button>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${item.color}15`, color: item.color }}>{item.author}</div>
                <p className="text-[10px]" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>{item.date}</p>
              </div>
            </motion.div>
          );
        })}
        {learnings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2" style={glass}>
            <Lightbulb size={20} style={{ color: 'var(--muted-foreground)' }} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No learnings yet</p>
            <button onClick={() => setModal({ open: true, editing: null })} className="text-xs mt-1" style={{ color: '#E07060' }}>+ Add the first one</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal.open && (
          <LearningModal initial={modal.editing} onSave={handleSave} onClose={() => setModal({ open: false, editing: null })} />
        )}
      </AnimatePresence>
    </div>
  );
}
