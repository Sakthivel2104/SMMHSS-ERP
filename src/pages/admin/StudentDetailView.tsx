import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/data/mockStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Users, FileDown } from 'lucide-react';
import { generateReportCard } from '@/lib/reportCard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, AreaChart, Area, Legend,
} from 'recharts';

const COLORS = [
  'hsl(221, 83%, 53%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)', 'hsl(262, 83%, 58%)',
];

const StudentDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = db.getStudent(Number(id));

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Student not found</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const marks = db.getMarksByStudent(student.id);
  const attendance = db.getAttendanceByStudent(student.id);
  const fees = db.getFeesByStudent(student.id);

  const avgScore = marks.length ? Math.round(marks.reduce((a, m) => a + m.score, 0) / marks.length) : 0;
  const avgAttendance = attendance.length ? Math.round(attendance.reduce((a, att) => a + att.percentage, 0) / attendance.length) : 0;
  const totalFees = fees.reduce((a, f) => a + f.amount, 0);
  const paidFees = fees.filter(f => f.status === 'paid').reduce((a, f) => a + f.amount, 0);
  const pendingFees = fees.filter(f => f.status === 'pending').reduce((a, f) => a + f.amount, 0);

  const marksRadar = marks.map(m => ({ subject: m.subject, score: m.score, fullMark: m.total }));
  const marksPie = marks.map(m => ({ name: m.subject, value: m.score }));
  const attendanceLine = attendance.map(a => ({ month: a.month, present: a.presentDays, absent: a.totalDays - a.presentDays, percentage: a.percentage }));
  const feePie = [
    { name: 'Paid', value: paidFees },
    { name: 'Pending', value: pendingFees },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Student Profile</h2>
        </div>
        <Button onClick={() => generateReportCard(student.id)} variant="outline">
          <FileDown className="w-4 h-4 mr-2" /> Download Report Card
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary flex-shrink-0 mx-auto md:mx-0">
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem icon={User} label="Full Name" value={student.name} />
              <InfoItem icon={Mail} label="Email" value={student.email} />
              <InfoItem icon={Phone} label="Phone" value={student.phone} />
              <InfoItem icon={Calendar} label="Class / Section" value={`${student.class} - ${student.section}`} />
              <InfoItem icon={User} label="Roll Number" value={student.roll} />
              <InfoItem icon={Calendar} label="Joined" value={student.joinDate} />
              <InfoItem icon={Users} label="Parent" value={student.parentName} />
              <InfoItem icon={Phone} label="Parent Phone" value={student.parentPhone} />
              <InfoItem icon={MapPin} label="Address" value={student.address} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Avg Score" value={`${avgScore}%`} color="text-primary" />
        <SummaryCard label="Attendance" value={`${avgAttendance}%`} color="text-success" />
        <SummaryCard label="Paid Fees" value={`$${paidFees.toLocaleString()}`} color="text-success" />
        <SummaryCard label="Pending Fees" value={`$${pendingFees.toLocaleString()}`} color="text-warning" />
      </div>

      {/* Marks Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Subject Performance (Radar)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={marksRadar}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" className="text-xs" />
                <PolarRadiusAxis domain={[0, 100]} className="text-xs" />
                <Radar name="Score" dataKey="score" stroke="hsl(221, 83%, 53%)" fill="hsl(221, 83%, 53%)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Score Distribution (Pie)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={marksPie} cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`} dataKey="value">
                  {marksPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Attendance Trend (Area)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={attendanceLine}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Area type="monotone" dataKey="percentage" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 36%)" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Present vs Absent (Stacked Bar)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={attendanceLine}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="hsl(142, 76%, 36%)" radius={[0, 0, 0, 0]} name="Present" />
                <Bar dataKey="absent" stackId="a" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Marks Table */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Marks History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Subject</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Score</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Total</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">%</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Grade</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Exam</th>
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
                    <td className="p-4 text-sm text-muted-foreground">{m.examType}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Fees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Fee Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={feePie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} label={({ name, value }) => `${name}: $${value}`} dataKey="value">
                  <Cell fill="hsl(142, 76%, 36%)" />
                  <Cell fill="hsl(38, 92%, 50%)" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm">Fee Records</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Amount</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Due</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm font-medium text-foreground">{f.type}</td>
                    <td className="p-4 text-sm text-foreground">${f.amount.toLocaleString()}</td>
                    <td className="p-4 text-sm text-muted-foreground">{f.dueDate}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${f.status === 'paid' ? 'bg-success/10 text-success' : f.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const SummaryCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <Card>
    <CardContent className="p-4 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </CardContent>
  </Card>
);

export default StudentDetailView;
