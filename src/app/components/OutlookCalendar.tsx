import { Clock, MapPin, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  organizer: string;
}

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Product Shoot — Spring Collection', start: '9:00 AM', end: '12:00 PM', location: 'Main Stage', organizer: 'Sarah Chen' },
  { id: '2', title: 'Equipment Maintenance', start: '1:00 PM', end: '2:30 PM', location: 'Tech Desk', organizer: 'Mike Rodriguez' },
  { id: '3', title: 'Creative Review Session', start: '3:00 PM', end: '4:30 PM', location: 'Edit Bay 1', organizer: 'Jamie Lee' },
  { id: '4', title: 'Studio Setup — Tomorrow', start: 'Tomorrow 8:00 AM', end: '9:00 AM', location: 'Main Stage', organizer: 'Alex Kim' },
];

const eventColors = ['#C8A75A', '#2DD4BF', '#7B82F0', '#F59E0B'];

export function OutlookCalendar() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden col-span-2 cursor-default"
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '1.5rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--muted-foreground)' }}>
            Studio Calendar
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
            {today}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs"
          style={{
            background: 'var(--accent)',
            border: '1px solid var(--border)',
            color: 'var(--muted-foreground)',
          }}
        >
          <CalendarDays size={12} strokeWidth={2} style={{ color: 'var(--gold-accent)', opacity: 0.7 }} />
          <span style={{ letterSpacing: '0.01em' }}>Today's Schedule</span>
        </div>
      </div>

      <div className="space-y-2">
        {mockEvents.map((event, index) => {
          const color = eventColors[index % eventColors.length];
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + index * 0.07 }}
              whileHover={{ x: 3 }}
              className="flex items-stretch gap-3 p-3 rounded-lg transition-all duration-200 group"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${color}30`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${color}12`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Color accent bar */}
              <div
                className="w-0.5 rounded-full flex-shrink-0 self-stretch"
                style={{ background: color, opacity: 0.7 }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight truncate" style={{ color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
                    {event.title}
                  </p>
                  <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                    {event.organizer}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5">
                  <div className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                    <Clock size={10} strokeWidth={2} style={{ color }} />
                    <span className="text-[10px]">{event.start} – {event.end}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                      <MapPin size={10} strokeWidth={2} style={{ color }} />
                      <span className="text-[10px]">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold-accent)', opacity: 0.4 }} />
        <p className="text-[10px] tracking-wide" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
          Microsoft Graph API via Supabase — live sync pending
        </p>
      </div>
    </motion.div>
  );
}
