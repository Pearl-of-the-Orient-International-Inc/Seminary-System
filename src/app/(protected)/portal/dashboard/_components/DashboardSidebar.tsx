"use client";

import { format, parseISO } from "date-fns";
import { IconCalendarEvent } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EventRecord } from "./data";
import { Badge } from "@/components/ui/badge";

type DashboardSidebarProps = {
  events: EventRecord[];
};

export const DashboardSidebar = ({ events }: DashboardSidebarProps) => {
  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>
          Registrar, faculty, and student activities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length ? (
          events.map((event) => (
            <div
              key={`${event.date}-${event.title}`}
              className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4 shadow-[0_8px_24px_rgba(16,24,18,0.05)] dark:bg-[#18231c]"
            >
              <div className="absolute inset-y-5 left-7 w-px bg-[linear-gradient(to_bottom,rgba(31,106,57,0.2),rgba(31,106,57,0))] dark:bg-[linear-gradient(to_bottom,rgba(207,226,209,0.22),rgba(207,226,209,0))]" />

              <div className="relative flex items-start gap-4">
                <div className="flex min-w-14 flex-col items-center rounded-xl border border-[#d7e4d7] bg-[linear-gradient(180deg,#ffffff_0%,#edf4ec_100%)] px-2 py-3 text-[#1e2c22] shadow-sm dark:border-[#33503b] dark:bg-[linear-gradient(180deg,#24342a_0%,#1d2a22_100%)] dark:text-[#edf4ed]">
                  <span className="text-xl leading-none">
                    {format(parseISO(event.date), "dd")}
                  </span>
                  <span className="mt-1 text-[11px] uppercase text-[#58705d] dark:text-[#a9bcac]">
                    {format(parseISO(event.date), "MMM")}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground transition-colors group-hover:text-[#1f6a39] dark:group-hover:text-[#dce7dd]">
                        {event.title}
                      </p>
                      <p className="text-xs uppercase text-muted-foreground">
                        {format(parseISO(event.date), "EEEE")}
                      </p>
                    </div>

                    <Badge>{event.tag}</Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {event.time} - {event.location}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/10 px-6 py-12 text-center">
            <div className="mb-3 rounded-2xl bg-muted p-4">
              <IconCalendarEvent className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium">No upcoming events</p>
            <p className="text-sm text-muted-foreground">
              There are no events inside the selected date range.
            </p>
          </div>
        )}

        {events.length ? (
          <Button variant="outline" className="w-full rounded-2xl">
            View Full Calendar
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};
