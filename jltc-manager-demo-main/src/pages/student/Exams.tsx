import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, FileText, Lock, CheckCircle2, PenLine } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
].filter(exam => exam.examType === "jlpt");

const examTypeLabels: Record<string, string> = {
  after_lesson: "Sau mỗi bài",
  after_5_lessons: "Sau 5 bài",
  final: "Cuối khóa",
  jlpt: "Thi thử JLPT",
};

const StudentExams = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredExams = allExams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || exam.examType === typeFilter;
    return matchesSearch && matchesType;
  });

  const availableExams = filteredExams.filter((e) => e.status === "available");
  const completedExams = filteredExams.filter((e) => e.status === "completed");
  const lockedExams = filteredExams.filter((e) => e.status === "locked");

  const ExamCard = ({ exam }: { exam: typeof allExams[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline">{exam.level}</Badge>
              <Badge variant="secondary">{examTypeLabels[exam.examType]}</Badge>
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

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Danh sách đề thi
          </h1>
          <p className="text-muted-foreground mt-1">
            Chọn đề thi để bắt đầu làm bài
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đề thi..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Exam Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">
              Có thể làm ({availableExams.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Đã hoàn thành ({completedExams.length})
            </TabsTrigger>
            <TabsTrigger value="locked">
              Chưa mở ({lockedExams.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4 mt-4">
            {availableExams.length > 0 ? (
              availableExams.map((exam) => <ExamCard key={exam.id} exam={exam} />)
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Không có đề thi nào phù hợp
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedExams.length > 0 ? (
              completedExams.map((exam) => <ExamCard key={exam.id} exam={exam} />)
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Bạn chưa hoàn thành đề thi nào
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-4 mt-4">
            {lockedExams.length > 0 ? (
              lockedExams.map((exam) => <ExamCard key={exam.id} exam={exam} />)
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Không có đề thi nào bị khóa
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentExams;
