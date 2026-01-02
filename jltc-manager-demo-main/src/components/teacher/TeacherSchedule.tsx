import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const timeSlots = ["08:00-09:00", "09:00-10:00", "10:30-11:30", "13:00-14:00", "14:15-15:15", "15:30-16:30"];

// Sample schedule data for teacher
const teacherSchedule = {
  monday: [
    { slot: 0, class: "N5-01", room: "P.101", students: 18, subject: "Tổng hợp" },
    { slot: 1, class: "N5-01", room: "P.101", students: 18, subject: "Tổng hợp" },
    { slot: 3, class: "N4-02", room: "P.203", students: 15, subject: "Ngữ pháp" },
  ],
  tuesday: [
    { slot: 2, class: "N3-01", room: "P.302", students: 12, subject: "Đọc hiểu" },
    { slot: 4, class: "N3-01", room: "P.302", students: 12, subject: "Đọc hiểu" },
    { slot: 5, class: "N3-01", room: "P.302", students: 12, subject: "Nghe" },
  ],
  wednesday: [
    { slot: 0, class: "N5-01", room: "P.101", students: 18, subject: "Tổng hợp" },
    { slot: 1, class: "N5-01", room: "P.101", students: 18, subject: "Tổng hợp" },
  ],
  thursday: [
    { slot: 3, class: "N4-02", room: "P.203", students: 15, subject: "Ngữ pháp" },
    { slot: 4, class: "N4-02", room: "P.203", students: 15, subject: "Hội thoại" },
  ],
  friday: [
    { slot: 0, class: "N3-01", room: "P.302", students: 12, subject: "Kanji" },
    { slot: 2, class: "N5-01", room: "P.101", students: 18, subject: "Tổng hợp" },
  ],
  saturday: [
    { slot: 0, class: "N5-01", room: "P.101", students: 18, subject: "Ôn tập" },
    { slot: 1, class: "N4-02", room: "P.203", students: 15, subject: "Ôn tập" },
  ],
  sunday: [],
};

type ScheduleData = typeof teacherSchedule;

const getWeekDateRange = (week: string, month: string, year: string) => {
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const weekNum = parseInt(week);

  const firstDay = new Date(yearNum, monthNum - 1, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(1 + (weekNum - 1) * 7);

  return {
    start: startDate.getDate(),
    startDate,
  };
};

const TeacherSchedule = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [selectedMonth, setSelectedMonth] = useState("12");
  const [selectedYear, setSelectedYear] = useState("2024");

  const dateRange = getWeekDateRange(selectedWeek, selectedMonth, selectedYear);

  const days = [
    { key: "monday", label: "Thứ 2", date: dateRange.startDate.getDate() },
    { key: "tuesday", label: "Thứ 3", date: dateRange.startDate.getDate() + 1 },
    { key: "wednesday", label: "Thứ 4", date: dateRange.startDate.getDate() + 2 },
    { key: "thursday", label: "Thứ 5", date: dateRange.startDate.getDate() + 3 },
    { key: "friday", label: "Thứ 6", date: dateRange.startDate.getDate() + 4 },
    { key: "saturday", label: "Thứ 7", date: dateRange.startDate.getDate() + 5 },
    { key: "sunday", label: "CN", date: dateRange.startDate.getDate() + 6 },
  ];

  // Calculate total sessions this week
  const totalSessions = Object.values(teacherSchedule).flat().length;

  return (
    <div className="space-y-6">
      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Lịch dạy tuần
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Tuần:</span>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tuần 1</SelectItem>
                    <SelectItem value="2">Tuần 2</SelectItem>
                    <SelectItem value="3">Tuần 3</SelectItem>
                    <SelectItem value="4">Tuần 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Tháng:</span>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[100px]">
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
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Năm:</span>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                {dateRange.start}/{selectedMonth} - {dateRange.start + 6}/{selectedMonth}/{selectedYear}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header */}
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="font-medium text-sm text-muted-foreground p-2">Ca học</div>
                {days.map((day) => (
                  <div key={day.key} className="font-medium text-center p-2 bg-muted rounded-lg">
                    <div>{day.label}</div>
                    <div className="text-xs text-muted-foreground">{day.date}/{selectedMonth}</div>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {timeSlots.map((slot, slotIndex) => (
                <div key={slotIndex} className="grid grid-cols-8 gap-2 mb-2">
                  <div className="p-3 rounded-lg text-sm font-medium flex flex-col items-center justify-center bg-primary/10 text-primary">
                    <span>Tiết {slotIndex + 1}</span>
                    <span className="text-xs">{slot}</span>
                  </div>
                  {days.map((day) => {
                    const daySchedule = teacherSchedule[day.key as keyof ScheduleData] || [];
                    const classData = daySchedule.find((c) => c.slot === slotIndex);

                    return (
                      <div
                        key={`${day.key}-${slotIndex}`}
                        className={cn(
                          "rounded-lg border-2 transition-all min-h-[80px]",
                          classData
                            ? "p-3 bg-primary/5 border-primary"
                            : "border-dashed border-border"
                        )}
                      >
                        {classData ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-primary text-xs">{classData.class}</Badge>
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {classData.room}
                              </Badge>
                            </div>
                            <p className="text-xs font-medium text-foreground">{classData.subject}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {classData.students} HV
                            </p>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">-</span>
                          </div>
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

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Thống kê tháng {selectedMonth}/{selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-primary">48</p>
              <p className="text-sm text-muted-foreground">Tiết đã dạy</p>
            </div>
            <div className="p-4 bg-success/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-success">12</p>
              <p className="text-sm text-muted-foreground">Tiết còn lại</p>
            </div>
            <div className="p-4 bg-warning/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-warning">2</p>
              <p className="text-sm text-muted-foreground">Tiết nghỉ</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-3xl font-bold text-foreground">62</p>
              <p className="text-sm text-muted-foreground">Tổng tiết tháng</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê tuần {selectedWeek}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-primary">{totalSessions}</p>
              <p className="text-sm text-muted-foreground">Tổng số tiết</p>
            </div>
            <div className="p-4 bg-success/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-success">3</p>
              <p className="text-sm text-muted-foreground">Số lớp phụ trách</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-3xl font-bold text-foreground">6</p>
              <p className="text-sm text-muted-foreground">Ngày có lịch dạy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherSchedule;
