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
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`
              w-14 h-14 rounded-[1.125rem] flex items-center justify-center
              transition-all duration-300 group relative
              ${isActive
                ? 'bg-[var(--charcoal-accent)] text-white shadow-sm'
                : 'hover:bg-[var(--accent)] text-[var(--muted-foreground)]'}
            `}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'backwards'
            }}
            aria-label={item.label}
          >
            <Icon size={22} strokeWidth={1.8} />
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-[var(--charcoal-accent)] text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
