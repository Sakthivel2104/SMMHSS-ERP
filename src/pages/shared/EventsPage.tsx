import { useState } from 'react';
import { db, type Event as SchoolEvent } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState(db.getEvents());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', type: 'event' as SchoolEvent['type'] });

  const isAdmin = user?.role === 'admin';

  const handleAdd = () => {
    if (!form.title || !form.date) { toast.error('Fill required fields'); return; }
    db.addEvent({ ...form, createdBy: user?.id || 1 });
    setEvents([...db.getEvents()]);
    setDialogOpen(false);
    setForm({ title: '', description: '', date: '', type: 'event' });
    toast.success('Event created & notification sent');
  };

  const handleDelete = (id: number) => {
    db.deleteEvent(id);
    setEvents([...db.getEvents()]);
    toast.success('Event deleted');
  };

  const typeColors: Record<string, string> = {
    event: 'bg-primary/10 text-primary',
    meeting: 'bg-warning/10 text-warning',
    holiday: 'bg-success/10 text-success',
    exam: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Events</h2>
          <p className="text-sm text-muted-foreground">{events.length} upcoming events</p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Event</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-4">
                <Input placeholder="Event Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as SchoolEvent['type'] })}
                  className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="event">Event</option>
                  <option value="meeting">Meeting</option>
                  <option value="holiday">Holiday</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(e => (
          <div key={e.id} className="erp-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                <span className="text-[10px] text-primary font-medium">{new Date(e.date).toLocaleDateString('en', { month: 'short' })}</span>
                <span className="text-lg font-bold text-primary">{new Date(e.date).getDate()}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{e.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{e.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${typeColors[e.type] || ''}`}>{e.type}</span>
              {isAdmin && (
                <button onClick={() => handleDelete(e.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
