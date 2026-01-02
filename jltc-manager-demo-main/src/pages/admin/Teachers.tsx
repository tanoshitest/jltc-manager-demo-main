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
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Eye,
  UserX,
  Phone,
  Mail,
  Calendar,
  Clock,
  BookOpen,
  Award,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const teachers = [
  {
    id: "GV001",
    name: "Yamada Hanako",
    avatar: "https://i.pravatar.cc/150?img=20",
    phone: "0912345678",
    zalo: "0912345678",
    email: "yamada@japanese-center.edu.vn",
    subject: "Tổng hợp",
    level: "N1",
    type: "permanent",
    status: "active",
    joinDate: "2020-01-15",
    totalHours: 1240,
    classes: ["N5-01", "N4-02", "N3-01"],
    rating: 4.8,
    specialization: "Ngữ pháp cơ bản, Kanji",
    education: "Đại học Tokyo - Chuyên ngành Giáo dục Tiếng Nhật",
    experience: "5 năm giảng dạy tại Việt Nam",
    notes: "Giáo viên tận tâm, phương pháp giảng dạy hiệu quả, được học viên yêu mến.",
  },
  {
    id: "GV002",
    name: "Tanaka Taro",
    avatar: "https://i.pravatar.cc/150?img=21",
    phone: "0912345679",
    zalo: "0912345679",
    email: "tanaka@japanese-center.edu.vn",
    subject: "Kanji",
    level: "N2",
    type: "permanent",
    status: "active",
    joinDate: "2019-03-20",
    totalHours: 1580,
    classes: ["N5-02", "N4-01"],
    rating: 4.7,
    specialization: "Kanji, Chữ Hán",
    education: "Đại học Waseda - Ngôn ngữ học",
    experience: "7 năm kinh nghiệm",
    notes: "Chuyên gia về Kanji, phương pháp ghi nhớ hiệu quả.",
  },
  {
    id: "GV003",
    name: "Suzuki Yuki",
    avatar: "https://i.pravatar.cc/150?img=22",
    phone: "0912345680",
    zalo: "0912345680",
    email: "suzuki@japanese-center.edu.vn",
    subject: "Hội thoại",
    level: "N1",
    type: "parttime",
    status: "teaching",
    joinDate: "2021-06-10",
    totalHours: 650,
    classes: ["N4-03", "N3-02"],
    rating: 4.9,
    specialization: "Giao tiếp, Hội thoại thực tế",
    education: "Đại học Osaka - Sư phạm",
    experience: "3 năm giảng dạy",
    notes: "Năng động, tạo không khí học tập thoải mái.",
  },
  {
    id: "GV004",
    name: "Sato Kenji",
    avatar: "https://i.pravatar.cc/150?img=23",
    phone: "0912345681",
    zalo: "0912345681",
    email: "sato@japanese-center.edu.vn",
    subject: "Ngữ pháp",
    level: "N2",
    type: "parttime",
    status: "teaching",
    joinDate: "2022-01-05",
    totalHours: 420,
    classes: ["N5-03"],
    rating: 4.6,
    specialization: "Ngữ pháp N5-N3",
    education: "Đại học Kyoto - Văn học Nhật",
    experience: "2 năm",
    notes: "Giải thích rõ ràng, dễ hiểu.",
  },
  {
    id: "GV005",
    name: "Watanabe Yui",
    avatar: "https://i.pravatar.cc/150?img=24",
    phone: "0912345682",
    zalo: "0912345682",
    email: "watanabe@japanese-center.edu.vn",
    subject: "Nghe",
    level: "N1",
    type: "permanent",
    status: "active",
    joinDate: "2018-09-12",
    totalHours: 2100,
    classes: ["N3-03", "N2-01", "N2-02"],
    rating: 4.9,
    specialization: "Luyện nghe, Phát âm chuẩn",
    education: "Đại học Keio - Ngôn ngữ học ứng dụng",
    experience: "8 năm",
    notes: "Giáo viên xuất sắc, phương pháp luyện nghe hiệu quả cao.",
  },
  {
    id: "GV006",
    name: "Ito Mai",
    avatar: "https://i.pravatar.cc/150?img=25",
    phone: "0912345683",
    zalo: "0912345683",
    email: "ito@japanese-center.edu.vn",
    subject: "Đọc",
    level: "N2",
    type: "parttime",
    status: "leave",
    joinDate: "2021-11-20",
    totalHours: 380,
    classes: ["N4-04"],
    rating: 4.5,
    specialization: "Đọc hiểu, Từ vựng",
    education: "Đại học Nagoya - Sư phạm",
    experience: "2 năm",
    notes: "Đang nghỉ phép thai sản.",
  },
];

const statusConfig = {
  active: { label: "Có thể dạy", color: "bg-success" },
  teaching: { label: "Đang dạy", color: "bg-primary" },
  leave: { label: "Nghỉ phép", color: "bg-warning" },
};

const typeConfig = {
  permanent: { label: "Cơ hữu", color: "bg-primary" },
  parttime: { label: "Thỉnh giảng", color: "bg-secondary" },
};

const Teachers = () => {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<typeof teachers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    zalo: "",
    email: "",
    subjects: [] as string[],
    type: "permanent",
  });

  const handleViewTeacher = (teacher: typeof teachers[0]) => {
    navigate(`/admin/teachers/${teacher.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đã thêm giáo viên thành công!");
    setAddDialogOpen(false);
    setFormData({
      name: "",
      phone: "",
      zalo: "",
      email: "",
      subjects: [],
      type: "permanent",
    });
  };

  const handleDeleteClick = (teacher: typeof teachers[0]) => {
    setTeacherToDelete(teacher);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (teacherToDelete) {
      toast.success(`Đã xóa giáo viên ${teacherToDelete.name} thành công!`);
      setDeleteDialogOpen(false);
      setTeacherToDelete(null);
    }
  };

  // Map subject values for filtering
  const subjectMap: Record<string, string> = {
    "general": "Tổng hợp",
    "kanji": "Kanji",
    "speaking": "Hội thoại",
    "grammar": "Ngữ pháp",
    "listening": "Nghe",
    "reading": "Đọc",
  };

  // Filter teachers based on all criteria
  const filteredTeachers = teachers.filter((teacher) => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.phone.includes(searchQuery) ||
      teacher.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Subject filter
    const matchesSubject = subjectFilter === "all" || 
      teacher.subject === subjectMap[subjectFilter];

    // Type filter
    const matchesType = typeFilter === "all" || 
      teacher.type === typeFilter;

    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý giáo viên</h1>
            <p className="text-muted-foreground">Danh sách và thông tin giáo viên</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary-dark"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm giáo viên
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, số điện thoại..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả môn</SelectItem>
                  <SelectItem value="general">Tổng hợp</SelectItem>
                  <SelectItem value="kanji">Kanji</SelectItem>
                  <SelectItem value="speaking">Hội thoại</SelectItem>
                  <SelectItem value="grammar">Ngữ pháp</SelectItem>
                  <SelectItem value="listening">Nghe</SelectItem>
                  <SelectItem value="reading">Đọc</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Loại giáo viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="permanent">Cơ hữu</SelectItem>
                  <SelectItem value="parttime">Thỉnh giảng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ảnh</TableHead>
                    <TableHead>Mã GV</TableHead>
                    <TableHead>Tên giáo viên</TableHead>
                    <TableHead>Môn dạy</TableHead>
                    <TableHead>Loại giáo viên</TableHead>
                    <TableHead className="text-right">Công cụ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{teacher.id}</TableCell>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{teacher.subject}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeConfig[teacher.type as keyof typeof typeConfig].color}>
                          {typeConfig[teacher.type as keyof typeof typeConfig].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewTeacher(teacher)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(teacher)}>
                            <UserX className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Add Teacher Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Thêm giáo viên mới</DialogTitle>
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
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zalo">Zalo *</Label>
                <Input
                  id="zalo"
                  required
                  value={formData.zalo}
                  onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                  placeholder="Nhập số Zalo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập email"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Môn dạy *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-muted/30">
                  {[
                    { value: "general", label: "Tổng hợp" },
                    { value: "kanji", label: "Kanji" },
                    { value: "speaking", label: "Hội thoại" },
                    { value: "grammar", label: "Ngữ pháp" },
                    { value: "listening", label: "Nghe" },
                    { value: "reading", label: "Đọc" },
                  ].map((subject) => (
                    <div key={subject.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subject-${subject.value}`}
                        checked={formData.subjects.includes(subject.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, subjects: [...formData.subjects, subject.value] });
                          } else {
                            setFormData({ ...formData, subjects: formData.subjects.filter(s => s !== subject.value) });
                          }
                        }}
                      />
                      <Label htmlFor={`subject-${subject.value}`} className="cursor-pointer font-normal">
                        {subject.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Loại giáo viên *</Label>
                <Select
                  required
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Cơ hữu</SelectItem>
                    <SelectItem value="parttime">Thỉnh giảng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-dark">
                Thêm giáo viên
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa giáo viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa giáo viên <span className="font-semibold text-foreground">{teacherToDelete?.name}</span> (Mã: {teacherToDelete?.id})? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Teachers;
