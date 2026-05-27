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
    accent: '#E8C070',
    glow: 'rgba(232, 192, 112, 0.25)',
    iconBg: 'rgba(232, 192, 112, 0.1)',
    border: 'rgba(232, 192, 112, 0.18)',
    topLine: 'linear-gradient(90deg, transparent, #E8C070, transparent)',
  },
  orange: {
    accent: '#E09040',
    glow: 'rgba(224, 144, 64, 0.25)',
    iconBg: 'rgba(224, 144, 64, 0.1)',
    border: 'rgba(224, 144, 64, 0.18)',
    topLine: 'linear-gradient(90deg, transparent, #E09040, transparent)',
  },
  coral: {
    accent: '#D86040',
    glow: 'rgba(216, 96, 64, 0.25)',
    iconBg: 'rgba(216, 96, 64, 0.1)',
    border: 'rgba(216, 96, 64, 0.18)',
    topLine: 'linear-gradient(90deg, transparent, #D86040, transparent)',
  },
  charcoal: {
    accent: '#F0A870',
    glow: 'rgba(240, 168, 112, 0.25)',
    iconBg: 'rgba(240, 168, 112, 0.1)',
    border: 'rgba(240, 168, 112, 0.18)',
    topLine: 'linear-gradient(90deg, transparent, #F0A870, transparent)',
  },
  neutral: {
    accent: '#9888C8',
    glow: 'rgba(152, 136, 200, 0.22)',
    iconBg: 'rgba(152, 136, 200, 0.1)',
    border: 'rgba(152, 136, 200, 0.18)',
    topLine: 'linear-gradient(90deg, transparent, #9888C8, transparent)',
  },
};

export function StatCard({ title, value, subtitle, icon: Icon, variant = 'neutral', delay = 0 }: StatCardProps) {
  const s = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, boxShadow: `0 20px 50px ${s.glow}, 0 0 0 1px ${s.border}` }}
      className="relative overflow-hidden cursor-default"
      style={{
        background: 'rgba(22, 16, 12, 0.6)',
        backdropFilter: 'blur(28px) saturate(140%)',
        WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        borderRadius: 'var(--radius)',
        border: `1px solid ${s.border}`,
        padding: '1.5rem',
        boxShadow: `0 4px 30px rgba(0,0,0,0.5)`,
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: s.topLine, opacity: 0.7 }} />
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none" style={{ background: s.accent, opacity: 0.05, filter: 'blur(28px)' }} />

      <div className="flex items-start justify-between mb-5">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--muted-foreground)' }}>
          {title}
        </p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.iconBg, border: `1px solid ${s.border}` }}>
          <Icon size={15} strokeWidth={2} style={{ color: s.accent }} />
        </div>
      </div>

      <motion.div
        className="text-4xl font-light tracking-tight mb-1.5"
        style={{ color: s.accent, fontFamily: "'DM Mono', monospace", letterSpacing: '-0.03em', textShadow: `0 0 24px ${s.glow}` }}
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
