import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, XCircle, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StudentGrade {
  scores: Record<string, number>;
  total: number;
  passed: boolean;
  comment: string;
}

interface AttendanceRecord {
  status: "present" | "absent_excused" | "absent_unexcused";
  reason?: string;
}

const ClassManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Demo data for classes
  const classData = {
    "1": {
      id: "1",
      name: "Lớp N5-01",
      level: "N5",
      room: "Phòng A101",
      studentCount: 25,
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      studentList: [
        { id: "HV001", name: "Nguyễn Văn A", avatar: "" },
        { id: "HV002", name: "Trần Thị B", avatar: "" },
        { id: "HV003", name: "Lê Văn C", avatar: "" },
        { id: "HV004", name: "Phạm Thị D", avatar: "" },
        { id: "HV005", name: "Hoàng Văn E", avatar: "" },
      ]
    },
    "2": {
      id: "2",
      name: "Lớp N4-02",
      level: "N4",
      room: "Phòng B203",
      studentCount: 20,
      startDate: "2024-02-01",
      endDate: "2024-07-31",
      studentList: [
        { id: "HV006", name: "Đặng Văn F", avatar: "" },
        { id: "HV007", name: "Vũ Thị G", avatar: "" },
        { id: "HV008", name: "Bùi Văn H", avatar: "" },
      ]
    },
    "3": {
      id: "3",
      name: "Lớp N3-01",
      level: "N3",
      room: "Phòng C305",
      studentCount: 18,
      startDate: "2024-01-20",
      endDate: "2024-08-15",
      studentList: [
        { id: "HV009", name: "Ngô Văn I", avatar: "" },
        { id: "HV010", name: "Dương Thị K", avatar: "" },
      ]
    }
  };

  const selectedClass = classData[id as keyof typeof classData];

  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Button variant="ghost" onClick={() => navigate("/teacher/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <p className="mt-4">Không tìm thấy lớp học</p>
      </div>
    );
  }

  const [testType, setTestType] = useState<string>("after_lesson");
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(selectedClass.studentList.map(s => [s.id, true]))
  );
  const [grades, setGrades] = useState<Record<string, StudentGrade>>(
    Object.fromEntries(selectedClass.studentList.map(s => [s.id, { scores: {}, total: 0, passed: false, comment: "" }]))
  );

  // Generate dates for attendance table (demo: 3 months with 3 classes per week)
  const generateCourseDates = () => {
    const dates = [];
    const start = new Date(selectedClass.startDate);
    const end = new Date(selectedClass.endDate);
    const current = new Date(start);

    // Generate dates for Mon, Wed, Fri
    while (current <= end) {
      const day = current.getDay();
      if (day === 1 || day === 3 || day === 5) { // Mon, Wed, Fri
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates.slice(0, 36); // Limit to ~12 weeks
  };

  const courseDates = generateCourseDates();
  
  // New attendance data structure with status and reason
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, AttendanceRecord>>>(
    Object.fromEntries(
      selectedClass.studentList.map(student => [
        student.id,
        Object.fromEntries(courseDates.map(date => [date.toISOString(), { status: "present" as const }]))
      ])
    )
  );

  const handleAttendanceChange = (studentId: string, dateStr: string, status: AttendanceRecord["status"], reason?: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [dateStr]: { status, reason }
      }
    }));
  };

  const handleSaveAttendance = () => {
    toast.success("Đã lưu điểm danh thành công!");
  };

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
        return "bg-success/10 hover:bg-success/20";
      case "absent_excused":
        return "bg-warning/10 hover:bg-warning/20";
      case "absent_unexcused":
        return "bg-destructive/10 hover:bg-destructive/20";
    }
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
        if (selectedClass.level === "N4" || selectedClass.level === "N5") {
          return [
            { key: "vocabulary", label: "文字・語彙" },
            { key: "grammar", label: "文法" },
            { key: "reading", label: "読解" },
            { key: "listening", label: "聴解" },
          ];
        } else {
          return [
            { key: "vocabulary", label: "文字・語彙" },
            { key: "grammar", label: "文法" },
            { key: "reading", label: "読解" },
            { key: "listening", label: "聴解" },
          ];
        }
      default:
        return [];
    }
  };

  const calculateResult = (studentId: string, scores: Record<string, number>) => {
    const fields = getGradeFields();
    const values = fields.map(f => scores[f.key] || 0);
    const total = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    const passed = total >= 60;
    
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        scores,
        total,
        passed,
      }
    }));
  };

  const handleScoreChange = (studentId: string, field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const newScores = {
      ...grades[studentId]?.scores,
      [field]: Math.min(100, Math.max(0, numValue))
    };
    calculateResult(studentId, newScores);
  };

  const handleCommentChange = (studentId: string, comment: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        comment
      }
    }));
  };

  const handleSaveGrades = () => {
    toast.success("Đã lưu điểm thành công!");
  };

  const gradeFields = getGradeFields();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/teacher/dashboard")}>
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

        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
            <TabsTrigger value="grades">Nhập điểm</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
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
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={`w-10 h-10 p-0 ${getAttendanceBg(record)}`}
                                    >
                                      {getAttendanceIcon(record)}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-64 p-3" align="center">
                                    <div className="space-y-3">
                                      <p className="text-sm font-medium">Điểm danh - {date.toLocaleDateString("vi-VN")}</p>
                                      <div className="space-y-2">
                                        <Button
                                          variant={record.status === "present" ? "default" : "outline"}
                                          size="sm"
                                          className="w-full justify-start"
                                          onClick={() => handleAttendanceChange(student.id, date.toISOString(), "present")}
                                        >
                                          <Check className="h-4 w-4 mr-2 text-success" />
                                          Có mặt
                                        </Button>
                                        <Button
                                          variant={record.status === "absent_excused" ? "default" : "outline"}
                                          size="sm"
                                          className="w-full justify-start"
                                          onClick={() => handleAttendanceChange(student.id, date.toISOString(), "absent_excused", record.reason)}
                                        >
                                          <span className="mr-2 text-warning font-bold">P</span>
                                          Vắng có phép
                                        </Button>
                                        <Button
                                          variant={record.status === "absent_unexcused" ? "default" : "outline"}
                                          size="sm"
                                          className="w-full justify-start"
                                          onClick={() => handleAttendanceChange(student.id, date.toISOString(), "absent_unexcused")}
                                        >
                                          <X className="h-4 w-4 mr-2 text-destructive" />
                                          Vắng không phép
                                        </Button>
                                      </div>
                                      {record.status === "absent_excused" && (
                                        <div className="space-y-1">
                                          <Label className="text-xs">Lý do vắng</Label>
                                          <Input
                                            placeholder="Nhập lý do..."
                                            value={record.reason || ""}
                                            onChange={(e) => handleAttendanceChange(student.id, date.toISOString(), "absent_excused", e.target.value)}
                                            className="h-8 text-sm"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleSaveAttendance}>Lưu điểm danh</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nhập điểm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="max-w-xs">
                  <Label htmlFor="test-type">Loại kiểm tra</Label>
                  <Select value={testType} onValueChange={setTestType}>
                    <SelectTrigger id="test-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="after_lesson">Kiểm tra sau từng bài</SelectItem>
                      <SelectItem value="after_5_lessons">Kiểm tra sau 5 bài</SelectItem>
                      <SelectItem value="final">Kiểm tra cuối khóa</SelectItem>
                      <SelectItem value="jlpt_mock">Thi thử JLPT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {selectedClass.studentList.map((student) => (
                    <Card key={student.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Student Info */}
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <Avatar>
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>{student.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`attendance-${student.id}`}
                                checked={attendance[student.id]}
                                onCheckedChange={(checked) => {
                                  setAttendance(prev => ({ ...prev, [student.id]: checked as boolean }));
                                }}
                              />
                              <Label htmlFor={`attendance-${student.id}`} className="text-sm">Có mặt</Label>
                            </div>
                          </div>

                          {attendance[student.id] && (
                            <>
                              {/* Score Inputs */}
                              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {gradeFields.map((field) => (
                                  <div key={field.key} className="space-y-1">
                                    <Label className="text-xs">{field.label}</Label>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={100}
                                      placeholder="0-100"
                                      value={grades[student.id]?.scores[field.key] || ""}
                                      onChange={(e) => handleScoreChange(student.id, field.key, e.target.value)}
                                      className="h-9"
                                    />
                                  </div>
                                ))}
                              </div>

                              {/* Result */}
                              <div className="flex items-center gap-3 min-w-[120px]">
                                {grades[student.id]?.total > 0 && (
                                  <div className="flex items-center gap-2">
                                    <div className="text-center">
                                      <p className="text-2xl font-bold">{grades[student.id].total}</p>
                                      <p className="text-xs text-muted-foreground">Điểm TB</p>
                                    </div>
                                    {grades[student.id].passed ? (
                                      <Badge className="bg-success flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        Đậu
                                      </Badge>
                                    ) : (
                                      <Badge variant="destructive" className="flex items-center gap-1">
                                        <XCircle className="h-3 w-3" />
                                        Rớt
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Comment */}
                        {attendance[student.id] && (
                          <div className="mt-3 pt-3 border-t">
                            <Label className="text-xs">Nhận xét</Label>
                            <Textarea
                              placeholder="Nhập nhận xét cho học viên..."
                              value={grades[student.id]?.comment || ""}
                              onChange={(e) => handleCommentChange(student.id, e.target.value)}
                              className="mt-1 min-h-[60px]"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveGrades}>Lưu điểm</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClassManagement;
