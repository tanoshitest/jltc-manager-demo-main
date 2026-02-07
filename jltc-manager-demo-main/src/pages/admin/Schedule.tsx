import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock, Edit, User, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
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

  const [selectedClass, setSelectedClass] = useState<ClassItem & { day: string; timeSlot: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const [editMode, setEditMode] = useState<{ day: string; slot: number } | null>(null);
  const [filterTeacher, setFilterTeacher] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");



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

  return (
    <AdminLayout>

      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Xếp lịch dạy</h1>

          </div>
        </div>





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
              <ExcelScheduleTable
                schedule={filteredSchedule}
                timeSlots={timeSlots}
                days={days}
                onCellClick={handleCellClick}
                onRoomClick={handleRoomClick}
              />
            </div>
          </CardContent>
        </Card>

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
