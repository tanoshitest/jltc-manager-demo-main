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

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-muted">
      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 lg:px-8 flex items-center justify-between h-16 shadow-sm">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary" />
          <div>
            <h2 className="font-bold text-lg leading-tight">IKIGAI CENTER</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Student Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
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
