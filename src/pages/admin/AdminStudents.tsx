import { useState } from 'react';
import { db, type Student } from '@/data/mockStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminStudents = () => {
  const [students, setStudents] = useState(db.getStudents());
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', class: '', roll: '', section: '', parentName: '', parentPhone: '', address: '' });

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.includes(search)
  );

  const resetForm = () => setForm({ name: '', email: '', phone: '', class: '', roll: '', section: '', parentName: '', parentPhone: '', address: '' });

  const openAdd = () => { resetForm(); setEditingStudent(null); setDialogOpen(true); };
  const openEdit = (s: Student) => {
    setEditingStudent(s);
    setForm({ name: s.name, email: s.email, phone: s.phone, class: s.class, roll: s.roll, section: s.section, parentName: s.parentName, parentPhone: s.parentPhone, address: s.address });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.class || !form.roll) { toast.error('Please fill required fields'); return; }
    if (editingStudent) {
      db.updateStudent(editingStudent.id, form);
      toast.success('Student updated');
    } else {
      db.addStudent({ ...form, userId: 0, joinDate: new Date().toISOString().split('T')[0], status: 'active' });
      toast.success('Student added');
    }
    setStudents([...db.getStudents()]);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    db.deleteStudent(id);
    setStudents([...db.getStudents()]);
    toast.success('Student deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-sm text-muted-foreground">{students.length} total students</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-64" />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Student</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <Input placeholder="Class *" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} />
                <Input placeholder="Roll Number *" value={form.roll} onChange={e => setForm({ ...form, roll: e.target.value })} />
                <Input placeholder="Section" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} />
                <Input placeholder="Parent Name" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} className="col-span-2" />
                <Input placeholder="Parent Phone" value={form.parentPhone} onChange={e => setForm({ ...form, parentPhone: e.target.value })} />
                <Input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>{editingStudent ? 'Update' : 'Add'}</Button>
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
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Class</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Roll</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Email</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-foreground">{s.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{s.class}</td>
                  <td className="p-4 text-sm text-muted-foreground">{s.roll}</td>
                  <td className="p-4 text-sm text-muted-foreground">{s.email}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(s)} className="text-muted-foreground hover:text-primary mr-2 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default AdminStudents;
