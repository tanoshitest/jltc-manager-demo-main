import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Download, Printer, Filter, Search, FileText } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceAggregated from "./AttendanceAggregated";
import InterviewReport from "./InterviewReport";
import StatisticsReport from "./StatisticsReport";
import { mockScores, examTypeLabels } from "@/utils/mockData";

const Reports = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [selectedRanking, setSelectedRanking] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const classes = Array.from(new Set(mockScores.map(s => s.className))).sort();

  // Helper function to calculate ranking
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

  const filteredScores = mockScores.filter((record) => {
    const ranking = getRanking(record.score, record.maxScore);

    const matchesClass = selectedClass === "all" || record.className === selectedClass;
    const matchesType = selectedExamType === "all" || record.examType === selectedExamType;
    const matchesRanking = selectedRanking === "all" || ranking === selectedRanking;
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesClass && matchesType && matchesRanking && matchesSearch;
  });

  const isJLPTOnly = selectedExamType === "jlpt";
  const isLessonOrSummary = selectedExamType === "lesson" || selectedExamType === "summary";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Báo Cáo</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              In báo cáo
            </Button>
          </div>
        </div>

        <Tabs defaultValue="grades" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grades">Bảng điểm</TabsTrigger>
            <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
            <TabsTrigger value="interviews">Phỏng vấn</TabsTrigger>
            <TabsTrigger value="statistics">Thống kê</TabsTrigger>
          </TabsList>
          <TabsContent value="grades" className="space-y-6">

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
                  {/* Class Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lớp học</label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lớp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả lớp</SelectItem>
                        {classes.map(cls => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Exam Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loại bài kiểm tra</label>
                    <Select value={selectedExamType} onValueChange={setSelectedExamType}>
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

                  {/* Ranking Filter */}
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

                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tìm kiếm</label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Mã HV, Tên..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px] whitespace-nowrap border-r">STT</TableHead>

                        <TableHead className="whitespace-nowrap border-r">Họ tên</TableHead>
                        <TableHead className="whitespace-nowrap border-r">Lớp</TableHead>
                        <TableHead className="w-[200px] whitespace-nowrap border-r">Tên bài thi</TableHead>


                        {/* Dynamic Columns based on Exam Type */}
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
                          const isDetailVisible = (isLessonOrSummary && (record.examType === 'lesson' || record.examType === 'summary')) || (isJLPTOnly && record.examType === 'jlpt') || selectedExamType === 'all';

                          // Helper to render score cell with conditional formatting
                          const ScoreCell = ({ score }: { score?: number }) => {
                            if (score === undefined) return <TableCell className="text-center text-muted-foreground border-r">-</TableCell>;
                            return (
                              <TableCell className={`text-center font-medium border-r ${score < 50 ? 'text-destructive font-bold' : ''}`}>
                                {score}
                              </TableCell>
                            );
                          };

                          return (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium whitespace-nowrap border-r">{index + 1}</TableCell>

                              <TableCell className="font-medium whitespace-nowrap border-r">{record.studentName}</TableCell>
                              <TableCell className="whitespace-nowrap border-r">
                                <Badge variant="outline">{record.className}</Badge>
                              </TableCell>
                              <TableCell className="max-w-[300px] truncate whitespace-nowrap border-r" title={record.examName}>{record.examName}</TableCell>


                              {/* Dynamic Cells */}
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

            {/* Summary (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng bài thi</p>
                    <p className="text-2xl font-bold">{filteredScores.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground/20" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Điểm TB</p>
                    <p className="text-2xl font-bold">
                      {filteredScores.length > 0
                        ? (filteredScores.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0) / filteredScores.length).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                  <Badge variant="secondary" className="h-8 w-8 flex items-center justify-center rounded-full">
                    %
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceAggregated />
          </TabsContent>

          <TabsContent value="interviews">
            <InterviewReport />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsReport />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Reports;

