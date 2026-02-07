import { useState } from "react";
import DebugErrorBoundary from "@/components/DebugErrorBoundary";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { AlertCircle, Clock, CheckCircle2, Calendar, FileText, ArrowRight, ListTodo, BarChart2 } from "lucide-react";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isSameMonth, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { toast } from "@/hooks/use-toast";
import TaskGanttChart from "@/components/TaskGanttChart";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock Current User
const CURRENT_TEACHER_ID = "t1"; // Yamada

// Mock Initial Tasks (Same as Admin for consistency, focusing on Yamada)
const INITIAL_TASKS: Task[] = [
    {
        id: "TASK-001",
        title: "Soạn test tổng nghe (5 bài/lần)",
        description: "Chuẩn bị bài kiểm tra nghe tổng hợp cho lớp N3.",
        assigneeId: "t1",
        assigneeName: "Thầy Quỳnh",
        assignerId: "admin1",
        status: "in_progress",
        priority: "high",
        dueDate: "2026-02-28",
        createdAt: "2026-02-01",
        startDate: "2026-02-05", // Started before today (Feb 7)
        progress: 60,
    },
    {
        id: "TASK-002",
        title: "Cập nhật điểm bài test",
        description: "Nhập điểm bài kiểm tra cuối tuần cho lớp N4.",
        assigneeId: "t1",
        assigneeName: "Thầy Quỳnh",
        assignerId: "admin1",
        status: "pending",
        priority: "medium",
        dueDate: "2026-02-10",
        createdAt: "2026-02-05",
        startDate: "2026-02-08", // Starts tomorrow
        progress: 0,
    },
    {
        id: "TASK-003",
        title: "Soạn test ngữ pháp theo bài",
        description: "Soạn câu hỏi trắc nghiệm ngữ pháp bài 16-20.",
        assigneeId: "t1",
        assigneeName: "Thầy Quỳnh",
        assignerId: "admin1",
        status: "in_progress",
        priority: "high",
        dueDate: "2026-02-06",
        createdAt: "2026-02-01",
        startDate: "2026-02-02",
        progress: 80,
    },
    {
        id: "TASK-004",
        title: "Quản lý điểm danh các lớp",
        description: "Kiểm tra và tổng hợp tình hình chuyên cần tháng 2.",
        assigneeId: "t1",
        assigneeName: "Thầy Quỳnh",
        assignerId: "admin1",
        status: "in_progress",
        priority: "medium",
        dueDate: "2026-02-28",
        createdAt: "2026-02-01",
        startDate: "2026-02-01",
        progress: 30,
    },
    {
        id: "TASK-005",
        title: "Soạn test từ vựng theo bài",
        description: "Soạn list từ vựng và bài tập đi kèm cho bài 25.",
        assigneeId: "t1",
        assigneeName: "Thầy Quỳnh",
        assignerId: "admin1",
        status: "pending",
        priority: "low",
        dueDate: "2026-02-20",
        createdAt: "2026-02-15",
        startDate: "2026-02-16",
        progress: 0,
    },
    {
        id: "TASK-006",
        title: "Cập nhật thông tin học viên",
        description: "Rà soát thông tin liên lạc của học viên mới.",
        assigneeId: "t1",
        assigneeName: "Thầy Quỳnh",
        assignerId: "admin1",
        status: "verified",
        priority: "low",
        dueDate: "2026-02-07", // Due today
        createdAt: "2026-02-01",
        startDate: "2026-02-05",
        progress: 100,
    },
    {
        id: "TASK-007",
        title: "Quay phim bài giảng",
        description: "Quay video bài giảng ngữ pháp N2.",
        assigneeId: "t1",
        assigneeName: "Thầy Quỳnh",
        assignerId: "admin1",
        status: "in_progress",
        priority: "high",
        dueDate: "2026-02-15",
        createdAt: "2026-02-05",
        startDate: "2026-02-07", // Starts today
        progress: 45,
    },
    {
        id: "TASK-008",
        title: "Cập nhật danh sách lớp",
        description: "Điều chỉnh danh sách lớp sau kỳ thi xếp lớp.",
        assigneeId: "t1",
        assigneeName: "Thầy Quỳnh",
        assignerId: "admin1",
        status: "pending",
        priority: "medium",
        dueDate: "2026-02-12",
        createdAt: "2026-02-10",
        startDate: "2026-02-11",
        progress: 0,
    },
    {
        id: "TASK-009",
        title: "Cập nhật file điểm danh",
        description: "Nhập dữ liệu điểm danh tuần này vào file Excel tổng.",
        assigneeId: "t1",
        assigneeName: "Thầy Quỳnh",
        assignerId: "admin1",
        status: "pending",
        priority: "low",
        dueDate: "2026-02-09",
        createdAt: "2026-02-07", // Created today
        startDate: "2026-02-08",
        progress: 0,
    },
    {
        id: "TASK-010",
        title: "Soạn đề cương ôn tập N3",
        description: "Tổng hợp kiến thức ngữ pháp và từ vựng cho kỳ thi thử.",
        assigneeId: "t1",
        assigneeName: "Thầy Quỳnh",
        assignerId: "admin1",
        status: "pending",
        priority: "medium",
        dueDate: "2026-02-18",
        createdAt: "2026-02-05",
        startDate: "2026-02-12",
        progress: 0,
    },
];

const TeacherTaskBoard = () => {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [viewMode, setViewMode] = useState<"board" | "gantt">("board");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportContent, setReportContent] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Default to Feb 2026

    const formatDateSafe = (dateStr?: string) => {
        try {
            if (!dateStr) return "N/A";
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "N/A";
            return format(date, "dd/MM");
        } catch (e) {
            return "N/A";
        }
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    };

    // Filter tasks by month overlap
    const filteredTasks = tasks.filter(t => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        const taskStart = new Date(t.startDate || t.createdAt);
        const taskEnd = new Date(t.dueDate);

        // Check validation
        if (isNaN(taskStart.getTime()) || isNaN(taskEnd.getTime())) return false;

        // Check overlap: start <= endOfWindow AND end >= startOfWindow
        return taskStart <= monthEnd && taskEnd >= monthStart;
    });

    // Group tasks by status (using filtered tasks)
    const pendingTasks = filteredTasks.filter(t => t.status === "pending");
    const inProgressTasks = filteredTasks.filter(t => t.status === "in_progress");
    const completedTasks = filteredTasks.filter(t => t.status === "completed" || t.status === "verified");

    const handleStartTask = (taskId: string) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: "in_progress", progress: 0 } : t
        ));
        toast({
            title: "Đã bắt đầu công việc",
            description: "Trạng thái đã chuyển sang Đang thực hiện",
        });
    };

    const openCompleteDialog = (task: Task) => {
        setSelectedTask(task);
        setReportContent("");
        setIsReportOpen(true);
    };

    const handleCompleteTask = () => {
        if (!selectedTask) return;

        if (!reportContent.trim()) {
            toast({
                title: "Thiếu báo cáo",
                description: "Vui lòng nhập nội dung báo cáo kết quả.",
                variant: "destructive"
            });
            return;
        }

        setTasks(prev => prev.map(t =>
            t.id === selectedTask.id ? {
                ...t,
                status: "completed",
                progress: 100,
                report: {
                    completedAt: new Date().toISOString(),
                    content: reportContent
                }
            } : t
        ));

        setIsReportOpen(false);
        setSelectedTask(null);
        toast({
            title: "Đã hoàn thành công việc",
            description: "Báo cáo đã được gửi cho Quản lý.",
        });
    };

    const getPriorityIcon = (priority: TaskPriority) => {
        switch (priority) {
            case "high": return <AlertCircle className="w-4 h-4 text-red-500" />;
            case "medium": return <Clock className="w-4 h-4 text-orange-500" />;
            case "low": return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
        }
    };

    const TaskCard = ({ task }: { task: Task }) => (
        <Card className="mb-3 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                        {task.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDateSafe(task.startDate)} - {formatDateSafe(task.dueDate)}
                    </span>
                </div>
                <h4 className="font-semibold mb-1 line-clamp-1">{task.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>

                <div className="flex justify-end pt-2 border-t">
                    {task.status === "pending" && (
                        <Button size="sm" onClick={() => handleStartTask(task.id)}>
                            Nhận việc <ArrowRight className="ml-1 w-3 h-3" />
                        </Button>
                    )}
                    {task.status === "in_progress" && (
                        <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => openCompleteDialog(task)}>
                            Hoàn thành <CheckCircle2 className="ml-1 w-3 h-3" />
                        </Button>
                    )}
                    {task.status === "completed" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Đã báo cáo
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <TeacherLayout>
            <DebugErrorBoundary>
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Quỳnh sensei</h1>
                            <p className="text-muted-foreground">Theo dõi và cập nhật tiến độ công việc được giao</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Month Filter */}
                            <div className="flex items-center bg-background border rounded-md shadow-sm">
                                <Button variant="ghost" size="icon" onClick={() => handleMonthChange('prev')}>
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="px-4 font-medium min-w-[140px] text-center">
                                    {format(currentMonth, "MMMM yyyy", { locale: vi })}
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleMonthChange('next')}>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                                <Button
                                    variant={viewMode === "board" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("board")}
                                >
                                    <ListTodo className="w-4 h-4 mr-2" />
                                    Check list
                                </Button>
                                <Button
                                    variant={viewMode === "gantt" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("gantt")}
                                >
                                    <BarChart2 className="w-4 h-4 mr-2" />
                                    Timeline
                                </Button>
                            </div>
                        </div>
                    </div>

                    {viewMode === "board" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Column 1: Todo */}
                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                    Chờ thực hiện
                                    <Badge variant="secondary" className="ml-auto">{pendingTasks.length}</Badge>
                                </h3>
                                <div className="space-y-3">
                                    {pendingTasks.map(task => <TaskCard key={task.id} task={task} />)}
                                    {pendingTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Không có công việc chờ</p>}
                                </div>
                            </div>

                            {/* Column 2: In Progress */}
                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    Đang thực hiện
                                    <Badge variant="secondary" className="ml-auto">{inProgressTasks.length}</Badge>
                                </h3>
                                <div className="space-y-3">
                                    {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
                                    {inProgressTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Chưa có công việc đang làm</p>}
                                </div>
                            </div>

                            {/* Column 3: Done */}
                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Đã hoàn thành
                                    <Badge variant="secondary" className="ml-auto">{completedTasks.length}</Badge>
                                </h3>
                                <div className="space-y-3">
                                    {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                                    {completedTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Chưa hoàn thành công việc nào</p>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card rounded-lg border p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-semibold">Tiến độ công việc</h3>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 bg-red-100 border border-red-300 rounded" />
                                        <span>Đã trễ</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded" />
                                        <span>Đang thực hiện</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 bg-green-100 border border-green-300 rounded" />
                                        <span>Đã hoàn thành</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded" />
                                        <span>Chờ thực hiện</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded" />
                                        <span>Chưa tới ngày</span>
                                    </div>
                                </div>
                            </div>
                            <TaskGanttChart
                                tasks={filteredTasks}
                                startDate={startOfMonth(currentMonth)}
                                endDate={endOfMonth(currentMonth)}
                            />
                        </div>
                    )}

                    {/* Complete Report Dialog */}
                    <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Báo cáo hoàn thành công việc</DialogTitle>
                                <DialogDescription>
                                    Nhập nội dung báo cáo kết quả công việc để gửi cho Quản lý.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <label className="text-sm font-medium mb-1.5 block">Nội dung báo cáo</label>
                                <Textarea
                                    placeholder="Mô tả kết quả công việc, link tài liệu, hoặc ghi chú..."
                                    value={reportContent}
                                    onChange={(e) => setReportContent(e.target.value)}
                                    className="min-h-[120px]"
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsReportOpen(false)}>Hủy</Button>
                                <Button onClick={handleCompleteTask}>Gửi báo cáo</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
            </DebugErrorBoundary>
        </TeacherLayout>
    );
};

export default TeacherTaskBoard;
