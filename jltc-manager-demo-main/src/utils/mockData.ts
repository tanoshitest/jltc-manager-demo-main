export interface ClassInfo {
    id: string;
    name: string;
    level: string;
    room: string;
    course: string;
    teacher: string;
    studentCount: number;
    startDate: string;
    endDate: string;
    schedule: string;
    progress: string;
    studentList: Array<{ id: string; name: string; avatar: string }>;
}

export interface AttendanceRecord {
    status: "present" | "absent_excused" | "absent_unexcused";
    reason?: string;
}

export const classData: Record<string, ClassInfo> = {
    "N5-01": {
        id: "N5-01",
        name: "Lớp N5-01",
        level: "N5",
        room: "201",
        course: "K46",
        teacher: "Yamada",
        studentCount: 15,
        startDate: "2024-01-15",
        endDate: "2024-06-15",
        schedule: "T2, T4, T6 - Tiết 1",
        progress: "Bài 15/25",
        studentList: [
            { id: "HV001", name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?img=1" },
            { id: "HV002", name: "Trần Thị B", avatar: "https://i.pravatar.cc/150?img=2" },
            { id: "HV003", name: "Lê Văn C", avatar: "https://i.pravatar.cc/150?img=3" },
            { id: "HV004", name: "Phạm Thị D", avatar: "https://i.pravatar.cc/150?img=4" },
            { id: "HV005", name: "Hoàng Văn E", avatar: "https://i.pravatar.cc/150?img=5" },
        ]
    },
    "N5-02": {
        id: "N5-02",
        name: "Lớp N5-02",
        level: "N5",
        room: "202",
        course: "K46",
        teacher: "Sato",
        studentCount: 16,
        startDate: "2024-01-15",
        endDate: "2024-06-15",
        schedule: "T2, T4, T6 - Tiết 2",
        progress: "Bài 12/25",
        studentList: [
            { id: "HV006", name: "Đặng Văn F", avatar: "https://i.pravatar.cc/150?img=6" },
            { id: "HV007", name: "Vũ Thị G", avatar: "https://i.pravatar.cc/150?img=7" },
            { id: "HV008", name: "Bùi Văn H", avatar: "https://i.pravatar.cc/150?img=8" },
        ]
    },
    "N4-01": {
        id: "N4-01",
        name: "Lớp N4-01",
        level: "N4",
        room: "203",
        course: "K45",
        teacher: "Watanabe",
        studentCount: 14,
        startDate: "2024-02-01",
        endDate: "2024-07-01",
        schedule: "T3, T5 - Tiết 4",
        progress: "Bài 20/30",
        studentList: [
            { id: "HV009", name: "Ngô Văn I", avatar: "https://i.pravatar.cc/150?img=9" },
            { id: "HV010", name: "Dương Thị K", avatar: "https://i.pravatar.cc/150?img=10" },
        ]
    },
    "N4-02": {
        id: "N4-02",
        name: "Lớp N4-02",
        level: "N4",
        room: "204",
        course: "K45",
        teacher: "Tanaka",
        studentCount: 18,
        startDate: "2024-01-20",
        endDate: "2024-06-20",
        schedule: "T2, T4 - Tiết 3",
        progress: "Bài 18/30",
        studentList: [
            { id: "HV011", name: "Trương Văn K", avatar: "https://i.pravatar.cc/150?img=11" },
            { id: "HV012", name: "Mai Thị L", avatar: "https://i.pravatar.cc/150?img=12" },
        ]
    },
    "N3-01": {
        id: "N3-01",
        name: "Lớp N3-01",
        level: "N3",
        room: "301",
        course: "K44",
        teacher: "Suzuki",
        studentCount: 12,
        startDate: "2024-01-10",
        endDate: "2024-06-10",
        schedule: "T2, T4, T6 - Tiết 6",
        progress: "Bài 18/35",
        studentList: [
            { id: "HV013", name: "Lý Văn M", avatar: "https://i.pravatar.cc/150?img=13" },
            { id: "HV014", name: "Hồ Thị N", avatar: "https://i.pravatar.cc/150?img=14" },
        ]
    },
    "N3-02": {
        id: "N3-02",
        name: "Lớp N3-02",
        level: "N3",
        room: "302",
        course: "K44",
        teacher: "Nakamura",
        studentCount: 13,
        startDate: "2024-02-15",
        endDate: "2024-07-15",
        schedule: "T3, T5 - Tiết 5",
        progress: "Bài 15/35",
        studentList: [
            { id: "HV015", name: "Cao Văn O", avatar: "https://i.pravatar.cc/150?img=15" },
            { id: "HV016", name: "Đinh Thị P", avatar: "https://i.pravatar.cc/150?img=16" },
        ]
    },
    "N2-01": {
        id: "N2-01",
        name: "Lớp N2-01",
        level: "N2",
        room: "401",
        course: "K43",
        teacher: "Ito",
        studentCount: 10,
        startDate: "2024-03-01",
        endDate: "2024-08-01",
        schedule: "T5 - Tiết 6",
        progress: "Bài 10/40",
        studentList: [
            { id: "HV017", name: "Phan Văn Q", avatar: "https://i.pravatar.cc/150?img=17" },
            { id: "HV018", name: "Võ Thị R", avatar: "https://i.pravatar.cc/150?img=18" },
        ]
    },
    "N5-03": {
        id: "N5-03",
        name: "Lớp N5-03",
        level: "N5",
        room: "205",
        course: "K47",
        teacher: "Kobayashi",
        studentCount: 14,
        startDate: "2024-04-01",
        endDate: "2024-09-01",
        schedule: "T7 - Tiết 1,2",
        progress: "Bài 0/25",
        studentList: [
            { id: "HV019", name: "Lương Văn S", avatar: "https://i.pravatar.cc/150?img=19" },
            { id: "HV020", name: "Tạ Thị T", avatar: "https://i.pravatar.cc/150?img=20" },
        ]
    },
    "N4-03": {
        id: "N4-03",
        name: "Lớp N4-03",
        level: "N4",
        room: "206",
        course: "K43",
        teacher: "Sasaki",
        studentCount: 15,
        startDate: "2023-06-01",
        endDate: "2023-12-01",
        schedule: "CN - Tiết 3,4",
        progress: "Bài 30/30",
        studentList: [
            { id: "HV021", name: "Đỗ Văn U", avatar: "https://i.pravatar.cc/150?img=21" },
            { id: "HV022", name: "Ngô Thị V", avatar: "https://i.pravatar.cc/150?img=22" },
        ]
    }
};

export const generateCourseDates = (startDate: string, endDate: string) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);

    while (current <= end) {
        const day = current.getDay();
        if (day === 1 || day === 3 || day === 5) { // Mon, Wed, Fri for simplicity
            dates.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
    }
    return dates.slice(0, 36); // Limit for view
};

export const generateAttendanceData = (classInfo: ClassInfo): Record<string, Record<string, AttendanceRecord>> => {
    const dates = generateCourseDates(classInfo.startDate, classInfo.endDate);
    const data: Record<string, Record<string, AttendanceRecord>> = {};

    classInfo.studentList.forEach(student => {
        data[student.id] = {};
        dates.forEach((date, idx) => {
            const seed = student.id.charCodeAt(student.id.length - 1) + idx;
            let status: AttendanceRecord["status"] = "present";
            let reason: string | undefined;

            if (seed % 10 === 0) {
                status = "absent_unexcused";
            } else if (seed % 8 === 0) {
                status = "absent_excused";
                reason = "Bệnh";
            }

            data[student.id][date.toISOString()] = { status, reason };
        });
    });
    return data;
};
