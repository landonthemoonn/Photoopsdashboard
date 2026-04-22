import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const links = [
  { name: 'Gap KB', url: '#', description: 'Knowledge Base', color: '#6C5CE7' },
  { name: 'Jamf Pro', url: '#', description: 'Device Management', color: '#FF6B35' },
  { name: 'Apple Business Manager', url: '#', description: 'ABM Portal', color: '#4ECDC4' },
  { name: 'Capture One Docs', url: '#', description: 'Documentation', color: '#FFD93D' },
  { name: 'Gap IT Helpdesk', url: '#', description: 'Support Portal', color: '#FF8E9E' },
  { name: 'Resilio Sync', url: '#', description: 'File Sync', color: '#A29BFE' }
];

export function QuickLinks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      whileHover={{ y: -4 }}
      className="bg-[var(--neutral-card)] rounded-[1.5rem] p-7 border border-[var(--border)] shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default"
    >
      <h3 className="text-lg font-medium mb-5 text-[var(--foreground)]">Quick Links</h3>

      <div className="grid grid-cols-2 gap-3">
        {links.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{
              scale: 1.03,
              boxShadow: `0 0 20px ${link.color}40, 0 4px 15px rgba(0,0,0,0.1)`
            }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center justify-between p-4 rounded-[0.875rem] bg-[var(--background)] border border-[var(--border)] transition-all duration-300 relative overflow-hidden"
            style={{
              borderColor: 'var(--border)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = link.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            {/* Color accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: link.color }}
            />

            <div className="relative z-10">
              <div className="font-medium text-sm text-[var(--foreground)] mb-0.5">
                {link.name}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {link.description}
              </div>
            </div>
            <motion.div
              whileHover={{ x: 3, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <ExternalLink
                size={16}
                className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors"
                strokeWidth={2}
                style={{
                  color: link.color
                }}
              />
            </motion.div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
