"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Plus,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AcademicYearDialog, type AcademicYearDialogValues } from "./_components/academic-year-dialog";
import { CellActions } from "./_components/cell-actions";
import {
  columns,
  type AcademicYearRecord,
  type AcademicYearSession,
  type AcademicYearStatus,
} from "./_components/columns";
import { StatCard } from "./_components/stat-card";

type StatusFilter = "ALL" | AcademicYearStatus;

const initialAcademicYearData: AcademicYearRecord[] = [
  {
    id: "1",
    order: 1,
    academicYear: "2024-2025",
    session: "Current",
    status: "Active",
    startDate: "01 Apr 2024",
    endDate: "31 Mar 2025",
  },
  {
    id: "2",
    order: 2,
    academicYear: "2023-2024",
    session: "Previous",
    status: "Active",
    startDate: "01 Apr 2023",
    endDate: "31 Mar 2024",
  },
  {
    id: "3",
    order: 3,
    academicYear: "2022-2023",
    session: "Previous",
    status: "Completed",
    startDate: "01 Apr 2022",
    endDate: "31 Mar 2023",
  },
  {
    id: "4",
    order: 4,
    academicYear: "2021-2022",
    session: "Previous",
    status: "Completed",
    startDate: "01 Apr 2021",
    endDate: "31 Mar 2022",
  },
  {
    id: "5",
    order: 5,
    academicYear: "2020-2021",
    session: "Previous",
    status: "Completed",
    startDate: "01 Apr 2020",
    endDate: "31 Mar 2021",
  },
  {
    id: "6",
    order: 6,
    academicYear: "2025-2026",
    session: "Upcoming",
    status: "Upcoming",
    startDate: "01 Apr 2025",
    endDate: "31 Mar 2026",
  },
];

const formatDate = (value: Date) => {
  const date = new Date(value);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeRecords = (records: AcademicYearRecord[]) =>
  records.map((record, index) => ({
    ...record,
    order: index + 1,
  }));

export const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [academicYears, setAcademicYears] = useState<AcademicYearRecord[]>(
    initialAcademicYearData,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AcademicYearRecord | null>(null);

  const filteredData = useMemo(() => {
    if (statusFilter === "ALL") {
      return academicYears;
    }

    return academicYears.filter((record) => record.status === statusFilter);
  }, [academicYears, statusFilter]);

  const totalAcademicYears = academicYears.length;
  const activeAcademicYears = academicYears.filter(
    (record) => record.status === "Active",
  ).length;
  const upcomingAcademicYears = academicYears.filter(
    (record) => record.status === "Upcoming",
  ).length;
  const completedAcademicYears = academicYears.filter(
    (record) => record.status === "Completed",
  ).length;

  const handleCreate = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };

  const handleEdit = (record: AcademicYearRecord) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleDelete = (record: AcademicYearRecord) => {
    setAcademicYears((current) =>
      normalizeRecords(current.filter((item) => item.id !== record.id)),
    );
  };

  const handleChangeSession = (
    record: AcademicYearRecord,
    session: AcademicYearSession,
  ) => {
    setAcademicYears((current) =>
      current.map((item) =>
        item.id === record.id ? { ...item, session } : item,
      ),
    );
  };

  const handleChangeStatus = (
    record: AcademicYearRecord,
    status: AcademicYearStatus,
  ) => {
    setAcademicYears((current) =>
      current.map((item) =>
        item.id === record.id ? { ...item, status } : item,
      ),
    );
  };

  const handleDialogSubmit = (values: AcademicYearDialogValues) => {
    const payload: Pick<
      AcademicYearRecord,
      "academicYear" | "session" | "status" | "startDate" | "endDate"
    > = {
      academicYear: values.academicYear,
      session: values.session,
      status: values.status,
      startDate: formatDate(values.startDate),
      endDate: formatDate(values.endDate),
    };

    if (selectedRecord) {
      setAcademicYears((current) =>
        current.map((item) =>
          item.id === selectedRecord.id ? { ...item, ...payload } : item,
        ),
      );
      return;
    }

    setAcademicYears((current) =>
      normalizeRecords([
        ...current,
        {
          id: crypto.randomUUID(),
          order: current.length + 1,
          ...payload,
        },
      ]),
    );
  };

  const renderCellActions = (row: Row<AcademicYearRecord>) => (
    <CellActions
      data={row.original}
      onChangeSession={handleChangeSession}
      onChangeStatus={handleChangeStatus}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
              Academic Years
            </h1>
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
                <BreadcrumbPage>Academic Years</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Academic Years"
            value={totalAcademicYears}
            description="All time"
            icon={<CalendarDays className="size-6" />}
            accentClassName="bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"
          />
          <StatCard
            title="Active Academic Years"
            value={activeAcademicYears}
            description="Currently active"
            icon={<CheckCircle2 className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Upcoming Years"
            value={upcomingAcademicYears}
            description="Starting in future"
            icon={<Clock3 className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Completed Years"
            value={completedAcademicYears}
            description="Completed"
            icon={<BookOpenCheck className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardContent>
            <GlobalDataTable
              columns={columns}
              data={filteredData}
              cellAction={renderCellActions}
              exportFileName="academic-years"
              filterPlaceholder="Search academic years..."
              emptyMessage="No academic years found."
              pageSizeOptions={[6, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                  >
                    <SelectTrigger className="min-w-40">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleCreate}>
                    <Plus className="size-4" />
                    Add Academic Year
                  </Button>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <AcademicYearDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDialogSubmit}
        record={selectedRecord}
      />
    </>
  );
};

export default Page;
