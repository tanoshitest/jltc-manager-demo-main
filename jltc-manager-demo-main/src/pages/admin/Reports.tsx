import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Printer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

// Attendance data by class
const attendanceData = [
  { class: "N5-01", total: 15, present: 14, absent: 1, rate: 93 },
  { class: "N5-02", total: 16, present: 15, absent: 1, rate: 94 },
  { class: "N4-01", total: 14, present: 13, absent: 1, rate: 93 },
  { class: "N4-02", total: 18, present: 17, absent: 1, rate: 94 },
  { class: "N3-01", total: 12, present: 11, absent: 1, rate: 92 },
  { class: "N2-01", total: 10, present: 10, absent: 0, rate: 100 },
];

// Fee data
const feeData = [
  { id: 1, name: "Nguyễn Văn A", class: "N5-01", total: 5000000, paid: 5000000, debt: 0, status: "paid" },
  { id: 2, name: "Trần Thị B", class: "N5-01", total: 5000000, paid: 3000000, debt: 2000000, status: "debt" },
  { id: 3, name: "Lê Văn C", class: "N4-01", total: 6000000, paid: 6000000, debt: 0, status: "paid" },
  { id: 4, name: "Phạm Thị D", class: "N4-02", total: 6000000, paid: 4000000, debt: 2000000, status: "debt" },
  { id: 5, name: "Hoàng Văn E", class: "N3-01", total: 7000000, paid: 7000000, debt: 0, status: "paid" },
  { id: 6, name: "Vũ Thị F", class: "N5-02", total: 5000000, paid: 2000000, debt: 3000000, status: "debt" },
  { id: 7, name: "Đặng Văn G", class: "N2-01", total: 8000000, paid: 8000000, debt: 0, status: "paid" },
  { id: 8, name: "Bùi Thị H", class: "N4-01", total: 6000000, paid: 5000000, debt: 1000000, status: "debt" },
];

// Performance data (monthly evaluation)
const performanceData = [
  { id: 1, name: "Nguyễn Văn A", class: "N5-01", month: "11/2024", score: 85, result: "pass" },
  { id: 2, name: "Trần Thị B", class: "N5-01", month: "11/2024", score: 45, result: "fail" },
  { id: 3, name: "Lê Văn C", class: "N4-01", month: "11/2024", score: 78, result: "pass" },
  { id: 4, name: "Phạm Thị D", class: "N4-02", month: "11/2024", score: 52, result: "fail" },
  { id: 5, name: "Hoàng Văn E", class: "N3-01", month: "11/2024", score: 92, result: "pass" },
  { id: 6, name: "Vũ Thị F", class: "N5-02", month: "11/2024", score: 68, result: "pass" },
  { id: 7, name: "Đặng Văn G", class: "N2-01", month: "11/2024", score: 38, result: "fail" },
  { id: 8, name: "Bùi Thị H", class: "N4-01", month: "11/2024", score: 75, result: "pass" },
];

const feeChartData = [
  { month: "T8", collected: 32000000, pending: 8000000 },
  { month: "T9", collected: 28000000, pending: 12000000 },
  { month: "T10", collected: 30000000, pending: 10000000 },
  { month: "T11", collected: 35000000, pending: 5000000 },
];

const Reports = () => {
  const [reportType, setReportType] = useState("attendance");
  const [classFilter, setClassFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");

  const classes = ["N5-01", "N5-02", "N4-01", "N4-02", "N3-01", "N2-01"];

  const filteredAttendance = classFilter === "all" 
    ? attendanceData 
    : attendanceData.filter(item => item.class === classFilter);

  const filteredFee = feeFilter === "all" 
    ? feeData 
    : feeData.filter(item => item.status === feeFilter);

  const filteredPerformance = performanceFilter === "all" 
    ? performanceData 
    : performanceData.filter(item => item.result === performanceFilter);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Báo cáo</h1>
            <p className="text-muted-foreground">Thống kê và báo cáo tổng hợp</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              In
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Loại báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Chuyên cần</SelectItem>
                  <SelectItem value="fee">Học phí</SelectItem>
                  <SelectItem value="performance">Năng lực</SelectItem>
                </SelectContent>
              </Select>

              {reportType === "attendance" && (
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả lớp</SelectItem>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {reportType === "fee" && (
                <Select value={feeFilter} onValueChange={setFeeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                    <SelectItem value="debt">Còn công nợ</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {reportType === "performance" && (
                <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Kết quả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pass">Đạt</SelectItem>
                    <SelectItem value="fail">Không đạt</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Report */}
        {reportType === "attendance" && (
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo chuyên cần theo lớp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Tổng số HV</TableHead>
                      <TableHead>Có mặt</TableHead>
                      <TableHead>Vắng</TableHead>
                      <TableHead>Tỷ lệ (%)</TableHead>
                      <TableHead>Đánh giá</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.class}</TableCell>
                        <TableCell>{item.total}</TableCell>
                        <TableCell className="text-success font-semibold">{item.present}</TableCell>
                        <TableCell className="text-destructive font-semibold">{item.absent}</TableCell>
                        <TableCell className="font-bold">{item.rate}%</TableCell>
                        <TableCell>
                          <Badge className={item.rate >= 95 ? "bg-success" : item.rate >= 90 ? "bg-primary" : "bg-warning"}>
                            {item.rate >= 95 ? "Xuất sắc" : item.rate >= 90 ? "Tốt" : "Khá"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fee Report */}
        {reportType === "fee" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo học phí</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Họ tên</TableHead>
                        <TableHead>Lớp</TableHead>
                        <TableHead>Tổng học phí</TableHead>
                        <TableHead>Đã thanh toán</TableHead>
                        <TableHead>Công nợ</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFee.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.class}</TableCell>
                          <TableCell>{item.total.toLocaleString()}đ</TableCell>
                          <TableCell className="text-success font-semibold">{item.paid.toLocaleString()}đ</TableCell>
                          <TableCell className="text-destructive font-semibold">{item.debt.toLocaleString()}đ</TableCell>
                          <TableCell>
                            <Badge className={item.status === "paid" ? "bg-success" : "bg-warning"}>
                              {item.status === "paid" ? "Đã thanh toán" : "Còn công nợ"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Biểu đồ thu học phí</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={feeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="collected" fill="hsl(var(--success))" name="Đã thu" />
                    <Bar dataKey="pending" fill="hsl(var(--warning))" name="Chưa thu" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Tổng đã thu</p>
                    <p className="text-2xl font-bold text-success">
                      {filteredFee.reduce((acc, item) => acc + item.paid, 0).toLocaleString()}đ
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Tổng công nợ</p>
                    <p className="text-2xl font-bold text-warning">
                      {filteredFee.reduce((acc, item) => acc + item.debt, 0).toLocaleString()}đ
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Tỷ lệ thu</p>
                    <p className="text-2xl font-bold text-primary">
                      {Math.round((filteredFee.reduce((acc, item) => acc + item.paid, 0) / filteredFee.reduce((acc, item) => acc + item.total, 0)) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Performance Report */}
        {reportType === "performance" && (
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo đánh giá năng lực theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Tháng</TableHead>
                      <TableHead>Điểm</TableHead>
                      <TableHead>Kết quả</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPerformance.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.class}</TableCell>
                        <TableCell>{item.month}</TableCell>
                        <TableCell className="font-bold">{item.score}</TableCell>
                        <TableCell>
                          <Badge className={item.result === "pass" ? "bg-success" : "bg-destructive"}>
                            {item.result === "pass" ? "Đạt" : "Không đạt"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Tổng học viên</p>
                  <p className="text-2xl font-bold text-foreground">{filteredPerformance.length}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Đạt</p>
                  <p className="text-2xl font-bold text-success">
                    {filteredPerformance.filter(p => p.result === "pass").length}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Không đạt</p>
                  <p className="text-2xl font-bold text-destructive">
                    {filteredPerformance.filter(p => p.result === "fail").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Reports;
