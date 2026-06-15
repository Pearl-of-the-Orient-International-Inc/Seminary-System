"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Filter,
  PauseCircle,
  Plus,
  UsersRound,
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

import { CellActions } from "./_components/cell-actions";
import { ClassDialog, type ClassDialogValues } from "./_components/class-dialog";
import {
  classAcademicYearOptions,
  columns,
  type ClassAcademicYear,
  type ClassRecord,
  type ClassStatus,
} from "./_components/columns";
import { StatCard } from "./_components/stat-card";

type StatusFilter = "ALL" | ClassStatus;
type AcademicYearFilter = "ALL" | ClassAcademicYear;

const initialClassData: ClassRecord[] = [
  {
    id: "1",
    order: 1,
    className: "Propedeutic Formation",
    classCode: "PF-01",
    academicYear: "2024-2025",
    totalSections: 2,
    status: "Active",
  },
  {
    id: "2",
    order: 2,
    className: "First Year Theology",
    classCode: "TH-1",
    academicYear: "2024-2025",
    totalSections: 2,
    status: "Active",
  },
  {
    id: "3",
    order: 3,
    className: "Second Year Theology",
    classCode: "TH-2",
    academicYear: "2024-2025",
    totalSections: 2,
    status: "Active",
  },
  {
    id: "4",
    order: 4,
    className: "Third Year Theology",
    classCode: "TH-3",
    academicYear: "2024-2025",
    totalSections: 2,
    status: "Active",
  },
  {
    id: "5",
    order: 5,
    className: "Fourth Year Theology",
    classCode: "TH-4",
    academicYear: "2024-2025",
    totalSections: 2,
    status: "Active",
  },
  {
    id: "6",
    order: 6,
    className: "Pastoral Internship Cohort",
    classCode: "PIC-1",
    academicYear: "2024-2025",
    totalSections: 1,
    status: "Active",
  },
  {
    id: "7",
    order: 7,
    className: "Biblical Languages Intensive",
    classCode: "BLI-1",
    academicYear: "2024-2025",
    totalSections: 1,
    status: "Active",
  },
  {
    id: "8",
    order: 8,
    className: "Lay Ministry Certificate",
    classCode: "LMC-1",
    academicYear: "2024-2025",
    totalSections: 1,
    status: "Inactive",
  },
  {
    id: "9",
    order: 9,
    className: "Spiritual Formation Group A",
    classCode: "SFG-A",
    academicYear: "2025-2026",
    totalSections: 1,
    status: "Active",
  },
  {
    id: "10",
    order: 10,
    className: "Spiritual Formation Group B",
    classCode: "SFG-B",
    academicYear: "2025-2026",
    totalSections: 1,
    status: "Active",
  },
  {
    id: "11",
    order: 11,
    className: "Master of Divinity Year I",
    classCode: "MDIV-1",
    academicYear: "2025-2026",
    totalSections: 2,
    status: "Active",
  },
  {
    id: "12",
    order: 12,
    className: "Master of Divinity Year II",
    classCode: "MDIV-2",
    academicYear: "2025-2026",
    totalSections: 2,
    status: "Active",
  },
  {
    id: "13",
    order: 13,
    className: "Summer Greek Tutorial",
    classCode: "SGT-1",
    academicYear: "2025-2026",
    totalSections: 1,
    status: "Inactive",
  },
  {
    id: "14",
    order: 14,
    className: "Catechetical Ministry Track",
    classCode: "CMT-1",
    academicYear: "2026-2027",
    totalSections: 1,
    status: "Active",
  },
  {
    id: "15",
    order: 15,
    className: "Pastoral Leadership Seminar",
    classCode: "PLS-1",
    academicYear: "2026-2027",
    totalSections: 1,
    status: "Active",
  },
  {
    id: "16",
    order: 16,
    className: "Church History Colloquium",
    classCode: "CHC-1",
    academicYear: "2026-2027",
    totalSections: 1,
    status: "Inactive",
  },
  {
    id: "17",
    order: 17,
    className: "Homiletics Practicum",
    classCode: "HOM-P",
    academicYear: "2026-2027",
    totalSections: 1,
    status: "Active",
  },
  {
    id: "18",
    order: 18,
    className: "Community Apostolate Group",
    classCode: "CAG-1",
    academicYear: "2026-2027",
    totalSections: 1,
    status: "Active",
  },
];

const normalizeRecords = (records: ClassRecord[]) =>
  records.map((record, index) => ({
    ...record,
    order: index + 1,
  }));

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [academicYearFilter, setAcademicYearFilter] =
    useState<AcademicYearFilter>("ALL");
  const [classes, setClasses] = useState<ClassRecord[]>(initialClassData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ClassRecord | null>(null);

  const filteredData = useMemo(() => {
    return classes.filter((record) => {
      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;
      const matchesAcademicYear =
        academicYearFilter === "ALL" || record.academicYear === academicYearFilter;

      return matchesStatus && matchesAcademicYear;
    });
  }, [academicYearFilter, classes, statusFilter]);

  const totalClasses = classes.length;
  const activeClasses = classes.filter((record) => record.status === "Active").length;
  const inactiveClasses = classes.filter(
    (record) => record.status === "Inactive",
  ).length;
  const totalSections = classes.reduce(
    (sum, record) => sum + record.totalSections,
    0,
  );

  const handleCreate = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };

  const handleEdit = (record: ClassRecord) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleDelete = (record: ClassRecord) => {
    setClasses((current) =>
      normalizeRecords(current.filter((item) => item.id !== record.id)),
    );
  };

  const handleDialogSubmit = (values: ClassDialogValues) => {
    const payload: Pick<
      ClassRecord,
      "className" | "classCode" | "academicYear" | "totalSections" | "status"
    > = {
      className: values.className,
      classCode: values.classCode,
      academicYear: values.academicYear,
      totalSections: values.totalSections,
      status: values.status,
    };

    if (selectedRecord) {
      setClasses((current) =>
        current.map((item) =>
          item.id === selectedRecord.id ? { ...item, ...payload } : item,
        ),
      );
      return;
    }

    setClasses((current) =>
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

  const renderCellActions = (row: Row<ClassRecord>) => (
    <CellActions
      data={row.original}
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
              Classes
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
                <BreadcrumbPage>Academic</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Classes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Classes"
            value={totalClasses}
            description="All time"
            icon={<UsersRound className="size-6" />}
            accentClassName="bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"
          />
          <StatCard
            title="Active Classes"
            value={activeClasses}
            description="Currently active"
            icon={<CheckCircle2 className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Inactive Classes"
            value={inactiveClasses}
            description="Currently inactive"
            icon={<PauseCircle className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Total Sections"
            value={totalSections}
            description="Across all classes"
            icon={<Building2 className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardContent>
            <GlobalDataTable
              columns={columns}
              data={filteredData}
              cellAction={renderCellActions}
              exportFileName="classes"
              filterPlaceholder="Search classes..."
              emptyMessage="No classes found."
              pageSizeOptions={[8, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={academicYearFilter}
                    onValueChange={(value) =>
                      setAcademicYearFilter(value as AcademicYearFilter)
                    }
                  >
                    <SelectTrigger className="min-w-52">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Academic Years" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Academic Years</SelectItem>
                      {classAcademicYearOptions.map((academicYear) => (
                        <SelectItem key={academicYear} value={academicYear}>
                          {academicYear}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleCreate}>
                    <Plus className="size-4" />
                    Add Class
                  </Button>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <ClassDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDialogSubmit}
        record={selectedRecord}
      />
    </>
  );
};

export default Page;
