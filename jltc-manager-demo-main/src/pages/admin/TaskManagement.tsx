import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Calendar, CheckCircle2, Clock, AlertCircle, FileText, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import TaskGanttChart from "@/components/TaskGanttChart";
import { startOfMonth, endOfMonth, addMonths, subMonths, format as formatDate } from "date-fns";
import { vi } from "date-fns/locale";
import { BarChart2, ChevronLeft, ChevronRight, User, LayoutList } from "lucide-react";

// Mock Data - 7 Vietnamese Teachers
const MOCK_TEACHERS = [
    { id: "huong", name: "Hường" },
    { id: "khoi", name: "Khôi" },
    { id: "linh", name: "Linh" },
    { id: "man", name: "Mẫn" },
    { id: "mai", name: "Mai" },
    { id: "hung", name: "Hùng" },
    { id: "lan", name: "Lan" },
];

// Demo task data for 7 teachers
const INITIAL_TASKS: Task[] = [
    // Hường's tasks
    { id: "T1-001", title: "Soạn giáo án N4", description: "Chuẩn bị giáo án chi tiết lớp N4.", assigneeId: "huong", assigneeName: "Hường", assignerId: "admin1", status: "completed", priority: "high", dueDate: "2026-01-20", createdAt: "2026-01-05", startDate: "2026-01-08", progress: 100 },
    { id: "T1-002", title: "Chấm bài kiểm tra giữa kỳ", description: "Chấm và nhập điểm vào hệ thống.", assigneeId: "huong", assigneeName: "Hường", assignerId: "admin1", status: "in_progress", priority: "high", dueDate: "2026-02-18", createdAt: "2026-02-05", startDate: "2026-02-10", progress: 60 },
    { id: "T1-003", title: "Họp phụ huynh tháng 3", description: "Tổ chức buổi họp báo cáo tiến độ.", assigneeId: "huong", assigneeName: "Hường", assignerId: "admin1", status: "pending", priority: "medium", dueDate: "2026-03-25", createdAt: "2026-03-01", startDate: "2026-03-15", progress: 0 },
    { id: "T1-004", title: "Cập nhật tài liệu tháng 4", description: "Bổ sung tài liệu mới theo chương trình.", assigneeId: "huong", assigneeName: "Hường", assignerId: "admin1", status: "not_started", priority: "low", dueDate: "2026-04-20", createdAt: "2026-04-05", startDate: "2026-04-10", progress: 0 },

    // Khôi's tasks
    { id: "T2-001", title: "Tổ chức thi thử N3", description: "Chuẩn bị đề thi và giám thi.", assigneeId: "khoi", assigneeName: "Khôi", assignerId: "admin1", status: "completed", priority: "high", dueDate: "2025-12-15", createdAt: "2025-12-01", startDate: "2025-12-08", progress: 100 },
    { id: "T2-002", title: "Đánh giá học viên cuối kỳ", description: "Tổng hợp kết quả học tập của học viên.", assigneeId: "khoi", assigneeName: "Khôi", assignerId: "admin1", status: "completed", priority: "high", dueDate: "2026-01-25", createdAt: "2026-01-10", startDate: "2026-01-15", progress: 100 },
    { id: "T2-003", title: "Soạn test tổng hợp", description: "Chuẩn bị bài test tổng hợp kỹ năng.", assigneeId: "khoi", assigneeName: "Khôi", assignerId: "admin1", status: "in_progress", priority: "medium", dueDate: "2026-02-28", createdAt: "2026-02-10", startDate: "2026-02-15", progress: 45 },
    { id: "T2-004", title: "Quay video bài giảng", description: "Quay và dựng video cho khóa học online.", assigneeId: "khoi", assigneeName: "Khôi", assignerId: "admin1", status: "pending", priority: "medium", dueDate: "2026-03-30", createdAt: "2026-03-05", startDate: "2026-03-12", progress: 0 },
    { id: "T2-005", title: "Tổ chức workshop văn hóa", description: "Chuẩn bị workshop về văn hóa Nhật Bản.", assigneeId: "khoi", assigneeName: "Khôi", assignerId: "admin1", status: "not_started", priority: "low", dueDate: "2026-05-15", createdAt: "2026-05-01", startDate: "2026-05-05", progress: 0 },

    // Linh's tasks
    { id: "T3-001", title: "Lập kế hoạch giảng dạy", description: "Xây dựng kế hoạch cho quý mới.", assigneeId: "linh", assigneeName: "Linh", assignerId: "admin1", status: "completed", priority: "high", dueDate: "2025-09-20", createdAt: "2025-09-05", startDate: "2025-09-10", progress: 100 },
    { id: "T3-002", title: "Cập nhật giáo trình N5", description: "Chỉnh sửa tài liệu theo phản hồi.", assigneeId: "linh", assigneeName: "Linh", assignerId: "admin1", status: "completed", priority: "medium", dueDate: "2025-11-30", createdAt: "2025-11-10", startDate: "2025-11-15", progress: 100 },
    { id: "T3-003", title: "Tổ chức lớp học thử", description: "Chuẩn bị buổi học thử cho học viên mới.", assigneeId: "linh", assigneeName: "Linh", assignerId: "admin1", status: "in_progress", priority: "high", dueDate: "2026-02-25", createdAt: "2026-02-08", startDate: "2026-02-12", progress: 70 },
    { id: "T3-004", title: "Đánh giá tiến độ tháng 4", description: "Báo cáo kết quả học tập của học viên.", assigneeId: "linh", assigneeName: "Linh", assignerId: "admin1", status: "pending", priority: "medium", dueDate: "2026-04-28", createdAt: "2026-04-10", startDate: "2026-04-18", progress: 0 },

    // Mẫn's tasks
    { id: "T4-001", title: "Soạn đề kiểm tra đầu vào", description: "Chuẩn bị bộ đề cho học viên mới.", assigneeId: "man", assigneeName: "Mẫn", assignerId: "admin1", status: "completed", priority: "high", dueDate: "2025-10-25", createdAt: "2025-10-10", startDate: "2025-10-15", progress: 100 },
    { id: "T4-002", title: "Xếp lớp học viên mới", description: "Phân lớp theo kết quả test đầu vào.", assigneeId: "man", assigneeName: "Mẫn", assignerId: "admin1", status: "completed", priority: "high", dueDate: "2026-01-15", createdAt: "2026-01-05", startDate: "2026-01-08", progress: 100 },
    { id: "T4-003", title: "Chuẩn bị tài liệu ôn thi", description: "Tổng hợp tài liệu ôn tập JLPT.", assigneeId: "man", assigneeName: "Mẫn", assignerId: "admin1", status: "in_progress", priority: "medium", dueDate: "2026-03-20", createdAt: "2026-02-20", startDate: "2026-02-25", progress: 30 },
    { id: "T4-004", title: "Tổ chức thi thử tháng 6", description: "Chuẩn bị kỳ thi thử giữa năm.", assigneeId: "man", assigneeName: "Mẫn", assignerId: "admin1", status: "pending", priority: "high", dueDate: "2026-06-20", createdAt: "2026-06-05", startDate: "2026-06-10", progress: 0 },

    // Mai's tasks
    { id: "T5-001", title: "Hướng dẫn đăng ký thi JLPT", description: "Hỗ trợ học viên đăng ký thi chính thức.", assigneeId: "mai", assigneeName: "Mai", assignerId: "admin1", status: "completed", priority: "medium", dueDate: "2025-11-20", createdAt: "2025-11-05", startDate: "2025-11-10", progress: 100 },
    { id: "T5-002", title: "Tổng kết năm 2025", description: "Báo cáo kết quả giảng dạy năm 2025.", assigneeId: "mai", assigneeName: "Mai", assignerId: "admin1", status: "completed", priority: "high", dueDate: "2025-12-28", createdAt: "2025-12-10", startDate: "2025-12-15", progress: 100 },
    { id: "T5-003", title: "Cập nhật danh sách lớp", description: "Điều chỉnh danh sách sau kỳ thi.", assigneeId: "mai", assigneeName: "Mai", assignerId: "admin1", status: "in_progress", priority: "low", dueDate: "2026-02-20", createdAt: "2026-02-05", startDate: "2026-02-10", progress: 80 },
    { id: "T5-004", title: "Soạn bài giảng tháng 5", description: "Chuẩn bị nội dung bài giảng.", assigneeId: "mai", assigneeName: "Mai", assignerId: "admin1", status: "not_started", priority: "medium", dueDate: "2026-05-25", createdAt: "2026-05-10", startDate: "2026-05-15", progress: 0 },

    // Hùng's tasks
    { id: "T6-001", title: "Kiểm tra giữa kỳ tháng 10", description: "Tổ chức kiểm tra cho tất cả lớp.", assigneeId: "hung", assigneeName: "Hùng", assignerId: "admin1", status: "completed", priority: "high", dueDate: "2025-10-20", createdAt: "2025-10-05", startDate: "2025-10-12", progress: 100 },
    { id: "T6-002", title: "Cập nhật file điểm danh", description: "Nhập dữ liệu điểm danh vào hệ thống.", assigneeId: "hung", assigneeName: "Hùng", assignerId: "admin1", status: "completed", priority: "low", dueDate: "2026-01-30", createdAt: "2026-01-20", startDate: "2026-01-22", progress: 100 },
    { id: "T6-003", title: "Soạn đề cương ôn tập", description: "Tổng hợp kiến thức cho kỳ thi.", assigneeId: "hung", assigneeName: "Hùng", assignerId: "admin1", status: "pending", priority: "medium", dueDate: "2026-03-15", createdAt: "2026-02-28", startDate: "2026-03-05", progress: 0 },
    { id: "T6-004", title: "Chấm bài thi cuối kỳ", description: "Chấm và nhập điểm thi.", assigneeId: "hung", assigneeName: "Hùng", assignerId: "admin1", status: "not_started", priority: "high", dueDate: "2026-07-10", createdAt: "2026-07-01", startDate: "2026-07-05", progress: 0 },

    // Lan's tasks
    { id: "T7-001", title: "Khai giảng năm học mới", description: "Tổ chức lễ khai giảng.", assigneeId: "lan", assigneeName: "Lan", assignerId: "admin1", status: "completed", priority: "high", dueDate: "2025-09-10", createdAt: "2025-09-01", startDate: "2025-09-05", progress: 100 },
    { id: "T7-002", title: "Tổ chức hoạt động ngoại khóa", description: "Chuẩn bị chuyến tham quan văn hóa.", assigneeId: "lan", assigneeName: "Lan", assignerId: "admin1", status: "completed", priority: "medium", dueDate: "2025-12-20", createdAt: "2025-12-05", startDate: "2025-12-10", progress: 100 },
    { id: "T7-003", title: "Cập nhật thông tin học viên", description: "Rà soát thông tin học viên cũ.", assigneeId: "lan", assigneeName: "Lan", assignerId: "admin1", status: "in_progress", priority: "low", dueDate: "2026-02-15", createdAt: "2026-02-01", startDate: "2026-02-05", progress: 50 },
    { id: "T7-004", title: "Lập báo cáo quý 1", description: "Tổng hợp báo cáo kết quả quý 1.", assigneeId: "lan", assigneeName: "Lan", assignerId: "admin1", status: "pending", priority: "high", dueDate: "2026-04-05", createdAt: "2026-03-25", startDate: "2026-03-28", progress: 0 },
    { id: "T7-005", title: "Chuẩn bị lớp học hè", description: "Xây dựng chương trình học hè.", assigneeId: "lan", assigneeName: "Lan", assignerId: "admin1", status: "not_started", priority: "medium", dueDate: "2026-06-30", createdAt: "2026-06-15", startDate: "2026-06-20", progress: 0 },
];

const TaskManagement = () => {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null); // For viewing details
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Gantt chart state
    const [ganttViewMode, setGanttViewMode] = useState<'list' | 'timeline'>('list');
    const [selectedTeacher, setSelectedTeacher] = useState<string>("all");
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Default to Feb 2026

    // Create Form State
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        assigneeId: "",
        dueDate: "",
        priority: "medium" as TaskPriority,
    });

    const handleCreateTask = () => {
        if (!newTask.title || !newTask.assigneeId || !newTask.dueDate) {
            toast({
                title: "Thiếu thông tin",
                description: "Vui lòng điền đầy đủ tiêu đề, người thực hiện và hạn chót.",
                variant: "destructive"
            });
            return;
        }

        const teacher = MOCK_TEACHERS.find(t => t.id === newTask.assigneeId);

        const task: Task = {
            id: `TASK-${tasks.length + 1}`.padStart(8, '0'),
            title: newTask.title,
            description: newTask.description,
            assigneeId: newTask.assigneeId,
            assigneeName: teacher?.name,
            assignerId: "admin",
            status: "pending",
            priority: newTask.priority,
            dueDate: newTask.dueDate,
            createdAt: new Date().toISOString().split('T')[0],
        };

        setTasks([task, ...tasks]);
        setIsCreateOpen(false);
        setNewTask({ title: "", description: "", assigneeId: "", dueDate: "", priority: "medium" });
        toast({
            title: "Tạo công việc thành công",
            description: `Đã giao việc cho ${teacher?.name}`,
        });
    };

    const getStatusBadge = (status: TaskStatus) => {
        switch (status) {
            case "pending": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Chờ nhận</Badge>;
            case "accepted": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Đã nhận</Badge>;
            case "in_progress": return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Đang làm</Badge>;
            case "completed": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Hoàn thành</Badge>;
            case "verified": return <Badge className="bg-primary">Đã duyệt</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPriorityIcon = (priority: TaskPriority) => {
        switch (priority) {
            case "high": return <AlertCircle className="w-4 h-4 text-red-500" />;
            case "medium": return <Clock className="w-4 h-4 text-orange-500" />;
            case "low": return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.assigneeName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || task.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Gantt chart helpers
    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    };

    const getFilteredTasksForGantt = () => {
        if (selectedTeacher === "all") {
            return tasks;
        }
        return tasks.filter(task => task.assigneeId === selectedTeacher);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Quản lý công việc</h1>
                        <p className="text-muted-foreground">Phân công và theo dõi tiến độ công việc của giảng viên</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex bg-muted p-1 rounded-lg">
                            <Button
                                variant={ganttViewMode === 'list' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setGanttViewMode('list')}
                                className="text-sm"
                            >
                                <LayoutList className="w-4 h-4 mr-2" />
                                Danh sách
                            </Button>
                            <Button
                                variant={ganttViewMode === 'timeline' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setGanttViewMode('timeline')}
                                className="text-sm"
                            >
                                <BarChart2 className="w-4 h-4 mr-2" />
                                Timeline
                            </Button>
                        </div>
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Giao việc mới
                        </Button>
                    </div>
                </div>

                {/* Timeline View - Gantt Chart */}
                {ganttViewMode === 'timeline' && (
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Month navigation */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="icon"
                                        onClick={() => handleMonthChange('prev')}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                                        <span className="text-sm font-medium">
                                            {formatDate(currentMonth, "MMMM yyyy", { locale: vi })}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleMonthChange('next')}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="h-6 w-px bg-border hidden md:block" />

                                {/* Teacher Filter */}
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Chọn giảng viên" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả giảng viên</SelectItem>
                                            <SelectItem value="huong">Hường</SelectItem>
                                            <SelectItem value="khoi">Khôi</SelectItem>
                                            <SelectItem value="linh">Linh</SelectItem>
                                            <SelectItem value="man">Mẫn</SelectItem>
                                            <SelectItem value="mai">Mai</SelectItem>
                                            <SelectItem value="hung">Hùng</SelectItem>
                                            <SelectItem value="lan">Lan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <TaskGanttChart
                                tasks={getFilteredTasksForGantt()}
                                startDate={startOfMonth(currentMonth)}
                                endDate={endOfMonth(currentMonth)}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Task List View */}
                {ganttViewMode === 'list' && (
                    <>
                        {/* Filters */}
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm công việc..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="pending">Chờ nhận</SelectItem>
                                    <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Task List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Danh sách công việc</CardTitle>
                                <CardDescription>Hiển thị {filteredTasks.length} tác vụ</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[300px]">Công việc</TableHead>
                                            <TableHead>Người thực hiện</TableHead>
                                            <TableHead>Độ ưu tiên</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Hạn chót</TableHead>
                                            <TableHead className="text-right">Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTasks.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                    Không có công việc nào
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredTasks.map((task) => (
                                                <TableRow key={task.id}>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{task.title}</span>
                                                            <span className="text-xs text-muted-foreground line-clamp-1">{task.description}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="w-6 h-6">
                                                                <AvatarFallback>{task.assigneeName?.[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <span>{task.assigneeName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2" title={`Priority: ${task.priority}`}>
                                                            {getPriorityIcon(task.priority)}
                                                            <span className="capitalize text-sm">{task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Calendar className="w-3 h-3" />
                                                            {format(new Date(task.dueDate), "dd/MM/yyyy")}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                                                                    Example Chi tiết
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive">
                                                                    Hủy công việc
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Create Task Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Giao việc mới</DialogTitle>
                            <DialogDescription>Tạo công việc mới và phân công cho giảng viên.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="title" className="text-sm font-medium">Tiêu đề công việc</label>
                                <Input
                                    id="title"
                                    placeholder="Nhập tiêu đề..."
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="desc" className="text-sm font-medium">Mô tả chi tiết</label>
                                <Textarea
                                    id="desc"
                                    placeholder="Mô tả nội dung công việc..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Người thực hiện</label>
                                    <Select
                                        value={newTask.assigneeId}
                                        onValueChange={(val) => setNewTask({ ...newTask, assigneeId: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn giảng viên" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_TEACHERS.map(t => (
                                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Độ ưu tiên</label>
                                    <Select
                                        value={newTask.priority}
                                        onValueChange={(val: TaskPriority) => setNewTask({ ...newTask, priority: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Thấp</SelectItem>
                                            <SelectItem value="medium">Trung bình</SelectItem>
                                            <SelectItem value="high">Cao</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="dueDate" className="text-sm font-medium">Hạn chót</label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Hủy</Button>
                            <Button onClick={handleCreateTask}>Giao việc</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Task Detail Dialog */}
                <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Chi tiết công việc</DialogTitle>
                        </DialogHeader>
                        {selectedTask && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedTask.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {getStatusBadge(selectedTask.status)}
                                        <span className="text-sm text-muted-foreground">• Priority: {selectedTask.priority}</span>
                                    </div>
                                </div>

                                <div className="bg-muted p-3 rounded-md text-sm">
                                    <p>{selectedTask.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground block mb-1">Người thực hiện</span>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-5 h-5">
                                                <AvatarFallback>{selectedTask.assigneeName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{selectedTask.assigneeName}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block mb-1">Hạn chót</span>
                                        <span className="font-medium">{format(new Date(selectedTask.dueDate), "dd/MM/yyyy")}</span>
                                    </div>
                                </div>

                                {selectedTask.status === "completed" && selectedTask.report && (
                                    <div className="border-t pt-4 mt-2">
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            Báo cáo hoàn thành
                                        </h4>
                                        <div className="bg-green-50 border border-green-100 p-3 rounded-md text-sm text-green-900">
                                            <p>{selectedTask.report.content}</p>
                                            <p className="text-xs text-green-700 mt-2 text-right">
                                                Hoàn thành: {format(new Date(selectedTask.report.completedAt), "dd/MM/yyyy HH:mm")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {selectedTask.status === "completed" && !selectedTask.report && (
                                    <div className="border-t pt-4 mt-2">
                                        <p className="text-sm text-muted-foreground italic">Chưa có báo cáo chi tiết.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setSelectedTask(null)}>Đóng</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default TaskManagement;
