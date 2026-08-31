"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { OperationalReportRow, ReportStatus } from "./reports-data";

type ReportsSummaryTableProps = {
  data: OperationalReportRow[];
};

const statusVariantMap: Record<ReportStatus, "success" | "warning" | "error"> = {
  Healthy: "success",
  Watchlist: "warning",
  Critical: "error",
};

export const ReportsSummaryTable = ({ data }: ReportsSummaryTableProps) => (
  <Card className="border-border/70 shadow-sm">
    <CardHeader>
      <CardTitle>Operational Report Register</CardTitle>
      <CardDescription>
        Snapshot of generated reports, pending actions, and collection performance by unit.
      </CardDescription>
    </CardHeader>
    <CardContent className="overflow-x-auto">
      <table className="w-full min-w-180 text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase text-muted-foreground">
            <th className="px-3 py-3 font-medium">Report</th>
            <th className="px-3 py-3 font-medium">Program</th>
            <th className="px-3 py-3 font-medium">Generated On</th>
            <th className="px-3 py-3 font-medium">Pending Items</th>
            <th className="px-3 py-3 font-medium">Collection Rate</th>
            <th className="px-3 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.reportId} className="border-b last:border-b-0">
              <td className="px-3 py-4">
                <div className="font-medium">{item.reportName}</div>
                <div className="text-xs text-muted-foreground">{item.reportId}</div>
              </td>
              <td className="px-3 py-4">{item.program}</td>
              <td className="px-3 py-4">{item.generatedOn}</td>
              <td className="px-3 py-4">{item.pendingItems}</td>
              <td className="px-3 py-4">{item.collectionRate}%</td>
              <td className="px-3 py-4">
                <Badge variant={statusVariantMap[item.status]} className="rounded-full">
                  {item.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);
