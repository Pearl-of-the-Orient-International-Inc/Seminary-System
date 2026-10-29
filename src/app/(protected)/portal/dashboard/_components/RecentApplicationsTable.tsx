"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SeminaryDashboardData } from "@/features/seminary/seminary.types";

type RecentApplicationsTableProps = {
  applications: SeminaryDashboardData["recentApplications"];
};

export const RecentApplicationsTable = ({
  applications,
}: RecentApplicationsTableProps) => {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Enrollment Applications</CardTitle>
        <CardDescription>
          Latest seminary applicant records within the selected date range.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Student</th>
                <th className="px-6 py-3 font-medium">Program</th>
                <th className="px-6 py-3 font-medium">Level</th>
                <th className="px-6 py-3 font-medium">Application Type</th>
                <th className="px-6 py-3 font-medium">Enrollment Status</th>
                <th className="px-6 py-3 font-medium">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.length ? (
                applications.map((item) => (
                  <tr key={item.id} className="border-t border-border/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#dce7d9] text-sm font-semibold text-[#406247] dark:bg-[#243528] dark:text-[#dce7dd]">
                          {item.student
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium">{item.student}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.studentId ?? item.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-medium">{item.program}</p>
                        <p className="text-xs text-muted-foreground">
                          Seminary degree application
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[#f3f5ef] px-3 py-1 text-xs font-medium text-[#4b6150] dark:bg-[#26362b] dark:text-[#d6e4d8]">
                        {item.programLevel?.replaceAll("_", " ") ?? "Not specified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.applicationType.replaceAll("_", " ")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[#eef3ec] px-3 py-1 text-xs font-medium text-[#255e31] dark:bg-[#223129] dark:text-[#dce7dd]">
                        {item.enrollmentStatus.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.paymentStatus.replaceAll("_", " ")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    No applications found within the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
