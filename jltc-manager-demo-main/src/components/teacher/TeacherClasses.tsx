import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Eye } from "lucide-react";

const classesData = [
  {
    id: "N5-01",
    name: "N5-01",
    level: "N5",
    course: "K46",
    students: 18,
    schedule: "T2, T4, T6 - Tiết 1,2",
    room: "P.101",
    progress: "Bài 15/25",
    topStudents: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Trần Thị B", avatar: "https://i.pravatar.cc/150?img=2" },
      { name: "Lê Văn C", avatar: "https://i.pravatar.cc/150?img=3" },
    ],
  },
  {
    id: "N4-02",
    name: "N4-02",
    level: "N4",
    course: "K45",
    students: 15,
    schedule: "T2, T5 - Tiết 4,5",
    room: "P.203",
    progress: "Bài 20/30",
    topStudents: [
      { name: "Phạm Văn D", avatar: "https://i.pravatar.cc/150?img=4" },
      { name: "Hoàng Thị E", avatar: "https://i.pravatar.cc/150?img=5" },
      { name: "Đỗ Văn F", avatar: "https://i.pravatar.cc/150?img=6" },
    ],
  },
  {
    id: "N3-01",
    name: "N3-01",
    level: "N3",
    course: "K44",
    students: 12,
    schedule: "T3, T6 - Tiết 1,3,5,6",
    room: "P.302",
    progress: "Bài 18/35",
    topStudents: [
      { name: "Vũ Văn G", avatar: "https://i.pravatar.cc/150?img=7" },
      { name: "Bùi Thị H", avatar: "https://i.pravatar.cc/150?img=8" },
      { name: "Ngô Văn I", avatar: "https://i.pravatar.cc/150?img=9" },
    ],
  },
];

const TeacherClasses = () => {
  const navigate = useNavigate();

  const handleViewClass = (classId: string) => {
    navigate(`/admin/classes/${classId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Các lớp đang phụ trách
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classesData.map((cls) => (
              <Card key={cls.id} className="border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{cls.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Khóa {cls.course}</p>
                    </div>
                    <Badge className="bg-primary">{cls.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sĩ số</p>
                      <p className="font-medium">{cls.students} học viên</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phòng</p>
                      <p className="font-medium">{cls.room}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Lịch học</p>
                      <p className="font-medium">{cls.schedule}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Tiến độ</p>
                      <Badge variant="outline">{cls.progress}</Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Top học viên</p>
                    <div className="flex -space-x-2">
                      {cls.topStudents.map((student, idx) => (
                        <Avatar key={idx} className="w-8 h-8 border-2 border-background">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleViewClass(cls.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem chi tiết lớp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Class Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê các lớp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/10 rounded text-center">
              <p className="text-3xl font-bold text-primary">3</p>
              <p className="text-sm text-muted-foreground">Tổng số lớp</p>
            </div>
            <div className="p-4 bg-success/10 rounded text-center">
              <p className="text-3xl font-bold text-success">45</p>
              <p className="text-sm text-muted-foreground">Tổng học viên</p>
            </div>
            <div className="p-4 bg-warning/10 rounded text-center">
              <p className="text-3xl font-bold text-warning">92%</p>
              <p className="text-sm text-muted-foreground">Tỉ lệ chuyên cần</p>
            </div>
            <div className="p-4 bg-muted rounded text-center">
              <p className="text-3xl font-bold text-foreground">85%</p>
              <p className="text-sm text-muted-foreground">Tiến độ TB</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherClasses;
