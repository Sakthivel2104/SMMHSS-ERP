import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, CalendarDays,
  ClipboardList, Bell, UserCircle, LogOut, BookOpen,
  ChevronLeft, ChevronRight, BarChart3, Calendar, Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const roleMenus: Record<string, Array<{ title: string; path: string; icon: any }>> = {
  admin: [
    { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { title: 'Students', path: '/admin/students', icon: GraduationCap },
    { title: 'Teachers', path: '/admin/teachers', icon: Users },
    { title: 'Attendance', path: '/admin/attendance', icon: ClipboardList },
    { title: 'Marks', path: '/admin/marks', icon: BarChart3 },
    { title: 'Performance', path: '/admin/performance', icon: TrendingUp },
    { title: 'Events', path: '/admin/events', icon: CalendarDays },
    { title: 'Calendar', path: '/admin/calendar', icon: Calendar },
    { title: 'Notifications', path: '/admin/notifications', icon: Bell },
    { title: 'Profile', path: '/admin/profile', icon: UserCircle },
  ],
  teacher: [
    { title: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
    { title: 'Students', path: '/teacher/students', icon: GraduationCap },
    { title: 'Marks', path: '/teacher/marks', icon: BarChart3 },
    { title: 'Attendance', path: '/teacher/attendance', icon: ClipboardList },
    { title: 'Homework', path: '/teacher/homework', icon: BookOpen },
    { title: 'Events', path: '/teacher/events', icon: CalendarDays },
    { title: 'Notifications', path: '/teacher/notifications', icon: Bell },
    { title: 'Profile', path: '/teacher/profile', icon: UserCircle },
  ],
  student: [
    { title: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { title: 'Attendance', path: '/student/attendance', icon: ClipboardList },
    { title: 'Marks', path: '/student/marks', icon: BarChart3 },
    { title: 'Fees', path: '/student/fees', icon: CalendarDays },
    { title: 'Events', path: '/student/events', icon: CalendarDays },
    { title: 'Notifications', path: '/student/notifications', icon: Bell },
    { title: 'Profile', path: '/student/profile', icon: UserCircle },
  ],
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const menuItems = roleMenus[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const SidebarContent = () => (
    <>
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <h2 className="font-semibold text-sm text-sidebar-accent-foreground">Scholaris ERP</h2>
            <p className="text-xs text-sidebar-muted capitalize">{user.role} Panel</p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/${user.role}`}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button onClick={handleLogout} className={`sidebar-link w-full hover:text-destructive ${collapsed ? 'justify-center px-2' : ''}`}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex flex-col bg-sidebar fixed inset-y-0 left-0 z-30"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border flex items-center justify-center text-muted-foreground hover:text-foreground"
          style={{ boxShadow: 'var(--card-shadow)' }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-sidebar z-50 lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${collapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
        {/* Top nav */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-foreground capitalize">{user.role} Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center font-medium">3</span>
            </button>
            <button
              onClick={() => navigate(`/${user.role}/profile`)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground ring-2 ring-primary/20">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
