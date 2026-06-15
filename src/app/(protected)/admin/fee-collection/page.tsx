"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  Filter,
  Landmark,
  WalletCards,
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
import { columns, currency } from "./_components/columns";
import { FeeAccountDetailsDialog } from "./_components/fee-account-details-dialog";
import {
  chargeBreakdown,
  collectionProgramOptions,
  collectionStatusOptions,
  feeCollectionRecords,
  totalChargeAmount,
  type CollectionProgram,
  type CollectionStatus,
  type FeeCollectionRecord,
} from "./_components/fee-collection-data";

type StatusFilter = "ALL" | CollectionStatus;
type ProgramFilter = "ALL" | CollectionProgram;

const statusFlow: CollectionStatus[] = ["Pending", "Partially Paid", "Paid"];

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("ALL");
  const [records, setRecords] = useState<FeeCollectionRecord[]>(feeCollectionRecords);
  const [selectedRecord, setSelectedRecord] = useState<FeeCollectionRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;
      const matchesProgram =
        programFilter === "ALL" || record.programLevel === programFilter;

      return matchesStatus && matchesProgram;
    });
  }, [programFilter, records, statusFilter]);

  const totalAccounts = records.length;
  const collectedAmount = records.reduce((sum, record) => sum + record.amountPaid, 0);
  const totalBalance = records.reduce((sum, record) => sum + record.balance, 0);
  const partialPayments = records.filter(
    (record) => record.amountPaid > 0 && record.balance > 0,
  ).length;

  const openAccountDetails = (record: FeeCollectionRecord) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  const handleAdvanceStatus = (target: FeeCollectionRecord) => {
    setRecords((current) =>
      current.map((record) => {
        if (record.referenceNumber !== target.referenceNumber) return record;
        if (record.status === "Overdue") {
          return { ...record, status: "Partially Paid" };
        }

        const currentIndex = statusFlow.indexOf(record.status);
        const nextStatus =
          currentIndex >= 0 && currentIndex < statusFlow.length - 1
            ? statusFlow[currentIndex + 1]
            : statusFlow[statusFlow.length - 1];

        return { ...record, status: nextStatus };
      }),
    );
  };

  const renderCellActions = (row: Row<FeeCollectionRecord>) => (
    <CellActions
      data={row.original}
      onView={openAccountDetails}
      onAdvanceStatus={handleAdvanceStatus}
    />
  );

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
              Fee Collection
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Track student payment accounts, remaining balances, and partial-payment
              progress using the same seminary admin visual concept.
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
                <BreadcrumbPage>Fee Collection</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Fee Accounts"
            value={totalAccounts}
            description="Students with posted charges"
            icon={<WalletCards className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Collected"
            value={currency.format(collectedAmount)}
            description={currency.format(collectedAmount)}
            icon={<CreditCard className="size-6" />}
            accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
          />
          <StatCard
            title="Outstanding"
            value={currency.format(totalBalance)}
            description={currency.format(totalBalance)}
            icon={<Landmark className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="Partial Payments"
            value={partialPayments}
            description="Running balances"
            icon={<BadgeCheck className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="overflow-hidden pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
          <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">
                  Collection Directory
                </h2>
                <p className="text-sm text-emerald-50/80">
                  Review balances, payment methods, and collection progress in the
                  same system language as the other seminary modules.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-emerald-50/85 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Full Charge
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {currency.format(totalChargeAmount)}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Partial
                  </div>
                  <div className="mt-1 text-xl font-semibold">{partialPayments}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Overdue
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {records.filter((record) => record.status === "Overdue").length}
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
              exportFileName="fee-collection"
              filterPlaceholder="Search student, program, reference, or payment method..."
              emptyMessage="No fee collection records found."
              pageSizeOptions={[8, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={programFilter}
                    onValueChange={(value) => setProgramFilter(value as ProgramFilter)}
                  >
                    <SelectTrigger className="min-w-40">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Programs" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Programs</SelectItem>
                      {collectionProgramOptions.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                  >
                    <SelectTrigger className="min-w-44">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      {collectionStatusOptions.map((status) => (
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

      <FeeAccountDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        record={selectedRecord}
        breakdown={chargeBreakdown}
      />
    </>
  );
};

export default Page;
