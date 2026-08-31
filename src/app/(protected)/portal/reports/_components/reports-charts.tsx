"use client";

import {
  Area,
  AreaChart,
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

import type { MonthlyPerformanceRow, ProgramAnalyticsRow } from "./reports-data";
import { performanceConfig, programConfig } from "./reports-data";

type ReportsChartsProps = {
  monthlyData: MonthlyPerformanceRow[];
  programData: ProgramAnalyticsRow[];
};

export const ReportsCharts = ({
  monthlyData,
  programData,
}: ReportsChartsProps) => (
  <div className="grid gap-6 xl:grid-cols-2">
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Enrollment and Collection Trend</CardTitle>
        <CardDescription>
          Monthly view of enrollment growth and fee collections across the current cycle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={performanceConfig} className="min-h-72 w-full">
          <AreaChart data={monthlyData} margin={{ left: 8, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="enrollment"
              type="monotone"
              fill="var(--color-enrollment)"
              fillOpacity={0.22}
              stroke="var(--color-enrollment)"
              strokeWidth={2.5}
            />
            <Area
              dataKey="collection"
              type="monotone"
              fill="var(--color-collection)"
              fillOpacity={0.12}
              stroke="var(--color-collection)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>

    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Program Completion Rate</CardTitle>
        <CardDescription>
          Compares report completion and research submission load per program cluster.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={programConfig} className="min-h-72 w-full">
          <BarChart data={programData} margin={{ left: 8, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="completionRate" radius={[10, 10, 0, 0]} fill="var(--color-Bachelor)">
              {programData.map((entry) => (
                <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
              ))}
            </Bar>
            <Bar dataKey="submissions" radius={[10, 10, 0, 0]} fill="#d08a5a" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>

    <Card className="border-border/70 shadow-sm xl:col-span-2">
      <CardHeader>
        <CardTitle>Program Share and Retention</CardTitle>
        <CardDescription>
          Shows how the seminary population is distributed and how well each track retains learners.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ChartContainer config={programConfig} className="min-h-72 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            <Pie
              data={programData}
              dataKey="enrollees"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
              strokeWidth={4}
            >
              {programData.map((entry) => (
                <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="grid gap-4 sm:grid-cols-2">
          {programData.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-emerald-950/10 bg-emerald-950/3 p-5 dark:border-emerald-100/10 dark:bg-emerald-100/4"
            >
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                {item.name}
              </div>
              <div className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-emerald-50">
                {item.retentionRate}%
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Retention rate</div>
              <div className="mt-4 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Enrollees</span>
                  <span className="font-medium">{item.enrollees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Graduates</span>
                  <span className="font-medium">{item.graduates}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Collections</span>
                  <span className="font-medium">
                    ₱{item.collection.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
