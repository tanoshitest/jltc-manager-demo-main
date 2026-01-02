import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// 0: Ngày nghỉ, 1: Có mặt, 2: Vắng có phép, 3: Vắng không phép
const attendanceData: { status: number; reason?: string }[][] = [
  [
    { status: 1 }, { status: 1 }, { status: 1 }, { status: 1 }, { status: 1 }, { status: 0 }, { status: 0 }
  ],
  [
    { status: 1 }, { status: 3 }, { status: 2, reason: "Bận việc gia đình" }, { status: 1 }, { status: 1 }, { status: 0 }, { status: 0 }
  ],
  [
    { status: 1 }, { status: 1 }, { status: 1 }, { status: 1 }, { status: 1 }, { status: 0 }, { status: 0 }
  ],
  [
    { status: 1 }, { status: 1 }, { status: 1 }, { status: 3 }, { status: 1 }, { status: 0 }, { status: 0 }
  ],
  [
    { status: 1 }, { status: 1 }, { status: 1 }, { status: 1 }, { status: 1 }, { status: 0 }, { status: 0 }
  ],
];

const statusConfig: Record<number, { label: string; color: string; textColor: string }> = {
  0: { label: "Ngày nghỉ", color: "bg-muted", textColor: "text-muted-foreground" },
  1: { label: "Có mặt", color: "bg-success", textColor: "text-white" },
  2: { label: "Vắng có phép", color: "bg-warning", textColor: "text-white" },
  3: { label: "Vắng không phép", color: "bg-destructive", textColor: "text-white" },
};

const StudentAttendance = () => {
  const [selectedMonth, setSelectedMonth] = useState("11");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedAbsence, setSelectedAbsence] = useState<{ day: number; status: number; reason?: string } | null>(null);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert to Monday = 0
  };

  const month = parseInt(selectedMonth);
  const year = parseInt(selectedYear);
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);

  // Generate calendar data
  const generateCalendarWeeks = () => {
    const weeks: { day: number | null; status: number; reason?: string }[][] = [];
    let currentDay = 1;
    
    // First week with offset
    const firstWeek: { day: number | null; status: number; reason?: string }[] = [];
    for (let i = 0; i < 7; i++) {
      if (i < firstDay) {
        firstWeek.push({ day: null, status: 0 });
      } else {
        const weekIndex = Math.floor((currentDay - 1) / 7);
        const dayIndex = (currentDay - 1) % 7;
        const data = attendanceData[weekIndex]?.[dayIndex] || { status: 0 };
        firstWeek.push({ day: currentDay, ...data });
        currentDay++;
      }
    }
    weeks.push(firstWeek);

    // Remaining weeks
    while (currentDay <= daysInMonth) {
      const week: { day: number | null; status: number; reason?: string }[] = [];
      for (let i = 0; i < 7; i++) {
        if (currentDay <= daysInMonth) {
          const weekIndex = Math.floor((currentDay - 1) / 7);
          const dayIndex = (currentDay - 1) % 7;
          const data = attendanceData[weekIndex]?.[dayIndex] || { status: 0 };
          week.push({ day: currentDay, ...data });
          currentDay++;
        } else {
          week.push({ day: null, status: 0 });
        }
      }
      weeks.push(week);
    }

    return weeks;
  };

  const calendarWeeks = generateCalendarWeeks();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Tổng buổi học</p>
              <p className="text-3xl font-bold text-primary">20</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Có mặt</p>
              <p className="text-3xl font-bold text-success">18</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Vắng mặt</p>
              <p className="text-3xl font-bold text-destructive">2</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Tỷ lệ chuyên cần</p>
              <p className="text-3xl font-bold text-primary">90%</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Công cụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Xuất bảng điểm danh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Lịch điểm danh</CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tháng:</span>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[120px]">
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-4">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={cn("w-4 h-4 rounded", config.color)} />
                    <span className="text-sm text-muted-foreground">{config.label}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid - Google Calendar Style */}
              <div className="border border-border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-7 bg-muted">
                  {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"].map((day) => (
                    <div key={day} className="p-3 text-center font-medium text-sm border-r border-border last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Weeks */}
                {calendarWeeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 border-t border-border">
                    {week.map((dayData, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={cn(
                          "min-h-[100px] p-2 border-r border-border last:border-r-0 transition-colors",
                          dayData.day ? "hover:bg-muted/50" : "bg-muted/20"
                        )}
                      >
                        {dayData.day && (
                          <div className="h-full flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground mb-2">
                              {dayData.day}
                            </span>
                            {dayData.status !== 0 && (
                              <div className="flex-1 flex items-center justify-center">
                                {(dayData.status === 2 || dayData.status === 3) ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={cn(
                                          "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer",
                                          statusConfig[dayData.status].color
                                        )}
                                        onClick={() => setSelectedAbsence({ day: dayData.day!, status: dayData.status, reason: dayData.reason })}
                                      >
                                        <span className={cn("font-bold", statusConfig[dayData.status].textColor)}>✗</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[200px]">
                                      <p className="font-semibold mb-1">
                                        {dayData.status === 2 ? "Vắng có phép" : "Vắng không phép"}
                                      </p>
                                      {dayData.status === 2 && dayData.reason && (
                                        <p className="text-sm">Lý do: {dayData.reason}</p>
                                      )}
                                      {dayData.status === 3 && (
                                        <p className="text-sm text-destructive-foreground">Bấm để xem chi tiết</p>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <div
                                    className={cn(
                                      "w-10 h-10 rounded-full flex items-center justify-center",
                                      statusConfig[dayData.status].color
                                    )}
                                  >
                                    <span className={cn("font-bold", statusConfig[dayData.status].textColor)}>✓</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {dayData.status === 0 && (dayIndex === 5 || dayIndex === 6) && (
                              <div className="flex-1 flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">Nghỉ</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-center font-medium">
                  Tháng {selectedMonth}/{selectedYear}: <span className="text-success font-bold">18/20 buổi</span> - 
                  <span className="text-primary font-bold ml-2">Tỷ lệ chuyên cần 90%</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Absence Detail Dialog */}
      <Dialog open={!!selectedAbsence} onOpenChange={() => setSelectedAbsence(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAbsence?.status === 2 ? (
                <Badge className="bg-warning">Vắng có phép</Badge>
              ) : (
                <Badge variant="destructive">Vắng không phép</Badge>
              )}
              <span>Ngày {selectedAbsence?.day}/{selectedMonth}/{selectedYear}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Trạng thái</p>
              <p className="font-medium">
                {selectedAbsence?.status === 2 ? "Vắng có phép" : "Vắng không phép"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Lý do</p>
              <p className="font-medium">
                {selectedAbsence?.reason || "Không có lý do được ghi nhận"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default StudentAttendance;
