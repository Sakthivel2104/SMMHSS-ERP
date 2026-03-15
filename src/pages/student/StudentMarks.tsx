import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StudentMarks = () => {
  const { user } = useAuth();
  const student = db.getStudents().find(s => s.userId === user?.id);
  const marks = db.getMarksByStudent(student?.id || 1);
  const data = marks.map(m => ({ subject: m.subject, score: m.score, total: m.total }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">My Marks</h2>

      <div className="erp-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Subject Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="subject" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} className="text-xs" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="score" fill="hsl(221,83%,53%)" radius={[6, 6, 0, 0]} name="Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="erp-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Subject</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Score</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Total</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Percentage</th>
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
      </div>
    </div>
  );
};

export default StudentMarks;
