import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { motion } from 'motion/react';

const data = [
  { version: '14.3', count: 12 },
  { version: '14.2', count: 6 },
  { version: '14.1', count: 4 },
  { version: '14.0', count: 2 },
];

const colors = ['#C8A75A', '#7B82F0', '#2DD4BF', '#F4637A'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-xs"
        style={{
          background: '#1A1D2B',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}
      >
        <span style={{ color: 'var(--muted-foreground)' }}>macOS </span>
        <span className="font-semibold">{label}</span>
        <span style={{ color: 'var(--muted-foreground)' }}> — </span>
        <span className="font-semibold">{payload[0].value} devices</span>
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
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '1.5rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div className="mb-5">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1" style={{ color: 'var(--muted-foreground)' }}>
          macOS Distribution
        </p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
          Across all studio devices
        </p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="version"
            tick={{ fill: '#484C5C', fontSize: 11, fontFamily: 'DM Mono, monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#484C5C', fontSize: 11, fontFamily: 'DM Mono, monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.version}`}
                fill={colors[index % colors.length]}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {data.map((item, index) => (
          <div key={item.version} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-sm flex-shrink-0"
                style={{ background: colors[index] }}
              />
              <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
                {item.version}
              </span>
            </div>
            <span className="text-sm font-semibold font-mono pl-3.5" style={{ color: colors[index] }}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
