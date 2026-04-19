import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

const links = [
  { name: 'Gap KB', url: '#', description: 'Knowledge Base', color: '#C8A75A' },
  { name: 'Jamf Pro', url: '#', description: 'Device Management', color: '#F59E0B' },
  { name: 'Apple Business Manager', url: '#', description: 'ABM Portal', color: '#2DD4BF' },
  { name: 'Capture One Docs', url: '#', description: 'Documentation', color: '#7B82F0' },
  { name: 'Gap IT Helpdesk', url: '#', description: 'Support Portal', color: '#F4637A' },
  { name: 'Resilio Sync', url: '#', description: 'File Sync', color: '#A78BFA' },
];

export function QuickLinks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden"
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '1.5rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--muted-foreground)' }}>
          Quick Links
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {links.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center justify-between p-3 rounded-lg overflow-hidden"
            style={{
              background: 'var(--accent)',
              border: '1px solid var(--border)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${link.color}40`;
              e.currentTarget.style.background = `${link.color}08`;
              e.currentTarget.style.boxShadow = `0 0 16px ${link.color}18`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Color dot */}
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mr-2.5" style={{ background: link.color }} />

            <div className="flex-1 min-w-0">
              <div className="font-medium text-xs truncate" style={{ color: 'var(--foreground)', letterSpacing: '0.01em' }}>
                {link.name}
              </div>
              <div className="text-[10px] truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {link.description}
              </div>
            </div>

            <ArrowUpRight
              size={13}
              strokeWidth={2}
              className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ color: link.color }}
            />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
