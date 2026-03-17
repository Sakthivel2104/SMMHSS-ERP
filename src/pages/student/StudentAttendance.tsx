import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
  LineChart, Line,
} from 'recharts';

const COLORS = ['hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)'];

const StudentAttendance = () => {
  const { user } = useAuth();
  const student = db.getStudents().find(s => s.userId === user?.id);
  const attendance = db.getAttendanceByStudent(student?.id || 1);

  const avg = attendance.length ? Math.round(attendance.reduce((a, att) => a + att.percentage, 0) / attendance.length) : 0;
  const totalPresent = attendance.reduce((a, att) => a + att.presentDays, 0);
  const totalDays = attendance.reduce((a, att) => a + att.totalDays, 0);
  const totalAbsent = totalDays - totalPresent;

  const lineData = attendance.map(a => ({ month: a.month, percentage: a.percentage }));
  const stackedData = attendance.map(a => ({ month: a.month, present: a.presentDays, absent: a.totalDays - a.presentDays }));
  const pieData = [{ name: 'Present', value: totalPresent }, { name: 'Absent', value: totalAbsent }];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">My Attendance</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Overall</p>
          <p className="text-3xl font-bold text-foreground mt-1">{avg}%</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Total Days</p>
          <p className="text-3xl font-bold text-foreground mt-1">{totalDays}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Present</p>
          <p className="text-3xl font-bold text-success mt-1">{totalPresent}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Absent</p>
          <p className="text-3xl font-bold text-destructive mt-1">{totalAbsent}</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart - Trend */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Attendance Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={lineData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Area type="monotone" dataKey="percentage" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 36%)" fillOpacity={0.2} name="Attendance %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Overall Split */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Present vs Absent</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} label={({ name, value }) => `${name}: ${value}`} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stacked Bar - Monthly Breakdown */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Monthly Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stackedData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="hsl(142, 76%, 36%)" name="Present" />
                <Bar dataKey="absent" stackId="a" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Percentage Line</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="percentage" stroke="hsl(221, 83%, 53%)" strokeWidth={2} dot={{ fill: 'hsl(221, 83%, 53%)', r: 4 }} name="Attendance %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendance;
