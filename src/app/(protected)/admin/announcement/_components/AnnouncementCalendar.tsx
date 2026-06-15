"use client";

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventClickArg } from "@fullcalendar/core";
import {
  IconCalendarEvent,
  IconClockHour4,
  IconMapPin,
  IconUsersGroup,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { announcementEvents, type AnnouncementEvent } from "./announcement-events";

const categoryStyles: Record<AnnouncementEvent["extendedProps"]["category"], string> = {
  Academic: "bg-[#e3f0e4] text-[#215f31] dark:bg-[#213126] dark:text-[#dce7dd]",
  Administration: "bg-[#dbe8df] text-[#2d5f3b] dark:bg-[#23342a] dark:text-[#dce7dd]",
  Formation: "bg-[#edf3e6] text-[#48614d] dark:bg-[#28352d] dark:text-[#dce7dd]",
  Admissions: "bg-[#f5eadf] text-[#8a5a31] dark:bg-[#3a2f26] dark:text-[#f0d9c3]",
};

export const AnnouncementCalendar = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedEvent = useMemo(
    () =>
      selectedEventId
        ? announcementEvents.find((event) => event.id === selectedEventId) ?? null
        : null,
    [selectedEventId],
  );

  const handleEventClick = (info: EventClickArg) => {
    setSelectedEventId(info.event.id);
    setDialogOpen(true);
  };

  return (
    <>
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="space-y-3 border-b border-border/60">
          <div className="space-y-1">
            <CardTitle className="font-serif text-2xl">Announcement Calendar</CardTitle>
            <CardDescription>
              Full academic, formation, and admissions event calendar for April to June 2026.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs">
              {(["Academic", "Administration", "Formation", "Admissions"] as const).map((category) => (
                <span
                  key={category}
                  className={`inline-flex rounded-full px-3 py-1 font-medium ${categoryStyles[category]}`}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="events-calendar overflow-hidden rounded-2xl border border-border/60 bg-card p-3 md:p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              initialDate="2026-05-01"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,listMonth",
              }}
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
                list: "Agenda",
              }}
              height="auto"
              weekends
              editable={false}
              selectable
              events={announcementEvents}
              eventClick={handleEventClick}
              dayMaxEvents={3}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl! overflow-hidden rounded-3xl border-border/70 p-0">
          {selectedEvent ? (
            <>
              <div className="border-b border-border/60 bg-[linear-gradient(135deg,#f7faf5_0%,#eff4ec_100%)] p-6 dark:bg-[linear-gradient(135deg,#18251d_0%,#223129_100%)]">
                <DialogHeader className="space-y-3 text-left">
                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${categoryStyles[selectedEvent.extendedProps.category]}`}
                  >
                    {selectedEvent.extendedProps.category}
                  </span>
                  <div className="space-y-1">
                    <DialogTitle className="font-serif text-2xl leading-tight">
                      {selectedEvent.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                      {selectedEvent.extendedProps.summary}
                    </DialogDescription>
                  </div>
                </DialogHeader>
              </div>

              <div className="space-y-4 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <IconCalendarEvent className="size-4 text-[#2f6b3c]" />
                      Date
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.allDay
                        ? "All-day event"
                        : new Date(selectedEvent.start).toLocaleDateString("en-PH", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedEvent.end
                        ? `Until ${new Date(selectedEvent.end).toLocaleDateString("en-PH", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}`
                        : "Single-day schedule"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <IconClockHour4 className="size-4 text-[#2f6b3c]" />
                      Time
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.allDay
                        ? "Whole day"
                        : new Date(selectedEvent.start).toLocaleTimeString("en-PH", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedEvent.end && !selectedEvent.allDay
                        ? `Ends ${new Date(selectedEvent.end).toLocaleTimeString("en-PH", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}`
                        : "Time-managed by organizer"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <IconMapPin className="size-4 text-[#2f6b3c]" />
                      Location
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.extendedProps.location}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <IconUsersGroup className="size-4 text-[#2f6b3c]" />
                      Audience
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.extendedProps.audience}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t border-border/60 px-6 py-4" showCloseButton />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};
