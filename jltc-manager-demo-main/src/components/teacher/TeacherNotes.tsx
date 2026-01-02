import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const initialNotes = [
  {
    id: 1,
    date: "05/12/2024",
    author: "Admin Nguyễn",
    content: "Giáo viên có phương pháp giảng dạy hiệu quả, được học viên yêu mến. Cần xem xét tăng lương trong kỳ đánh giá sắp tới.",
    type: "positive",
  },
  {
    id: 2,
    date: "01/12/2024",
    author: "Admin Trần",
    content: "Đã hoàn thành tốt khóa đào tạo phương pháp mới. Áp dụng ngay vào giảng dạy và cho kết quả tốt.",
    type: "positive",
  },
  {
    id: 3,
    date: "15/11/2024",
    author: "Admin Nguyễn",
    content: "Lưu ý: Giáo viên hay đến trễ 5-10 phút. Đã nhắc nhở lần 1.",
    type: "warning",
  },
  {
    id: 4,
    date: "10/10/2024",
    author: "Admin Lê",
    content: "Học viên lớp N4-02 feedback rất tích cực về cách giảng dạy của cô. Đề xuất cho cô đào tạo thêm giáo viên mới.",
    type: "positive",
  },
];

const typeConfig: Record<string, { color: string; label: string }> = {
  positive: { color: "bg-success", label: "Tích cực" },
  warning: { color: "bg-warning", label: "Lưu ý" },
  neutral: { color: "bg-muted", label: "Thông tin" },
};

const TeacherNotes = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Vui lòng nhập nội dung ghi chú");
      return;
    }

    const note = {
      id: Date.now(),
      date: new Date().toLocaleDateString("vi-VN"),
      author: "Admin",
      content: newNote,
      type: "neutral",
    };

    setNotes([note, ...notes]);
    setNewNote("");
    setIsAdding(false);
    toast.success("Đã thêm ghi chú");
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    toast.success("Đã xóa ghi chú");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ghi chú nội bộ
          </CardTitle>
          <Button onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm ghi chú
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <div className="p-4 border rounded-lg space-y-3">
              <Textarea
                placeholder="Nhập ghi chú mới..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddNote}>Lưu ghi chú</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {notes.map((note) => {
              const config = typeConfig[note.type];
              return (
                <div key={note.id} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={config.color}>{config.label}</Badge>
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                      <span className="text-xs text-muted-foreground">bởi {note.author}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-foreground">{note.content}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notes Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng kết ghi chú</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 rounded text-center">
              <p className="text-3xl font-bold text-success">
                {notes.filter((n) => n.type === "positive").length}
              </p>
              <p className="text-sm text-muted-foreground">Ghi chú tích cực</p>
            </div>
            <div className="p-4 bg-warning/10 rounded text-center">
              <p className="text-3xl font-bold text-warning">
                {notes.filter((n) => n.type === "warning").length}
              </p>
              <p className="text-sm text-muted-foreground">Ghi chú lưu ý</p>
            </div>
            <div className="p-4 bg-muted rounded text-center">
              <p className="text-3xl font-bold text-foreground">{notes.length}</p>
              <p className="text-sm text-muted-foreground">Tổng số ghi chú</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherNotes;
