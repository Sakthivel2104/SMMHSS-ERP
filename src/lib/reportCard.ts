import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db, type Student } from '@/data/mockStore';

export const generateReportCard = (studentId: number) => {
  const student = db.getStudent(studentId);
  if (!student) return;

  const marks = db.getMarksByStudent(studentId);
  const attendance = db.getAttendanceByStudent(studentId);
  const fees = db.getFeesByStudent(studentId);

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(26, 54, 93);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('SMMHSS ERP', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Student Report Card', pageWidth / 2, 30, { align: 'center' });

  // Student Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  const y = 55;
  doc.setFont('helvetica', 'bold');
  doc.text('Student Details', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const info = [
    ['Name', student.name],
    ['Class / Section', `${student.class} - ${student.section}`],
    ['Roll Number', student.roll],
    ['Email', student.email],
    ['Parent', student.parentName],
    ['Phone', student.phone],
  ];

  let infoY = y + 8;
  info.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 14, infoY);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 55, infoY);
    infoY += 7;
  });

  // Marks Table
  if (marks.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Academic Performance', 14, infoY + 8);

    const marksRows = marks.map(m => {
      const pct = Math.round((m.score / m.total) * 100);
      const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
      return [m.subject, `${m.score}`, `${m.total}`, `${pct}%`, grade, m.examType];
    });

    const avgScore = Math.round(marks.reduce((a, m) => a + m.score, 0) / marks.length);

    autoTable(doc, {
      startY: infoY + 14,
      head: [['Subject', 'Score', 'Total', '%', 'Grade', 'Exam']],
      body: marksRows,
      foot: [['Average', `${avgScore}`, '100', `${avgScore}%`, '', '']],
      theme: 'grid',
      headStyles: { fillColor: [43, 108, 176], textColor: 255 },
      footStyles: { fillColor: [237, 242, 247], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { fontSize: 9 },
    });
  }

  // Attendance
  if (attendance.length > 0) {
    const lastY = (doc as any).lastAutoTable?.finalY || infoY + 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Attendance Record', 14, lastY + 12);

    const attRows = attendance.map(a => [a.month, `${a.year}`, `${a.totalDays}`, `${a.presentDays}`, `${a.totalDays - a.presentDays}`, `${a.percentage}%`]);
    const avgAtt = Math.round(attendance.reduce((a, att) => a + att.percentage, 0) / attendance.length);

    autoTable(doc, {
      startY: lastY + 18,
      head: [['Month', 'Year', 'Total Days', 'Present', 'Absent', '%']],
      body: attRows,
      foot: [['Average', '', '', '', '', `${avgAtt}%`]],
      theme: 'grid',
      headStyles: { fillColor: [56, 161, 105], textColor: 255 },
      footStyles: { fillColor: [237, 242, 247], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { fontSize: 9 },
    });
  }

  // Fee Status
  if (fees.length > 0) {
    const lastY = (doc as any).lastAutoTable?.finalY || 180;
    if (lastY > 240) doc.addPage();
    const feeStartY = lastY > 240 ? 20 : lastY + 12;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Fee Status', 14, feeStartY);

    const feeRows = fees.map(f => [f.type, `$${f.amount.toLocaleString()}`, f.dueDate, f.status.toUpperCase(), f.paidDate || '-']);

    autoTable(doc, {
      startY: feeStartY + 6,
      head: [['Type', 'Amount', 'Due Date', 'Status', 'Paid Date']],
      body: feeRows,
      theme: 'grid',
      headStyles: { fillColor: [214, 158, 46], textColor: 255 },
      styles: { fontSize: 9 },
    });
  }

  // Footer
  const finalY = (doc as any).lastAutoTable?.finalY || 250;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on ${new Date().toLocaleDateString()} | SMMHSS ERP System`, pageWidth / 2, Math.min(finalY + 20, 285), { align: 'center' });

  doc.save(`Report_Card_${student.name.replace(/\s+/g, '_')}.pdf`);
};
