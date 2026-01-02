import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const StudentBasicInfo = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Ảnh học viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Ảnh đại diện</p>
              <img
                src="https://i.pravatar.cc/300?img=1"
                alt="Avatar"
                className="w-full rounded-lg border-2 border-border"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Ảnh toàn thân</p>
              <img
                src="https://i.pravatar.cc/300?img=11"
                alt="Full body"
                className="w-full rounded-lg border-2 border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Họ tên Kanji</p>
            <p className="font-medium">阮文英</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Furigana</p>
            <p className="font-medium">グエン・ヴァン・アー</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Romaji</p>
            <p className="font-medium">Nguyen Van A</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ngày sinh</p>
              <p className="font-medium">15/03/1999</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tuổi</p>
              <p className="font-medium">25 tuổi</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Giới tính</p>
              <p className="font-medium">Nam</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tay thuận</p>
              <p className="font-medium">Tay phải</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin sức khỏe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Chiều cao</p>
              <p className="font-medium">172 cm</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cân nặng</p>
              <p className="font-medium">65 kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">BMI</p>
              <Badge variant="outline">22.0</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Thị lực mắt trái</p>
              <p className="font-medium">10/10</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thị lực mắt phải</p>
              <p className="font-medium">10/10</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Hút thuốc</p>
              <Badge variant="outline">Không</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Xăm mình</p>
              <Badge variant="outline">Không</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dị ứng</p>
              <Badge variant="outline">Không</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Address */}
      <Card>
        <CardHeader>
          <CardTitle>Liên hệ & Địa chỉ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Số điện thoại</p>
            <p className="font-medium">0901234567</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Zalo</p>
            <p className="font-medium">0901234567</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">nguyenvana@email.com</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground">Địa chỉ hiện tại</p>
            <p className="font-medium">123 Nguyễn Trãi, Thanh Xuân, Hà Nội</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Quê quán</p>
            <p className="font-medium">Thái Bình</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tình trạng hôn nhân</p>
            <Badge variant="outline">Độc thân</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Học vấn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { level: "Tiểu học", school: "TH Kim Đồng", year: "2005-2010" },
              { level: "THCS", school: "THCS Nguyễn Du", year: "2010-2014" },
              { level: "THPT", school: "THPT Chu Văn An", year: "2014-2017" },
              { level: "Đại học", school: "ĐH Ngoại Thương", year: "2017-2021" },
              { level: "Chuyên ngành", school: "Kinh tế quốc tế", year: "2017-2021" },
              { level: "Kết quả", school: "Tốt nghiệp loại Khá", year: "2021" },
            ].map((edu, index) => (
              <div key={index} className="flex justify-between items-center pb-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{edu.level}</p>
                  <p className="text-sm text-muted-foreground">{edu.school}</p>
                </div>
                <Badge variant="outline">{edu.year}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Japanese Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Kinh nghiệm tiếng Nhật</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Thời gian học</p>
            <p className="font-medium">18 tháng</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trình độ hiện tại</p>
            <Badge className="bg-primary">N4 - 620 điểm</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">JLPT đã thi</p>
            <p className="font-medium">N5 (đạt 155/180 điểm)</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mục tiêu</p>
            <p className="font-medium">Đạt N3 trong 6 tháng tới</p>
          </div>
        </CardContent>
      </Card>

      {/* Family */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Thông tin gia đình</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Bố</p>
              <div>
                <p className="text-sm text-muted-foreground">Họ tên</p>
                <p className="font-medium">Nguyễn Văn X</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Năm sinh</p>
                <p className="font-medium">1970</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nghề nghiệp</p>
                <p className="font-medium">Nông dân</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thu nhập</p>
                <p className="font-medium">8 triệu/tháng</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Mẹ</p>
              <div>
                <p className="text-sm text-muted-foreground">Họ tên</p>
                <p className="font-medium">Trần Thị Y</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Năm sinh</p>
                <p className="font-medium">1972</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nghề nghiệp</p>
                <p className="font-medium">Nội trợ</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thu nhập</p>
                <p className="font-medium">Không</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Anh/Chị/Em</p>
              <div>
                <p className="text-sm text-muted-foreground">Anh trai</p>
                <p className="font-medium">Nguyễn Văn B (28 tuổi)</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nghề nghiệp</p>
                <p className="font-medium">Kỹ sư</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em gái</p>
                <p className="font-medium">Nguyễn Thị C (20 tuổi)</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nghề nghiệp</p>
                <p className="font-medium">Sinh viên</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aspirations */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Nguyện vọng đi Nhật</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Ngành nghề mong muốn</p>
              <p className="font-medium">Chế tạo ô tô, Điện tử</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Khu vực mong muốn</p>
              <p className="font-medium">Tokyo, Osaka, Aichi</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mức lương mong muốn</p>
              <p className="font-medium">180,000 - 200,000 yên/tháng</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thời gian dự kiến</p>
              <p className="font-medium">Tháng 6/2025</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Lý do muốn đi Nhật</p>
            <p className="font-medium leading-relaxed">
              Muốn học hỏi công nghệ tiên tiến, tích lũy kinh nghiệm làm việc trong môi trường 
              chuyên nghiệp, cải thiện điều kiện kinh tế gia đình và phát triển bản thân. 
              Đặc biệt quan tâm đến ngành công nghiệp ô tô Nhật Bản.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentBasicInfo;
