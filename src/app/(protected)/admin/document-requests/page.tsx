"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ClipboardList,
  FileStack,
  Filter,
  ShieldCheck,
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
  documentRequestRecords,
  documentStatusOptions,
  requestProgramOptions,
  requestedDocumentOptions,
  type DocumentRequestRecord,
  type DocumentRequestStatus,
  type RequestProgram,
  type RequestedDocument,
} from "./_components/document-request-data";
import { DocumentRequestDetailsDialog } from "./_components/document-request-details-dialog";

type StatusFilter = "ALL" | DocumentRequestStatus;
type ProgramFilter = "ALL" | RequestProgram;
type DocumentFilter = "ALL" | RequestedDocument;

const statusFlow: DocumentRequestStatus[] = [
  "Pending",
  "Processing",
  "Ready for Release",
  "Released",
];

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("ALL");
  const [documentFilter, setDocumentFilter] = useState<DocumentFilter>("ALL");
  const [records, setRecords] = useState<DocumentRequestRecord[]>(
    documentRequestRecords,
  );
  const [selectedRecord, setSelectedRecord] =
    useState<DocumentRequestRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;
      const matchesProgram =
        programFilter === "ALL" || record.studentProgramLevel === programFilter;
      const matchesDocument =
        documentFilter === "ALL" || record.requestedDocument === documentFilter;

      return matchesStatus && matchesProgram && matchesDocument;
    });
  }, [documentFilter, programFilter, records, statusFilter]);

  const totalRequests = records.length;
  const processingCount = records.filter(
    (record) => record.status === "Processing",
  ).length;
  const readyCount = records.filter(
    (record) => record.status === "Ready for Release",
  ).length;
  const releasedCount = records.filter(
    (record) => record.status === "Released",
  ).length;

  const openRequestDetails = (record: DocumentRequestRecord) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  const handleAdvanceStatus = (target: DocumentRequestRecord) => {
    setRecords((current) =>
      current.map((record) => {
        if (record.referenceNumber !== target.referenceNumber) return record;
        const currentIndex = statusFlow.indexOf(record.status);
        const nextStatus =
          currentIndex >= 0 && currentIndex < statusFlow.length - 1
            ? statusFlow[currentIndex + 1]
            : statusFlow[statusFlow.length - 1];

        return { ...record, status: nextStatus };
      }),
    );
  };

  const renderCellActions = (row: Row<DocumentRequestRecord>) => (
    <CellActions
      data={row.original}
      onView={openRequestDetails}
      onAdvanceStatus={handleAdvanceStatus}
    />
  );

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
              Document Requests
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Manage student document requests, release readiness, and registrar
              fulfillment status in the same seminary admin style.
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
                <BreadcrumbPage>Administration</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Document Requests</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={totalRequests}
            description="All active document requests"
            icon={<ClipboardList className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Processing"
            value={processingCount}
            description="Currently in registrar workflow"
            icon={<FileStack className="size-6" />}
            accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
          />
          <StatCard
            title="Ready for Release"
            value={readyCount}
            description="Prepared for dispatch"
            icon={<ShieldCheck className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Released"
            value={releasedCount}
            description="Successfully fulfilled"
            icon={<BadgeCheck className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="overflow-hidden pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
          <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">
                  Document Fulfillment Directory
                </h2>
                <p className="text-sm text-emerald-50/80">
                  Track transcripts, certifications, and release progress while
                  keeping the experience visually consistent with the seminary.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-emerald-50/85 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Transcript
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      records.filter(
                        (record) =>
                          record.requestedDocument === "Transcript of Records",
                      ).length
                    }
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Graduate
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      records.filter((record) =>
                        ["Masteral", "Doctorate"].includes(
                          record.studentProgramLevel,
                        ),
                      ).length
                    }
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Pickup
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {
                      records.filter(
                        (record) => record.deliveryMethod === "Pickup",
                      ).length
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
              exportFileName="document-requests"
              filterPlaceholder="Search requester, document, email, or reference number..."
              emptyMessage="No document requests found."
              pageSizeOptions={[8, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={programFilter}
                    onValueChange={(value) =>
                      setProgramFilter(value as ProgramFilter)
                    }
                  >
                    <SelectTrigger className="min-w-40">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Programs" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Programs</SelectItem>
                      {requestProgramOptions.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={documentFilter}
                    onValueChange={(value) =>
                      setDocumentFilter(value as DocumentFilter)
                    }
                  >
                    <SelectTrigger className="min-w-52">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Documents" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Documents</SelectItem>
                      {requestedDocumentOptions.map((document) => (
                        <SelectItem key={document} value={document}>
                          {document}
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
                    <SelectTrigger className="min-w-44">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      {documentStatusOptions.map((status) => (
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

      <DocumentRequestDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        record={selectedRecord}
      />
    </>
  );
};

export default Page;
