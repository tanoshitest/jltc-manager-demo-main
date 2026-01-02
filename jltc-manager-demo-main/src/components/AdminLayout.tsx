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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: BarChart3, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Học viên", path: "/admin/students" },
  { icon: UserCog, label: "Giáo viên", path: "/admin/teachers" },
  { icon: Calendar, label: "Xếp lịch dạy", path: "/admin/schedule" },
  { icon: BookOpen, label: "Quản lý lớp", path: "/admin/classes" },
  { icon: GraduationCap, label: "Quản lý đề thi", path: "/admin/exams" },
  { icon: BarChart3, label: "Báo cáo", path: "/admin/reports" },
  { icon: Settings, label: "Cài đặt hệ thống", path: "/admin/settings" },
];

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" />
          <div>
            <h2 className="font-bold text-lg">IKIGAI CENTER</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  return (
    <div className="flex h-screen overflow-hidden bg-muted">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-full">
        <Sidebar onLogout={handleLogout} />
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
          <div className="container mx-auto p-3 lg:p-4">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
