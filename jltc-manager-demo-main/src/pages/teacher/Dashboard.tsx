import { Clock, Users, GraduationCap } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import TeacherLayout from "@/components/TeacherLayout";

const TeacherDashboard = () => {
  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động giảng dạy</p>
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
