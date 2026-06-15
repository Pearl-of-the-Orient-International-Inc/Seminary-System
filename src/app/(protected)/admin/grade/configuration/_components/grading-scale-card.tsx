"use client";

import { ScrollText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { GradeScaleRow } from "./config-data";

type GradingScaleCardProps = {
  rows: GradeScaleRow[];
};

export const GradingScaleCard = ({ rows }: GradingScaleCardProps) => (
  <Card className="overflow-hidden pt-0! gap-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
    <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
      <div className="inline-flex items-center gap-2 text-xs uppercase text-emerald-100/70">
        <ScrollText className="size-3.5" />
        Grading Scale
      </div>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Grade Equivalency Matrix
      </h2>
      <p className="mt-1 text-sm text-emerald-50/80">
        Standard numeric scale used across coursework and registrar reports.
      </p>
    </div>

    <CardContent className="p-0">
      <div className="grid grid-cols-[0.9fr_1.2fr_1.4fr] border-b bg-emerald-950/3 px-6 py-3 text-xs font-semibold uppercase text-muted-foreground dark:bg-emerald-100/4">
        <div>Equivalent</div>
        <div>Percentage Range</div>
        <div>Remarks</div>
      </div>
      <div className="divide-y">
        {rows.map((row) => (
          <div
            key={`${row.equivalent}-${row.percentageRange}`}
            className="grid grid-cols-[0.9fr_1.2fr_1.4fr] items-center px-6 py-4 text-sm"
          >
            <div className="font-semibold text-foreground">
              {row.equivalent}
            </div>
            <div>{row.percentageRange}</div>
            <div className="text-muted-foreground">{row.remarks}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
