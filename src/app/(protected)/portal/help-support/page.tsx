"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, BadgeCheck, LifeBuoy, ShieldAlert } from "lucide-react";
import type { Row } from "@tanstack/react-table";

import { GlobalDataTable } from "@/components/DataTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StatCard } from "../academics/classes/_components/stat-card";
import { CellActions } from "./_components/cell-actions";
import { columns } from "./_components/columns";
import {
  supportCategoryOptions,
  supportPriorityOptions,
  supportStatusOptions,
  supportTickets,
  type SupportCategory,
  type SupportPriority,
  type SupportTicket,
  type SupportTicketStatus,
} from "./_components/support-data";
import { TicketDetailsDialog } from "./_components/ticket-details-dialog";

type StatusFilter = "ALL" | SupportTicketStatus;
type CategoryFilter = "ALL" | SupportCategory;
type PriorityFilter = "ALL" | SupportPriority;

const statusFlow: SupportTicketStatus[] = [
  "Open",
  "In Progress",
  "Escalated",
  "Resolved",
];

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [records, setRecords] = useState<SupportTicket[]>(supportTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;
      const matchesCategory =
        categoryFilter === "ALL" || record.category === categoryFilter;
      const matchesPriority =
        priorityFilter === "ALL" || record.priority === priorityFilter;

      return matchesStatus && matchesCategory && matchesPriority;
    });
  }, [categoryFilter, priorityFilter, records, statusFilter]);

  const totalTickets = records.length;
  const openIssues = records.filter(
    (record) => record.status === "Open",
  ).length;
  const activeWork = records.filter(
    (record) => record.status === "In Progress",
  ).length;
  const urgentIssues = records.filter(
    (record) => record.priority === "Urgent" || record.status === "Escalated",
  ).length;

  const openTicketDetails = (record: SupportTicket) => {
    setSelectedTicket(record);
    setDetailsOpen(true);
  };

  const handleAdvanceStatus = (target: SupportTicket) => {
    setRecords((current) =>
      current.map((record) => {
        if (record.ticketNumber !== target.ticketNumber) return record;

        const currentIndex = statusFlow.indexOf(record.status);
        const nextStatus =
          currentIndex >= 0 && currentIndex < statusFlow.length - 1
            ? statusFlow[currentIndex + 1]
            : statusFlow[statusFlow.length - 1];

        return {
          ...record,
          status: nextStatus,
          lastUpdated: "2026-05-21 04:20 PM",
        };
      }),
    );
  };

  const renderCellActions = (row: Row<SupportTicket>) => (
    <CellActions
      data={row.original}
      onAdvanceStatus={handleAdvanceStatus}
      onView={openTicketDetails}
    />
  );

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
              Help &amp; Support
            </h1>
            <p className="text-sm max-w-2xl leading-6 text-muted-foreground">
              Monitor tickets and issues raised by students, faculty, and staff
              while keeping support operations aligned with the seminary admin
              experience.
            </p>
          </div>

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
                <BreadcrumbPage>Help &amp; Support</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Tickets Raised"
            value={totalTickets}
            description="All logged support concerns"
            icon={<LifeBuoy className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Open Issues"
            value={openIssues}
            description="Awaiting first resolution step"
            icon={<AlertTriangle className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="In Progress"
            value={activeWork}
            description="Active IT handling"
            icon={<BadgeCheck className="size-6" />}
            accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
          />
          <StatCard
            title="Urgent / Escalated"
            value={urgentIssues}
            description="High-priority concerns"
            icon={<ShieldAlert className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="overflow-hidden pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
          <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">
                  Support Ticket Registry
                </h2>
                <p className="text-sm text-emerald-50/80">
                  Review submitted issues, identify priority concerns, and
                  advance ticket handling from open to resolved.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-emerald-50/85 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Accounts
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      records.filter((record) => record.category === "Accounts")
                        .length
                    }
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Academic
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      records.filter((record) =>
                        ["Enrollment", "Grades", "LMS"].includes(
                          record.category,
                        ),
                      ).length
                    }
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Resolved
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      records.filter((record) => record.status === "Resolved")
                        .length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <GlobalDataTable
              columns={columns}
              data={filteredRecords}
              cellAction={renderCellActions}
              exportFileName="support-tickets"
              filterPlaceholder="Search ticket number, requester, subject, category, or assignee..."
              emptyMessage="No support tickets found."
              pageSizeOptions={[8, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) =>
                      setCategoryFilter(value as CategoryFilter)
                    }
                  >
                    <SelectTrigger className="min-w-40">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Categories</SelectItem>
                      {supportCategoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={priorityFilter}
                    onValueChange={(value) =>
                      setPriorityFilter(value as PriorityFilter)
                    }
                  >
                    <SelectTrigger className="min-w-36">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Priorities</SelectItem>
                      {supportPriorityOptions.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as StatusFilter)
                    }
                  >
                    <SelectTrigger className="min-w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      {supportStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <TicketDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        ticket={selectedTicket}
      />
    </>
  );
};

export default Page;
