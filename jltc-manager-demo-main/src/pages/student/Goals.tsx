import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const mainGoal = {
  title: "Đạt chứng chỉ JLPT N5",
  targetDate: "2025-07-06",
  progress: 75,
  currentScore: 78,
  targetScore: 80,
  description: "Hoàn thành khóa học và đạt điểm tối thiểu 80/180 trong kỳ thi JLPT N5 chính thức",
};

const skillProgress = [
  { skill: "Từ vựng", current: 85, target: 80 },
  { skill: "Ngữ pháp", current: 75, target: 80 },
  { skill: "Đọc hiểu", current: 80, target: 80 },
  { skill: "Nghe hiểu", current: 70, target: 80 },
  { skill: "Hội thoại", current: 72, target: 80 },
];

const radarData = skillProgress.map((s) => ({
  subject: s.skill,
  current: s.current,
  target: s.target,
}));

const StudentGoals = () => {
  const daysUntilExam = Math.ceil(
    (new Date(mainGoal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Mục tiêu học tập
          </h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi tiến độ và đạt được mục tiêu của bạn
          </p>
        </div>

        {/* Main Goal Card */}
        <Card className="border-2 border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Mục tiêu chính
              </CardTitle>
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                Còn {daysUntilExam} ngày
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{mainGoal.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{mainGoal.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tiến độ hoàn thành</span>
                <span className="font-bold">{mainGoal.progress}%</span>
              </div>
              <Progress value={mainGoal.progress} className="h-4" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-3xl font-bold text-primary">{mainGoal.currentScore}%</p>
                <p className="text-xs text-muted-foreground">Điểm hiện tại</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-3xl font-bold text-green-500">{mainGoal.targetScore}%</p>
                <p className="text-xs text-muted-foreground">Điểm mục tiêu</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Kỹ năng theo chủ đề
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" className="text-xs" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Hiện tại"
                    dataKey="current"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Mục tiêu"
                    dataKey="target"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.1}
                    strokeDasharray="5 5"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm">Hiện tại</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/50" />
                <span className="text-sm">Mục tiêu</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Progress Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chi tiết tiến độ kỹ năng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillProgress.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{skill.skill}</span>
                    <span>
                      <span
                        className={cn(
                          "font-bold",
                          skill.current >= skill.target ? "text-green-500" : "text-primary"
                        )}
                      >
                        {skill.current}%
                      </span>
                      <span className="text-muted-foreground"> / {skill.target}%</span>
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={skill.current} className="h-2" />
                    <div
                      className="absolute top-0 h-2 w-0.5 bg-destructive"
                      style={{ left: `${skill.target}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentGoals;
