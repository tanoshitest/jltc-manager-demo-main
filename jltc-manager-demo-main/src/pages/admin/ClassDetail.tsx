import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, X, CheckCircle, XCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AttendanceRecord {
  status: "present" | "absent_excused" | "absent_unexcused";
  reason?: string;
}

interface StudentGrade {
  scores: Record<string, number>;
  total: number;
  passed: boolean;
  comment: string;
}

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Demo data for classes
  const classData: Record<string, {
    id: string;
    name: string;
    level: string;
    room: string;
    course: string;
    teacher: string;
    studentCount: number;
    startDate: string;
    endDate: string;
    schedule: string;
    progress: string;
    studentList: Array<{ id: string; name: string; avatar: string }>;
  }> = {
    "N5-01": {
      id: "N5-01",
      name: "Lớp N5-01",
      level: "N5",
      room: "201",
      course: "K46",
      teacher: "Yamada",
      studentCount: 15,
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      schedule: "T2, T4, T6 - Tiết 1",
      progress: "Bài 15/25",
      studentList: [
        { id: "HV001", name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: "HV002", name: "Trần Thị B", avatar: "https://i.pravatar.cc/150?img=2" },
        { id: "HV003", name: "Lê Văn C", avatar: "https://i.pravatar.cc/150?img=3" },
        { id: "HV004", name: "Phạm Thị D", avatar: "https://i.pravatar.cc/150?img=4" },
        { id: "HV005", name: "Hoàng Văn E", avatar: "https://i.pravatar.cc/150?img=5" },
      ]
    },
    "N5-02": {
      id: "N5-02",
      name: "Lớp N5-02",
      level: "N5",
      room: "202",
      course: "K46",
      teacher: "Sato",
      studentCount: 16,
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      schedule: "T2, T4, T6 - Tiết 2",
      progress: "Bài 12/25",
      studentList: [
        { id: "HV006", name: "Đặng Văn F", avatar: "https://i.pravatar.cc/150?img=6" },
        { id: "HV007", name: "Vũ Thị G", avatar: "https://i.pravatar.cc/150?img=7" },
        { id: "HV008", name: "Bùi Văn H", avatar: "https://i.pravatar.cc/150?img=8" },
      ]
    },
    "N4-01": {
      id: "N4-01",
      name: "Lớp N4-01",
      level: "N4",
      room: "203",
      course: "K45",
      teacher: "Watanabe",
      studentCount: 14,
      startDate: "2024-02-01",
      endDate: "2024-07-01",
      schedule: "T3, T5 - Tiết 4",
      progress: "Bài 20/30",
      studentList: [
        { id: "HV009", name: "Ngô Văn I", avatar: "https://i.pravatar.cc/150?img=9" },
        { id: "HV010", name: "Dương Thị K", avatar: "https://i.pravatar.cc/150?img=10" },
      ]
    },
    "N4-02": {
      id: "N4-02",
      name: "Lớp N4-02",
      level: "N4",
      room: "204",
      course: "K45",
      teacher: "Tanaka",
      studentCount: 18,
      startDate: "2024-01-20",
      endDate: "2024-06-20",
      schedule: "T2, T4 - Tiết 3",
      progress: "Bài 18/30",
      studentList: [
        { id: "HV011", name: "Trương Văn K", avatar: "https://i.pravatar.cc/150?img=11" },
        { id: "HV012", name: "Mai Thị L", avatar: "https://i.pravatar.cc/150?img=12" },
      ]
    },
    "N3-01": {
      id: "N3-01",
      name: "Lớp N3-01",
      level: "N3",
      room: "301",
      course: "K44",
      teacher: "Suzuki",
      studentCount: 12,
      startDate: "2024-01-10",
      endDate: "2024-06-10",
      schedule: "T2, T4, T6 - Tiết 6",
      progress: "Bài 18/35",
      studentList: [
        { id: "HV013", name: "Lý Văn M", avatar: "https://i.pravatar.cc/150?img=13" },
        { id: "HV014", name: "Hồ Thị N", avatar: "https://i.pravatar.cc/150?img=14" },
      ]
    },
    "N3-02": {
      id: "N3-02",
      name: "Lớp N3-02",
      level: "N3",
      room: "302",
      course: "K44",
      teacher: "Nakamura",
      studentCount: 13,
      startDate: "2024-02-15",
      endDate: "2024-07-15",
      schedule: "T3, T5 - Tiết 5",
      progress: "Bài 15/35",
      studentList: [
        { id: "HV015", name: "Cao Văn O", avatar: "https://i.pravatar.cc/150?img=15" },
        { id: "HV016", name: "Đinh Thị P", avatar: "https://i.pravatar.cc/150?img=16" },
      ]
    },
    "N2-01": {
      id: "N2-01",
      name: "Lớp N2-01",
      level: "N2",
      room: "401",
      course: "K43",
      teacher: "Ito",
      studentCount: 10,
      startDate: "2024-03-01",
      endDate: "2024-08-01",
      schedule: "T5 - Tiết 6",
      progress: "Bài 10/40",
      studentList: [
        { id: "HV017", name: "Phan Văn Q", avatar: "https://i.pravatar.cc/150?img=17" },
        { id: "HV018", name: "Võ Thị R", avatar: "https://i.pravatar.cc/150?img=18" },
      ]
    },
    "N5-03": {
      id: "N5-03",
      name: "Lớp N5-03",
      level: "N5",
      room: "205",
      course: "K47",
      teacher: "Kobayashi",
      studentCount: 14,
      startDate: "2024-04-01",
      endDate: "2024-09-01",
      schedule: "T7 - Tiết 1,2",
      progress: "Bài 0/25",
      studentList: [
        { id: "HV019", name: "Lương Văn S", avatar: "https://i.pravatar.cc/150?img=19" },
        { id: "HV020", name: "Tạ Thị T", avatar: "https://i.pravatar.cc/150?img=20" },
      ]
    },
    "N4-03": {
      id: "N4-03",
      name: "Lớp N4-03",
      level: "N4",
      room: "206",
      course: "K43",
      teacher: "Sasaki",
      studentCount: 15,
      startDate: "2023-06-01",
      endDate: "2023-12-01",
      schedule: "CN - Tiết 3,4",
      progress: "Bài 30/30",
      studentList: [
        { id: "HV021", name: "Đỗ Văn U", avatar: "https://i.pravatar.cc/150?img=21" },
        { id: "HV022", name: "Ngô Thị V", avatar: "https://i.pravatar.cc/150?img=22" },
      ]
    }
  };

  const selectedClass = classData[id as string];

  if (!selectedClass) {
    return (
      <AdminLayout>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <p className="mt-4">Không tìm thấy lớp học</p>
      </AdminLayout>
    );
  }

  const [testType, setTestType] = useState<string>("after_lesson");

  // Generate dates for attendance table
  const generateCourseDates = () => {
    const dates = [];
    const start = new Date(selectedClass.startDate);
    const end = new Date(selectedClass.endDate);
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day === 1 || day === 3 || day === 5) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates.slice(0, 36);
  };

  const courseDates = generateCourseDates();

  // Demo attendance data
  const generateAttendanceData = (): Record<string, Record<string, AttendanceRecord>> => {
    const data: Record<string, Record<string, AttendanceRecord>> = {};
    selectedClass.studentList.forEach(student => {
      data[student.id] = {};
      courseDates.forEach((date, idx) => {
        const seed = student.id.charCodeAt(student.id.length - 1) + idx;
        let status: AttendanceRecord["status"] = "present";
        let reason: string | undefined;

        if (seed % 10 === 0) {
          status = "absent_unexcused";
        } else if (seed % 8 === 0) {
          status = "absent_excused";
          reason = "Bệnh";
        }

        data[student.id][date.toISOString()] = { status, reason };
      });
    });
    return data;
  };

  const attendanceData = generateAttendanceData();

  // Demo grade data
  const generateGradeData = (): Record<string, StudentGrade> => {
    const data: Record<string, StudentGrade> = {};
    selectedClass.studentList.forEach(student => {
      const scores: Record<string, number> = {};
      const fields = getGradeFields();
      fields.forEach(field => {
        scores[field.key] = Math.floor(Math.random() * 40) + 60;
      });
      const values = Object.values(scores);
      const total = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      data[student.id] = {
        scores,
        total,
        passed: total >= 60,
        comment: total >= 80 ? "Học tốt, tiếp tục phát huy" : total >= 60 ? "Cần cố gắng hơn" : "Cần tập trung học tập"
      };
    });
    return data;
  };

  const getGradeFields = () => {
    switch (testType) {
      case "after_lesson":
        return [
          { key: "vocabulary", label: "Từ vựng" },
          { key: "grammar", label: "Ngữ pháp" },
          { key: "listening", label: "Nghe" },
        ];
      case "after_5_lessons":
        return [
          { key: "vocabulary", label: "Từ vựng" },
          { key: "grammar", label: "Ngữ pháp" },
          { key: "reading", label: "Đọc hiểu" },
          { key: "listening", label: "Nghe" },
        ];
      case "final":
        return [
          { key: "vocabulary", label: "Từ vựng" },
          { key: "grammar", label: "Ngữ pháp" },
          { key: "reading", label: "Đọc hiểu" },
          { key: "listening", label: "Nghe" },
          { key: "speaking", label: "Giao tiếp" },
        ];
      case "jlpt_mock":
        return [
          { key: "vocabulary", label: "文字・語彙" },
          { key: "grammar", label: "文法" },
          { key: "reading", label: "読解" },
          { key: "listening", label: "聴解" },
        ];
      default:
        return [];
    }
  };

  const gradeFields = getGradeFields();
  const grades = generateGradeData();

  const getAttendanceIcon = (record: AttendanceRecord) => {
    switch (record.status) {
      case "present":
        return <Check className="h-4 w-4 text-success" />;
      case "absent_excused":
        return <span className="text-warning font-medium text-xs">P</span>;
      case "absent_unexcused":
        return <X className="h-4 w-4 text-destructive" />;
    }
  };

  const getAttendanceBg = (record: AttendanceRecord) => {
    switch (record.status) {
      case "present":
        return "bg-success/10";
      case "absent_excused":
        return "bg-warning/10";
      case "absent_unexcused":
        return "bg-destructive/10";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{selectedClass.name}</h1>
            <p className="text-muted-foreground">
              {selectedClass.room} • {selectedClass.studentCount} học viên • Cấp độ {selectedClass.level}
            </p>
          </div>
        </div>

        <div className="w-full">

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bảng điểm danh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">Học viên</TableHead>
                        {courseDates.map((date, idx) => (
                          <TableHead key={idx} className="text-center min-w-[100px]">
                            {date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedClass.studentList.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="sticky left-0 bg-background z-10">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatar} />
                                <AvatarFallback>{student.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-muted-foreground">{student.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          {courseDates.map((date, idx) => {
                            const record = attendanceData[student.id]?.[date.toISOString()] || { status: "present" as const };
                            return (
                              <TableCell key={idx} className="text-center p-1">
                                {record.status === "absent_excused" && record.reason ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className={`w-10 h-10 flex items-center justify-center rounded mx-auto cursor-help ${getAttendanceBg(record)}`}>
                                        {getAttendanceIcon(record)}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Lý do: {record.reason}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <div className={`w-10 h-10 flex items-center justify-center rounded mx-auto ${getAttendanceBg(record)}`}>
                                    {getAttendanceIcon(record)}
                                  </div>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    </AdminLayout>
  );
};

export default ClassDetail;
