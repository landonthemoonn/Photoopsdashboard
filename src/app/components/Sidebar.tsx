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
    <aside
      className="w-[72px] flex flex-col items-center py-5 gap-1 relative"
      style={{
        background: 'var(--sidebar)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {/* Logo mark */}
      <div className="mb-5 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(200, 167, 90, 0.1)', border: '1px solid rgba(200, 167, 90, 0.2)' }}>
        <div className="w-4 h-4 rounded-sm" style={{ background: 'var(--gold-accent)' }} />
      </div>

      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;

        return (
          <motion.button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 group relative"
            style={{
              background: isActive ? 'rgba(200, 167, 90, 0.12)' : 'transparent',
              color: isActive ? 'var(--gold-accent)' : 'var(--sidebar-foreground)',
              boxShadow: isActive ? '0 0 0 1px rgba(200, 167, 90, 0.2), 0 0 16px rgba(200, 167, 90, 0.08)' : 'none',
              animationDelay: `${index * 40}ms`,
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            aria-label={item.label}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2 : 1.6}
            />

            {/* Tooltip */}
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute left-full ml-3 px-2.5 py-1 text-xs rounded-lg pointer-events-none whitespace-nowrap z-50"
              style={{
                background: '#1A1D2B',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              {item.label}
            </motion.span>
          </motion.button>
        );
      })}

      {/* Bottom gold line indicator */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full mb-4"
        style={{ background: 'linear-gradient(90deg, transparent, var(--gold-accent), transparent)', opacity: 0.4 }}
      />
    </aside>
  );
}
