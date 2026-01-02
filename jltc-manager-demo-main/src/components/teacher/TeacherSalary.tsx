import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Download } from "lucide-react";

const salaryHistory = [
  {
    month: "11/2024",
    totalHours: 62,
    hourlyRate: 250000,
    bonus: 1500000,
    deduction: 0,
    total: 17000000,
    status: "paid",
    paidDate: "05/12/2024",
  },
  {
    month: "10/2024",
    totalHours: 58,
    hourlyRate: 250000,
    bonus: 1000000,
    deduction: 0,
    total: 15500000,
    status: "paid",
    paidDate: "05/11/2024",
  },
  {
    month: "09/2024",
    totalHours: 60,
    hourlyRate: 250000,
    bonus: 0,
    deduction: 500000,
    total: 14500000,
    status: "paid",
    paidDate: "05/10/2024",
  },
  {
    month: "08/2024",
    totalHours: 55,
    hourlyRate: 250000,
    bonus: 500000,
    deduction: 0,
    total: 14250000,
    status: "paid",
    paidDate: "05/09/2024",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const TeacherSalary = () => {
  return (
    <div className="space-y-6">
      {/* Current Month Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Lương tháng 12/2024 (Dự kiến)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-muted/30 rounded text-center">
              <p className="text-sm text-muted-foreground">Số tiết</p>
              <p className="text-2xl font-bold text-foreground">48</p>
            </div>
            <div className="p-4 bg-muted/30 rounded text-center">
              <p className="text-sm text-muted-foreground">Đơn giá/tiết</p>
              <p className="text-2xl font-bold text-foreground">250k</p>
            </div>
            <div className="p-4 bg-success/10 rounded text-center">
              <p className="text-sm text-muted-foreground">Thưởng</p>
              <p className="text-2xl font-bold text-success">0</p>
            </div>
            <div className="p-4 bg-destructive/10 rounded text-center">
              <p className="text-sm text-muted-foreground">Khấu trừ</p>
              <p className="text-2xl font-bold text-destructive">0</p>
            </div>
            <div className="p-4 bg-primary/10 rounded text-center">
              <p className="text-sm text-muted-foreground">Tổng (dự kiến)</p>
              <p className="text-2xl font-bold text-primary">12.0M</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lịch sử lương</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tháng</TableHead>
                  <TableHead className="text-right">Số tiết</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Thưởng</TableHead>
                  <TableHead className="text-right">Khấu trừ</TableHead>
                  <TableHead className="text-right">Tổng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày thanh toán</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryHistory.map((item) => (
                  <TableRow key={item.month}>
                    <TableCell className="font-medium">{item.month}</TableCell>
                    <TableCell className="text-right">{item.totalHours}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.hourlyRate)}</TableCell>
                    <TableCell className="text-right text-success">
                      {item.bonus > 0 ? `+${formatCurrency(item.bonus)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      {item.deduction > 0 ? `-${formatCurrency(item.deduction)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(item.total)}</TableCell>
                    <TableCell>
                      <Badge className={item.status === "paid" ? "bg-success" : "bg-warning"}>
                        {item.status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.paidDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Yearly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng kết năm 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/10 rounded text-center">
              <p className="text-3xl font-bold text-primary">235</p>
              <p className="text-sm text-muted-foreground">Tổng tiết đã dạy</p>
            </div>
            <div className="p-4 bg-success/10 rounded text-center">
              <p className="text-3xl font-bold text-success">61.25M</p>
              <p className="text-sm text-muted-foreground">Tổng lương đã nhận</p>
            </div>
            <div className="p-4 bg-warning/10 rounded text-center">
              <p className="text-3xl font-bold text-warning">3M</p>
              <p className="text-sm text-muted-foreground">Tổng thưởng</p>
            </div>
            <div className="p-4 bg-destructive/10 rounded text-center">
              <p className="text-3xl font-bold text-destructive">500k</p>
              <p className="text-sm text-muted-foreground">Tổng khấu trừ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherSalary;
