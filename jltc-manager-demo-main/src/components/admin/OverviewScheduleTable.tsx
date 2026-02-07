import React from "react";
import { ScheduleData, DayInfo } from "@/types/schedule";
import { cn } from "@/lib/utils";

interface OverviewScheduleTableProps {
    schedule: ScheduleData;
    timeSlots: string[];
    days: DayInfo[];
    onClassClick?: (dayKey: string, slotIndex: number, className: string) => void;
}

const SESSIONS = [
    {
        name: "SÁNG",
        slots: [0, 1, 2], // 08:00, 09:00, 10:30
    },
    {
        name: "CHIỀU",
        slots: [3, 4, 5], // 13:00, 14:15, 15:30
    },
    {
        name: "TỐI",
        slots: [6, 7, 8], // 18:00, 19:15, 20:30
    },
];

const OverviewScheduleTable: React.FC<OverviewScheduleTableProps> = ({ schedule, timeSlots, days, onClassClick }) => {

    // Helper to get all classes scheduled at a specific slot across all days
    const getClassesForSlot = (slotIndex: number) => {
        const classes = new Set<string>();
        Object.values(schedule).forEach((daySchedule) => {
            daySchedule.forEach((item) => {
                if (item.slot === slotIndex && item.class) {
                    classes.add(item.class);
                }
            });
        });
        return Array.from(classes).sort(); // Sort alphabetically
    };

    // Helper to find teacher for a specific day, slot, and class
    const getTeacherForCell = (dayKey: keyof ScheduleData, slotIndex: number, className: string) => {
        const item = schedule[dayKey]?.find(
            (c) => c.slot === slotIndex && c.class === className
        );
        return item ? item.teacher : null;
    };

    return (
        <div className="overflow-x-auto border rounded-md shadow-sm">
            <table className="w-full border-collapse min-w-[1200px] text-sm">
                <thead>
                    <tr className="bg-amber-400 text-center font-bold text-foreground border-b border-border">
                        {/* BUỔI Header */}
                        <th className="border p-2 w-[80px] align-middle bg-amber-400 text-foreground">BUỔI</th>
                        {/* TIẾT Header */}
                        <th className="border p-2 w-[150px] align-middle bg-amber-400 text-foreground">TIẾT</th>
                        {/* LỚP Header */}
                        <th className="border p-2 w-[120px] align-middle bg-amber-400 text-foreground">LỚP</th>

                        {/* Days Headers - Row 1 */}
                        {days.map((day) => (
                            <th key={day.key} className="border p-1 bg-amber-200 min-w-[120px] text-foreground">
                                {day.label}
                            </th>
                        ))}
                    </tr>
                    <tr className="bg-muted/50 text-center font-bold text-muted-foreground border-b-2 border-border">
                        {/* Empty cells for Buổi, Tiết, Lớp */}
                        <th className="border p-1 bg-white"></th>
                        <th className="border p-1 bg-white"></th>
                        <th className="border p-1 bg-white"></th>

                        {/* Days Headers - Row 2 (Dates) */}
                        {days.map((day) => (
                            <th key={day.key} className="border p-1 bg-white text-xs text-muted-foreground font-bold">
                                {String(day.date).padStart(2, '0')}/{String(day.month).padStart(2, '0')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {SESSIONS.map((session, sessionIndex) => {
                        // Calculate total rows for this session
                        // This is tricky because each slot can have multiple rows (1 per class)
                        // Or 0 rows if no classes. The user wants to see "Tiết 1" even if empty? 
                        // Let's assume we show at least 1 row per slot if empty, or skip empty slots?
                        // For simplicity and "Overview" nature, let's show all slots defined in timeSlots?
                        // Actually, let's filter slots that have classes to avoid huge empty table?
                        // Or maybe just iterate all slots in session.

                        const slotData = session.slots.map(slotIndex => {
                            const classes = getClassesForSlot(slotIndex);
                            return { slotIndex, classes };
                        });

                        // Calculate total rows for the session block
                        const totalSessionRows = slotData.reduce((acc, data) => acc + Math.max(data.classes.length, 1), 0);

                        // If session has no slots with classes, do we hide it? No, show empty structure.

                        return (
                            <React.Fragment key={session.name}>
                                {slotData.map((data, idxInSession) => {
                                    const { slotIndex, classes } = data;
                                    const rowSpan = Math.max(classes.length, 1);

                                    // Iterate through classes for this slot
                                    // If no classes, render a single empty row
                                    const classesToRender = classes.length > 0 ? classes : [""];

                                    return classesToRender.map((className, classIdx) => {
                                        const isFirstRowOfSession = idxInSession === 0 && classIdx === 0;
                                        const isFirstRowOfSlot = classIdx === 0;

                                        return (
                                            <tr key={`${session.name}-${slotIndex}-${classIdx}`} className="hover:bg-slate-50 transition-colors">
                                                {/* BUỔI Column - Rendered only once per Session */}
                                                {isFirstRowOfSession && (
                                                    <td
                                                        className="border p-2 align-middle text-center font-bold bg-white text-foreground"
                                                        rowSpan={totalSessionRows}
                                                    >
                                                        {session.name}
                                                    </td>
                                                )}

                                                {/* TIẾT Column - Rendered only once per Slot */}
                                                {isFirstRowOfSlot && (
                                                    <td
                                                        className="border p-2 align-middle text-left font-medium bg-white"
                                                        rowSpan={rowSpan}
                                                    >
                                                        <div>Tiết {slotIndex + 1}</div>
                                                        <div className="text-xs text-muted-foreground font-normal">({timeSlots[slotIndex]})</div>
                                                    </td>
                                                )}

                                                {/* LỚP Column */}
                                                <td className={cn(
                                                    "border p-2 align-middle text-center font-medium",
                                                    // Simple coloring logic based on class name or just alternating
                                                    className ? "bg-red-100 text-red-800" : "bg-transparent" // Example style from image
                                                    // We can make this dynamic later
                                                )}>
                                                    {className || "-"}
                                                </td>

                                                {/* DAYS Columns */}
                                                {days.map((day) => {
                                                    const teacher = className ? getTeacherForCell(day.key as keyof ScheduleData, slotIndex, className) : null;
                                                    return (
                                                        <td
                                                            key={day.key}
                                                            className="border p-2 text-center text-sm"
                                                            onClick={() => className && onClassClick && onClassClick(day.key, slotIndex, className)}
                                                        >
                                                            {teacher || ""}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    });
                                })}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default OverviewScheduleTable;
