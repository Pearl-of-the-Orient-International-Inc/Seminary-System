"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { trendConfig } from "./data";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { format, parseISO } from "date-fns";
import type { SeminaryDashboardData } from "@/features/seminary/seminary.types";

const EnrollmentOverview = ({ enrollmentTrend }: Pick<SeminaryDashboardData, "enrollmentTrend">) => {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Enrollment Overview</CardTitle>
        <CardDescription>
          Weekly enrollment growth and pending submissions for the active term.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trendConfig} className="max-h-110 w-full">
          <AreaChart
            data={enrollmentTrend}
            margin={{ left: 8, right: 8, top: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(parseISO(value), "MMM dd")}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    typeof value === "string"
                      ? format(parseISO(value), "MMMM dd, yyyy")
                      : value
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="pending"
              type="monotone"
              fill="var(--color-pending)"
              fillOpacity={0.18}
              stroke="var(--color-pending)"
              strokeWidth={2}
            />
            <Area
              dataKey="enrolled"
              type="monotone"
              fill="var(--color-enrolled)"
              fillOpacity={0.2}
              stroke="var(--color-enrolled)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default EnrollmentOverview;
