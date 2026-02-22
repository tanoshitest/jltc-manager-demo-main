import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  LogOut,
  Menu,
  GraduationCap,
  BarChart3,
  BookOpen,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface TeacherLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: Users, label: "Học viên", path: "/teacher/students" },
  { icon: BookOpen, label: "Quản lý Lớp", path: "/teacher/classes" },
  { icon: FileText, label: "Quản lý Đề thi", path: "/teacher/exams" },
  { icon: ClipboardList, label: "Công việc được giao", path: "/teacher/tasks" },
  { icon: Calendar, label: "Lịch dạy tuần này", path: "/teacher/schedule" },
];

const Sidebar = ({ onLogout, isCollapsed, onToggle }: { onLogout: () => void, isCollapsed?: boolean, onToggle?: () => void }) => {
  const location = useLocation();

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
      <div className={cn("p-6 border-b border-border flex items-center justify-between", isCollapsed ? "p-4 justify-center" : "")}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <GraduationCap className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h2 className="font-bold text-lg leading-tight truncate">IKIGAI CENTER</h2>
              <p className="text-xs text-muted-foreground truncate">Teacher Portal</p>
            </div>
          </div>
        )}
        {isCollapsed && <GraduationCap className="w-8 h-8 text-primary shrink-0" />}

        {onToggle && (
          <Button variant="ghost" size="icon" className="h-6 w-6 hidden lg:flex ml-auto" onClick={onToggle}>
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-2 overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent text-foreground",
                isCollapsed ? "justify-center px-2" : ""
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="outline" className={cn("w-full flex items-center gap-2", isCollapsed ? "justify-center px-0" : "")} onClick={onLogout} title={isCollapsed ? "Đăng xuất" : undefined}>
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && "Đăng xuất"}
        </Button>
      </div>
    </div>
  );
};

const TeacherLayout = ({ children }: TeacherLayoutProps) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false); // Expanded sidebar by default
  const handleLogout = () => navigate("/");

  return (
    <div className="flex h-screen overflow-hidden bg-muted">
      {/* Desktop Sidebar */}
      <aside className={cn("hidden lg:block h-full transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
        <Sidebar onLogout={handleLogout} isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-2 flex items-center justify-between h-14 lg:hidden">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          <span className="font-bold">IKIGAI CENTER</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar onLogout={handleLogout} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="min-h-full">
          <div className="container mx-auto p-3 lg:p-4">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
