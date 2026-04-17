import { Calendar, Clock, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  organizer: string;
}

// Mock data - will be replaced with real Outlook API data via Supabase
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Product Shoot - Spring Collection',
    start: '9:00 AM',
    end: '12:00 PM',
    location: 'Main Stage',
    organizer: 'Sarah Chen'
  },
  {
    id: '2',
    title: 'Equipment Maintenance',
    start: '1:00 PM',
    end: '2:30 PM',
    location: 'Tech Desk',
    organizer: 'Mike Rodriguez'
  },
  {
    id: '3',
    title: 'Creative Review Session',
    start: '3:00 PM',
    end: '4:30 PM',
    location: 'Edit Bay 1',
    organizer: 'Jamie Lee'
  },
  {
    id: '4',
    title: 'Studio Setup - Tomorrow',
    start: 'Tomorrow 8:00 AM',
    end: '9:00 AM',
    location: 'Main Stage',
    organizer: 'Alex Kim'
  }
];

const eventColors = ['#FF6B35', '#4ECDC4', '#6C5CE7', '#FFD93D'];

export function OutlookCalendar() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

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
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-1">Studio Calendar</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Synced from Outlook - {today}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <Calendar size={14} className="text-[var(--muted-foreground)]" strokeWidth={2} />
          <span className="text-xs text-[var(--foreground)]">Today's Schedule</span>
        </div>
      </div>

      <div className="space-y-3">
        {mockEvents.map((event, index) => {
          const color = eventColors[index % eventColors.length];
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{
                scale: 1.02,
                x: 4,
                boxShadow: `0 0 20px ${color}30, 0 4px 15px rgba(0,0,0,0.1)`
              }}
              className="p-4 rounded-[1.125rem] bg-[var(--background)] border border-[var(--border)] transition-all duration-300 group relative overflow-hidden"
            >
              {/* Color accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300"
                style={{ backgroundColor: color }}
              />

              <div className="flex items-start justify-between pl-3">
                <div className="flex-1">
                  <div className="font-medium text-sm text-[var(--foreground)] mb-2">
                    {event.title}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                    <motion.div
                      className="flex items-center gap-1.5"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Clock size={12} strokeWidth={2} style={{ color }} />
                      <span>{event.start} - {event.end}</span>
                    </motion.div>
                    {event.location && (
                      <motion.div
                        className="flex items-center gap-1.5"
                        whileHover={{ scale: 1.05 }}
                      >
                        <MapPin size={12} strokeWidth={2} style={{ color }} />
                        <span>{event.location}</span>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-[var(--muted-foreground)] ml-4">
                  {event.organizer}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-[0.875rem] bg-[var(--background)] border border-[var(--border)] text-center">
        <p className="text-xs text-[var(--muted-foreground)]">
          📅 Connect to Microsoft Graph API via Supabase for live calendar sync
        </p>
      </div>
    </motion.div>
  );
}
