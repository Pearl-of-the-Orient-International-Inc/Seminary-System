"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Filter,
  Printer,
  Save,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  monthlyPerformance,
  operationalReports,
  programAnalytics,
  reportProgramOptions,
  type ReportProgram,
} from "./_components/reports-data";
import { ReportsCharts } from "./_components/reports-charts";
import { ReportsSummaryTable } from "./_components/reports-summary-table";

const Page = () => {
  const [programFilter, setProgramFilter] = useState<ReportProgram>("All Programs");
  const [dateFrom, setDateFrom] = useState("2026-05-01");
  const [dateTo, setDateTo] = useState("2026-05-31");
  const [reportScope, setReportScope] = useState("Institutional");

  const filteredProgramAnalytics = useMemo(() => {
    if (programFilter === "All Programs") {
      return programAnalytics;
    }

    return programAnalytics.filter((item) => item.name === programFilter);
  }, [programFilter]);

  const filteredOperationalReports = useMemo(() => {
    return operationalReports.filter((item) => {
      const matchesProgram =
        programFilter === "All Programs" || item.program === programFilter;
      const matchesDate = item.generatedOn >= dateFrom && item.generatedOn <= dateTo;

      return matchesProgram && matchesDate;
    });
  }, [dateFrom, dateTo, programFilter]);

  const displayedPrograms =
    programFilter === "All Programs" ? programAnalytics : filteredProgramAnalytics;

  const totalEnrollees = displayedPrograms.reduce(
    (sum, item) => sum + item.enrollees,
    0,
  );
  const totalCollections = displayedPrograms.reduce(
    (sum, item) => sum + item.collection,
    0,
  );
  const averageCompletion = displayedPrograms.length
    ? Math.round(
        displayedPrograms.reduce((sum, item) => sum + item.completionRate, 0) /
          displayedPrograms.length,
      )
    : 0;
  const averageRetention = displayedPrograms.length
    ? Math.round(
        displayedPrograms.reduce((sum, item) => sum + item.retentionRate, 0) /
          displayedPrograms.length,
      )
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
            Reports
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Review comprehensive analytics, operational reports, and program-based
            performance charts with filters and printable output.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 xl:items-end">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>System</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="size-4" />
              Print Report
            </Button>
            <Button>
              <Save className="size-4" />
              Save Snapshot
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Enrollees"
          value={totalEnrollees}
          description="Across the active reporting"
          icon={<UsersRound className="size-6" />}
          accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
        />
        <StatCard
          title="Collections"
          value={`₱${totalCollections.toLocaleString()}`}
          description="Consolidated fee inflow"
          icon={<BarChart3 className="size-6" />}
          accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
        />
        <StatCard
          title="Completion Rate"
          value={`${averageCompletion}%`}
          description="Average academic completion"
          icon={<TrendingUp className="size-6" />}
          accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
        />
        <StatCard
          title="Retention Rate"
          value={`${averageRetention}%`}
          description="Average program retention"
          icon={<Filter className="size-6" />}
          accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
        />
      </div>

      <div className="grid gap-4 rounded-2xl border border-emerald-950/10 bg-emerald-950/3 p-5 md:grid-cols-2 xl:grid-cols-4 dark:border-emerald-100/10 dark:bg-emerald-100/4">

        <div>
          <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Scope
          </div>
          <Select value={reportScope} onValueChange={setReportScope}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Institutional">Institutional</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Registrar">Registrar</SelectItem>
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
            onChange={(event) => setDateTo(event.target.value)}
          />
        </div>
      </div>

      <ReportsCharts
        monthlyData={monthlyPerformance}
        programData={
          filteredProgramAnalytics.length ? filteredProgramAnalytics : programAnalytics
        }
      />

      <ReportsSummaryTable data={filteredOperationalReports} />
    </section>
  );
};

export default Page;
