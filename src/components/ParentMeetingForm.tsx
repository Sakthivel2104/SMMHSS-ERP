import { useState } from 'react';
import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Users, Calendar, Eye, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ParentMeetingForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const students = db.getStudents();
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    studentId: '',
    date: '',
    time: '10:00',
    subject: 'Academic Progress Discussion',
    message: '',
  });

  const selectedStudent = students.find(s => s.id === Number(form.studentId));

  const emailPreview = {
    to: selectedStudent ? `${selectedStudent.parentName} <${selectedStudent.email}>` : '',
    subject: `Parent-Teacher Meeting: ${form.subject}`,
    body: `Dear ${selectedStudent?.parentName || '[Parent Name]'},

This is to inform you that a Parent-Teacher Meeting has been scheduled.

📅 Date: ${form.date || '[Date]'}
🕐 Time: ${form.time || '[Time]'}
📋 Subject: ${form.subject}
👨‍🏫 Teacher: ${user?.name || '[Teacher]'}
🎓 Student: ${selectedStudent?.name || '[Student]'}

${form.message ? `Additional Notes:\n${form.message}` : ''}

Please confirm your availability at your earliest convenience.

Best regards,
${user?.name}
Scholaris ERP - School Management System`,
  };

  const handleSend = () => {
    if (!form.studentId || !form.date) {
      toast({ title: 'Missing fields', description: 'Please select a student and date.', variant: 'destructive' });
      return;
    }

    db.addNotification({
      title: `Parent Meeting: ${selectedStudent?.name}`,
      message: `Meeting with ${selectedStudent?.parentName} on ${form.date} at ${form.time}. Topic: ${form.subject}`,
      type: 'meeting',
      targetRole: 'all',
      date: new Date().toISOString().split('T')[0],
      read: false,
      createdBy: user?.id || 0,
    });

    toast({ title: 'Meeting notification sent!', description: `Email preview generated for ${selectedStudent?.parentName}` });
    setForm({ studentId: '', date: '', time: '10:00', subject: 'Academic Progress Discussion', message: '' });
    setShowPreview(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="w-4 h-4" />
          Schedule Parent Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Schedule Parent-Teacher Meeting
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select Student</label>
              <Select value={form.studentId} onValueChange={(v) => setForm({ ...form, studentId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name} — Class {s.class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Meeting Subject</label>
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Academic Progress"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Date
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Time</label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Additional Message (optional)</label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Any additional notes for the parent..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide' : 'Show'} Email Preview
            </Button>
            <Button className="gap-2" onClick={handleSend}>
              <Send className="w-4 h-4" />
              Send Notification
            </Button>
          </div>

          {showPreview && (
            <div className="erp-card p-4 space-y-3 bg-muted/50">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Email Preview
              </h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium text-muted-foreground">To:</span> <span className="text-foreground">{emailPreview.to || '—'}</span></p>
                <p><span className="font-medium text-muted-foreground">Subject:</span> <span className="text-foreground">{emailPreview.subject}</span></p>
              </div>
              <div className="bg-card rounded-lg p-4 border text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {emailPreview.body}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParentMeetingForm;
