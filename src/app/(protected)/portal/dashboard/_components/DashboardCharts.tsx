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
  programConfig,
} from "./data";
import type { SeminaryDashboardData } from "@/features/seminary/seminary.types";

const programLabel = (program: string | null) => {
  if (program === "MASTER_WITH_THESIS") return "Masteral";
  if (program === "DOCTORATE_WITH_DISSERTATION") return "Doctorate";
  return program ? `${program[0]}${program.slice(1).toLowerCase()}` : "Not specified";
};

export const DashboardCharts = ({ data }: { data: SeminaryDashboardData }) => {
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
              <BarChart data={data.paymentStatusTrend.map((item) => ({ ...item, period: new Date(`${item.period}-01T00:00:00`).toLocaleDateString("en-PH", { month: "short" }) }))} margin={{ left: 8, right: 8, top: 8 }}>
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
                  dataKey="rejected"
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
                  data={data.programDistribution.map((entry) => ({ ...entry, name: programLabel(entry.name) }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={92}
                  strokeWidth={4}
                >
                  {data.programDistribution.map((entry, index) => (
                    <Cell key={entry.name ?? "unspecified"} fill={["#c8dabc", "#1f6a39", "#4d8b57", "#7cab7d"][index % 4]} />
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
