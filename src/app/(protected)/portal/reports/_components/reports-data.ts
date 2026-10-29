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
  program: string;
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
