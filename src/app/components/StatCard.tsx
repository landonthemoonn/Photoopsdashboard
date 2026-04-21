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
    accent: '#FFD60A',
    glow: 'rgba(255, 214, 10, 0.25)',
    iconBg: 'rgba(255, 214, 10, 0.1)',
    border: 'rgba(255, 214, 10, 0.2)',
    topLine: 'linear-gradient(90deg, transparent, #FFD60A, transparent)',
  },
  orange: {
    accent: '#FF9500',
    glow: 'rgba(255, 149, 0, 0.25)',
    iconBg: 'rgba(255, 149, 0, 0.1)',
    border: 'rgba(255, 149, 0, 0.2)',
    topLine: 'linear-gradient(90deg, transparent, #FF9500, transparent)',
  },
  coral: {
    accent: '#FF2D78',
    glow: 'rgba(255, 45, 120, 0.25)',
    iconBg: 'rgba(255, 45, 120, 0.1)',
    border: 'rgba(255, 45, 120, 0.2)',
    topLine: 'linear-gradient(90deg, transparent, #FF2D78, transparent)',
  },
  charcoal: {
    accent: '#00E5FF',
    glow: 'rgba(0, 229, 255, 0.25)',
    iconBg: 'rgba(0, 229, 255, 0.1)',
    border: 'rgba(0, 229, 255, 0.2)',
    topLine: 'linear-gradient(90deg, transparent, #00E5FF, transparent)',
  },
  neutral: {
    accent: '#BF5AF2',
    glow: 'rgba(191, 90, 242, 0.25)',
    iconBg: 'rgba(191, 90, 242, 0.1)',
    border: 'rgba(191, 90, 242, 0.2)',
    topLine: 'linear-gradient(90deg, transparent, #BF5AF2, transparent)',
  },
};

export function StatCard({ title, value, subtitle, icon: Icon, variant = 'neutral', delay = 0 }: StatCardProps) {
  const s = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, boxShadow: `0 20px 50px ${s.glow}, 0 0 0 1px ${s.border}` }}
      className="relative overflow-hidden cursor-default"
      style={{
        background: 'rgba(10, 12, 22, 0.55)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderRadius: 'var(--radius)',
        border: `1px solid ${s.border}`,
        padding: '1.5rem',
        boxShadow: `0 4px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`,
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Top neon accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: s.topLine, opacity: 0.8 }} />

      {/* Corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none" style={{ background: s.accent, opacity: 0.06, filter: 'blur(24px)' }} />

      <div className="flex items-start justify-between mb-5">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--muted-foreground)' }}>
          {title}
        </p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.iconBg, border: `1px solid ${s.border}` }}>
          <Icon size={16} strokeWidth={2} style={{ color: s.accent }} />
        </div>
      </div>

      <motion.div
        className="text-4xl font-light tracking-tight mb-1.5"
        style={{ color: s.accent, fontFamily: "'DM Mono', monospace", letterSpacing: '-0.03em', textShadow: `0 0 20px ${s.glow}` }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {value}
      </motion.div>

      {subtitle && (
        <p className="text-xs" style={{ color: 'var(--muted-foreground)', letterSpacing: '0.01em' }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
