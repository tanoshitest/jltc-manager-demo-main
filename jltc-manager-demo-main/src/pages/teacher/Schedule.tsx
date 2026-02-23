import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock, BookOpen, ChevronLeft, ChevronRight, LayoutList, Grip, Calendar } from "lucide-react";
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
import { useState } from "react";
import { ScheduleData, ClassItem, DayInfo } from "@/types/schedule";
import TeacherLayout from "@/components/TeacherLayout";
import React from "react";

// Demo: Simulating the logged-in teacher
const LOGGED_IN_TEACHER = "Hường";

const timeSlots = [
  "08:00-09:00", "09:00-10:00", "10:30-11:30",
  "13:00-14:00", "14:15-15:15", "15:30-16:30",
  "18:00-19:00", "19:15-20:15", "20:30-21:30"
];

// Full center schedule — teacher Hường has a realistic weekly teaching load
const fullSchedule: ScheduleData = {
  monday: [
    { slot: 0, class: "N5-A1", teacher: "Hường", room: "201", students: 18, classLevel: "Sơ cấp" },
    { slot: 1, class: "N5-A1", teacher: "Hường", room: "201", students: 18, classLevel: "Sơ cấp" },
    { slot: 3, class: "N4-B2", teacher: "Hường", room: "305", students: 14, classLevel: "Trung cấp" },
    { slot: 4, class: "N4-B2", teacher: "Hường", room: "305", students: 14, classLevel: "Trung cấp" },
    // Other teachers
    { slot: 0, class: "N5-A2", teacher: "Khôi", room: "202", students: 16, classLevel: "Sơ cấp" },
    { slot: 2, class: "N4-C1", teacher: "Tanaka", room: "301", students: 15, classLevel: "Trung cấp" },
    { slot: 5, class: "N3-D1", teacher: "Suzuki", room: "302", students: 12, classLevel: "Cao cấp" },
  ],
  tuesday: [
    { slot: 0, class: "N5-A3", teacher: "Hường", room: "203", students: 17, classLevel: "Sơ cấp" },
    { slot: 1, class: "N5-A3", teacher: "Hường", room: "203", students: 17, classLevel: "Sơ cấp" },
    { slot: 6, class: "N5-E1", teacher: "Hường", room: "201", students: 12, classLevel: "Sơ cấp" },
    { slot: 7, class: "N5-E1", teacher: "Hường", room: "201", students: 12, classLevel: "Sơ cấp" },
    // Other teachers
    { slot: 0, class: "N4-B1", teacher: "Linh", room: "301", students: 14, classLevel: "Trung cấp" },
    { slot: 3, class: "N3-D2", teacher: "Sato", room: "302", students: 11, classLevel: "Cao cấp" },
  ],
  wednesday: [
    { slot: 0, class: "N5-A1", teacher: "Hường", room: "201", students: 18, classLevel: "Sơ cấp" },
    { slot: 1, class: "N5-A1", teacher: "Hường", room: "201", students: 18, classLevel: "Sơ cấp" },
    { slot: 3, class: "N4-B2", teacher: "Hường", room: "305", students: 14, classLevel: "Trung cấp" },
    { slot: 4, class: "N4-B2", teacher: "Hường", room: "305", students: 14, classLevel: "Trung cấp" },
    // Other teachers
    { slot: 2, class: "N4-C1", teacher: "Tanaka", room: "301", students: 15, classLevel: "Trung cấp" },
    { slot: 5, class: "N3-D1", teacher: "Suzuki", room: "302", students: 12, classLevel: "Cao cấp" },
  ],
  thursday: [
    { slot: 0, class: "N5-A3", teacher: "Hường", room: "203", students: 17, classLevel: "Sơ cấp" },
    { slot: 1, class: "N5-A3", teacher: "Hường", room: "203", students: 17, classLevel: "Sơ cấp" },
    { slot: 3, class: "N5-A2", teacher: "Hường", room: "202", students: 16, classLevel: "Sơ cấp" },
    { slot: 6, class: "N5-E1", teacher: "Hường", room: "201", students: 12, classLevel: "Sơ cấp" },
    { slot: 7, class: "N5-E1", teacher: "Hường", room: "201", students: 12, classLevel: "Sơ cấp" },
    // Other teachers
    { slot: 2, class: "N4-B1", teacher: "Linh", room: "301", students: 14, classLevel: "Trung cấp" },
    { slot: 4, class: "N3-D2", teacher: "Sato", room: "302", students: 11, classLevel: "Cao cấp" },
  ],
  friday: [
    { slot: 0, class: "N5-A1", teacher: "Hường", room: "201", students: 18, classLevel: "Sơ cấp" },
    { slot: 1, class: "N5-A1", teacher: "Hường", room: "201", students: 18, classLevel: "Sơ cấp" },
    { slot: 3, class: "N4-B2", teacher: "Hường", room: "305", students: 14, classLevel: "Trung cấp" },
    { slot: 4, class: "N4-B2", teacher: "Hường", room: "305", students: 14, classLevel: "Trung cấp" },
    // Other teachers
    { slot: 2, class: "N4-C1", teacher: "Tanaka", room: "301", students: 15, classLevel: "Trung cấp" },
  ],
  saturday: [
    { slot: 0, class: "N5-A3", teacher: "Hường", room: "203", students: 17, classLevel: "Sơ cấp" },
    { slot: 1, class: "N5-A3", teacher: "Hường", room: "203", students: 17, classLevel: "Sơ cấp" },
    { slot: 2, class: "N5-A2", teacher: "Hường", room: "202", students: 16, classLevel: "Sơ cấp" },
    // Other teachers
    { slot: 3, class: "N3-D1", teacher: "Suzuki", room: "302", students: 12, classLevel: "Cao cấp" },
  ],
  sunday: [],
};

// Filter schedule to only show the logged-in teacher's classes
const getTeacherSchedule = (teacher: string): ScheduleData => {
  const filtered: ScheduleData = { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] };
  (Object.keys(fullSchedule) as (keyof ScheduleData)[]).forEach((day) => {
    filtered[day] = fullSchedule[day].filter((item) => item.teacher === teacher);
  });
  return filtered;
};

// --- Simple Teacher Schedule Table (read-only, personal view) ---

const SESSIONS = [
  { name: "SÁNG", slots: [0, 1, 2] },
  { name: "CHIỀU", slots: [3, 4, 5] },
  { name: "TỐI", slots: [6, 7, 8] },
];

interface TeacherScheduleTableProps {
  schedule: ScheduleData;
  timeSlots: string[];
  days: DayInfo[];
  onCellClick: (day: string, slot: number, item: ClassItem) => void;
}

const TeacherScheduleTable: React.FC<TeacherScheduleTableProps> = ({ schedule, timeSlots: ts, days, onCellClick }) => {
  const findItem = (dayKey: string, slot: number) => {
    return (schedule[dayKey as keyof ScheduleData] || []).find(c => c.slot === slot);
  };

  // Color palette for different classes
  const CLASS_COLORS: Record<string, { bg: string; text: string; border: string }> = {};
  const PALETTE = [
    { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
    { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
    { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  ];

  // Assign colors to unique classes
  const allClasses = Array.from(new Set(Object.values(schedule).flat().map(c => c.class))).sort();
  allClasses.forEach((cls, i) => {
    CLASS_COLORS[cls] = PALETTE[i % PALETTE.length];
  });

  const getColor = (className: string) => CLASS_COLORS[className] || PALETTE[0];

  return (
    <div className="overflow-x-auto border rounded-md shadow-sm">
      <table className="w-full border-collapse min-w-[900px] text-sm">
        <thead>
          <tr className="bg-primary/10 text-center font-bold text-foreground border-b border-border">
            <th className="border p-2 w-[80px] bg-primary/10" rowSpan={2}>BUỔI</th>
            <th className="border p-2 w-[120px] bg-primary/10" rowSpan={2}>TIẾT</th>
            {days.map((day) => (
              <th key={day.key} className="border p-2 bg-primary/5 min-w-[120px]">
                <div className="font-bold">{day.label}</div>
              </th>
            ))}
          </tr>
          <tr className="bg-muted/30 text-center text-xs text-muted-foreground border-b-2">
            {days.map((day) => (
              <th key={day.key} className="border p-1">
                {String(day.date).padStart(2, '0')}/{String(day.month).padStart(2, '0')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SESSIONS.map((session) => (
            <React.Fragment key={session.name}>
              {session.slots.map((slotIndex, idxInSession) => (
                <tr key={`${session.name}-${slotIndex}`} className="hover:bg-muted/20 transition-colors">
                  {idxInSession === 0 && (
                    <td
                      className="border p-2 text-center font-bold bg-muted/10 text-muted-foreground"
                      rowSpan={session.slots.length}
                    >
                      {session.name}
                    </td>
                  )}
                  <td className="border p-2 text-center">
                    <div className="font-medium">Tiết {slotIndex + 1}</div>
                    <div className="text-xs text-muted-foreground">({ts[slotIndex]})</div>
                  </td>
                  {days.map((day) => {
                    const item = findItem(day.key, slotIndex);
                    const color = item ? getColor(item.class) : null;
                    return (
                      <td
                        key={day.key}
                        className={cn(
                          "border p-1.5 text-center transition-colors",
                          item && "cursor-pointer"
                        )}
                        onClick={() => item && onCellClick(day.key, slotIndex, item)}
                      >
                        {item && color ? (
                          <div className={cn("p-2 rounded-lg border text-center", color.bg, color.border)}>
                            <p className={cn("font-bold text-sm", color.text)}>{item.class}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">P.{item.room}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/20">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Helper: get current week number in a given month ---
const getCurrentWeekInMonth = (month: number, year: number) => {
  const today = new Date();
  const firstDay = new Date(year, month - 1, 1);
  let currentDate = new Date(firstDay);
  let weekNum = 1;
  const visited = new Set<number>();

  while (currentDate.getMonth() === month - 1) {
    const dayOfWeek = currentDate.getDay();
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    if (!visited.has(monday.getTime())) {
      visited.add(monday.getTime());
      if (today >= monday && today <= sunday) return weekNum;
      weekNum++;
    }
    currentDate.setDate(currentDate.getDate() + 7 - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  }
  return 1;
};

// --- Main Component ---

const TeacherSchedule = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedWeek, setSelectedWeek] = useState(() => getCurrentWeekInMonth(now.getMonth() + 1, now.getFullYear()));
  const [selectedClass, setSelectedClass] = useState<ClassItem & { dayLabel: string; timeSlot: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Pre-filter: only show logged-in teacher's schedule
  const teacherSchedule = getTeacherSchedule(LOGGED_IN_TEACHER);

  // Count total classes this week
  const totalClasses = Object.values(teacherSchedule).reduce((sum, day) => sum + day.length, 0);
  const uniqueClasses = new Set(Object.values(teacherSchedule).flat().map(c => c.class));

  const getWeeksInMonth = (month: number, year: number) => {
    const weeks: { week: number; start: Date; end: Date }[] = [];
    const currentDate = new Date(year, month - 1, 1);
    let weekNum = 1;

    while (currentDate.getMonth() === month - 1) {
      const dayOfWeek = currentDate.getDay();
      const monday = new Date(currentDate);
      monday.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      if (!weeks.some(w => w.start.getTime() === monday.getTime())) {
        weeks.push({ week: weekNum, start: new Date(monday), end: new Date(sunday) });
        weekNum++;
      }
      currentDate.setDate(currentDate.getDate() + 7 - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    }
    return weeks;
  };

  const weeksInMonth = getWeeksInMonth(selectedMonth, selectedYear);
  const weekData = weeksInMonth[selectedWeek - 1] || { start: new Date(), end: new Date() };
  const formatDate = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}`;

  const handlePrevWeek = () => {
    if (selectedWeek > 1) setSelectedWeek(selectedWeek - 1);
    else {
      const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
      const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
      const prevWeeks = getWeeksInMonth(prevMonth, prevYear);
      setSelectedMonth(prevMonth);
      setSelectedYear(prevYear);
      setSelectedWeek(prevWeeks.length);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek < weeksInMonth.length) setSelectedWeek(selectedWeek + 1);
    else {
      const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
      const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
      setSelectedMonth(nextMonth);
      setSelectedYear(nextYear);
      setSelectedWeek(1);
    }
  };

  const handleCellClick = (dayKey: string, slotIndex: number, item: ClassItem) => {
    const dayLabel = days.find(d => d.key === dayKey)?.label || dayKey;
    setSelectedClass({ ...item, dayLabel, timeSlot: timeSlots[slotIndex] });
    setDialogOpen(true);
  };

  const days: DayInfo[] = [
    { key: "monday", label: "Thứ 2", date: weekData.start.getDate(), month: weekData.start.getMonth() + 1 },
    { key: "tuesday", label: "Thứ 3", date: new Date(weekData.start.getTime() + 86400000).getDate(), month: new Date(weekData.start.getTime() + 86400000).getMonth() + 1 },
    { key: "wednesday", label: "Thứ 4", date: new Date(weekData.start.getTime() + 2 * 86400000).getDate(), month: new Date(weekData.start.getTime() + 2 * 86400000).getMonth() + 1 },
    { key: "thursday", label: "Thứ 5", date: new Date(weekData.start.getTime() + 3 * 86400000).getDate(), month: new Date(weekData.start.getTime() + 3 * 86400000).getMonth() + 1 },
    { key: "friday", label: "Thứ 6", date: new Date(weekData.start.getTime() + 4 * 86400000).getDate(), month: new Date(weekData.start.getTime() + 4 * 86400000).getMonth() + 1 },
    { key: "saturday", label: "Thứ 7", date: new Date(weekData.start.getTime() + 5 * 86400000).getDate(), month: new Date(weekData.start.getTime() + 5 * 86400000).getMonth() + 1 },
    { key: "sunday", label: "CN", date: weekData.end.getDate(), month: weekData.end.getMonth() + 1 },
  ];

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Lịch dạy tuần này</h1>
          <p className="text-muted-foreground">
            Xin chào, <span className="font-semibold text-primary">{LOGGED_IN_TEACHER}</span>-sensei! Đây là kế hoạch giảng dạy của bạn.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{totalClasses}</p>
                <p className="text-xs text-muted-foreground">Tổng số tiết dạy</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{uniqueClasses.size}</p>
                <p className="text-xs text-muted-foreground">Lớp đang phụ trách</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  {Object.values(teacherSchedule).flat().reduce((sum, c) => sum + c.students, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Tổng học viên</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={handlePrevWeek}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                  <span className="text-sm font-medium">
                    Tuần {selectedWeek} - Tháng {selectedMonth}/{selectedYear}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({formatDate(weekData.start)} - {formatDate(weekData.end)})
                  </span>
                </div>
                <Button size="icon" variant="outline" onClick={handleNextWeek}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="h-6 w-px bg-border hidden md:block" />

              <Select value={String(selectedMonth)} onValueChange={(v) => { setSelectedMonth(parseInt(v)); setSelectedWeek(1); }}>
                <SelectTrigger className="w-[110px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>Tháng {i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(selectedYear)} onValueChange={(v) => { setSelectedYear(parseInt(v)); setSelectedWeek(1); }}>
                <SelectTrigger className="w-[90px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <TeacherScheduleTable
              schedule={teacherSchedule}
              timeSlots={timeSlots}
              days={days}
              onCellClick={handleCellClick}
            />
          </CardContent>
        </Card>
      </div>

      {/* Class Detail Dialog (read-only) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-primary">
              <Calendar className="w-5 h-5" />
              Chi tiết ca dạy
            </DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Lớp học</p>
                  <Badge className="text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20">{selectedClass.class}</Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Cấp độ</p>
                  <Badge variant="outline" className="text-sm">{selectedClass.classLevel || "N/A"}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm bg-muted/30 p-2.5 rounded-lg border">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">{selectedClass.dayLabel} • {selectedClass.timeSlot}</span>
                </div>
                <div className="flex items-center gap-3 text-sm bg-muted/30 p-2.5 rounded-lg border">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">Phòng {selectedClass.room}</span>
                </div>
                <div className="flex items-center gap-3 text-sm bg-muted/30 p-2.5 rounded-lg border">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium">{selectedClass.students} học viên</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Nội dung giảng dạy</p>
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-sm text-foreground/80 italic">
                    Bài {15 + selectedClass.slot}: Ngữ pháp cơ bản và luyện tập hội thoại
                  </p>
                </div>
              </div>


            </div>
          )}
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  );
};

export default TeacherSchedule;
