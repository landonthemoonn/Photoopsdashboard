import { MapPin, Camera, Monitor } from 'lucide-react';
import { motion } from 'motion/react';

export function StudioMapCard() {
  const studioSections = [
    { name: 'Main Stage', devices: 2, icon: Camera },
    { name: 'Edit Bay 1', devices: 1, icon: Monitor },
    { name: 'Edit Bay 2', devices: 1, icon: Monitor },
    { name: 'Tech Desk', devices: 1, icon: Monitor }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -4 }}
      className="bg-[var(--neutral-card)] rounded-[1.5rem] p-7 border border-[var(--border)] shadow-sm hover:shadow-lg transition-shadow duration-300 col-span-2 cursor-default"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-1">Studio Layout</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Active spaces and device distribution
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <MapPin size={14} className="text-[var(--muted-foreground)]" strokeWidth={2} />
          <span className="text-xs text-[var(--foreground)]">Gap Photo Studio - SF</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {studioSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="p-5 rounded-[1.125rem] bg-[var(--background)] border border-[var(--border)] hover:border-[var(--charcoal-accent)] transition-all duration-300 group"
            >
              <div
                className="w-10 h-10 rounded-[0.75rem] bg-[var(--charcoal-accent)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
              >
                <Icon size={18} className="text-white" strokeWidth={2} />
              </div>
              <div className="font-medium text-sm text-[var(--foreground)] mb-1">
                {section.name}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {section.devices} {section.devices === 1 ? 'device' : 'devices'}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-[0.875rem] bg-[var(--yellow-accent)] bg-opacity-20 border border-[var(--yellow-accent)] border-opacity-30">
        <p className="text-sm text-[var(--foreground)]">
          <span className="font-medium">Studio Note:</span> Main stage lighting system updated. All cameras on fresh firmware. Edit bays ready for full RAW workflow.
        </p>
      </div>
    </motion.div>
  );
}
