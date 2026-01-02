import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, GraduationCap, BookOpen } from "lucide-react";

interface TeacherBasicInfoProps {
  teacher: {
    id: string;
    name: string;
    phone: string;
    zalo: string;
    email: string;
    subject: string;
    level: string;
    type: string;
    status: string;
    joinDate: string;
    totalHours: number;
    classes: string[];
    rating: number;
    specialization: string;
    education: string;
    experience: string;
    notes: string;
  };
}

const TeacherBasicInfo = ({ teacher }: TeacherBasicInfoProps) => {
  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Thông tin liên hệ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Số điện thoại</p>
                <p className="font-medium">{teacher.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Zalo</p>
                <p className="font-medium">{teacher.zalo}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded md:col-span-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{teacher.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education & Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Học vấn & Kinh nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted/30 rounded">
            <p className="text-xs text-muted-foreground mb-1">Trình độ học vấn</p>
            <p className="font-medium">{teacher.education}</p>
          </div>
          <div className="p-3 bg-muted/30 rounded">
            <p className="text-xs text-muted-foreground mb-1">Kinh nghiệm</p>
            <p className="font-medium">{teacher.experience}</p>
          </div>
          <div className="p-3 bg-muted/30 rounded">
            <p className="text-xs text-muted-foreground mb-1">Chuyên môn</p>
            <p className="font-medium">{teacher.specialization}</p>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Thông tin giảng dạy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted/30 rounded text-center">
              <p className="text-xs text-muted-foreground mb-1">Môn giảng dạy</p>
              <Badge variant="outline" className="text-lg">{teacher.subject}</Badge>
            </div>
            <div className="p-3 bg-muted/30 rounded text-center">
              <p className="text-xs text-muted-foreground mb-1">Trình độ JLPT</p>
              <Badge className="bg-primary text-lg">{teacher.level}</Badge>
            </div>
            <div className="p-3 bg-muted/30 rounded text-center">
              <p className="text-xs text-muted-foreground mb-1">Ngày tham gia</p>
              <p className="font-medium">{new Date(teacher.joinDate).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Classes */}
      <Card>
        <CardHeader>
          <CardTitle>Các lớp đang phụ trách</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {teacher.classes.map((className) => (
              <Badge key={className} variant="outline" className="text-base px-4 py-2">
                {className}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Ghi chú</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{teacher.notes}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherBasicInfo;
