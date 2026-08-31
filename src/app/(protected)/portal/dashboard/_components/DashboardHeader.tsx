"use client";

import { IconDownload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DashboardHeaderProps = {
  academicYear: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onExport: () => void;
};

export const DashboardHeader = ({
  academicYear,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onExport,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl text-[#173f20] dark:text-[#e7f2e8]">
          Dashboard
        </h1>
        <p className="text-sm font-semibold text-[#6f786d] dark:text-[#9eaa9f]">
          {academicYear}
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="h-9 min-w-38 border-border/60 bg-background shadow-none"
            aria-label="Start date"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            className="h-9 min-w-38 border-border/60 bg-background shadow-none"
            aria-label="End date"
          />
        </div>

        <Button variant="outline" onClick={onExport}>
          <IconDownload className="size-4" />
          Export
        </Button>
      </div>
    </div>
  );
};
