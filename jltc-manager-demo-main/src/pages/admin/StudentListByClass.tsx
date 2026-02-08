
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { classData } from "@/utils/mockData";
import { Users, School } from "lucide-react";

const StudentListByClass = () => {
    const classes = Object.values(classData);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Danh sách học viên theo lớp</h1>
                    <p className="text-muted-foreground">Quản lý học viên được phân chia theo từng lớp học</p>
                </div>

                <div className="grid gap-4">
                    {classes.map((cls) => (
                        <Card key={cls.id}>
                            <CardHeader className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <School className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{cls.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {cls.teacher} • {cls.room} • {cls.studentCount} học viên
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="ml-auto">
                                        {cls.level}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="students" className="border-none">
                                        <AccordionTrigger className="py-2 hover:no-underline px-4 bg-muted/50 rounded-lg">
                                            <span className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Xem danh sách học viên
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[80px]">Ảnh</TableHead>
                                                        <TableHead>Mã HV</TableHead>
                                                        <TableHead>Họ và tên</TableHead>
                                                        <TableHead>Trạng thái</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {cls.studentList.map((student) => (
                                                        <TableRow key={student.id}>
                                                            <TableCell>
                                                                <Avatar className="w-8 h-8">
                                                                    <AvatarImage src={student.avatar} />
                                                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                            </TableCell>
                                                            <TableCell className="font-medium">{student.id}</TableCell>
                                                            <TableCell>{student.name}</TableCell>
                                                            <TableCell>
                                                                <Badge className="bg-green-500">Đang học</Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default StudentListByClass;
