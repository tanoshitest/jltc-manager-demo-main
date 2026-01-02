import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, MessageSquare } from "lucide-react";

const albums = [
  {
    name: "Teambuilding",
    count: 12,
    cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    date: "15/10/2024",
  },
  {
    name: "Khai giảng",
    count: 8,
    cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
    date: "01/09/2024",
  },
  {
    name: "Phỏng vấn",
    count: 15,
    cover: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    date: "20/11/2024",
  },
  {
    name: "Ngày xuất cảnh",
    count: 10,
    cover: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
    date: "Chưa có",
  },
  {
    name: "Ảnh lớp học",
    count: 25,
    cover: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop",
    date: "05/11/2024",
  },
  {
    name: "Ảnh gia đình",
    count: 6,
    cover: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop",
    date: "01/08/2024",
  },
];

const recentPhotos = [
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop",
    caption: "Hoạt động teambuilding",
    date: "15/10/2024",
  },
  {
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=300&fit=crop",
    caption: "Lễ khai giảng khóa K46",
    date: "01/09/2024",
  },
  {
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
    caption: "Phỏng vấn tuyển dụng",
    date: "20/11/2024",
  },
  {
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&h=300&fit=crop",
    caption: "Ảnh tập thể lớp N4-02",
    date: "05/11/2024",
  },
];

const StudentGallery = () => {
  return (
    <div className="space-y-6">
      {/* Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Công cụ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-primary hover:bg-primary-dark">
              <Play className="w-4 h-4 mr-2" />
              Slideshow
            </Button>
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ghi chú ảnh
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Xem theo ngày
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Albums */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Albums</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={album.cover}
                  alt={album.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/70 text-white">
                    {album.count} ảnh
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{album.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{album.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Ảnh mới nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentPhotos.map((photo, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="font-medium mb-1">{photo.caption}</p>
                    <p className="text-sm text-white/80 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {photo.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentGallery;
