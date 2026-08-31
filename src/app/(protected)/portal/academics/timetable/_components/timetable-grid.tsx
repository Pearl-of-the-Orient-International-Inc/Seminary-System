"use client";

import { Coffee, Info, Utensils } from "lucide-react";
import { IconInfoCircleFilled } from "@tabler/icons-react";

import { TimetableSessionCard } from "./timetable-session-card";
import { type TimetableEntry, type TimetableRow, weekDays } from "./data";

type TimetableGridProps = {
  rows: TimetableRow[];
  onEntrySelect: (entry: TimetableEntry, timeLabel: string) => void;
};

const breakIconMap = {
  "Community Prayer and Break": Coffee,
  "Lunch and Angelus": Utensils,
} as const;

export const TimetableGrid = ({
  rows,
  onEntrySelect,
}: TimetableGridProps) => (
  <div className="space-y-4">
    <div className="overflow-x-auto rounded-xl border border-border/70">
      <div>
        <div className="grid grid-cols-[110px_repeat(5,minmax(0,1fr))] border-b border-border/70 bg-muted/20">
          <div className="px-4 py-4 text-center text-sm font-semibold text-foreground">
            Time
          </div>
          {weekDays.map((day) => (
            <div
              key={day}
              className="border-l border-border/70 px-4 py-4 text-center text-sm font-semibold text-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {rows.map((row, index) =>
          row.type === "break" ? (
            <div
              key={`${row.label}-${index}`}
              className="grid grid-cols-[110px_repeat(5,minmax(0,1fr))] border-b border-border/70 last:border-b-0"
            >
              <div className="px-4 py-4 text-xs font-medium text-muted-foreground">
                {row.time}
              </div>
              <div className="col-span-5 border-l border-border/70 px-4 py-3">
                <div
                  className={`flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium ${row.accentClassName}`}
                >
                  {(() => {
                    const Icon =
                      breakIconMap[row.label as keyof typeof breakIconMap] ?? Info;
                    return <Icon className="size-4" />;
                  })()}
                  {row.label}
                </div>
              </div>
            </div>
          ) : (
            <div
              key={`${row.time}-${index}`}
              className="grid grid-cols-[110px_repeat(5,minmax(0,1fr))] border-b border-border/70 last:border-b-0"
            >
              <div className="px-4 py-4 text-xs font-medium text-muted-foreground">
                {row.time}
              </div>
              {row.entries.map((entry) => (
                <div
                  key={`${row.time}-${entry.day}`}
                  className="border-l border-border/70 p-3"
                >
                  <TimetableSessionCard
                    subject={entry.subject}
                    onClick={() => onEntrySelect(entry, row.time)}
                  />
                </div>
              ))}
            </div>
          ),
        )}
      </div>
    </div>

    <div className="flex items-start gap-2 rounded-lg border border-green-100 bg-green-50/70 px-4 py-3 text-sm text-green-900">
      <IconInfoCircleFilled className="mt-0.5 size-4 shrink-0" />
      <p>Note: Click any scheduled subject to edit it, or click an empty slot to add one.</p>
    </div>
  </div>
);
