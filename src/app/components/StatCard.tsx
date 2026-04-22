import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'yellow' | 'orange' | 'coral' | 'charcoal' | 'neutral';
  delay?: number;
}

const variantStyles = {
  yellow: {
    bg: 'var(--yellow-accent)',
    text: '#2A2520',
    iconBg: 'rgba(42, 37, 32, 0.08)',
    glow: 'var(--yellow-glow)',
    gradient: 'linear-gradient(135deg, var(--yellow-accent) 0%, #FFC93D 100%)'
  },
  orange: {
    bg: 'var(--orange-accent)',
    text: '#FDFCFA',
    iconBg: 'rgba(253, 252, 250, 0.15)',
    glow: 'var(--orange-glow)',
    gradient: 'linear-gradient(135deg, var(--orange-accent) 0%, #FF8566 100%)'
  },
  coral: {
    bg: 'var(--coral-accent)',
    text: '#2A2520',
    iconBg: 'rgba(42, 37, 32, 0.08)',
    glow: 'var(--coral-glow)',
    gradient: 'linear-gradient(135deg, var(--coral-accent) 0%, #FFB3C1 100%)'
  },
  charcoal: {
    bg: 'var(--charcoal-accent)',
    text: '#FDFCFA',
    iconBg: 'rgba(253, 252, 250, 0.1)',
    glow: 'var(--charcoal-glow)',
    gradient: 'linear-gradient(135deg, var(--charcoal-accent) 0%, #3D3530 100%)'
  },
  neutral: {
    bg: 'var(--neutral-card)',
    text: '#2A2520',
    iconBg: 'rgba(42, 37, 32, 0.04)',
    glow: 'rgba(42, 37, 32, 0.1)',
    gradient: 'linear-gradient(135deg, var(--neutral-card) 0%, #F5F1EB 100%)'
  }
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'neutral',
  delay = 0
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, y: -6 }}
      className="rounded-[1.5rem] p-7 shadow-sm border border-[var(--border)] transition-all duration-300 cursor-default relative overflow-hidden group"
      style={{
        background: styles.gradient,
        boxShadow: `0 4px 20px ${styles.glow}`
      }}
    >
      {/* Shimmer effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite'
        }}
      />

      <div className="flex items-start justify-between mb-6 relative z-10">
        <motion.div
          className="w-12 h-12 rounded-[0.875rem] flex items-center justify-center"
          style={{ backgroundColor: styles.iconBg }}
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <Icon size={22} strokeWidth={2} style={{ color: styles.text }} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <motion.div
          className="text-4xl font-medium mb-2 tracking-tight"
          style={{ color: styles.text }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {value}
        </motion.div>
        <div
          className="text-sm mb-1"
          style={{ color: styles.text, opacity: 0.9 }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            className="text-xs"
            style={{ color: styles.text, opacity: 0.6 }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Ambient glow effect */}
      <div
        className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{ background: styles.glow }}
      />
    </motion.div>
  );
}
