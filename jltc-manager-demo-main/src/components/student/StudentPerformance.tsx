import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useState, Fragment } from "react";
import { Plus, Edit, Trash2, Printer } from "lucide-react";
import { toast } from "sonner";
import { evaluateJLPTTest, evaluateLessonTest, evaluateComprehensiveTest, evaluateGeneralTest, JLPTLevel } from "@/utils/evaluationLogic";

// Actually I'll just use a simple random ID generator function since I can't install packages easily.

interface TestRecord {
  id: string;
  name: string;
  date: string;
  scores: {
    vocab: number;
    grammar: number;
    reading: number;
    listening: number;
  };
  result: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const lineData = [
  { month: "T7/2024", score: 480 },
  { month: "T8/2024", score: 520 },
  { month: "T9/2024", score: 560 },
  { month: "T10/2024", score: 590 },
  { month: "T11/2024", score: 620 },
];

const printStyles = `
  @media print {
    body { margin: 0; padding: 0; }
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    .print-content { 
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding: 0;
      margin: 0;
      background: white;
    }
    .card { border: none !important; box-shadow: none !important; }
    .card-header { border-bottom: none !important; }
    table { width: 100% !important; page-break-inside: auto; }
    tr { page-break-inside: avoid; page-break-after: auto; }
    thead { display: table-header-group; }
    tfoot { display: table-footer-group; }
  }
  .pdf-only { 
    display: none;
  }
`;



const initialEvaluations: Record<string, any> = {
  "10-2024": {
    month: "10",
    year: "2024",
    title: "Đánh giá Tháng 10/2024 – 2024年10月",
    period: "学習期間: 1ヶ月",
    character: "明るく、活発",
    writing: "◎",
    reading: "◎",
    listening: "◯",
    speaking: "◯",
    academicLevel: "A",
    jlptLevel: "N5",
    overallEval: "秀",
    progress: "入門",
    comment: "学習態度が良好で、内容の習得が早いです。聴解力と応答がスムーズで、質問の趣旨に的確に答えられます。会社の規則を遵守しています。",

    lessonTests: [],
    compTests: [],
    jlptTests: [{
      id: "mock-1", name: "Mock Test 1", date: "2024-10-15",
      scores: { vocab: 0, grammar: 0, reading: 0, listening: 0 },
      result: "Trượt"
    }],
    generalTests: []
  },
  "11-2024": {
    month: "11",
    year: "2024",
    title: "Đánh giá Tháng 11/2024 – 2024年11月",
    period: "学習期間: 2ヶ月",
    character: "明るく、活発",
    writing: "●",
    reading: "◎",
    listening: "○",
    speaking: "◎",
    academicLevel: "A",
    jlptLevel: "N5",
    overallEval: "秀",
    progress: "第18課",
    comment: "語彙をよく記憶できており、文を作る力や反応も良好で、授業中はしっかりと集中して受講できます。",

    lessonTests: [
      {
        id: "lt-11-1", name: "Bài 18 - Minna no Nihongo", date: "2024-11-05",
        scores: { vocab: 95, grammar: 90, reading: 85, listening: 88 },
        result: "Đạt"
      },
      {
        id: "lt-11-2", name: "Bài 19 - Minna no Nihongo", date: "2024-11-20",
        scores: { vocab: 40, grammar: 35, reading: 45, listening: 30 },
        result: "Trượt"
      }
    ],
    compTests: [
      {
        id: "ct-11-1", name: "Kiểm tra giữa kỳ", date: "2024-11-10",
        scores: { vocab: 85, grammar: 82, reading: 80, listening: 78 },
        result: "Đạt"
      },
      {
        id: "ct-11-2", name: "Kiểm tra cuối kỳ", date: "2024-11-28",
        scores: { vocab: 50, grammar: 45, reading: 55, listening: 40 },
        result: "Trượt"
      }
    ],
    jlptTests: [
      {
        id: "jt-11-1", name: "Mock Test N5 Lần 1", date: "2024-11-08",
        scores: { vocab: 35, grammar: 40, reading: 38, listening: 45 },
        result: "Đỗ"
      },
      {
        id: "jt-11-2", name: "Mock Test N5 Lần 2", date: "2024-11-25",
        scores: { vocab: 15, grammar: 20, reading: 18, listening: 25 },
        result: "Trượt"
      }
    ],
    generalTests: [
      {
        id: "gt-11-1", name: "Kỹ năng tổng hợp Tuần 1", date: "2024-11-03",
        scores: { vocab: 8, grammar: 9, reading: 8, listening: 8 },
        result: "Đạt"
      },
      {
        id: "gt-11-2", name: "Kỹ năng tổng hợp Tuần 3", date: "2024-11-17",
        scores: { vocab: 3, grammar: 4, reading: 3, listening: 2 },
        result: "Trượt"
      }
    ]
  },
};

const symbolOptions = ["●", "◎", "○", "◯", "△", "×"];
const academicLevelOptions = ["A", "B", "C", "D"];
const jlptLevelOptions = ["N5", "N4", "N3", "N2", "N1"];
const overallEvalOptions = ["秀", "優", "良", "可", "不可"];

const emptyFormData = {
  month: "",
  year: "2024",
  period: "",
  character: "",
  writing: "○",
  reading: "○",
  listening: "○",
  speaking: "○",
  academicLevel: "B",
  jlptLevel: "N5",
  overallEval: "良",
  progress: "",
  comment: "",

  lessonTests: [] as TestRecord[],
  compTests: [] as TestRecord[],
  jlptTests: [] as TestRecord[],
  generalTests: [] as TestRecord[],
};

const StudentPerformance = () => {
  const [selectedMonth, setSelectedMonth] = useState("11");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [evaluations, setEvaluations] = useState(initialEvaluations);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyFormData);

  const evaluationKey = `${selectedMonth}-${selectedYear}`;
  const currentEvaluation = evaluations[evaluationKey];
  const currentRadarData = (() => {
    if (!currentEvaluation) return [
      { skill: "Từ vựng", value: 0 },
      { skill: "Ngữ pháp", value: 0 },
      { skill: "Đọc hiểu", value: 0 },
      { skill: "Nghe hiểu", value: 0 },
    ];

    // Calculate average from Lesson Tests and Comprehensive Tests (sau 5 bài)
    // Exclude General Test and JLPT as requested
    const applicableTests = [
      ...(currentEvaluation.lessonTests || []),
      ...(currentEvaluation.compTests || [])
    ];

    if (applicableTests.length === 0) return [
      { skill: "Từ vựng", value: 0 },
      { skill: "Ngữ pháp", value: 0 },
      { skill: "Đọc hiểu", value: 0 },
      { skill: "Nghe hiểu", value: 0 },
    ];

    const total = applicableTests.reduce((acc: any, t: TestRecord) => ({
      vocab: acc.vocab + (t.scores.vocab || 0),
      grammar: acc.grammar + (t.scores.grammar || 0),
      reading: acc.reading + (t.scores.reading || 0),
      listening: acc.listening + (t.scores.listening || 0),
    }), { vocab: 0, grammar: 0, reading: 0, listening: 0 });

    const count = applicableTests.length;
    return [
      { skill: "Từ vựng", value: Math.round(total.vocab / count) },
      { skill: "Ngữ pháp", value: Math.round(total.grammar / count) },
      { skill: "Đọc hiểu", value: Math.round(total.reading / count) },
      { skill: "Nghe hiểu", value: Math.round(total.listening / count) },
    ];
  })();
  const hasEvaluation = !!currentEvaluation;

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      ...emptyFormData,
      month: selectedMonth,
      year: selectedYear,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = () => {
    if (!currentEvaluation) return;
    setIsEditing(true);
    setFormData({
      month: currentEvaluation.month,
      year: currentEvaluation.year,
      period: currentEvaluation.period,
      character: currentEvaluation.character,
      writing: currentEvaluation.writing,
      reading: currentEvaluation.reading,
      listening: currentEvaluation.listening,
      speaking: currentEvaluation.speaking,
      academicLevel: currentEvaluation.academicLevel,
      jlptLevel: currentEvaluation.jlptLevel,
      overallEval: currentEvaluation.overallEval,
      progress: currentEvaluation.progress,
      comment: currentEvaluation.comment,

      lessonTests: currentEvaluation.lessonTests || [],
      compTests: currentEvaluation.compTests || [],
      jlptTests: currentEvaluation.jlptTests || [],
      generalTests: currentEvaluation.generalTests || [],
    });
    // Removed setDialogOpen(true) to keep editing inline
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('evaluation-report');
    if (!element) {
      toast.error("Không tìm thấy nội dung để tải về");
      return;
    }

    // Load html2pdf from CDN if not already loaded
    const scriptId = 'html2pdf-script';
    const generatePDF = () => {
      // @ts-ignore
      const html2pdf = window.html2pdf;
      const opt = {
        margin: 10,
        filename: `Danh-gia-thang-${selectedMonth}-${selectedYear}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          onclone: (doc: any) => {
            const pdfOnly = doc.querySelector('.pdf-only');
            if (pdfOnly) {
              pdfOnly.style.display = 'block';
            }
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Hide buttons temporarily during capture if needed, 
      // but we wrap the content in a specific div so it's cleaner.
      html2pdf().set(opt).from(element).save();
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        generatePDF();
      };
      document.head.appendChild(script);
    } else {
      generatePDF();
    }
  };

  const handleSave = () => {
    // Only saving test records for now
    const key = `${formData.month}-${formData.year}`;
    setEvaluations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        lessonTests: formData.lessonTests,
        compTests: formData.compTests,
        jlptTests: formData.jlptTests,
        generalTests: formData.generalTests,
      },
    }));
    setIsEditing(false);
    toast.success("Đã cập nhật đánh giá");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const addTest = (type: 'lessonTests' | 'compTests' | 'jlptTests' | 'generalTests') => {
    const newTest: TestRecord = {
      id: generateId(),
      name: "",
      date: new Date().toISOString().split('T')[0],
      scores: { vocab: 0, grammar: 0, reading: 0, listening: 0 },
      result: ""
    };
    setFormData(prev => ({ ...prev, [type]: [...prev[type], newTest] }));
  };

  const removeTest = (type: 'lessonTests' | 'compTests' | 'jlptTests' | 'generalTests', id: string) => {
    setFormData(prev => ({ ...prev, [type]: prev[type].filter(t => t.id !== id) }));
  };

  const updateTestMeta = (type: 'lessonTests' | 'compTests' | 'jlptTests' | 'generalTests', id: string, field: 'name' | 'date', value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const updateTestScore = (type: 'lessonTests' | 'compTests' | 'jlptTests' | 'generalTests', id: string, field: keyof TestRecord['scores'], value: number) => {
    setFormData(prev => {
      const updatedTests = prev[type].map(t => {
        if (t.id !== id) return t;

        const newScores = { ...t.scores, [field]: value };
        let result = t.result;

        // Auto-calculate result
        if (type === 'lessonTests') {
          const evalRes = evaluateLessonTest(newScores);
          result = evalRes.passed ? "Đạt" : "Trượt";
        } else if (type === 'compTests') {
          const evalRes = evaluateComprehensiveTest(newScores);
          result = evalRes.passed ? "Đạt" : "Trượt";
        } else if (type === 'jlptTests') {
          const evalRes = evaluateJLPTTest(prev.jlptLevel as JLPTLevel, newScores); // Use global level for now
          result = evalRes.passed ? "Đỗ" : "Trượt";
        } else if (type === 'generalTests') {
          const evalRes = evaluateGeneralTest(newScores);
          result = evalRes.passed ? "Đạt" : "Trượt";
        }

        return { ...t, scores: newScores, result };
      });
      return { ...prev, [type]: updatedTests };
    });
  };



  const handleSubmit = () => {
    const key = `${formData.month}-${formData.year}`;
    const newEvaluation = {
      ...formData,
      title: `Đánh giá Tháng ${formData.month}/${formData.year} – ${formData.year}年${formData.month}月`,
    };
    setEvaluations((prev) => ({
      ...prev,
      [key]: newEvaluation,
    }));
    setDialogOpen(false);
    setSelectedMonth(formData.month);
    setSelectedYear(formData.year);
    toast.success(isEditing ? "Đã cập nhật đánh giá" : "Đã tạo đánh giá mới");
  };

  const renderTestInputSection = (
    title: string,
    type: 'lessonTests' | 'compTests' | 'jlptTests' | 'generalTests',
    tests: TestRecord[]
  ) => (
    <div className="space-y-4 border p-4 rounded-md bg-muted/20">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-primary">{title}</h4>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => addTest(type)}
          type="button"
        >
          <Plus className="w-4 h-4 mr-1" /> Thêm điểm thi
        </Button>
      </div>

      {tests.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Chưa có bài kiểm tra nào.
        </div>
      )}

      {tests.map((test, index) => (
        <div key={test.id} className="border p-3 rounded bg-background space-y-3 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => removeTest(type, test.id)}
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Tên bài kiểm tra</Label>
              <Input
                value={test.name}
                onChange={(e) => updateTestMeta(type, test.id, 'name', e.target.value)}
                placeholder={`Bài kiểm tra ${index + 1}`}
              />
            </div>
            <div className="space-y-1">
              <Label>Ngày thi</Label>
              <Input
                type="date"
                value={test.date}
                onChange={(e) => updateTestMeta(type, test.id, 'date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Từ vựng</Label>
              <Input type="number" value={test.scores.vocab} onChange={(e) => updateTestScore(type, test.id, 'vocab', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Ngữ pháp</Label>
              <Input type="number" value={test.scores.grammar} onChange={(e) => updateTestScore(type, test.id, 'grammar', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Đọc hiểu</Label>
              <Input type="number" value={test.scores.reading} onChange={(e) => updateTestScore(type, test.id, 'reading', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Nghe hiểu</Label>
              <Input type="number" value={test.scores.listening} onChange={(e) => updateTestScore(type, test.id, 'listening', Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Kết quả</Label>
            <Input
              value={test.result}
              readOnly
              className={test.result.includes("Đạt") || test.result.includes("Đỗ") || test.result === "Pass" ? "bg-green-50 text-green-700 font-bold" : "bg-red-50 text-red-700 font-bold"}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderCombinedTestsTable = () => {
    const sections = [
      { title: "Bài kiểm tra sau mỗi bài ( giảng viên nhập - rada tăng trưởng)", type: "lessonTests" as const },
      { title: "Bài kiểm tra tổng ( mỗi tháng định kì 1 tới 2 bài )", type: "compTests" as const },
      { title: "Thi thử JLPT ( đánh giá trình độ hiện tại học viên )", type: "jlptTests" as const }
    ];

    return (
      <div className="mb-8 border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[45%] whitespace-nowrap py-3 text-sm font-bold text-foreground border-r">Tên bài kiểm tra</TableHead>
              <TableHead className="w-[12%] py-3 text-sm font-bold text-foreground whitespace-nowrap border-r">Ngày thi</TableHead>
              <TableHead className="text-center w-[8%] py-3 text-sm font-bold text-foreground border-r">Từ vựng</TableHead>
              <TableHead className="text-center w-[8%] py-3 text-sm font-bold text-foreground border-r">Ngữ pháp</TableHead>
              <TableHead className="text-center w-[8%] py-3 text-sm font-bold text-foreground border-r">Đọc hiểu</TableHead>
              <TableHead className="text-center w-[8%] py-3 text-sm font-bold text-foreground border-r">Nghe hiểu</TableHead>
              <TableHead className="text-right w-[11%] py-3 text-sm font-bold text-foreground">{isEditing ? "Hành động" : "Kết quả"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map(({ title, type }) => {
              const tests = isEditing && currentEvaluation ? formData[type] : (currentEvaluation ? currentEvaluation[type] || [] : []);

              return (
                <Fragment key={type}>
                  {/* Section Header */}
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={7} className="font-bold text-primary py-3">
                      <div className="flex justify-between items-center">
                        <span>{title}</span>
                        {isEditing && (
                          <Button size="sm" variant="ghost" onClick={() => addTest(type)} className="h-6 w-6 p-0 hover:bg-background">
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Test Rows */}
                  {tests && tests.length > 0 ? (
                    tests.map((test: TestRecord) => (
                      <TableRow key={test.id}>
                        <TableCell className="py-2 text-sm whitespace-nowrap border-r">
                          {isEditing ? (
                            <Input
                              value={test.name}
                              onChange={(e) => updateTestMeta(type, test.id, 'name', e.target.value)}
                              placeholder="Tên bài kiểm tra"
                              className="h-8"
                            />
                          ) : (
                            test.name || "Bài kiểm tra"
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-sm whitespace-nowrap border-r">
                          {isEditing ? (
                            <Input
                              type="date"
                              value={test.date}
                              onChange={(e) => updateTestMeta(type, test.id, 'date', e.target.value)}
                              className="h-8"
                            />
                          ) : (
                            test.date
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-sm text-center border-r">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={test.scores.vocab}
                              onChange={(e) => updateTestScore(type, test.id, 'vocab', Number(e.target.value))}
                              className="h-8 text-center"
                            />
                          ) : (
                            test.scores.vocab
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-sm text-center border-r">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={test.scores.grammar}
                              onChange={(e) => updateTestScore(type, test.id, 'grammar', Number(e.target.value))}
                              className="h-8 text-center"
                            />
                          ) : (
                            test.scores.grammar
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-sm text-center border-r">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={test.scores.reading}
                              onChange={(e) => updateTestScore(type, test.id, 'reading', Number(e.target.value))}
                              className="h-8 text-center"
                            />
                          ) : (
                            test.scores.reading
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-sm text-center border-r">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={test.scores.listening}
                              onChange={(e) => updateTestScore(type, test.id, 'listening', Number(e.target.value))}
                              className="h-8 text-center"
                            />
                          ) : (
                            test.scores.listening
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-sm text-right">
                          {isEditing ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTest(type, test.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          ) : (
                            <span className={`font-bold ${test.result?.includes("Đạt") || test.result === "Pass" || test.result?.includes("Đỗ") ? "text-green-600" : "text-red-600"}`}>
                              {test.result || "-"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-2 text-sm italic">
                        Chưa có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Average Row for Comprehensive Test */}
                  {type === "compTests" && !isEditing && tests && tests.length > 0 && (() => {
                    const total = tests.reduce((acc: any, t: TestRecord) => ({
                      vocab: acc.vocab + t.scores.vocab,
                      grammar: acc.grammar + t.scores.grammar,
                      reading: acc.reading + t.scores.reading,
                      listening: acc.listening + t.scores.listening,
                    }), { vocab: 0, grammar: 0, reading: 0, listening: 0 });
                    const count = tests.length;
                    const avg = {
                      vocab: (total.vocab / count).toFixed(1),
                      grammar: (total.grammar / count).toFixed(1),
                      reading: (total.reading / count).toFixed(1),
                      listening: (total.listening / count).toFixed(1),
                    };

                    const overallAvg = (parseFloat(avg.vocab) + parseFloat(avg.grammar) + parseFloat(avg.reading) + parseFloat(avg.listening)) / 4;
                    let classification = "";
                    if (overallAvg >= 70) classification = "Khá";
                    else if (overallAvg >= 50) classification = "Trung bình";
                    else classification = "Chưa đạt";

                    return (
                      <TableRow className="bg-red-50 hover:bg-red-50 border-t-2 border-red-200">
                        <TableCell colSpan={2} className="font-bold text-red-600 border-r">Điểm trung bình tháng ( báo cáo công ty khách hàng)</TableCell>
                        <TableCell className="text-center font-bold text-red-600 border-r">{avg.vocab}</TableCell>
                        <TableCell className="text-center font-bold text-red-600 border-r">{avg.grammar}</TableCell>
                        <TableCell className="text-center font-bold text-red-600 border-r">{avg.reading}</TableCell>
                        <TableCell className="text-center font-bold text-red-600 border-r">{avg.listening}</TableCell>
                        <TableCell className="text-right font-bold text-red-600 whitespace-nowrap">
                          {classification}
                        </TableCell>
                      </TableRow>
                    );
                  })()}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      {/* Current Level */}
      <Card>
        <CardHeader>
          <CardTitle>Trình độ hiện tại</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Cấp độ</p>
              <p className="text-3xl font-bold text-primary">N4</p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Điểm tổng hợp</p>
              <p className="text-3xl font-bold text-primary">620</p>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Xếp loại</p>
              <p className="text-3xl font-bold text-success">優</p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Tiến độ</p>
              <p className="text-3xl font-bold text-primary">85%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ tăng trưởng năng lực tổng hợp</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[400, 700]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="Điểm tổng hợp"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ kỹ năng - Tháng {selectedMonth}/{selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={currentRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Kỹ năng"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Evaluation Selector and Display */}
      {/* Monthly Evaluation */}
      <div id="evaluation-report">
        {/* PDF-only header */}
        <div className="pdf-only pt-8 pb-4 border-b-2 mb-6 text-foreground bg-white">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-primary">Bảng Đánh Giá Năng Lực Nhật Ngữ</h1>
            <div className="flex justify-center gap-12 text-lg">
              <p><span className="font-semibold">Học viên:</span> Nguyễn Văn A</p>
              <p><span className="font-semibold">Mã HV:</span> HV0234</p>
              <p><span className="font-semibold">Tháng:</span> {selectedMonth}/{selectedYear}</p>
            </div>

            <div className="flex flex-col items-center py-4 bg-muted/5 rounded-xl mt-4 border border-dashed border-primary/20">
              <p className="font-bold text-lg mb-2 text-primary">Biểu đồ kỹ năng</p>
              <div className="flex justify-center" style={{ width: '500px', height: '300px' }}>
                <RadarChart width={500} height={300} data={currentRadarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                  <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={false} />
                  <Radar
                    name="Kỹ năng"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </div>
            </div>
          </div>
        </div>

        <Card className="print-content border-none shadow-none lg:border lg:shadow-sm">
          <CardHeader className="no-print" data-html2canvas-ignore="true">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Đánh giá theo tháng</CardTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tháng:</span>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          Tháng {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Năm:</span>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  {hasEvaluation ? (
                    isEditing ? (
                      <>
                        <Button size="sm" variant="default" onClick={handleSave}>
                          Lưu
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleOpenEdit}>
                          <Edit className="w-4 h-4 mr-1" /> Sửa
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleDownloadPDF} className="bg-primary/5 hover:bg-primary/10">
                          <Printer className="w-4 h-4 mr-1" /> In bảng điểm
                        </Button>
                      </div>
                    )
                  ) : (
                    <Button size="sm" onClick={handleOpenCreate}>
                      <Plus className="w-4 h-4 mr-1" /> Tạo mới
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {hasEvaluation ? (
              <>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">{currentEvaluation.title} - Học viên: Nguyễn Văn A</h3>
                </div>


                {/* Combined Test Results Table */}
                {renderCombinedTestsTable()}


              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Chưa có đánh giá cho tháng {selectedMonth}/{selectedYear}</p>
                <Button className="mt-4" onClick={handleOpenCreate}>
                  <Plus className="w-4 h-4 mr-2" /> Tạo đánh giá mới
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Chỉnh sửa đánh giá" : "Tạo đánh giá mới"} - Tháng {formData.month}/{formData.year}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tháng</Label>
                  <Select value={formData.month} onValueChange={(v) => setFormData({ ...formData, month: v })} disabled={isEditing}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>Tháng {i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Năm</Label>
                  <Select value={formData.year} onValueChange={(v) => setFormData({ ...formData, year: v })} disabled={isEditing}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>JLPT Level</Label>
                  <Select value={formData.jlptLevel} onValueChange={(v) => setFormData({ ...formData, jlptLevel: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {jlptLevelOptions.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Test Sections using Helper */}
              {renderTestInputSection("Bài kiểm tra sau mỗi bài ( giảng viên nhập - rada tăng trưởng)", "lessonTests", formData.lessonTests)}

              {renderTestInputSection("Bài kiểm tra tổng ( mỗi tháng định kì 1 tới 2 bài )", "compTests", formData.compTests)}

              {renderTestInputSection("Kết quả Bài kiểm tra Tổng (General Test)", "generalTests", formData.generalTests)}

              {renderTestInputSection("Thi thử JLPT ( đánh giá trình độ hiện tại học viên )", "jlptTests", formData.jlptTests)}



            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleSubmit}>{isEditing ? "Cập nhật" : "Lưu"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentPerformance;
