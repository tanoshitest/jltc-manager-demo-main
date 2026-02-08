
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, GraduationCap, Briefcase, School, UserCog, Clock } from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { classData } from "@/utils/mockData";

// Mock Data
const studentTypesData = [
    { name: "Kỹ sư", value: 15 },
    { name: "Tiếng Nhật", value: 45 },
    { name: "Du học sinh", value: 30 },
    { name: "Thực tập sinh", value: 60 },
    { name: "Xuất khẩu LĐ", value: 25 },
];

const studentStatusData = [
    { name: "Đang học", value: 120 },
    { name: "Đã chuyển phái cử", value: 25 },
    { name: "Đang phỏng vấn", value: 45 },
    { name: "Đậu phỏng vấn", value: 30 },
    { name: "Rớt phỏng vấn", value: 10 },
    { name: "Chờ xuất cảnh", value: 20 },
    { name: "Đã xuất cảnh", value: 85 },
];

const teacherData = [
    { name: "Cơ hữu", value: 8 },
    { name: "Thỉnh giảng", value: 12 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
const STATUS_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#a855f7", "#64748b"];


const teacherDetailedData = [
    { name: "Cơ hữu", teaching: 850, service: 300, count: 8 },
    { name: "Thỉnh giảng", teaching: 390, service: 150, count: 12 },
];

const StatisticsReport = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold tracking-tight">Dashboard Thống Kê</h2>
                <p className="text-sm text-muted-foreground">Tổng quan số liệu về học viên, giáo viên và lớp học.</p>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Student Types Pie Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Phân loại học viên</CardTitle>
                        <CardDescription>Tỷ lệ theo chương trình học</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={studentTypesData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {studentTypesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Student Status Pie/Bar Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Trạng thái học viên</CardTitle>
                        <CardDescription>Tiến độ đào tạo và phái cử</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={studentStatusData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                    {studentStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Teacher Statistics Grid */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Thống kê Giáo viên</CardTitle>
                        <CardDescription>Chi tiết giờ dạy và giờ dịch vụ theo loại hình giáo viên</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Chart */}
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={teacherDetailedData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Legend />
                                        <Bar dataKey="teaching" name="Giờ dạy" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="service" name="Giờ dịch vụ" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Detailed Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {teacherDetailedData.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-2 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-lg">{item.name}</span>
                                            <span className="text-xs bg-muted px-2 py-1 rounded-full">{item.count} GV</span>
                                        </div>
                                        <div className="space-y-1 mt-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                                                    Giờ dạy:
                                                </span>
                                                <span className="font-medium">{item.teaching}h</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                    Giờ dịch vụ:
                                                </span>
                                                <span className="font-medium">{item.service}h</span>
                                            </div>
                                            <div className="pt-2 mt-2 border-t flex justify-between text-sm font-bold">
                                                <span>Tổng:</span>
                                                <span>{item.teaching + item.service}h</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Classes Report */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Các lớp đang hoạt động</CardTitle>
                        <CardDescription>Danh sách các lớp học đang diễn ra tại trung tâm</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên lớp</TableHead>
                                        <TableHead>Giáo viên đảm nhiệm</TableHead>
                                        <TableHead className="text-center">Số học viên</TableHead>
                                        <TableHead>Ngày bắt đầu</TableHead>
                                        <TableHead>Ngày kết thúc</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.values(classData).map((cls) => {
                                        // Mock multiple teachers for demo purposes
                                        const extraTeacherNames = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E", "Yamamoto", "Kato"];
                                        // Deterministic pseudo-random based on class name length to select 1-4 extra teachers
                                        const seed = cls.name.length;
                                        const count = (seed % 4) + 1; // 1 to 4 extra teachers
                                        const team = [cls.teacher];
                                        for (let i = 0; i < count; i++) {
                                            team.push(extraTeacherNames[(seed + i) % extraTeacherNames.length]);
                                        }

                                        return (
                                            <TableRow key={cls.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{cls.name}</span>
                                                        <span className="text-xs text-muted-foreground">{cls.course}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {team.map((t, idx) => (
                                                            <Badge key={idx} variant="outline" className="font-normal bg-background">
                                                                {t}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary" className="px-3">
                                                        {cls.studentCount}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(cls.startDate).toLocaleDateString("vi-VN")}</TableCell>
                                                <TableCell>{new Date(cls.endDate).toLocaleDateString("vi-VN")}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StatisticsReport;
