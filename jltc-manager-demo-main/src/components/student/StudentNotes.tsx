import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Phone, MessageSquare, Mail, Edit, Trash2 } from "lucide-react";

const notes = {
  counseling: [
    {
      date: "25/11/2024",
      author: "Nguyễn Thị Tư vấn",
      avatar: "https://i.pravatar.cc/150?img=8",
      content: "Tư vấn về lộ trình học N3. Học viên có động lực tốt, cần thêm tài liệu luyện đọc.",
      type: "Tư vấn học tập",
    },
    {
      date: "15/10/2024",
      author: "Trần Văn Tư vấn",
      avatar: "https://i.pravatar.cc/150?img=9",
      content: "Tư vấn về công việc tại Nhật. Giới thiệu một số công ty và vị trí phù hợp.",
      type: "Tư vấn việc làm",
    },
  ],
  contact: [
    {
      date: "28/11/2024",
      type: "Zalo",
      author: "Admin",
      content: "Nhắc nhở đóng học phí tháng 12. Học viên xác nhận sẽ đóng vào 01/12.",
    },
    {
      date: "20/11/2024",
      type: "Điện thoại",
      author: "Admin",
      content: "Thông báo lịch phỏng vấn. Học viên đồng ý tham gia.",
    },
    {
      date: "10/11/2024",
      type: "SMS",
      author: "Hệ thống",
      content: "Nhắc nhở điểm danh và lịch học tuần này.",
    },
  ],
  teacher: [
    {
      date: "30/11/2024",
      author: "Yamada-sensei",
      avatar: "https://i.pravatar.cc/150?img=10",
      content: "Học viên tiến bộ rõ rệt trong tháng này. Kỹ năng đọc hiểu tốt, nghe cần cải thiện.",
      subject: "Tổng hợp",
    },
    {
      date: "15/11/2024",
      author: "Tanaka-sensei",
      avatar: "https://i.pravatar.cc/150?img=11",
      content: "Tham gia tích cực trong giờ học. Cần luyện thêm kanji.",
      subject: "Kanji",
    },
    {
      date: "01/11/2024",
      author: "Suzuki-sensei",
      avatar: "https://i.pravatar.cc/150?img=12",
      content: "Giao tiếp tốt, phát âm chuẩn. Khuyến khích tham gia các hoạt động nhóm.",
      subject: "Hội thoại",
    },
  ],
};

const StudentNotes = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thêm ghi chú nhanh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="Nhập ghi chú..." rows={3} />
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Lưu ghi chú
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Counseling Notes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lịch sử tư vấn</CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Thêm tư vấn
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notes.counseling.map((note, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={note.avatar} alt={note.author} />
                      <AvatarFallback>{note.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{note.author}</p>
                      <p className="text-xs text-muted-foreground">{note.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{note.type}</Badge>
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-3">{note.content}</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-3 h-3 mr-1" />
                    Sửa
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-3 h-3 mr-1 text-destructive" />
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lịch sử liên hệ</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Gọi
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Zalo
            </Button>
            <Button size="sm" variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notes.contact.map((note, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    note.type === "Zalo"
                      ? "bg-primary/10"
                      : note.type === "Điện thoại"
                      ? "bg-success/10"
                      : "bg-warning/10"
                  }`}
                >
                  {note.type === "Zalo" && <MessageSquare className="w-5 h-5 text-primary" />}
                  {note.type === "Điện thoại" && <Phone className="w-5 h-5 text-success" />}
                  {note.type === "SMS" && <Mail className="w-5 h-5 text-warning" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline">{note.type}</Badge>
                    <span className="text-xs text-muted-foreground">{note.date}</span>
                  </div>
                  <p className="text-sm text-foreground">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">Người thực hiện: {note.author}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Ghi chú giáo viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notes.teacher.map((note, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={note.avatar} alt={note.author} />
                      <AvatarFallback>{note.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{note.author}</p>
                      <p className="text-xs text-muted-foreground">{note.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{note.subject}</Badge>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentNotes;
