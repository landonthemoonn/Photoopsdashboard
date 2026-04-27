import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { CheckSquare, Square, ChevronDown, Plus, Pencil, Trash2, X, GripVertical } from 'lucide-react';

interface CheckItem { id: string; label: string; done: boolean; }
interface Checklist { id: string; title: string; description: string; color: string; items: CheckItem[]; }

const ACCENT_COLORS = ['#8FBF8A', '#E07060', '#9888C8', '#E09040', '#F0A870', '#E8C070', '#D86040', '#4BC8C8'];

const DEFAULT_CHECKLISTS: Checklist[] = [
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
      { id: 's7', label: 'Review today\'s shoot schedule in Outlook', done: false },
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

function loadChecklists(): Checklist[] {
  try {
    const stored = localStorage.getItem('photoops_checklists');
    return stored ? JSON.parse(stored) : DEFAULT_CHECKLISTS;
  } catch { return DEFAULT_CHECKLISTS; }
}

function saveChecklists(lists: Checklist[]) {
  localStorage.setItem('photoops_checklists', JSON.stringify(lists));
}

interface ModalProps {
  initial: Checklist | null;
  onSave: (cl: Checklist) => void;
  onClose: () => void;
}

function ChecklistModal({ initial, onSave, onClose }: ModalProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [color, setColor] = useState(initial?.color ?? ACCENT_COLORS[0]);
  const [items, setItems] = useState<CheckItem[]>(initial?.items ?? []);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    const t = newItem.trim();
    if (!t) return;
    setItems(prev => [...prev, { id: crypto.randomUUID(), label: t, done: false }]);
    setNewItem('');
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const updateItem = (id: string, label: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, label } : i));

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      color,
      items,
    });
  };

  const input = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--foreground)', padding: '8px 12px', fontSize: 13, width: '100%', outline: 'none' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden"
        style={{ background: 'rgba(18,13,10,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{initial ? 'Edit Checklist' : 'New Checklist'}</h2>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}><X size={16} /></button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Title</label>
            <input style={input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Checklist name" />
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Description</label>
            <input style={input} value={description} onChange={e => setDescription(e.target.value)} placeholder="When to run this checklist" />
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-2 block" style={{ color: 'var(--muted-foreground)' }}>Color</label>
            <div className="flex gap-2">
              {ACCENT_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} className="w-7 h-7 rounded-full transition-transform" style={{ background: c, transform: color === c ? 'scale(1.2)' : 'scale(1)', boxShadow: color === c ? `0 0 12px ${c}80` : 'none' }} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-2 block" style={{ color: 'var(--muted-foreground)' }}>Items ({items.length})</label>
            <div className="space-y-1.5 mb-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <GripVertical size={12} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                  <input style={{ ...input, flex: 1 }} value={item.label} onChange={e => updateItem(item.id, e.target.value)} />
                  <button onClick={() => removeItem(item.id)} style={{ color: '#D86040', flexShrink: 0 }}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input style={{ ...input, flex: 1 }} value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Add item..." />
              <button onClick={addItem} className="px-3 py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(224,112,96,0.12)', color: '#E07060', border: '1px solid rgba(224,112,96,0.2)', whiteSpace: 'nowrap' }}>
                <Plus size={13} />
              </button>
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

function ChecklistCard({ checklist, onEdit, onDelete }: { checklist: Checklist; onEdit: () => void; onDelete: () => void }) {
  const [items, setItems] = useState(checklist.items);
  const [open, setOpen] = useState(true);

  useEffect(() => { setItems(checklist.items); }, [checklist]);

  const toggle = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const done = items.filter(i => i.done).length;
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl overflow-hidden" style={{ background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: `1px solid ${checklist.color}20`, boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
      <div className="flex items-start justify-between p-5">
        <button onClick={() => setOpen(o => !o)} className="flex items-start gap-3 text-left flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${checklist.color}12`, border: `1px solid ${checklist.color}25` }}>
            <CheckSquare size={16} style={{ color: checklist.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{checklist.title}</h3>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{checklist.description}</p>
          </div>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <div className="text-right">
            <p className="text-sm font-bold font-mono" style={{ color: checklist.color }}>{pct}%</p>
            <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{done}/{items.length}</p>
          </div>
          <button onClick={onEdit} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Pencil size={12} />
          </button>
          <button onClick={onDelete} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(216,96,64,0.08)', color: '#D86040', border: '1px solid rgba(216,96,64,0.15)' }}>
            <Trash2 size={12} />
          </button>
          <ChevronDown size={16} onClick={() => setOpen(o => !o)} style={{ color: 'var(--muted-foreground)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', cursor: 'pointer' }} />
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div className="h-full rounded-full" style={{ background: checklist.color, boxShadow: `0 0 8px ${checklist.color}60` }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      {open && (
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
        </div>
      )}
    </motion.div>
  );
}

export function Checklists() {
  const [checklists, setChecklists] = useState<Checklist[]>(loadChecklists);
  const [modal, setModal] = useState<{ open: boolean; editing: Checklist | null }>({ open: false, editing: null });

  useEffect(() => { saveChecklists(checklists); }, [checklists]);

  const handleSave = (cl: Checklist) => {
    setChecklists(prev => {
      const idx = prev.findIndex(c => c.id === cl.id);
      return idx >= 0 ? prev.map(c => c.id === cl.id ? cl : c) : [...prev, cl];
    });
    setModal({ open: false, editing: null });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this checklist?')) setChecklists(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Operations</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Checklists</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Track daily, laydown, and weekly procedures.</p>
        </div>
        <button onClick={() => setModal({ open: true, editing: null })} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: 'rgba(224,112,96,0.1)', border: '1px solid rgba(224,112,96,0.2)', color: '#E07060' }}>
          <Plus size={15} /> New Checklist
        </button>
      </motion.div>

      <div className="space-y-4">
        {checklists.map(cl => (
          <ChecklistCard
            key={cl.id}
            checklist={cl}
            onEdit={() => setModal({ open: true, editing: cl })}
            onDelete={() => handleDelete(cl.id)}
          />
        ))}
        {checklists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2" style={{ background: 'rgba(22,16,12,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' }}>
            <CheckSquare size={20} style={{ color: 'var(--muted-foreground)' }} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No checklists yet</p>
            <button onClick={() => setModal({ open: true, editing: null })} className="text-xs mt-1" style={{ color: '#E07060' }}>+ Create one</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal.open && (
          <ChecklistModal initial={modal.editing} onSave={handleSave} onClose={() => setModal({ open: false, editing: null })} />
        )}
      </AnimatePresence>
    </div>
  );
}
