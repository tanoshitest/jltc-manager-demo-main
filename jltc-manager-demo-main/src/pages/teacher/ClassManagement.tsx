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
import { ArrowLeft, CheckCircle, XCircle, Check, X, Search } from "lucide-react";
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

  const selectedClass = id ? classData[id as keyof typeof classData] : null;

  // Mock exams for this class
  const classExams = [
    { id: "EX001", title: "Bài kiểm tra sau bài 16", type: "lesson", date: "2024-03-20" },
    { id: "EX002", title: "Bài kiểm tra sau bài 17", type: "lesson", date: "2024-03-22" },
    { id: "EX003", title: "Bài kiểm tra sau bài 18", type: "lesson", date: "2024-03-23" },
    { id: "EX004", title: "Kiểm tra tổng (11-15)", type: "summary", date: "2024-03-25" },
    { id: "EX005", title: "Thi thử N5 tháng 3", type: "jlpt", date: "2024-03-28" },
  ];

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() =>
    selectedClass ? Object.fromEntries(selectedClass.studentList.map(s => [s.id, true])) : {}
  );
  const [grades, setGrades] = useState<Record<string, StudentGrade>>(() => {
    if (!selectedClass) return {};
    return Object.fromEntries(selectedClass.studentList.map(s => [s.id, { scores: {}, total: 0, passed: false, comment: "" }]));
  });

  // Generate dates for attendance table (demo: 3 months with 3 classes per week)
  const generateCourseDates = () => {
    if (!selectedClass) return [];
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
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, AttendanceRecord>>>(() =>
    selectedClass ? Object.fromEntries(
      selectedClass.studentList.map(student => [
        student.id,
        Object.fromEntries(courseDates.map(date => [date.toISOString(), { status: "present" as const }]))
      ])
    ) : {}
  );

  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Button variant="ghost" onClick={() => navigate("/teacher/classes")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <p className="mt-4">Không tìm thấy lớp học</p>
      </div>
    );
  }

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
    const activeType = categoryFilter === "all" && selectedExamId
      ? classExams.find(e => e.id === selectedExamId)?.type
      : categoryFilter;

    if (activeType === "jlpt") {
      return [
        { key: "vocabulary", label: "Từ vựng" },
        { key: "grammar", label: "Ngữ Pháp" },
        { key: "listening", label: "Nghe" },
      ];
    }

    return [
      { key: "vocabulary", label: "Từ vựng" },
      { key: "grammar", label: "Ngữ pháp" },
      { key: "listening", label: "Nghe" },
      { key: "reading", label: "Đọc" },
      { key: "speaking", label: "Nói" },
    ];
  };

  const calculateResult = (studentId: string, scores: Record<string, number>) => {
    const fields = getGradeFields();
    const values = fields.map(f => scores[f.key] || 0);

    let total = 0;
    let passed = false;

    const activeType = categoryFilter === "all" && selectedExamId
      ? classExams.find(e => e.id === selectedExamId)?.type
      : categoryFilter;

    if (activeType === "jlpt") {
      total = values.reduce((a, b) => a + b, 0);
      passed = total >= 90;
    } else {
      total = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
      passed = total >= 50;
    }

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
    const activeType = categoryFilter === "all" && selectedExamId
      ? classExams.find(e => e.id === selectedExamId)?.type
      : categoryFilter;
    const maxScore = activeType === "jlpt" ? 60 : 100;
    const newScores = {
      ...grades[studentId]?.scores,
      [field]: Math.min(maxScore, Math.max(0, numValue))
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
  const isJLPTMode = categoryFilter === "jlpt" || (selectedExamId && classExams.find(e => e.id === selectedExamId)?.type === "jlpt");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/teacher/classes")}>
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

        <Tabs defaultValue="grades" className="w-full">
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
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Danh sách nhập điểm</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={categoryFilter} onValueChange={(val) => {
                      setCategoryFilter(val);
                      setSelectedExamId(""); // Reset exam when type changes
                    }}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Loại bài kiểm tra" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả bài thi</SelectItem>
                        <SelectItem value="lesson">Kiểm tra bài lẻ</SelectItem>
                        <SelectItem value="summary">Kiểm tra tổng</SelectItem>
                        <SelectItem value="jlpt">Thi thử JLPT</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="min-w-[280px]">
                      <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn bài kiểm tra..." />
                        </SelectTrigger>
                        <SelectContent>
                          {classExams
                            .filter(exam => categoryFilter === "all" || exam.type === categoryFilter)
                            .map(exam => (
                              <SelectItem key={exam.id} value={exam.id}>
                                {exam.title} ({exam.date})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {!selectedExamId ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Vui lòng chọn bài kiểm tra để bắt đầu nhập điểm</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px] text-center border-r">STT</TableHead>
                          <TableHead className="min-w-[200px] border-r">Học viên</TableHead>
                          {gradeFields.map((field) => (
                            <TableHead key={field.key} className="text-center min-w-[100px] border-r">
                              {field.label}
                            </TableHead>
                          ))}
                          <TableHead className="text-center min-w-[120px] border-r">Kết quả</TableHead>
                          {!isJLPTMode && <TableHead className="min-w-[250px]">Nhận xét</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedClass.studentList.map((student, idx) => {
                          const jlptMockScores: Record<string, any> = {
                            "HV001": { vocabulary: 45, grammar: 50, listening: 40 },
                            "HV002": { vocabulary: 55, grammar: 58, listening: 52 },
                            "HV003": { vocabulary: 30, grammar: 25, listening: 20 },
                            "HV004": { vocabulary: 40, grammar: 35, listening: 45 },
                            "HV005": { vocabulary: 15, grammar: 20, listening: 10 },
                          };

                          return (
                            <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="text-center font-medium border-r">{idx + 1}</TableCell>
                              <TableCell className="border-r">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={student.avatar} />
                                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-sm">{student.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{student.id}</p>
                                  </div>
                                </div>
                              </TableCell>
                              {gradeFields.map((field) => {
                                const scoreValue = isJLPTMode && selectedExamId === "EX005"
                                  ? jlptMockScores[student.id]?.[field.key]
                                  : (grades[student.id]?.scores[field.key] || "");

                                return (
                                  <TableCell key={field.key} className={`p-2 border-r ${isJLPTMode ? "bg-muted/30" : "focus-within:bg-primary/5"}`}>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={isJLPTMode ? 60 : 100}
                                      placeholder="0"
                                      value={scoreValue}
                                      onChange={(e) => !isJLPTMode && handleScoreChange(student.id, field.key, e.target.value)}
                                      readOnly={isJLPTMode}
                                      className={`h-9 text-center border-0 focus-visible:ring-1 focus-visible:ring-primary shadow-none bg-transparent ${isJLPTMode ? "cursor-default text-primary font-bold" : ""}`}
                                    />
                                  </TableCell>
                                );
                              })}
                              <TableCell className="text-center border-r">
                                {(() => {
                                  let displayTotal = grades[student.id]?.total;
                                  let displayPassed = grades[student.id]?.passed;

                                  if (isJLPTMode && selectedExamId === "EX005") {
                                    const mock = jlptMockScores[student.id];
                                    const mockTotal = (mock.vocabulary || 0) + (mock.grammar || 0) + (mock.listening || 0);
                                    displayTotal = mockTotal;
                                    displayPassed = mockTotal >= 90;
                                  }

                                  if (displayTotal > 0) {
                                    return (
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg font-black text-primary leading-none">
                                          {displayTotal}
                                          <span className="text-[10px] text-muted-foreground ml-0.5">
                                            /{isJLPTMode ? "180" : "100"}
                                          </span>
                                        </span>
                                        {displayPassed ? (
                                          <Badge className="bg-green-600 hover:bg-green-600 text-[10px] h-5 px-1.5">
                                            ĐẠT
                                          </Badge>
                                        ) : (
                                          <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
                                            KHÔNG ĐẠT
                                          </Badge>
                                        )}
                                      </div>
                                    );
                                  }
                                  return <span className="text-xs text-muted-foreground">-</span>;
                                })()}
                              </TableCell>
                              {!isJLPTMode && (
                                <TableCell className="p-1.5">
                                  <Textarea
                                    placeholder="Nhập đánh giá nội dung này..."
                                    value={grades[student.id]?.comment || ""}
                                    onChange={(e) => handleCommentChange(student.id, e.target.value)}
                                    className="min-h-[60px] text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-primary shadow-none resize-none px-2"
                                  />
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {selectedExamId && !isJLPTMode && (
                  <div className="p-4 border-t bg-muted/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Lưu ý: Điểm sẽ được cập nhật trực tiếp vào hệ thống học bạ.
                    </p>
                    <Button size="lg" className="px-10 shadow-lg font-bold" onClick={handleSaveGrades}>
                      Lưu bảng điểm của lớp
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div >
  );
};

export default ClassManagement;
