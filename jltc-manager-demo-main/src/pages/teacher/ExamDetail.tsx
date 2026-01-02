import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  FileText,
  Users,
  CheckCircle,
  Plus,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const examTypes = [
  { value: "after_lesson", label: "Kiểm tra sau bài học" },
  { value: "after_5_lessons", label: "Kiểm tra sau 5 bài" },
  { value: "final", label: "Kiểm tra cuối khóa" },
  { value: "jlpt_mock", label: "Thi thử JLPT" },
];

// Mock data - in real app, fetch from database
const mockExamDetail = {
  id: 1,
  title: "Bài 16 - Kiểm tra sau bài học",
  type: "after_lesson",
  level: "N5",
  duration: 30,
  status: "active",
  createdAt: "2024-12-01",
  description: "Đề kiểm tra kiến thức sau bài học 16 về ngữ pháp và từ vựng",
  assignedClasses: ["N5-A", "N5-B"],
  passingScore: 60,
  questions: [
    {
      id: 1,
      content: "「わたし___にほんごをべんきょうしています」の___に入る言葉は何ですか。",
      answers: ["は", "を", "が", "に"],
      correctAnswer: 0,
      explanation: "「は」は主題を示す助詞です。",
    },
    {
      id: 2,
      content: "「きょう、ともだち___あいます」の___に入る言葉は何ですか。",
      answers: ["を", "に", "で", "が"],
      correctAnswer: 1,
      explanation: "「あう」動詞は「に」と一緒に使います。",
    },
    {
      id: 3,
      content: "「すし」の意味は何ですか。",
      answers: ["寿司 - món sushi", "刺身 - sashimi", "天ぷら - tempura", "ラーメン - ramen"],
      correctAnswer: 0,
      explanation: "「すし」= 寿司 là món cơm cuộn có nhân cá sống của Nhật.",
    },
    {
      id: 4,
      content: "「たかい」の反対語は何ですか。",
      answers: ["ひくい", "やすい", "おおきい", "ちいさい"],
      correctAnswer: 1,
      explanation: "「たかい」(đắt) ⟷ 「やすい」(rẻ)。「ひくい」は高さの反対語です。",
    },
    {
      id: 5,
      content: "「がっこうで___をします」の___に入る言葉は何ですか。",
      answers: ["べんきょう", "たべもの", "ねる", "およぐ"],
      correctAnswer: 0,
      explanation: "学校では勉強します。",
    },
  ],
};

const typeLabels: Record<string, string> = {
  after_lesson: "Kiểm tra sau bài học",
  after_5_lessons: "Kiểm tra sau 5 bài",
  final: "Kiểm tra cuối khóa",
  jlpt_mock: "Thi thử JLPT",
};

interface Question {
  id: number;
  content: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
}

const TeacherExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In real app, fetch exam by id
  const exam = mockExamDetail;

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: exam.title,
    type: exam.type,
    duration: exam.duration,
    description: exam.description,
  });
  const [questions, setQuestions] = useState<Question[]>(
    exam.questions.map((q) => ({ ...q }))
  );

  const handleSaveExam = () => {
    if (!formData.title) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên đề thi",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Cập nhật thành công",
      description: `Đề thi "${formData.title}" đã được cập nhật.`,
    });
    setShowEditDialog(false);
  };

  const handleDeleteExam = () => {
    toast({
      title: "Xóa đề thi thành công",
      description: `Đề thi "${exam.title}" đã bị xóa.`,
      variant: "destructive",
    });
    setShowDeleteDialog(false);
    navigate("/teacher/exams");
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, content: "", answers: ["", "", "", ""], correctAnswer: 0, explanation: "" }
    ]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateAnswer = (questionIndex: number, answerIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].answers[answerIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/teacher/exams")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {exam.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{typeLabels[exam.type]}</Badge>
                <Badge variant="secondary">{exam.level}</Badge>
                <Badge
                  variant={exam.status === "active" ? "default" : exam.status === "draft" ? "secondary" : "outline"}
                >
                  {exam.status === "active" ? "Đang mở" : exam.status === "draft" ? "Nháp" : "Đã đóng"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{exam.duration}</p>
                <p className="text-xs text-muted-foreground">Phút</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{exam.questions.length}</p>
                <p className="text-xs text-muted-foreground">Câu hỏi</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{exam.passingScore}%</p>
                <p className="text-xs text-muted-foreground">Điểm đạt</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{exam.assignedClasses.length}</p>
                <p className="text-xs text-muted-foreground">Lớp được gán</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description & Classes */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Mô tả đề thi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {exam.description || "Không có mô tả"}
              </p>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                <p>Ngày tạo: {exam.createdAt}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lớp được gán</CardTitle>
            </CardHeader>
            <CardContent>
              {exam.assignedClasses.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {exam.assignedClasses.map((cls) => (
                    <Badge key={cls} variant="secondary">{cls}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Chưa gán lớp nào</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Danh sách câu hỏi ({exam.questions.length} câu)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {exam.questions.map((question, index) => (
              <Card key={question.id} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{question.content}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-11">
                      {question.answers.map((answer, aIndex) => (
                        <div
                          key={aIndex}
                          className={`flex items-center gap-2 p-2 rounded-lg border ${
                            aIndex === question.correctAnswer
                              ? "bg-green-500/10 border-green-500/50"
                              : "bg-background border-border"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            aIndex === question.correctAnswer
                              ? "bg-green-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {String.fromCharCode(65 + aIndex)}
                          </div>
                          <span className={aIndex === question.correctAnswer ? "text-green-700 dark:text-green-400 font-medium" : ""}>
                            {answer}
                          </span>
                          {aIndex === question.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>

                    {question.explanation && (
                      <div className="ml-11 mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          <span className="font-medium">Giải thích:</span> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Edit Exam Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đề thi</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin và câu hỏi cho đề thi
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
                    <Label htmlFor="edit-title">Tên đề thi *</Label>
                    <Input
                      id="edit-title"
                      placeholder="VD: Bài 16 - Kiểm tra sau bài học"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration">Thời gian làm bài (phút) *</Label>
                    <Input
                      id="edit-duration"
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
                  <Label htmlFor="edit-description">Mô tả</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Mô tả nội dung đề thi..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">Câu hỏi ({questions.length} câu)</h4>
                </div>

                {questions.map((question, qIndex) => (
                  <Card key={question.id} className="p-4 bg-muted/30">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Câu {qIndex + 1}</h5>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestion(qIndex)}
                          disabled={questions.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Nội dung câu hỏi *</Label>
                        <Textarea
                          placeholder="Nhập nội dung câu hỏi..."
                          value={question.content}
                          onChange={(e) => updateQuestion(qIndex, "content", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Đáp án (chọn đáp án đúng)</Label>
                        <RadioGroup
                          value={question.correctAnswer.toString()}
                          onValueChange={(value) => updateQuestion(qIndex, "correctAnswer", parseInt(value))}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.answers.map((answer, aIndex) => (
                              <div key={aIndex} className="flex items-center gap-2">
                                <RadioGroupItem value={aIndex.toString()} id={`q${qIndex}-a${aIndex}`} />
                                <Input
                                  placeholder={`Đáp án ${String.fromCharCode(65 + aIndex)}`}
                                  value={answer}
                                  onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Giải thích đáp án</Label>
                        <Textarea
                          placeholder="Nhập giải thích cho đáp án đúng..."
                          value={question.explanation}
                          onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Button variant="outline" onClick={addQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm câu hỏi
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveExam}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa đề thi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa đề thi "{exam.title}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteExam}>
              Xóa đề thi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  );
};

export default TeacherExamDetail;
