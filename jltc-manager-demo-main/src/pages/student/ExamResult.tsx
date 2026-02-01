import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import StudentLayout from "@/components/StudentLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import JLPTQuestionView, { JLPTMondai } from "@/components/student/exam/JLPTQuestionView";
import { jlptVocabData, jlptGrammarData, jlptListeningData } from "./ExamTaking";
import { evaluateJLPTTest } from "@/utils/evaluationLogic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ExamResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [answersSec1, setAnswersSec1] = useState<Record<number, any>>({});
  const [answersSec2, setAnswersSec2] = useState<Record<number, any>>({});
  const [answersSec3, setAnswersSec3] = useState<Record<number, any>>({});

  useEffect(() => {
    const savedSec1 = localStorage.getItem(`exam-${id}-answers-sec1`);
    const savedSec2 = localStorage.getItem(`exam-${id}-answers-sec2`);
    const savedSec3 = localStorage.getItem(`exam-${id}-answers-sec3`);

    if (savedSec1) setAnswersSec1(JSON.parse(savedSec1));
    if (savedSec2) setAnswersSec2(JSON.parse(savedSec2));
    if (savedSec3) setAnswersSec3(JSON.parse(savedSec3));
  }, [id]);

  const handleExit = () => {
    navigate("/student/exams");
  };

  // Calculate Scores
  const calculateSectionScore = (data: JLPTMondai[], answers: Record<number, any>) => {
    let total = 0;
    let correct = 0;
    data.forEach(mondai => {
      mondai.questions.forEach(q => {
        total++;
        if (answers[q.id] && answers[q.id].toString() === q.correctAnswer?.toString()) {
          correct++;
        }
      });
    });
    // Scale: For N5, specific weights apply, but preserving current mock scaling (60 per section) for now
    // as we don't have individual question weights.
    return { total, correct, score: Math.round((correct / total) * 60) || 0 };
  };

  const s1 = calculateSectionScore(jlptVocabData, answersSec1);
  const s2 = calculateSectionScore(jlptGrammarData, answersSec2);
  const s3 = calculateSectionScore(jlptListeningData, answersSec3);

  // Integrate Evaluation Logic (Assuming N5 for this demo page)
  const currentLevel = 'N5';
  const evaluation = evaluateJLPTTest(currentLevel, {
    section1: s1.score + s2.score, // N5 Written uses combined Vocab + Grammar + Reading score
    section2: s3.score             // N5 Listening
  });

  const totalScore = evaluation.totalScore;
  const isPassed = evaluation.passed;
  const failureReason = evaluation.reason;

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleExit}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>
            <h1 className="text-2xl font-bold">Kết quả bài thi</h1>
          </div>
        </div>

        {/* Score Summary Grid */}
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Tổng quan kết quả
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x">
              <div className="space-y-2 py-4 md:py-0">
                <p className="text-sm text-gray-500">言語知識（文字・語彙）</p>
                <p className="font-semibold">Language Knowledge (Vocab)</p>
                <div className="text-3xl font-bold text-blue-600">{s1.score}/60</div>
                <p className="text-sm text-gray-500">{s1.correct}/{s1.total} câu đúng</p>
              </div>
              <div className="space-y-2 py-4 md:py-0">
                <p className="text-sm text-gray-500">言語知識（文法）・読解</p>
                <p className="font-semibold">Language Knowledge (Grammar)</p>
                <div className="text-3xl font-bold text-blue-600">{s2.score}/60</div>
                <p className="text-sm text-gray-500">{s2.correct}/{s2.total} câu đúng</p>
              </div>
              <div className="space-y-2 py-4 md:py-0">
                <p className="text-sm text-gray-500">聴解</p>
                <p className="font-semibold">Listening</p>
                <div className="text-3xl font-bold text-blue-600">{s3.score}/60</div>
                <p className="text-sm text-gray-500">{s3.correct}/{s3.total} câu đúng</p>
              </div>
              <div className="space-y-2 py-4 md:py-0 flex flex-col justify-center items-center bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Tổng Điểm</p>
                <div className={cn("text-4xl font-extrabold", isPassed ? "text-green-600" : "text-red-500")}>
                  {totalScore}/180
                </div>
                <Badge variant={isPassed ? "default" : "destructive"} className="text-md px-4 py-1">
                  {isPassed ? "ĐỖ (合格)" : "TRƯỢT (不合格)"}
                </Badge>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg border flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-blue-900">Nhận xét chung:</p>
                <p className="text-sm text-gray-700 mt-1">
                  {isPassed
                    ? "Chúc mừng bạn đã hoàn thành tốt bài thi! Bạn có nền tảng vững chắc ở cả 3 kỹ năng."
                    : `Bạn chưa đạt tiêu chuẩn. Lý do: ${failureReason || "Điểm chưa đạt yêu cầu"}. Hãy ôn tập thêm nhé!`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="sec1" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 p-1">
            <TabsTrigger value="sec1" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              <span className="font-bold mr-2">Phần 1</span> 文字・語彙 (Vocab)
            </TabsTrigger>
            <TabsTrigger value="sec2" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              <span className="font-bold mr-2">Phần 2</span> 文法・読解 (Grammar)
            </TabsTrigger>
            <TabsTrigger value="sec3" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              <span className="font-bold mr-2">Phần 3</span> 聴解 (Listening)
            </TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-b-lg border border-t-0 p-6 min-h-[500px]">
            <TabsContent value="sec1" className="mt-0 focus-visible:outline-none">
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-xl font-bold text-blue-800">言語知識（文字・語彙）</h3>
                <p className="text-gray-500">Language Knowledge (Vocabulary)</p>
              </div>
              <JLPTQuestionView
                mondaiList={jlptVocabData}
                answers={answersSec1}
                onAnswer={() => { }}
                showResults={true}
              />
            </TabsContent>

            <TabsContent value="sec2" className="mt-0 focus-visible:outline-none">
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-xl font-bold text-blue-800">言語知識（文法）・読解</h3>
                <p className="text-gray-500">Language Knowledge (Grammar) / Reading</p>
              </div>
              <JLPTQuestionView
                mondaiList={jlptGrammarData}
                answers={answersSec2}
                onAnswer={() => { }}
                showResults={true}
              />
            </TabsContent>

            <TabsContent value="sec3" className="mt-0 focus-visible:outline-none">
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-xl font-bold text-blue-800">聴解</h3>
                <p className="text-gray-500">Listening</p>
              </div>
              <JLPTQuestionView
                mondaiList={jlptListeningData}
                answers={answersSec3}
                onAnswer={() => { }}
                showResults={true}
                hideQuestionId={true}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

// Helper for classnames
import { cn } from "@/lib/utils";

export default ExamResult;
