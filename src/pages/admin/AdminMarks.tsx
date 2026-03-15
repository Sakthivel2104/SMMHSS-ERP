import { db } from '@/data/mockStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminMarks = () => {
  const students = db.getStudents();
  const data = students.map(s => {
    const marks = db.getMarksByStudent(s.id);
    const avg = marks.length ? Math.round(marks.reduce((a, m) => a + m.score, 0) / marks.length) : 0;
    return { name: s.name.split(' ')[0], average: avg };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Marks Overview</h2>
      <div className="erp-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Student Average Scores</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} className="text-xs" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="average" fill="hsl(221,83%,53%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminMarks;
