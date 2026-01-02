import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, Users, BookOpen, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ScheduleSelector from "@/components/ScheduleSelector";
import TeacherSelector from "@/components/TeacherSelector";

interface ClassData {
  id: string;
  name: string;
  level: string;
  studentType: string;
  teacher: string;
  room: string;
  students: number;
  schedule: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming";
}

const initialClasses: ClassData[] = [
  { id: "1", name: "N5-01", level: "N5", studentType: "intern", teacher: "Yamada", room: "201", students: 15, schedule: "T2, T4, T6 - Tiết 1", startDate: "2024-01-15", endDate: "2024-06-15", status: "active" },
  { id: "2", name: "N5-02", level: "N5", studentType: "engineer", teacher: "Sato", room: "202", students: 16, schedule: "T2, T4, T6 - Tiết 2", startDate: "2024-01-15", endDate: "2024-06-15", status: "active" },
  { id: "3", name: "N4-01", level: "N4", studentType: "study_abroad", teacher: "Watanabe", room: "203", students: 14, schedule: "T3, T5 - Tiết 4", startDate: "2024-02-01", endDate: "2024-07-01", status: "active" },
  { id: "4", name: "N4-02", level: "N4", studentType: "japanese", teacher: "Tanaka", room: "204", students: 18, schedule: "T2, T4 - Tiết 3", startDate: "2024-01-20", endDate: "2024-06-20", status: "active" },
  { id: "5", name: "N3-01", level: "N3", studentType: "intern", teacher: "Suzuki", room: "301", students: 12, schedule: "T2, T4, T6 - Tiết 6", startDate: "2024-01-10", endDate: "2024-06-10", status: "active" },
  { id: "6", name: "N3-02", level: "N3", studentType: "engineer", teacher: "Nakamura", room: "302", students: 13, schedule: "T3, T5 - Tiết 5", startDate: "2024-02-15", endDate: "2024-07-15", status: "active" },
  { id: "7", name: "N2-01", level: "N2", studentType: "study_abroad", teacher: "Ito", room: "401", students: 10, schedule: "T5 - Tiết 6", startDate: "2024-03-01", endDate: "2024-08-01", status: "active" },
  { id: "8", name: "N5-03", level: "N5", studentType: "japanese", teacher: "Kobayashi", room: "205", students: 14, schedule: "T7 - Tiết 1,2", startDate: "2024-04-01", endDate: "2024-09-01", status: "upcoming" },
  { id: "9", name: "N4-03", level: "N4", studentType: "intern", teacher: "Sasaki", room: "206", students: 15, schedule: "CN - Tiết 3,4", startDate: "2023-06-01", endDate: "2023-12-01", status: "completed" },
];

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên lớp"),
  level: z.string().min(1, "Vui lòng chọn trình độ"),
  studentType: z.string().min(1, "Vui lòng chọn loại học sinh"),
  teacher: z.string().min(1, "Vui lòng chọn giáo viên"),
  room: z.string().min(1, "Vui lòng nhập phòng học"),
  schedule: z.string().min(1, "Vui lòng nhập lịch học"),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  status: z.enum(["active", "completed", "upcoming"]),
});

type FormValues = z.infer<typeof formSchema>;

const teachers = ["Yamada", "Sato", "Tanaka", "Watanabe", "Suzuki", "Nakamura", "Ito", "Kobayashi", "Sasaki", "Kato"];

const Classes = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassData[]>(initialClasses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassData | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      level: "",
      studentType: "",
      teacher: "",
      room: "",
      schedule: "",
      startDate: "",
      endDate: "",
      status: "upcoming",
    },
  });

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "all" || cls.level === filterLevel;
    const matchesStatus = filterStatus === "all" || cls.status === filterStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingClass(null);
    form.reset({
      name: "",
      level: "",
      studentType: "",
      teacher: "",
      room: "",
      schedule: "",
      startDate: "",
      endDate: "",
      status: "upcoming",
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (cls: ClassData) => {
    setEditingClass(cls);
    form.reset({
      name: cls.name,
      level: cls.level,
      studentType: cls.studentType,
      teacher: cls.teacher,
      room: cls.room,
      schedule: cls.schedule,
      startDate: cls.startDate,
      endDate: cls.endDate,
      status: cls.status,
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (cls: ClassData) => {
    setDeletingClass(cls);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    if (editingClass) {
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === editingClass.id
            ? { ...cls, name: data.name, level: data.level, studentType: data.studentType, teacher: data.teacher, room: data.room, schedule: data.schedule, startDate: data.startDate, endDate: data.endDate, status: data.status }
            : cls
        )
      );
      toast({
        title: "Cập nhật thành công",
        description: `Lớp ${data.name} đã được cập nhật`,
      });
    } else {
      const newClass: ClassData = {
        id: String(Date.now()),
        name: data.name,
        level: data.level,
        studentType: data.studentType,
        teacher: data.teacher,
        room: data.room,
        schedule: data.schedule,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        students: 0,
      };
      setClasses((prev) => [...prev, newClass]);
      toast({
        title: "Thêm lớp thành công",
        description: `Lớp ${data.name} đã được tạo`,
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingClass) {
      setClasses((prev) => prev.filter((cls) => cls.id !== deletingClass.id));
      toast({
        title: "Xóa thành công",
        description: `Lớp ${deletingClass.name} đã được xóa`,
      });
      setDeleteDialogOpen(false);
      setDeletingClass(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Đang học</Badge>;
      case "completed":
        return <Badge variant="secondary">Đã hoàn thành</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500">Sắp khai giảng</Badge>;
      default:
        return null;
    }
  };

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      N5: "bg-emerald-500",
      N4: "bg-blue-500",
      N3: "bg-amber-500",
      N2: "bg-orange-500",
      N1: "bg-red-500",
    };
    return <Badge className={colors[level] || "bg-gray-500"}>{level}</Badge>;
  };

  const getStudentTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      study_abroad: "Du học",
      engineer: "Kỹ sư",
      intern: "Thực tập sinh",
      japanese: "Tiếng nhật",
    };
    const colors: Record<string, string> = {
      study_abroad: "bg-purple-500",
      engineer: "bg-cyan-500",
      intern: "bg-pink-500",
      japanese: "bg-indigo-500",
    };
    return <Badge className={colors[type] || "bg-gray-500"}>{labels[type] || type}</Badge>;
  };

  const stats = {
    total: classes.length,
    active: classes.filter((c) => c.status === "active").length,
    students: classes.reduce((sum, c) => sum + c.students, 0),
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Quản lý lớp học</h1>
            <p className="text-muted-foreground">Thêm, sửa, xóa và quản lý các lớp học</p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm lớp mới
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng số lớp</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <GraduationCap className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng học viên</p>
                <p className="text-2xl font-bold">{stats.students}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên lớp hoặc giáo viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Trình độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trình độ</SelectItem>
                  <SelectItem value="N5">N5</SelectItem>
                  <SelectItem value="N4">N4</SelectItem>
                  <SelectItem value="N3">N3</SelectItem>
                  <SelectItem value="N2">N2</SelectItem>
                  <SelectItem value="N1">N1</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang học</SelectItem>
                  <SelectItem value="upcoming">Sắp khai giảng</SelectItem>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách lớp học ({filteredClasses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên lớp</TableHead>
                  <TableHead>Loại HV</TableHead>
                  <TableHead>Giáo viên</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Học viên</TableHead>
                  <TableHead>Lịch học</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{getStudentTypeBadge(cls.studentType)}</TableCell>
                    <TableCell>{cls.teacher}</TableCell>
                    <TableCell>{cls.room}</TableCell>
                    <TableCell>{cls.students} HV</TableCell>
                    <TableCell className="text-sm">{cls.schedule}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/classes/${cls.name}`)}
                        >
                          Xem
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenEdit(cls)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleOpenDelete(cls)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingClass ? "Chỉnh sửa lớp học" : "Thêm lớp học mới"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên lớp</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: N5-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại học sinh</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="study_abroad">Du học</SelectItem>
                        <SelectItem value="engineer">Kỹ sư</SelectItem>
                        <SelectItem value="intern">Thực tập sinh</SelectItem>
                        <SelectItem value="japanese">Tiếng nhật</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phòng học</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: 201" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giáo viên phụ trách</FormLabel>
                    <FormControl>
                      <TeacherSelector
                        value={field.value}
                        onChange={field.onChange}
                        teachers={teachers}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lịch học</FormLabel>
                    <FormControl>
                      <ScheduleSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingClass ? "Cập nhật" : "Thêm lớp"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa lớp học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lớp <strong>{deletingClass?.name}</strong>?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Classes;
