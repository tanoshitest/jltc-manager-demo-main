import TeacherLayout from "@/components/TeacherLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Search,
  Eye,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  student_code: string;
  name: string;
  avatar_url: string | null;
  zalo: string | null;
  class: string | null;
  course: string | null;
  student_type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  active: { label: "Đang học", color: "bg-success" },
  hold: { label: "Bảo lưu", color: "bg-warning" },
  inactive: { label: "Nghỉ học", color: "bg-destructive" },
  completed: { label: "Hoàn thành", color: "bg-primary" },
};

const studentTypeConfig: Record<string, string> = {
  thuc_tap_sinh: "Thực tập sinh",
  ki_su: "Kĩ sư",
  du_hoc: "Du học",
  tieng_nhat: "Tiếng nhật",
};

const TeacherStudents = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [studentTypeFilter, setStudentTypeFilter] = useState("all");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch students from database
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast.error("Lỗi khi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on all criteria
  const filteredStudents = students.filter((student) => {
    const matchesSearch = searchQuery === "" || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.zalo && student.zalo.includes(searchQuery));

    const matchesClass = classFilter === "all" || 
      (student.class && student.class.toLowerCase() === classFilter.toLowerCase());

    const matchesStatus = statusFilter === "all" || 
      student.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Danh sách học viên</h1>
            <p className="text-muted-foreground">Xem thông tin học viên</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, mã, Zalo..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  <SelectItem value="n5-01">N5-01</SelectItem>
                  <SelectItem value="n4-01">N4-01</SelectItem>
                  <SelectItem value="n4-02">N4-02</SelectItem>
                  <SelectItem value="n3-01">N3-01</SelectItem>
                  <SelectItem value="n2-01">N2-01</SelectItem>
                </SelectContent>
              </Select>
              <Select value={studentTypeFilter} onValueChange={setStudentTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Loại học sinh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="thuc_tap_sinh">Thực tập sinh</SelectItem>
                  <SelectItem value="ki_su">Kĩ sư</SelectItem>
                  <SelectItem value="du_hoc">Du học</SelectItem>
                  <SelectItem value="tieng_nhat">Tiếng nhật</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang học</SelectItem>
                  <SelectItem value="hold">Bảo lưu</SelectItem>
                  <SelectItem value="inactive">Nghỉ học</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ảnh</TableHead>
                      <TableHead>Mã HV</TableHead>
                      <TableHead>Tên học viên</TableHead>
                      <TableHead>Zalo</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Loại học viên</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Công cụ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Chưa có học viên nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Avatar>
                              <AvatarImage src={student.avatar_url || undefined} alt={student.name} />
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">{student.student_code}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.zalo || "-"}</TableCell>
                          <TableCell>
                            {student.class ? <Badge variant="outline">{student.class}</Badge> : "-"}
                          </TableCell>
                          <TableCell>
                            {student.student_type ? (
                              <Badge variant="outline">{studentTypeConfig[student.student_type] || student.student_type}</Badge>
                            ) : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusConfig[student.status as keyof typeof statusConfig]?.color || "bg-muted"}>
                              {statusConfig[student.status as keyof typeof statusConfig]?.label || student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/teacher/students/${student.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
};

export default TeacherStudents;
