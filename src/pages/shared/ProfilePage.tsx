import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/data/mockStore';
import { Mail, Phone, Calendar, MapPin, BookOpen, GraduationCap } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const student = user.role === 'student' ? db.getStudents().find(s => s.userId === user.id) : null;
  const teacher = user.role === 'teacher' ? db.getTeachers().find(t => t.userId === user.id) : null;

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-foreground">Profile</h2>

      <div className="erp-card p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {initials}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{user.phone}</span>
            </div>
          )}
          {user.joinDate && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Joined {user.joinDate}</span>
            </div>
          )}
          {student && (
            <>
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">Class {student.class} • Roll {student.roll}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{student.address}</span>
              </div>
            </>
          )}
          {teacher && (
            <>
              <div className="flex items-center gap-3 text-sm">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{teacher.subject} • {teacher.qualification}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
