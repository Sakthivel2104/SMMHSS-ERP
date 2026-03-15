import { useState } from 'react';
import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const TeacherHomework = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(db.getNotifications().filter(n => n.type === 'homework'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '' });

  const handleAdd = () => {
    if (!form.title || !form.message) { toast.error('Fill all fields'); return; }
    db.addNotification({
      title: form.title,
      message: form.message,
      type: 'homework',
      targetRole: 'student',
      date: new Date().toISOString().split('T')[0],
      read: false,
      createdBy: user?.id || 2,
    });
    setNotifications([...db.getNotifications().filter(n => n.type === 'homework')]);
    setDialogOpen(false);
    setForm({ title: '', message: '' });
    toast.success('Homework posted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Homework</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Post Homework</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Homework</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4">
              <Input placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description *" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className="erp-card p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{n.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
              <p className="text-[10px] text-muted-foreground mt-2">{n.date}</p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No homework posted yet</p>}
      </div>
    </div>
  );
};

export default TeacherHomework;
