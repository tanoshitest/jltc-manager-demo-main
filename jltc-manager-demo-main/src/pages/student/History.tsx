import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const historyData = [
  {
    id: 1,
    title: "JLPT N5 - Đề thi thử tháng 12",
    date: "2024-12-10",
    score: 85,
    maxScore: 100,
    duration: "45:23",
    status: "passed",
    level: "N5",
    category: "Tổng hợp",
  },
  {
    id: 2,
    title: "Bài 16 - Kiểm tra sau bài học",
    date: "2024-12-05",
    score: 78,
    maxScore: 100,
    duration: "28:15",
    status: "passed",
    level: "N5",
    category: "文字・語彙",
  },
  {
    id: 3,
    title: "Kiểm tra 5 bài (11-15)",
    date: "2024-11-28",
    score: 62,
    maxScore: 100,
    duration: "30:00",
    status: "failed",
    level: "N5",
    category: "文法・読解",
  },
  {
    id: 4,
    title: "JLPT N5 - Đề thi thử tháng 11",
    date: "2024-11-15",
    score: 75,
    maxScore: 100,
    duration: "55:40",
    status: "passed",
    level: "N5",
    category: "Tổng hợp",
  },
  {
    id: 5,
    title: "Bài 15 - Kiểm tra sau bài học",
    date: "2024-11-07",
    score: 70,
    maxScore: 100,
    duration: "25:30",
    status: "passed",
    level: "N5",
    category: "聴解",
  },
  {
    id: 6,
    title: "Bài 14 - Kiểm tra sau bài học",
    date: "2024-10-31",
    score: 68,
    maxScore: 100,
    duration: "29:00",
    status: "failed",
    level: "N5",
    category: "文法",
  },
  {
    id: 7,
    title: "JLPT N5 - Đề thi thử tháng 10",
    date: "2024-10-20",
    score: 72,
    maxScore: 100,
    duration: "50:15",
    status: "passed",
    level: "N5",
    category: "Tổng hợp",
  },
  {
    id: 8,
    title: "Kiểm tra 5 bài (6-10)",
    date: "2024-10-10",
    score: 65,
    maxScore: 100,
    duration: "28:45",
    status: "failed",
    level: "N5",
    category: "読解",
  },
];

const monthlyProgress = [
  { month: "T7", score: 65, exams: 2 },
  { month: "T8", score: 72, exams: 3 },
  { month: "T9", score: 68, exams: 2 },
  { month: "T10", score: 70, exams: 3 },
  { month: "T11", score: 72, exams: 3 },
  { month: "T12", score: 82, exams: 2 },
];

const StudentHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = historyData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth =
      monthFilter === "all" ||
      item.date.startsWith(`2024-${monthFilter.padStart(2, "0")}`);
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesMonth && matchesStatus;
  });

  const totalExams = historyData.length;
  const passedExams = historyData.filter((e) => e.status === "passed").length;
  const averageScore = Math.round(
    historyData.reduce((sum, e) => sum + e.score, 0) / historyData.length
  );
  const passRate = Math.round((passedExams / totalExams) * 100);

  const getTrend = (index: number) => {
    if (index === 0) return null;
    const current = historyData[index].score;
    const previous = historyData[index - 1].score;
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "same";
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Lịch sử làm bài
          </h1>
          <p className="text-muted-foreground mt-1">
            Xem lại tất cả các bài thi đã làm
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{totalExams}</p>
              <p className="text-xs text-muted-foreground">Tổng bài thi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-500">{passedExams}</p>
              <p className="text-xs text-muted-foreground">Đạt</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">{averageScore}%</p>
              <p className="text-xs text-muted-foreground">Điểm TB</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-500">{passRate}%</p>
              <p className="text-xs text-muted-foreground">Tỷ lệ đạt</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tiến bộ theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [
                      name === "score" ? `${value}%` : value,
                      name === "score" ? "Điểm TB" : "Số bài thi",
                    ]}
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

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài thi..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Tháng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tháng</SelectItem>
                  <SelectItem value="12">Tháng 12</SelectItem>
                  <SelectItem value="11">Tháng 11</SelectItem>
                  <SelectItem value="10">Tháng 10</SelectItem>
                  <SelectItem value="9">Tháng 9</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="passed">Đạt</SelectItem>
                  <SelectItem value="failed">Chưa đạt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên bài thi</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead className="hidden lg:table-cell">Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="hidden lg:table-cell">Xu hướng</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => {
                    const trend = getTrend(index);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.level} • {item.category}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <span className="font-bold">{item.score}</span>
                          <span className="text-muted-foreground">/{item.maxScore}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{item.duration}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === "passed" ? "default" : "destructive"}
                          >
                            {item.status === "passed" ? "Đạt" : "Chưa đạt"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {trend === "up" && (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          )}
                          {trend === "down" && (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          {trend === "same" && (
                            <Minus className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/student/result/${item.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentHistory;
