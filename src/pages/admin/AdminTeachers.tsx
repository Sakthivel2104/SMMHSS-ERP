import { useState } from 'react';
import { db, type Teacher } from '@/data/mockStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState(db.getTeachers());
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', qualification: '', experience: '' });

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm({ name: '', email: '', phone: '', subject: '', qualification: '', experience: '' }); setEditing(null); setDialogOpen(true); };
  const openEdit = (t: Teacher) => { setEditing(t); setForm({ name: t.name, email: t.email, phone: t.phone, subject: t.subject, qualification: t.qualification, experience: t.experience }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.email || !form.subject) { toast.error('Fill required fields'); return; }
    if (editing) { db.updateTeacher(editing.id, form); toast.success('Teacher updated'); }
    else { db.addTeacher({ ...form, userId: 0, joinDate: new Date().toISOString().split('T')[0], status: 'active' }); toast.success('Teacher added'); }
    setTeachers([...db.getTeachers()]);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => { db.deleteTeacher(id); setTeachers([...db.getTeachers()]); toast.success('Teacher deleted'); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Teachers</h2>
          <p className="text-sm text-muted-foreground">{teachers.length} total teachers</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-64" />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Teacher</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{editing ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <Input placeholder="Subject *" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                <Input placeholder="Qualification" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} />
                <Input placeholder="Experience" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>{editing ? 'Update' : 'Add'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="erp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Subject</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Email</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Experience</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-xs font-semibold text-success">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-foreground">{t.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{t.subject}</td>
                  <td className="p-4 text-sm text-muted-foreground">{t.email}</td>
                  <td className="p-4 text-sm text-muted-foreground">{t.experience}</td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-success/10 text-success">{t.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(t)} className="text-muted-foreground hover:text-primary mr-2 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(t.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTeachers;
