"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
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
import {
  paymentConfig,
  paymentStatusTrend,
  programConfig,
  programDistribution,
} from "./data";

export const DashboardCharts = () => {
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle>Payment Verification Trend</CardTitle>
            <CardDescription>
              Monthly view of verified, pending, and flagged payment records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={paymentConfig} className="min-h-62.5 w-full">
              <BarChart data={paymentStatusTrend} margin={{ left: 8, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="verified"
                  stackId="payments"
                  radius={[10, 10, 0, 0]}
                  fill="var(--color-verified)"
                />
                <Bar
                  dataKey="pending"
                  stackId="payments"
                  fill="var(--color-pending)"
                />
                <Bar
                  dataKey="flagged"
                  stackId="payments"
                  fill="var(--color-flagged)"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle>Program Distribution</CardTitle>
            <CardDescription>
              Shows how the current enrollees are distributed across programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={programConfig}
              className="min-h-62.5 w-full"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                <Pie
                  data={programDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={92}
                  strokeWidth={4}
                >
                  {programDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
