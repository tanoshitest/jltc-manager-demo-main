import { Clock, Users, GraduationCap, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import TeacherLayout from "@/components/TeacherLayout";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Tổng quan hoạt động giảng dạy</p>
          </div>
          <Button onClick={() => navigate("/teacher/tasks")} className="bg-primary hover:bg-primary/90">
            <ClipboardList className="mr-2 h-4 w-4" />
            Quỳnh sensei
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Lớp hôm nay"
            value={3}
            icon={Users}
            subtitle="Ca sáng, chiều, tối"
            className="bg-card"
          />
          <StatsCard
            title="Tổng học viên"
            value={45}
            icon={GraduationCap}
            subtitle="3 lớp đang dạy"
            className="bg-card"
          />
          <StatsCard
            title="Giờ dạy tháng này"
            value={80}
            icon={Clock}
            subtitle="160 giờ mỗi tháng"
            className="bg-card"
          />
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
