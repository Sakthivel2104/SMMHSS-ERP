import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/StatCard';
import { GraduationCap, ClipboardList, TrendingUp, Bell, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const StudentDashboard = () => {
  const { user } = useAuth();
  const student = db.getStudents().find(s => s.userId === user?.id);
  const studentId = student?.id || 1;
  const marks = db.getMarksByStudent(studentId);
  const attendance = db.getAttendanceByStudent(studentId);
  const events = db.getEvents().slice(0, 3);
  const notifications = db.getNotifications('student').filter(n => !n.read).slice(0, 3);
  const fees = db.getFeesByStudent(studentId);

  const avgScore = marks.length ? Math.round(marks.reduce((a, m) => a + m.score, 0) / marks.length) : 0;
  const avgAttendance = attendance.length ? Math.round(attendance.reduce((a, att) => a + att.percentage, 0) / attendance.length) : 0;
  const pendingFees = fees.filter(f => f.status === 'pending').reduce((a, f) => a + f.amount, 0);

  const marksData = marks.map(m => ({ subject: m.subject, score: m.score, total: m.total }));
  const attendanceData = attendance.map(a => ({ month: a.month, percentage: a.percentage }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
          {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h2>
          <p className="text-sm text-muted-foreground">Class {student?.class || '10-A'} • Roll {student?.roll || '101'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Score" value={`${avgScore}%`} icon={TrendingUp} color="primary" />
        <StatCard title="Attendance" value={`${avgAttendance}%`} icon={ClipboardList} color="success" />
        <StatCard title="Pending Fees" value={`$${pendingFees}`} icon={CreditCard} color="warning" />
        <StatCard title="Unread Alerts" value={notifications.length} icon={Bell} color="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Subject-wise Marks</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={marksData}>
              <XAxis dataKey="subject" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} className="text-xs" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="score" fill="hsl(221,83%,53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Attendance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} domain={[70, 100]} className="text-xs" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="percentage" fill="hsl(142,76%,36%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {events.map(e => (
              <div key={e.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-primary font-medium">{new Date(e.date).toLocaleDateString('en', { month: 'short' })}</span>
                  <span className="text-sm font-bold text-primary">{new Date(e.date).getDate()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                <Bell className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
