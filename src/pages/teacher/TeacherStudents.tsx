import { db } from '@/data/mockStore';

const TeacherStudents = () => {
  const students = db.getStudents();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Students</h2>

      <div className="erp-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Name</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Class</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Roll</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Email</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Parent</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{s.class}</td>
                <td className="p-4 text-sm text-muted-foreground">{s.roll}</td>
                <td className="p-4 text-sm text-muted-foreground">{s.email}</td>
                <td className="p-4 text-sm text-muted-foreground">{s.parentName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherStudents;
