import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const links = [
  { name: 'Gap KB', url: '#', description: 'Knowledge Base' },
  { name: 'Jamf Pro', url: '#', description: 'Device Management' },
  { name: 'Apple Business Manager', url: '#', description: 'ABM Portal' },
  { name: 'Capture One Docs', url: '#', description: 'Documentation' },
  { name: 'Gap IT Helpdesk', url: '#', description: 'Support Portal' },
  { name: 'Resilio Sync', url: '#', description: 'File Sync' }
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
            className="group flex items-center justify-between p-4 rounded-[0.875rem] bg-[var(--background)] border border-[var(--border)] hover:border-[var(--foreground)] hover:shadow-sm transition-all duration-300"
          >
            <div>
              <div className="font-medium text-sm text-[var(--foreground)] mb-0.5">
                {link.name}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {link.description}
              </div>
            </div>
            <ExternalLink
              size={16}
              className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors"
              strokeWidth={2}
            />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
