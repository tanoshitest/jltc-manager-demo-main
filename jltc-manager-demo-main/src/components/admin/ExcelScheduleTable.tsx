import React from "react";
import { ScheduleData, DayInfo, ClassItem } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ExcelScheduleTableProps {
    schedule: ScheduleData;
    timeSlots: string[];
    days: DayInfo[];
    onCellClick: (dayKey: string, slotIndex: number, className: string, existingClass?: ClassItem) => void;
    onRoomClick: (dayKey: string, className: string, currentRoom: string, sessionStart: number, sessionEnd: number) => void;
    onDeleteTeacher?: (dayKey: string, slotIndex: number, className: string) => void;
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
    // Hide Evening session if not needed, but keep for completeness if data exists
    {
        name: "TỐI",
        slots: [6, 7, 8], // 18:00, 19:15, 20:30
    },
];

const ExcelScheduleTable: React.FC<ExcelScheduleTableProps> = ({ schedule, timeSlots, days, onCellClick, onRoomClick, onDeleteTeacher }) => {
    // 1. Get unique classes
    const allClasses = new Set<string>();
    Object.values(schedule).forEach((dayItems) => {
        dayItems.forEach((item) => {
            if (item.class) allClasses.add(item.class);
        });
    });

    // Sort classes
    const sortedClasses = Array.from(allClasses).sort();

    // Helper to find class item for a specific day and slot and class name
    const findClassItem = (dayKey: keyof ScheduleData, slot: number, className: string) => {
        return schedule[dayKey]?.find(
            (item) => item.slot === slot && item.class === className
        );
    };

    return (
        <div className="overflow-x-auto border rounded-md shadow-sm">
            <table className="w-full border-collapse min-w-[1200px] text-sm">
                <thead>
                    <tr className="bg-muted/50 text-center font-bold text-muted-foreground border-b border-border">
                        {/* LỚP Header - Spanning 2 rows */}
                        <th className="border p-2 w-[120px] align-middle bg-muted/80 text-foreground" rowSpan={2}>LỚP</th>
                        {/* BUỔI Header - Spanning 2 rows */}
                        <th className="border p-2 w-[80px] align-middle bg-muted/80 text-foreground" rowSpan={2}>BUỔI</th>
                        {/* TIẾT Header - Spanning 2 rows */}
                        <th className="border p-2 w-[150px] align-middle bg-muted/80 text-foreground" rowSpan={2}>TIẾT</th>

                        {/* Days Headers - Row 1 */}
                        {days.map((day) => (
                            <th key={day.key} className="border p-1 bg-muted/50 min-w-[120px] text-foreground">
                                {day.label}
                            </th>
                        ))}
                    </tr>
                    <tr className="bg-muted/50 text-center font-bold text-muted-foreground border-b-2 border-border">
                        {/* Days Headers - Row 2 (Dates) */}
                        {days.map((day) => (
                            <th key={day.key} className="border p-1 bg-muted/30 text-xs text-muted-foreground">
                                {String(day.date).padStart(2, '0')}/{String(day.month).padStart(2, '0')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedClasses.map((className, classIndex) => (
                        <React.Fragment key={className}>
                            {/* For each class, iterate sessions */}
                            {SESSIONS.map((session, sessionIndex) => {
                                // Calculate total rows for this session: room row (1) + period rows
                                const sessionRows = 1 + session.slots.length;

                                // Calculate total rows for class: sum of all session rows
                                const classRows = SESSIONS.reduce((acc, s) => acc + s.slots.length + 1, 0);

                                return (
                                    <React.Fragment key={session.name}>
                                        {/* 1. ROOM ROW (Start of Session Block) */}
                                        <tr key={`${className}-${session.name}-room`}>
                                            {/* Render Class Name Cell only once per Class block (at the very first session) */}
                                            {sessionIndex === 0 && (
                                                <td
                                                    className="border p-4 align-middle text-center font-bold text-xl bg-card text-primary"
                                                    rowSpan={classRows}
                                                >
                                                    {className}
                                                </td>
                                            )}

                                            {/* Render Session Name Cell only once per Session block */}
                                            <td
                                                className="border p-2 align-middle text-center font-bold bg-muted/20 text-muted-foreground"
                                                rowSpan={sessionRows}
                                            >
                                                {session.name}
                                            </td>

                                            {/* Room Row Title in TIẾT Column */}
                                            <td className="border p-2 font-bold bg-muted/10 text-center text-xs text-muted-foreground">
                                                PHÒNG
                                            </td>

                                            {/* Room Cells for each Day */}
                                            {days.map((day) => {
                                                // Logic to find room: check first slot of session
                                                let room = "";
                                                for (const slot of session.slots) {
                                                    const item = findClassItem(day.key as keyof ScheduleData, slot, className);
                                                    if (item && item.room) {
                                                        room = item.room;
                                                        break;
                                                    }
                                                }

                                                const sessionStart = session.slots[0];
                                                const sessionEnd = session.slots[session.slots.length - 1];

                                                return (
                                                    <td
                                                        key={`${day.key}-room`}
                                                        className="border p-1 text-center font-bold bg-muted/5 text-sm cursor-pointer hover:bg-muted/20 transition-colors"
                                                        onClick={() => onRoomClick(day.key, className, room, sessionStart, sessionEnd)}
                                                    >
                                                        {room || <span className="text-muted-foreground/30 text-xs">+ Phòng</span>}
                                                    </td>
                                                );
                                            })}
                                        </tr>

                                        {/* 2. PERIOD ROWS */}
                                        {session.slots.map((slotIndex, slotIdxInSession) => (
                                            <tr key={`${className}-${slotIndex}`} className="hover:bg-slate-50 transition-colors">
                                                {/* Period Cell */}
                                                <td className="border p-2 font-medium bg-white text-center">
                                                    <div>Tiết {slotIndex + 1}</div>

                                                </td>

                                                {/* Day Cells (Teachers) */}
                                                {days.map((day) => {
                                                    const classItem = findClassItem(day.key as keyof ScheduleData, slotIndex, className);
                                                    return (
                                                        <td
                                                            key={`${day.key}-${slotIndex}`}
                                                            className={cn(
                                                                "border p-1 relative text-center group transition-colors",
                                                                classItem && "cursor-pointer hover:bg-muted/50",
                                                                !classItem && "hover:bg-muted/30"
                                                            )}
                                                        >
                                                            {classItem ? (
                                                                <div
                                                                    className={cn(
                                                                        "p-1 h-full w-full rounded flex flex-col items-center justify-center gap-0.5 relative",
                                                                        "bg-primary/5 text-primary"
                                                                    )}
                                                                    onClick={() => onCellClick(day.key, slotIndex, className, classItem)}
                                                                >
                                                                    <span className="font-bold text-sm">{classItem.teacher}</span>
                                                                    {/* Delete button */}
                                                                    {onDeleteTeacher && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onDeleteTeacher(day.key, slotIndex, className);
                                                                            }}
                                                                            className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/90"
                                                                            title="Xóa giáo viên"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="h-full w-full bg-transparent min-h-[30px] flex items-center justify-center text-xs text-muted-foreground/30 hover:text-muted-foreground cursor-pointer"
                                                                    onClick={() => onCellClick(day.key, slotIndex, className, classItem)}
                                                                >
                                                                    +
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                );
                            })}

                            {/* Separator row between classes (optional, already handled by borders) */}
                            <tr className="h-2 bg-muted/10 border-t-2 border-border">
                                <td colSpan={3 + days.length} className="border-0 p-0"></td>
                            </tr>
                        </React.Fragment>
                    ))}

                    {sortedClasses.length === 0 && (
                        <tr>
                            <td colSpan={3 + days.length} className="p-8 text-center text-muted-foreground">
                                Không có dữ liệu lớp học nào được tìm thấy trong lịch.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExcelScheduleTable;
