import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Check, X, ChevronLeft, ChevronRight, Filter, Search, FileText, Plus, Save, RotateCcw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { classData, generateCourseDates, generateAttendanceData, AttendanceRecord, mockScores, examTypeLabels, ScoreRecord } from "@/utils/mockData";

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

  // --- State ---
  const [scores, setScores] = useState<ScoreRecord[]>(mockScores);
  const [isInputMode, setIsInputMode] = useState(false);

  // --- Input Mode State ---
  const [inputExam, setInputExam] = useState({
    name: "",
    type: "lesson",
    date: new Date().toISOString().split('T')[0],
    maxScore: 100
  });

  // Stores scores for each student: { studentId: { vocab: 0, grammar: 0, ... } }
  const [inputScores, setInputScores] = useState<Record<string, any>>({});

  // Initialize input scores when toggling mode
  const initInputScores = () => {
    const initial: Record<string, any> = {};
    selectedClass.studentList.forEach(s => {
      initial[s.id] = {};
    });
    setInputScores(initial);
  };

  const handleInputToggle = () => {
    if (!isInputMode) {
      initInputScores();
      setInputExam({ name: "", type: "lesson", date: new Date().toISOString().split('T')[0], maxScore: 100 });
    }
    setIsInputMode(!isInputMode);
  };

  const getInputFields = (type: string) => {
    switch (type) {
      case "lesson":
        return [
          { key: "vocab", label: "Từ vựng" },
          { key: "grammar", label: "Ngữ pháp" },
          { key: "listening", label: "Nghe" },
          { key: "reading", label: "Đọc" },
          { key: "speaking", label: "Nói" }
        ];
      case "summary":
        return [
          { key: "vocab", label: "Từ vựng" },
          { key: "grammar", label: "Ngữ pháp" },
          { key: "listening", label: "Nghe" },
          { key: "reading", label: "Đọc" },
          { key: "speaking", label: "Nói" }
        ];
      case "jlpt":
        return [
          { key: "vocab", label: "Kiến thức ngôn ngữ" }, // Vocab + Grammar
          { key: "reading", label: "Đọc hiểu" },
          { key: "listening", label: "Nghe hiểu" },
        ];
      default:
        return [];
    }
  };

  const handleScoreChange = (studentId: string, field: string, value: string) => {
    setInputScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleSaveDefault = () => {
    if (!inputExam.name) {
      toast.error("Vui lòng nhập tên bài kiểm tra");
      return;
    }

    const newRecords: ScoreRecord[] = selectedClass.studentList.map(student => {
      const sScores = inputScores[student.id] || {};
      const fields = getInputFields(inputExam.type);
      let total = 0;

      // Simple total calculation
      fields.forEach(f => {
        total += (sScores[f.key] || 0);
      });

      // Average for lesson/summary if maxScore is 100, or Sum for JLPT?
      // For this demo, let's assume total score is derived from inputs relative to maxScore.
      // If Lesson: Average of components? Or Sum?
      // Mock data shows score: 85, details: {vocab: 90...}. It seems likely Average.

      let finalScore = 0;
      if (inputExam.type === 'jlpt') {
        finalScore = total; // JLPT is sum
      } else {
        finalScore = Math.round(total / fields.length); // Lesson is average
      }

      return {
        id: Math.random(), // Temp ID
        studentName: student.name,
        studentId: student.id,
        className: selectedClass.id,
        examName: inputExam.name,
        examType: inputExam.type as any,
        score: finalScore,
        maxScore: inputExam.maxScore,
        date: inputExam.date,
        details: sScores
      };
    });

    setScores(prev => [...newRecords, ...prev]);
    setIsInputMode(false);
    toast.success("Đã lưu điểm thành công");
  };

  // --- Grades Tab View Logic ---
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [selectedRanking, setSelectedRanking] = useState("all");
  const [selectedExamName, setSelectedExamName] = useState("all");
  const [viewSearchTerm, setViewSearchTerm] = useState("");

  const getRanking = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 85) return "Giỏi";
    if (percentage >= 70) return "Khá";
    if (percentage >= 50) return "Trung bình";
    return "Chưa đạt";
  };

  const getRankingColor = (ranking: string) => {
    switch (ranking) {
      case "Giỏi": return "bg-green-500 hover:bg-green-600";
      case "Khá": return "bg-blue-500 hover:bg-blue-600";
      case "Trung bình": return "bg-yellow-500 hover:bg-yellow-600";
      case "Chưa đạt": return "bg-destructive hover:bg-destructive/90";
      default: return "bg-primary";
    }
  };

  // Get unique exam names for the current class and selected type
  const uniqueExamNames = Array.from(new Set(scores
    .filter(s => s.className === id && (selectedExamType === 'all' || s.examType === selectedExamType))
    .map(s => s.examName)
  ));

  const filteredScores = scores.filter((record) => {
    const ranking = getRanking(record.score, record.maxScore);

    // Filter by the current class ID
    const matchesClass = record.className === id;
    const matchesType = selectedExamType === "all" || record.examType === selectedExamType;
    const matchesRanking = selectedRanking === "all" || ranking === selectedRanking;
    const matchesName = selectedExamName === "all" || record.examName === selectedExamName;
    const matchesSearch =
      record.studentName.toLowerCase().includes(viewSearchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(viewSearchTerm.toLowerCase());

    return matchesClass && matchesType && matchesRanking && matchesName && matchesSearch;
  });

  const isJLPTOnly = selectedExamType === "jlpt";
  const isLessonOrSummary = selectedExamType === "lesson" || selectedExamType === "summary";

  // --- Attendance Tab Logic ---
  const courseDates = generateCourseDates(selectedClass.startDate, selectedClass.endDate);
  const attendanceData = generateAttendanceData(selectedClass);

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
    <TooltipProvider>
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

          <Tabs defaultValue="attendance" className="space-y-4">
            <TabsList>
              <TabsTrigger value="attendance">Bảng điểm danh</TabsTrigger>
              <TabsTrigger value="grades">Bảng điểm</TabsTrigger>
            </TabsList>

            <TabsContent value="attendance" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="grades" className="space-y-6">
              {!isInputMode ? (
                <>
                  <div className="flex justify-between items-center bg-card p-4 rounded-lg border">
                    <div>
                      <h3 className="text-lg font-medium">Danh sách bảng điểm</h3>
                      <p className="text-sm text-muted-foreground">Quản lý điểm số của lớp học</p>
                    </div>
                    <Button onClick={handleInputToggle}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nhập điểm / Thêm bài kiểm tra
                    </Button>
                  </div>

                  {/* Filters */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Bộ lọc
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Loại bài kiểm tra</label>
                          <Select value={selectedExamType} onValueChange={(val) => {
                            setSelectedExamType(val);
                            setSelectedExamName("all"); // Reset exam name when type changes
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tất cả</SelectItem>
                              <SelectItem value="lesson">Kiểm tra theo bài</SelectItem>
                              <SelectItem value="summary">Kiểm tra tổng</SelectItem>
                              <SelectItem value="jlpt">Thi thử JLPT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Exam Name Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tên bài kiểm tra</label>
                          <Select value={selectedExamName} onValueChange={setSelectedExamName}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn bài kiểm tra" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tất cả</SelectItem>
                              {uniqueExamNames.map((name) => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Xếp loại</label>
                          <Select value={selectedRanking} onValueChange={setSelectedRanking}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn xếp loại" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tất cả</SelectItem>
                              <SelectItem value="Giỏi">Giỏi</SelectItem>
                              <SelectItem value="Khá">Khá</SelectItem>
                              <SelectItem value="Trung bình">Trung bình</SelectItem>
                              <SelectItem value="Chưa đạt">Chưa đạt</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tìm kiếm</label>
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="Mã HV, Tên..."
                              className="pl-8"
                              value={viewSearchTerm}
                              onChange={(e) => setViewSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Table */}
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px] whitespace-nowrap border-r">STT</TableHead>
                              <TableHead className="whitespace-nowrap border-r">Họ tên</TableHead>
                              <TableHead className="w-[200px] whitespace-nowrap border-r">Tên bài thi</TableHead>
                              {(isLessonOrSummary || selectedExamType === 'all') && (
                                <>
                                  <TableHead className="text-center w-[80px] whitespace-nowrap border-r">Từ vựng</TableHead>
                                  <TableHead className="text-center w-[80px] whitespace-nowrap border-r">Ngữ pháp</TableHead>
                                  <TableHead className="text-center w-[80px] whitespace-nowrap border-r">Nghe hiểu</TableHead>
                                  <TableHead className="text-center w-[80px] whitespace-nowrap border-r">Đọc hiểu</TableHead>
                                  <TableHead className="text-center w-[80px] whitespace-nowrap border-r">Nói</TableHead>
                                </>
                              )}
                              {isJLPTOnly && (
                                <>
                                  <TableHead className="text-center w-[100px] whitespace-nowrap border-r">Từ vựng</TableHead>
                                  <TableHead className="text-center w-[100px] whitespace-nowrap border-r">Ngữ pháp</TableHead>
                                  <TableHead className="text-center w-[100px] whitespace-nowrap border-r">Nghe hiểu</TableHead>
                                </>
                              )}
                              <TableHead className="text-center whitespace-nowrap border-r">Tổng điểm</TableHead>
                              <TableHead className="text-center whitespace-nowrap border-r">Xếp loại</TableHead>
                              <TableHead className="text-right whitespace-nowrap">Ngày thi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredScores.length > 0 ? (
                              filteredScores.map((record, index) => {
                                const ranking = getRanking(record.score, record.maxScore);
                                const ScoreCell = ({ score }: { score?: number }) => (
                                  <TableCell className={`text-center font-medium border-r ${score !== undefined && score < 50 ? 'text-destructive font-bold' : ''}`}>
                                    {score !== undefined ? score : '-'}
                                  </TableCell>
                                );

                                return (
                                  <TableRow key={record.id}>
                                    <TableCell className="font-medium whitespace-nowrap border-r">{index + 1}</TableCell>
                                    <TableCell className="font-medium whitespace-nowrap border-r">{record.studentName}</TableCell>
                                    <TableCell className="max-w-[300px] truncate whitespace-nowrap border-r" title={record.examName}>{record.examName}</TableCell>
                                    {(isLessonOrSummary || selectedExamType === 'all') && (
                                      <>
                                        <ScoreCell score={record.details?.vocab} />
                                        <ScoreCell score={record.details?.grammar} />
                                        <ScoreCell score={record.details?.listening} />
                                        <ScoreCell score={record.details?.reading} />
                                        <ScoreCell score={record.details?.speaking} />
                                      </>
                                    )}
                                    {isJLPTOnly && (
                                      <>
                                        <ScoreCell score={record.details?.vocab} />
                                        <ScoreCell score={record.details?.grammar} />
                                        <ScoreCell score={record.details?.listening} />
                                      </>
                                    )}
                                    <TableCell className="text-center font-bold border-r">
                                      {record.score}/{record.maxScore}
                                    </TableCell>
                                    <TableCell className="text-center border-r">
                                      <Badge className={`${getRankingColor(ranking)} whitespace-nowrap`}>
                                        {ranking}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                                      {record.date}
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            ) : (
                              <TableRow>
                                <TableCell colSpan={12} className="text-center h-24 text-muted-foreground">
                                  Không tìm thấy kết quả nào phù hợp
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Input Header */}
                  <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={handleInputToggle}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Quay lại
                    </Button>
                    <Button onClick={handleSaveDefault}>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu bảng điểm
                    </Button>
                  </div>

                  {/* Examp Info Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin bài kiểm tra</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>Tên bài kiểm tra <span className="text-destructive">*</span></Label>
                        <Input
                          placeholder="VD: Bài 16 - Kiểm tra sau bài học"
                          value={inputExam.name}
                          onChange={(e) => setInputExam(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Loại bài kiểm tra</Label>
                        <Select
                          value={inputExam.type}
                          onValueChange={(val) => setInputExam(prev => ({
                            ...prev,
                            type: val,
                            maxScore: val === 'jlpt' ? 180 : 100 // Auto adjust max score
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lesson">Kiểm tra theo bài (Thang 100)</SelectItem>
                            <SelectItem value="summary">Kiểm tra tổng (Thang 100)</SelectItem>
                            <SelectItem value="jlpt">Thi thử JLPT (Thang 180)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Ngày thi</Label>
                        <Input
                          type="date"
                          value={inputExam.date}
                          onChange={(e) => setInputExam(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Student Inputs */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Nhập điểm chi tiết ({selectedClass.name})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">#</TableHead>
                              <TableHead className="w-[200px]">Học viên</TableHead>
                              {getInputFields(inputExam.type).map(field => (
                                <TableHead key={field.key} className="text-center min-w-[100px]">
                                  {field.label}
                                </TableHead>
                              ))}
                              <TableHead className="text-center w-[100px]">Tổng điểm</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedClass.studentList.map((student, idx) => {
                              const sScores = inputScores[student.id] || {};
                              const fields = getInputFields(inputExam.type);
                              let total = 0;
                              fields.forEach(f => {
                                total += (sScores[f.key] || 0);
                              });

                              // Calculate display total based on type
                              let displayTotal = 0;
                              if (inputExam.type === 'jlpt') {
                                displayTotal = total;
                              } else {
                                displayTotal = Math.round(total / fields.length);
                              }

                              return (
                                <TableRow key={student.id}>
                                  <TableCell>{idx + 1}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={student.avatar} />
                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col">
                                        <span className="font-medium text-sm">{student.name}</span>
                                        <span className="text-xs text-muted-foreground">{student.id}</span>
                                      </div>
                                    </div>
                                  </TableCell>
                                  {fields.map(field => (
                                    <TableCell key={field.key} className="p-2">
                                      <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        className="text-center h-9"
                                        placeholder="0"
                                        value={sScores[field.key] || ""}
                                        onChange={(e) => handleScoreChange(student.id, field.key, e.target.value)}
                                      />
                                    </TableCell>
                                  ))}
                                  <TableCell className="text-center font-bold">
                                    <Badge variant={displayTotal >= (inputExam.maxScore * 0.5) ? "outline" : "destructive"}>
                                      {displayTotal}/{inputExam.maxScore}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={handleInputToggle}>Hủy bỏ</Button>
                    <Button onClick={handleSaveDefault}>Lưu bảng điểm</Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </TooltipProvider>
  );
};

export default ClassDetail;
