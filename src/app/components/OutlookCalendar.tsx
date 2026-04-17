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
        {mockEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            className="p-4 rounded-[1.125rem] bg-[var(--background)] border border-[var(--border)] hover:border-[var(--charcoal-accent)] transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-sm text-[var(--foreground)] mb-2">
                  {event.title}
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} strokeWidth={2} />
                    <span>{event.start} - {event.end}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} strokeWidth={2} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-[var(--muted-foreground)] ml-4">
                {event.organizer}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-[0.875rem] bg-[var(--background)] border border-[var(--border)] text-center">
        <p className="text-xs text-[var(--muted-foreground)]">
          📅 Connect to Microsoft Graph API via Supabase for live calendar sync
        </p>
      </div>
    </motion.div>
  );
}
