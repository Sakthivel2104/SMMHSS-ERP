import { db } from '@/data/mockStore';

export const exportMarksCSV = () => {
  const marks = db.getAllMarks();
  const students = db.getStudents();
  const header = 'Student Name,Class,Roll,Subject,Score,Total,Percentage,Exam Type,Date\n';
  const rows = marks.map(m => {
    const s = students.find(st => st.id === m.studentId);
    return `"${s?.name || 'Unknown'}","${s?.class || ''}","${s?.roll || ''}","${m.subject}",${m.score},${m.total},${Math.round((m.score / m.total) * 100)}%,"${m.examType}","${m.date}"`;
  }).join('\n');
  downloadCSV(header + rows, 'student_marks_report.csv');
};

export const exportAttendanceCSV = () => {
  const students = db.getStudents();
  const header = 'Student Name,Class,Roll,Month,Year,Total Days,Present Days,Percentage\n';
  const rows: string[] = [];
  students.forEach(s => {
    const att = db.getAttendanceByStudent(s.id);
    att.forEach(a => {
      rows.push(`"${s.name}","${s.class}","${s.roll}","${a.month}",${a.year},${a.totalDays},${a.presentDays},${a.percentage}%`);
    });
  });
  downloadCSV(header + rows.join('\n'), 'attendance_report.csv');
};

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};
