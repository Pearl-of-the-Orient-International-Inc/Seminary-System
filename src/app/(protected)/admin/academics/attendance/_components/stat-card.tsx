import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  accentClassName: string;
  description: string;
  icon: React.ReactNode;
  title: string;
  value: number;
};

export const StatCard = ({
  accentClassName,
  description,
  icon,
  title,
  value,
}: StatCardProps) => (
  <Card className="overflow-hidden border-border/70 shadow-sm">
    <CardContent className="flex items-start gap-4">
      <div
        className={`flex size-12 items-center justify-center rounded ${accentClassName}`}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);
