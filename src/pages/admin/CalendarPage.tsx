import { useState } from 'react';
import { db } from '@/data/mockStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const events = db.getEvents();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  const typeColors: Record<string, string> = {
    event: 'bg-primary text-primary-foreground',
    meeting: 'bg-warning text-warning-foreground',
    holiday: 'bg-success text-success-foreground',
    exam: 'bg-destructive text-destructive-foreground',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Calendar</h2>

      <div className="erp-card p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={prev}><ChevronLeft className="w-4 h-4" /></Button>
          <h3 className="text-lg font-semibold text-foreground">{monthName}</h3>
          <Button variant="outline" size="sm" onClick={next}><ChevronRight className="w-4 h-4" /></Button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
          {days.map((day, i) => {
            const dayEvents = day ? getEventsForDay(day) : [];
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            return (
              <div key={i} className={`min-h-[80px] p-1 border rounded-lg ${day ? 'bg-card' : ''} ${isToday ? 'border-primary' : 'border-transparent'}`}>
                {day && (
                  <>
                    <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>{day}</span>
                    <div className="space-y-0.5 mt-1">
                      {dayEvents.map(e => (
                        <div key={e.id} className={`text-[9px] px-1 py-0.5 rounded truncate ${typeColors[e.type] || 'bg-muted'}`}>
                          {e.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="erp-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">All Events</h3>
        <div className="space-y-2">
          {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(e => (
            <div key={e.id} className="flex items-center gap-3 py-2 border-b last:border-0">
              <div className={`w-2 h-2 rounded-full ${typeColors[e.type]?.split(' ')[0] || 'bg-muted'}`} />
              <span className="text-sm text-foreground flex-1">{e.title}</span>
              <span className="text-xs text-muted-foreground">{e.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
