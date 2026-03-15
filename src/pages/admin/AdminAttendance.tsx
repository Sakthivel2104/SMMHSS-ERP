import { db } from '@/data/mockStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminAttendance = () => {
  const students = db.getStudents();
  const data = students.map(s => {
    const att = db.getAttendanceByStudent(s.id);
    const avg = att.length ? Math.round(att.reduce((a, att) => a + att.percentage, 0) / att.length) : 0;
    return { name: s.name.split(' ')[0], attendance: avg };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Attendance Overview</h2>
      <div className="erp-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Student Attendance Averages</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} className="text-xs" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="attendance" fill="hsl(142,76%,36%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAttendance;
