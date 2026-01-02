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
import { DollarSign, Printer, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const transactions = [
  {
    date: "01/11/2024",
    type: "Thu",
    amount: 4000000,
    method: "Chuyển khoản",
    note: "Học phí tháng 11",
    status: "Đã thanh toán",
  },
  {
    date: "01/10/2024",
    type: "Thu",
    amount: 4000000,
    method: "Tiền mặt",
    note: "Học phí tháng 10",
    status: "Đã thanh toán",
  },
  {
    date: "01/09/2024",
    type: "Thu",
    amount: 4000000,
    method: "Chuyển khoản",
    note: "Học phí tháng 9",
    status: "Đã thanh toán",
  },
  {
    date: "01/08/2024",
    type: "Thu",
    amount: 8000000,
    method: "Chuyển khoản",
    note: "Đặt cọc + học phí tháng 8",
    status: "Đã thanh toán",
  },
  {
    date: "01/12/2024",
    type: "Thu",
    amount: 4000000,
    method: "Chưa thu",
    note: "Học phí tháng 12",
    status: "Chưa thanh toán",
  },
];

const StudentFinance = () => {
  const totalFee = 32000000;
  const paid = 20000000;
  const remaining = totalFee - paid;
  const paidPercentage = (paid / totalFee) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Tổng học phí</p>
            <p className="text-3xl font-bold text-primary">
              {totalFee.toLocaleString()}đ
            </p>
            <p className="text-xs text-muted-foreground mt-2">8 tháng học</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Đã đóng</p>
            <p className="text-3xl font-bold text-success">
              {paid.toLocaleString()}đ
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {paidPercentage.toFixed(0)}% hoàn thành
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Còn nợ</p>
            <p className="text-3xl font-bold text-destructive">
              {remaining.toLocaleString()}đ
            </p>
            <p className="text-xs text-muted-foreground mt-2">3 tháng còn lại</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Đã thanh toán: {paid.toLocaleString()}đ
              </span>
              <span className="font-medium text-primary">{paidPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={paidPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Còn lại: {remaining.toLocaleString()}đ ({100 - paidPercentage}%)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Công cụ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Thu học phí
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              In biên lai
            </Button>
            <Button variant="outline">
              <DollarSign className="w-4 h-4 mr-2" />
              Lịch sử giao dịch
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thu chi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Công cụ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{transaction.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.type}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {transaction.amount.toLocaleString()}đ
                    </TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transaction.note}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          transaction.status === "Đã thanh toán"
                            ? "bg-success"
                            : "bg-warning"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.status === "Đã thanh toán" && (
                        <Button variant="ghost" size="sm">
                          <Printer className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch đóng học phí</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { month: "Tháng 8/2024", amount: 8000000, status: "paid", date: "01/08/2024" },
              { month: "Tháng 9/2024", amount: 4000000, status: "paid", date: "01/09/2024" },
              { month: "Tháng 10/2024", amount: 4000000, status: "paid", date: "01/10/2024" },
              { month: "Tháng 11/2024", amount: 4000000, status: "paid", date: "01/11/2024" },
              { month: "Tháng 12/2024", amount: 4000000, status: "pending", date: "01/12/2024" },
              { month: "Tháng 1/2025", amount: 4000000, status: "upcoming", date: "01/01/2025" },
              { month: "Tháng 2/2025", amount: 4000000, status: "upcoming", date: "01/02/2025" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{item.month}</p>
                  <p className="text-sm text-muted-foreground">
                    Hạn: {item.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-primary">
                    {item.amount.toLocaleString()}đ
                  </p>
                  <Badge
                    className={
                      item.status === "paid"
                        ? "bg-success"
                        : item.status === "pending"
                        ? "bg-warning"
                        : "bg-muted"
                    }
                  >
                    {item.status === "paid"
                      ? "Đã đóng"
                      : item.status === "pending"
                      ? "Chưa đóng"
                      : "Sắp tới"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentFinance;
