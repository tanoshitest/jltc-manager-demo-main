import StudentLayout from "@/components/StudentLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Clock, FileText, Lock, CheckCircle2, PenLine } from "lucide-react";

// Filter to show only JLPT exams
const allExams = [
  {
    id: 1,
    title: "Thi thử JLPT 2024-12-01",
    description: "Đề thi thử JLPT N5 đầy đủ các phần: Kiến thức ngôn ngữ, Đọc hiểu, Nghe hiểu",
    level: "N5",
    duration: 90,
    questions: 80,
    status: "available",
    dueDate: "2024-12-31",
    examType: "jlpt",
    hasEssay: false,
  },
  {
    id: 2,
    title: "Thi thử JLPT 2024-11-25",
    description: "Đề thi thử JLPT N4 đầy đủ các phần",
    level: "N4",
    duration: 105,
    questions: 90,
    status: "available",
    dueDate: "2024-12-30",
    examType: "jlpt",
    hasEssay: false,
  },
  {
    id: 3,
    title: "Thi thử JLPT 2024-12-05",
    description: "Đề thi thử JLPT N3 nâng cao",
    level: "N3",
    duration: 140,
    questions: 100,
    status: "available",
    dueDate: "2024-12-28",
    examType: "jlpt",
    hasEssay: false,
  },
  {
    id: 4,
    title: "Thi thử JLPT 2024-12-08",
    description: "Đề thi thử JLPT N2 chuyên sâu",
    level: "N2",
    duration: 155,
    questions: 105,
    status: "locked",
    dueDate: null,
    examType: "jlpt",
    hasEssay: false,
  },
  {
    id: 5,
    title: "Thi thử JLPT 2024-11-20",
    description: "Đề thi thử JLPT N1 tổng hợp",
    level: "N1",
    duration: 170,
    questions: 110,
    status: "completed",
    dueDate: "2024-11-20",
    score: 160,
    examType: "jlpt",
    hasEssay: false,
  },
  {
    id: 7,
    title: "Thi thử JLPT 2024-12-10",
    description: "Đề thi thử JLPT N5 bổ sung",
    level: "N5",
    duration: 90,
    questions: 80,
    status: "available",
    dueDate: "2024-12-15",
    examType: "jlpt",
    hasEssay: false,
  }
];

const studentExamTypeLabels: Record<string, string> = {
  after_lesson: "Sau mỗi bài",
  after_5_lessons: "Sau 5 bài",
  final: "Cuối khóa",
  jlpt: "Thi thử JLPT",
};

const progressYearData: Record<string, { month: string; score: number }[]> = {
  "2025": [
    { month: "T1", score: 0 },
    { month: "T2", score: 0 },
    { month: "T3", score: 0 },
    { month: "T4", score: 0 },
    { month: "T5", score: 0 },
    { month: "T6", score: 280 },
    { month: "T7", score: 295 },
    { month: "T8", score: 310 },
    { month: "T9", score: 305 },
    { month: "T10", score: 340 },
    { month: "T11", score: 380 },
    { month: "T12", score: 410 },
  ],
  "2026": [
    { month: "T1", score: 425 },
    { month: "T2", score: 440 },
    { month: "T3", score: 0 },
    { month: "T4", score: 0 },
    { month: "T5", score: 0 },
    { month: "T6", score: 0 },
    { month: "T7", score: 0 },
    { month: "T8", score: 0 },
    { month: "T9", score: 0 },
    { month: "T10", score: 0 },
    { month: "T11", score: 0 },
    { month: "T12", score: 0 },
  ]
};

const skillData = [
  { subject: "Từ vựng", A: 88, fullMark: 100 },
  { subject: "Ngữ pháp", A: 75, fullMark: 100 },
  { subject: "Đọc hiểu", A: 82, fullMark: 100 },
  { subject: "Nghe hiểu", A: 70, fullMark: 100 },
  { subject: "Hội thoại", A: 92, fullMark: 100 },
];

const mockGrades = [
  {
    id: 1,
    name: "Bài 15 - Kiểm tra sau bài",
    type: "lesson",
    vocab: 90,
    grammar: 85,
    listening: 80,
    reading: 85,
    speaking: 85,
    total: 85,
    max: 100,
    date: "2026-02-10",
    month: "02"
  },
  {
    id: 2,
    name: "Kiểm tra 5 bài (11-15)",
    type: "summary",
    vocab: 82,
    grammar: 78,
    listening: 75,
    reading: 80,
    speaking: 75,
    total: 78,
    max: 100,
    date: "2026-01-05",
    month: "01"
  },
  {
    id: 3,
    name: "JLPT N5 - Đề thi thử số 1",
    type: "jlpt",
    vocab: 65,
    reading: 60,
    listening: 55,
    total: 125,
    max: 180,
    date: "2025-11-28",
    month: "11"
  },
  {
    id: 4,
    name: "Bài 14 - Kiểm tra sau bài",
    type: "lesson",
    vocab: 85,
    grammar: 80,
    listening: 75,
    reading: 80,
    speaking: 80,
    total: 80,
    max: 100,
    date: "2025-11-15",
    month: "11"
  },
  {
    id: 5,
    name: "Bài 13 - Kiểm tra sau bài",
    type: "lesson",
    vocab: 95,
    grammar: 90,
    listening: 85,
    reading: 90,
    speaking: 90,
    total: 90,
    max: 100,
    date: "2025-10-30",
    month: "10"
  },
];

const examTypeLabels: Record<string, string> = {
  lesson: "Theo bài",
  summary: "Tổng hợp",
  jlpt: "Thi thử JLPT",
};

const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("2026");
  const [examSearchTerm, setExamSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredExams = allExams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(examSearchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(examSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const availableExams = filteredExams.filter((e) => e.status === "available");
  const completedExams = filteredExams.filter((e) => e.status === "completed");

  const ExamCard = ({ exam }: { exam: typeof allExams[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline">{exam.level}</Badge>
              <Badge variant="secondary">{studentExamTypeLabels[exam.examType]}</Badge>
              {exam.hasEssay && (
                <Badge variant="outline" className="border-orange-500 text-orange-500">
                  <PenLine className="h-3 w-3 mr-1" />
                  Có tự luận
                </Badge>
              )}
              {exam.status === "locked" && (
                <Badge variant="destructive">
                  <Lock className="h-3 w-3 mr-1" />
                  Chưa mở
                </Badge>
              )}
              {exam.status === "completed" && (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Đã hoàn thành
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg">{exam.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{exam.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {exam.duration} phút
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {exam.questions} câu
              </span>
              {exam.dueDate && <span>Hạn: {exam.dueDate}</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {exam.status === "completed" && exam.score !== undefined && (
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{exam.score}</p>
                <p className="text-xs text-muted-foreground">điểm</p>
              </div>
            )}
            {exam.status === "available" && (
              <Button onClick={() => navigate(`/student/exam/${exam.id}`)}>
                Làm bài
              </Button>
            )}
            {exam.status === "completed" && (
              <Button
                variant="outline"
                onClick={() => navigate(`/student/result/${exam.id}`)}
              >
                Xem kết quả
              </Button>
            )}
            {exam.status === "locked" && (
              <Button disabled variant="secondary">
                <Lock className="h-4 w-4 mr-2" />
                Chưa mở
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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

  const filteredGrades = mockGrades.filter((grade) => {
    const matchesSearch = grade.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = monthFilter === "all" || grade.month === monthFilter;
    const matchesType = typeFilter === "all" || grade.type === typeFilter;
    return matchesSearch && matchesMonth && matchesType;
  });

  const generalSkillData = (() => {
    const totals = mockGrades.reduce((acc, curr) => ({
      vocab: acc.vocab + (curr.vocab || 0),
      grammar: acc.grammar + (curr.grammar || 0),
      reading: acc.reading + (curr.reading || 0),
      listening: acc.listening + (curr.listening || 0),
      speaking: acc.speaking + (curr.speaking || 0),
    }), { vocab: 0, grammar: 0, reading: 0, listening: 0, speaking: 0 });

    const count = mockGrades.length || 1;
    return [
      { subject: "Từ vựng", A: Math.round(totals.vocab / count), fullMark: 100 },
      { subject: "Ngữ pháp", A: Math.round(totals.grammar / count), fullMark: 100 },
      { subject: "Đọc hiểu", A: Math.round(totals.reading / count), fullMark: 100 },
      { subject: "Nghe hiểu", A: Math.round(totals.listening / count), fullMark: 100 },
      { subject: "Hội thoại", A: Math.round(totals.speaking / count), fullMark: 100 },
    ];
  })();

  const currentSkillData = (() => {
    const gradesForMonth = monthFilter === "all"
      ? mockGrades
      : mockGrades.filter(g => g.month === monthFilter);

    if (gradesForMonth.length === 0) {
      return [
        { subject: "Từ vựng", A: 0, fullMark: 100 },
        { subject: "Ngữ pháp", A: 0, fullMark: 100 },
        { subject: "Đọc hiểu", A: 0, fullMark: 100 },
        { subject: "Nghe hiểu", A: 0, fullMark: 100 },
        { subject: "Hội thoại", A: 0, fullMark: 100 },
      ];
    }

    const totals = gradesForMonth.reduce((acc, curr) => ({
      vocab: acc.vocab + (curr.vocab || 0),
      grammar: acc.grammar + (curr.grammar || 0),
      reading: acc.reading + (curr.reading || 0),
      listening: acc.listening + (curr.listening || 0),
      speaking: acc.speaking + (curr.speaking || 0),
    }), { vocab: 0, grammar: 0, reading: 0, listening: 0, speaking: 0 });

    const count = gradesForMonth.length;
    return [
      { subject: "Từ vựng", A: Math.round(totals.vocab / count), fullMark: 100 },
      { subject: "Ngữ pháp", A: Math.round(totals.grammar / count), fullMark: 100 },
      { subject: "Đọc hiểu", A: Math.round(totals.reading / count), fullMark: 100 },
      { subject: "Nghe hiểu", A: Math.round(totals.listening / count), fullMark: 100 },
      { subject: "Hội thoại", A: Math.round(totals.speaking / count), fullMark: 100 },
    ];
  })();

  return (
    <StudentLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Xin chào, Nguyễn Văn A! 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Tiến bộ học tiếng Nhật của bạn đang rất tốt. Hãy tiếp tục cố gắng!
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid h-12 w-full max-w-[500px] grid-cols-3 mb-8 bg-muted/20 p-1 rounded-xl border">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold h-full transition-all">
              <TrendingUp className="w-4 h-4 mr-2" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="grades" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold h-full transition-all">
              <Trophy className="w-4 h-4 mr-2" />
              Bảng điểm
            </TabsTrigger>
            <TabsTrigger value="exams" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold h-full transition-all">
              <FileText className="w-4 h-4 mr-2" />
              Đề thi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Growth Chart */}
              <Card className="lg:col-span-7 overflow-hidden border-none shadow-sm ring-1 ring-border/50 bg-gradient-to-b from-white to-muted/5">
                <CardHeader className="flex flex-row items-center justify-between pb-8">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Tăng trưởng năng lực
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 text-left">* Tổng điểm trung bình các kỹ năng qua từng tháng</p>
                  </div>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[110px] h-9 text-xs bg-background/50 hover:bg-background transition-colors">
                      <SelectValue placeholder="Năm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">Năm 2025</SelectItem>
                      <SelectItem value="2026">Năm 2026</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={progressYearData[yearFilter]} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                          dy={10}
                        />
                        <YAxis
                          domain={[0, 500]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        />
                        <Tooltip
                          cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            fontSize: '11px'
                          }}
                        />
                        <Bar
                          dataKey="score"
                          fill="hsl(var(--primary))"
                          radius={[6, 6, 0, 0]}
                          className="drop-shadow-sm"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Overall Radar Chart */}
              <Card className="lg:col-span-5 border-none shadow-sm ring-1 ring-border/50 bg-muted/10 p-6 flex flex-col justify-center">
                <div className="text-center mb-6 space-y-1">
                  <h3 className="text-lg font-bold text-foreground">Phân tích kỹ năng trung bình</h3>
                  <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/20 bg-background shadow-xs">
                    Toàn thời gian
                  </Badge>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={generalSkillData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Học viên"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.5}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[11px] text-muted-foreground text-center mt-6 italic bg-background/50 py-2 rounded-lg border border-border/30">
                  * Biểu đồ thể hiện năng lực tổng thể dựa trên tất cả kết quả thi
                </p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="grades" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Filtered Radar Chart */}
              <Card className="lg:col-span-4 p-6 bg-muted/20 border-border/60 shadow-none">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-foreground">Phân tích kỹ năng</h3>
                    <p className="text-[10px] text-muted-foreground italic">Biểu đồ theo bộ lọc</p>
                  </div>
                  <Badge className="text-[10px] font-bold h-5 px-2 bg-primary/10 text-primary border-primary/20">
                    {monthFilter === "all" ? "Trung bình" : `Tháng ${monthFilter}`}
                  </Badge>
                </div>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={currentSkillData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Học viên"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: '10px'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Filters Box */}
              <Card className="lg:col-span-8 p-6 flex flex-col justify-center border-border/60 shadow-none bg-muted/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                    <Filter className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Bộ lọc dữ liệu</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Tìm kiếm bài thi</Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Tên bài thi..."
                          className="pl-8 h-10 text-xs bg-background ring-offset-background transition-all focus-visible:ring-1 focus-visible:ring-primary"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Lọc theo tháng</Label>
                      <Select value={monthFilter} onValueChange={setMonthFilter}>
                        <SelectTrigger className="h-10 text-xs bg-background border-border/60">
                          <SelectValue placeholder="Tháng" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="all">Tất cả tháng</SelectItem>
                          <SelectItem value="02">Tháng 02</SelectItem>
                          <SelectItem value="01">Tháng 01</SelectItem>
                          <SelectItem value="12">Tháng 12</SelectItem>
                          <SelectItem value="11">Tháng 11</SelectItem>
                          <SelectItem value="10">Tháng 10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Phân loại bài thi</Label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="h-10 text-xs bg-background border-border/60">
                          <SelectValue placeholder="Loại bài thi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả loại</SelectItem>
                          <SelectItem value="lesson">Theo bài</SelectItem>
                          <SelectItem value="summary">Tổng hợp</SelectItem>
                          <SelectItem value="jlpt">Thi thử JLPT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Table */}
            <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[50px] text-center border-r font-bold">#</TableHead>
                        <TableHead className="min-w-[200px] border-r font-bold">Tên bài thi</TableHead>
                        <TableHead className="text-center w-[80px] border-r font-bold">Từ vựng</TableHead>
                        <TableHead className="text-center w-[120px] border-r font-bold">Ngữ pháp & Đọc</TableHead>
                        <TableHead className="text-center w-[80px] border-r font-bold">Nghe</TableHead>
                        <TableHead className="text-center w-[80px] border-r font-bold">Đọc</TableHead>
                        <TableHead className="text-center w-[80px] border-r font-bold">Nói</TableHead>
                        <TableHead className="text-center w-[110px] border-r font-bold text-primary">Tổng điểm</TableHead>
                        <TableHead className="text-center w-[120px] border-r font-bold">Xếp loại</TableHead>
                        <TableHead className="text-right w-[120px] font-bold">Ngày thi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGrades.length > 0 ? (
                        (['lesson', 'summary', 'jlpt'] as const).map((type) => {
                          const typeGrades = filteredGrades.filter(g => g.type === type);
                          if (typeGrades.length === 0) return null;

                          const typeLabel = {
                            lesson: "Bài kiểm tra sau mỗi bài ( giảng viên nhập - rada tăng trưởng)",
                            summary: "Bài kiểm tra tổng ( mỗi tháng định kì 1 tới 2 bài )",
                            jlpt: "Thi thử JLPT ( đánh giá trình độ hiện tại học viên )"
                          }[type];

                          return (
                            <React.Fragment key={type}>
                              <TableRow className="bg-muted/40 transition-colors">
                                <TableCell colSpan={10} className="font-extrabold text-primary py-2.5 px-4 text-xs tracking-wide border-b border-primary/10">
                                  {typeLabel}
                                </TableCell>
                              </TableRow>
                              {typeGrades.map((grade, idx) => {
                                const ranking = getRanking(grade.total, grade.max);
                                return (
                                  <TableRow key={grade.id} className="hover:bg-muted/20 transition-all duration-300">
                                    <TableCell className="text-center font-medium border-r bg-muted/5">{idx + 1}</TableCell>
                                    <TableCell className="font-semibold border-r p-4">
                                      <p className="text-sm">{grade.name}</p>
                                    </TableCell>
                                    <TableCell className="text-center border-r font-medium">{grade.vocab || "-"}</TableCell>
                                    <TableCell className="text-center border-r font-medium bg-muted/5">
                                      {grade.type === 'jlpt' ? (grade.grammar + (grade.reading || 0)) : (grade.grammar || "-")}
                                    </TableCell>
                                    <TableCell className="text-center border-r font-medium">{grade.listening || "-"}</TableCell>
                                    <TableCell className="text-center border-r font-medium text-muted-foreground/60">
                                      {grade.type === 'jlpt' ? "-" : (grade.reading || "-")}
                                    </TableCell>
                                    <TableCell className="text-center border-r font-medium text-muted-foreground/60">
                                      {grade.type === 'jlpt' ? "-" : (grade.speaking || "-")}
                                    </TableCell>
                                    <TableCell className="text-center font-bold border-r text-base">
                                      <span className={grade.total / grade.max < 0.5 ? "text-destructive" : "text-primary-foreground bg-primary px-2.5 py-1 rounded-md shadow-sm"}>
                                        {grade.total}/{grade.max}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-center border-r">
                                      <Badge className={`${getRankingColor(ranking)} text-[10px] h-6 px-3 font-bold border-none shadow-sm`}>
                                        {ranking}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground font-bold pr-6">
                                      {grade.date}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={10} className="h-48 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2 opacity-50">
                              <Search className="w-8 h-8" />
                              <p>Không tìm thấy kết quả nào phù hợp với bộ lọc hiện tại</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams" className="space-y-6 animate-in slide-in-from-right-2 duration-500">
            <Card className="shadow-none border-border/60 bg-muted/5">
              <CardContent className="p-4 lg:p-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm đề thi..."
                    className="pl-9 h-11 bg-background focus-visible:ring-primary shadow-none"
                    value={examSearchTerm}
                    onChange={(e) => setExamSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="available" className="w-full">
              <TabsList className="flex w-fit gap-2 bg-transparent p-0 mb-6 border-b border-border w-full justify-start rounded-none h-auto">
                <TabsTrigger
                  value="available"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold pb-3 px-4 transition-all text-muted-foreground data-[state=active]:text-primary"
                >
                  Đề thi ({availableExams.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold pb-3 px-4 transition-all text-muted-foreground data-[state=active]:text-primary"
                >
                  Đã hoàn thành ({completedExams.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-4 outline-none mt-0">
                <div className="grid gap-4">
                  {availableExams.length > 0 ? (
                    availableExams.map((exam) => <ExamCard key={exam.id} exam={exam} />)
                  ) : (
                    <Card className="border-dashed border-2">
                      <CardContent className="p-8 text-center text-muted-foreground">
                        Không có đề thi nào khả dụng
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4 outline-none mt-0">
                <div className="grid gap-4">
                  {completedExams.length > 0 ? (
                    completedExams.map((exam) => <ExamCard key={exam.id} exam={exam} />)
                  ) : (
                    <Card className="border-dashed border-2">
                      <CardContent className="p-8 text-center text-muted-foreground">
                        Chưa có đề thi nào được hoàn thành
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
