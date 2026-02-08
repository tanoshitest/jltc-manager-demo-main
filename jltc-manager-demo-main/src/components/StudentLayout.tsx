import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  History,
  Target,
  LogOut,
  Menu,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface StudentLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
  { icon: FileText, label: "Đề thi", path: "/student/exams" },
  { icon: History, label: "Lịch sử", path: "/student/history" },
  { icon: Target, label: "Mục tiêu", path: "/student/goals" },
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
              <h2 className="font-bold text-lg">IKIGAI CENTER</h2>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          )}
        </div>
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
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("p-4 border-t border-border", isCollapsed && "p-2")}>
        <Button variant="outline" className="w-full" onClick={onLogout}>
          <LogOut className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Đăng xuất"}
        </Button>
      </div>
    </div>
  );
};

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true); // Auto-collapse sidebar by default
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
        <div className="h-full overflow-hidden">
          <div className="container mx-auto p-3 lg:p-4 h-full">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
