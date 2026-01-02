import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import StudentDetail from "./pages/admin/StudentDetail";
import Teachers from "./pages/admin/Teachers";
import TeacherDetail from "./pages/admin/TeacherDetail";
import ClassDetail from "./pages/admin/ClassDetail";
import Classes from "./pages/admin/Classes";
import Schedule from "./pages/admin/Schedule";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import ExamManagement from "./pages/admin/ExamManagement";
import ExamDetail from "./pages/admin/ExamDetail";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherStudents from "./pages/teacher/Students";
import TeacherStudentDetail from "./pages/teacher/StudentDetail";
import TeacherClasses from "./pages/teacher/Classes";
import TeacherSchedule from "./pages/teacher/Schedule";
import ClassManagement from "./pages/teacher/ClassManagement";
import TeacherExamManagement from "./pages/teacher/ExamManagement";
import TeacherExamDetail from "./pages/teacher/ExamDetail";
import StudentDashboard from "./pages/student/Dashboard";
import StudentExams from "./pages/student/Exams";
import ExamTaking from "./pages/student/ExamTaking";
import ExamResult from "./pages/student/ExamResult";
import StudentHistory from "./pages/student/History";
import StudentGoals from "./pages/student/Goals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/students/:id" element={<StudentDetail />} />
          <Route path="/admin/teachers" element={<Teachers />} />
          <Route path="/admin/teachers/:id" element={<TeacherDetail />} />
          <Route path="/admin/classes" element={<Classes />} />
          <Route path="/admin/classes/:id" element={<ClassDetail />} />
          <Route path="/admin/schedule" element={<Schedule />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/exams" element={<ExamManagement />} />
          <Route path="/admin/exams/:id" element={<ExamDetail />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          <Route path="/teacher/students/:id" element={<TeacherStudentDetail />} />
          <Route path="/teacher/classes" element={<TeacherClasses />} />
          <Route path="/teacher/schedule" element={<TeacherSchedule />} />
          <Route path="/teacher/exams" element={<TeacherExamManagement />} />
          <Route path="/teacher/exams/:id" element={<TeacherExamDetail />} />
          <Route path="/teacher/class/:id" element={<ClassManagement />} />
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/exams" element={<StudentExams />} />
          <Route path="/student/exam/:id" element={<ExamTaking />} />
          <Route path="/student/result/:id" element={<ExamResult />} />
          <Route path="/student/history" element={<StudentHistory />} />
          <Route path="/student/goals" element={<StudentGoals />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
