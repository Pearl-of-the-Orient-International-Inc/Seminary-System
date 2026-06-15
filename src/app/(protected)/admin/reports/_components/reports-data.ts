import type { ChartConfig } from "@/components/ui/chart";

export type ReportProgram =
  | "All Programs"
  | "Certificate"
  | "Bachelor"
  | "Masteral"
  | "Doctorate";

export type ReportStatus = "Healthy" | "Watchlist" | "Critical";

export type MonthlyPerformanceRow = {
  collection: number;
  completionRate: number;
  enrollment: number;
  month: string;
};

export type ProgramAnalyticsRow = {
  collection: number;
  completionRate: number;
  enrollees: number;
  graduates: number;
  name: Exclude<ReportProgram, "All Programs">;
  retentionRate: number;
  submissions: number;
};

export type OperationalReportRow = {
  collectionRate: number;
  generatedOn: string;
  pendingItems: number;
  program: Exclude<ReportProgram, "All Programs">;
  reportId: string;
  reportName: string;
  status: ReportStatus;
};

export const reportProgramOptions: ReportProgram[] = [
  "All Programs",
  "Certificate",
  "Bachelor",
  "Masteral",
  "Doctorate",
];

export const monthlyPerformance: MonthlyPerformanceRow[] = [
  { month: "Jan", enrollment: 18, collection: 135000, completionRate: 72 },
  { month: "Feb", enrollment: 24, collection: 182000, completionRate: 76 },
  { month: "Mar", enrollment: 28, collection: 224000, completionRate: 81 },
  { month: "Apr", enrollment: 31, collection: 251000, completionRate: 84 },
  { month: "May", enrollment: 36, collection: 289000, completionRate: 88 },
  { month: "Jun", enrollment: 33, collection: 271000, completionRate: 86 },
];

export const programAnalytics: ProgramAnalyticsRow[] = [
  {
    name: "Certificate",
    enrollees: 24,
    collection: 178000,
    submissions: 11,
    retentionRate: 82,
    completionRate: 79,
    graduates: 7,
  },
  {
    name: "Bachelor",
    enrollees: 58,
    collection: 462000,
    submissions: 18,
    retentionRate: 88,
    completionRate: 84,
    graduates: 16,
  },
  {
    name: "Masteral",
    enrollees: 37,
    collection: 321000,
    submissions: 9,
    retentionRate: 91,
    completionRate: 87,
    graduates: 12,
  },
  {
    name: "Doctorate",
    enrollees: 19,
    collection: 214000,
    submissions: 6,
    retentionRate: 93,
    completionRate: 89,
    graduates: 5,
  },
];

export const operationalReports: OperationalReportRow[] = [
  {
    reportId: "POTSC-RPT-2026-0001",
    reportName: "Registrar Completion Report",
    program: "Bachelor",
    generatedOn: "2026-05-20",
    pendingItems: 5,
    collectionRate: 88,
    status: "Healthy",
  },
  {
    reportId: "POTSC-RPT-2026-0002",
    reportName: "Graduate Research Tracking Report",
    program: "Doctorate",
    generatedOn: "2026-05-18",
    pendingItems: 3,
    collectionRate: 92,
    status: "Healthy",
  },
  {
    reportId: "POTSC-RPT-2026-0003",
    reportName: "Enrollment Funnel Summary",
    program: "Certificate",
    generatedOn: "2026-05-17",
    pendingItems: 8,
    collectionRate: 74,
    status: "Watchlist",
  },
  {
    reportId: "POTSC-RPT-2026-0004",
    reportName: "Collections Exception Report",
    program: "Masteral",
    generatedOn: "2026-05-15",
    pendingItems: 11,
    collectionRate: 68,
    status: "Critical",
  },
  {
    reportId: "POTSC-RPT-2026-0005",
    reportName: "Academic Progress Snapshot",
    program: "Bachelor",
    generatedOn: "2026-05-12",
    pendingItems: 4,
    collectionRate: 86,
    status: "Healthy",
  },
];

export const performanceConfig = {
  enrollment: { label: "Enrollment", color: "#1f6a39" },
  collection: { label: "Collection", color: "#7cab7d" },
  completionRate: { label: "Completion Rate", color: "#d08a5a" },
} satisfies ChartConfig;

export const programConfig = {
  Certificate: { label: "Certificate", color: "#c8dabc" },
  Bachelor: { label: "Bachelor", color: "#1f6a39" },
  Masteral: { label: "Masteral", color: "#4d8b57" },
  Doctorate: { label: "Doctorate", color: "#7cab7d" },
} satisfies ChartConfig;
