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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { enrollmentTrend, type EnrollmentRecord } from "./enrollment-data";

const overviewConfig = {
  submitted: { label: "Submitted", color: "#82a887" },
  enrolled: { label: "Enrolled", color: "#1f6a39" },
};

const buildEnrollmentTrend = (records: EnrollmentRecord[]) => {
  if (!records.length) return enrollmentTrend;

  const buckets = new Map<string, { enrolled: number; submitted: number; week: string }>();

  records.forEach((record) => {
    const submittedAt = record.application?.submittedAt ?? record.application?.createdAt;
    const date = submittedAt ? new Date(submittedAt) : new Date();
    const week = new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
    }).format(date);
    const current = buckets.get(week) ?? { week, submitted: 0, enrolled: 0 };

    current.submitted += 1;
    if (record.status === "Approved" || record.status === "Enrolled") {
      current.enrolled += 1;
    }

    buckets.set(week, current);
  });

  return Array.from(buckets.values()).slice(-6);
};

export const EnrollmentOverview = ({
  records = [],
}: {
  records?: EnrollmentRecord[];
}) => {
  const trend = buildEnrollmentTrend(records);

  return (
    <Card className="border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
      <CardHeader>
        <CardTitle>Enrollment Flow Overview</CardTitle>
        <CardDescription>
          Submitted applications versus approved enrollments for the current cycle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={overviewConfig} className="max-h-96 w-full">
          <AreaChart data={trend} margin={{ left: 8, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="submitted"
              type="monotone"
              fill="var(--color-submitted)"
              fillOpacity={0.16}
              stroke="var(--color-submitted)"
              strokeWidth={2}
            />
            <Area
              dataKey="enrolled"
              type="monotone"
              fill="var(--color-enrolled)"
              fillOpacity={0.22}
              stroke="var(--color-enrolled)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
