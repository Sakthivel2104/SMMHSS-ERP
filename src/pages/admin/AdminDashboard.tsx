import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/StatCard';
import { Users, GraduationCap, CalendarDays, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const students = db.getStudents();
  const teachers = db.getTeachers();
  const events = db.getEvents();
  const notifications = db.getNotifications();

  const classDistribution = students.reduce((acc, s) => {
    const cls = s.class;
    const existing = acc.find(a => a.name === cls);
    if (existing) existing.value++;
    else acc.push({ name: cls, value: 1 });
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const monthlyData = [
    { month: 'Jan', students: 280, attendance: 92 },
    { month: 'Feb', students: 285, attendance: 94 },
    { month: 'Mar', students: 290, attendance: 91 },
  ];

  const COLORS = ['hsl(221,83%,53%)', 'hsl(142,76%,36%)', 'hsl(38,92%,50%)', 'hsl(291,64%,42%)'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome back, {user?.name}</h2>
        <p className="text-muted-foreground mt-1">Here's what's happening at your school today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} icon={GraduationCap} trend="+12% this month" trendUp color="primary" />
        <StatCard title="Total Teachers" value={teachers.length} icon={Users} trend="+2 new" trendUp color="success" />
        <StatCard title="Upcoming Events" value={events.length} icon={CalendarDays} color="warning" />
        <StatCard title="Notifications" value={notifications.filter(n => !n.read).length} icon={BookOpen} color="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', boxShadow: 'var(--card-shadow)' }} />
              <Line type="monotone" dataKey="students" stroke="hsl(221,83%,53%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Class Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={classDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {classDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent students */}
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
                    <p className="text-xs text-muted-foreground">Class {s.class} • Roll {s.roll}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {events.slice(0, 5).map(e => (
              <div key={e.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-primary font-medium">{new Date(e.date).toLocaleDateString('en', { month: 'short' })}</span>
                  <span className="text-sm font-bold text-primary">{new Date(e.date).getDate()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{e.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{e.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance chart */}
      <div className="erp-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Attendance Overview</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis axisLine={false} tickLine={false} className="text-xs" domain={[80, 100]} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="attendance" fill="hsl(221,83%,53%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
