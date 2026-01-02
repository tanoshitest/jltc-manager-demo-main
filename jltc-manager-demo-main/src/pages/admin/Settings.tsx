import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Save, DoorOpen, BookOpen, Plus, Trash2, Edit2, GraduationCap, Users } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Settings = () => {
  // Rooms state
  const [rooms, setRooms] = useState([
    { id: 1, name: "Phòng 101", capacity: 20, status: "active" },
    { id: 2, name: "Phòng 102", capacity: 25, status: "active" },
    { id: 3, name: "Phòng 103", capacity: 15, status: "active" },
    { id: 4, name: "Phòng 201", capacity: 30, status: "inactive" },
  ]);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<{ id: number; name: string; capacity: number; status: string } | null>(null);
  const [newRoom, setNewRoom] = useState({ name: "", capacity: "", status: "active" });

  // Subjects state
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Tổng hợp", description: "Môn học tổng hợp kiến thức", status: "active" },
    { id: 2, name: "Kanji", description: "Học chữ Hán", status: "active" },
    { id: 3, name: "Hội thoại", description: "Luyện kỹ năng giao tiếp", status: "active" },
    { id: 4, name: "Ngữ pháp", description: "Học ngữ pháp tiếng Nhật", status: "active" },
    { id: 5, name: "Nghe", description: "Luyện kỹ năng nghe", status: "active" },
    { id: 6, name: "Đọc", description: "Luyện kỹ năng đọc hiểu", status: "active" },
  ]);
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<{ id: number; name: string; description: string; status: string } | null>(null);
  const [newSubject, setNewSubject] = useState({ name: "", description: "", status: "active" });

  // Levels state
  const [levels, setLevels] = useState([
    { id: 1, name: "N5", description: "Cấp độ cơ bản nhất", status: "active" },
    { id: 2, name: "N4", description: "Cấp độ sơ cấp", status: "active" },
    { id: 3, name: "N3", description: "Cấp độ trung cấp", status: "active" },
    { id: 4, name: "N2", description: "Cấp độ trung cao cấp", status: "active" },
    { id: 5, name: "N1", description: "Cấp độ cao cấp nhất", status: "active" },
  ]);
  const [levelDialogOpen, setLevelDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<{ id: number; name: string; description: string; status: string } | null>(null);
  const [newLevel, setNewLevel] = useState({ name: "", description: "", status: "active" });

  // Student types state
  const [studentTypes, setStudentTypes] = useState([
    { id: 1, name: "Thực tập sinh", description: "Học viên đi thực tập sinh Nhật Bản", status: "active" },
    { id: 2, name: "Kỹ sư", description: "Học viên đi làm kỹ sư tại Nhật", status: "active" },
    { id: 3, name: "Du học", description: "Học viên du học Nhật Bản", status: "active" },
    { id: 4, name: "Tiếng Nhật", description: "Học viên học tiếng Nhật tổng quát", status: "active" },
  ]);
  const [studentTypeDialogOpen, setStudentTypeDialogOpen] = useState(false);
  const [editingStudentType, setEditingStudentType] = useState<{ id: number; name: string; description: string; status: string } | null>(null);
  const [newStudentType, setNewStudentType] = useState({ name: "", description: "", status: "active" });

  // Room handlers
  const handleAddRoom = () => {
    if (newRoom.name && newRoom.capacity) {
      setRooms([...rooms, { 
        id: Date.now(), 
        name: newRoom.name, 
        capacity: parseInt(newRoom.capacity), 
        status: newRoom.status 
      }]);
      setNewRoom({ name: "", capacity: "", status: "active" });
      setRoomDialogOpen(false);
    }
  };

  const handleEditRoom = () => {
    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r));
      setEditingRoom(null);
      setRoomDialogOpen(false);
    }
  };

  const handleDeleteRoom = (id: number) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  // Subject handlers
  const handleAddSubject = () => {
    if (newSubject.name) {
      setSubjects([...subjects, { 
        id: Date.now(), 
        name: newSubject.name, 
        description: newSubject.description,
        status: newSubject.status 
      }]);
      setNewSubject({ name: "", description: "", status: "active" });
      setSubjectDialogOpen(false);
    }
  };

  const handleEditSubject = () => {
    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === editingSubject.id ? editingSubject : s));
      setEditingSubject(null);
      setSubjectDialogOpen(false);
    }
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  // Level handlers
  const handleAddLevel = () => {
    if (newLevel.name) {
      setLevels([...levels, { 
        id: Date.now(), 
        name: newLevel.name, 
        description: newLevel.description,
        status: newLevel.status 
      }]);
      setNewLevel({ name: "", description: "", status: "active" });
      setLevelDialogOpen(false);
    }
  };

  const handleEditLevel = () => {
    if (editingLevel) {
      setLevels(levels.map(l => l.id === editingLevel.id ? editingLevel : l));
      setEditingLevel(null);
      setLevelDialogOpen(false);
    }
  };

  const handleDeleteLevel = (id: number) => {
    setLevels(levels.filter(l => l.id !== id));
  };

  // Student type handlers
  const handleAddStudentType = () => {
    if (newStudentType.name) {
      setStudentTypes([...studentTypes, { 
        id: Date.now(), 
        name: newStudentType.name, 
        description: newStudentType.description,
        status: newStudentType.status 
      }]);
      setNewStudentType({ name: "", description: "", status: "active" });
      setStudentTypeDialogOpen(false);
    }
  };

  const handleEditStudentType = () => {
    if (editingStudentType) {
      setStudentTypes(studentTypes.map(st => st.id === editingStudentType.id ? editingStudentType : st));
      setEditingStudentType(null);
      setStudentTypeDialogOpen(false);
    }
  };

  const handleDeleteStudentType = (id: number) => {
    setStudentTypes(studentTypes.filter(st => st.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground">Cấu hình và tùy chỉnh hệ thống</p>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Cài đặt chung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="centerName">Tên trung tâm</Label>
                <Input id="centerName" defaultValue="日本語センター" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="centerCode">Mã trung tâm</Label>
                <Input id="centerCode" defaultValue="JLTC-HN-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input id="address" defaultValue="123 Nguyễn Trãi, Thanh Xuân, Hà Nội" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" defaultValue="024 3456 7890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="info@jltc.edu.vn" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" defaultValue="https://jltc.edu.vn" />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary-dark">
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Room Configuration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DoorOpen className="w-5 h-5" />
              Cấu hình phòng học
            </CardTitle>
            <Dialog open={roomDialogOpen} onOpenChange={(open) => {
              setRoomDialogOpen(open);
              if (!open) {
                setEditingRoom(null);
                setNewRoom({ name: "", capacity: "", status: "active" });
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm phòng
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingRoom ? "Sửa phòng học" : "Thêm phòng học mới"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tên phòng</Label>
                    <Input 
                      value={editingRoom ? editingRoom.name : newRoom.name}
                      onChange={(e) => editingRoom 
                        ? setEditingRoom({...editingRoom, name: e.target.value})
                        : setNewRoom({...newRoom, name: e.target.value})
                      }
                      placeholder="VD: Phòng 101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sức chứa</Label>
                    <Input 
                      type="number"
                      value={editingRoom ? editingRoom.capacity : newRoom.capacity}
                      onChange={(e) => editingRoom 
                        ? setEditingRoom({...editingRoom, capacity: parseInt(e.target.value)})
                        : setNewRoom({...newRoom, capacity: e.target.value})
                      }
                      placeholder="VD: 20"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setRoomDialogOpen(false)}>Hủy</Button>
                    <Button onClick={editingRoom ? handleEditRoom : handleAddRoom}>
                      {editingRoom ? "Cập nhật" : "Thêm"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phòng</TableHead>
                  <TableHead>Sức chứa</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.capacity} người</TableCell>
                    <TableCell>
                      <Badge className={room.status === "active" ? "bg-success" : "bg-muted"}>
                        {room.status === "active" ? "Đang sử dụng" : "Tạm ngưng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingRoom(room);
                            setRoomDialogOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Subject Configuration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Cấu hình môn học
            </CardTitle>
            <Dialog open={subjectDialogOpen} onOpenChange={(open) => {
              setSubjectDialogOpen(open);
              if (!open) {
                setEditingSubject(null);
                setNewSubject({ name: "", description: "", status: "active" });
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm môn học
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSubject ? "Sửa môn học" : "Thêm môn học mới"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tên môn học</Label>
                    <Input 
                      value={editingSubject ? editingSubject.name : newSubject.name}
                      onChange={(e) => editingSubject 
                        ? setEditingSubject({...editingSubject, name: e.target.value})
                        : setNewSubject({...newSubject, name: e.target.value})
                      }
                      placeholder="VD: Ngữ pháp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <Input 
                      value={editingSubject ? editingSubject.description : newSubject.description}
                      onChange={(e) => editingSubject 
                        ? setEditingSubject({...editingSubject, description: e.target.value})
                        : setNewSubject({...newSubject, description: e.target.value})
                      }
                      placeholder="Mô tả ngắn về môn học"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSubjectDialogOpen(false)}>Hủy</Button>
                    <Button onClick={editingSubject ? handleEditSubject : handleAddSubject}>
                      {editingSubject ? "Cập nhật" : "Thêm"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên môn học</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell className="text-muted-foreground">{subject.description}</TableCell>
                    <TableCell>
                      <Badge className={subject.status === "active" ? "bg-success" : "bg-muted"}>
                        {subject.status === "active" ? "Đang sử dụng" : "Tạm ngưng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingSubject(subject);
                            setSubjectDialogOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteSubject(subject.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Level Configuration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Cấu hình cấp độ
            </CardTitle>
            <Dialog open={levelDialogOpen} onOpenChange={(open) => {
              setLevelDialogOpen(open);
              if (!open) {
                setEditingLevel(null);
                setNewLevel({ name: "", description: "", status: "active" });
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm cấp độ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingLevel ? "Sửa cấp độ" : "Thêm cấp độ mới"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tên cấp độ</Label>
                    <Input 
                      value={editingLevel ? editingLevel.name : newLevel.name}
                      onChange={(e) => editingLevel 
                        ? setEditingLevel({...editingLevel, name: e.target.value})
                        : setNewLevel({...newLevel, name: e.target.value})
                      }
                      placeholder="VD: N5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <Input 
                      value={editingLevel ? editingLevel.description : newLevel.description}
                      onChange={(e) => editingLevel 
                        ? setEditingLevel({...editingLevel, description: e.target.value})
                        : setNewLevel({...newLevel, description: e.target.value})
                      }
                      placeholder="Mô tả ngắn về cấp độ"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setLevelDialogOpen(false)}>Hủy</Button>
                    <Button onClick={editingLevel ? handleEditLevel : handleAddLevel}>
                      {editingLevel ? "Cập nhật" : "Thêm"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên cấp độ</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levels.map((level) => (
                  <TableRow key={level.id}>
                    <TableCell className="font-medium">{level.name}</TableCell>
                    <TableCell className="text-muted-foreground">{level.description}</TableCell>
                    <TableCell>
                      <Badge className={level.status === "active" ? "bg-success" : "bg-muted"}>
                        {level.status === "active" ? "Đang sử dụng" : "Tạm ngưng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingLevel(level);
                            setLevelDialogOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteLevel(level.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Student Type Configuration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Cấu hình loại học viên
            </CardTitle>
            <Dialog open={studentTypeDialogOpen} onOpenChange={(open) => {
              setStudentTypeDialogOpen(open);
              if (!open) {
                setEditingStudentType(null);
                setNewStudentType({ name: "", description: "", status: "active" });
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm loại
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingStudentType ? "Sửa loại học viên" : "Thêm loại học viên mới"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tên loại học viên</Label>
                    <Input 
                      value={editingStudentType ? editingStudentType.name : newStudentType.name}
                      onChange={(e) => editingStudentType 
                        ? setEditingStudentType({...editingStudentType, name: e.target.value})
                        : setNewStudentType({...newStudentType, name: e.target.value})
                      }
                      placeholder="VD: Thực tập sinh"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <Input 
                      value={editingStudentType ? editingStudentType.description : newStudentType.description}
                      onChange={(e) => editingStudentType 
                        ? setEditingStudentType({...editingStudentType, description: e.target.value})
                        : setNewStudentType({...newStudentType, description: e.target.value})
                      }
                      placeholder="Mô tả ngắn về loại học viên"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setStudentTypeDialogOpen(false)}>Hủy</Button>
                    <Button onClick={editingStudentType ? handleEditStudentType : handleAddStudentType}>
                      {editingStudentType ? "Cập nhật" : "Thêm"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên loại học viên</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell className="text-muted-foreground">{type.description}</TableCell>
                    <TableCell>
                      <Badge className={type.status === "active" ? "bg-success" : "bg-muted"}>
                        {type.status === "active" ? "Đang sử dụng" : "Tạm ngưng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingStudentType(type);
                            setStudentTypeDialogOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteStudentType(type.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
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
    </AdminLayout>
  );
};

export default Settings;
