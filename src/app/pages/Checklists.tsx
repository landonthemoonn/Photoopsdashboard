import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { CheckSquare, Square, ChevronDown, Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface CheckItem { id: string; label: string; done: boolean; }
interface Checklist { id: string; title: string; description: string; color: string; items: CheckItem[]; }

const STORAGE_KEY = 'photoops_checklists';
const COLORS = ['#8FBF8A', '#E07060', '#9888C8', '#E09040', '#6CA8D4', '#E8C070'];

const defaultChecklists: Checklist[] = [
  {
    id: 'startup',
    title: 'Daily Startup',
    description: 'Run every morning before first production shoot',
    color: '#8FBF8A',
    items: [
      { id: 's1', label: 'Power on all stage Macs', done: false },
      { id: 's2', label: 'Verify all Macs appear online in Jamf', done: false },
      { id: 's3', label: 'Launch Capture One on tether machines', done: false },
      { id: 's4', label: 'Test tether connection on Main Stage', done: false },
      { id: 's5', label: 'Confirm Resilio Sync is active on all nodes', done: false },
      { id: 's6', label: 'Check network connectivity — ping 10.0.1.1', done: false },
      { id: 's7', label: "Review today's shoot schedule in Outlook", done: false },
      { id: 's8', label: 'Stage props and equipment per shoot brief', done: false },
    ],
  },
  {
    id: 'laydown',
    title: 'Production Laydown',
    description: 'End-of-day shutdown procedure',
    color: '#E07060',
    items: [
      { id: 'l1', label: 'Export and back up all shoot sessions', done: false },
      { id: 'l2', label: 'Verify Resilio Sync has completed transfers', done: false },
      { id: 'l3', label: 'Close Capture One on all machines', done: false },
      { id: 'l4', label: 'Run Jamf policy check on all devices', done: false },
      { id: 'l5', label: 'Power down stage lighting rigs', done: false },
      { id: 'l6', label: 'Return equipment to storage', done: false },
    ],
  },
  {
    id: 'weekly',
    title: 'Weekly Maintenance',
    description: 'Every Monday morning',
    color: '#9888C8',
    items: [
      { id: 'w1', label: 'Check for pending macOS updates in Jamf', done: false },
      { id: 'w2', label: 'Review Jamf policy failures from prior week', done: false },
      { id: 'w3', label: 'Clean camera sensor on tether machines', done: false },
      { id: 'w4', label: 'Verify all cables and adapters intact', done: false },
      { id: 'w5', label: 'Test Apple Remote Desktop on all Macs', done: false },
      { id: 'w6', label: 'Archive completed Capture One sessions', done: false },
      { id: 'w7', label: 'Update KB with any new learnings from week', done: false },
    ],
  },
];

function uid() { return Math.random().toString(36).slice(2, 9); }

function loadChecklists(): Checklist[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultChecklists;
  } catch { return defaultChecklists; }
}

function saveChecklists(lists: Checklist[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ checklist, onSave, onClose }: {
  checklist: Checklist | null;
  onSave: (cl: Checklist) => void;
  onClose: () => void;
}) {
  const isNew = checklist === null;
  const [title, setTitle] = useState(checklist?.title ?? '');
  const [description, setDescription] = useState(checklist?.description ?? '');
  const [color, setColor] = useState(checklist?.color ?? COLORS[0]);
  const [items, setItems] = useState<CheckItem[]>(checklist?.items ?? []);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    const label = newItem.trim();
    if (!label) return;
    setItems(prev => [...prev, { id: uid(), label, done: false }]);
    setNewItem('');
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const editItemLabel = (id: string, label: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, label } : i));

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: checklist?.id ?? uid(),
      title: title.trim(),
      description: description.trim(),
      color,
      items,
    });
  };

  const glass = { background: 'rgba(22,16,12,0.92)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2 }}
        style={glass}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              {isNew ? 'New Checklist' : 'Edit Checklist'}
            </h2>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted-foreground)' }}>
              <X size={14} />
            </button>
          </div>

          {/* Title */}
          <div className="mb-3">
            <label className="text-[10px] font-semibold tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Pre-Shoot Setup" className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--foreground)' }} />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="text-[10px] font-semibold tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="When to run this checklist" className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--foreground)' }} />
          </div>

          {/* Color */}
          <div className="mb-5">
            <label className="text-[10px] font-semibold tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Color</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} className="w-7 h-7 rounded-full flex items-center justify-center transition-transform" style={{ background: c, transform: color === c ? 'scale(1.2)' : 'scale(1)', boxShadow: color === c ? `0 0 10px ${c}80` : 'none' }}>
                  {color === c && <Check size={12} color="white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="mb-4">
            <label className="text-[10px] font-semibold tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Items</label>
            <div className="space-y-1.5 mb-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <input value={item.label} onChange={e => editItemLabel(item.id, e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg text-xs focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--foreground)' }} />
                  <button onClick={() => removeItem(item.id)} className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Add item… (press Enter)" className="flex-1 px-3 py-1.5 rounded-lg text-xs focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}30`, color: 'var(--foreground)' }} />
              <button onClick={addItem} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--muted-foreground)' }}>Cancel</button>
            <button onClick={handleSave} disabled={!title.trim()} className="px-4 py-2 rounded-lg text-xs font-semibold transition-opacity" style={{ background: color, color: 'white', opacity: title.trim() ? 1 : 0.4 }}>
              {isNew ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Checklist Card ────────────────────────────────────────────────────────────
function ChecklistCard({ checklist, onEdit, onDelete }: {
  checklist: Checklist;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [items, setItems] = useState(checklist.items);
  const [open, setOpen] = useState(true);

  useEffect(() => { setItems(checklist.items); }, [checklist.items]);

  const toggle = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const done = items.filter(i => i.done).length;
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl overflow-hidden" style={{ background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: `1px solid ${checklist.color}20`, boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
      <div className="flex items-start justify-between p-5">
        <button onClick={() => setOpen(o => !o)} className="flex items-start gap-3 flex-1 text-left">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${checklist.color}12`, border: `1px solid ${checklist.color}25` }}>
            <CheckSquare size={16} style={{ color: checklist.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{checklist.title}</h3>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{checklist.description}</p>
          </div>
        </button>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <div className="text-right mr-1">
            <p className="text-sm font-bold font-mono" style={{ color: checklist.color }}>{pct}%</p>
            <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{done}/{items.length}</p>
          </div>
          <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--muted-foreground)' }} title="Edit checklist">
            <Pencil size={12} />
          </button>
          <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--muted-foreground)' }} title="Delete checklist">
            <Trash2 size={12} />
          </button>
          <button onClick={() => setOpen(o => !o)} className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--muted-foreground)' }}>
            <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div className="h-full rounded-full" style={{ background: checklist.color, boxShadow: `0 0 8px ${checklist.color}60` }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-5 space-y-2">
              {items.map(item => (
                <button key={item.id} onClick={() => toggle(item.id)} className="w-full flex items-center gap-3 text-left transition-all duration-150">
                  <div className="flex-shrink-0" style={{ color: item.done ? checklist.color : 'var(--muted-foreground)' }}>
                    {item.done ? <CheckSquare size={16} /> : <Square size={16} />}
                  </div>
                  <span className="text-xs transition-all" style={{ color: item.done ? 'var(--muted-foreground)' : 'var(--foreground)', textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.5 : 1 }}>
                    {item.label}
                  </span>
                </button>
              ))}
              {items.length === 0 && (
                <p className="text-xs text-center py-2" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>No items yet — click Edit to add some</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function Checklists() {
  const [checklists, setChecklists] = useState<Checklist[]>(loadChecklists);
  const [editing, setEditing] = useState<Checklist | null | 'new'>( null);

  useEffect(() => { saveChecklists(checklists); }, [checklists]);

  const handleSave = (cl: Checklist) => {
    setChecklists(prev => {
      const exists = prev.find(c => c.id === cl.id);
      return exists ? prev.map(c => c.id === cl.id ? cl : c) : [...prev, cl];
    });
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this checklist?')) {
      setChecklists(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Operations</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Checklists</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Track daily, laydown, and weekly procedures.</p>
        </div>
        <motion.button
          onClick={() => setEditing('new')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(224,112,96,0.12)', border: '1px solid rgba(224,112,96,0.25)', color: '#E07060' }}
        >
          <Plus size={15} /> New Checklist
        </motion.button>
      </motion.div>

      <div className="space-y-4">
        {checklists.map(cl => (
          <ChecklistCard
            key={cl.id}
            checklist={cl}
            onEdit={() => setEditing(cl)}
            onDelete={() => handleDelete(cl.id)}
          />
        ))}
        {checklists.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--muted-foreground)' }}>
            <p className="text-sm">No checklists yet.</p>
            <p className="text-xs mt-1 opacity-60">Click "New Checklist" to create one.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing !== null && (
          <EditModal
            checklist={editing === 'new' ? null : editing}
            onSave={handleSave}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
