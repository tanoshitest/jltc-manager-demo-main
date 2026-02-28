import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCog,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: BarChart3, label: "Dashboard", path: "/admin/dashboard" },
  { icon: UserPlus, label: "Quản lý Lead", path: "/admin/leads" },
  { icon: Users, label: "Quản lý học viên", path: "/admin/students" },
  { icon: UserCog, label: "Quản lý giáo viên", path: "/admin/teachers" },
  { icon: BookOpen, label: "Quản lý lớp", path: "/admin/classes" },
  { icon: Calendar, label: "Quản lý lịch dạy", path: "/admin/schedule" },
  { icon: Briefcase, label: "Quản lý công việc", path: "/admin/tasks" },
  { icon: GraduationCap, label: "Quản lý đề thi", path: "/admin/exams" },
  { icon: BarChart3, label: "Báo Cáo", path: "/admin/reports" },
  { icon: Settings, label: "Cài đặt hệ thống", path: "/admin/settings" },
];

const Sidebar = ({ onLogout, isCollapsed, onToggle }: { onLogout: () => void, isCollapsed?: boolean, onToggle?: () => void }) => {
  const location = useLocation();

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "p-6 border-b border-border flex items-center justify-between",
        isCollapsed && "p-4 justify-center"
      )}>
        <div className="flex items-center gap-2 overflow-hidden">
          <GraduationCap className={cn("w-8 h-8 text-primary flex-shrink-0", isCollapsed && "w-6 h-6")} />
          {!isCollapsed && (
            <div className="whitespace-nowrap">
              <h2 className="font-bold text-lg leading-tight">IKIGAI CENTER</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
        {onToggle && (
          <Button variant="ghost" size="icon" className="h-6 w-6 hidden lg:flex ml-auto" onClick={onToggle}>
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : ""}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent text-foreground",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="outline" className={cn("w-full", isCollapsed && "px-0")} onClick={onLogout} title={isCollapsed ? "Đăng xuất" : ""}>
          <LogOut className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Đăng xuất"}
        </Button>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
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
      <main className="flex-1 overflow-hidden pt-14 lg:pt-0">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto p-3 lg:p-4 min-h-full">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
