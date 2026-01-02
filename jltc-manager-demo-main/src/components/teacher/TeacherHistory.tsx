import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Calendar, Award, BookOpen, AlertTriangle } from "lucide-react";

const historyData = [
  {
    date: "05/12/2024",
    type: "payment",
    title: "Thanh toán lương tháng 11/2024",
    description: "Đã thanh toán 17,000,000 VNĐ",
    icon: Award,
  },
  {
    date: "01/12/2024",
    type: "schedule",
    title: "Bắt đầu học kỳ mới",
    description: "Phụ trách lớp N5-01, N4-02, N3-01",
    icon: Calendar,
  },
  {
    date: "28/11/2024",
    type: "achievement",
    title: "Đạt đánh giá xuất sắc",
    description: "Được học viên đánh giá 4.9/5 trong tháng 11",
    icon: Award,
  },
  {
    date: "15/11/2024",
    type: "training",
    title: "Hoàn thành khóa đào tạo",
    description: "Khóa đào tạo phương pháp giảng dạy mới",
    icon: BookOpen,
  },
  {
    date: "10/11/2024",
    type: "leave",
    title: "Nghỉ phép",
    description: "Nghỉ phép 1 ngày - Lý do cá nhân",
    icon: AlertTriangle,
  },
  {
    date: "01/11/2024",
    type: "schedule",
    title: "Nhận lớp mới",
    description: "Nhận phụ trách thêm lớp N3-01",
    icon: Calendar,
  },
  {
    date: "05/10/2024",
    type: "payment",
    title: "Thanh toán lương tháng 9/2024",
    description: "Đã thanh toán 14,500,000 VNĐ",
    icon: Award,
  },
];

const typeConfig: Record<string, { color: string; label: string }> = {
  payment: { color: "bg-success", label: "Thanh toán" },
  schedule: { color: "bg-primary", label: "Lịch trình" },
  achievement: { color: "bg-warning", label: "Thành tích" },
  training: { color: "bg-secondary", label: "Đào tạo" },
  leave: { color: "bg-muted", label: "Nghỉ phép" },
};

const TeacherHistory = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Lịch sử hoạt động
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {historyData.map((item, index) => {
                const Icon = item.icon;
                const config = typeConfig[item.type];
                return (
                  <div key={index} className="relative pl-10">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={config.color}>{config.label}</Badge>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê hoạt động</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/10 rounded text-center">
              <p className="text-3xl font-bold text-primary">4</p>
              <p className="text-sm text-muted-foreground">Năm công tác</p>
            </div>
            <div className="p-4 bg-success/10 rounded text-center">
              <p className="text-3xl font-bold text-success">12</p>
              <p className="text-sm text-muted-foreground">Lớp đã dạy</p>
            </div>
            <div className="p-4 bg-warning/10 rounded text-center">
              <p className="text-3xl font-bold text-warning">5</p>
              <p className="text-sm text-muted-foreground">Khóa đào tạo</p>
            </div>
            <div className="p-4 bg-muted rounded text-center">
              <p className="text-3xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Ngày nghỉ phép</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherHistory;
