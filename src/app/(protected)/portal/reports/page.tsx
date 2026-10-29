"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, Filter, Printer, TrendingUp, UsersRound } from "lucide-react";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import { useSeminaryReportsQuery } from "@/features/seminary/seminary.hooks";
import type { SeminaryProgramLevel, SeminaryReportScope } from "@/features/seminary/seminary.types";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "../academics/classes/_components/stat-card";
import { type OperationalReportRow, type ProgramAnalyticsRow, reportProgramOptions, type ReportProgram } from "./_components/reports-data";
import { ReportsCharts } from "./_components/reports-charts";
import { ReportsSummaryTable } from "./_components/reports-summary-table";

const today = new Date();
const toDateInput = (value: Date) => value.toISOString().slice(0, 10);
const programLabels: Record<SeminaryProgramLevel, Exclude<ReportProgram, "All Programs">> = {
  CERTIFICATE: "Certificate", BACHELOR: "Bachelor", MASTER_WITH_THESIS: "Masteral", DOCTORATE_WITH_DISSERTATION: "Doctorate",
};
const programValues: Partial<Record<ReportProgram, SeminaryProgramLevel>> = {
  Certificate: "CERTIFICATE", Bachelor: "BACHELOR", Masteral: "MASTER_WITH_THESIS", Doctorate: "DOCTORATE_WITH_DISSERTATION",
};

const Page = () => {
  const [programFilter, setProgramFilter] = useState<ReportProgram>("All Programs");
  const [dateFrom, setDateFrom] = useState(() => `${today.getUTCFullYear()}-01-01`);
  const [dateTo, setDateTo] = useState(() => toDateInput(today));
  const [reportScope, setReportScope] = useState<SeminaryReportScope>("INSTITUTIONAL");
  const userQuery = useCurrentUserQuery();
  const isAdmin = userQuery.data?.role === "ADMIN";
  const reportsQuery = useSeminaryReportsQuery({ startDate: dateFrom, endDate: dateTo, scope: reportScope, programLevel: programValues[programFilter] }, { enabled: isAdmin });
  const report = reportsQuery.data?.data;
  const programData = useMemo<ProgramAnalyticsRow[]>(() => (report?.programs ?? []).map((item) => ({ name: programLabels[item.name], enrollees: item.enrollees, collection: item.collection, submissions: item.gradeRecords, retentionRate: item.retentionRate, completionRate: item.completionRate, graduates: Math.round(item.enrollees * (item.completionRate / 100)) })), [report]);
  const reportRows = (report?.operationalReports ?? []) as OperationalReportRow[];

  const content = useMemo(() => {
    if (!isAdmin) return <div className="rounded-2xl border border-border/70 bg-card p-6 text-sm text-muted-foreground">Reports are available to Seminary administrators only.</div>;
    if (reportsQuery.isError) return <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">Reports could not be loaded. Confirm the backend is running, then refresh and try again.</div>;
    return <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Enrollees" value={report?.summary.totalEnrollees ?? "—"} description="Registered students in the selected program" icon={<UsersRound className="size-6" />} accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" />
        <StatCard title="Collections" value={report ? `₱${report.summary.totalCollections.toLocaleString()}` : "—"} description="Recorded payments from fee accounts" icon={<BarChart3 className="size-6" />} accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300" />
        <StatCard title="Completion Rate" value={report ? `${report.summary.completionRate}%` : "—"} description="Completed grade records" icon={<TrendingUp className="size-6" />} accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300" />
        <StatCard title="Pass Rate" value={report ? `${report.summary.retentionRate}%` : "—"} description="Grade records marked passed" icon={<Filter className="size-6" />} accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300" />
      </div>
      <ReportsCharts monthlyData={report?.monthlyPerformance ?? []} programData={programData} />
      <ReportsSummaryTable data={reportRows} />
    </>;
  }, [isAdmin, programData, report, reportRows, reportsQuery.isError]);

  return <section className="space-y-6 p-10">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div className="space-y-2"><h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">Reports</h1><p className="text-sm leading-6 text-muted-foreground">Live enrollment, collection, academic progress, and document-request reporting.</p></div><div className="flex flex-col items-start gap-3 xl:items-end"><Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink asChild><Link href="/portal/dashboard">Dashboard</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>System</BreadcrumbPage></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Reports</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb><Button variant="outline" onClick={() => window.print()}><Printer className="size-4" />Print Report</Button></div></div>
    <div className="grid gap-4 rounded-2xl border border-emerald-950/10 bg-emerald-950/3 p-5 md:grid-cols-2 xl:grid-cols-4 dark:border-emerald-100/10 dark:bg-emerald-100/4">
      <div><div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Scope</div><Select value={reportScope} onValueChange={(value) => setReportScope(value as SeminaryReportScope)}><SelectTrigger className="w-full"><SelectValue placeholder="Select scope" /></SelectTrigger><SelectContent><SelectItem value="INSTITUTIONAL">Institutional</SelectItem><SelectItem value="ACADEMIC">Academic</SelectItem><SelectItem value="FINANCE">Finance</SelectItem><SelectItem value="REGISTRAR">Registrar</SelectItem></SelectContent></Select></div>
      <div><div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Program</div><Select value={programFilter} onValueChange={(value) => setProgramFilter(value as ReportProgram)}><SelectTrigger className="w-full"><SelectValue placeholder="Select program" /></SelectTrigger><SelectContent>{reportProgramOptions.map((program) => <SelectItem key={program} value={program}>{program}</SelectItem>)}</SelectContent></Select></div>
      <div><div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Date From</div><Input type="date" value={dateFrom} max={dateTo} onChange={(event) => setDateFrom(event.target.value)} /></div>
      <div><div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Date To</div><Input type="date" value={dateTo} min={dateFrom} onChange={(event) => setDateTo(event.target.value)} /></div>
    </div>
    {content}
  </section>;
};

export default Page;
