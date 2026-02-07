import { Task } from "@/types/task";
import { format, eachDayOfInterval, isSameDay, addDays, differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskGanttChartProps {
    tasks: Task[];
    startDate?: Date; // Start of the view
    endDate?: Date; // End of the view
}

const TaskGanttChart = ({ tasks, startDate, endDate }: TaskGanttChartProps) => {
    // Determine view range if not provided
    const today = new Date();
    const start = startDate || addDays(today, -7);
    const end = endDate || addDays(today, 21);

    const days = eachDayOfInterval({ start, end });

    // Helper to calculate position and width
    const getTaskStyle = (task: Task) => {
        const defaultDate = new Date();
        const taskStart = new Date(task.startDate || task.createdAt || defaultDate.toISOString());
        const taskEnd = new Date(task.dueDate || defaultDate.toISOString());

        // Use differenceInCalendarDays to correctly map to grid
        // Offset is days from view start
        let offsetDays = differenceInCalendarDays(taskStart, start);

        // Duration is inclusive (end - start + 1)
        let durationDays = differenceInCalendarDays(taskEnd, taskStart) + 1;

        // Clamp to view (optional, but good for rendering)
        if (offsetDays < 0) {
            durationDays += offsetDays;
            offsetDays = 0;
        }

        // Calculate progress based on today
        // Total duration in days
        const totalDuration = differenceInCalendarDays(taskEnd, taskStart) + 1;
        // Days passed from start until today (inclusive)
        const daysPassed = differenceInCalendarDays(today, taskStart) + 1;

        let calculatedProgress = 0;
        if (daysPassed <= 0) {
            calculatedProgress = 0;
        } else if (daysPassed >= totalDuration) {
            calculatedProgress = 100;
        } else {
            calculatedProgress = Math.round((daysPassed / totalDuration) * 100);
        }

        return {
            left: `${offsetDays * 30}px`, // 30px per day
            width: `${Math.max(durationDays * 30, 30)}px`,
            progress: calculatedProgress
        };
    };

    const formatDateSafe = (dateStr?: string) => {
        try {
            if (!dateStr) return "N/A";
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "N/A";
            return format(date, "dd/MM");
        } catch (e) {
            return "Err";
        }
    };

    return (
        <div className="border rounded-md bg-white shadow-sm overflow-auto h-[500px] relative">
            <div className="min-w-max">
                {/* Header - Dates */}
                <div className="flex border-b bg-muted/95 z-30 sticky top-0">
                    <div className="w-[180px] min-w-[180px] p-3 font-semibold border-r border-b bg-muted/95 sticky left-0 z-40 shadow-[1px_0_5px_rgba(0,0,0,0.05)] text-sm">
                        Công việc
                    </div>
                    <div className="flex">
                        {days.map((day, idx) => {
                            const isToday = isSameDay(day, today);
                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "w-[30px] min-w-[30px] p-1 text-center text-xs border-r border-border/50 flex flex-col justify-center",
                                        isToday ? "bg-blue-100 text-blue-700 font-bold border-blue-200" : ""
                                    )}
                                >
                                    <div className={cn("font-semibold", isToday ? "text-sm text-blue-700 font-bold" : "text-xs")}>{format(day, "d/M")}</div>
                                    <div className="text-[9px] opacity-80">{format(day, "EE")}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Body - Tasks relative container */}
                <div className="relative">
                    {/* Background Grid - Absolute overlay */}
                    <div className="absolute inset-0 flex ml-[180px] pointer-events-none z-0">
                        {days.map((day, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "w-[30px] min-w-[30px] border-r border-border/60 h-full",
                                    isSameDay(day, today) ? "bg-blue-50/50 border-x border-blue-200" : ""
                                )}
                            />
                        ))}
                    </div>

                    {/* Task Rows */}
                    <div>
                        {tasks.map((task) => {
                            const style = getTaskStyle(task);
                            const progress = style.progress;

                            // Overdue logic
                            const defaultDate = new Date();
                            const taskEnd = new Date(task.dueDate || defaultDate.toISOString());
                            const isOverdue = today > taskEnd && task.status !== "completed" && task.status !== "verified";

                            return (
                                <div key={task.id} className="flex border-b hover:bg-slate-50/80 group w-max">
                                    {/* Task Info Column - Sticky Left */}
                                    <div className="w-[180px] min-w-[180px] p-3 border-r bg-white sticky left-0 z-20 flex flex-col justify-center shadow-[1px_0_5px_rgba(0,0,0,0.05)] group-hover:bg-slate-50/80 transition-colors">
                                        <div className="font-medium text-xs truncate" title={task.title}>{task.title}</div>
                                    </div>

                                    {/* Timeline Bar Space */}
                                    <div className="flex relative h-12 pointer-events-none"> {/* Reduced height */}
                                        {/* Spacer to match grid width */}
                                        <div style={{ width: `${days.length * 30}px` }} className="h-full relative pointer-events-auto">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={cn(
                                                                "absolute top-3 h-6 rounded-sm shadow-sm border px-1 flex items-center overflow-hidden cursor-pointer hover:brightness-95 transition-all z-10",
                                                                isOverdue ? "bg-red-100 border-red-300" :
                                                                    task.status === "completed" || task.status === "verified" ? "bg-green-100 border-green-300" :
                                                                        task.status === "in_progress" ? "bg-blue-100 border-blue-300" :
                                                                            task.status === "pending" ? "bg-yellow-100 border-yellow-300" : // Pending -> Yellow
                                                                                "bg-gray-100 border-gray-300"
                                                            )}
                                                            style={{ left: style.left, width: style.width }}
                                                        >
                                                            {/* Progress Fill */}
                                                            <div
                                                                className={cn(
                                                                    "absolute left-0 top-0 bottom-0 bg-opacity-30 transition-all",
                                                                    isOverdue ? "bg-red-500" :
                                                                        task.status === "completed" || task.status === "verified" ? "bg-green-500" :
                                                                            task.status === "in_progress" ? "bg-blue-500" :
                                                                                task.status === "pending" ? "bg-yellow-500" : // Pending -> Yellow
                                                                                    "bg-gray-500"
                                                                )}
                                                                style={{ width: `${progress}%` }}
                                                            />

                                                            <span className={cn(
                                                                "relative z-10 text-[9px] font-semibold truncate w-full pl-1 uppercase tracking-wide",
                                                                isOverdue ? "text-red-700 font-bold" :
                                                                    task.status === "pending" ? "text-yellow-700" : // Yellow text
                                                                        "text-foreground/80"
                                                            )}>
                                                                {isOverdue ? "ĐÃ TRỄ" :
                                                                    task.status === "completed" || task.status === "verified" ? "Đã hoàn thành" :
                                                                        task.status === "in_progress" ? "Đang thực hiện" :
                                                                            task.status === "pending" ? "Chờ thực hiện" : // Pending text
                                                                                "Chưa tới ngày"}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="text-xs">
                                                            <p className="font-semibold">{task.title}</p>
                                                            <p>Bắt đầu: {formatDateSafe(task.startDate || task.createdAt)}</p>
                                                            <p>Kết thúc: {formatDateSafe(task.dueDate)}</p>
                                                            <p>Tiến độ: {progress}%</p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskGanttChart;
