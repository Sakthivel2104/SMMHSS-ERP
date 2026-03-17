import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';

const COLORS = [
  'hsl(221, 83%, 53%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)', 'hsl(262, 83%, 58%)',
];

const StudentMarks = () => {
  const { user } = useAuth();
  const student = db.getStudents().find(s => s.userId === user?.id);
  const marks = db.getMarksByStudent(student?.id || 1);

  const data = marks.map(m => ({ subject: m.subject, score: m.score, total: m.total, percentage: Math.round((m.score / m.total) * 100) }));
  const radarData = marks.map(m => ({ subject: m.subject, score: m.score, fullMark: m.total }));
  const pieData = marks.map(m => ({ name: m.subject, value: m.score }));
  const avgScore = marks.length ? Math.round(marks.reduce((a, m) => a + m.score, 0) / marks.length) : 0;
  const highest = marks.length ? Math.max(...marks.map(m => m.score)) : 0;
  const lowest = marks.length ? Math.min(...marks.map(m => m.score)) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">My Marks</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Average</p>
          <p className="text-3xl font-bold text-primary mt-1">{avgScore}%</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Highest</p>
          <p className="text-3xl font-bold text-success mt-1">{highest}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Lowest</p>
          <p className="text-3xl font-bold text-warning mt-1">{lowest}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Subjects</p>
          <p className="text-3xl font-bold text-foreground mt-1">{marks.length}</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Subject Radar</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" className="text-xs" />
                <PolarRadiusAxis domain={[0, 100]} className="text-xs" />
                <Radar dataKey="score" stroke="hsl(221, 83%, 53%)" fill="hsl(221, 83%, 53%)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Score Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Score Comparison</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data}>
                <XAxis dataKey="subject" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="score" fill="hsl(262, 83%, 58%)" radius={[6, 6, 0, 0]} name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart - Percentage trend */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Percentage by Subject</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data}>
                <XAxis dataKey="subject" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="percentage" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ fill: 'hsl(142, 76%, 36%)', r: 5 }} name="Percentage" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Marks Table */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Detailed Marks</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Subject</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Score</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Total</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">%</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Grade</th>
              </tr>
            </thead>
            <tbody>
              {marks.map(m => {
                const pct = Math.round((m.score / m.total) * 100);
                const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
                return (
                  <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm font-medium text-foreground">{m.subject}</td>
                    <td className="p-4 text-sm text-muted-foreground">{m.score}</td>
                    <td className="p-4 text-sm text-muted-foreground">{m.total}</td>
                    <td className="p-4 text-sm text-muted-foreground">{pct}%</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${pct >= 80 ? 'bg-success/10 text-success' : pct >= 60 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMarks;
