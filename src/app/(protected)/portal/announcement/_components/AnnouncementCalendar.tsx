"use client";

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventClickArg } from "@fullcalendar/core";
import { IconCalendarEvent, IconClockHour4, IconMapPin, IconPencil, IconPlus, IconTrash, IconUsersGroup } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import { toApiError, useCreateSeminaryAnnouncementMutation, useDeleteSeminaryAnnouncementMutation, useSeminaryAnnouncementsQuery, useUpdateSeminaryAnnouncementMutation } from "@/features/seminary/seminary.hooks";
import type { SeminaryAnnouncement, SeminaryAnnouncementCategory, SeminaryAnnouncementPayload } from "@/features/seminary/seminary.types";

const categoryLabels: Record<SeminaryAnnouncementCategory, string> = { ACADEMIC: "Academic", ADMINISTRATION: "Administration", FORMATION: "Formation", ADMISSIONS: "Admissions" };
const categoryStyles: Record<SeminaryAnnouncementCategory, string> = {
  ACADEMIC: "bg-[#e3f0e4] text-[#215f31] dark:bg-[#213126] dark:text-[#dce7dd]",
  ADMINISTRATION: "bg-[#dbe8df] text-[#2d5f3b] dark:bg-[#23342a] dark:text-[#dce7dd]",
  FORMATION: "bg-[#edf3e6] text-[#48614d] dark:bg-[#28352d] dark:text-[#dce7dd]",
  ADMISSIONS: "bg-[#f5eadf] text-[#8a5a31] dark:bg-[#3a2f26] dark:text-[#f0d9c3]",
};
const audienceLabels = { ALL: "Students and instructors", STUDENTS: "Students only", INSTRUCTORS: "Instructors only", STUDENTS_AND_INSTRUCTORS: "Students and instructors" } as const;

type FormState = { title: string; summary: string; kind: "ANNOUNCEMENT" | "EVENT"; category: SeminaryAnnouncementCategory; audience: SeminaryAnnouncement["audience"]; location: string; allDay: boolean; startsAt: string; endsAt: string; status: SeminaryAnnouncement["status"] };
const blankForm = (): FormState => ({ title: "", summary: "", kind: "ANNOUNCEMENT", category: "ADMINISTRATION", audience: "ALL", location: "", allDay: false, startsAt: "", endsAt: "", status: "PUBLISHED" });
const toLocalInput = (value?: string | null) => { if (!value) return ""; const date = new Date(value); return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16); };
const toDateInput = (value?: string | null) => toLocalInput(value).slice(0, 10);
const toForm = (announcement: SeminaryAnnouncement): FormState => ({ title: announcement.title, summary: announcement.summary ?? "", kind: announcement.kind, category: announcement.category, audience: announcement.audience, location: announcement.location ?? "", allDay: announcement.allDay, startsAt: announcement.allDay ? toDateInput(announcement.startsAt) : toLocalInput(announcement.startsAt), endsAt: announcement.endsAt ? (announcement.allDay ? toDateInput(announcement.endsAt) : toLocalInput(announcement.endsAt)) : "", status: announcement.status });
const formatDate = (value: string) => new Intl.DateTimeFormat("en-PH", { month: "long", day: "numeric", year: "numeric" }).format(new Date(value));
const formatTime = (value: string) => new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit" }).format(new Date(value));

export const AnnouncementCalendar = () => {
  const { toast } = useToast();
  const userQuery = useCurrentUserQuery();
  const announcementsQuery = useSeminaryAnnouncementsQuery();
  const createMutation = useCreateSeminaryAnnouncementMutation();
  const updateMutation = useUpdateSeminaryAnnouncementMutation();
  const deleteMutation = useDeleteSeminaryAnnouncementMutation();
  const canManage = userQuery.data?.role === "ADMIN";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SeminaryAnnouncement | null>(null);
  const [form, setForm] = useState<FormState>(blankForm);
  const [deleteTarget, setDeleteTarget] = useState<SeminaryAnnouncement | null>(null);
  const announcements = announcementsQuery.data?.data ?? [];
  const selected = useMemo(() => announcements.find((item) => item.id === selectedId) ?? null, [announcements, selectedId]);
  const calendarEvents = useMemo(() => announcements.map((item) => ({ id: item.id, title: item.title, start: item.startsAt, end: item.endsAt ?? undefined, allDay: item.allDay, backgroundColor: item.category === "ADMISSIONS" ? "#b7793e" : item.category === "FORMATION" ? "#60775f" : "#2f6b3c", borderColor: "transparent" })), [announcements]);
  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const openCreate = () => { setEditing(null); setForm(blankForm()); setFormOpen(true); };
  const openEdit = (announcement: SeminaryAnnouncement) => { setEditing(announcement); setForm(toForm(announcement)); setDetailsOpen(false); setFormOpen(true); };
  const handleEventClick = (info: EventClickArg) => { setSelectedId(info.event.id); setDetailsOpen(true); };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.startsAt) { toast({ title: "Missing information", description: "Title and start date are required.", variant: "error" }); return; }
    const startsAt = form.allDay ? `${form.startsAt}T00:00:00.000Z` : new Date(form.startsAt).toISOString();
    const endsAt = form.endsAt ? (form.allDay ? `${form.endsAt}T23:59:59.999Z` : new Date(form.endsAt).toISOString()) : null;
    if (endsAt && new Date(endsAt) <= new Date(startsAt)) { toast({ title: "Invalid end time", description: "The end date and time must be after the start.", variant: "error" }); return; }
    const payload: SeminaryAnnouncementPayload = { title: form.title.trim(), summary: form.summary.trim() || null, kind: form.kind, category: form.category, audience: form.audience, location: form.location.trim() || null, allDay: form.allDay, startsAt, endsAt, status: form.status };
    try {
      if (editing) { await updateMutation.mutateAsync({ id: editing.id, payload }); await announcementsQuery.refetch(); toast({ title: "Calendar entry updated", description: "Your changes are now saved.", variant: "success" }); }
      else { await createMutation.mutateAsync(payload); await announcementsQuery.refetch(); toast({ title: "Calendar entry created", description: form.status === "PUBLISHED" ? "Students and instructors can now see it when it matches their audience." : "This draft is visible only to administrators.", variant: "success" }); }
      setFormOpen(false);
    } catch (error) { toast({ title: editing ? "Update failed" : "Creation failed", description: toApiError(error).message || "The calendar entry could not be saved.", variant: "error" }); }
  };
  const handleDelete = async () => { if (!deleteTarget) return; try { await deleteMutation.mutateAsync(deleteTarget.id); await announcementsQuery.refetch(); toast({ title: "Calendar entry deleted", description: "The announcement or event has been removed.", variant: "success" }); setDeleteTarget(null); setDetailsOpen(false); } catch (error) { toast({ title: "Delete failed", description: toApiError(error).message || "The calendar entry could not be deleted.", variant: "error" }); } };

  return <>
    <Card className="border-border/70 shadow-sm"><CardHeader className="space-y-3 border-b border-border/60"><div className="flex flex-wrap items-start justify-between gap-3"><div className="space-y-1"><CardTitle className="font-serif text-2xl">Announcement Calendar</CardTitle><CardDescription>Published events and announcements for the Seminary community.</CardDescription></div>{canManage ? <Button onClick={openCreate}><IconPlus className="size-4" /> Create event or announcement</Button> : null}</div><div className="flex flex-wrap gap-2 text-xs">{(Object.keys(categoryLabels) as SeminaryAnnouncementCategory[]).map((category) => <span key={category} className={`inline-flex rounded-full px-3 py-1 font-medium ${categoryStyles[category]}`}>{categoryLabels[category]}</span>)}</div></CardHeader><CardContent className="p-4 md:p-6">{announcementsQuery.isError ? <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">The calendar could not be loaded. Refresh the page and try again.</p> : <div className="events-calendar overflow-hidden rounded-2xl border border-border/60 bg-card p-3 md:p-4"><FullCalendar plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]} initialView="dayGridMonth" headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,listMonth" }} buttonText={{ today: "Today", month: "Month", week: "Week", list: "Agenda" }} height="auto" weekends editable={false} events={calendarEvents} eventClick={handleEventClick} dayMaxEvents={3} eventTimeFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }} /></div>}</CardContent></Card>
    <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle><DialogDescription>{selected?.summary || "No additional details were provided."}</DialogDescription></DialogHeader>{selected ? <div className="grid gap-4 md:grid-cols-2"><Info icon={<IconCalendarEvent className="size-4" />} label="Date" value={selected.allDay ? `${formatDate(selected.startsAt)} · All day` : `${formatDate(selected.startsAt)}${selected.endsAt ? ` – ${formatDate(selected.endsAt)}` : ""}`} /><Info icon={<IconClockHour4 className="size-4" />} label="Time" value={selected.allDay ? "Whole day" : `${formatTime(selected.startsAt)}${selected.endsAt ? ` – ${formatTime(selected.endsAt)}` : ""}`} /><Info icon={<IconMapPin className="size-4" />} label="Location" value={selected.location || "Not specified"} /><Info icon={<IconUsersGroup className="size-4" />} label="Audience" value={audienceLabels[selected.audience]} /></div> : null}<DialogFooter>{canManage && selected ? <><Button variant="outline" onClick={() => openEdit(selected)}><IconPencil className="size-4" /> Edit</Button><Button variant="destructive" onClick={() => setDeleteTarget(selected)}><IconTrash className="size-4" /> Delete</Button></> : null}</DialogFooter></DialogContent></Dialog>
    <Sheet open={formOpen} onOpenChange={setFormOpen}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>{editing ? "Edit calendar entry" : "Create calendar entry"}</SheetTitle>
          <SheetDescription>Choose whether this is an event or announcement, who can see it, and when it applies.</SheetDescription>
        </SheetHeader>
        <form className="grid flex-1 gap-4 p-6" onSubmit={handleSubmit}>
          <Field label="Title"><Input value={form.title} onChange={(event) => updateForm("title", event.target.value)} maxLength={180} required /></Field>
          <div className="grid gap-4 sm:grid-cols-2"><SelectField label="Type" value={form.kind} onChange={(value) => updateForm("kind", value as FormState["kind"])} options={[["ANNOUNCEMENT", "Announcement"], ["EVENT", "Event"]]} /><SelectField label="Category" value={form.category} onChange={(value) => updateForm("category", value as SeminaryAnnouncementCategory)} options={(Object.keys(categoryLabels) as SeminaryAnnouncementCategory[]).map((value) => [value, categoryLabels[value]])} /></div>
          <div className="grid gap-4 sm:grid-cols-2"><SelectField label="Audience" value={form.audience} onChange={(value) => updateForm("audience", value as FormState["audience"])} options={Object.entries(audienceLabels)} /><SelectField label="Publishing status" value={form.status} onChange={(value) => updateForm("status", value as FormState["status"])} options={[["PUBLISHED", "Published"], ["DRAFT", "Draft (administrators only)"]]} /></div>
          <div className="flex items-center gap-2"><Checkbox id="all-day-entry" checked={form.allDay} onCheckedChange={(checked) => updateForm("allDay", checked === true)} /><Label htmlFor="all-day-entry" className="cursor-pointer">All-day entry</Label></div>
          <div className="grid gap-4 sm:grid-cols-2"><Field label={form.allDay ? "Start date" : "Start date and time"}><Input type={form.allDay ? "date" : "datetime-local"} value={form.startsAt} onChange={(event) => updateForm("startsAt", event.target.value)} required /></Field><Field label={form.allDay ? "End date (optional)" : "End date and time (optional)"}><Input type={form.allDay ? "date" : "datetime-local"} value={form.endsAt} onChange={(event) => updateForm("endsAt", event.target.value)} /></Field></div>
          <Field label="Location (optional)"><Input value={form.location} onChange={(event) => updateForm("location", event.target.value)} placeholder="Room, campus, or online platform" maxLength={255} /></Field>
          <Field label="Details (optional)"><Textarea value={form.summary} onChange={(event) => updateForm("summary", event.target.value)} placeholder="Explain what the community needs to know." maxLength={2000} /></Field>
          <SheetFooter className="mt-2 flex-row justify-end border-t px-0 pt-4"><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editing ? "Save changes" : "Create entry"}</Button></SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
    <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this calendar entry?</AlertDialogTitle><AlertDescription>This permanently removes “{deleteTarget?.title}” from the Seminary calendar. Students and instructors will no longer see it.</AlertDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? "Deleting…" : "Delete entry"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </>;
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <div className="grid gap-2"><Label>{label}</Label>{children}</div>;
const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) => <Field label={label}><Select value={value} onValueChange={onChange}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{options.map(([optionValue, optionLabel]) => <SelectItem key={optionValue} value={optionValue}>{optionLabel}</SelectItem>)}</SelectContent></Select></Field>;
const Info = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => <div className="rounded-xl border border-border/60 bg-muted/10 p-4"><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#2f6b3c]">{icon}{label}</div><p className="text-sm text-muted-foreground">{value}</p></div>;
