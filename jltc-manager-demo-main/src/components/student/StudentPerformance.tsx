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
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
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
    speaking: number;
  };
  result: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);



const printStyles = `
  @media print {
    body { margin: 0; padding: 0; }
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    .print-content { 
    .print-content { 
      position: relative; /* Changed from absolute to relative */
      left: auto;
      top: auto;
      width: 100%;
      padding: 40px; /* Increased padding */
      margin: 0 auto;
      background: white;
      box-sizing: border-box;
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
      scores: { vocab: 0, grammar: 0, reading: 0, listening: 0, speaking: 0 },
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
        scores: { vocab: 95, grammar: 90, reading: 85, listening: 88, speaking: 90 },
        result: "Giỏi"
      },
      {
        id: "lt-11-2", name: "Bài 19 - Minna no Nihongo", date: "2024-11-20",
        scores: { vocab: 40, grammar: 35, reading: 45, listening: 30, speaking: 25 },
        result: "Không đạt"
      }
    ],
    compTests: [
      {
        id: "ct-11-1", name: "Kiểm tra giữa kỳ", date: "2024-11-10",
        scores: { vocab: 80, grammar: 82, reading: 80, listening: 78, speaking: 80 },
        result: "Khá"
      },
      {
        id: "ct-11-2", name: "Kiểm tra cuối kỳ", date: "2024-11-28",
        scores: { vocab: 70, grammar: 75, reading: 72, listening: 70, speaking: 73 },
        result: "Trung bình"
      },
      {
        id: "ct-11-3", name: "Kiểm tra bổ sung", date: "2024-11-29",
        scores: { vocab: 60, grammar: 55, reading: 65, listening: 60, speaking: 50 },
        result: "Không đạt"
      }
    ],
    jlptTests: [
      {
        id: "jt-11-1", name: "Mock Test N5 Lần 1", date: "2024-11-08",
        scores: { vocab: 35, grammar: 78, reading: 0, listening: 45, speaking: 0 },
        result: "Đỗ"
      },
      {
        id: "jt-11-2", name: "Mock Test N5 Lần 2", date: "2024-11-25",
        scores: { vocab: 15, grammar: 38, reading: 0, listening: 25, speaking: 0 },
        result: "Trượt"
      }
    ],
    generalTests: [
      {
        id: "gt-11-1", name: "Kỹ năng tổng hợp Tuần 1", date: "2024-11-03",
        scores: { vocab: 8, grammar: 9, reading: 8, listening: 8, speaking: 7 },
        result: "Không đạt"
      },
      {
        id: "gt-11-2", name: "Kỹ năng tổng hợp Tuần 3", date: "2024-11-17",
        scores: { vocab: 3, grammar: 4, reading: 3, listening: 2, speaking: 3 },
        result: "Không đạt"
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
      { skill: "Nói", value: 0 },
    ];

    // Calculate average from Lesson Tests ONLY
    const applicableTests = [
      ...(currentEvaluation.lessonTests || [])
    ];

    if (applicableTests.length === 0) return [
      { skill: "Từ vựng", value: 0 },
      { skill: "Ngữ pháp", value: 0 },
      { skill: "Đọc hiểu", value: 0 },
      { skill: "Nghe hiểu", value: 0 },
      { skill: "Nói", value: 0 },
    ];

    const total = applicableTests.reduce((acc: any, t: TestRecord) => ({
      vocab: acc.vocab + (t.scores.vocab || 0),
      grammar: acc.grammar + (t.scores.grammar || 0),
      reading: acc.reading + (t.scores.reading || 0),
      listening: acc.listening + (t.scores.listening || 0),
      speaking: (acc.speaking || 0) + (t.scores.speaking || 0),
    }), { vocab: 0, grammar: 0, reading: 0, listening: 0, speaking: 0 });

    const count = applicableTests.length;
    const avgVocab = Math.round(total.vocab / count);
    const avgGrammar = Math.round(total.grammar / count);
    const avgReading = Math.round(total.reading / count);
    const avgListening = Math.round(total.listening / count);
    const avgSpeaking = Math.round((total.speaking || 0) / count);

    return [
      { skill: `Từ vựng (${avgVocab}/100)`, value: avgVocab },
      { skill: `Ngữ pháp (${avgGrammar}/100)`, value: avgGrammar },
      { skill: `Đọc hiểu (${avgReading}/100)`, value: avgReading },
      { skill: `Nghe hiểu (${avgListening}/100)`, value: avgListening },
      { skill: `Nói (${avgSpeaking}/100)`, value: avgSpeaking },
    ];
  })();

  // Calculate Growth Chart Data (Total Average of Comprehensive Tests per Month)
  const lineData = Object.values(evaluations).map((ev: any) => {
    const compTests = ev.compTests || [];
    let avgScore = 0;

    if (compTests.length > 0) {
      const totalSum = compTests.reduce((sum: number, t: TestRecord) => {
        return sum + (t.scores.vocab + t.scores.grammar + t.scores.reading + t.scores.listening + (t.scores.speaking || 0));
      }, 0);
      avgScore = Math.round(totalSum / compTests.length);
    }

    return {
      month: `T${ev.month}/${ev.year}`,
      score: avgScore,
      rawMonth: parseInt(ev.month),
      rawYear: parseInt(ev.year)
    };
  })
    .sort((a, b) => {
      if (a.rawYear !== b.rawYear) return a.rawYear - b.rawYear;
      return a.rawMonth - b.rawMonth;
    });

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
        margin: [5, 5, 5, 0], // Top, Right, Bottom, Left: 0
        filename: `Danh-gia-thang-${selectedMonth}-${selectedYear}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 1450, // Wider capture to fit full table
          x: 0,
          y: 0,
          onclone: (doc: any) => {
            // Force reset body
            doc.body.style.margin = '0';
            doc.body.style.padding = '0';
            doc.body.style.overflow = 'hidden';

            const root = doc.getElementById('evaluation-report');
            if (root) {
              root.style.position = 'absolute';
              root.style.left = '0';
              root.style.top = '0';
              root.style.width = '1400px'; // Match wider capture
              root.style.margin = '0';
              root.style.padding = '10px 10px 10px 0'; // Zero left padding
              root.style.backgroundColor = 'white';
            }

            const pdfOnly = doc.querySelector('.pdf-only');
            if (pdfOnly) {
              pdfOnly.style.display = 'block';
            }

            const printContent = doc.querySelector('.print-content');
            if (printContent) {
              printContent.style.width = '100%';
              printContent.style.marginLeft = '-40px'; // Force table significantly left
              printContent.style.padding = '0';
              printContent.style.boxSizing = 'border-box';

              const table = printContent.querySelector('table');
              if (table) table.style.width = '100%';
            }
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
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
      scores: { vocab: 0, grammar: 0, reading: 0, listening: 0, speaking: 0 },
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
        const currentScores = { ...t.scores, [field]: value };
        const totalScore = currentScores.vocab + currentScores.grammar + currentScores.reading + currentScores.listening + (currentScores.speaking || 0);

        if (type === 'lessonTests' || type === 'compTests' || type === 'generalTests') {
          // Max score assumption: 100 per skill. 5 skills = 500. 
          // If Speaking is 0/hidden (unlikely for these tests now), we still assume 500 max for consistency or 400? 
          // User said "tổng điểm toàn bộ các cột".
          const maxScore = 500;
          const percentage = (totalScore / maxScore) * 100;

          if (percentage >= 90) result = "Giỏi";
          else if (percentage >= 80) result = "Khá";
          else if (percentage >= 70) result = "Trung bình";
          else result = "Không đạt";
        } else if (type === 'jlptTests') {
          // JLPT logic: Reading is merged into Grammar, so it's ignored in total here
          const jlptTotal = currentScores.vocab + currentScores.grammar + currentScores.listening;
          const evalRes = evaluateJLPTTest(prev.jlptLevel as JLPTLevel, { ...currentScores, reading: 0 });
          result = evalRes.passed ? "Đỗ" : "Trượt";
        }

        return { ...t, scores: currentScores, result };
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
              <Label>Nghe hiểu</Label>
              <Input type="number" value={test.scores.listening} onChange={(e) => updateTestScore(type, test.id, 'listening', Number(e.target.value))} />
            </div>
            {type !== 'jlptTests' ? (
              <>
                <div className="space-y-2">
                  <Label>Đọc hiểu</Label>
                  <Input type="number" value={test.scores.reading} onChange={(e) => updateTestScore(type, test.id, 'reading', Number(e.target.value))} />
                </div>
                {type !== 'jlptTests' && type !== 'generalTests' && (
                  <div className="space-y-2">
                    <Label>Nói</Label>
                    <Input type="number" value={test.scores.speaking} onChange={(e) => updateTestScore(type, test.id, 'speaking', Number(e.target.value))} />
                  </div>
                )}
              </>
            ) : null}
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

  const renderTestTable = (title: string, type: 'lessonTests' | 'compTests' | 'jlptTests' | 'generalTests') => {
    const tests = isEditing && currentEvaluation ? formData[type] : (currentEvaluation ? currentEvaluation[type] || [] : []);
    const isJLPT = type === 'jlptTests';

    return (
      <div className="mb-8 border rounded-md overflow-hidden bg-white shadow-sm">
        <div className="bg-muted/30 p-3 border-b border-border flex justify-between items-center">
          <h4 className="font-bold text-primary text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {title}
          </h4>
          {isEditing && (
            <Button size="sm" variant="ghost" onClick={() => addTest(type)} className="h-7 w-7 p-0 hover:bg-background border border-primary/20">
              <Plus className="w-4 h-4 text-primary" />
            </Button>
          )}
        </div>
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow>
              <TableHead className="w-[40%] whitespace-nowrap py-3 text-xs font-bold text-foreground border-r">Tên bài kiểm tra</TableHead>
              <TableHead className="w-[12%] py-3 text-xs font-bold text-foreground whitespace-nowrap border-r">Ngày thi</TableHead>
              <TableHead className="text-center w-[8%] py-3 text-xs font-bold text-foreground whitespace-nowrap border-r">Từ vựng</TableHead>
              <TableHead className="text-center w-[12%] py-3 text-xs font-bold text-foreground whitespace-nowrap border-r">
                {isJLPT ? "Ngữ pháp & Đọc" : "Ngữ pháp"}
              </TableHead>
              {!isJLPT && (
                <TableHead className="text-center w-[8%] py-3 text-xs font-bold text-foreground whitespace-nowrap border-r">Đọc hiểu</TableHead>
              )}
              <TableHead className="text-center w-[8%] py-3 text-xs font-bold text-foreground whitespace-nowrap border-r">Nghe hiểu</TableHead>
              {!isJLPT && (
                <TableHead className="text-center w-[8%] py-3 text-xs font-bold text-foreground whitespace-nowrap border-r">Nói</TableHead>
              )}
              <TableHead className="text-center w-[10%] py-3 text-xs font-bold text-foreground whitespace-nowrap border-r">Tổng điểm</TableHead>
              <TableHead className="text-right w-[10%] py-3 text-xs font-bold text-foreground whitespace-nowrap">
                {isEditing ? "Hành động" : "Kết quả"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests && tests.length > 0 ? (
              tests.map((test: TestRecord) => (
                <TableRow key={test.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="py-2 text-sm border-r font-medium">
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
                  <TableCell className="py-2 text-sm whitespace-nowrap border-r text-center">
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
                      <span className={(type === 'lessonTests' || type === 'compTests') && test.scores.vocab < 50 ? "text-red-600 font-bold" : ""}>
                        {test.scores.vocab}
                      </span>
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
                      <span className={(type === 'lessonTests' || type === 'compTests') && test.scores.grammar < 50 ? "text-red-600 font-bold" : ""}>
                        {isJLPT ? (test.scores.grammar + (test.scores.reading || 0)) : test.scores.grammar}
                      </span>
                    )}
                  </TableCell>
                  {!isJLPT && (
                    <TableCell className="py-2 text-sm text-center border-r">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={test.scores.reading}
                          onChange={(e) => updateTestScore(type, test.id, 'reading', Number(e.target.value))}
                          className="h-8 text-center"
                        />
                      ) : (
                        <span className={(type === 'lessonTests' || type === 'compTests') && test.scores.reading < 50 ? "text-red-600 font-bold" : ""}>
                          {test.scores.reading}
                        </span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="py-2 text-sm text-center border-r">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={test.scores.listening}
                        onChange={(e) => updateTestScore(type, test.id, 'listening', Number(e.target.value))}
                        className="h-8 text-center"
                      />
                    ) : (
                      <span className={(type === 'lessonTests' || type === 'compTests') && test.scores.listening < 50 ? "text-red-600 font-bold" : ""}>
                        {test.scores.listening}
                      </span>
                    )}
                  </TableCell>
                  {!isJLPT && (
                    <TableCell className="py-2 text-sm text-center border-r">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={test.scores.speaking}
                          onChange={(e) => updateTestScore(type, test.id, 'speaking', Number(e.target.value))}
                          className="h-8 text-center"
                        />
                      ) : (
                        <span className={(type === 'lessonTests' || type === 'compTests') && test.scores.speaking < 50 ? "text-red-600 font-bold" : ""}>
                          {test.scores.speaking}
                        </span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="py-2 text-sm text-center font-bold border-r">
                    {test.scores.vocab + test.scores.grammar + (test.scores.reading || 0) + test.scores.listening + (test.scores.speaking || 0)}
                  </TableCell>
                  <TableCell className="py-2 text-sm text-right">
                    {isEditing ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTest(type, test.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <span className={`font-bold ${test.result === "Giỏi" ? "text-blue-600" :
                        test.result === "Khá" ? "text-green-600" :
                          test.result === "Trung bình" ? "text-yellow-600" :
                            test.result === "Đỗ" ? "text-green-600" :
                              "text-red-600"
                        }`}>
                        {test.result || "-"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isJLPT ? 7 : 9} className="text-center text-muted-foreground py-6 text-sm italic">
                  Chưa có dữ liệu bài thi {title.toLowerCase()}
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
                speaking: acc.speaking + (t.scores.speaking || 0),
              }), { vocab: 0, grammar: 0, reading: 0, listening: 0, speaking: 0 });
              const count = tests.length;
              const avg = {
                vocab: (total.vocab / count).toFixed(1),
                grammar: (total.grammar / count).toFixed(1),
                reading: (total.reading / count).toFixed(1),
                listening: (total.listening / count).toFixed(1),
                speaking: (total.speaking / count).toFixed(1),
              };

              const sumAvg = parseFloat(avg.vocab) + parseFloat(avg.grammar) + parseFloat(avg.reading) + parseFloat(avg.listening) + parseFloat(avg.speaking);
              const percentage = (sumAvg / 500) * 100;

              let classification = "";
              if (percentage >= 85) classification = "Giỏi";
              else if (percentage >= 70) classification = "Khá";
              else if (percentage >= 50) classification = "Trung bình";
              else classification = "Chưa đạt";

              let colorClass = "text-red-600";
              let bgClass = "bg-red-50 hover:bg-red-50 border-red-200";

              if (classification === "Giỏi") {
                colorClass = "text-blue-600";
                bgClass = "bg-blue-50 hover:bg-blue-50 border-blue-200";
              } else if (classification === "Khá") {
                colorClass = "text-green-600";
                bgClass = "bg-green-50 hover:bg-green-50 border-green-200";
              } else if (classification === "Trung bình") {
                colorClass = "text-yellow-600";
                bgClass = "bg-yellow-50 hover:bg-yellow-50 border-yellow-200";
              }

              return (
                <TableRow className={`${bgClass} border-t-2`}>
                  <TableCell colSpan={2} className={`font-bold ${colorClass} border-r`}>Điểm trung bình tháng ( báo cáo công ty khách hàng)</TableCell>
                  <TableCell className={`text-center font-bold ${colorClass} border-r`}>{avg.vocab}</TableCell>
                  <TableCell className={`text-center font-bold ${colorClass} border-r`}>{avg.grammar}</TableCell>
                  <TableCell className={`text-center font-bold ${colorClass} border-r`}>{avg.reading}</TableCell>
                  <TableCell className={`text-center font-bold ${colorClass} border-r`}>{avg.listening}</TableCell>
                  <TableCell className={`text-center font-bold ${colorClass} border-r`}>{avg.speaking}</TableCell>
                  <TableCell className={`text-center font-bold ${colorClass} border-r`}>{(parseFloat(avg.vocab) + parseFloat(avg.grammar) + parseFloat(avg.reading) + parseFloat(avg.listening) + parseFloat(avg.speaking)).toFixed(1)}</TableCell>
                  <TableCell className={`text-right font-bold ${colorClass} whitespace-nowrap`}>
                    {classification}
                  </TableCell>
                </TableRow>
              );
            })()}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      {/* Current Level */}


      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ tăng trưởng năng lực tổng hợp</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lineData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 500]} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Legend />
              <Bar
                dataKey="score"
                fill="hsl(var(--primary))"
                name="Điểm tổng hợp"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
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
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
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

            <div className="flex flex-col items-center gap-6 mt-6">
              {/* Growth Chart - Top */}
              <div className="flex flex-col items-center w-full max-w-[800px] py-4 bg-muted/5 rounded-xl border border-dashed border-primary/20">
                <p className="font-bold text-lg mb-2 text-primary">Biểu đồ tăng trưởng</p>
                <div className="flex justify-center" style={{ width: '700px', height: '350px' }}>
                  <BarChart width={700} height={350} data={lineData} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 500]} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Legend />
                    <Bar
                      dataKey="score"
                      fill="hsl(var(--primary))"
                      name="Điểm tổng hợp"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </div>
              </div>

              {/* Radar Chart - Bottom */}
              <div className="flex flex-col items-center w-full max-w-[800px] py-4 bg-muted/5 rounded-xl border border-dashed border-primary/20">
                <p className="font-bold text-lg mb-2 text-primary">Biểu đồ kỹ năng</p>
                <div className="flex justify-center" style={{ width: '500px', height: '350px' }}>
                  <RadarChart width={500} height={350} data={currentRadarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
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


                {/* Render each section as its own table */}
                {renderTestTable("Bài kiểm tra sau mỗi bài ( giảng viên nhập - rada tăng trưởng)", "lessonTests")}
                {renderTestTable("Bài kiểm tra tổng ( mỗi tháng định kì 1 tới 2 bài )", "compTests")}
                {renderTestTable("Thi thử JLPT ( đánh giá trình độ hiện tại học viên )", "jlptTests")}


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
