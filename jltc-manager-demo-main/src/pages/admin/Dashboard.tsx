import AdminLayout from "@/components/AdminLayout";
import StatsCard from "@/components/StatsCard";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  GraduationCap,
  Trophy,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const nearCompletionStudents = [
  { id: "HV001", name: "Nguyễn Văn A", avatar: "", class: "N4-01", progress: 95, completionDate: "15/12/2024" },
  { id: "HV012", name: "Trần Thị B", avatar: "", class: "N3-02", progress: 92, completionDate: "20/12/2024" },
  { id: "HV023", name: "Lê Văn C", avatar: "", class: "N4-03", progress: 90, completionDate: "22/12/2024" },
  { id: "HV045", name: "Phạm Thị D", avatar: "", class: "N5-01", progress: 93, completionDate: "18/12/2024" },
  { id: "HV067", name: "Hoàng Văn E", avatar: "", class: "N3-01", progress: 91, completionDate: "25/12/2024" },
];

const allStudents = [
  { id: "HV001", name: "Nguyễn Văn A", avatar: "", class: "N4-01", status: "Đang học" },
  { id: "HV002", name: "Trần Thị B", avatar: "", class: "N3-02", status: "Đang học" },
  { id: "HV003", name: "Lê Văn C", avatar: "", class: "N4-03", status: "Đang học" },
  { id: "HV004", name: "Phạm Thị D", avatar: "", class: "N5-01", status: "Đang học" },
  { id: "HV005", name: "Hoàng Văn E", avatar: "", class: "N3-01", status: "Đang học" },
];

const activeStudents = [
  { id: "HV001", name: "Nguyễn Văn A", avatar: "", class: "N4-01", enrollDate: "01/09/2024" },
  { id: "HV002", name: "Trần Thị B", avatar: "", class: "N3-02", enrollDate: "15/09/2024" },
  { id: "HV003", name: "Lê Văn C", avatar: "", class: "N4-03", enrollDate: "20/08/2024" },
];

const holdStudents = [
  { id: "HV010", name: "Nguyễn Thị F", avatar: "", class: "N4-02", holdDate: "01/11/2024", reason: "Việc gia đình" },
  { id: "HV015", name: "Trần Văn G", avatar: "", class: "N3-01", holdDate: "15/10/2024", reason: "Sức khỏe" },
];

const inactiveStudents = [
  { id: "HV020", name: "Lê Thị H", avatar: "", class: "N5-01", exitDate: "01/10/2024", reason: "Bận công việc" },
  { id: "HV025", name: "Phạm Văn I", avatar: "", class: "N4-01", exitDate: "15/09/2024", reason: "Chuyển nơi khác" },
];

const completedStudents = [
  { id: "HV030", name: "Hoàng Thị K", avatar: "", class: "N3-02", completionDate: "01/11/2024", certificate: "N3" },
  { id: "HV035", name: "Nguyễn Văn L", avatar: "", class: "N4-01", completionDate: "15/10/2024", certificate: "N4" },
];

// Mock data for teachers
const allTeachers = [
  { id: "GV001", name: "Nguyễn Thị Hường", avatar: "", type: "parttime", hoursThisMonth: 24 },
  { id: "GV002", name: "Trần Văn Khôi", avatar: "", type: "permanent", hoursThisMonth: 32 },
  { id: "GV003", name: "Lê Thị Linh", avatar: "", type: "parttime", hoursThisMonth: 20 },
  { id: "GV004", name: "Phạm Văn Mẫn", avatar: "", type: "permanent", hoursThisMonth: 28 },
  { id: "GV005", name: "Hoàng Thị Mai", avatar: "", type: "permanent", hoursThisMonth: 36 },
  { id: "GV006", name: "Nguyễn Văn Hùng", avatar: "", type: "permanent", hoursThisMonth: 30 },
  { id: "GV007", name: "Trần Thị Lan", avatar: "", type: "parttime", hoursThisMonth: 18 },
  { id: "GV008", name: "Lê Văn Đức", avatar: "", type: "permanent", hoursThisMonth: 34 },
  { id: "GV009", name: "Phạm Thị Hoa", avatar: "", type: "permanent", hoursThisMonth: 26 },
  { id: "GV010", name: "Hoàng Văn Nam", avatar: "", type: "permanent", hoursThisMonth: 32 },
  { id: "GV011", name: "Nguyễn Thị Yến", avatar: "", type: "parttime", hoursThisMonth: 22 },
  { id: "GV012", name: "Trần Văn Bình", avatar: "", type: "permanent", hoursThisMonth: 30 },
  { id: "GV013", name: "Lê Thị Thu", avatar: "", type: "permanent", hoursThisMonth: 32 },
  { id: "GV014", name: "Phạm Văn Tùng", avatar: "", type: "parttime", hoursThisMonth: 36 },
];

const parttimeTeachers = allTeachers.filter(t => t.type === "parttime");
const permanentTeachers = allTeachers.filter(t => t.type === "permanent");

type StudentDialogType = "all" | "active" | "hold" | "inactive" | "completed" | "nearCompletion" | null;
type TeacherDialogType = "allTeachers" | "parttime" | "permanent" | null;

const Dashboard = () => {
  const [openStudentDialog, setOpenStudentDialog] = useState<StudentDialogType>(null);
  const [openTeacherDialog, setOpenTeacherDialog] = useState<TeacherDialogType>(null);

  const renderStudentList = (students: any[], type: StudentDialogType) => {
    return (
      <div className="space-y-4 mt-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Mã: {student.id}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{student.class}</Badge>
                      {type === "nearCompletion" && (
                        <span className="text-xs text-muted-foreground">
                          Dự kiến: {student.completionDate}
                        </span>
                      )}
                      {type === "active" && (
                        <span className="text-xs text-muted-foreground">
                          Nhập học: {student.enrollDate}
                        </span>
                      )}
                      {type === "hold" && (
                        <span className="text-xs text-muted-foreground">
                          Lý do: {student.reason}
                        </span>
                      )}
                      {type === "inactive" && (
                        <span className="text-xs text-muted-foreground">
                          Lý do: {student.reason}
                        </span>
                      )}
                      {type === "completed" && (
                        <Badge variant="secondary">{student.certificate}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                {type === "nearCompletion" && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Tiến độ</p>
                    <p className="text-2xl font-bold text-success">{student.progress}%</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderTeacherList = (teachers: any[]) => {
    return (
      <div className="space-y-4 mt-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={teacher.avatar} />
                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">Mã: {teacher.id}</p>
                    <Badge variant="outline" className="mt-1">
                      {teacher.type === "parttime" ? "Thỉnh giảng" : "Cơ hữu"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Giờ dạy tháng này</p>
                  <p className="text-2xl font-bold text-primary">{teacher.hoursThisMonth} giờ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const getDialogTitle = (type: StudentDialogType) => {
    switch (type) {
      case "all": return "Tổng số học viên";
      case "active": return "Học viên đang học";
      case "hold": return "Học viên bảo lưu";
      case "inactive": return "Học viên nghỉ học";
      case "completed": return "Học viên hoàn thành";
      case "nearCompletion": return "Học viên sắp hoàn thành";
      default: return "";
    }
  };

  const getDialogStudents = (type: StudentDialogType) => {
    switch (type) {
      case "all": return allStudents;
      case "active": return activeStudents;
      case "hold": return holdStudents;
      case "inactive": return inactiveStudents;
      case "completed": return completedStudents;
      case "nearCompletion": return nearCompletionStudents;
      default: return [];
    }
  };

  const getTeacherDialogTitle = (type: TeacherDialogType) => {
    switch (type) {
      case "allTeachers": return "Tổng số giáo viên";
      case "parttime": return "Giáo viên thỉnh giảng";
      case "permanent": return "Giáo viên cơ hữu";
      default: return "";
    }
  };

  const getTeacherDialogData = (type: TeacherDialogType) => {
    switch (type) {
      case "allTeachers": return allTeachers;
      case "parttime": return parttimeTeachers;
      case "permanent": return permanentTeachers;
      default: return [];
    }
  };

  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Tổng quan hệ thống quản lý trung tâm</p>
          </div>
          <Button onClick={() => navigate("/admin/tasks")} className="bg-primary hover:bg-primary/90">
            <Briefcase className="mr-2 h-4 w-4" />
            Giao việc mới
          </Button>
        </div>

        {/* Student Stats */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold mb-1 text-foreground">Thống kê học viên</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
            <StatsCard
              title="Tổng số học viên"
              value={235}
              icon={Users}
              className="bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenStudentDialog("all")}
            />
            <StatsCard
              title="Đang học"
              value={180}
              icon={UserCheck}
              className="bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenStudentDialog("active")}
            />
            <StatsCard
              title="Bảo lưu"
              value={12}
              icon={Clock}
              className="bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenStudentDialog("hold")}
            />
            <StatsCard
              title="Nghỉ học"
              value={18}
              icon={UserX}
              className="bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenStudentDialog("inactive")}
            />
            <StatsCard
              title="Hoàn thành"
              value={25}
              icon={CheckCircle}
              className="bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenStudentDialog("completed")}
            />
            <StatsCard
              title="Sắp hoàn thành"
              value={nearCompletionStudents.length}
              icon={Trophy}
              className="bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenStudentDialog("nearCompletion")}
            />
          </div>
        </div>

        {/* Teacher Stats */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold mb-1 text-foreground">Thống kê giáo viên</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
            <StatsCard
              title="Tổng giáo viên"
              value={allTeachers.length}
              icon={GraduationCap}
              className="bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenTeacherDialog("allTeachers")}
            />
            <StatsCard
              title="Giáo viên thỉnh giảng"
              value={parttimeTeachers.length}
              icon={UserCheck}
              subtitle={`${parttimeTeachers.reduce((acc, t) => acc + t.hoursThisMonth, 0)} giờ tháng này`}
              className="bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenTeacherDialog("parttime")}
            />
            <StatsCard
              title="Giáo viên cơ hữu"
              value={permanentTeachers.length}
              icon={Users}
              subtitle={`${permanentTeachers.reduce((acc, t) => acc + t.hoursThisMonth, 0)} giờ tháng này`}
              className="bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenTeacherDialog("permanent")}
            />
          </div>
        </div>

        {/* Class Stats */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold mb-1 text-foreground">Thống kê lớp học</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
            <StatsCard
              title="Tổng số lớp"
              value={18}
              icon={GraduationCap}
              className="bg-card"
            />
            <Card className="bg-card">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Phân theo cấp độ</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">N5</span>
                    <Badge variant="secondary">5 lớp</Badge>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">N4</span>
                    <Badge variant="secondary">6 lớp</Badge>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">N3</span>
                    <Badge variant="secondary">4 lớp</Badge>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">N2</span>
                    <Badge variant="secondary">3 lớp</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Phân theo loại học viên</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Thực tập sinh</span>
                    <Badge variant="secondary">7 lớp</Badge>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Kĩ sư</span>
                    <Badge variant="secondary">4 lớp</Badge>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Du học</span>
                    <Badge variant="secondary">5 lớp</Badge>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Tiếng Nhật</span>
                    <Badge variant="secondary">2 lớp</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Student List Dialog */}
        <Dialog open={openStudentDialog !== null} onOpenChange={(open) => !open && setOpenStudentDialog(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{getDialogTitle(openStudentDialog)}</DialogTitle>
            </DialogHeader>
            {openStudentDialog && renderStudentList(getDialogStudents(openStudentDialog), openStudentDialog)}
          </DialogContent>
        </Dialog>

        {/* Teacher List Dialog */}
        <Dialog open={openTeacherDialog !== null} onOpenChange={(open) => !open && setOpenTeacherDialog(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{getTeacherDialogTitle(openTeacherDialog)}</DialogTitle>
            </DialogHeader>
            {openTeacherDialog && renderTeacherList(getTeacherDialogData(openTeacherDialog))}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
