// Centralized mock data store - ready for MySQL replacement
export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
  phone?: string;
  avatar?: string;
  subject?: string;
  class?: string;
  roll?: string;
  joinDate?: string;
}

export interface Student {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  class: string;
  roll: string;
  section: string;
  parentName: string;
  parentPhone: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Teacher {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'event' | 'meeting' | 'holiday' | 'exam';
  createdBy: number;
}

export interface Mark {
  id: number;
  studentId: number;
  subject: string;
  score: number;
  total: number;
  examType: string;
  date: string;
}

export interface Attendance {
  id: number;
  studentId: number;
  month: string;
  year: number;
  totalDays: number;
  presentDays: number;
  percentage: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'homework' | 'event' | 'meeting' | 'announcement' | 'fee';
  targetRole: 'all' | 'student' | 'teacher';
  date: string;
  read: boolean;
  createdBy: number;
}

export interface Fee {
  id: number;
  studentId: number;
  type: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(`erp_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
};

const saveToStorage = <T>(key: string, data: T) => {
  localStorage.setItem(`erp_${key}`, JSON.stringify(data));
};

const defaultUsers: User[] = [
  { id: 1, email: 'admin@school.com', password: 'password123', role: 'admin', name: 'Dr. Sarah Jenkins', phone: '+1 555-0101', joinDate: '2020-01-15' },
  { id: 2, email: 'teacher@school.com', password: 'password123', role: 'teacher', name: 'Marcus Aurelius', phone: '+1 555-0102', subject: 'History', joinDate: '2021-03-20' },
  { id: 3, email: 'student@school.com', password: 'password123', role: 'student', name: 'Alex Rivera', phone: '+1 555-0103', class: '10-A', roll: '101', joinDate: '2022-06-01' },
  { id: 4, email: 'math@school.com', password: 'password123', role: 'teacher', name: 'Elena Rodriguez', phone: '+1 555-0104', subject: 'Mathematics', joinDate: '2021-08-15' },
  { id: 5, email: 'science@school.com', password: 'password123', role: 'teacher', name: 'Dr. James Park', phone: '+1 555-0105', subject: 'Physics', joinDate: '2020-09-01' },
];

const defaultStudents: Student[] = [
  { id: 1, userId: 3, name: 'Alex Rivera', email: 'student@school.com', phone: '+1 555-0103', class: '10-A', roll: '101', section: 'A', parentName: 'Maria Rivera', parentPhone: '+1 555-0201', address: '123 Oak Street', joinDate: '2022-06-01', status: 'active' },
  { id: 2, userId: 0, name: 'Emma Thompson', email: 'emma@school.com', phone: '+1 555-0106', class: '10-A', roll: '102', section: 'A', parentName: 'John Thompson', parentPhone: '+1 555-0202', address: '456 Pine Ave', joinDate: '2022-06-01', status: 'active' },
  { id: 3, userId: 0, name: 'Liam Chen', email: 'liam@school.com', phone: '+1 555-0107', class: '10-B', roll: '201', section: 'B', parentName: 'Wei Chen', parentPhone: '+1 555-0203', address: '789 Elm Road', joinDate: '2022-06-01', status: 'active' },
  { id: 4, userId: 0, name: 'Sofia Patel', email: 'sofia@school.com', phone: '+1 555-0108', class: '9-A', roll: '301', section: 'A', parentName: 'Raj Patel', parentPhone: '+1 555-0204', address: '321 Maple Dr', joinDate: '2023-06-01', status: 'active' },
  { id: 5, userId: 0, name: 'Noah Williams', email: 'noah@school.com', phone: '+1 555-0109', class: '9-B', roll: '302', section: 'B', parentName: 'Sarah Williams', parentPhone: '+1 555-0205', address: '654 Cedar Ln', joinDate: '2023-06-01', status: 'active' },
];

const defaultTeachers: Teacher[] = [
  { id: 1, userId: 2, name: 'Marcus Aurelius', email: 'teacher@school.com', phone: '+1 555-0102', subject: 'History', qualification: 'M.A. History', experience: '8 years', joinDate: '2021-03-20', status: 'active' },
  { id: 2, userId: 4, name: 'Elena Rodriguez', email: 'math@school.com', phone: '+1 555-0104', subject: 'Mathematics', qualification: 'M.Sc. Mathematics', experience: '5 years', joinDate: '2021-08-15', status: 'active' },
  { id: 3, userId: 5, name: 'Dr. James Park', email: 'science@school.com', phone: '+1 555-0105', subject: 'Physics', qualification: 'Ph.D. Physics', experience: '12 years', joinDate: '2020-09-01', status: 'active' },
];

const defaultEvents: Event[] = [
  { id: 1, title: 'Annual Sports Day', description: 'Annual inter-house sports competition', date: '2026-04-15', type: 'event', createdBy: 1 },
  { id: 2, title: 'Parent-Teacher Meeting', description: 'Q1 progress discussion with parents', date: '2026-03-28', type: 'meeting', createdBy: 1 },
  { id: 3, title: 'Science Exhibition', description: 'Student project showcase', date: '2026-04-05', type: 'event', createdBy: 1 },
  { id: 4, title: 'Mid-Term Exams', description: 'Mid-term examination week', date: '2026-04-20', type: 'exam', createdBy: 1 },
  { id: 5, title: 'Spring Break', description: 'Spring vacation', date: '2026-05-01', type: 'holiday', createdBy: 1 },
];

const defaultMarks: Mark[] = [
  { id: 1, studentId: 1, subject: 'Mathematics', score: 85, total: 100, examType: 'Mid-Term', date: '2026-02-15' },
  { id: 2, studentId: 1, subject: 'Physics', score: 92, total: 100, examType: 'Mid-Term', date: '2026-02-15' },
  { id: 3, studentId: 1, subject: 'History', score: 78, total: 100, examType: 'Mid-Term', date: '2026-02-15' },
  { id: 4, studentId: 1, subject: 'English', score: 88, total: 100, examType: 'Mid-Term', date: '2026-02-15' },
  { id: 5, studentId: 1, subject: 'Chemistry', score: 90, total: 100, examType: 'Mid-Term', date: '2026-02-15' },
  { id: 6, studentId: 2, subject: 'Mathematics', score: 72, total: 100, examType: 'Mid-Term', date: '2026-02-15' },
  { id: 7, studentId: 2, subject: 'Physics', score: 80, total: 100, examType: 'Mid-Term', date: '2026-02-15' },
  { id: 8, studentId: 3, subject: 'Mathematics', score: 95, total: 100, examType: 'Mid-Term', date: '2026-02-15' },
  { id: 9, studentId: 3, subject: 'Physics', score: 88, total: 100, examType: 'Mid-Term', date: '2026-02-15' },
];

const defaultAttendance: Attendance[] = [
  { id: 1, studentId: 1, month: 'Jan', year: 2026, totalDays: 22, presentDays: 20, percentage: 91 },
  { id: 2, studentId: 1, month: 'Feb', year: 2026, totalDays: 20, presentDays: 19, percentage: 95 },
  { id: 3, studentId: 1, month: 'Mar', year: 2026, totalDays: 15, presentDays: 14, percentage: 93 },
  { id: 4, studentId: 2, month: 'Jan', year: 2026, totalDays: 22, presentDays: 18, percentage: 82 },
  { id: 5, studentId: 2, month: 'Feb', year: 2026, totalDays: 20, presentDays: 17, percentage: 85 },
  { id: 6, studentId: 3, month: 'Jan', year: 2026, totalDays: 22, presentDays: 21, percentage: 95 },
];

const defaultNotifications: Notification[] = [
  { id: 1, title: 'Mathematics Homework', message: 'Complete exercises 5.1 to 5.10 from chapter 5', type: 'homework', targetRole: 'student', date: '2026-03-14', read: false, createdBy: 4 },
  { id: 2, title: 'Annual Sports Day', message: 'Annual sports day is scheduled for April 15th. All students must register.', type: 'event', targetRole: 'all', date: '2026-03-13', read: false, createdBy: 1 },
  { id: 3, title: 'Parent-Teacher Meeting', message: 'PTM scheduled for March 28th at 10:00 AM', type: 'meeting', targetRole: 'all', date: '2026-03-12', read: true, createdBy: 1 },
  { id: 4, title: 'Fee Reminder', message: 'Q2 tuition fee due date is March 31st', type: 'fee', targetRole: 'student', date: '2026-03-10', read: false, createdBy: 1 },
  { id: 5, title: 'Staff Meeting', message: 'Monthly staff meeting on March 20th at 3:00 PM', type: 'announcement', targetRole: 'teacher', date: '2026-03-11', read: false, createdBy: 1 },
];

const defaultFees: Fee[] = [
  { id: 1, studentId: 1, type: 'Tuition Fee', amount: 5000, dueDate: '2026-03-31', status: 'pending' },
  { id: 2, studentId: 1, type: 'Lab Fee', amount: 1500, dueDate: '2026-03-31', status: 'pending' },
  { id: 3, studentId: 1, type: 'Tuition Fee', amount: 5000, dueDate: '2025-12-31', status: 'paid', paidDate: '2025-12-20' },
  { id: 4, studentId: 1, type: 'Library Fee', amount: 500, dueDate: '2026-01-15', status: 'paid', paidDate: '2026-01-10' },
];

class MockDatabase {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  events: Event[];
  marks: Mark[];
  attendance: Attendance[];
  notifications: Notification[];
  fees: Fee[];

  constructor() {
    this.users = loadFromStorage('users', defaultUsers);
    this.students = loadFromStorage('students', defaultStudents);
    this.teachers = loadFromStorage('teachers', defaultTeachers);
    this.events = loadFromStorage('events', defaultEvents);
    this.marks = loadFromStorage('marks', defaultMarks);
    this.attendance = loadFromStorage('attendance', defaultAttendance);
    this.notifications = loadFromStorage('notifications', defaultNotifications);
    this.fees = loadFromStorage('fees', defaultFees);
  }

  save(key: string) {
    saveToStorage(key, (this as any)[key]);
  }

  // Auth
  login(email: string, password: string): User | null {
    return this.users.find(u => u.email === email && u.password === password) || null;
  }

  // Students CRUD
  getStudents() { return this.students; }
  getStudent(id: number) { return this.students.find(s => s.id === id); }
  addStudent(student: Omit<Student, 'id'>) {
    const newStudent = { ...student, id: Math.max(0, ...this.students.map(s => s.id)) + 1 };
    this.students.push(newStudent);
    this.save('students');
    return newStudent;
  }
  updateStudent(id: number, data: Partial<Student>) {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx !== -1) { this.students[idx] = { ...this.students[idx], ...data }; this.save('students'); }
    return this.students[idx];
  }
  deleteStudent(id: number) {
    this.students = this.students.filter(s => s.id !== id);
    this.save('students');
  }

  // Teachers CRUD
  getTeachers() { return this.teachers; }
  getTeacher(id: number) { return this.teachers.find(t => t.id === id); }
  addTeacher(teacher: Omit<Teacher, 'id'>) {
    const newTeacher = { ...teacher, id: Math.max(0, ...this.teachers.map(t => t.id)) + 1 };
    this.teachers.push(newTeacher);
    this.save('teachers');
    return newTeacher;
  }
  updateTeacher(id: number, data: Partial<Teacher>) {
    const idx = this.teachers.findIndex(t => t.id === id);
    if (idx !== -1) { this.teachers[idx] = { ...this.teachers[idx], ...data }; this.save('teachers'); }
    return this.teachers[idx];
  }
  deleteTeacher(id: number) {
    this.teachers = this.teachers.filter(t => t.id !== id);
    this.save('teachers');
  }

  // Events
  getEvents() { return this.events; }
  addEvent(event: Omit<Event, 'id'>) {
    const newEvent = { ...event, id: Math.max(0, ...this.events.map(e => e.id)) + 1 };
    this.events.push(newEvent);
    this.save('events');
    // Auto-generate notification
    this.addNotification({
      title: event.title,
      message: event.description,
      type: 'event',
      targetRole: 'all',
      date: new Date().toISOString().split('T')[0],
      read: false,
      createdBy: event.createdBy,
    });
    return newEvent;
  }
  deleteEvent(id: number) {
    this.events = this.events.filter(e => e.id !== id);
    this.save('events');
  }

  // Marks
  getMarksByStudent(studentId: number) { return this.marks.filter(m => m.studentId === studentId); }
  getAllMarks() { return this.marks; }
  addMark(mark: Omit<Mark, 'id'>) {
    const newMark = { ...mark, id: Math.max(0, ...this.marks.map(m => m.id)) + 1 };
    this.marks.push(newMark);
    this.save('marks');
    return newMark;
  }
  updateMark(id: number, data: Partial<Mark>) {
    const idx = this.marks.findIndex(m => m.id === id);
    if (idx !== -1) { this.marks[idx] = { ...this.marks[idx], ...data }; this.save('marks'); }
    return this.marks[idx];
  }

  // Attendance
  getAttendanceByStudent(studentId: number) { return this.attendance.filter(a => a.studentId === studentId); }
  addAttendance(att: Omit<Attendance, 'id'>) {
    const newAtt = { ...att, id: Math.max(0, ...this.attendance.map(a => a.id)) + 1 };
    this.attendance.push(newAtt);
    this.save('attendance');
    return newAtt;
  }

  // Notifications
  getNotifications(role?: string) {
    if (!role) return this.notifications;
    return this.notifications.filter(n => n.targetRole === 'all' || n.targetRole === role);
  }
  addNotification(notif: Omit<Notification, 'id'>) {
    const newNotif = { ...notif, id: Math.max(0, ...this.notifications.map(n => n.id)) + 1 };
    this.notifications.push(newNotif);
    this.save('notifications');
    return newNotif;
  }
  markNotificationRead(id: number) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) { notif.read = true; this.save('notifications'); }
  }

  // Fees
  getFeesByStudent(studentId: number) { return this.fees.filter(f => f.studentId === studentId); }

  // Reset
  reset() {
    Object.keys(localStorage).filter(k => k.startsWith('erp_')).forEach(k => localStorage.removeItem(k));
    this.users = defaultUsers;
    this.students = defaultStudents;
    this.teachers = defaultTeachers;
    this.events = defaultEvents;
    this.marks = defaultMarks;
    this.attendance = defaultAttendance;
    this.notifications = defaultNotifications;
    this.fees = defaultFees;
  }
}

export const db = new MockDatabase();
