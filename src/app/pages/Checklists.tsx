import { motion } from 'motion/react';
import { useState } from 'react';
import { CheckSquare, Square, ChevronDown } from 'lucide-react';

interface CheckItem { id: string; label: string; done: boolean; }
interface Checklist { id: string; title: string; description: string; color: string; items: CheckItem[]; }

const initialChecklists: Checklist[] = [
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

function ChecklistCard({ checklist }: { checklist: Checklist }) {
  const [items, setItems] = useState(checklist.items);
  const [open, setOpen] = useState(true);

  const toggle = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const done = items.filter(i => i.done).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl overflow-hidden" style={{ background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: `1px solid ${checklist.color}20`, boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
      {/* Header */}
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-start justify-between p-5 text-left">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${checklist.color}12`, border: `1px solid ${checklist.color}25` }}>
            <CheckSquare size={16} style={{ color: checklist.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{checklist.title}</h3>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{checklist.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm font-bold font-mono" style={{ color: checklist.color }}>{pct}%</p>
            <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{done}/{items.length}</p>
          </div>
          <ChevronDown size={16} style={{ color: 'var(--muted-foreground)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </div>
      </button>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div className="h-full rounded-full" style={{ background: checklist.color, boxShadow: `0 0 8px ${checklist.color}60` }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      {open && (
        <div className="px-5 pb-5 space-y-2">
          {items.map(item => (
            <button key={item.id} onClick={() => toggle(item.id)} className="w-full flex items-center gap-3 text-left transition-all duration-150 group">
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
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Operations</p>
        <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Checklists</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Track daily, laydown, and weekly procedures.</p>
      </motion.div>

      <div className="space-y-4">
        {initialChecklists.map(cl => <ChecklistCard key={cl.id} checklist={cl} />)}
      </div>
    </div>
  );
}
