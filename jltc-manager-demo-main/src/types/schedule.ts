export interface ClassItem {
    slot: number;
    class: string;
    teacher: string;
    room: string;
    students: number;
    classLevel?: string;
    day?: string;      // Added optional props used in Schedule.tsx state
    timeSlot?: string; // Added optional props used in Schedule.tsx state
    lessonContent?: string;
    notes?: string;
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

