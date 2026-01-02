import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, GraduationCap, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeacherLayout from "@/components/TeacherLayout";

const TeacherClasses = () => {
  const navigate = useNavigate();

  const myClasses = [
    { 
      id: "1", 
      name: "Lớp N5-01", 
      level: "N5",
      room: "201", 
      students: 15,
      schedule: "T2, T4, T6 - 08:00-10:00",
    },
    { 
      id: "2", 
      name: "Lớp N4-02", 
      level: "N4",
      room: "202", 
      students: 18,
      schedule: "T3, T5 - 10:30-12:30",
    },
    { 
      id: "3", 
      name: "Lớp N3-01", 
      level: "N3",
      room: "203", 
      students: 12,
      schedule: "T4, T6 - 14:00-16:00",
    },
  ];

  const handleClassClick = (classId: string) => {
    navigate(`/teacher/class/${classId}`);
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý Lớp</h1>
          <p className="text-muted-foreground">Các lớp đang đảm nhận</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Danh sách lớp học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Cấp độ</TableHead>
                    <TableHead>Phòng</TableHead>
                    <TableHead>Lịch học</TableHead>
                    <TableHead>Số học viên</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myClasses.map((classItem) => (
                    <TableRow 
                      key={classItem.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleClassClick(classItem.id)}
                    >
                      <TableCell className="font-semibold">{classItem.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-primary">{classItem.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {classItem.room}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {classItem.schedule}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {classItem.students}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
};

export default TeacherClasses;
