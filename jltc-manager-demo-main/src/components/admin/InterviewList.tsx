
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, MapPin, Clock, Edit, CheckSquare, AlertCircle } from "lucide-react";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { classData } from "@/utils/mockData";

interface Interview {
    id: string;
    studentName: string;
    jobOrder: string;
    class: string;
    practiceDate: string; // Ngày Tập Trung Luyện PV
    practiceDuration: string; // Thời gian luyện
    interviewDate: string; // Ngày Phỏng Vấn
    interviewTime: string; // Thời gian phỏng vấn
    address: string; // Địa Chỉ Phỏng Vấn
    content: string; // Nội Dung Phỏng Vấn
    demeanor: string; // Tác phong, Trang phục
    notes: string; // Lưu ý
    result: 'passed' | 'failed' | 'pending'; // Kết Quả Phỏng Vấn
}

const mockInterviews: Interview[] = [
    {
        id: "1",
        studentName: "Nguyễn Văn A",
        jobOrder: "DH001 - Toyota",
        class: "N4-01",
        practiceDate: "10/02/2024",
        practiceDuration: "2 Tuần",
        interviewDate: "25/02/2024",
        interviewTime: "09:00",
        address: "Phòng họp 2",
        content: "Giới thiệu bản thân, Lý do đi Nhật, Kinh nghiệm làm việc",
        demeanor: "Áo sơ mi trắng, quần tây đen",
        notes: "Cần tự tin hơn",
        result: "pending"
    },
    {
        id: "2",
        studentName: "Trần Thị B",
        jobOrder: "DH002 - Panasonic",
        class: "N4-02",
        practiceDate: "12/02/2024",
        practiceDuration: "1 Tuần",
        interviewDate: "20/02/2024",
        interviewTime: "14:00",
        address: "Online / Zoom",
        content: "Test khéo tay, PV trực tiếp",
        demeanor: "Lịch sự, kết nối ổn",
        notes: "Cười nhiều hơn",
        result: "passed"
    },
    {
        id: "3",
        studentName: "Lê Văn C",
        jobOrder: "DH001 - Toyota",
        class: "N4-01",
        practiceDate: "10/02/2024",
        practiceDuration: "2 Tuần",
        interviewDate: "25/02/2024",
        interviewTime: "10:30",
        address: "Phòng họp 2",
        content: "Giới thiệu, Thể lực",
        demeanor: "Đồng phục trung tâm",
        notes: "",
        result: "failed"
    }
];

const InterviewList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedResult, setSelectedResult] = useState("all");

    const getResultBadge = (result: string) => {
        switch (result) {
            case "passed": return <Badge className="bg-success hover:bg-success/90 whitespace-nowrap">Đậu</Badge>;
            case "failed": return <Badge className="bg-destructive hover:bg-destructive/90 whitespace-nowrap">Trượt</Badge>;
            case "pending": return <Badge variant="secondary" className="whitespace-nowrap">Chờ KQ</Badge>;
            default: return <Badge variant="outline">N/A</Badge>;
        }
    };

    const filteredInterviews = mockInterviews.filter(interview => {
        const matchesSearch = interview.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.jobOrder.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesResult = selectedResult === "all" || interview.result === selectedResult;
        return matchesSearch && matchesResult;
    });

    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEditClick = (interview: Interview) => {
        setSelectedInterview(interview);
        setIsEditDialogOpen(true);
    };

    const handleSave = () => {
        // Implement save logic here
        setIsEditDialogOpen(false);
    };

    return (
        <TooltipProvider>
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative w-full md:w-1/3">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm học viên, đơn hàng..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={selectedResult} onValueChange={setSelectedResult}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Kết quả" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="passed">Đậu</SelectItem>
                                <SelectItem value="failed">Trượt</SelectItem>
                                <SelectItem value="pending">Chờ kết quả</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            Bộ lọc
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3 px-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckSquare className="w-4 h-4" />
                            Danh sách phỏng vấn ({filteredInterviews.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[30px] px-2 text-center">#</TableHead>
                                        <TableHead className="w-[180px]">Học viên / Lớp</TableHead>
                                        <TableHead className="w-[120px]">Đơn hàng</TableHead>
                                        <TableHead className="min-w-[100px]">Luyện tập</TableHead>
                                        <TableHead className="min-w-[120px]">Lịch PV</TableHead>
                                        <TableHead className="min-w-[100px]">Địa điểm</TableHead>
                                        <TableHead className="min-w-[150px]">Nội dung & Tác phong</TableHead>
                                        <TableHead className="w-[80px]">Kết quả</TableHead>
                                        <TableHead className="w-[80px] text-right">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInterviews.map((interview) => (
                                        <TableRow key={interview.id} className="hover:bg-muted/20">
                                            <TableCell className="px-2 text-center">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{interview.studentName}</span>
                                                    <Badge variant="outline" className="w-fit text-[10px] h-5 mt-1">{interview.class}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium truncate" title={interview.jobOrder}>{interview.jobOrder}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs">
                                                    <span className="text-muted-foreground">BĐ: {interview.practiceDate}</span>
                                                    <span className="font-medium text-blue-600">{interview.practiceDuration}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs">
                                                    <div className="flex items-center gap-1 font-medium">
                                                        <Calendar className="w-3 h-3" />
                                                        {interview.interviewDate}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                                                        <Clock className="w-3 h-3" />
                                                        {interview.interviewTime}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                    <span className="truncate max-w-[100px]" title={interview.address}>{interview.address}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 w-full max-w-[200px]">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="text-xs truncate cursor-help border-b border-dotted w-fit max-w-full">
                                                                <span className="font-semibold text-muted-foreground mr-1">ND:</span>
                                                                {interview.content}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-[300px]">
                                                            <p className="font-semibold mb-1">Nội dung:</p>
                                                            <p className="text-xs">{interview.content}</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <div className="text-xs truncate text-muted-foreground" title={interview.demeanor}>
                                                        <span className="font-semibold text-muted-foreground mr-1">TP:</span>
                                                        {interview.demeanor}
                                                    </div>

                                                    {interview.notes && (
                                                        <div className="text-xs text-orange-600 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            <span className="truncate" title={interview.notes}>{interview.notes}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getResultBadge(interview.result)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => handleEditClick(interview)}
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Cập nhật thông tin phỏng vấn</DialogTitle>
                    </DialogHeader>
                    {selectedInterview && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="studentName">Học viên</Label>
                                    <Input id="studentName" defaultValue={selectedInterview.studentName} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="class">Lớp</Label>
                                    <Input id="class" defaultValue={selectedInterview.class} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="jobOrder">Đơn hàng</Label>
                                <Input id="jobOrder" defaultValue={selectedInterview.jobOrder} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="practiceDate">Ngày luyện tập</Label>
                                    <Input id="practiceDate" defaultValue={selectedInterview.practiceDate} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="practiceDuration">Thời lượng</Label>
                                    <Input id="practiceDuration" defaultValue={selectedInterview.practiceDuration} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="interviewDate">Ngày phỏng vấn</Label>
                                    <Input id="interviewDate" defaultValue={selectedInterview.interviewDate} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="interviewTime">Giờ phỏng vấn</Label>
                                    <Input id="interviewTime" defaultValue={selectedInterview.interviewTime} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Địa điểm</Label>
                                <Input id="address" defaultValue={selectedInterview.address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">Nội dung phỏng vấn</Label>
                                <Textarea id="content" defaultValue={selectedInterview.content} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="demeanor">Tác phong / Trang phục</Label>
                                <Input id="demeanor" defaultValue={selectedInterview.demeanor} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Lưu ý / Ghi chú</Label>
                                <Textarea id="notes" defaultValue={selectedInterview.notes} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="result">Kết quả</Label>
                                <Select defaultValue={selectedInterview.result}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn kết quả" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Chờ kết quả</SelectItem>
                                        <SelectItem value="passed">Đậu</SelectItem>
                                        <SelectItem value="failed">Trượt</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSave}>Lưu thay đổi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
};

export default InterviewList;
