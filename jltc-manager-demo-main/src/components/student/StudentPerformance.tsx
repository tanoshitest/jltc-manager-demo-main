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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useState } from "react";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";

const lineData = [
  { month: "T7/2024", score: 480 },
  { month: "T8/2024", score: 520 },
  { month: "T9/2024", score: 560 },
  { month: "T10/2024", score: 590 },
  { month: "T11/2024", score: 620 },
];

const radarDataByMonth: Record<string, any[]> = {
  "10-2024": [
    { skill: "Vocabulary", value: 90 },
    { skill: "Grammar", value: 85 },
    { skill: "Reading", value: 90 },
    { skill: "Listening", value: 75 },
    { skill: "Speaking", value: 75 },
    { skill: "Expression", value: 80 },
  ],
  "11-2024": [
    { skill: "Vocabulary", value: 85 },
    { skill: "Grammar", value: 80 },
    { skill: "Reading", value: 90 },
    { skill: "Listening", value: 78 },
    { skill: "Speaking", value: 90 },
    { skill: "Expression", value: 82 },
  ],
};

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
    jlptResult: "不 (Không đỗ)",
    overallEval: "秀",
    progress: "入門",
    comment: "学習態度が良好で、内容の習得が早いです。聴解力と応答がスムーズで、質問の趣旨に的確に答えられます。会社の規則を遵守しています。"
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
    jlptResult: "不",
    overallEval: "秀",
    progress: "第18課",
    comment: "語彙をよく記憶できており、文を作る力や反応も良好で、授業中はしっかりと集中して受講できます。"
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
  jlptResult: "",
  overallEval: "良",
  progress: "",
  comment: "",
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
  const currentRadarData = radarDataByMonth[evaluationKey] || radarDataByMonth["11-2024"];
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
      jlptResult: currentEvaluation.jlptResult,
      overallEval: currentEvaluation.overallEval,
      progress: currentEvaluation.progress,
      comment: currentEvaluation.comment,
    });
    setDialogOpen(true);
  };

  const handleDelete = () => {
    const key = evaluationKey;
    setEvaluations((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    toast.success(`Đã xóa đánh giá tháng ${selectedMonth}/${selectedYear}`);
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

  return (
    <div className="space-y-6">
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
          <CardTitle>Biểu đồ kỹ năng 6 chiều - Tháng {selectedMonth}/{selectedYear}</CardTitle>
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
      <Card>
        <CardHeader>
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
                  <Button size="sm" variant="outline" onClick={handleOpenEdit}>
                    <Edit className="w-4 h-4 mr-1" /> Sửa
                  </Button>
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
                <h3 className="text-xl font-bold text-foreground">{currentEvaluation.title}</h3>
                <p className="text-sm text-muted-foreground">{currentEvaluation.period}</p>
              </div>

              {/* General Evaluation (B) */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">(B) 一般評価 – Đánh giá chung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">性格 (Tính cách)</span>
                    <span className="text-sm">{currentEvaluation.character}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">健康状態</span>
                    <span className="text-lg">●</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">協調性</span>
                    <span className="text-lg">●</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">出席状況</span>
                    <span className="text-lg">●</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">規律厳守</span>
                    <span className="text-lg">●</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">学習態度</span>
                    <span className="text-lg">●</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded col-span-full">
                    <span className="text-sm font-medium">オリエンテーション知識の取得度</span>
                    <span className="text-lg">●</span>
                  </div>
                </div>
              </div>

              {/* Japanese Ability (C) */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">(C) 日本語能力・知識習得度 – Năng lực tiếng Nhật</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">筆記力 (Viết)</span>
                    <span className="text-lg">{currentEvaluation.writing}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">読解力 (Đọc)</span>
                    <span className="text-lg">{currentEvaluation.reading}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">聴解力 (Nghe)</span>
                    <span className="text-lg">{currentEvaluation.listening}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">会話力 (Nói)</span>
                    <span className="text-lg">{currentEvaluation.speaking}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">学力</span>
                    <Badge className="bg-success">{currentEvaluation.academicLevel}</Badge>
                  </div>
                </div>
              </div>

              {/* JLPT */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">日本語能力試験 (JLPT)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">レベル</span>
                    <Badge className="bg-primary">{currentEvaluation.jlptLevel}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm font-medium">合格判定</span>
                    <Badge variant="outline" className="text-destructive">{currentEvaluation.jlptResult}</Badge>
                  </div>
                </div>
              </div>

              {/* Overall Evaluation & Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">(D) 総合評価 – Đánh giá tổng hợp</h3>
                  <div className="p-4 bg-success/10 rounded text-center">
                    <span className="text-3xl font-bold text-success">{currentEvaluation.overallEval}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">学習進捗 – Tiến độ bài học</h3>
                  <div className="p-4 bg-primary/10 rounded text-center">
                    <span className="text-xl font-semibold text-primary">{currentEvaluation.progress}</span>
                  </div>
                </div>
              </div>

              {/* Teacher Comment */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">コメント (Nhận xét giáo viên)</h3>
                <div className="p-4 bg-muted/30 rounded">
                  <p className="text-sm leading-relaxed">
                    {currentEvaluation.comment}
                  </p>
                </div>
              </div>
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

            <div className="space-y-2">
              <Label>Thời gian học (学習期間)</Label>
              <Input
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="VD: 学習期間: 2ヶ月"
              />
            </div>

            <div className="space-y-2">
              <Label>Tính cách (性格)</Label>
              <Input
                value={formData.character}
                onChange={(e) => setFormData({ ...formData, character: e.target.value })}
                placeholder="VD: 明るく、活発"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Viết (筆記力)</Label>
                <Select value={formData.writing} onValueChange={(v) => setFormData({ ...formData, writing: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {symbolOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Đọc (読解力)</Label>
                <Select value={formData.reading} onValueChange={(v) => setFormData({ ...formData, reading: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {symbolOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nghe (聴解力)</Label>
                <Select value={formData.listening} onValueChange={(v) => setFormData({ ...formData, listening: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {symbolOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nói (会話力)</Label>
                <Select value={formData.speaking} onValueChange={(v) => setFormData({ ...formData, speaking: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {symbolOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Học lực (学力)</Label>
                <Select value={formData.academicLevel} onValueChange={(v) => setFormData({ ...formData, academicLevel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {academicLevelOptions.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>JLPT Level</Label>
                <Select value={formData.jlptLevel} onValueChange={(v) => setFormData({ ...formData, jlptLevel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {jlptLevelOptions.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Đánh giá tổng hợp</Label>
                <Select value={formData.overallEval} onValueChange={(v) => setFormData({ ...formData, overallEval: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {overallEvalOptions.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Kết quả JLPT (合格判定)</Label>
              <Input
                value={formData.jlptResult}
                onChange={(e) => setFormData({ ...formData, jlptResult: e.target.value })}
                placeholder="VD: 不 (Không đỗ) hoặc 合 (Đỗ)"
              />
            </div>

            <div className="space-y-2">
              <Label>Tiến độ bài học (学習進捗)</Label>
              <Input
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                placeholder="VD: 第18課"
              />
            </div>

            <div className="space-y-2">
              <Label>Nhận xét giáo viên (コメント)</Label>
              <Textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                placeholder="Nhập nhận xét..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>{isEditing ? "Cập nhật" : "Tạo mới"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPerformance;
