import { ReactNode } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  TrendingUp,
  Trophy,
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

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const handleLogout = () => navigate("/");

  const navItems = [
    { value: "overview", label: "Tổng quan", icon: TrendingUp },
    { value: "grades", label: "Bảng điểm", icon: Trophy },
    { value: "exams", label: "Đề thi", icon: FileText },
  ];

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-muted">
      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 lg:px-8 flex items-center h-16 shadow-sm overflow-hidden">
        <div className="flex items-center gap-6 flex-1 min-w-0">
          {/* 1. Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <GraduationCap className="w-8 h-8 text-primary" />
            <div className="hidden sm:block">
              <h2 className="font-bold text-lg leading-tight uppercase tracking-tight">IKIGAI CENTER</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Student Portal</p>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-border/60 hidden md:block shrink-0" />

          {/* 2. Navigation Tabs */}
          <nav className="hidden md:flex items-center bg-muted/30 p-1 rounded-xl border border-border/40 shrink-0">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleTabChange(item.value)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200",
                  currentTab === item.value
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                )}
              >
                <item.icon className={cn("w-3.5 h-3.5", currentTab === item.value ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="h-8 w-[1px] bg-border/60 hidden lg:block shrink-0" />

          {/* 3. Greeting & 4. Full Progress Message */}
          <div className="hidden lg:flex items-center gap-4 min-w-0 overflow-hidden">
            <h1 className="text-sm font-bold text-foreground whitespace-nowrap shrink-0">
              Xin chào, Nguyễn Văn A! <span className="text-base">👋</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium truncate">
              Tiến bộ học tiếng Nhật của bạn đang rất tốt. Hãy tiếp tục cố gắng!
            </p>
          </div>
        </div>

        {/* Logout (Far Right) */}
        <div className="flex items-center gap-4 shrink-0">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Đăng xuất</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto mt-16">
        <div className="min-h-full">
          <div className="container mx-auto p-4 lg:p-6">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
