import {
  Home,
  LayoutDashboard,
  Package,
  Book,
  FileText,
  Lightbulb,
  ListChecks,
  Building,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

const navItems = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Package, label: 'Inventory', id: 'inventory' },
  { icon: Book, label: 'KB', id: 'kb' },
  { icon: FileText, label: 'SOPs', id: 'sops' },
  { icon: Lightbulb, label: 'Learnings', id: 'learnings' },
  { icon: ListChecks, label: 'Checklists', id: 'checklists' },
  { icon: Building, label: 'Studio Info', id: 'studio' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <aside className="w-20 bg-[var(--neutral-card)] border-r border-[var(--border)] flex flex-col items-center py-6 gap-3">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;

        return (
          <motion.button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`
              w-14 h-14 rounded-[1.125rem] flex items-center justify-center
              transition-all duration-300 group relative
              ${isActive
                ? 'bg-[var(--charcoal-accent)] text-white'
                : 'hover:bg-[var(--accent)] text-[var(--muted-foreground)]'}
            `}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'backwards',
              boxShadow: isActive ? '0 0 20px var(--charcoal-glow)' : 'none'
            }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={item.label}
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Icon size={22} strokeWidth={1.8} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute left-full ml-3 px-3 py-1.5 bg-[var(--charcoal-accent)] text-white text-sm rounded-lg pointer-events-none whitespace-nowrap"
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            >
              {item.label}
            </motion.span>
          </motion.button>
        );
      })}
    </aside>
  );
}
