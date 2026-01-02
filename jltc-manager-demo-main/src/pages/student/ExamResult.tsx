import { useNavigate, useParams } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  ArrowLeft,
  TrendingUp,
  Users,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Mock result data - Japanese language exam
const mockResult = {
  examId: 1,
  examTitle: "Bài 16 - Kiểm tra sau bài học",
  examType: "after_lesson",
  submittedAt: "2024-12-10 15:30",
  duration: "18:45",
  totalQuestions: 10,
  correctAnswers: 8,
  score: 85,
  maxScore: 100,
  passScore: 70,
  passed: true,
  classAverage: 72,
  rank: 5,
  totalStudents: 25,
  showSolutions: true,
  essayPending: true,
  questions: [
    {
      id: 1,
      question: "「わたしの家族」の「家族」の読み方は？",
      type: "single",
      options: ["かぞく", "いえぞく", "かそく", "いえそく"],
      userAnswer: "0",
      correctAnswer: 0,
      isCorrect: true,
      explanation: "「家族」は「かぞく」と読みます。家（いえ/か）+ 族（ぞく）",
    },
    {
      id: 2,
      question: "「お父さん」の正しい読み方は？",
      type: "single",
      options: ["おとうさん", "おちちさん", "おとさん", "おちちうさん"],
      userAnswer: "0",
      correctAnswer: 0,
      isCorrect: true,
      explanation: "「お父さん」は「おとうさん」と読みます。敬語表現です。",
    },
    {
      id: 3,
      question: "「母は＿＿＿です」に入る言葉は？（文脈：母は看護師です）",
      type: "single",
      options: ["かんごし", "いしゃ", "せんせい", "かいしゃいん"],
      userAnswer: "1",
      correctAnswer: 0,
      isCorrect: false,
      explanation: "看護師（かんごし）= y tá. 医者（いしゃ）= bác sĩ.",
    },
    {
      id: 4,
      question: "以下の中で家族を表す言葉をすべて選んでください。",
      type: "multiple",
      options: ["兄", "友達", "妹", "先生", "祖父"],
      userAnswer: ["0", "2", "4"],
      correctAnswer: [0, 2, 4],
      isCorrect: true,
      explanation: "兄（あに）、妹（いもうと）、祖父（そふ）は家族を表す言葉です。",
    },
    {
      id: 5,
      question: "「私には＿＿＿が二人います」に入る言葉は？",
      type: "single",
      options: ["きょうだい", "ともだち", "せんせい", "がくせい"],
      userAnswer: "0",
      correctAnswer: 0,
      isCorrect: true,
      explanation: "兄弟（きょうだい）= anh chị em.",
    },
    {
      id: 6,
      question: "「お兄さん」と「兄」の違いは何ですか？",
      type: "single",
      options: [
        "「お兄さん」は他人の兄、「兄」は自分の兄",
        "同じ意味",
        "「兄」は他人の兄、「お兄さん」は自分の兄",
        "年齢の違い",
      ],
      userAnswer: "0",
      correctAnswer: 0,
      isCorrect: true,
      explanation: "Khi nói về anh của người khác dùng「お兄さん」, anh của mình dùng「兄」",
    },
    {
      id: 7,
      question: "「妹は学生です」を丁寧語に直すと？",
      type: "single",
      options: [
        "妹は学生でございます",
        "妹さんは学生です",
        "妹は学生だ",
        "妹は学生であります",
      ],
      userAnswer: "0",
      correctAnswer: 0,
      isCorrect: true,
      explanation: "「でございます」là thể lịch sự hơn của「です」",
    },
    {
      id: 8,
      question: "「います」を使う場合を選んでください。",
      type: "multiple",
      options: ["犬がいます", "本があります", "弟がいます", "机があります", "猫がいます"],
      userAnswer: ["0", "2"],
      correctAnswer: [0, 2, 4],
      isCorrect: false,
      explanation: "「います」dùng cho sinh vật (người, động vật). 猫（ねこ）cũng là động vật nên dùng「います」",
    },
    {
      id: 9,
      question: "「祖母は＿＿＿歳です」の＿＿＿に入る数字の読み方で正しいのは？（70歳）",
      type: "single",
      options: ["ななじゅう", "しちじゅう", "ななじゅっ", "なのじゅう"],
      userAnswer: "0",
      correctAnswer: 0,
      isCorrect: true,
      explanation: "70 đọc là「ななじゅう」. Không dùng「しち」vì dễ nhầm với 1（いち）",
    },
    {
      id: 10,
      question: "あなたの家族を紹介してください。（3文以上で書いてください）",
      type: "essay",
      userAnswer: "私の家族は5人です。父と母と兄と妹がいます。父は会社員で、母は主婦です。兄は大学生で、妹は高校生です。私たちは東京に住んでいます。",
      isCorrect: null, // pending review
      teacherNote: "Chờ giáo viên chấm điểm",
    },
  ],
};

const pieData = [
  { name: "正解", value: mockResult.correctAnswers, color: "hsl(var(--primary))" },
  { name: "不正解", value: mockResult.totalQuestions - mockResult.correctAnswers - 1, color: "hsl(var(--destructive))" },
  { name: "Chờ chấm", value: 1, color: "hsl(var(--muted-foreground))" },
];

const categoryScores = [
  { category: "文字・語彙", score: 90 },
  { category: "文法", score: 80 },
  { category: "読解", score: 85 },
  { category: "作文", score: null },
];

const ExamResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDownloadPDF = () => {
    alert("PDF download would be triggered here");
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/student/exams")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách đề thi
        </Button>

        {/* Result Header */}
        <Card className={cn(
          "border-2",
          mockResult.passed ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"
        )}>
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className={cn(
                "p-4 rounded-full",
                mockResult.passed ? "bg-green-500/20" : "bg-red-500/20"
              )}>
                <Trophy className={cn(
                  "h-12 w-12",
                  mockResult.passed ? "text-green-500" : "text-red-500"
                )} />
              </div>
              <div className="text-center lg:text-left flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold">
                  {mockResult.passed ? "Chúc mừng! Bạn đã đạt!" : "Chưa đạt - Cố gắng lần sau!"}
                </h1>
                <p className="text-muted-foreground mt-1">{mockResult.examTitle}</p>
                {mockResult.essayPending && (
                  <Badge variant="outline" className="mt-2 border-orange-500 text-orange-500">
                    <PenLine className="h-3 w-3 mr-1" />
                    Phần tự luận đang chờ chấm
                  </Badge>
                )}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Thời gian: {mockResult.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Nộp lúc: {mockResult.submittedAt}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-5xl lg:text-6xl font-bold text-primary">{mockResult.score}</p>
                <p className="text-muted-foreground">/{mockResult.maxScore} điểm</p>
                <Badge className={cn(
                  "mt-2",
                  mockResult.passed ? "bg-green-500" : "bg-red-500"
                )}>
                  {mockResult.passed ? "ĐẠT" : "CHƯA ĐẠT"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{mockResult.correctAnswers}</p>
                  <p className="text-xs text-muted-foreground">Câu đúng</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{mockResult.totalQuestions - mockResult.correctAnswers - 1}</p>
                  <p className="text-xs text-muted-foreground">Câu sai</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">#{mockResult.rank}</p>
                  <p className="text-xs text-muted-foreground">/{mockResult.totalStudents} học viên</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{mockResult.classAverage}%</p>
                  <p className="text-xs text-muted-foreground">TB lớp</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Phân bố điểm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm">Đúng ({mockResult.correctAnswers})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span className="text-sm">Sai ({mockResult.totalQuestions - mockResult.correctAnswers - 1})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                  <span className="text-sm">Chờ chấm (1)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Điểm theo kỹ năng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryScores.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{cat.category}</span>
                      {cat.score !== null ? (
                        <span className="font-bold">{cat.score}%</span>
                      ) : (
                        <Badge variant="outline" className="text-xs">Chờ chấm</Badge>
                      )}
                    </div>
                    {cat.score !== null && (
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <Button onClick={handleDownloadPDF} size="lg">
            <Download className="h-4 w-4 mr-2" />
            Tải kết quả PDF
          </Button>
        </div>

        {/* Detailed Answers */}
        {mockResult.showSolutions && (
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết đáp án</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockResult.questions.map((q, index) => (
                <div key={q.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                      q.isCorrect === true && "bg-green-500/20",
                      q.isCorrect === false && "bg-red-500/20",
                      q.isCorrect === null && "bg-muted"
                    )}>
                      {q.isCorrect === true && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {q.isCorrect === false && <XCircle className="h-5 w-5 text-red-500" />}
                      {q.isCorrect === null && <PenLine className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Câu {index + 1}</span>
                        {q.type === "essay" && (
                          <Badge variant="outline" className="border-blue-500 text-blue-500 text-xs">
                            Tự luận
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium">{q.question}</p>
                      
                      {q.type === "single" && (
                        <div className="mt-2 space-y-1">
                          {q.options?.map((opt, i) => (
                            <p
                              key={i}
                              className={cn(
                                "text-sm p-2 rounded",
                                i === q.correctAnswer && "bg-green-500/10 text-green-700",
                                q.userAnswer === i.toString() && i !== q.correctAnswer && "bg-red-500/10 text-red-700"
                              )}
                            >
                              {String.fromCharCode(65 + i)}. {opt}
                              {i === q.correctAnswer && " ✓"}
                              {q.userAnswer === i.toString() && i !== q.correctAnswer && " (Bạn chọn)"}
                            </p>
                          ))}
                        </div>
                      )}
                      
                      {q.type === "multiple" && (
                        <div className="mt-2 space-y-1">
                          {q.options?.map((opt, i) => {
                            const isCorrect = (q.correctAnswer as number[]).includes(i);
                            const isUserAnswer = (q.userAnswer as string[])?.includes(i.toString());
                            return (
                              <p
                                key={i}
                                className={cn(
                                  "text-sm p-2 rounded",
                                  isCorrect && "bg-green-500/10 text-green-700",
                                  isUserAnswer && !isCorrect && "bg-red-500/10 text-red-700"
                                )}
                              >
                                {String.fromCharCode(65 + i)}. {opt}
                                {isCorrect && " ✓"}
                                {isUserAnswer && !isCorrect && " (Bạn chọn)"}
                              </p>
                            );
                          })}
                        </div>
                      )}
                      
                      {q.type === "essay" && (
                        <div className="mt-2 space-y-2">
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Bài làm của bạn:</p>
                            <p className="text-sm">{q.userAnswer}</p>
                          </div>
                          {q.teacherNote && (
                            <div className="p-3 bg-orange-500/10 rounded-lg">
                              <p className="text-sm text-orange-600">{q.teacherNote}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {q.explanation && (
                        <div className="mt-3 p-3 bg-blue-500/10 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Giải thích:</strong> {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {index < mockResult.questions.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
};

export default ExamResult;
