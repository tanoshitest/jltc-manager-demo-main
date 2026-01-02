import AdminLayout from "@/components/AdminLayout";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
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

const Students = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  
  const [statusFilter, setStatusFilter] = useState("all");
  const [studentTypeFilter, setStudentTypeFilter] = useState("all");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    zalo: "",
    class: "",
    course: "",
    student_type: "",
    status: "active",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('students')
        .insert([{
          name: formData.name.trim(),
          zalo: formData.zalo.trim() || null,
          class: formData.class || null,
          course: formData.course || null,
          status: formData.status,
          student_code: '',
        }] as any);

      if (error) throw error;

      toast.success("Đã thêm học viên thành công!");
      setDialogOpen(false);
      setFormData({ name: "", zalo: "", class: "", course: "", student_type: "", status: "active" });
      fetchStudents();
    } catch (error: any) {
      toast.error("Lỗi khi thêm học viên: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa học viên "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Đã xóa học viên thành công!");
      fetchStudents();
    } catch (error: any) {
      toast.error("Lỗi khi xóa học viên: " + error.message);
    }
  };

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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý học viên</h1>
            <p className="text-muted-foreground">Danh sách và thông tin học viên</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              className="bg-primary hover:bg-primary-dark"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm học viên
            </Button>
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
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/admin/students/${student.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(student.id, student.name)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
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

      {/* Add Student Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Thêm học viên mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zalo">Zalo</Label>
                <Input
                  id="zalo"
                  value={formData.zalo}
                  onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                  placeholder="Nhập số Zalo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Lớp</Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) => setFormData({ ...formData, class: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N5-01">N5-01</SelectItem>
                    <SelectItem value="N4-01">N4-01</SelectItem>
                    <SelectItem value="N4-02">N4-02</SelectItem>
                    <SelectItem value="N3-01">N3-01</SelectItem>
                    <SelectItem value="N2-01">N2-01</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Khóa</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => setFormData({ ...formData, course: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khóa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="K44">K44</SelectItem>
                    <SelectItem value="K45">K45</SelectItem>
                    <SelectItem value="K46">K46</SelectItem>
                    <SelectItem value="K47">K47</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_type">Loại học sinh</Label>
                <Select
                  value={formData.student_type}
                  onValueChange={(value) => setFormData({ ...formData, student_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại học sinh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thuc_tap_sinh">Thực tập sinh</SelectItem>
                    <SelectItem value="ki_su">Kĩ sư</SelectItem>
                    <SelectItem value="du_hoc">Du học</SelectItem>
                    <SelectItem value="tieng_nhat">Tiếng nhật</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái *</Label>
                <Select
                  required
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang học</SelectItem>
                    <SelectItem value="hold">Bảo lưu</SelectItem>
                    <SelectItem value="inactive">Nghỉ học</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  "Thêm học viên"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Students;