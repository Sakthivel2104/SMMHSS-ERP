import { useState } from 'react';
import { db } from '@/data/mockStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Trophy, Medal, Award, TrendingUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudentPerformance = () => {
  const students = db.getStudents();
  const marks = db.getAllMarks();
  const attendance = students.map(s => {
    const att = db.getAttendanceByStudent(s.id);
    const avg = att.length > 0 ? Math.round(att.reduce((sum, a) => sum + a.percentage, 0) / att.length) : 0;
    return { studentId: s.id, avgAttendance: avg };
  });

  const [selectedClass, setSelectedClass] = useState('all');

  const classes = [...new Set(students.map(s => s.class))];

  const filteredStudents = selectedClass === 'all' ? students : students.filter(s => s.class === selectedClass);

  // Compute rankings
  const rankings = filteredStudents.map(s => {
    const studentMarks = marks.filter(m => m.studentId === s.id);
    const totalScore = studentMarks.reduce((sum, m) => sum + m.score, 0);
    const totalPossible = studentMarks.reduce((sum, m) => sum + m.total, 0);
    const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    const avgAttendance = attendance.find(a => a.studentId === s.id)?.avgAttendance || 0;
    const subjects = studentMarks.length;
    return { ...s, totalScore, totalPossible, percentage, avgAttendance, subjects };
  }).sort((a, b) => b.percentage - a.percentage);

  // Subject-wise class average
  const allSubjects = [...new Set(marks.filter(m => filteredStudents.some(s => s.id === m.studentId)).map(m => m.subject))];
  const subjectAverages = allSubjects.map(subject => {
    const subjectMarks = marks.filter(m => m.subject === subject && filteredStudents.some(s => s.id === m.studentId));
    const avg = subjectMarks.length > 0 ? Math.round(subjectMarks.reduce((sum, m) => sum + (m.score / m.total) * 100, 0) / subjectMarks.length) : 0;
    const highest = subjectMarks.length > 0 ? Math.max(...subjectMarks.map(m => (m.score / m.total) * 100)) : 0;
    return { subject, average: avg, highest: Math.round(highest) };
  });

  // Comparison bar chart data
  const comparisonData = rankings.slice(0, 10).map(s => ({
    name: s.name.split(' ')[0],
    marks: s.percentage,
    attendance: s.avgAttendance,
  }));

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">#{rank}</span>;
  };

  const exportCSV = () => {
    const header = 'Rank,Name,Class,Marks %,Attendance %,Subjects\n';
    const rows = rankings.map((s, i) => `${i + 1},${s.name},${s.class},${s.percentage},${s.avgAttendance},${s.subjects}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'student_rankings.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Student Performance & Rankings</h2>
          <p className="text-sm text-muted-foreground">Class-wide analytics with comparison charts</p>
        </div>
        <div className="flex gap-3">
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
            <option value="all">All Classes</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>
      </div>

      {/* Top 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {rankings.slice(0, 3).map((s, i) => (
          <div key={s.id} className={`erp-card p-5 border-2 ${i === 0 ? 'border-yellow-500/30 bg-yellow-500/5' : i === 1 ? 'border-gray-400/30 bg-gray-400/5' : 'border-amber-600/30 bg-amber-600/5'}`}>
            <div className="flex items-center gap-3 mb-3">
              {rankIcon(i + 1)}
              <div>
                <p className="font-semibold text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">Class {s.class}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Marks:</span> <span className="font-bold text-foreground">{s.percentage}%</span></div>
              <div><span className="text-muted-foreground">Attend:</span> <span className="font-bold text-foreground">{s.avgAttendance}%</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Student Comparison (Top 10)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparisonData} barGap={4}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} className="text-xs" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="marks" name="Marks %" fill="hsl(221,83%,53%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attendance" name="Attendance %" fill="hsl(142,76%,36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="erp-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Subject-wise Class Average</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={subjectAverages} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" className="text-xs" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
              <Radar name="Average" dataKey="average" stroke="hsl(221,83%,53%)" fill="hsl(221,83%,53%)" fillOpacity={0.3} />
              <Radar name="Highest" dataKey="highest" stroke="hsl(142,76%,36%)" fill="hsl(142,76%,36%)" fillOpacity={0.15} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full ranking table */}
      <div className="erp-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Rank</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Student</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Class</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Marks %</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Attendance %</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Subjects</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Performance</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((s, i) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">{rankIcon(i + 1)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{s.class}</td>
                <td className="p-4 text-sm font-semibold text-foreground">{s.percentage}%</td>
                <td className="p-4 text-sm text-muted-foreground">{s.avgAttendance}%</td>
                <td className="p-4 text-sm text-muted-foreground">{s.subjects}</td>
                <td className="p-4">
                  <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                    <div className={`h-2 rounded-full ${s.percentage >= 80 ? 'bg-success' : s.percentage >= 50 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${s.percentage}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPerformance;
