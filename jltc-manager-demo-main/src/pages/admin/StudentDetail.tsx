import { useParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";
import StudentBasicInfo from "@/components/student/StudentBasicInfo";
import StudentPerformance from "@/components/student/StudentPerformance";
import StudentAttendance from "@/components/student/StudentAttendance";

import StudentFinance from "@/components/student/StudentFinance";
import StudentHistory from "@/components/student/StudentHistory";
import StudentNotes from "@/components/student/StudentNotes";

const StudentDetail = () => {
  const { id } = useParams();

  const studentData = {
    id: "HV0234",
    name: "Nguyễn Văn A",
    nameKanji: "阮文英",
    furigana: "グエン・ヴァン・アー",
    romaji: "Nguyen Van A",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "active",
    phone: "0901234567",
    email: "nguyenvana@email.com",
    class: "N4-02",
    studentType: "Kỹ sư",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={studentData.avatar} alt={studentData.name} />
              <AvatarFallback>{studentData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{studentData.name}</h1>
                <Badge className="bg-success">Đang học</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Mã HV: {studentData.id}</p>
              <p className="text-sm text-muted-foreground">Loại học viên: {studentData.studentType}</p>
              <p className="text-sm text-muted-foreground">Lớp: {studentData.class}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              In hồ sơ
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="basic">Thông tin</TabsTrigger>
            <TabsTrigger value="performance">Năng lực</TabsTrigger>
            <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
            <TabsTrigger value="finance">Học phí</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
            <TabsTrigger value="notes">Ghi chú</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <StudentBasicInfo />
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <StudentPerformance />
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <StudentAttendance />
          </TabsContent>


          <TabsContent value="finance" className="mt-6">
            <StudentFinance />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <StudentHistory />
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <StudentNotes />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default StudentDetail;
