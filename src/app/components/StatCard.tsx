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
    accent: '#C8A75A',
    glow: 'rgba(200, 167, 90, 0.18)',
    iconBg: 'rgba(200, 167, 90, 0.1)',
    iconColor: '#C8A75A',
    borderAccent: 'rgba(200, 167, 90, 0.25)',
  },
  orange: {
    accent: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.16)',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    iconColor: '#F59E0B',
    borderAccent: 'rgba(245, 158, 11, 0.25)',
  },
  coral: {
    accent: '#F4637A',
    glow: 'rgba(244, 99, 122, 0.16)',
    iconBg: 'rgba(244, 99, 122, 0.1)',
    iconColor: '#F4637A',
    borderAccent: 'rgba(244, 99, 122, 0.25)',
  },
  charcoal: {
    accent: '#2DD4BF',
    glow: 'rgba(45, 212, 191, 0.16)',
    iconBg: 'rgba(45, 212, 191, 0.1)',
    iconColor: '#2DD4BF',
    borderAccent: 'rgba(45, 212, 191, 0.25)',
  },
  neutral: {
    accent: '#7B82F0',
    glow: 'rgba(123, 130, 240, 0.16)',
    iconBg: 'rgba(123, 130, 240, 0.1)',
    iconColor: '#7B82F0',
    borderAccent: 'rgba(123, 130, 240, 0.25)',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'neutral',
  delay = 0,
}: StatCardProps) {
  const s = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, boxShadow: `0 16px 40px ${s.glow}, 0 0 0 1px ${s.borderAccent}` }}
      className="relative overflow-hidden cursor-default"
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: `1px solid var(--border)`,
        padding: '1.5rem',
        boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`, opacity: 0.6 }}
      />

      {/* Subtle corner glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: s.accent, opacity: 0.04, filter: 'blur(20px)' }}
      />

      <div className="flex items-start justify-between mb-5">
        <p
          className="text-[10px] font-semibold tracking-[0.14em] uppercase"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {title}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: s.iconBg }}
        >
          <Icon size={16} strokeWidth={2} style={{ color: s.iconColor }} />
        </div>
      </div>

      <motion.div
        className="text-4xl font-light tracking-tight mb-1.5"
        style={{ color: s.accent, fontFamily: "'DM Mono', 'Instrument Sans', monospace", letterSpacing: '-0.03em' }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {value}
      </motion.div>

      {subtitle && (
        <p
          className="text-xs"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.01em' }}
        >
          {subtitle}
        </p>
      )}

      {/* Shimmer on hover */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.015) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
        }}
      />
    </motion.div>
  );
}
