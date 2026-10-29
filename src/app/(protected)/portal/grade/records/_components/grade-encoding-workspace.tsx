"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Info,
  RotateCcw,
  Save,
  Search,
  Sigma,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  toApiError,
  useBulkEncodeSeminaryGradesMutation,
  useSeminaryCoursesQuery,
  useSeminaryGradeConfigurationQuery,
  useSeminaryStudentsQuery,
} from "@/features/seminary/seminary.hooks";
import type { SeminaryGradeScaleRow } from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

type ScoreKey = "attendance" | "coursework" | "character" | "exam";
type ResultFilter = "ALL" | "NOT_ENCODED" | "PASSED" | "FOR_REVIEW";
type GradeRow = Record<ScoreKey | `${ScoreKey}Total`, string> & {
  id: string;
  studentId: string;
  studentName: string;
  touched: boolean;
};

const defaultWeights = { attendance: 20, coursework: 25, character: 30, exam: 25 };

const percentageFor = (earned: string, total: string) => {
  const earnedValue = Number(earned);
  const totalValue = Number(total);
  if (!Number.isFinite(earnedValue) || !Number.isFinite(totalValue) || totalValue <= 0) return 0;
  return Math.max(0, Math.min(100, (earnedValue / totalValue) * 100));
};

const equivalentFor = (percentage: number, scale: SeminaryGradeScaleRow[]) => {
  const match = scale.find((row) => {
    const values = row.percentageRange.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    const minimum = row.percentageRange.toLowerCase().includes("below") ? 0 : (values[0] ?? 0);
    const maximum = row.percentageRange.toLowerCase().includes("below")
      ? (values[0] ?? 75) - 0.01
      : (values[1] ?? values[0] ?? 100);
    return percentage >= minimum && percentage <= maximum;
  });
  return match?.equivalent ?? (percentage >= 75 ? "3.00" : "5.00");
};

export const GradeEncodingWorkspace = () => {
  const { toast } = useToast();
  const coursesQuery = useSeminaryCoursesQuery({ limit: 100, page: 1 });
  const studentsQuery = useSeminaryStudentsQuery({ limit: 200, page: 1 });
  const configurationQuery = useSeminaryGradeConfigurationQuery();
  const [subject, setSubject] = useState("");
  const [rows, setRows] = useState<GradeRow[]>([]);
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const saveMutation = useBulkEncodeSeminaryGradesMutation();

  const configuration = configurationQuery.data?.data;
  const weights = configuration?.criteriaWeights ?? defaultWeights;
  const subjects = useMemo(() => {
    return (coursesQuery.data?.data ?? []).flatMap((course) =>
      (course.subjects ?? [])
        .map((item) => ({ label: `${item.subjectName} (${course.courseCode})`, value: item.subjectName, program: course.program })),
    );
  }, [coursesQuery.data?.data]);
  const students = useMemo(
    () => (studentsQuery.data?.data ?? [])
      .filter((student) => student.studentId)
      .map((student) => ({
        id: student.id,
        studentId: student.studentId ?? student.id,
        studentName: [student.givenName, student.middleName, student.surname].filter(Boolean).join(" ") || student.studentId || "Unnamed student",
      })),
    [studentsQuery.data?.data],
  );

  useEffect(() => {
    setSubject((current) =>
      subjects.some((item) => item.value === current)
        ? current
        : subjects[0]?.value || "",
    );
  }, [subjects]);
  useEffect(() => {
    setRows((current) => {
      const existing = new Map(current.map((row) => [row.id, row]));
      return students.map((student) => existing.get(student.id) ?? ({
        ...student, attendance: "0", attendanceTotal: "100", coursework: "0", courseworkTotal: "100", character: "0", characterTotal: "100", exam: "0", examTotal: "100", touched: false,
      }));
    });
  }, [students]);

  const updateCell = (id: string, key: ScoreKey | `${ScoreKey}Total`, value: string) =>
    setRows((current) => current.map((row) => row.id === id ? { ...row, [key]: value, touched: true } : row));
  const clearScores = () => setRows((current) => current.map((row) => ({ ...row, attendance: "0", coursework: "0", character: "0", exam: "0", touched: false })));
  const hasScore = rows.some((row) => row.touched);
  const saveScores = async () => {
    if (!subject || !hasScore) return;
    try {
      await saveMutation.mutateAsync({
        subject,
        entries: rows.filter((row) => row.touched).map((row) => ({
          studentApplicationId: row.id,
          attendanceEarned: Number(row.attendance), attendanceTotal: Number(row.attendanceTotal),
          courseworkEarned: Number(row.coursework), courseworkTotal: Number(row.courseworkTotal),
          characterEarned: Number(row.character), characterTotal: Number(row.characterTotal),
          examEarned: Number(row.exam), examTotal: Number(row.examTotal),
        })),
      });
      toast({ title: "Grades saved", description: "Final equivalents were recalculated from the active grade configuration.", variant: "success" });
      setRows((current) => current.map((row) => ({ ...row, touched: false })));
    } catch (error) {
      const apiError = toApiError(error);
      toast({ title: "Save failed", description: apiError.message ?? "Unable to save grades.", variant: "error" });
    }
  };
  const getResult = (row: GradeRow) => {
    const weighted = (
      percentageFor(row.attendance, row.attendanceTotal) * weights.attendance +
      percentageFor(row.coursework, row.courseworkTotal) * weights.coursework +
      percentageFor(row.character, row.characterTotal) * weights.character +
      percentageFor(row.exam, row.examTotal) * weights.exam
    ) / 100;
    const equivalent = equivalentFor(weighted, configuration?.gradeScale ?? []);
    return {
      equivalent,
      passed: Number(equivalent) <= Number(configuration?.passingEquivalent ?? "2.50"),
      weighted,
    };
  };
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !query || `${row.studentName} ${row.studentId}`.toLowerCase().includes(query);
      if (!matchesSearch) return false;
      if (resultFilter === "ALL") return true;
      if (resultFilter === "NOT_ENCODED") return !row.touched;
      const { passed } = getResult(row);
      return resultFilter === "PASSED" ? row.touched && passed : row.touched && !passed;
    });
  }, [configuration?.gradeScale, configuration?.passingEquivalent, resultFilter, rows, search, weights]);
  const rowsPerPage = Number(pageSize);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const visibleRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <Card className="overflow-hidden border-emerald-950/10 shadow-sm">
      <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 text-white">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-100/75"><FileSpreadsheet className="size-4" /> Gradebook worksheet</div>
            <div className="mt-2 flex flex-wrap items-center gap-2"><h2 className="text-2xl font-semibold">Encode raw points to final equivalent</h2><Badge variant="info">Preview only</Badge></div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-emerald-50">
            {(["attendance", "coursework", "character", "exam"] as ScoreKey[]).map((key) => <span key={key} className="rounded-full bg-white/10 px-3 py-1.5">{key === "coursework" ? "Reports & Activities" : key === "exam" ? "Examinations" : key[0].toUpperCase() + key.slice(1)} {weights[key]}%</span>)}
          </div>
        </div>
      </div>
      <CardContent className="space-y-5 p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="space-y-2 text-sm font-medium">Subject
            <Select value={subject} onValueChange={setSubject} disabled={coursesQuery.isLoading || !subjects.length}><SelectTrigger className="w-full"><SelectValue placeholder={coursesQuery.isLoading ? "Loading subjects..." : "Select a subject"} /></SelectTrigger><SelectContent>{subjects.length ? subjects.map((item) => <SelectItem key={item.label} value={item.value}>{item.label}</SelectItem>) : <SelectItem value="no-subjects" disabled>No subjects found in the course catalog</SelectItem>}</SelectContent></Select>
          </label>
          <div className="flex items-end gap-2"><Button type="button" variant="outline" onClick={clearScores} disabled={!hasScore}><RotateCcw className="size-4" />Clear scores</Button><Button type="button" onClick={saveScores} disabled={!subject || !hasScore || saveMutation.isPending}><Save className="size-4" />{saveMutation.isPending ? "Saving..." : "Save grades"}</Button></div>
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-emerald-950/10 bg-emerald-950/3 p-4 text-sm lg:flex-row lg:items-center">
          <div className="flex gap-3"><Sigma className="mt-0.5 size-5 shrink-0 text-emerald-700" /><p><span className="font-semibold text-foreground">Formula:</span> (Attendance % × {weights.attendance}%) + (Reports &amp; Activities % × {weights.coursework}%) + (Character % × {weights.character}%) + (Examinations % × {weights.exam}%)</p></div>
          <span className="text-muted-foreground">Passing equivalent: {configuration?.passingEquivalent ?? "2.50"}</span>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-72"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="pl-9" placeholder="Search student name or ID..." /></div>
            <Select value={resultFilter} onValueChange={(value) => { setResultFilter(value as ResultFilter); setPage(1); }}><SelectTrigger className="min-w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All students</SelectItem><SelectItem value="NOT_ENCODED">Not encoded</SelectItem><SelectItem value="PASSED">Passed</SelectItem><SelectItem value="FOR_REVIEW">For review</SelectItem></SelectContent></Select>
          </div>
          <span className="text-sm text-muted-foreground">{filteredRows.length} student{filteredRows.length === 1 ? "" : "s"}</span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-emerald-950/10">
          <table className="w-full min-w-[1430px] border-collapse text-sm">
            <thead className="bg-emerald-950 text-white">
              <tr><th className="sticky left-0 z-10 min-w-72 border-r border-white/10 bg-emerald-950 px-4 py-3 text-left font-medium">Student</th>{([{ key: "attendance", label: "Attendance" }, { key: "coursework", label: "Reports & Activities" }, { key: "character", label: "Character" }, { key: "exam", label: "Examinations" }] as const).map(({ key, label }) => <th key={key} colSpan={2} className="border-r border-white/10 px-3 py-3 text-center font-medium">{label} <span className="text-emerald-100/70">({weights[key]}%)</span></th>)}<th className="border-r border-white/10 px-4 py-3 text-center font-medium">Weighted %</th><th className="border-r border-white/10 px-4 py-3 text-center font-medium">Equivalent</th><th className="px-4 py-3 text-left font-medium">Remarks</th></tr>
              <tr className="bg-emerald-900 text-xs text-emerald-50/85"><th className="sticky left-0 z-10 border-r border-white/10 bg-emerald-900 px-4 py-2 text-left font-normal">Student ID</th>{(["attendance", "coursework", "character", "exam"] as ScoreKey[]).flatMap((key) => [<th key={`${key}-earned`} className="px-3 py-2 font-normal">Earned</th>, <th key={`${key}-total`} className="border-r border-white/10 px-3 py-2 font-normal">Out of</th>])}<th className="border-r border-white/10 px-4 py-2 font-normal">Formula</th><th className="border-r border-white/10 px-4 py-2 font-normal">Grade</th><th className="px-4 py-2 font-normal">Status</th></tr>
            </thead>
            <tbody>
              {visibleRows.map((row, index) => {
                const { weighted, equivalent } = getResult(row);
                const isBlank = !row.touched;
                const passed = Number(equivalent) <= Number(configuration?.passingEquivalent ?? "2.50");
                return <tr key={row.id} className={index % 2 ? "bg-muted/20" : "bg-background"}>
                  <td className="sticky left-0 z-10 border-r border-b border-emerald-950/8 bg-inherit px-4 py-3"><div className="font-medium">{row.studentName}</div><div className="mt-0.5 text-xs text-muted-foreground">{row.studentId}</div></td>
                  {(["attendance", "coursework", "character", "exam"] as ScoreKey[]).flatMap((key) => [<td key={`${key}-earned`} className="border-b border-emerald-950/8 px-2 py-2"><Input aria-label={`${key} earned for ${row.studentName}`} className="h-8 w-20 border-transparent bg-white text-right shadow-none focus-visible:border-emerald-700 dark:bg-input/30" inputMode="decimal" value={row[key]} onChange={(event) => updateCell(row.id, key, event.target.value)} /></td>, <td key={`${key}-total`} className="border-r border-b border-emerald-950/8 px-2 py-2"><Input aria-label={`${key} total points for ${row.studentName}`} className="h-8 w-20 border-transparent bg-white text-right shadow-none focus-visible:border-emerald-700 dark:bg-input/30" inputMode="decimal" value={row[`${key}Total`]} onChange={(event) => updateCell(row.id, `${key}Total`, event.target.value)} /></td>])}
                  <td className="border-r border-b border-emerald-950/8 px-4 py-3 text-center font-medium tabular-nums">{isBlank ? "—" : `${weighted.toFixed(2)}%`}</td><td className="border-r border-b border-emerald-950/8 px-4 py-3 text-center font-semibold tabular-nums">{isBlank ? "—" : equivalent}</td><td className="border-b border-emerald-950/8 px-4 py-3">{isBlank ? <span className="text-muted-foreground">Not encoded</span> : <Badge variant={passed ? "success" : "error"}>{passed ? "Passed" : "For review"}</Badge>}</td>
                </tr>;
              })}
              {!visibleRows.length ? <tr><td colSpan={12} className="px-4 py-12 text-center text-muted-foreground">No students match the current search or filter.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2"><span className="text-muted-foreground">Rows per page</span><Select value={pageSize} onValueChange={(value) => { setPageSize(value); setPage(1); }}><SelectTrigger className="w-20"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select></div>
          <div className="flex items-center gap-2"><span className="text-muted-foreground">Page {currentPage} of {pageCount}</span><Button type="button" size="icon-sm" variant="outline" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}><ChevronLeft className="size-4" /></Button><Button type="button" size="icon-sm" variant="outline" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount}><ChevronRight className="size-4" /></Button></div>
        </div>
        <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0" />Saving recalculates final equivalents and remarks from the active grade configuration on the server.</div>
      </CardContent>
    </Card>
  );
};
