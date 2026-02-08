
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
import { Plus, Search, FileText, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface JobOrder {
    id: string;
    code: string;
    companyName: string;
    jobTitle: string;
    quantity: number;
    salary: string;
    location: string;
    status: 'open' | 'closed' | 'pending';
    postedDate: string;
}

const mockOrders: JobOrder[] = [
    { id: "1", code: "DH001", companyName: "Toyota Auto Body", jobTitle: "Lắp ráp ô tô", quantity: 15, salary: "160.000 Yên/tháng", location: "Aichi, Nhật Bản", status: "open", postedDate: "2024-01-15" },
    { id: "2", code: "DH002", companyName: "Panasonic Electronics", jobTitle: "Lắp ráp linh kiện điện tử", quantity: 30, salary: "155.000 Yên/tháng", location: "Osaka, Nhật Bản", status: "open", postedDate: "2024-01-20" },
    { id: "3", code: "DH003", companyName: "Seven Foods", jobTitle: "Chế biến thực phẩm", quantity: 20, salary: "150.000 Yên/tháng", location: "Tokyo, Nhật Bản", status: "closed", postedDate: "2023-12-10" },
    { id: "4", code: "DH004", companyName: "Construction Corp", jobTitle: "Xây dựng", quantity: 10, salary: "180.000 Yên/tháng", location: "Fukuoka, Nhật Bản", status: "pending", postedDate: "2024-02-01" },
];

const JobOrders = () => {
    // ... component implementation ...
    const [searchTerm, setSearchTerm] = useState("");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open": return "bg-green-500 hover:bg-green-600";
            case "closed": return "bg-destructive hover:bg-destructive/90";
            case "pending": return "bg-yellow-500 hover:bg-yellow-600";
            default: return "bg-secondary";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "open": return "đang mở";
            case "closed": return "đã đóng";
            case "pending": return "chờ duyệt";
            default: return status;
        }
    };

    const filteredOrders = mockOrders.filter(order =>
        order.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm đơn hàng..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm đơn hàng
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Danh sách đơn hàng
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Mã đơn</TableHead>
                                <TableHead>Tên xí nghiệp</TableHead>
                                <TableHead>Ngành nghề</TableHead>
                                <TableHead className="text-center">Số lượng</TableHead>
                                <TableHead>Mức lương</TableHead>
                                <TableHead>Địa điểm</TableHead>
                                <TableHead className="text-center">Trạng thái</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.code}</TableCell>
                                    <TableCell>{order.companyName}</TableCell>
                                    <TableCell>{order.jobTitle}</TableCell>
                                    <TableCell className="text-center">{order.quantity}</TableCell>
                                    <TableCell>{order.salary}</TableCell>
                                    <TableCell>{order.location}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={getStatusColor(order.status)}>
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default JobOrders;
