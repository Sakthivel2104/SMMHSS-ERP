import { useState, useRef } from 'react';
import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, BookOpen, FileText, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeacherHomework = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(db.getNotifications().filter(n => n.type === 'homework'));
  const [notes, setNotes] = useState(db.getNotifications().filter(n => n.type === 'notes'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '' });
  const [notesForm, setNotesForm] = useState({ title: '', message: '', file: null as File | null });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddNotes = () => {
    if (!notesForm.title || !notesForm.file) { toast.error('Title and PDF file are required'); return; }

    const reader = new FileReader();
    reader.onload = () => {
      db.addNotification({
        title: `📄 ${notesForm.title}`,
        message: notesForm.message || `Subject notes: ${notesForm.title}`,
        type: 'notes',
        targetRole: 'student',
        date: new Date().toISOString().split('T')[0],
        read: false,
        createdBy: user?.id || 2,
        attachmentName: notesForm.file!.name,
        attachmentData: reader.result as string,
      });
      setNotes([...db.getNotifications().filter(n => n.type === 'notes')]);
      setNotesDialogOpen(false);
      setNotesForm({ title: '', message: '', file: null });
      toast.success('Notes uploaded & notified to students');
    };
    reader.readAsDataURL(notesForm.file);
  };

  const handleDownload = (n: any) => {
    if (n.attachmentData && n.attachmentName) {
      const link = document.createElement('a');
      link.href = n.attachmentData;
      link.download = n.attachmentName;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Homework & Notes</h2>

      <Tabs defaultValue="homework">
        <TabsList>
          <TabsTrigger value="homework">Homework</TabsTrigger>
          <TabsTrigger value="notes">Subject Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="homework" className="space-y-4 mt-4">
          <div className="flex justify-end">
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
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
              <DialogTrigger asChild><Button><Upload className="w-4 h-4 mr-2" />Upload Notes</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Upload Subject Notes (PDF)</DialogTitle></DialogHeader>
                <div className="space-y-3 mt-4">
                  <Input placeholder="Subject / Title *" value={notesForm.title} onChange={e => setNotesForm({ ...notesForm, title: e.target.value })} />
                  <Textarea placeholder="Description (optional)" value={notesForm.message} onChange={e => setNotesForm({ ...notesForm, message: e.target.value })} rows={3} />
                  <div>
                    <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => setNotesForm({ ...notesForm, file: e.target.files?.[0] || null })} />
                    <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()} className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      {notesForm.file ? notesForm.file.name : 'Choose PDF File'}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddNotes}>Upload & Notify</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3">
            {notes.map(n => (
              <div key={n.id} className="erp-card p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{n.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-[10px] text-muted-foreground">{n.date}</p>
                    {n.attachmentName && (
                      <button onClick={() => handleDownload(n)} className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Download className="w-3 h-3" /> {n.attachmentName}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {notes.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No notes uploaded yet</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherHomework;
