import { useState } from 'react';
import { db } from '@/data/mockStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const TeacherAttendance = () => {
  const students = db.getStudents();
  const [month, setMonth] = useState('Mar');
  const [year] = useState(2026);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, { totalDays: string; presentDays: string }>>({});

  const handleChange = (studentId: number, field: 'totalDays' | 'presentDays', value: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], totalDays: prev[studentId]?.totalDays || '22', presentDays: prev[studentId]?.presentDays || '0', [field]: value },
    }));
  };

  const handleSave = () => {
    Object.entries(attendanceMap).forEach(([studentId, { totalDays, presentDays }]) => {
      const total = parseInt(totalDays);
      const present = parseInt(presentDays);
      if (total > 0) {
        db.addAttendance({
          studentId: parseInt(studentId),
          month,
          year,
          totalDays: total,
          presentDays: present,
          percentage: Math.round((present / total) * 100),
        });
      }
    });
    setAttendanceMap({});
    toast.success('Attendance saved');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Upload Attendance</h2>
        <div className="flex gap-3 items-center">
          <select value={month} onChange={e => setMonth(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <Button onClick={handleSave}>Save All</Button>
        </div>
      </div>

      <div className="erp-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Student</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Class</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Total Days</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Present Days</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => {
              const total = parseInt(attendanceMap[s.id]?.totalDays || '22');
              const present = parseInt(attendanceMap[s.id]?.presentDays || '0');
              const pct = total > 0 ? Math.round((present / total) * 100) : 0;
              return (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{s.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{s.class}</td>
                  <td className="p-4"><Input type="number" className="w-20" value={attendanceMap[s.id]?.totalDays || '22'} onChange={e => handleChange(s.id, 'totalDays', e.target.value)} /></td>
                  <td className="p-4"><Input type="number" className="w-20" value={attendanceMap[s.id]?.presentDays || ''} onChange={e => handleChange(s.id, 'presentDays', e.target.value)} /></td>
                  <td className="p-4 text-sm text-muted-foreground">{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherAttendance;
