import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { motion } from 'motion/react';

const data = [
  { version: '14.3', count: 12 },
  { version: '14.2', count: 6 },
  { version: '14.1', count: 4 },
  { version: '14.0', count: 2 },
];

const colors = ['#E07060', '#9888C8', '#F0A870', '#E09040'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(22,16,12,0.95)', border: '1px solid rgba(224,112,96,0.2)', color: 'var(--foreground)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }}>
        <span style={{ color: 'var(--muted-foreground)' }}>macOS </span>
        <span className="font-semibold">{label}</span>
        <span style={{ color: 'var(--muted-foreground)' }}> — </span>
        <span className="font-semibold" style={{ color: '#E07060' }}>{payload[0].value} devices</span>
      </div>
    );
  }
  return null;
};

export function OSDistributionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden cursor-default"
      style={{ background: 'rgba(22,16,12,0.6)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)', borderRadius: 'var(--radius)', border: '1px solid rgba(224,112,96,0.15)', padding: '1.5rem', boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(224,112,96,0.5), transparent)' }} />

      <div className="mb-5">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-0.5" style={{ color: 'var(--muted-foreground)' }}>macOS Distribution</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>All studio devices</p>
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="version" tick={{ fill: '#4B5060', fontSize: 11, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#4B5060', fontSize: 11, fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(224,112,96,0.04)' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.version}`} fill={colors[index % colors.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {data.map((item, index) => (
          <div key={item.version} className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: colors[index], boxShadow: `0 0 6px ${colors[index]}60` }} />
              <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{item.version}</span>
            </div>
            <span className="text-sm font-semibold font-mono pl-3.5" style={{ color: colors[index], textShadow: `0 0 8px ${colors[index]}50` }}>{item.count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
