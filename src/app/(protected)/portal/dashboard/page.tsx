"use client";

import { useMemo, useState } from "react";
import { subDays } from "date-fns";
import { DashboardCharts } from "./_components/DashboardCharts";
import { DashboardHeader } from "./_components/DashboardHeader";
import { DashboardKpis } from "./_components/DashboardKpis";
import { DashboardSidebar } from "./_components/DashboardSidebar";
import { RecentApplicationsTable } from "./_components/RecentApplicationsTable";
import EnrollmentOverview from "./_components/EnrollmentOverview";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import { useSeminaryDashboardQuery } from "@/features/seminary/seminary.hooks";
import type { SeminaryDashboardData } from "@/features/seminary/seminary.types";

const today = new Date();
const toDateInput = (value: Date) => value.toISOString().slice(0, 10);
const emptyDashboard: SeminaryDashboardData = { academicYear: "No active academic period configured", kpis: { totalStudents: 0, pendingEnrollments: 0, pendingPayments: 0, submittedDocuments: 0 }, enrollmentTrend: [], paymentStatusTrend: [], programDistribution: [], recentApplications: [], events: [] };

const Page = () => {
  const [startDate, setStartDate] = useState(() => toDateInput(subDays(today, 30)));
  const [endDate, setEndDate] = useState(() => toDateInput(today));
  const userQuery = useCurrentUserQuery();
  const isAdmin = userQuery.data?.role === "ADMIN";
  const dashboardQuery = useSeminaryDashboardQuery({ startDate, endDate }, { enabled: isAdmin });
  const dashboard = dashboardQuery.data?.data ?? emptyDashboard;

  const handleExport = () => {
    const lines = ["Seminary Dashboard Export", dashboard.academicYear, `Date range: ${startDate} to ${endDate}`, "", "Recent Applications", ...dashboard.recentApplications.map((item) => `${item.student} | ${item.studentId ?? item.id} | ${item.program} | ${item.enrollmentStatus} | ${item.paymentStatus}`), "", "Calendar Events", ...dashboard.events.map((item) => `${new Date(item.startsAt).toLocaleString("en-PH")} | ${item.title} | ${item.location ?? "No location"}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `seminary-dashboard-${startDate}-to-${endDate}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const content = useMemo(() => {
    if (!isAdmin) return <div className="rounded-2xl border border-border/70 bg-card p-6 text-sm text-muted-foreground">Dashboard reporting is available to Seminary administrators. You can still use the Announcement and academic pages available in your portal.</div>;
    if (dashboardQuery.isError) return <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">The dashboard could not be loaded. Please refresh and try again.</div>;
    return <><DashboardKpis kpis={dashboard.kpis} isLoading={dashboardQuery.isLoading} /><div className="grid gap-6 2xl:grid-cols-[minmax(0,1.65fr)_420px]"><EnrollmentOverview enrollmentTrend={dashboard.enrollmentTrend} /><DashboardSidebar events={dashboard.events} /></div><DashboardCharts data={dashboard} /><RecentApplicationsTable applications={dashboard.recentApplications} /></>;
  }, [dashboard, dashboardQuery.isError, dashboardQuery.isLoading, isAdmin]);

  return <section className="space-y-6 px-4 pb-10 pt-4 md:px-6 md:pb-12"><DashboardHeader academicYear={dashboard.academicYear} startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} onExport={handleExport} />{content}</section>;
};

export default Page;
