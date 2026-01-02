import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

const StatsCard = ({ title, value, icon: Icon, subtitle, trend, className, onClick }: StatsCardProps) => {
  return (
    <Card className={cn("hover:shadow-lg transition-all", className)} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    trend.isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {trend.value}
                </span>
                <span className="text-xs text-muted-foreground">vs tháng trước</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
            <Icon className="w-7 h-7 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
