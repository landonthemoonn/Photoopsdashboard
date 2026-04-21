import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

const links = [
  { name: 'Gap KB', url: '#', description: 'Knowledge Base', color: '#E8C070' },
  { name: 'Jamf Pro', url: 'https://gapinc.jamfcloud.com', description: 'Device Management', color: '#E07060' },
  { name: 'Apple Business Mgr', url: 'https://business.apple.com', description: 'ABM Portal', color: '#9888C8' },
  { name: 'Capture One Docs', url: 'https://support.captureone.com', description: 'Documentation', color: '#F0A870' },
  { name: 'Gap IT Helpdesk', url: '#', description: 'Support Portal', color: '#D86040' },
  { name: 'Resilio Sync', url: '#', description: 'File Sync', color: '#8FBF8A' },
];

export function QuickLinks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden"
      style={{ background: 'rgba(22,16,12,0.6)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)', borderRadius: 'var(--radius)', border: '1px solid rgba(152,136,200,0.15)', padding: '1.5rem', boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(152,136,200,0.5), transparent)' }} />

      <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-4" style={{ color: 'var(--muted-foreground)' }}>Quick Links</p>

      <div className="grid grid-cols-2 gap-2">
        {links.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center justify-between p-3 rounded-xl overflow-hidden transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${link.color}35`; (e.currentTarget as HTMLElement).style.background = `${link.color}08`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${link.color}12`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mr-2" style={{ background: link.color, boxShadow: `0 0 6px ${link.color}80` }} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-xs truncate" style={{ color: 'var(--foreground)' }}>{link.name}</div>
              <div className="text-[10px] truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{link.description}</div>
            </div>
            <ArrowUpRight size={12} strokeWidth={2} className="flex-shrink-0 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: link.color }} />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
