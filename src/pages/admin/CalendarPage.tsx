import { useState } from 'react';
import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const CalendarPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(db.getEvents());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', type: 'event' as const });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowAddDialog(true);
    setNewEvent({ title: '', description: '', type: 'event' });
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDay) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    db.addEvent({
      title: newEvent.title,
      description: newEvent.description,
      date: dateStr,
      type: newEvent.type as any,
      createdBy: user?.id || 1,
    });
    setEvents([...db.getEvents()]);
    setShowAddDialog(false);
    toast({ title: 'Event added', description: `"${newEvent.title}" on ${dateStr}` });
  };

  const typeColors: Record<string, string> = {
    event: 'bg-primary text-primary-foreground',
    meeting: 'bg-warning text-warning-foreground',
    holiday: 'bg-success text-success-foreground',
    exam: 'bg-destructive text-destructive-foreground',
  };

  const selectedDateStr = selectedDay
    ? `${monthName.split(' ')[0]} ${selectedDay}, ${year}`
    : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Calendar</h2>
        <p className="text-sm text-muted-foreground">Click any day to add an event</p>
      </div>

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
              <div
                key={i}
                onClick={() => day && handleDayClick(day)}
                className={`min-h-[80px] p-1 border rounded-lg transition-colors ${
                  day ? 'bg-card cursor-pointer hover:bg-accent/50' : ''
                } ${isToday ? 'border-primary ring-1 ring-primary/30' : 'border-transparent'}`}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>{day}</span>
                      {dayEvents.length === 0 && (
                        <Plus className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
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

      {/* Add Event Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add Event — {selectedDateStr}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Event Title</label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g. Science Exhibition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Type</label>
              <Select value={newEvent.type} onValueChange={(v) => setNewEvent({ ...newEvent, type: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event details..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddEvent} disabled={!newEvent.title}>Add Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
