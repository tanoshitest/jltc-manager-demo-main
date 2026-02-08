import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock, Edit, User, BookOpen, ChevronLeft, ChevronRight, LayoutList, Grip } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import ExcelScheduleTable from "@/components/admin/ExcelScheduleTable";
import OverviewScheduleTable from "@/components/admin/OverviewScheduleTable";
import TaskGanttChart from "@/components/TaskGanttChart";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { vi } from "date-fns/locale";
import { BarChart2 } from "lucide-react";

// Demo task data for 7 teachers
const TEACHER_TASKS: Task[] = [
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



const timeSlots = [
  "08:00-09:00", "09:00-10:00", "10:30-11:30",
  "13:00-14:00", "14:15-15:15", "15:30-16:30",
  "18:00-19:00", "19:15-20:15", "20:30-21:30"
];

const initialSchedule = {
  monday: [
    { slot: 0, class: "Lớp 1", teacher: "Hường", room: "201", students: 15, classLevel: "Sơ cấp" },
    { slot: 0, class: "Lớp 2", teacher: "Khôi", room: "202", students: 16, classLevel: "Sơ cấp" },
    { slot: 0, class: "Lớp 3", teacher: "Linh", room: "203", students: 18, classLevel: "Trung cấp" },
    { slot: 0, class: "Lớp 4", teacher: "Mẫn", room: "204", students: 14, classLevel: "Trung cấp" },
    { slot: 1, class: "N5-02", teacher: "Sato", room: "202", students: 16, classLevel: "Sơ cấp" },
    { slot: 1, class: "N4-01", teacher: "Tanaka", room: "301", students: 14, classLevel: "Trung cấp" },
    { slot: 2, class: "N4-02", teacher: "Tanaka", room: "203", students: 18, classLevel: "Trung cấp" },
    { slot: 3, class: "N4-03", teacher: "Kobayashi", room: "204", students: 14, classLevel: "Trung cấp" },
    { slot: 4, class: "N3-02", teacher: "Nakamura", room: "205", students: 13, classLevel: "Trung cấp" },
    { slot: 5, class: "N3-01", teacher: "Suzuki", room: "301", students: 12, classLevel: "Cao cấp" },
  ],
  tuesday: [
    { slot: 0, class: "N5-04", teacher: "Sasaki", room: "201", students: 16, classLevel: "Sơ cấp" },
    { slot: 0, class: "N5-06", teacher: "Yamada", room: "302", students: 14, classLevel: "Sơ cấp" },
    { slot: 1, class: "N5-05", teacher: "Kato", room: "202", students: 15, classLevel: "Sơ cấp" },
    { slot: 2, class: "N4-05", teacher: "Yamamoto", room: "203", students: 17, classLevel: "Trung cấp" },
    { slot: 3, class: "N4-01", teacher: "Watanabe", room: "204", students: 14, classLevel: "Trung cấp" },
    { slot: 4, class: "N3-04", teacher: "Ito", room: "205", students: 13, classLevel: "Cao cấp" },
    { slot: 5, class: "N3-05", teacher: "Saito", room: "301", students: 11, classLevel: "Cao cấp" },
  ],
  wednesday: [
    { slot: 0, class: "N5-01", teacher: "Yamada", room: "201", students: 15, classLevel: "Sơ cấp" },
    { slot: 0, class: "N5-03", teacher: "Hường", room: "202", students: 13, classLevel: "Sơ cấp" },
    { slot: 0, class: "N4-04", teacher: "Linh", room: "203", students: 16, classLevel: "Trung cấp" },
    { slot: 2, class: "N4-02", teacher: "Tanaka", room: "202", students: 18, classLevel: "Trung cấp" },
    { slot: 4, class: "N3-01", teacher: "Suzuki", room: "203", students: 12, classLevel: "Cao cấp" },
  ],
  thursday: [
    { slot: 1, class: "N5-02", teacher: "Sato", room: "201", students: 16, classLevel: "Sơ cấp" },
    { slot: 1, class: "N5-07", teacher: "Khôi", room: "302", students: 12, classLevel: "Sơ cấp" },
    { slot: 3, class: "N4-01", teacher: "Watanabe", room: "202", students: 14, classLevel: "Trung cấp" },
    { slot: 5, class: "N2-01", teacher: "Ito", room: "301", students: 10, classLevel: "Cao cấp" },
  ],
  friday: [
    { slot: 0, class: "N5-01", teacher: "Yamada", room: "201", students: 15, classLevel: "Sơ cấp" },
    { slot: 0, class: "N4-06", teacher: "Mẫn", room: "203", students: 17, classLevel: "Trung cấp" },
    { slot: 2, class: "N4-02", teacher: "Tanaka", room: "202", students: 18, classLevel: "Trung cấp" },
    { slot: 4, class: "N3-01", teacher: "Suzuki", room: "203", students: 12, classLevel: "Cao cấp" },
  ],
  saturday: [
    { slot: 0, class: "N5-07", teacher: "Yamada", room: "201", students: 14, classLevel: "Sơ cấp" },
    { slot: 0, class: "N5-08", teacher: "Hường", room: "202", students: 15, classLevel: "Sơ cấp" },
    { slot: 1, class: "N4-07", teacher: "Tanaka", room: "202", students: 16, classLevel: "Trung cấp" },
    { slot: 3, class: "N3-07", teacher: "Suzuki", room: "203", students: 11, classLevel: "Cao cấp" },
  ],
  sunday: [
    { slot: 2, class: "N5-08", teacher: "Sato", room: "201", students: 13, classLevel: "Sơ cấp" },
    { slot: 4, class: "N2-07", teacher: "Ito", room: "301", students: 9, classLevel: "Cao cấp" },
  ],
};

const allSlots = timeSlots;

import { ScheduleData, ClassItem } from "@/types/schedule";



const formSchema = z.object({
  class: z.string().min(1, "Vui lòng nhập tên lớp"),
  teacher: z.string().min(1, "Vui lòng nhập tên giáo viên"),
  room: z.string().min(1, "Vui lòng nhập phòng học"),
  students: z.coerce.number().min(1, "Số học viên phải lớn hơn 0"),
  lessonContent: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;



const Schedule = () => {
  const [searchParams] = useSearchParams();
  const teacherFromUrl = searchParams.get("teacher") || "";

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(12);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [schedule, setSchedule] = useState<ScheduleData>(initialSchedule);
  const [viewMode, setViewMode] = useState<'excel' | 'overview'>('excel');

  const [selectedClass, setSelectedClass] = useState<ClassItem & { day: string; timeSlot: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const [editMode, setEditMode] = useState<{ day: string; slot: number } | null>(null);
  const [filterTeacher, setFilterTeacher] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");

  // Gantt chart state
  const [ganttViewMode, setGanttViewMode] = useState<'table' | 'timeline'>('table');
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Default to Feb 2026



  // Room editing state
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<{ day: string, class: string, room: string, startSlot: number, endSlot: number } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class: "",
      teacher: "",
      room: "",
      students: 0,
      lessonContent: "",
      notes: "",
    },
  });

  const roomForm = useForm<{ room: string }>({
    defaultValues: { room: "" }
  });



  // Pre-select teacher filter if teacher is passed from URL
  useEffect(() => {
    if (teacherFromUrl) {
      // Set filter to the teacher from URL (even if not in existing schedule, for new scheduling)
      setFilterTeacher(teacherFromUrl);

    }
  }, [teacherFromUrl]);





  // Helper function to get weeks in a month
  const getWeeksInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const totalDays = lastDay.getDate();

    // Find first Monday on or after the 1st
    const firstDayOfWeek = firstDay.getDay();
    const daysUntilMonday = firstDayOfWeek === 0 ? 1 : (firstDayOfWeek === 1 ? 0 : 8 - firstDayOfWeek);

    const weeks: { week: number; start: Date; end: Date }[] = [];
    let currentDate = new Date(year, month - 1, 1);
    let weekNum = 1;

    while (currentDate.getMonth() === month - 1) {
      const dayOfWeek = currentDate.getDay();
      const monday = new Date(currentDate);
      monday.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      // Check if this week is already added
      const weekExists = weeks.some(w => w.start.getTime() === monday.getTime());
      if (!weekExists) {
        weeks.push({ week: weekNum, start: new Date(monday), end: new Date(sunday) });
        weekNum++;
      }

      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7 - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    }

    return weeks;
  };

  // Get date range for selected week
  const getWeekDateRange = (week: number, month: number, year: number) => {
    const weeks = getWeeksInMonth(month, year);
    const selectedWeekData = weeks[week - 1];
    if (!selectedWeekData) {
      // Fallback to first week
      const firstDay = new Date(year, month - 1, 1);
      const dayOfWeek = firstDay.getDay();
      const monday = new Date(firstDay);
      monday.setDate(firstDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return { monday, sunday };
    }
    return { monday: selectedWeekData.start, sunday: selectedWeekData.end };
  };

  const weeksInMonth = getWeeksInMonth(selectedMonth, selectedYear);
  const weekRange = getWeekDateRange(selectedWeek, selectedMonth, selectedYear);

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const handlePrevWeek = () => {
    if (selectedWeek > 1) {
      setSelectedWeek(selectedWeek - 1);
    } else {
      // Go to previous month's last week
      const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
      const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
      const prevWeeks = getWeeksInMonth(prevMonth, prevYear);
      setSelectedMonth(prevMonth);
      setSelectedYear(prevYear);
      setSelectedWeek(prevWeeks.length);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek < weeksInMonth.length) {
      setSelectedWeek(selectedWeek + 1);
    } else {
      // Go to next month's first week
      const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
      const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
      setSelectedMonth(nextMonth);
      setSelectedYear(nextYear);
      setSelectedWeek(1);
    }
  };

  const handleOpenForm = (day: string, slot: number, existingClass?: ClassItem) => {
    setEditMode({ day, slot });
    if (existingClass) {
      form.reset({
        class: existingClass.class,
        teacher: existingClass.teacher,
        room: existingClass.room,
        students: existingClass.students,
        lessonContent: "",
        notes: "",
      });
    } else {
      form.reset({
        class: "",
        teacher: "",
        room: "",
        students: 0,
        lessonContent: "",
        notes: "",
      });
    }
    setFormDialogOpen(true);
  };

  const getSessionSlots = (slot: number) => {
    if (slot >= 0 && slot <= 2) return [0, 1, 2];
    if (slot >= 3 && slot <= 5) return [3, 4, 5];
    if (slot >= 6 && slot <= 8) return [6, 7, 8];
    return [];
  };

  const handleCellClick = (day: string, slot: number, className: string, existingClass?: ClassItem) => {
    setEditMode({ day, slot });
    // If existing class, fill form
    if (existingClass) {
      form.reset({
        class: existingClass.class,
        teacher: existingClass.teacher,
        // Use existing class room or default to empty if not set
        room: existingClass.room || "",
        students: existingClass.students || 0,
        lessonContent: existingClass.lessonContent || "", // Assuming ClassItem has lessonContent
        notes: existingClass.notes || "",
      });
    } else {
      // New class entry for this slot
      // Find default room from other slots in the same session for this class
      const daySchedule = schedule[day as keyof ScheduleData] || [];
      const sessionSlots = getSessionSlots(slot);
      const existingSessionItem = daySchedule.find(
        (c) => c.class === className && sessionSlots.includes(c.slot) && c.room
      );
      const defaultRoom = existingSessionItem ? existingSessionItem.room : "";

      form.reset({
        class: className,
        teacher: "",
        room: defaultRoom,
        students: 15,
        lessonContent: "",
        notes: "",
      });
    }
    setFormDialogOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    if (!editMode) return;

    const newClass: ClassItem = {
      slot: editMode.slot,
      class: data.class,
      teacher: data.teacher,
      room: data.room,
      students: data.students,
      lessonContent: data.lessonContent,
      notes: data.notes,
      // Create a unique ID or use composite key if needed
    };

    const dayKey = editMode.day as keyof ScheduleData;

    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const daySchedule = [...newSchedule[dayKey]];

      // Find if we are editing an existing item for THIS class in THIS slot
      // We need to match by slot AND class name because multiple classes are in the same slot (in different rows)
      const existingIndex = daySchedule.findIndex(
        (c) => c.slot === editMode.slot && c.class === data.class
      );

      if (existingIndex !== -1) {
        // Update existing
        daySchedule[existingIndex] = { ...daySchedule[existingIndex], ...newClass };
      } else {
        // Add new
        daySchedule.push(newClass);
      }

      newSchedule[dayKey] = daySchedule;
      return newSchedule;
    });

    toast({
      title: "Đã cập nhật lịch dạy",
      description: `${data.class} - ${data.teacher}`,
    });

    setFormDialogOpen(false);
    setEditMode(null);
  };

  const handleRoomClick = (day: string, className: string, currentRoom: string, startSlot: number, endSlot: number) => {
    setEditingRoom({ day, class: className, room: currentRoom, startSlot, endSlot });
    roomForm.reset({ room: currentRoom });
    setRoomDialogOpen(true);
  };

  const onRoomSubmit = (data: { room: string }) => {
    if (!editingRoom) return;

    const dayKey = editingRoom.day as keyof ScheduleData;

    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const daySchedule = [...newSchedule[dayKey]];
      let updatedCount = 0;

      // Update all items for this class within the session range
      for (let i = 0; i < daySchedule.length; i++) {
        const item = daySchedule[i];
        if (item.class === editingRoom.class && item.slot >= editingRoom.startSlot && item.slot <= editingRoom.endSlot) {
          daySchedule[i] = { ...item, room: data.room };
          updatedCount++;
        }
      }

      // Use functional update to avoid stale closure if we were to rely on something else, but here we construct new array
      newSchedule[dayKey] = daySchedule;
      return newSchedule;
    });

    toast({
      title: "Đã cập nhật phòng học",
      description: `Lớp ${editingRoom.class} - Phòng ${data.room}`,
    });

    setRoomDialogOpen(false);
    setEditingRoom(null);
  };

  const handleDeleteTeacher = (dayKey: string, slotIndex: number, className: string) => {
    const dayScheduleKey = dayKey as keyof ScheduleData;

    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const daySchedule = [...newSchedule[dayScheduleKey]];

      // Remove the item matching the slot and class
      const filtered = daySchedule.filter(
        (item) => !(item.slot === slotIndex && item.class === className)
      );

      newSchedule[dayScheduleKey] = filtered;
      return newSchedule;
    });

    toast({
      title: "Đã xóa giáo viên",
      description: `Đã xóa giáo viên khỏi tiết ${slotIndex + 1}`,
    });
  };



  // Removed dateInfo as we now use weekRange

  // Get unique teachers and subjects for filters
  const allTeachers = Array.from(new Set(
    Object.values(schedule).flat().map(c => c.teacher)
  )).sort();

  const allSubjects = Array.from(new Set(
    Object.values(schedule).flat().map(c => c.class.split('-')[0])
  )).sort();

  // Filter schedule based on selected filters
  const getFilteredSchedule = () => {
    const filtered: ScheduleData = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    Object.keys(schedule).forEach((day) => {
      const dayKey = day as keyof ScheduleData;
      filtered[dayKey] = schedule[dayKey].filter((classItem) => {
        const matchesTeacher = filterTeacher === "all" || classItem.teacher === filterTeacher;
        const matchesSubject = filterSubject === "all" || classItem.class.startsWith(filterSubject);
        return matchesTeacher && matchesSubject;
      });
    });

    return filtered;
  };

  const filteredSchedule = getFilteredSchedule();

  const days = [
    { key: "monday", label: "Thứ 2", date: weekRange.monday.getDate(), month: weekRange.monday.getMonth() + 1 },
    { key: "tuesday", label: "Thứ 3", date: new Date(weekRange.monday.getTime() + 86400000).getDate(), month: new Date(weekRange.monday.getTime() + 86400000).getMonth() + 1 },
    { key: "wednesday", label: "Thứ 4", date: new Date(weekRange.monday.getTime() + 2 * 86400000).getDate(), month: new Date(weekRange.monday.getTime() + 2 * 86400000).getMonth() + 1 },
    { key: "thursday", label: "Thứ 5", date: new Date(weekRange.monday.getTime() + 3 * 86400000).getDate(), month: new Date(weekRange.monday.getTime() + 3 * 86400000).getMonth() + 1 },
    { key: "friday", label: "Thứ 6", date: new Date(weekRange.monday.getTime() + 4 * 86400000).getDate(), month: new Date(weekRange.monday.getTime() + 4 * 86400000).getMonth() + 1 },
    { key: "saturday", label: "Thứ 7", date: new Date(weekRange.monday.getTime() + 5 * 86400000).getDate(), month: new Date(weekRange.monday.getTime() + 5 * 86400000).getMonth() + 1 },
    { key: "sunday", label: "CN", date: weekRange.sunday.getDate(), month: weekRange.sunday.getMonth() + 1 },
  ];

  // Gantt chart helpers
  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const getFilteredTasks = () => {
    if (selectedTeacher === "all") {
      return TEACHER_TASKS;
    }
    return TEACHER_TASKS.filter(task => task.assigneeId === selectedTeacher);
  };

  return (
    <AdminLayout>

      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý lịch dạy</h1>
          <p className="text-muted-foreground">Phân công và theo dõi lịch dạy của giảng viên</p>
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
                      {format(currentMonth, "MMMM yyyy", { locale: vi })}
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
                tasks={getFilteredTasks()}
                startDate={startOfMonth(currentMonth)}
                endDate={endOfMonth(currentMonth)}
              />
            </CardContent>
          </Card>
        )}

        {/* Table View - Schedule Grid */}
        {ganttViewMode === 'table' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex bg-muted p-1 rounded-lg">
                <Button
                  variant={viewMode === 'excel' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('excel')}
                  className="text-sm"
                >
                  <LayoutList className="w-4 h-4 mr-2" />
                  Chi tiết
                </Button>
                <Button
                  variant={viewMode === 'overview' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('overview')}
                  className="text-sm"
                >
                  <Grip className="w-4 h-4 mr-2" />
                  Tổng quan
                </Button>
              </div>
            </div>
            {/* Schedule Grid */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Week navigation */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      onClick={handlePrevWeek}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                      <span className="text-sm font-medium">
                        Tuần {selectedWeek} - Tháng {selectedMonth}/{selectedYear}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({formatDate(weekRange.monday)} - {formatDate(weekRange.sunday)})
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextWeek}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="h-6 w-px bg-border hidden md:block" />

                  {/* Filters */}
                  {viewMode === 'excel' && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <Select value={filterTeacher} onValueChange={setFilterTeacher}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Giáo viên" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả GV</SelectItem>
                          {allTeachers.map((teacher) => (
                            <SelectItem key={teacher} value={teacher}>
                              {teacher}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Lớp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả các lớp</SelectItem>
                        {allSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>


                  <div className="h-6 w-px bg-border hidden md:block" />

                  {/* Month/Year selectors */}
                  <Select value={String(selectedMonth)} onValueChange={(val) => { setSelectedMonth(parseInt(val)); setSelectedWeek(1); }}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          Tháng {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={String(selectedYear)} onValueChange={(val) => { setSelectedYear(parseInt(val)); setSelectedWeek(1); }}>
                    <SelectTrigger className="w-[90px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {viewMode === 'excel' ? (
                    <ExcelScheduleTable
                      schedule={filteredSchedule}
                      timeSlots={timeSlots}
                      days={days}
                      onCellClick={handleCellClick}
                      onRoomClick={handleRoomClick}
                      onDeleteTeacher={handleDeleteTeacher}
                    />
                  ) : (
                    <OverviewScheduleTable
                      schedule={filteredSchedule}
                      timeSlots={timeSlots}
                      days={days}
                      onClassClick={(day, slot, className) => {
                        // Optional: Handle click on Overview cell to open edit dialog?
                        // For now, let's just use the same form opening logic if needed,
                        // but Overview might be read-only or we can map it.
                        // Let's find the class item and open form.
                        const item = schedule[day as keyof ScheduleData]?.find(c => c.slot === slot && c.class === className);
                        handleCellClick(day, slot, className, item);
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

      </div>

      {/* Class Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Chi tiết ca dạy</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Lớp học</p>
                  <Badge className="text-base">{selectedClass.class}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Giáo viên</p>
                  <p className="font-medium">{selectedClass.teacher}-sensei</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Phòng học</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Phòng {selectedClass.room}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Thời gian</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedClass.day} - {selectedClass.timeSlot}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">Số học viên</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedClass.students} học viên
                  </p>
                </div>

                {/* Student List */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Danh sách học viên</p>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {Array.from({ length: selectedClass.students }, (_, i) => (
                      <div key={i} className="p-2 border border-border rounded text-sm">
                        Học viên {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="border-t pt-4 space-y-2">
                <p className="text-sm font-medium">Nội dung bài học</p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">Bài {15 + selectedClass.slot}: Ngữ pháp cơ bản và luyện tập hội thoại</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-4 space-y-2">
                <p className="text-sm font-medium">Ghi chú</p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Chuẩn bị tài liệu học tập. Kiểm tra máy chiếu và loa trước giờ học.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>



      {/* Edit Class Dialog (Form) */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cập nhật lịch dạy</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lớp</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="teacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giáo viên</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên giáo viên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phòng</FormLabel>
                      <FormControl>
                        <Input placeholder="Phòng học" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="lessonContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung giảng dạy</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập nội dung bài học..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ghi chú thêm..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setFormDialogOpen(false)}>Hủy</Button>
                <Button type="submit">Lưu thay đổi</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Room Edit Dialog */}
      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cập nhật Phòng học</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Thiết lập phòng cho lớp <span className="font-bold text-foreground">{editingRoom?.class}</span> vào buổi này.
            </p>
            <Form {...roomForm}>
              <form onSubmit={roomForm.handleSubmit(onRoomSubmit)} className="space-y-4">
                <FormField
                  control={roomForm.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên Phòng</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: 201" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setRoomDialogOpen(false)}>Hủy</Button>
                  <Button type="submit">Lưu</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

    </AdminLayout >
  );
};

export default Schedule;
