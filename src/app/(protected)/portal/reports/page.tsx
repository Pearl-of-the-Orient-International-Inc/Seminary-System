/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Filter,
  Printer,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import { useSeminaryReportsQuery } from "@/features/seminary/seminary.hooks";
import type {
  SeminaryProgramLevel,
  SeminaryReportScope,
} from "@/features/seminary/seminary.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "../academics/classes/_components/stat-card";
import {
  type OperationalReportRow,
  type ProgramAnalyticsRow,
  reportProgramOptions,
  type ReportProgram,
} from "./_components/reports-data";
import { ReportsCharts } from "./_components/reports-charts";
import { ReportsSummaryTable } from "./_components/reports-summary-table";

const today = new Date();
const toDateInput = (value: Date) => value.toISOString().slice(0, 10);
const programLabels: Record<
  SeminaryProgramLevel,
  Exclude<ReportProgram, "All Programs">
> = {
  CERTIFICATE: "Certificate",
  BACHELOR: "Bachelor",
  MASTER_WITH_THESIS: "Masteral",
  DOCTORATE_WITH_DISSERTATION: "Doctorate",
};
const programValues: Partial<Record<ReportProgram, SeminaryProgramLevel>> = {
  Certificate: "CERTIFICATE",
  Bachelor: "BACHELOR",
  Masteral: "MASTER_WITH_THESIS",
  Doctorate: "DOCTORATE_WITH_DISSERTATION",
};
const escapeHtml = (value: unknown) => String(value ?? "—").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);

const Page = () => {
  const [programFilter, setProgramFilter] =
    useState<ReportProgram>("All Programs");
  const [dateFrom, setDateFrom] = useState(
    () => `${today.getUTCFullYear()}-01-01`,
  );
  const [dateTo, setDateTo] = useState(() => toDateInput(today));
  const [reportScope, setReportScope] =
    useState<SeminaryReportScope>("INSTITUTIONAL");
  const userQuery = useCurrentUserQuery();
  const isAdmin = userQuery.data?.role === "ADMIN";
  const reportsQuery = useSeminaryReportsQuery(
    {
      startDate: dateFrom,
      endDate: dateTo,
      scope: reportScope,
      programLevel: programValues[programFilter],
    },
    { enabled: isAdmin },
  );
  const report = reportsQuery.data?.data;
  const programData = useMemo<ProgramAnalyticsRow[]>(
    () =>
      (report?.programs ?? []).map((item) => ({
        name: programLabels[item.name],
        enrollees: item.enrollees,
        collection: item.collection,
        submissions: item.gradeRecords,
        retentionRate: item.retentionRate,
        completionRate: item.completionRate,
        graduates: Math.round(item.enrollees * (item.completionRate / 100)),
      })),
    [report],
  );
  const reportRows = (report?.operationalReports ??
    []) as OperationalReportRow[];

  const printReport = () => {
    if (!report) return;
    const popup = window.open("", "_blank");
    if (!popup) return;
    const summary = [
      ["Total Enrollees", report.summary.totalEnrollees],
      ["Collections", `₱${report.summary.totalCollections.toLocaleString()}`],
      ["Completion Rate", `${report.summary.completionRate}%`],
      ["Pass Rate", `${report.summary.retentionRate}%`],
    ].map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
    const programs = programData.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.enrollees)}</td><td>₱${escapeHtml(item.collection.toLocaleString())}</td><td>${escapeHtml(item.submissions)}</td><td>${escapeHtml(item.completionRate)}%</td><td>${escapeHtml(item.retentionRate)}%</td></tr>`).join("");
    const operations = reportRows.map((item) => `<tr><td>${escapeHtml(item.reportId)}</td><td>${escapeHtml(item.reportName)}</td><td>${escapeHtml(item.program)}</td><td>${escapeHtml(item.generatedOn)}</td><td>${escapeHtml(item.pendingItems)}</td><td>${escapeHtml(item.collectionRate)}%</td><td>${escapeHtml(item.status)}</td></tr>`).join("");
    popup.document.write(`<!doctype html><html><head><title>Seminary Report</title><style>@page{margin:16mm}body{font:11pt Arial,sans-serif;color:#111}h1{margin:0 0 4px}h2{margin:24px 0 8px;font-size:14pt}p{margin:0 0 16px;color:#444}table{width:100%;border-collapse:collapse;margin-bottom:18px}th,td{border:1px solid #777;padding:7px 8px;text-align:left;vertical-align:top}th{background:#f2f2f2;font-weight:700}thead th{background:#164b2c;color:#fff}.summary{width:55%;max-width:430px}@media print{thead{display:table-header-group}tr{break-inside:avoid}}</style></head><body><h1>Pearl of the Orient Theological Seminary &amp; Colleges</h1><p><strong>${escapeHtml(report.scope)} Report</strong><br>Period: ${escapeHtml(report.period.startDate)} to ${escapeHtml(report.period.endDate)}<br>Program: ${escapeHtml(programFilter)}</p><h2>Summary</h2><table class="summary"><tbody>${summary}</tbody></table><h2>Program Analytics</h2><table><thead><tr><th>Program</th><th>Enrollees</th><th>Collections</th><th>Grade Records</th><th>Completion</th><th>Retention</th></tr></thead><tbody>${programs || '<tr><td colspan="6">No program data available.</td></tr>'}</tbody></table><h2>Operational Reports</h2><table><thead><tr><th>Report ID</th><th>Report Name</th><th>Program</th><th>Generated On</th><th>Pending Items</th><th>Collection Rate</th><th>Status</th></tr></thead><tbody>${operations || '<tr><td colspan="7">No operational reports available.</td></tr>'}</tbody></table></body></html>`);
    popup.document.close();
    popup.focus();
    window.setTimeout(() => popup.print(), 250);
  };

  const content = useMemo(() => {
    if (!isAdmin)
      return (
        <div className="rounded-2xl border border-border/70 bg-card p-6 text-sm text-muted-foreground">
          Reports are available to Seminary administrators only.
        </div>
      );
    if (reportsQuery.isError)
      return (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Reports could not be loaded. Confirm the backend is running, then
          refresh and try again.
        </div>
      );
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Enrollees"
            value={report?.summary.totalEnrollees ?? "—"}
            description="Students in the program"
            icon={<UsersRound className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Collections"
            value={
              report
                ? `₱${report.summary.totalCollections.toLocaleString()}`
                : "—"
            }
            description="Payments from fee accounts"
            icon={<BarChart3 className="size-6" />}
            accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
          />
          <StatCard
            title="Completion Rate"
            value={report ? `${report.summary.completionRate}%` : "—"}
            description="Completed grade records"
            icon={<TrendingUp className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Pass Rate"
            value={report ? `${report.summary.retentionRate}%` : "—"}
            description="Grades marked passed"
            icon={<Filter className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>
        <ReportsCharts
          monthlyData={report?.monthlyPerformance ?? []}
          programData={programData}
        />
        <ReportsSummaryTable data={reportRows} />
      </>
    );
  }, [isAdmin, programData, report, reportRows, reportsQuery.isError]);

  return (
    <section className="reports-print-document space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
            Reports
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Live enrollment, collection, academic progress, and document-request
            reporting.
          </p>
        </div>
        <div className="reports-print-controls flex flex-col items-start gap-3 xl:items-end">
          <Button variant="outline" onClick={printReport} disabled={!report}>
            <Printer className="size-4" />
            Print Report
          </Button>
        </div>
      </div>
      <div className="reports-print-controls grid gap-4 rounded-2xl border border-emerald-950/10 bg-emerald-950/3 p-5 md:grid-cols-2 xl:grid-cols-4 dark:border-emerald-100/10 dark:bg-emerald-100/4">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Scope
          </div>
          <Select
            value={reportScope}
            onValueChange={(value) =>
              setReportScope(value as SeminaryReportScope)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INSTITUTIONAL">Institutional</SelectItem>
              <SelectItem value="ACADEMIC">Academic</SelectItem>
              <SelectItem value="FINANCE">Finance</SelectItem>
              <SelectItem value="REGISTRAR">Registrar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Program
          </div>
          <Select
            value={programFilter}
            onValueChange={(value) => setProgramFilter(value as ReportProgram)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              {reportProgramOptions.map((program) => (
                <SelectItem key={program} value={program}>
                  {program}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Date From
          </div>
          <Input
            type="date"
            value={dateFrom}
            max={dateTo}
            onChange={(event) => setDateFrom(event.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Date To
          </div>
          <Input
            type="date"
            value={dateTo}
            min={dateFrom}
            onChange={(event) => setDateTo(event.target.value)}
          />
        </div>
      </div>
      {content}
    </section>
  );
};

export default Page;
