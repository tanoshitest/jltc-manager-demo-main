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
    onDeleteTeacher?: (dayKey: string, id: string) => void;
}

const SESSIONS = [
    {
        name: "SÁNG",
        slots: [0, 1, 2], // Tiết 1, 2, 3
    },
    {
        name: "CHIỀU",
        slots: [3, 4, 5], // Tiết 4, 5, 6
    },
    {
        name: "TỐI",
        slots: [6, 7], // Tiết 7, 8
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

    // Helper to find class items for a specific day and slot and class name
    const findClassItems = (dayKey: keyof ScheduleData, slot: number, className: string) => {
        return schedule[dayKey]?.filter(
            (item) => item.slot === slot && item.class === className
        ) || [];
    };

    return (
        <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
            <table className="w-full border-collapse min-w-[1200px] text-sm">
                <thead>
                    <tr className="bg-white text-center font-bold border-b border-border">
                        {/* LỚP Header */}
                        <th className="border p-3 w-[120px] align-middle text-slate-700 uppercase tracking-wider" rowSpan={2}>LỚP</th>
                        {/* BUỔI Header */}
                        <th className="border p-3 w-[80px] align-middle text-slate-700 uppercase tracking-wider" rowSpan={2}>BUỔI</th>
                        {/* TIẾT Header */}
                        <th className="border p-3 w-[150px] align-middle text-slate-700 uppercase tracking-wider" rowSpan={2}>TIẾT</th>

                        {/* Days Headers - Row 1 */}
                        {days.map((day) => (
                            <th key={day.key} className="border p-2 bg-white min-w-[120px] text-slate-900 font-bold uppercase">
                                {day.label}
                            </th>
                        ))}
                    </tr>
                    <tr className="bg-white text-center font-medium border-b border-border">
                        {/* Days Headers - Row 2 (Dates) */}
                        {days.map((day) => (
                            <th key={day.key} className="border p-1 text-xs text-slate-500 font-normal">
                                {String(day.date).padStart(2, '0')}/{String(day.month).padStart(2, '0')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedClasses.map((className, classIndex) => (
                        <React.Fragment key={className}>
                            {SESSIONS.map((session, sessionIndex) => {
                                // Tính tổng số dòng cho buổi này: (Số tiết * 2 dòng [Off/On])
                                const sessionRows = (session.slots.length * 2);

                                // Tính tổng số dòng cho cả lớp này
                                const classRows = SESSIONS.reduce((acc, s) => acc + (s.slots.length * 2), 0);

                                return (
                                    <React.Fragment key={session.name}>
                                        {/* 1. HIỆN TẠI ĐÃ XÓA DÒNG PHÒNG THEO YÊU CẦU */}

                                        {/* 2. CÁC DÒNG TIẾT (Chia làm 2 dòng: Offline và Online) */}
                                        {session.slots.map((slotIndex, slotIdxInSession) => {
                                            return (
                                                <React.Fragment key={`${className}-${slotIndex}`}>
                                                    {/* Dòng OFFLINE */}
                                                    <tr className="hover:bg-slate-50/30 transition-colors">
                                                        {/* Render tên lớp - chỉ hiển thị ở dòng đầu tiên của lớp */}
                                                        {sessionIndex === 0 && slotIdxInSession === 0 && (
                                                            <td
                                                                className="border p-4 align-middle text-center font-bold text-2xl bg-white text-blue-500"
                                                                rowSpan={classRows}
                                                            >
                                                                {className}
                                                            </td>
                                                        )}

                                                        {/* Render tên buổi - chỉ hiển thị ở dòng đầu tiên của Session */}
                                                        {slotIdxInSession === 0 && (
                                                            <td
                                                                className="border p-2 align-middle text-center font-bold bg-white text-slate-600 text-xs"
                                                                rowSpan={sessionRows}
                                                            >
                                                                {session.name}
                                                            </td>
                                                        )}

                                                        <td rowSpan={2} className="border p-2 font-medium bg-white text-center text-slate-500 text-xs min-w-[80px]">
                                                            Tiết {slotIndex + 1}
                                                        </td>
                                                        {days.map((day) => {
                                                            const allItems = findClassItems(day.key as keyof ScheduleData, slotIndex, className);
                                                            const offItems = allItems.filter(i => i.learningMode !== "online");
                                                            return (
                                                                <td
                                                                    key={`${day.key}-${slotIndex}-off`}
                                                                    className="border p-1 relative text-center min-w-[140px] align-top px-2"
                                                                >
                                                                    <div className="flex flex-row flex-wrap gap-1.5 justify-center items-center w-full min-h-[36px] py-1">
                                                                        {offItems.map((classItem) => (
                                                                            <div
                                                                                key={classItem.id}
                                                                                className="p-1 px-2 rounded flex flex-row items-center justify-center gap-1.5 relative cursor-pointer group/item bg-blue-50/80 text-blue-700 border border-blue-200/60 hover:bg-blue-100 shadow-sm w-[110px]"
                                                                                onClick={() => onCellClick(day.key, slotIndex, className, classItem)}
                                                                            >
                                                                                <span className="font-semibold text-[11px] leading-tight truncate max-w-[65px]" title={classItem.teacher}>{classItem.teacher}</span>
                                                                                <span className="text-[8px] px-1 rounded-sm font-bold uppercase bg-blue-600 text-white min-w-[24px]">Off</span>
                                                                                {onDeleteTeacher && (
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); onDeleteTeacher(day.key, classItem.id); }}
                                                                                        className="absolute -top-1 -right-1 opacity-0 group-hover/item:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm z-10"
                                                                                    >
                                                                                        <X className="w-2 h-2" />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                        {offItems.length === 0 && allItems.length === 0 && (
                                                                            <button
                                                                                className="w-full h-8 flex items-center justify-center text-slate-200 hover:text-slate-400 transition-colors rounded hover:bg-slate-50"
                                                                                onClick={() => onCellClick(day.key, slotIndex, className)}
                                                                            >
                                                                                +
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>

                                                    {/* Dòng ONLINE */}
                                                    <tr className="hover:bg-slate-50/30 transition-colors bg-slate-50/20">
                                                        {days.map((day) => {
                                                            const allItems = findClassItems(day.key as keyof ScheduleData, slotIndex, className);
                                                            const onItems = allItems.filter(i => i.learningMode === "online");
                                                            return (
                                                                <td
                                                                    key={`${day.key}-${slotIndex}-on`}
                                                                    className="border p-1 relative text-center min-w-[140px] align-top px-2"
                                                                >
                                                                    <div className="flex flex-row flex-wrap gap-1.5 justify-center items-center w-full min-h-[36px] py-1">
                                                                        {onItems.map((classItem) => (
                                                                            <div
                                                                                key={classItem.id}
                                                                                className="p-1 px-2 rounded flex flex-row items-center justify-center gap-1.5 relative cursor-pointer group/item bg-emerald-50/80 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 shadow-sm w-[110px]"
                                                                                onClick={() => onCellClick(day.key, slotIndex, className, classItem)}
                                                                            >
                                                                                <span className="font-semibold text-[11px] leading-tight truncate max-w-[65px]" title={classItem.teacher}>{classItem.teacher}</span>
                                                                                <span className="text-[8px] px-1 rounded-sm font-bold uppercase bg-emerald-600 text-white min-w-[24px]">On</span>
                                                                                {onDeleteTeacher && (
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); onDeleteTeacher(day.key, classItem.id); }}
                                                                                        className="absolute -top-1 -right-1 opacity-0 group-hover/item:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm z-10"
                                                                                    >
                                                                                        <X className="w-2 h-2" />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                        {onItems.length === 0 && allItems.length > 0 && allItems.every(i => i.learningMode !== "online") && (
                                                                            <button
                                                                                className="w-full h-8 flex items-center justify-center opacity-0 hover:opacity-100 text-slate-200 hover:text-slate-400 transition-opacity rounded"
                                                                                onClick={() => onCellClick(day.key, slotIndex, className)}
                                                                            >
                                                                                + On
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                </React.Fragment>
                                            );
                                        })}
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
        </div >
    );
};

export default ExcelScheduleTable;
