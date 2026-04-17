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
    iconBg: 'rgba(42, 37, 32, 0.08)'
  },
  orange: {
    bg: 'var(--orange-accent)',
    text: '#FDFCFA',
    iconBg: 'rgba(253, 252, 250, 0.15)'
  },
  coral: {
    bg: 'var(--coral-accent)',
    text: '#2A2520',
    iconBg: 'rgba(42, 37, 32, 0.08)'
  },
  charcoal: {
    bg: 'var(--charcoal-accent)',
    text: '#FDFCFA',
    iconBg: 'rgba(253, 252, 250, 0.1)'
  },
  neutral: {
    bg: 'var(--neutral-card)',
    text: '#2A2520',
    iconBg: 'rgba(42, 37, 32, 0.04)'
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
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-[1.5rem] p-7 shadow-sm border border-[var(--border)] hover:shadow-lg transition-all duration-300 cursor-default"
      style={{ backgroundColor: styles.bg }}
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-12 h-12 rounded-[0.875rem] flex items-center justify-center"
          style={{ backgroundColor: styles.iconBg }}
        >
          <Icon size={22} strokeWidth={2} style={{ color: styles.text }} />
        </div>
      </div>

      <div>
        <div
          className="text-4xl font-medium mb-2 tracking-tight"
          style={{ color: styles.text }}
        >
          {value}
        </div>
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
    </motion.div>
  );
}
