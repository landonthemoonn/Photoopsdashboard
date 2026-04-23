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
import { NavLink } from 'react-router';
import { motion } from 'motion/react';

const navItems = [
  { icon: Home, label: 'Home', to: '/home' },
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Package, label: 'Inventory', to: '/inventory' },
  { icon: Book, label: 'KB', to: '/kb' },
  { icon: FileText, label: 'SOPs', to: '/sops' },
  { icon: Lightbulb, label: 'Learnings', to: '/learnings' },
  { icon: ListChecks, label: 'Checklists', to: '/checklists' },
  { icon: Building, label: 'Studio Info', to: '/studio' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export function Sidebar() {
  return (
    <aside
      className="w-[72px] flex flex-col items-center py-5 gap-1 relative flex-shrink-0"
      style={{
        background: 'rgba(4, 5, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Logo mark */}
      <div className="mb-5 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(224,112,96,0.08)', border: '1px solid rgba(224,112,96,0.2)' }}>
        <div className="w-4 h-4 rounded-sm" style={{ background: 'var(--neon-blue)', boxShadow: '0 0 10px var(--neon-blue-glow)' }} />
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.to} to={item.to} className="group relative">
            {({ isActive }) => (
              <motion.div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200"
                style={{
                  background: isActive ? 'rgba(224,112,96,0.1)' : 'transparent',
                  color: isActive ? 'var(--neon-blue)' : 'var(--sidebar-foreground)',
                  boxShadow: isActive ? '0 0 0 1px rgba(224,112,96,0.25), 0 0 20px rgba(224,112,96,0.1)' : 'none',
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.6} />

                {/* Neon dot indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full"
                    style={{ background: 'var(--neon-blue)', boxShadow: '0 0 8px var(--neon-blue-glow)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Tooltip */}
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-3 px-2.5 py-1 text-xs rounded-lg pointer-events-none whitespace-nowrap z-50"
                  style={{
                    background: 'rgba(22,16,12,0.95)',
                    color: 'var(--foreground)',
                    border: '1px solid rgba(224,112,96,0.15)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            )}
          </NavLink>
        );
      })}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(224,112,96,0.4), transparent)' }} />
    </aside>
  );
}
