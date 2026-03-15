import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StudentAttendance = () => {
  const { user } = useAuth();
  const student = db.getStudents().find(s => s.userId === user?.id);
  const attendance = db.getAttendanceByStudent(student?.id || 1);
  const data = attendance.map(a => ({ month: a.month, percentage: a.percentage }));
  const avg = attendance.length ? Math.round(attendance.reduce((a, att) => a + att.percentage, 0) / attendance.length) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">My Attendance</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Overall Attendance</p>
          <p className="text-3xl font-bold text-foreground mt-1">{avg}%</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Days</p>
          <p className="text-3xl font-bold text-foreground mt-1">{attendance.reduce((a, att) => a + att.totalDays, 0)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Days Present</p>
          <p className="text-3xl font-bold text-foreground mt-1">{attendance.reduce((a, att) => a + att.presentDays, 0)}</p>
        </div>
      </div>

      <div className="erp-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Attendance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis axisLine={false} tickLine={false} domain={[70, 100]} className="text-xs" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="percentage" fill="hsl(142,76%,36%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentAttendance;
