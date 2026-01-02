import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import TeacherLayout from "@/components/TeacherLayout";

const TeacherSchedule = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [selectedMonth, setSelectedMonth] = useState("11");

  const getWeekDateRange = (week: string, month: string) => {
    const year = 2024;
    const monthNum = parseInt(month);
    const weekNum = parseInt(week);
    
    const firstDay = new Date(year, monthNum - 1, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(1 + (weekNum - 1) * 7);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4);
    
    return {
      start: startDate.getDate(),
      end: endDate.getDate(),
      startDate,
      endDate
    };
  };

  const dateRange = getWeekDateRange(selectedWeek, selectedMonth);

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Lịch dạy tuần này
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tuần:</span>
                  <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                    <SelectTrigger className="w-[120px]">
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
                <div className="text-sm text-muted-foreground">
                  {dateRange.start}/{selectedMonth} - {dateRange.end}/{selectedMonth}/2024
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <div className="font-medium text-sm text-muted-foreground p-2">Ca học</div>
                  {[
                    { label: "Thứ 2", date: dateRange.startDate.getDate() },
                    { label: "Thứ 3", date: dateRange.startDate.getDate() + 1 },
                    { label: "Thứ 4", date: dateRange.startDate.getDate() + 2 },
                    { label: "Thứ 5", date: dateRange.startDate.getDate() + 3 },
                    { label: "Thứ 6", date: dateRange.startDate.getDate() + 4 },
                  ].map((day, idx) => (
                    <div key={idx} className="font-medium text-center p-2 bg-muted rounded-lg">
                      <div>{day.label}</div>
                      <div className="text-xs text-muted-foreground">{day.date}/{selectedMonth}</div>
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                {[
                  {
                    time: "08:00-10:00",
                    type: "morning",
                    schedule: [
                      { class: "N5-01", room: "201", students: 15 },
                      null,
                      { class: "N5-01", room: "201", students: 15 },
                      null,
                      { class: "N5-01", room: "201", students: 15 },
                    ],
                  },
                  {
                    time: "10:30-12:30",
                    type: "morning",
                    schedule: [
                      null,
                      { class: "N4-02", room: "202", students: 18 },
                      null,
                      { class: "N4-02", room: "202", students: 18 },
                      null,
                    ],
                  },
                  {
                    time: "14:00-16:00",
                    type: "afternoon",
                    schedule: [
                      null,
                      null,
                      { class: "N3-01", room: "203", students: 12 },
                      null,
                      { class: "N3-01", room: "203", students: 12 },
                    ],
                  },
                ].map((slot, slotIndex) => (
                  <div key={slotIndex} className="grid grid-cols-6 gap-2 mb-2">
                    <div
                      className={cn(
                        "p-3 rounded-lg text-sm font-medium flex items-center justify-center",
                        slot.type === "morning"
                          ? "bg-primary/10 text-primary"
                          : slot.type === "afternoon"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {slot.time}
                    </div>
                    {slot.schedule.map((classData, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all min-h-[80px]",
                          classData
                            ? "bg-primary/5 border-primary hover:bg-primary/10 cursor-pointer"
                            : "border-border border-dashed"
                        )}
                      >
                        {classData && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-primary text-xs">{classData.class}</Badge>
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {classData.room}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {classData.students} HV
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
};

export default TeacherSchedule;
