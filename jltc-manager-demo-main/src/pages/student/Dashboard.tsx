import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const progressData = [
  { month: "T7", score: 65 },
  { month: "T8", score: 72 },
  { month: "T9", score: 68 },
  { month: "T10", score: 78 },
  { month: "T11", score: 82 },
  { month: "T12", score: 85 },
];

const recentExams = [
  {
    id: 1,
    title: "Bài 15 - Kiểm tra sau bài",
    score: 85,
    maxScore: 100,
    date: "2024-12-10",
    status: "passed",
  },
  {
    id: 2,
    title: "Kiểm tra 5 bài (11-15)",
    score: 78,
    maxScore: 100,
    date: "2024-12-05",
    status: "passed",
  },
  {
    id: 3,
    title: "JLPT N5 - Đề thi thử",
    score: 62,
    maxScore: 100,
    date: "2024-11-28",
    status: "failed",
  },
];

const upcomingExams = [
  {
    id: 4,
    title: "Bài 16 - Kiểm tra sau bài",
    date: "2024-12-20",
    duration: 30,
    level: "N5",
  },
  {
    id: 5,
    title: "JLPT N5 - Đề thi thử tháng 12",
    date: "2024-12-25",
    duration: 90,
    level: "N5",
  },
];

const subjectScores = [
  { subject: "Từ vựng", score: 88 },
  { subject: "Ngữ pháp", score: 75 },
  { subject: "Đọc hiểu", score: 82 },
  { subject: "Nghe hiểu", score: 70 },
];

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Xin chào, Nguyễn Văn A! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Tiến bộ học tiếng Nhật của bạn đang rất tốt. Hãy tiếp tục cố gắng!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Bài đã làm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Trophy className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-xs text-muted-foreground">Điểm TB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">JLPT N5</p>
                  <p className="text-xs text-muted-foreground">Mục tiêu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">+20%</p>
                  <p className="text-xs text-muted-foreground">Tiến bộ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Target Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Mục tiêu: Đạt JLPT N5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tiến độ hoàn thành</span>
                <span className="font-medium">75%</span>
              </div>
              <Progress value={75} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Cần đạt 80% để hoàn thành mục tiêu. Còn 5% nữa!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tiến bộ theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subject Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Điểm theo kỹ năng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectScores} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" domain={[0, 100]} className="text-xs" />
                    <YAxis dataKey="subject" type="category" width={80} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Exams */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Bài thi gần đây</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/history")}>
                Xem tất cả
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        className={`h-5 w-5 ${
                          exam.status === "passed" ? "text-green-500" : "text-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">{exam.title}</p>
                        <p className="text-xs text-muted-foreground">{exam.date}</p>
                      </div>
                    </div>
                    <Badge
                      variant={exam.status === "passed" ? "default" : "destructive"}
                    >
                      {exam.score}/{exam.maxScore}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Bài thi sắp tới</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/exams")}>
                Xem tất cả
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{exam.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {exam.date} • {exam.duration} phút
                        </p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/student/exam/${exam.id}`)}>
                      Làm bài
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
