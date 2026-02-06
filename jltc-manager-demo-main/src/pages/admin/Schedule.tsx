import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin, Clock, GripVertical, Edit, User, BookOpen, Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExcelScheduleTable from "@/components/admin/ExcelScheduleTable";

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

const DraggableClassCard = ({
  classData,
  day,
  slotIndex,
  onClick
}: {
  classData: ClassItem;
  day: string;
  slotIndex: number;
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${day}-${slotIndex}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-3 rounded-lg border-2 transition-all min-h-[80px] bg-primary/5 border-primary hover:bg-primary/10 cursor-pointer",
        isDragging && "ring-2 ring-primary"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <GripVertical className="w-3 h-3 text-muted-foreground" />
            <Badge className="bg-primary text-xs">{classData.class}</Badge>
          </div>
          <Badge variant="outline" className="text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            {classData.room}
          </Badge>
        </div>
        <p className="text-xs font-medium">{classData.teacher}-sensei</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Users className="w-3 h-3" />
          {classData.students} HV
        </p>
      </div>
    </div>
  );
};

const formSchema = z.object({
  class: z.string().min(1, "Vui lòng nhập tên lớp"),
  teacher: z.string().min(1, "Vui lòng nhập tên giáo viên"),
  room: z.string().min(1, "Vui lòng nhập phòng học"),
  students: z.coerce.number().min(1, "Số học viên phải lớn hơn 0"),
  lessonContent: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const quickScheduleSchema = z.object({
  teacherName: z.string().min(1, "Vui lòng chọn giáo viên"),
  subject: z.string().min(1, "Vui lòng nhập môn dạy"),
  classLevel: z.string().min(1, "Vui lòng chọn lớp"),
  day: z.string().min(1, "Vui lòng chọn ngày"),
  timeSlot: z.string().min(1, "Vui lòng chọn tiết dạy"),
  room: z.string().min(1, "Vui lòng nhập phòng dạy"),
  month: z.string().min(1, "Vui lòng chọn tháng"),
  year: z.string().min(1, "Vui lòng chọn năm"),
});

type QuickScheduleFormValues = z.infer<typeof quickScheduleSchema>;

const Schedule = () => {
  const [searchParams] = useSearchParams();
  const teacherFromUrl = searchParams.get("teacher") || "";

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(12);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [schedule, setSchedule] = useState<ScheduleData>(initialSchedule);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassItem & { day: string; timeSlot: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [quickScheduleDialogOpen, setQuickScheduleDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<{ day: string; slot: number } | null>(null);
  const [filterTeacher, setFilterTeacher] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterClassLevel, setFilterClassLevel] = useState<string>("all");

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

  const quickScheduleForm = useForm<QuickScheduleFormValues>({
    resolver: zodResolver(quickScheduleSchema),
    defaultValues: {
      teacherName: teacherFromUrl,
      subject: "",
      classLevel: "",
      day: "monday",
      timeSlot: "",
      room: "",
      month: String(selectedMonth),
      year: String(selectedYear),
    },
  });

  // Pre-select teacher filter if teacher is passed from URL
  useEffect(() => {
    if (teacherFromUrl) {
      // Set filter to the teacher from URL (even if not in existing schedule, for new scheduling)
      setFilterTeacher(teacherFromUrl);
      // Also set the teacher name in the quick schedule form for when user creates new schedule
      quickScheduleForm.setValue("teacherName", teacherFromUrl);
    }
  }, [teacherFromUrl]);

  const handleOpenQuickSchedule = (day: string, slot: number) => {
    quickScheduleForm.reset({
      teacherName: teacherFromUrl || "",
      subject: "",
      classLevel: "",
      day: day,
      timeSlot: String(slot),
      room: "",
      month: String(selectedMonth),
      year: String(selectedYear),
    });
    setQuickScheduleDialogOpen(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const [activeDay, activeSlot] = activeId.split("-");
    const [overDay, overSlot] = overId.split("-");

    setSchedule((prev) => {
      const newSchedule = { ...prev };

      // Find the class being dragged
      const activeDaySchedule = newSchedule[activeDay as keyof ScheduleData];
      const activeClassIndex = activeDaySchedule.findIndex(
        (c) => c.slot === parseInt(activeSlot)
      );

      if (activeClassIndex === -1) return prev;

      const activeClass = { ...activeDaySchedule[activeClassIndex] };

      // Find if there's already a class in the target slot
      const overDaySchedule = newSchedule[overDay as keyof ScheduleData];
      const overClassIndex = overDaySchedule.findIndex(
        (c) => c.slot === parseInt(overSlot)
      );

      // Remove from original position
      newSchedule[activeDay as keyof ScheduleData] = activeDaySchedule.filter(
        (_, index) => index !== activeClassIndex
      );

      // If target slot has a class, swap them
      if (overClassIndex !== -1) {
        const overClass = { ...overDaySchedule[overClassIndex] };
        overClass.slot = parseInt(activeSlot);
        newSchedule[activeDay as keyof ScheduleData].push(overClass);

        newSchedule[overDay as keyof ScheduleData] = overDaySchedule.filter(
          (_, index) => index !== overClassIndex
        );
      }

      // Add to new position
      activeClass.slot = parseInt(overSlot);
      newSchedule[overDay as keyof ScheduleData].push(activeClass);

      return newSchedule;
    });
  };

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

  const onSubmit = (data: FormValues) => {
    if (!editMode) return;

    const newClass: ClassItem = {
      slot: editMode.slot,
      class: data.class,
      teacher: data.teacher,
      room: data.room,
      students: data.students,
    };

    const dayKey = editMode.day as keyof ScheduleData;
    const existingClass = schedule[dayKey].find((c) => c.slot === editMode.slot);
    const isEdit = !!existingClass;

    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const daySchedule = [...newSchedule[dayKey]];

      const existingIndex = daySchedule.findIndex((c) => c.slot === editMode.slot);
      if (existingIndex !== -1) {
        daySchedule[existingIndex] = newClass;
      } else {
        daySchedule.push(newClass);
      }

      newSchedule[dayKey] = daySchedule;
      return newSchedule;
    });

    toast({
      title: isEdit ? "Đã cập nhật ca dạy" : "Đã tạo ca dạy mới",
      description: `${data.class} - ${data.teacher}`,
    });

    setFormDialogOpen(false);
    setEditMode(null);
  };

  const onQuickScheduleSubmit = (data: QuickScheduleFormValues) => {
    const dayKey = data.day as keyof ScheduleData;
    const slotIndex = parseInt(data.timeSlot);

    const newClass: ClassItem = {
      slot: slotIndex,
      class: data.subject,
      teacher: data.teacherName,
      room: data.room,
      students: 15, // Default value
      classLevel: data.classLevel,
    };

    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const daySchedule = [...newSchedule[dayKey]];

      // Allow multiple classes in the same slot - just add the new class
      daySchedule.push(newClass);
      newSchedule[dayKey] = daySchedule;
      return newSchedule;
    });

    toast({
      title: "Đã xếp lịch thành công",
      description: `${data.teacherName} - ${data.subject} vào ${allSlots[slotIndex]}`,
    });

    setQuickScheduleDialogOpen(false);
    quickScheduleForm.reset();
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
        const matchesClassLevel = filterClassLevel === "all" || classItem.classLevel === filterClassLevel;
        return matchesTeacher && matchesSubject && matchesClassLevel;
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

  return (
    <AdminLayout>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Xếp lịch dạy</h1>
              <p className="text-muted-foreground">Quản lý lịch dạy và phòng học</p>
            </div>
          </div>

          <Tabs defaultValue="table" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="calendar">Lịch biểu</TabsTrigger>
                <TabsTrigger value="table">Dạng bảng (Excel)</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calendar" className="space-y-6">
              {/* Quick Schedule Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Xếp lịch</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...quickScheduleForm}>
                    <form onSubmit={quickScheduleForm.handleSubmit(onQuickScheduleSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField
                          control={quickScheduleForm.control}
                          name="classLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lớp</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn lớp" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="N5">N5</SelectItem>
                                  <SelectItem value="N4">N4</SelectItem>
                                  <SelectItem value="N3">N3</SelectItem>
                                  <SelectItem value="N2">N2</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={quickScheduleForm.control}
                          name="teacherName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giáo viên</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập tên giáo viên" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={quickScheduleForm.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Môn dạy</FormLabel>
                              <FormControl>
                                <Input placeholder="Ví dụ: N5-01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={quickScheduleForm.control}
                          name="room"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phòng dạy</FormLabel>
                              <FormControl>
                                <Input placeholder="Ví dụ: 201" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField
                          control={quickScheduleForm.control}
                          name="timeSlot"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tiết dạy</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn tiết" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeSlots.map((slot, index) => (
                                    <SelectItem key={index} value={String(index)}>
                                      Tiết {index + 1}: {slot}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={quickScheduleForm.control}
                          name="day"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn ngày" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 31 }, (_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={quickScheduleForm.control}
                          name="month"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tháng</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn tháng" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 12 }, (_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>
                                      Tháng {i + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={quickScheduleForm.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Năm</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn năm" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="2024">2024</SelectItem>
                                  <SelectItem value="2025">2025</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" className="bg-primary hover:bg-primary-dark">
                          <Plus className="w-4 h-4 mr-2" />
                          Xếp lịch
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Schedule Grid */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Week navigation */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
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
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <Select value={filterSubject} onValueChange={setFilterSubject}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Môn học" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả môn</SelectItem>
                          {allSubjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={filterClassLevel} onValueChange={setFilterClassLevel}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Lớp" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả lớp</SelectItem>
                          <SelectItem value="N5">N5</SelectItem>
                          <SelectItem value="N4">N4</SelectItem>
                          <SelectItem value="N3">N3</SelectItem>
                          <SelectItem value="N2">N2</SelectItem>
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
                    <div className="min-w-[1000px]">
                      {/* Header */}
                      <div className="grid grid-cols-8 gap-2 mb-2">
                        <div className="font-medium text-sm text-muted-foreground p-2">Ca học</div>
                        {days.map((day) => (
                          <div key={day.key} className="font-medium text-center p-2 bg-muted rounded-lg">
                            <div>{day.label}</div>
                            <div className="text-xs text-muted-foreground">{day.date}/{day.month}</div>
                          </div>
                        ))}
                      </div>

                      {/* Time slots */}
                      {allSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="grid grid-cols-8 gap-2 mb-2">
                          <div
                            className="p-3 rounded-lg text-sm font-medium flex items-center justify-center bg-primary/10 text-primary"
                          >
                            Tiết {slotIndex + 1}<br />{slot}
                          </div>
                          {days.map((day) => {
                            const daySchedule = filteredSchedule[day.key as keyof typeof filteredSchedule] || [];
                            const classesInSlot = daySchedule.filter((c) => c.slot === slotIndex);

                            return (
                              <div
                                key={`${day.key}-${slotIndex}`}
                                id={`${day.key}-${slotIndex}`}
                                className={cn(
                                  "rounded-lg border-2 border-dashed transition-all min-h-[80px]",
                                  classesInSlot.length === 0 && "border-border hover:bg-muted/50 p-3 cursor-pointer flex items-center justify-center",
                                  classesInSlot.length > 0 && "border-transparent p-1"
                                )}
                                onClick={() => {
                                  if (classesInSlot.length === 0) {
                                    handleOpenQuickSchedule(day.key, slotIndex);
                                  }
                                }}
                              >
                                {classesInSlot.length > 0 ? (
                                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                                    {classesInSlot.map((classData, idx) => (
                                      <div
                                        key={`${day.key}-${slotIndex}-${idx}`}
                                        className="p-2 rounded-lg border bg-primary/5 border-primary/30 hover:bg-primary/10 cursor-pointer transition-all"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedClass({
                                            ...classData,
                                            day: day.label,
                                            timeSlot: allSlots[slotIndex]
                                          });
                                          setDialogOpen(true);
                                        }}
                                      >
                                        <div className="flex items-center justify-between gap-1">
                                          <Badge className="bg-primary text-[10px] px-1.5 py-0">{classData.class}</Badge>
                                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                                            <MapPin className="w-2.5 h-2.5 mr-0.5" />
                                            {classData.room}
                                          </Badge>
                                        </div>
                                        <p className="text-[11px] font-medium mt-1">{classData.teacher}</p>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                          <Users className="w-2.5 h-2.5" />
                                          {classData.students} HV
                                        </p>
                                      </div>
                                    ))}
                                    <div
                                      className="p-1.5 rounded border border-dashed border-muted-foreground/30 hover:bg-muted/50 cursor-pointer flex items-center justify-center"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenQuickSchedule(day.key, slotIndex);
                                      }}
                                    >
                                      <Plus className="w-3 h-3 text-muted-foreground mr-1" />
                                      <span className="text-[10px] text-muted-foreground">Thêm</span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">+ Thêm ca dạy</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>Bảng lịch dạy tổng hợp</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExcelScheduleTable schedule={schedule} timeSlots={allSlots} days={days} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

        {/* Quick Schedule Dialog */}
        <Dialog open={quickScheduleDialogOpen} onOpenChange={setQuickScheduleDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Thêm ca dạy mới</DialogTitle>
            </DialogHeader>
            <Form {...quickScheduleForm}>
              <form onSubmit={quickScheduleForm.handleSubmit(onQuickScheduleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={quickScheduleForm.control}
                    name="teacherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên giáo viên</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giáo viên" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Yamada">Yamada</SelectItem>
                            <SelectItem value="Tanaka">Tanaka</SelectItem>
                            <SelectItem value="Suzuki">Suzuki</SelectItem>
                            <SelectItem value="Sato">Sato</SelectItem>
                            <SelectItem value="Watanabe">Watanabe</SelectItem>
                            <SelectItem value="Ito">Ito</SelectItem>
                            <SelectItem value="Kobayashi">Kobayashi</SelectItem>
                            <SelectItem value="Nakamura">Nakamura</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={quickScheduleForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Môn dạy</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: N5-01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={quickScheduleForm.control}
                    name="room"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phòng dạy</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: 201" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={quickScheduleForm.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thứ</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn thứ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monday">Thứ 2</SelectItem>
                            <SelectItem value="tuesday">Thứ 3</SelectItem>
                            <SelectItem value="wednesday">Thứ 4</SelectItem>
                            <SelectItem value="thursday">Thứ 5</SelectItem>
                            <SelectItem value="friday">Thứ 6</SelectItem>
                            <SelectItem value="saturday">Thứ 7</SelectItem>
                            <SelectItem value="sunday">Chủ nhật</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={quickScheduleForm.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiết dạy</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tiết" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((slot, index) => (
                              <SelectItem key={index} value={String(index)}>
                                Tiết {index + 1}: {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={quickScheduleForm.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn ngày" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={quickScheduleForm.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tháng</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tháng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                Tháng {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={quickScheduleForm.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Năm</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn năm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setQuickScheduleDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    Xếp lịch
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </DndContext>
    </AdminLayout>
  );
};

export default Schedule;
