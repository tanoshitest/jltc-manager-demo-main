import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, ArrowRight, CheckCircle, Clock, XCircle } from "lucide-react";

const classHistory = [
  {
    class: "N4-02",
    startDate: "01/09/2024",
    endDate: "Hiện tại",
    status: "Đang học",
    progress: 65,
  },
  {
    class: "N5-03",
    startDate: "01/03/2024",
    endDate: "31/08/2024",
    status: "Hoàn thành",
    progress: 100,
  },
];

const statusHistory = [
  {
    date: "01/09/2024",
    event: "Chuyển lớp",
    from: "N5-03",
    to: "N4-02",
    reason: "Hoàn thành N5",
    type: "transfer",
  },
  {
    date: "01/03/2024",
    event: "Nhập học",
    from: "",
    to: "N5-03",
    reason: "Bắt đầu khóa học",
    type: "start",
  },
];

const StudentHistory = () => {
  return (
    <div className="space-y-6">
      {/* Class History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử lớp học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classHistory.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.class}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.startDate} - {item.endDate}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      item.status === "Đang học"
                        ? "bg-success"
                        : "bg-primary"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tiến độ</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử trạng thái</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-6">
              {statusHistory.map((item, index) => (
                <div key={index} className="relative flex gap-4">
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                      item.type === "start"
                        ? "bg-success/10"
                        : item.type === "transfer"
                        ? "bg-primary/10"
                        : item.type === "hold"
                        ? "bg-warning/10"
                        : "bg-destructive/10"
                    }`}
                  >
                    {item.type === "start" && (
                      <CheckCircle className="w-6 h-6 text-success" />
                    )}
                    {item.type === "transfer" && (
                      <ArrowRight className="w-6 h-6 text-primary" />
                    )}
                    {item.type === "hold" && (
                      <Clock className="w-6 h-6 text-warning" />
                    )}
                    {item.type === "end" && (
                      <XCircle className="w-6 h-6 text-destructive" />
                    )}
                  </div>

                  <div className="flex-1 pb-6">
                    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{item.event}</h4>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.date}
                        </Badge>
                      </div>

                      {item.from && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <span>Từ: <span className="font-medium">{item.from}</span></span>
                          <ArrowRight className="w-4 h-4" />
                          <span>Đến: <span className="font-medium">{item.to}</span></span>
                        </div>
                      )}

                      {!item.from && item.to && (
                        <div className="text-sm text-muted-foreground mb-1">
                          Lớp: <span className="font-medium">{item.to}</span>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground">{item.reason}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upcoming placeholder */}
              <div className="relative flex gap-4 opacity-50">
                <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center bg-muted">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-4 border-2 border-dashed border-border">
                    <p className="text-sm text-muted-foreground">
                      Sự kiện tiếp theo sẽ được cập nhật...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Tổng thời gian học</p>
            <p className="text-3xl font-bold text-primary">9 tháng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Số lớp đã học</p>
            <p className="text-3xl font-bold text-primary">2 lớp</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Trạng thái hiện tại</p>
            <Badge className="bg-success mt-2">Đang học</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentHistory;
