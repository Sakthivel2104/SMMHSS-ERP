import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/StatCard';
import ParentMeetingForm from '@/components/ParentMeetingForm';
import { Users, ClipboardList, BookOpen, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const students = db.getStudents();
  const events = db.getEvents().slice(0, 3);
  const notifications = db.getNotifications('teacher').filter(n => !n.read).slice(0, 3);
  const marks = db.getAllMarks();

  // Performance data by subject
  const subjectAvg = marks.reduce((acc, m) => {
    if (!acc[m.subject]) acc[m.subject] = { total: 0, count: 0 };
    acc[m.subject].total += m.score;
    acc[m.subject].count++;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const performanceData = Object.entries(subjectAvg).map(([subject, { total, count }]) => ({
    subject,
    average: Math.round(total / count),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h2>
        <p className="text-sm text-muted-foreground">Subject: {user?.subject || 'General'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Students" value={students.length} icon={Users} color="primary" />
        <StatCard title="Avg Attendance" value="90%" icon={ClipboardList} color="success" />
        <StatCard title="Homework Posts" value="12" icon={BookOpen} color="warning" />
        <StatCard title="Upcoming Events" value={events.length} icon={CalendarDays} color="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Subject Performance Averages</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={performanceData}>
              <XAxis dataKey="subject" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} className="text-xs" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="average" fill="hsl(221,83%,53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Students</h3>
          <div className="space-y-3">
            {students.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">Class {s.class}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-success/10 text-success">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
