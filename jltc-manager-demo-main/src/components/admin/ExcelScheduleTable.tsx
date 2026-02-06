import React from "react";
import { ScheduleData, ClassItem, DayInfo } from "@/types/schedule";
import { cn } from "@/lib/utils";

interface ExcelScheduleTableProps {
    schedule: ScheduleData;
    timeSlots: string[];
    days: DayInfo[];
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

const ExcelScheduleTable: React.FC<ExcelScheduleTableProps> = ({ schedule, timeSlots, days }) => {
    // 1. Get unique classes
    const allClasses = new Set<string>();
    Object.values(schedule).forEach((dayItems) => {
        dayItems.forEach((item) => {
            if (item.class) allClasses.add(item.class);
        });
    });

    // Sort classes (maybe custom sort needed later, for now alphabetical)
    const sortedClasses = Array.from(allClasses).sort();

    // Helper to find class item for a specific day and slot and class name
    const findClassItem = (dayKey: keyof ScheduleData, slot: number, className: string) => {
        return schedule[dayKey]?.find(
            (item) => item.slot === slot && item.class === className
        );
    };

    return (
        <div className="overflow-x-auto border rounded-md shadow-sm">
            <table className="w-full border-collapse min-w-[1000px] text-sm">
                <thead>
                    <tr className="bg-[#FFEB9C] text-center font-bold text-black border-b-2 border-black/20">
                        <th className="border p-2 w-[80px] align-middle" rowSpan={2}>BUỔI</th>
                        <th className="border p-2 w-[150px] align-middle" rowSpan={2}>TIẾT</th>
                        {days.map((day) => (
                            <th key={day.key} className="border p-1 bg-[#FFEB9C] min-w-[120px]">
                                {day.label}
                            </th>
                        ))}
                    </tr>
                    <tr className="bg-[#FFEB9C] text-center font-bold text-black border-b-2 border-black/20">
                        {days.map((day) => (
                            <th key={day.key} className="border p-1 bg-[#FFEB9C] text-xs">
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

                                return (
                                    <React.Fragment key={session.name}>
                                        {/* 1. ROOM ROW */}
                                        <tr key={`${className}-${session.name}-room`}>
                                            {/* Render Class Name Cell only once per Class block */}
                                            {sessionIndex === 0 && (
                                                <td
                                                    className="border p-4 align-middle text-center font-bold text-xl bg-[#FFC000] text-black"
                                                    rowSpan={SESSIONS.reduce((acc, s) => acc + s.slots.length + 1, 0)}
                                                >
                                                    {className}
                                                </td>
                                            )}

                                            {/* Render Session Name Cell only once per Session block */}
                                            <td
                                                className="border p-2 align-middle text-center font-bold bg-[#FFF2CC]"
                                                rowSpan={sessionRows}
                                            >
                                                {session.name}
                                            </td>

                                            {/* Room Row Title */}
                                            {/* Since the image doesn't show a "Room" title column, we can merge or leave it blank.
                                               The image shows the Date headers are aligned. 
                                               Let's use a subtle label or background for this row in the Period column.
                                            */}
                                            <td className="border p-2 font-bold bg-white text-center text-xs text-muted-foreground">
                                                PHÒNG
                                            </td>

                                            {/* Room Cells for each Day */}
                                            {days.map((day) => {
                                                // Find the room for this session on this day.
                                                // We look at the first slot of the session.
                                                // If multiple rooms exist in the same session, we might just pick the first one found or list unique.
                                                // For "Teacher Schedule", typically one room per session.
                                                const firstSlot = session.slots[0];
                                                const classItem = findClassItem(day.key as keyof ScheduleData, firstSlot, className);

                                                // Also check other slots in this session if the first one is empty? 
                                                // Let's iterate all slots in session to find the first non-null room.
                                                let room = "";
                                                for (const slot of session.slots) {
                                                    const item = findClassItem(day.key as keyof ScheduleData, slot, className);
                                                    if (item && item.room) {
                                                        room = item.room;
                                                        break;
                                                    }
                                                }

                                                return (
                                                    <td key={`${day.key}-room`} className="border p-1 text-center font-bold bg-white">
                                                        {room}
                                                    </td>
                                                );
                                            })}
                                        </tr>

                                        {/* 2. PERIOD ROWS */}
                                        {session.slots.map((slotIndex, slotIdxInSession) => (
                                            <tr key={`${className}-${slotIndex}`} className="hover:bg-slate-50 transition-colors">
                                                {/* Period Cell */}
                                                <td className="border p-2 font-medium bg-white">
                                                    Tiết {slotIndex + 1} <span className="text-xs text-muted-foreground block font-normal">({timeSlots[slotIndex]})</span>
                                                </td>

                                                {/* Day Cells (Teachers) */}
                                                {days.map((day) => {
                                                    const classItem = findClassItem(day.key as keyof ScheduleData, slotIndex, className);
                                                    return (
                                                        <td key={`${day.key}-${slotIndex}`} className="border p-1 relative text-center">
                                                            {classItem ? (
                                                                <div className={cn(
                                                                    "p-2 h-full w-full rounded flex flex-col items-center justify-center gap-1",
                                                                    // Colors based on teacher could be added here
                                                                    "bg-orange-100/50 text-orange-900" // Simple color for now
                                                                )}>
                                                                    <span className="font-bold">{classItem.teacher}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="h-full w-full bg-white"></div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                            {/* Separator row between classes */}
                            <tr className="h-2 bg-gray-100 border-t-2 border-black/20">
                                <td colSpan={3 + days.length} className="border-0"></td>
                            </tr>
                        </React.Fragment>
                    ))}

                    {sortedClasses.length === 0 && (
                        <tr>
                            <td colSpan={2 + days.length} className="p-8 text-center text-muted-foreground">
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
