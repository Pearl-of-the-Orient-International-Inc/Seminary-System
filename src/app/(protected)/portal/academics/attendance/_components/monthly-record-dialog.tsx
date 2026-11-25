"use client";

import { CalendarDays, CheckCircle2, CircleMinus, Clock3, LoaderCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSeminaryAttendanceHistoryQuery } from "@/features/seminary/seminary.hooks";

import type { AttendanceRecord, AttendanceStatus } from "./columns";

type MonthlyRecordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: AttendanceRecord | null;
  month: string;
};

const statusMeta: Record<AttendanceStatus, { icon: React.ReactNode; className: string }> = {
  Present: { icon: <CheckCircle2 className="size-4" />, className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  Absent: { icon: <CircleMinus className="size-4" />, className: "border-rose-200 bg-rose-50 text-rose-700" },
  Late: { icon: <Clock3 className="size-4" />, className: "border-amber-200 bg-amber-50 text-amber-700" },
};

const toStatus = (value: "PRESENT" | "ABSENT" | "LATE"): AttendanceStatus =>
  (value.charAt(0) + value.slice(1).toLowerCase()) as AttendanceStatus;

const initials = (name: string) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

export const MonthlyRecordDialog = ({ open, onOpenChange, student, month }: MonthlyRecordDialogProps) => {
  const historyQuery = useSeminaryAttendanceHistoryQuery(
    { applicationId: student?.applicationId ?? "", month },
    { enabled: open && Boolean(student?.applicationId) },
  );

  if (!student) return null;

  const records = historyQuery.data?.data ?? [];
  const statusByDate = new Map(records.map((record) => [record.date, toStatus(record.status)]));
  const present = records.filter((record) => record.status === "PRESENT").length;
  const absent = records.filter((record) => record.status === "ABSENT").length;
  const late = records.filter((record) => record.status === "LATE").length;
  const total = records.length;
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(year, monthNumber - 1, 1);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const leadingDays = (firstDay.getDay() + 6) % 7;
  const calendarDays = Array.from({ length: leadingDays + daysInMonth }, (_, index) => index < leadingDays ? null : index - leadingDays + 1);
  const monthLabel = firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Monthly Attendance Record</DialogTitle>
          <DialogDescription>Saved attendance entries for {monthLabel}.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-xl bg-emerald-950 p-5 text-white">
            <Avatar className="size-16 border-2 border-white/30"><AvatarFallback className="bg-white/15 text-lg text-white">{initials(student.studentName)}</AvatarFallback></Avatar>
            <h3 className="mt-4 font-semibold">{student.studentName}</h3>
            <p className="mt-1 text-sm text-emerald-100">{student.rollNo}</p>
            <div className="mt-5 space-y-3 text-sm">
              <p><span className="block text-emerald-200">Attendance rate</span>{total ? `${((present / total) * 100).toFixed(1)}%` : "No records"}</p>
              <p><span className="block text-emerald-200">Saved sessions</span>{total}</p>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {([ ["Present", present], ["Late", late], ["Absent", absent] ] as const).map(([status, value]) => (
                <div key={status} className={`rounded-lg border p-3 ${statusMeta[status].className}`}><div className="flex items-center gap-2 text-sm">{statusMeta[status].icon}{status}</div><p className="mt-1 text-2xl font-semibold">{value}</p></div>
              ))}
            </div>

            <div className="rounded-xl border p-4">
              <div className="mb-3 flex items-center gap-2 font-medium"><CalendarDays className="size-4" />{monthLabel}</div>
              {historyQuery.isLoading ? (
                <div className="flex h-56 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading attendance history…</div>
              ) : (
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <div key={day} className="pb-1 font-medium text-muted-foreground">{day}</div>)}
                  {calendarDays.map((day, index) => {
                    if (!day) return <div key={`blank-${index}`} className="min-h-16 rounded-md bg-muted/30" />;
                    const date = `${month}-${String(day).padStart(2, "0")}`;
                    const status = statusByDate.get(date);
                    return <div key={date} className={`min-h-16 rounded-md border p-2 text-left ${status ? statusMeta[status].className : "border-border bg-background"}`}><span>{day}</span>{status && <Badge className="mt-2 block w-fit" variant="outline">{status}</Badge>}</div>;
                  })}
                </div>
              )}
            </div>

            <div className="rounded-xl border"><div className="border-b px-4 py-3 font-medium">Recorded remarks</div><div className="max-h-36 overflow-y-auto divide-y">{records.filter((record) => record.remarks).length ? records.filter((record) => record.remarks).map((record) => <div key={record.date} className="flex gap-3 px-4 py-2 text-sm"><span className="font-medium">{record.date}</span><span className="text-muted-foreground">{record.remarks}</span></div>) : <p className="px-4 py-5 text-sm text-muted-foreground">No remarks recorded for this month.</p>}</div></div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
