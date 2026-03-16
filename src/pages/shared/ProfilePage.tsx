import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/data/mockStore';
import { Mail, Phone, Calendar, MapPin, BookOpen, GraduationCap, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const student = user.role === 'student' ? db.getStudents().find(s => s.userId === user.id) : null;
  const teacher = user.role === 'teacher' ? db.getTeachers().find(t => t.userId === user.id) : null;

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    return localStorage.getItem(`erp_avatar_${user.id}`) || null;
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarUrl(dataUrl);
      localStorage.setItem(`erp_avatar_${user.id}`, dataUrl);
      toast.success('Profile photo updated');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-foreground">Profile</h2>

      <div className="erp-card p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {initials}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            <Button variant="ghost" size="sm" className="mt-1 text-xs" onClick={() => fileRef.current?.click()}>
              Change Photo
            </Button>
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
