import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  Flag,
  Send,
  AlertTriangle,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Mock exam data - Japanese language exam
const mockExam = {
  id: 1,
  title: "Bài 16 - Kiểm tra sau bài học",
  duration: 30, // minutes
  examType: "after_lesson",
  hasEssay: true,
  questions: [
    {
      id: 1,
      type: "single",
      question: "「わたしの家族」の「家族」の読み方は？",
      options: ["かぞく", "いえぞく", "かそく", "いえそく"],
      correctAnswer: 0,
    },
    {
      id: 2,
      type: "single",
      question: "「お父さん」の正しい読み方は？",
      options: ["おとうさん", "おちちさん", "おとさん", "おちちうさん"],
      correctAnswer: 0,
    },
    {
      id: 3,
      type: "single",
      question: "「母は＿＿＿です」に入る言葉は？（文脈：母は看護師です）",
      options: ["かんごし", "いしゃ", "せんせい", "かいしゃいん"],
      correctAnswer: 0,
    },
    {
      id: 4,
      type: "multiple",
      question: "以下の中で家族を表す言葉をすべて選んでください。",
      options: ["兄", "友達", "妹", "先生", "祖父"],
      correctAnswers: [0, 2, 4],
    },
    {
      id: 5,
      type: "single",
      question: "「私には＿＿＿が二人います」に入る言葉は？",
      options: ["きょうだい", "ともだち", "せんせい", "がくせい"],
      correctAnswer: 0,
    },
    {
      id: 6,
      type: "single",
      question: "「お兄さん」と「兄」の違いは何ですか？",
      options: [
        "「お兄さん」は他人の兄、「兄」は自分の兄",
        "同じ意味",
        "「兄」は他人の兄、「お兄さん」は自分の兄",
        "年齢の違い",
      ],
      correctAnswer: 0,
    },
    {
      id: 7,
      type: "single",
      question: "「妹は学生です」を丁寧語に直すと？",
      options: [
        "妹は学生でございます",
        "妹さんは学生です",
        "妹は学生だ",
        "妹は学生であります",
      ],
      correctAnswer: 0,
    },
    {
      id: 8,
      type: "multiple",
      question: "「います」を使う場合を選んでください。",
      options: ["犬がいます", "本があります", "弟がいます", "机があります", "猫がいます"],
      correctAnswers: [0, 2, 4],
    },
    {
      id: 9,
      type: "single",
      question: "「祖母は＿＿＿歳です」の＿＿＿に入る数字の読み方で正しいのは？（70歳）",
      options: ["ななじゅう", "しちじゅう", "ななじゅっ", "なのじゅう"],
      correctAnswer: 0,
    },
    {
      id: 10,
      type: "essay",
      question: "あなたの家族を紹介してください。（3文以上で書いてください）",
      placeholder: "例: 私の家族は4人です。父と母と妹がいます。父は会社員です...",
    },
  ],
};

type Answer = string | string[] | null;

const ExamTaking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(mockExam.duration * 60);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        if (prev === 300) {
          setShowTimeWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Autosave
  useEffect(() => {
    const saveAnswers = () => {
      localStorage.setItem(`exam-${id}-answers`, JSON.stringify(answers));
      localStorage.setItem(`exam-${id}-flagged`, JSON.stringify([...flaggedQuestions]));
    };
    saveAnswers();
  }, [answers, flaggedQuestions, id]);

  // Load saved answers on mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`exam-${id}-answers`);
    const savedFlagged = localStorage.getItem(`exam-${id}-flagged`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    if (savedFlagged) {
      setFlaggedQuestions(new Set(JSON.parse(savedFlagged)));
    }
  }, [id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAutoSubmit = () => {
    toast({
      title: "Hết giờ!",
      description: "Bài làm của bạn đã được nộp tự động.",
      variant: "destructive",
    });
    submitExam();
  };

  const submitExam = () => {
    localStorage.removeItem(`exam-${id}-answers`);
    localStorage.removeItem(`exam-${id}-flagged`);
    navigate(`/student/result/${id}`);
  };

  const handleAnswer = (questionId: number, answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const answeredCount = Object.keys(answers).filter((k) => {
    const ans = answers[parseInt(k)];
    return ans !== null && ans !== "" && (Array.isArray(ans) ? ans.length > 0 : true);
  }).length;

  const renderQuestion = (question: typeof mockExam.questions[0], index: number) => {
    switch (question.type) {
      case "single":
        return (
          <RadioGroup
            value={answers[question.id]?.toString() || ""}
            onValueChange={(value) => handleAnswer(question.id, parseInt(value).toString())}
            className="space-y-3"
          >
            {question.options?.map((option, optIndex) => (
              <div
                key={optIndex}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border transition-colors",
                  answers[question.id] === optIndex.toString()
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value={optIndex.toString()} id={`q${index}-option-${optIndex}`} />
                <Label htmlFor={`q${index}-option-${optIndex}`} className="flex-1 cursor-pointer text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple":
        const selectedAnswers = (answers[question.id] as string[]) || [];
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">（複数選択可）Có thể chọn nhiều đáp án</p>
            {question.options?.map((option, optIndex) => (
              <div
                key={optIndex}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border transition-colors",
                  selectedAnswers.includes(optIndex.toString())
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Checkbox
                  id={`q${index}-option-${optIndex}`}
                  checked={selectedAnswers.includes(optIndex.toString())}
                  onCheckedChange={(checked) => {
                    const newAnswers = checked
                      ? [...selectedAnswers, optIndex.toString()]
                      : selectedAnswers.filter((a) => a !== optIndex.toString());
                    handleAnswer(question.id, newAnswers);
                  }}
                />
                <Label htmlFor={`q${index}-option-${optIndex}`} className="flex-1 cursor-pointer text-base">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "essay":
        return (
          <div className="space-y-3">
            <Textarea
              placeholder={question.placeholder || "Viết câu trả lời của bạn ở đây..."}
              className="min-h-[200px] text-base"
              value={(answers[question.id] as string) || ""}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Phần tự luận sẽ được giáo viên chấm thủ công.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg">{mockExam.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
              timeLeft <= 300 ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
            )}
          >
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
          <Button onClick={() => setShowSubmitDialog(true)}>
            <Send className="h-4 w-4 mr-2" />
            Nộp bài
          </Button>
        </div>
      </header>

      {/* Main Content - All Questions */}
      <main className="pt-20 pb-8 px-4 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {mockExam.questions.map((question, index) => (
            <Card key={question.id} id={`question-${question.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Câu {index + 1}
                    {question.type === "multiple" && (
                      <Badge variant="secondary">Chọn nhiều đáp án</Badge>
                    )}
                    {question.type === "essay" && (
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        <PenLine className="h-3 w-3 mr-1" />
                        Tự luận
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant={flaggedQuestions.has(question.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFlag(question.id)}
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    {flaggedQuestions.has(question.id) ? "Đã đánh dấu" : "Đánh dấu"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg font-medium">{question.question}</p>
                {renderQuestion(question, index)}
              </CardContent>
            </Card>
          ))}

          {/* Submit Button at Bottom */}
          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={() => setShowSubmitDialog(true)}>
              <Send className="h-5 w-5 mr-2" />
              Nộp bài ({answeredCount}/{mockExam.questions.length} câu đã trả lời)
            </Button>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Bạn đã trả lời {answeredCount}/{mockExam.questions.length} câu hỏi.
              </p>
              {answeredCount < mockExam.questions.length && (
                <p className="text-orange-500">
                  Còn {mockExam.questions.length - answeredCount} câu chưa trả lời!
                </p>
              )}
              {flaggedQuestions.size > 0 && (
                <p className="text-orange-500">
                  Có {flaggedQuestions.size} câu đã đánh dấu để xem lại.
                </p>
              )}
              <p>Bạn có chắc chắn muốn nộp bài?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục làm bài</AlertDialogCancel>
            <AlertDialogAction onClick={submitExam}>Nộp bài</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Warning Dialog */}
      <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo thời gian
            </AlertDialogTitle>
            <AlertDialogDescription>
              Chỉ còn 5 phút để hoàn thành bài thi. Hãy kiểm tra lại các câu trả lời của bạn!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Đã hiểu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamTaking;
