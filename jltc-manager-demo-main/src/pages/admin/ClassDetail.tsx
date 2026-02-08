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

import { classData, generateCourseDates, generateAttendanceData, AttendanceRecord } from "@/utils/mockData";

interface StudentGrade {
  scores: Record<string, number>;
  total: number;
  passed: boolean;
  comment: string;
}

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();



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

  const courseDates = generateCourseDates(selectedClass.startDate, selectedClass.endDate);

  const attendanceData = generateAttendanceData(selectedClass);

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

  // Pagination for Attendance
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 7;
  const totalPages = Math.ceil(courseDates.length / ITEMS_PER_PAGE);
  const visibleDates = courseDates.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const getAttendanceIcon = (record: AttendanceRecord) => {
    switch (record.status) {
      case "present":
        return <Check className="h-3 w-3 text-success" />;
      case "absent_excused":
        return <span className="text-warning font-medium text-[10px]">P</span>;
      case "absent_unexcused":
        return <X className="h-3 w-3 text-destructive" />;
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

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
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
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <CardTitle>Bảng điểm danh</CardTitle>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-sm ml-auto sm:ml-0">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-success/20 border border-success/50"></div>
                      Có mặt
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-warning/20 border border-warning/50"></div>
                      Có phép
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-destructive/20 border border-destructive/50"></div>
                      Vắng
                    </span>
                  </div>

                  <div className="flex items-center gap-1 border rounded-md p-1 ml-auto sm:ml-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={page === 0}
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-medium px-2 min-w-[60px] text-center">
                      Tuần {page + 1}/{totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-md max-w-[calc(100vw-40px)] lg:max-w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 top-0 z-30 bg-background min-w-[200px] w-[200px] border-r">
                        Học viên
                      </TableHead>
                      <TableHead className="sticky left-[200px] top-0 z-30 bg-background min-w-[80px] w-[80px] text-center border-r">
                        Số tiết
                      </TableHead>
                      <TableHead className="sticky left-[280px] top-0 z-30 bg-background min-w-[80px] w-[80px] text-center border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        % Có mặt
                      </TableHead>
                      {visibleDates.map((date, idx) => {
                        const today = isToday(date);
                        return (
                          <TableHead key={idx} className={`text-center min-w-[60px] p-2 border-r last:border-r-0 ${today ? 'bg-primary/10' : ''}`}>
                            <div className="flex flex-col items-center justify-center">
                              <span className={`text-[10px] uppercase ${today ? 'font-bold text-primary' : 'font-normal text-muted-foreground'}`}>
                                {date.toLocaleDateString("vi-VN", { weekday: 'short' })}
                              </span>
                              <span className={`text-xs ${today ? 'font-bold text-primary' : 'font-bold'}`}>
                                {date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}
                              </span>
                            </div>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClass.studentList.map((student) => {
                      // Calculate Stats (Total, not just visible)
                      let presentCount = 0;
                      const totalSessions = courseDates.length;
                      courseDates.forEach(date => {
                        const record = attendanceData[student.id]?.[date.toISOString()];
                        if (record?.status === 'present') presentCount++;
                      });
                      const attendancePercent = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

                      return (
                        <TableRow key={student.id} className="hover:bg-muted/50">
                          <TableCell className="sticky left-0 z-20 bg-background py-3 border-r">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border">
                                <AvatarImage src={student.avatar} />
                                <AvatarFallback>{student.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{student.name}</span>
                                <span className="text-xs text-muted-foreground">{student.id}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="sticky left-[200px] z-20 bg-background text-center font-medium border-r">
                            {presentCount}/{totalSessions}
                          </TableCell>
                          <TableCell className="sticky left-[280px] z-20 bg-background text-center border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            <Badge variant={attendancePercent < 80 ? "destructive" : "secondary"}>
                              {attendancePercent}%
                            </Badge>
                          </TableCell>
                          {visibleDates.map((date, idx) => {
                            const record = attendanceData[student.id]?.[date.toISOString()] || { status: "present" as const };
                            const today = isToday(date);
                            return (
                              <TableCell key={idx} className={`text-center p-1 border-r last:border-r-0 ${today ? 'bg-primary/5' : ''}`}>
                                {record.status === "absent_excused" && record.reason ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className={`w-6 h-6 flex items-center justify-center rounded-md mx-auto cursor-help transition-colors ${getAttendanceBg(record)}`}>
                                        {getAttendanceIcon(record)}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Lý do: {record.reason}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <div className={`w-6 h-6 flex items-center justify-center rounded-md mx-auto transition-colors ${getAttendanceBg(record)}`}>
                                    {getAttendanceIcon(record)}
                                  </div>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClassDetail;
