import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Printer,
  ArrowLeft,
} from "lucide-react";
import TeacherBasicInfo from "@/components/teacher/TeacherBasicInfo";
import TeacherSchedule from "@/components/teacher/TeacherSchedule";
import TeacherClasses from "@/components/teacher/TeacherClasses";
import TeacherHistory from "@/components/teacher/TeacherHistory";
import TeacherNotes from "@/components/teacher/TeacherNotes";

const teachers: Record<string, any> = {
  GV001: {
    id: "GV001",
    name: "Yamada Hanako",
    avatar: "https://i.pravatar.cc/150?img=20",
    phone: "0912345678",
    zalo: "0912345678",
    email: "yamada@japanese-center.edu.vn",
    subject: "Tổng hợp",
    level: "N1",
    type: "permanent",
    status: "active",
    joinDate: "2020-01-15",
    totalHours: 1240,
    classes: ["N5-01", "N4-02", "N3-01"],
    rating: 4.8,
    specialization: "Ngữ pháp cơ bản, Kanji",
    education: "Đại học Tokyo - Chuyên ngành Giáo dục Tiếng Nhật",
    experience: "5 năm giảng dạy tại Việt Nam",
    notes: "Giáo viên tận tâm, phương pháp giảng dạy hiệu quả, được học viên yêu mến.",
  },
  GV002: {
    id: "GV002",
    name: "Tanaka Taro",
    avatar: "https://i.pravatar.cc/150?img=21",
    phone: "0912345679",
    zalo: "0912345679",
    email: "tanaka@japanese-center.edu.vn",
    subject: "Kanji",
    level: "N2",
    type: "permanent",
    status: "active",
    joinDate: "2019-03-20",
    totalHours: 1580,
    classes: ["N5-02", "N4-01"],
    rating: 4.7,
    specialization: "Kanji, Chữ Hán",
    education: "Đại học Waseda - Ngôn ngữ học",
    experience: "7 năm kinh nghiệm",
    notes: "Chuyên gia về Kanji, phương pháp ghi nhớ hiệu quả.",
  },
  GV003: {
    id: "GV003",
    name: "Suzuki Yuki",
    avatar: "https://i.pravatar.cc/150?img=22",
    phone: "0912345680",
    zalo: "0912345680",
    email: "suzuki@japanese-center.edu.vn",
    subject: "Hội thoại",
    level: "N1",
    type: "parttime",
    status: "teaching",
    joinDate: "2021-06-10",
    totalHours: 650,
    classes: ["N4-03", "N3-02"],
    rating: 4.9,
    specialization: "Giao tiếp, Hội thoại thực tế",
    education: "Đại học Osaka - Sư phạm",
    experience: "3 năm giảng dạy",
    notes: "Năng động, tạo không khí học tập thoải mái.",
  },
  GV004: {
    id: "GV004",
    name: "Sato Kenji",
    avatar: "https://i.pravatar.cc/150?img=23",
    phone: "0912345681",
    zalo: "0912345681",
    email: "sato@japanese-center.edu.vn",
    subject: "Ngữ pháp",
    level: "N2",
    type: "parttime",
    status: "teaching",
    joinDate: "2022-01-05",
    totalHours: 420,
    classes: ["N5-03"],
    rating: 4.6,
    specialization: "Ngữ pháp N5-N3",
    education: "Đại học Kyoto - Văn học Nhật",
    experience: "2 năm",
    notes: "Giải thích rõ ràng, dễ hiểu.",
  },
  GV005: {
    id: "GV005",
    name: "Watanabe Yui",
    avatar: "https://i.pravatar.cc/150?img=24",
    phone: "0912345682",
    zalo: "0912345682",
    email: "watanabe@japanese-center.edu.vn",
    subject: "Nghe",
    level: "N1",
    type: "permanent",
    status: "active",
    joinDate: "2018-09-12",
    totalHours: 2100,
    classes: ["N3-03", "N2-01", "N2-02"],
    rating: 4.9,
    specialization: "Luyện nghe, Phát âm chuẩn",
    education: "Đại học Keio - Ngôn ngữ học ứng dụng",
    experience: "8 năm",
    notes: "Giáo viên xuất sắc, phương pháp luyện nghe hiệu quả cao.",
  },
  GV006: {
    id: "GV006",
    name: "Ito Mai",
    avatar: "https://i.pravatar.cc/150?img=25",
    phone: "0912345683",
    zalo: "0912345683",
    email: "ito@japanese-center.edu.vn",
    subject: "Đọc",
    level: "N2",
    type: "parttime",
    status: "leave",
    joinDate: "2021-11-20",
    totalHours: 380,
    classes: ["N4-04"],
    rating: 4.5,
    specialization: "Đọc hiểu, Từ vựng",
    education: "Đại học Nagoya - Sư phạm",
    experience: "2 năm",
    notes: "Đang nghỉ phép thai sản.",
  },
};

const statusConfig = {
  active: { label: "Có thể dạy", color: "bg-success" },
  teaching: { label: "Đang dạy", color: "bg-primary" },
  leave: { label: "Nghỉ phép", color: "bg-warning" },
};

const typeConfig = {
  permanent: { label: "Cơ hữu", color: "bg-primary" },
  parttime: { label: "Thỉnh giảng", color: "bg-secondary" },
};

const TeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const teacher = teachers[id as string] || teachers["GV001"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/admin/teachers")} className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={teacher.avatar} alt={teacher.name} />
              <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{teacher.name}</h1>
                <Badge className={typeConfig[teacher.type as keyof typeof typeConfig].color}>
                  {typeConfig[teacher.type as keyof typeof typeConfig].label}
                </Badge>
                <Badge className={statusConfig[teacher.status as keyof typeof statusConfig].color}>
                  {statusConfig[teacher.status as keyof typeof statusConfig].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Mã GV: {teacher.id}</p>
              <p className="text-sm text-muted-foreground">
                Môn: {teacher.subject} | Trình độ: {teacher.level}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/admin/schedule?teacher=${encodeURIComponent(teacher.name)}`)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Xếp lịch
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              In hồ sơ
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="basic">Thông tin</TabsTrigger>
            <TabsTrigger value="schedule">Lịch dạy</TabsTrigger>
            <TabsTrigger value="classes">Lớp học</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
            <TabsTrigger value="notes">Ghi chú</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <TeacherBasicInfo teacher={teacher} />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <TeacherSchedule />
          </TabsContent>

          <TabsContent value="classes" className="mt-6">
            <TeacherClasses />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <TeacherHistory />
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <TeacherNotes />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TeacherDetail;
