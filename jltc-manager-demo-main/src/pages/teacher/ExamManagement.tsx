import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Search,
  Plus,
  Trash2,
  Eye,
  FileText,
  BookOpen,
  GraduationCap,
  Upload,
  FileSpreadsheet,
  PenLine,
  ListChecks,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const examTypes = [
  { value: "after_lesson", label: "Kiểm tra sau bài học", icon: BookOpen },
  { value: "after_5_lessons", label: "Kiểm tra sau 5 bài", icon: FileText },
  { value: "final", label: "Kiểm tra cuối khóa", icon: GraduationCap },
  { value: "jlpt_mock", label: "Thi thử JLPT", icon: GraduationCap },
];

const mockExams = [
  {
    id: 1,
    title: "Bài 16 - Kiểm tra sau bài học",
    type: "after_lesson",
    level: "N5",
    duration: 30,
    questions: 20,
    status: "active",
    createdAt: "2024-12-01",
    assignedClasses: ["N5-A", "N5-B"],
  },
  {
    id: 2,
    title: "Kiểm tra 5 bài (Bài 11-15)",
    type: "after_5_lessons",
    level: "N5",
    duration: 45,
    questions: 35,
    status: "active",
    createdAt: "2024-11-25",
    assignedClasses: ["N5-A"],
  },
  {
    id: 3,
    title: "JLPT N5 - Đề thi thử tháng 12",
    type: "jlpt_mock",
    level: "N5",
    duration: 90,
    questions: 80,
    status: "active",
    createdAt: "2024-12-05",
    assignedClasses: ["N5-A", "N5-B", "N5-C"],
  },
  {
    id: 4,
    title: "Kiểm tra cuối khóa N4",
    type: "final",
    level: "N4",
    duration: 120,
    questions: 100,
    status: "draft",
    createdAt: "2024-12-08",
    assignedClasses: [],
  },
  {
    id: 5,
    title: "Bài 15 - Kiểm tra sau bài học",
    type: "after_lesson",
    level: "N5",
    duration: 30,
    questions: 20,
    status: "inactive",
    createdAt: "2024-11-20",
    assignedClasses: ["N5-A"],
  },
];

const typeLabels: Record<string, string> = {
  after_lesson: "Sau bài học",
  after_5_lessons: "Sau 5 bài",
  final: "Cuối khóa",
  jlpt_mock: "Thi thử JLPT",
};

interface MultipleChoiceQuestion {
  id: number;
  content: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
}

interface EssayQuestion {
  id: number;
  content: string;
  maxScore: number;
  guidelines: string;
}

const TeacherExamManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<typeof mockExams[0] | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "after_lesson",
    duration: 30,
    description: "",
  });
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<MultipleChoiceQuestion[]>([
    { id: 1, content: "", answers: ["", "", "", ""], correctAnswer: 0, explanation: "" }
  ]);
  const [essayQuestions, setEssayQuestions] = useState<EssayQuestion[]>([
    { id: 1, content: "", maxScore: 10, guidelines: "" }
  ]);
  const [questionTab, setQuestionTab] = useState("multiple_choice");

  const filteredExams = mockExams.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || exam.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const activeExams = filteredExams.filter((e) => e.status === "active");
  const draftExams = filteredExams.filter((e) => e.status === "draft");
  const inactiveExams = filteredExams.filter((e) => e.status === "inactive");

  const totalQuestions = multipleChoiceQuestions.length + essayQuestions.length;

  const handleCreateExam = () => {
    if (!formData.title) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên đề thi",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Tạo đề thi thành công",
      description: `Đề thi "${formData.title}" với ${totalQuestions} câu hỏi đã được tạo.`,
    });
    setShowCreateDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "after_lesson",
      duration: 30,
      description: "",
    });
    setMultipleChoiceQuestions([{ id: 1, content: "", answers: ["", "", "", ""], correctAnswer: 0, explanation: "" }]);
    setEssayQuestions([{ id: 1, content: "", maxScore: 10, guidelines: "" }]);
    setQuestionTab("multiple_choice");
  };

  const handleDeleteExam = () => {
    toast({
      title: "Xóa đề thi thành công",
      description: `Đề thi "${selectedExam?.title}" đã bị xóa.`,
      variant: "destructive",
    });
    setShowDeleteDialog(false);
    setSelectedExam(null);
  };

  // Multiple Choice Question handlers
  const addMultipleChoiceQuestion = () => {
    setMultipleChoiceQuestions([
      ...multipleChoiceQuestions,
      { id: multipleChoiceQuestions.length + 1, content: "", answers: ["", "", "", ""], correctAnswer: 0, explanation: "" }
    ]);
  };

  const updateMultipleChoiceQuestion = (index: number, field: keyof MultipleChoiceQuestion, value: any) => {
    const updated = [...multipleChoiceQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setMultipleChoiceQuestions(updated);
  };

  const updateMultipleChoiceAnswer = (questionIndex: number, answerIndex: number, value: string) => {
    const updated = [...multipleChoiceQuestions];
    updated[questionIndex].answers[answerIndex] = value;
    setMultipleChoiceQuestions(updated);
  };

  const removeMultipleChoiceQuestion = (index: number) => {
    if (multipleChoiceQuestions.length > 1) {
      setMultipleChoiceQuestions(multipleChoiceQuestions.filter((_, i) => i !== index));
    }
  };

  // Essay Question handlers
  const addEssayQuestion = () => {
    setEssayQuestions([
      ...essayQuestions,
      { id: essayQuestions.length + 1, content: "", maxScore: 10, guidelines: "" }
    ]);
  };

  const updateEssayQuestion = (index: number, field: keyof EssayQuestion, value: any) => {
    const updated = [...essayQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setEssayQuestions(updated);
  };

  const removeEssayQuestion = (index: number) => {
    if (essayQuestions.length > 1) {
      setEssayQuestions(essayQuestions.filter((_, i) => i !== index));
    }
  };

  const handleImportExcel = () => {
    toast({
      title: "Import Excel",
      description: "Chức năng import đề thi từ Excel sẽ được mở.",
    });
  };

  const ExamRow = ({ exam }: { exam: typeof mockExams[0] }) => (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => navigate(`/teacher/exams/${exam.id}`)}
    >
      <TableCell>
        <div>
          <p className="font-medium">{exam.title}</p>
          <p className="text-xs text-muted-foreground">Tạo: {exam.createdAt}</p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{typeLabels[exam.type]}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{exam.level}</Badge>
      </TableCell>
      <TableCell>{exam.duration} phút</TableCell>
      <TableCell>{exam.questions} câu</TableCell>
      <TableCell>
        <Badge
          variant={
            exam.status === "active"
              ? "default"
              : exam.status === "draft"
              ? "secondary"
              : "outline"
          }
        >
          {exam.status === "active" ? "Đang mở" : exam.status === "draft" ? "Nháp" : "Đã đóng"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="ghost" 
            size="icon" 
            title="Xem chi tiết"
            onClick={() => navigate(`/teacher/exams/${exam.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Quản lý đề thi
            </h1>
            <p className="text-muted-foreground mt-1">
              Tạo và quản lý đề thi tiếng Nhật
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Import Excel
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo đề thi
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {examTypes.map((type) => {
            const count = mockExams.filter((e) => e.type === type.value).length;
            return (
              <Card key={type.value}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <type.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground">{type.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockExams.length}</p>
                  <p className="text-xs text-muted-foreground">Tổng đề thi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm đề thi..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Loại đề thi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="after_lesson">Sau bài học</SelectItem>
                  <SelectItem value="after_5_lessons">Sau 5 bài</SelectItem>
                  <SelectItem value="final">Cuối khóa</SelectItem>
                  <SelectItem value="jlpt_mock">Thi thử JLPT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Exam Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Đang mở ({activeExams.length})</TabsTrigger>
            <TabsTrigger value="draft">Nháp ({draftExams.length})</TabsTrigger>
            <TabsTrigger value="inactive">Đã đóng ({inactiveExams.length})</TabsTrigger>
          </TabsList>

          {["active", "draft", "inactive"].map((status) => (
            <TabsContent key={status} value={status} className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên đề thi</TableHead>
                          <TableHead>Loại</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Thời gian</TableHead>
                          <TableHead>Số câu</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Hành động</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(status === "active"
                          ? activeExams
                          : status === "draft"
                          ? draftExams
                          : inactiveExams
                        ).map((exam) => (
                          <ExamRow key={exam.id} exam={exam} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Create Exam Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Tạo đề thi mới</DialogTitle>
            <DialogDescription>
              Điền thông tin và thêm câu hỏi trắc nghiệm hoặc tự luận cho đề thi
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid gap-6 py-4">
              {/* Basic Info */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Loại đề thi *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại đề thi" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tên đề thi *</Label>
                    <Input
                      id="title"
                      placeholder="VD: Bài 16 - Kiểm tra sau bài học"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Thời gian làm bài (phút) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min={5}
                      max={180}
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, duration: parseInt(e.target.value) }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả nội dung đề thi..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Questions Section with Tabs */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">
                    Câu hỏi ({multipleChoiceQuestions.length} trắc nghiệm, {essayQuestions.length} tự luận)
                  </h4>
                  <Button variant="outline" size="sm" onClick={handleImportExcel}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import từ Excel
                  </Button>
                </div>

                <Tabs value={questionTab} onValueChange={setQuestionTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="multiple_choice" className="gap-2">
                      <ListChecks className="h-4 w-4" />
                      Trắc nghiệm ({multipleChoiceQuestions.length})
                    </TabsTrigger>
                    <TabsTrigger value="essay" className="gap-2">
                      <PenLine className="h-4 w-4" />
                      Tự luận ({essayQuestions.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Multiple Choice Questions Tab */}
                  <TabsContent value="multiple_choice" className="space-y-4 mt-4">
                    {multipleChoiceQuestions.map((question, qIndex) => (
                      <Card key={question.id} className="p-4 bg-muted/30">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <Label className="text-base font-semibold">Câu hỏi {qIndex + 1} *</Label>
                              <Textarea
                                placeholder="Nhập nội dung câu hỏi..."
                                value={question.content}
                                onChange={(e) => updateMultipleChoiceQuestion(qIndex, "content", e.target.value)}
                                className="min-h-[80px]"
                              />
                            </div>
                            {multipleChoiceQuestions.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => removeMultipleChoiceQuestion(qIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label>Đáp án (chọn đáp án đúng)</Label>
                            <RadioGroup
                              value={question.correctAnswer.toString()}
                              onValueChange={(value) => updateMultipleChoiceQuestion(qIndex, "correctAnswer", parseInt(value))}
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {question.answers.map((answer, aIndex) => (
                                  <div key={aIndex} className="flex items-center gap-2 p-2 rounded-lg border bg-background">
                                    <RadioGroupItem value={aIndex.toString()} id={`mc-q${qIndex}-a${aIndex}`} />
                                    <Label htmlFor={`mc-q${qIndex}-a${aIndex}`} className="font-medium text-sm w-6">
                                      {String.fromCharCode(65 + aIndex)}.
                                    </Label>
                                    <Input
                                      placeholder={`Nhập đáp án ${String.fromCharCode(65 + aIndex)}`}
                                      value={answer}
                                      onChange={(e) => updateMultipleChoiceAnswer(qIndex, aIndex, e.target.value)}
                                      className="flex-1 border-0 bg-transparent focus-visible:ring-0"
                                    />
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label>Giải thích đáp án</Label>
                            <Textarea
                              placeholder="Nhập giải thích tại sao đáp án đúng..."
                              value={question.explanation}
                              onChange={(e) => updateMultipleChoiceQuestion(qIndex, "explanation", e.target.value)}
                              className="min-h-[60px]"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button variant="outline" className="w-full" onClick={addMultipleChoiceQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm câu trắc nghiệm thứ {multipleChoiceQuestions.length + 1}
                    </Button>
                  </TabsContent>

                  {/* Essay Questions Tab */}
                  <TabsContent value="essay" className="space-y-4 mt-4">
                    {essayQuestions.map((question, qIndex) => (
                      <Card key={question.id} className="p-4 bg-muted/30">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <Label className="text-base font-semibold">Câu hỏi tự luận {qIndex + 1} *</Label>
                              <Textarea
                                placeholder="Nhập nội dung câu hỏi tự luận..."
                                value={question.content}
                                onChange={(e) => updateEssayQuestion(qIndex, "content", e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                            {essayQuestions.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => removeEssayQuestion(qIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Điểm tối đa</Label>
                              <Input
                                type="number"
                                min={1}
                                max={100}
                                value={question.maxScore}
                                onChange={(e) => updateEssayQuestion(qIndex, "maxScore", parseInt(e.target.value))}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Hướng dẫn chấm điểm</Label>
                            <Textarea
                              placeholder="Nhập hướng dẫn chấm điểm cho giáo viên..."
                              value={question.guidelines}
                              onChange={(e) => updateEssayQuestion(qIndex, "guidelines", e.target.value)}
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button variant="outline" className="w-full" onClick={addEssayQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm câu tự luận thứ {essayQuestions.length + 1}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateExam}>
              Tạo đề thi ({totalQuestions} câu)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa đề thi "{selectedExam?.title}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteExam}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  );
};

export default TeacherExamManagement;
