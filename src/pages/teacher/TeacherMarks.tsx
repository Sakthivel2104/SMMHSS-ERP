import { useState } from 'react';
import { db } from '@/data/mockStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportMarksCSV } from '@/lib/csvExport';

const TeacherMarks = () => {
  const [marks, setMarks] = useState(db.getAllMarks());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ studentId: '', subject: '', score: '', total: '100', examType: 'Mid-Term' });
  const students = db.getStudents();

  const handleAdd = () => {
    if (!form.studentId || !form.subject || !form.score) { toast.error('Fill required fields'); return; }
    db.addMark({
      studentId: parseInt(form.studentId),
      subject: form.subject,
      score: parseInt(form.score),
      total: parseInt(form.total),
      examType: form.examType,
      date: new Date().toISOString().split('T')[0],
    });
    setMarks([...db.getAllMarks()]);
    setDialogOpen(false);
    toast.success('Marks added');
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1);
      let count = 0;
      lines.forEach(line => {
        const [studentId, subject, score, total, examType] = line.split(',').map(s => s.trim());
        if (studentId && subject && score) {
          db.addMark({ studentId: parseInt(studentId), subject, score: parseInt(score), total: parseInt(total || '100'), examType: examType || 'Import', date: new Date().toISOString().split('T')[0] });
          count++;
        }
      });
      setMarks([...db.getAllMarks()]);
      toast.success(`${count} marks imported from CSV`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Manage Marks</h2>
        <div className="flex gap-3">
          <label className="cursor-pointer">
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
            <Button variant="outline" asChild><span><Upload className="w-4 h-4 mr-2" />Import CSV</span></Button>
          </label>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Marks</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Student Marks</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-4">
                <select value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} className="w-full h-10 rounded-md border bg-background px-3 text-sm">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.class})</option>)}
                </select>
                <Input placeholder="Subject *" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder="Score *" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} />
                  <Input type="number" placeholder="Total" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} />
                </div>
                <Input placeholder="Exam Type" value={form.examType} onChange={e => setForm({ ...form, examType: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="erp-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Student</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Subject</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Score</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Total</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Exam</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {marks.slice(-20).reverse().map(m => {
              const student = students.find(s => s.id === m.studentId);
              return (
                <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{student?.name || `Student #${m.studentId}`}</td>
                  <td className="p-4 text-sm text-muted-foreground">{m.subject}</td>
                  <td className="p-4 text-sm text-foreground font-semibold">{m.score}</td>
                  <td className="p-4 text-sm text-muted-foreground">{m.total}</td>
                  <td className="p-4 text-sm text-muted-foreground">{m.examType}</td>
                  <td className="p-4 text-sm text-muted-foreground">{m.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherMarks;
