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

// Mock Data
const MOCK_TEACHERS = [
    { id: "t1", name: "Yamada" },
    { id: "t2", name: "Suzuki" },
    { id: "t3", name: "Tanaka" },
    { id: "t4", name: "Sato" },
];

const INITIAL_TASKS: Task[] = [
    {
        id: "TASK-001",
        title: "Prepare N3 Grammar Slides",
        description: "Create presentation for Chapter 15 grammar points.",
        assigneeId: "t1",
        assigneeName: "Yamada",
        assignerId: "admin1",
        status: "in_progress",
        priority: "high",
        dueDate: "2024-11-20",
        createdAt: "2024-11-15",
    },
    {
        id: "TASK-002",
        title: "Grade N4 Mock Test",
        description: "Review and grade test papers for class N4-02.",
        assigneeId: "t2",
        assigneeName: "Suzuki",
        assignerId: "admin1",
        status: "pending",
        priority: "medium",
        dueDate: "2024-11-22",
        createdAt: "2024-11-18",
    },
    {
        id: "TASK-003",
        title: "Update Student Records",
        description: "Verify attendance data for October.",
        assigneeId: "t3",
        assigneeName: "Tanaka",
        assignerId: "admin1",
        status: "completed",
        priority: "low",
        dueDate: "2024-11-10",
        createdAt: "2024-11-01",
        report: {
            completedAt: "2024-11-09",
            content: "All records updated and verified.",
        }
    },
];

const TaskManagement = () => {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null); // For viewing details
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

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

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Quản lý công việc</h1>
                        <p className="text-muted-foreground">Phân công và theo dõi tiến độ công việc của giảng viên</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Giao việc mới
                    </Button>
                </div>

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
