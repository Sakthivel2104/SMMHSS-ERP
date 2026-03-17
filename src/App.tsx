import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

import LoginPage from "@/pages/LoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminStudents from "@/pages/admin/AdminStudents";
import AdminTeachers from "@/pages/admin/AdminTeachers";
import AdminAttendance from "@/pages/admin/AdminAttendance";
import AdminMarks from "@/pages/admin/AdminMarks";
import CalendarPage from "@/pages/admin/CalendarPage";
import EventsPage from "@/pages/shared/EventsPage";
import NotificationsPage from "@/pages/shared/NotificationsPage";
import ProfilePage from "@/pages/shared/ProfilePage";

import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import TeacherStudents from "@/pages/teacher/TeacherStudents";
import TeacherMarks from "@/pages/teacher/TeacherMarks";
import TeacherAttendance from "@/pages/teacher/TeacherAttendance";
import TeacherHomework from "@/pages/teacher/TeacherHomework";

import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentMarks from "@/pages/student/StudentMarks";
import StudentAttendance from "@/pages/student/StudentAttendance";
import StudentFees from "@/pages/student/StudentFees";
import StudentPerformance from "@/pages/admin/StudentPerformance";
import StudentDetailView from "@/pages/admin/StudentDetailView";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const DashboardRoute = ({ children, roles }: { children: React.ReactNode; roles: string[] }) => (
  <ProtectedRoute allowedRoles={roles}>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<DashboardRoute roles={['admin']}><AdminDashboard /></DashboardRoute>} />
            <Route path="/admin/students" element={<DashboardRoute roles={['admin']}><AdminStudents /></DashboardRoute>} />
            <Route path="/admin/teachers" element={<DashboardRoute roles={['admin']}><AdminTeachers /></DashboardRoute>} />
            <Route path="/admin/attendance" element={<DashboardRoute roles={['admin']}><AdminAttendance /></DashboardRoute>} />
            <Route path="/admin/marks" element={<DashboardRoute roles={['admin']}><AdminMarks /></DashboardRoute>} />
            <Route path="/admin/performance" element={<DashboardRoute roles={['admin']}><StudentPerformance /></DashboardRoute>} />
            <Route path="/admin/events" element={<DashboardRoute roles={['admin']}><EventsPage /></DashboardRoute>} />
            <Route path="/admin/calendar" element={<DashboardRoute roles={['admin']}><CalendarPage /></DashboardRoute>} />
            <Route path="/admin/notifications" element={<DashboardRoute roles={['admin']}><NotificationsPage /></DashboardRoute>} />
            <Route path="/admin/profile" element={<DashboardRoute roles={['admin']}><ProfilePage /></DashboardRoute>} />

            {/* Teacher routes */}
            <Route path="/teacher" element={<DashboardRoute roles={['teacher']}><TeacherDashboard /></DashboardRoute>} />
            <Route path="/teacher/students" element={<DashboardRoute roles={['teacher']}><TeacherStudents /></DashboardRoute>} />
            <Route path="/teacher/marks" element={<DashboardRoute roles={['teacher']}><TeacherMarks /></DashboardRoute>} />
            <Route path="/teacher/attendance" element={<DashboardRoute roles={['teacher']}><TeacherAttendance /></DashboardRoute>} />
            <Route path="/teacher/homework" element={<DashboardRoute roles={['teacher']}><TeacherHomework /></DashboardRoute>} />
            <Route path="/teacher/events" element={<DashboardRoute roles={['teacher']}><EventsPage /></DashboardRoute>} />
            <Route path="/teacher/notifications" element={<DashboardRoute roles={['teacher']}><NotificationsPage /></DashboardRoute>} />
            <Route path="/teacher/profile" element={<DashboardRoute roles={['teacher']}><ProfilePage /></DashboardRoute>} />

            {/* Student routes */}
            <Route path="/student" element={<DashboardRoute roles={['student']}><StudentDashboard /></DashboardRoute>} />
            <Route path="/student/marks" element={<DashboardRoute roles={['student']}><StudentMarks /></DashboardRoute>} />
            <Route path="/student/attendance" element={<DashboardRoute roles={['student']}><StudentAttendance /></DashboardRoute>} />
            <Route path="/student/fees" element={<DashboardRoute roles={['student']}><StudentFees /></DashboardRoute>} />
            <Route path="/student/events" element={<DashboardRoute roles={['student']}><EventsPage /></DashboardRoute>} />
            <Route path="/student/notifications" element={<DashboardRoute roles={['student']}><NotificationsPage /></DashboardRoute>} />
            <Route path="/student/profile" element={<DashboardRoute roles={['student']}><ProfilePage /></DashboardRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
