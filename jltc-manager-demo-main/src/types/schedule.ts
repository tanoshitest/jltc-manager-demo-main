export interface ClassItem {
    id: string;
    slot: number;
    class: string;
    teacher: string;
    room: string;
    students: number;
    classLevel?: string;
    day?: string;      // Added optional props used in Schedule.tsx state
    timeSlot?: string; // Added optional props used in Schedule.tsx state
    notes?: string;
    lessonContent?: string;
    learningMode?: "online" | "offline";
}

export interface ScheduleData {
    monday: ClassItem[];
    tuesday: ClassItem[];
    wednesday: ClassItem[];
    thursday: ClassItem[];
    friday: ClassItem[];
    saturday: ClassItem[];
    sunday: ClassItem[];
}

export interface DayInfo {
    key: string;
    label: string;
    date: number;
    month: number;
}

