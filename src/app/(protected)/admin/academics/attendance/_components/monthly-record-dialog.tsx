"use client";

import { useState, type ReactNode } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleMinus,
  Clock3,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { AttendanceRecord, AttendanceStatus } from "./columns";

type CalendarEventTone = "blue" | "green" | "pink" | "orange";

type CalendarEvent = {
  label: string;
  tone: CalendarEventTone;
};

type CalendarDay = {
  day: number;
  inMonth: boolean;
  status?: AttendanceStatus | "Weekend";
  events?: CalendarEvent[];
};

type StudentMonthlyDashboard = {
  formationStage: string;
  assignedMinistry: string;
  sessionLabel: string;
  currentSessionHours: string;
  totalFormationHours: string;
  attendanceRate: string;
  lateCount: string;
  absentCount: string;
  communitySchedule: string;
  rangeLabel: string;
  timeline: { width: string; color: string }[];
  calendar: CalendarDay[][];
};

type MonthlyRecordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: AttendanceRecord | null;
};

const calendarEventToneClassName: Record<CalendarEventTone, string> = {
  blue: "border-sky-200 bg-sky-100 text-sky-700",
  green: "border-lime-200 bg-lime-100 text-lime-700",
  pink: "border-pink-200 bg-pink-100 text-pink-700",
  orange: "border-orange-200 bg-orange-100 text-orange-700",
};

const statusMeta: Record<
  AttendanceStatus | "Weekend",
  {
    icon: ReactNode;
    labelClassName: string;
  }
> = {
  Present: {
    icon: <CheckCircle2 className="size-3.5 text-emerald-600" />,
    labelClassName: "text-emerald-700",
  },
  Absent: {
    icon: <CircleMinus className="size-3.5 text-rose-600" />,
    labelClassName: "text-rose-700",
  },
  Late: {
    icon: <Clock3 className="size-3.5 text-amber-600" />,
    labelClassName: "text-amber-700",
  },
  Weekend: {
    icon: <CalendarDays className="size-3.5 text-orange-500" />,
    labelClassName: "text-orange-600",
  },
};

const defaultCalendar: CalendarDay[][] = [
  [
    { day: 27, inMonth: false, status: "Present", events: [{ label: "Orientation", tone: "blue" }] },
    { day: 28, inMonth: false, status: "Present" },
    { day: 29, inMonth: false, status: "Late", events: [{ label: "Choir practice", tone: "green" }] },
    { day: 30, inMonth: false, status: "Present" },
    { day: 1, inMonth: true, status: "Present" },
    { day: 2, inMonth: true, status: "Weekend" },
    { day: 3, inMonth: true, status: "Weekend" },
  ],
  [
    { day: 4, inMonth: true, status: "Present" },
    { day: 5, inMonth: true, status: "Present" },
    { day: 6, inMonth: true, status: "Present", events: [{ label: "Scripture study", tone: "blue" }] },
    { day: 7, inMonth: true, status: "Absent" },
    { day: 8, inMonth: true, status: "Present" },
    { day: 9, inMonth: true, status: "Weekend", events: [{ label: "Pastoral work", tone: "green" }] },
    { day: 10, inMonth: true, status: "Weekend" },
  ],
  [
    { day: 11, inMonth: true, status: "Present" },
    { day: 12, inMonth: true, status: "Late" },
    { day: 13, inMonth: true, status: "Present" },
    { day: 14, inMonth: true, status: "Present" },
    { day: 15, inMonth: true, status: "Present", events: [{ label: "Retreat prep", tone: "pink" }] },
    { day: 16, inMonth: true, status: "Weekend" },
    { day: 17, inMonth: true, status: "Weekend" },
  ],
  [
    { day: 18, inMonth: true, status: "Present" },
    { day: 19, inMonth: true, status: "Present" },
    { day: 20, inMonth: true, status: "Present", events: [{ label: "Homiletics", tone: "orange" }] },
    { day: 21, inMonth: true, status: "Present" },
    { day: 22, inMonth: true, status: "Late" },
    { day: 23, inMonth: true, status: "Weekend" },
    { day: 24, inMonth: true, status: "Weekend" },
  ],
  [
    { day: 25, inMonth: true, status: "Present" },
    { day: 26, inMonth: true, status: "Present" },
    { day: 27, inMonth: true, status: "Present" },
    { day: 28, inMonth: true, status: "Present" },
    { day: 29, inMonth: true, status: "Absent", events: [{ label: "Medical leave", tone: "pink" }] },
    { day: 30, inMonth: true, status: "Weekend" },
    { day: 31, inMonth: true, status: "Weekend" },
  ],
];

const monthlyDashboardByStudent: Record<string, StudentMonthlyDashboard> = {
  "1": {
    formationStage: "First Year Theology",
    assignedMinistry: "Community Formation",
    sessionLabel: "Current Formation Session",
    currentSessionHours: "04h 10m",
    totalFormationHours: "148h 30m",
    attendanceRate: "95.5%",
    lateCount: "2 times",
    absentCount: "1 day",
    communitySchedule: "8:00 AM - 4:00 PM",
    rangeLabel: "May 1 - May 31, 2026",
    timeline: [
      { width: "34%", color: "bg-emerald-400" },
      { width: "10%", color: "bg-teal-200" },
      { width: "18%", color: "bg-emerald-300" },
      { width: "14%", color: "bg-orange-200" },
      { width: "8%", color: "bg-teal-100" },
    ],
    calendar: defaultCalendar,
  },
  "2": {
    formationStage: "Second Year Theology",
    assignedMinistry: "Liturgical Ministry",
    sessionLabel: "Current Formation Session",
    currentSessionHours: "03h 45m",
    totalFormationHours: "152h 05m",
    attendanceRate: "98.0%",
    lateCount: "1 time",
    absentCount: "0 days",
    communitySchedule: "7:30 AM - 3:30 PM",
    rangeLabel: "May 1 - May 31, 2026",
    timeline: [
      { width: "38%", color: "bg-emerald-400" },
      { width: "8%", color: "bg-teal-200" },
      { width: "22%", color: "bg-emerald-300" },
      { width: "10%", color: "bg-orange-200" },
      { width: "6%", color: "bg-teal-100" },
    ],
    calendar: defaultCalendar,
  },
  "3": {
    formationStage: "First Year Theology",
    assignedMinistry: "Pastoral Formation",
    sessionLabel: "Current Formation Session",
    currentSessionHours: "02h 15m",
    totalFormationHours: "132h 40m",
    attendanceRate: "86.5%",
    lateCount: "3 times",
    absentCount: "3 days",
    communitySchedule: "8:00 AM - 4:00 PM",
    rangeLabel: "May 1 - May 31, 2026",
    timeline: [
      { width: "26%", color: "bg-emerald-400" },
      { width: "12%", color: "bg-teal-200" },
      { width: "16%", color: "bg-emerald-300" },
      { width: "18%", color: "bg-orange-200" },
      { width: "10%", color: "bg-rose-200" },
    ],
    calendar: defaultCalendar,
  },
};

const fallbackDashboard: StudentMonthlyDashboard = {
  formationStage: "Seminarian",
  assignedMinistry: "Formation Track",
  sessionLabel: "Current Formation Session",
  currentSessionHours: "03h 00m",
  totalFormationHours: "140h 00m",
  attendanceRate: "92.0%",
  lateCount: "2 times",
  absentCount: "1 day",
  communitySchedule: "8:00 AM - 4:00 PM",
  rangeLabel: "May 1 - May 31, 2026",
  timeline: [
    { width: "32%", color: "bg-emerald-400" },
    { width: "10%", color: "bg-teal-200" },
    { width: "18%", color: "bg-emerald-300" },
    { width: "12%", color: "bg-orange-200" },
    { width: "8%", color: "bg-teal-100" },
  ],
  calendar: defaultCalendar,
};

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getInitials = (value: string) =>
  value
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const summaryCards = (dashboard: StudentMonthlyDashboard) => [
  { label: "Total Formation Hours", value: dashboard.totalFormationHours },
  { label: "Attendance Rate", value: dashboard.attendanceRate },
  { label: "Late Records", value: dashboard.lateCount },
  { label: "Absences", value: dashboard.absentCount },
];

export const MonthlyRecordDialog = ({
  open,
  onOpenChange,
  student,
}: MonthlyRecordDialogProps) => {
  const [sessionEnabled, setSessionEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("calendar");

  if (!student) return null;

  const dashboard = monthlyDashboardByStudent[student.id] ?? fallbackDashboard;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full! overflow-hidden border-0 rounded-none p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Monthly Attendance Record</DialogTitle>
          <DialogDescription>
            {student.studentName}, {student.rollNo}, monthly seminary attendance record
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-screen">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.10),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 sm:p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Attendance Calendar
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Monthly attendance summary, formation session record, and community schedule.
                </p>
              </div>

              <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
                <aside className="rounded-lg bg-linear-to-b from-green-800 to-green-700 p-5 text-white shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="mb-4 size-20 ring-4 ring-white/20" size="lg">
                      <AvatarFallback className="bg-white/15 text-xl font-semibold text-white">
                        {getInitials(student.studentName)}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-xl font-semibold">{student.studentName}</h3>
                    <p className="mt-2 text-sm text-violet-100">
                      {dashboard.formationStage}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-violet-50">
                      <BriefcaseBusiness className="size-3.5" />
                      {dashboard.assignedMinistry}
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-widest">
                      POTSC-2026-0001
                    </p>
                  </div>
                </aside>

                <section className="rounded-lg bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <span className="font-medium text-slate-700">
                        {dashboard.sessionLabel}
                      </span>
                      <Switch
                        checked={sessionEnabled}
                        onCheckedChange={setSessionEnabled}
                      />
                      <span className="font-semibold text-slate-900">
                        {dashboard.currentSessionHours}
                      </span>
                    </div>

                    <Badge className="rounded-xl border-0 bg-orange-200 px-4 py-2 text-orange-700 hover:bg-orange-200">
                      Seminary Attendance
                    </Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards(dashboard).map((item) => (
                      <div key={item.label}>
                        <p className="text-2xl font-semibold tracking-tight text-slate-900">
                          {item.value}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200/80">
                    <div className="flex h-3 overflow-hidden rounded-full bg-white">
                      {dashboard.timeline.map((segment, index) => (
                        <div
                          key={`${segment.color}-${index}`}
                          className={segment.color}
                          style={{ width: segment.width }}
                        />
                      ))}
                    </div>

                    <div className="mt-3 grid grid-cols-6 gap-2 text-[11px] text-slate-400 sm:grid-cols-11">
                      {[
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "01:00",
                        "02:00",
                        "03:00",
                        "04:00",
                        "05:00",
                        "06:00",
                      ].map((time) => (
                        <span key={time}>{time}</span>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              <section className="rounded-lg bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
                <div className="mt-1">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-5">
                    <TabsList
                      variant="line"
                      className="h-auto gap-6 rounded-none p-0"
                    >
                      <TabsTrigger
                        value="task-list"
                        className="rounded-none px-0 pb-2 text-base font-semibold"
                      >
                        Task List
                      </TabsTrigger>
                      <TabsTrigger
                        value="calendar"
                        className="rounded-none px-0 pb-2 text-base font-semibold"
                      >
                        Calendar
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                    <CalendarDays className="size-4 text-slate-500" />
                    {dashboard.rangeLabel}
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 className="size-4 text-slate-500" />
                    Community Schedule:
                    <span className="font-semibold text-emerald-600">
                      {dashboard.communitySchedule}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-[26px] bg-white p-4 ring-1 ring-slate-200/80">
                  <div className="mb-5">
                    <h4 className="text-xl font-semibold text-slate-900">
                      Monthly Attendance Calendar
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Daily attendance status, ministry commitments, and seminary activities.
                    </p>
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {weekdayLabels.map((label) => (
                      <div
                        key={label}
                        className="border-b border-slate-200 pb-3 text-sm font-semibold text-slate-700"
                      >
                        {label}
                      </div>
                    ))}

                    {dashboard.calendar.flat().map((day, index) => {
                      const status = day.status ? statusMeta[day.status] : null;

                      return (
                        <div
                          key={`${day.day}-${index}`}
                          className="min-h-28 rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
                        >
                          <div
                            className={`text-sm font-medium ${
                              day.inMonth ? "text-slate-700" : "text-slate-300"
                            }`}
                          >
                            {day.day}
                          </div>

                          {status ? (
                            <div
                              className={`mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium ${status.labelClassName}`}
                            >
                              {status.icon}
                              {day.status}
                            </div>
                          ) : null}

                          <div className="mt-3 space-y-2">
                            {day.events?.map((event) => (
                              <div
                                key={event.label}
                                className={`rounded-lg border px-2.5 py-2 text-xs font-medium ${calendarEventToneClassName[event.tone]}`}
                              >
                                {event.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
