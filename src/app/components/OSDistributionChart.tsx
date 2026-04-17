import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

const data = [
  { version: '14.3', count: 12 },
  { version: '14.2', count: 6 },
  { version: '14.1', count: 4 },
  { version: '14.0', count: 2 }
];

const colors = ['#FFD93D', '#FF6B35', '#FF8E9E', '#6C5CE7'];
const glowColors = [
  'rgba(255, 217, 61, 0.4)',
  'rgba(255, 107, 53, 0.4)',
  'rgba(255, 142, 158, 0.4)',
  'rgba(108, 92, 231, 0.4)'
];

export function OSDistributionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-[var(--neutral-card)] rounded-[1.5rem] p-7 border border-[var(--border)] shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default"
    >
      <div className="mb-6">
        <h3 className="text-lg font-medium text-[var(--foreground)] mb-1">
          macOS Version Distribution
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Across all studio devices
        </p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 37, 32, 0.06)" vertical={false} />
          <XAxis
            dataKey="version"
            tick={{ fill: '#706A62', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(42, 37, 32, 0.1)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#706A62', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(42, 37, 32, 0.1)' }}
            tickLine={false}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.version}-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-between text-xs">
        {data.map((item, index) => (
          <motion.div
            key={item.version}
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div
              className="w-3 h-3 rounded animate-pulse"
              style={{
                backgroundColor: colors[index],
                boxShadow: `0 0 8px ${glowColors[index]}`
              }}
            />
            <span className="text-[var(--muted-foreground)]">
              {item.version}: <span className="text-[var(--foreground)] font-medium">{item.count}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
