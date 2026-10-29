"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CreditCard,
  Filter,
  Landmark,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  Trash2,
  WalletCards,
} from "lucide-react";
import type { Row } from "@tanstack/react-table";

import { GlobalDataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  toApiError,
  useSeminaryFeeConfigurationQuery,
  useSeminaryFeeCollectionsQuery,
  useUpdateSeminaryFeeCollectionPaymentMutation,
  useUpdateSeminaryFeeConfigurationMutation,
} from "@/features/seminary/seminary.hooks";
import { useToast } from "@/hooks/use-toast";
import type { SeminaryFeeCollectionAccount } from "@/features/seminary/seminary.types";

import { StatCard } from "../academics/classes/_components/stat-card";
import { CellActions } from "./_components/cell-actions";
import { columns, currency } from "./_components/columns";
import { FeeAccountDetailsDialog } from "./_components/fee-account-details-dialog";
import {
  chargeBreakdown,
  collectionProgramOptions,
  collectionStatusOptions,
  feeBreakdownsByProgram,
  type CollectionProgram,
  type CollectionStatus,
  type FeeBreakdownMatrix,
  type FeeCollectionRecord,
} from "./_components/fee-collection-data";

type StatusFilter = "ALL" | CollectionStatus;
type ProgramFilter = "ALL" | CollectionProgram;

const paymentMethodOptions = ["Cash", "GCash", "Bank Transfer", "Installment"];

const toFeeCollectionRecord = (
  account: SeminaryFeeCollectionAccount,
): FeeCollectionRecord => ({
  amountPaid: account.amountPaid,
  balance: account.balance,
  dueDate: account.dueDate.slice(0, 10),
  id: account.id,
  paymentMethod: account.paymentMethod as FeeCollectionRecord["paymentMethod"],
  program: account.program,
  programLevel: account.programLevelLabel as CollectionProgram,
  referenceNumber: account.referenceNumber,
  status: account.statusLabel as CollectionStatus,
  studentId: account.studentId,
  studentName: account.studentName,
  totalCharges: account.totalCharges,
});

const getBreakdownTotal = (items: { amount: number }[]) =>
  items.reduce((sum, item) => sum + item.amount, 0);

const cloneFeeBreakdowns = (
  breakdowns: FeeBreakdownMatrix,
): FeeBreakdownMatrix => ({
  Bachelor: breakdowns.Bachelor.map((item) => ({ ...item })),
  Certificate: breakdowns.Certificate.map((item) => ({ ...item })),
  Doctorate: breakdowns.Doctorate.map((item) => ({ ...item })),
  Masteral: breakdowns.Masteral.map((item) => ({ ...item })),
});

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("ALL");
  const [draftFeeBreakdowns, setDraftFeeBreakdowns] =
    useState<FeeBreakdownMatrix>(feeBreakdownsByProgram);
  const [feeSheetOpen, setFeeSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<FeeCollectionRecord | null>(null);
  const [paymentRecord, setPaymentRecord] =
    useState<FeeCollectionRecord | null>(null);
  const [paymentDraft, setPaymentDraft] = useState({
    amountPaid: 0,
    dueDate: "",
    paymentMethod: "Cash",
  });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const feeConfigurationQuery = useSeminaryFeeConfigurationQuery();
  const feeCollectionsQuery = useSeminaryFeeCollectionsQuery();
  const updateFeeConfigurationMutation =
    useUpdateSeminaryFeeConfigurationMutation();
  const updateFeeCollectionPaymentMutation =
    useUpdateSeminaryFeeCollectionPaymentMutation();
  const { toast } = useToast();
  const feeBreakdowns =
    feeConfigurationQuery.data?.data?.feeBreakdowns ?? feeBreakdownsByProgram;
  const records = useMemo(
    () => feeCollectionsQuery.data?.data.map(toFeeCollectionRecord) ?? [],
    [feeCollectionsQuery.data],
  );

  const recordsWithFees = records;

  const filteredRecords = useMemo(() => {
    return recordsWithFees.filter((record) => {
      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;
      const matchesProgram =
        programFilter === "ALL" || record.programLevel === programFilter;

      return matchesStatus && matchesProgram;
    });
  }, [programFilter, recordsWithFees, statusFilter]);

  const selectedBreakdown = selectedRecord
    ? feeBreakdowns[selectedRecord.programLevel]
    : chargeBreakdown;
  const totalAccounts = recordsWithFees.length;
  const collectedAmount = recordsWithFees.reduce(
    (sum, record) => sum + record.amountPaid,
    0,
  );
  const totalBalance = recordsWithFees.reduce(
    (sum, record) => sum + record.balance,
    0,
  );
  const partialPayments = recordsWithFees.filter(
    (record) => record.amountPaid > 0 && record.balance > 0,
  ).length;
  const activeProgramTotal =
    programFilter === "ALL"
      ? Math.max(
          ...collectionProgramOptions.map((program) =>
            getBreakdownTotal(feeBreakdowns[program]),
          ),
        )
      : getBreakdownTotal(feeBreakdowns[programFilter]);

  const openAccountDetails = (record: FeeCollectionRecord) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  const openPaymentSheet = (record: FeeCollectionRecord) => {
    setPaymentRecord(record);
    setPaymentDraft({
      amountPaid: record.amountPaid,
      dueDate: record.dueDate,
      paymentMethod: record.paymentMethod,
    });
    setPaymentSheetOpen(true);
  };

  const handleFeeAmountChange = (
    program: CollectionProgram,
    itemIndex: number,
    amount: number,
  ) => {
    setDraftFeeBreakdowns((current) => ({
      ...current,
      [program]: current[program].map((item, index) =>
        index === itemIndex ? { ...item, amount } : item,
      ),
    }));
  };

  const handleFeeLabelChange = (
    program: CollectionProgram,
    itemIndex: number,
    label: string,
  ) => {
    setDraftFeeBreakdowns((current) => ({
      ...current,
      [program]: current[program].map((item, index) =>
        index === itemIndex ? { ...item, label } : item,
      ),
    }));
  };

  const handleAddFeeCategory = (program: CollectionProgram) => {
    setDraftFeeBreakdowns((current) => ({
      ...current,
      [program]: [...current[program], { label: "New Fee", amount: 0 }],
    }));
  };

  const handleRemoveFeeCategory = (
    program: CollectionProgram,
    itemIndex: number,
  ) => {
    setDraftFeeBreakdowns((current) => ({
      ...current,
      [program]: current[program].filter((_, index) => index !== itemIndex),
    }));
  };

  const handleSaveFeeBreakdown = async () => {
    try {
      const response = await updateFeeConfigurationMutation.mutateAsync({
        feeBreakdowns: draftFeeBreakdowns,
      });
      setDraftFeeBreakdowns(cloneFeeBreakdowns(response.data.feeBreakdowns));
      setFeeSheetOpen(false);
      toast({
        variant: "success",
        title: "Fee breakdown saved",
        description: "Payment fee configuration was updated.",
      });
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Save failed",
        description:
          apiError.message ?? "Unable to update payment fee configuration.",
        variant: "error",
      });
    }
  };

  const handleResetFeeBreakdown = () => {
    setDraftFeeBreakdowns(feeBreakdownsByProgram);
  };

  const handleSavePaymentCollection = async () => {
    if (!paymentRecord?.id) {
      return;
    }

    try {
      await updateFeeCollectionPaymentMutation.mutateAsync({
        id: paymentRecord.id,
        payload: {
          amountPaid: paymentDraft.amountPaid,
          dueDate: paymentDraft.dueDate,
          paymentMethod: paymentDraft.paymentMethod,
        },
      });
      setPaymentSheetOpen(false);
      setPaymentRecord(null);
      toast({
        variant: "success",
        title: "Payment collection saved",
        description: `${paymentRecord.studentName} payment record was updated.`,
      });
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Payment update failed",
        description:
          apiError.message ?? "Unable to update payment collection.",
        variant: "error",
      });
    }
  };

  const renderCellActions = (row: Row<FeeCollectionRecord>) => (
    <CellActions
      data={row.original}
      onView={openAccountDetails}
      onCollectPayment={openPaymentSheet}
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
              Track student payment accounts, remaining balances, and
              partial-payment progress using the same seminary admin visual
              concept.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 xl:items-end">
            <Sheet open={feeSheetOpen} onOpenChange={setFeeSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  onClick={() => setDraftFeeBreakdowns(feeBreakdowns)}
                >
                  <Settings2 className="size-4" />
                  {feeConfigurationQuery.isLoading
                    ? "Loading Fees..."
                    : "Configure Fees"}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
                <SheetHeader className="border-b">
                  <SheetTitle>Configure Fee Breakdown</SheetTitle>
                  <SheetDescription>
                    Set standard charges per program level. Totals update
                    account balances.
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-5 px-4">
                  {collectionProgramOptions.map((program) => {
                    const programTotal = getBreakdownTotal(
                      draftFeeBreakdowns[program],
                    );

                    return (
                      <div
                        key={program}
                        className="rounded-lg border border-emerald-950/10 p-4 dark:border-emerald-100/10"
                      >
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold">{program}</h3>
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
                              {currency.format(programTotal)}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddFeeCategory(program)}
                            >
                              <Plus className="size-4" />
                              Add Category
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {draftFeeBreakdowns[program].map(
                            (item, itemIndex) => (
                              <div
                                key={`${program}-${itemIndex}`}
                                className="grid gap-2 sm:grid-cols-[1fr_180px_40px]"
                              >
                                <div className="space-y-1">
                                  <Label
                                    htmlFor={`${program}-${itemIndex}-label`}
                                  >
                                    Category
                                  </Label>
                                  <Input
                                    id={`${program}-${itemIndex}-label`}
                                    value={item.label}
                                    onChange={(event) =>
                                      handleFeeLabelChange(
                                        program,
                                        itemIndex,
                                        event.target.value,
                                      )
                                    }
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label
                                    htmlFor={`${program}-${itemIndex}-amount`}
                                  >
                                    Amount
                                  </Label>
                                  <Input
                                    id={`${program}-${itemIndex}-amount`}
                                    type="number"
                                    min={0}
                                    step={100}
                                    value={item.amount}
                                    onChange={(event) =>
                                      handleFeeAmountChange(
                                        program,
                                        itemIndex,
                                        Number(event.target.value),
                                      )
                                    }
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="self-end text-destructive hover:text-destructive"
                                  disabled={
                                    draftFeeBreakdowns[program].length === 1
                                  }
                                  aria-label={`Remove ${item.label}`}
                                  onClick={() =>
                                    handleRemoveFeeCategory(program, itemIndex)
                                  }
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <SheetFooter className="border-t">
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetFeeBreakdown}
                    >
                      <RotateCcw className="size-4" />
                      Reset Defaults
                    </Button>
                    <Button
                      type="button"
                      disabled={updateFeeConfigurationMutation.isPending}
                      onClick={() => {
                        void handleSaveFeeBreakdown();
                      }}
                    >
                      <Save className="size-4" />
                      {updateFeeConfigurationMutation.isPending
                        ? "Saving..."
                        : "Save Breakdown"}
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Fee Accounts"
            value={totalAccounts}
            description="Students with charges"
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
                  Review balances, payment methods, and collection progress in
                  the same system language as the other seminary modules.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-emerald-50/85 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Full Charge
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {currency.format(activeProgramTotal)}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Partial
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {partialPayments}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 pt-0!">
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
                      {collectionProgramOptions.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
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
        breakdown={selectedBreakdown}
      />
      <Sheet open={paymentSheetOpen} onOpenChange={setPaymentSheetOpen}>
        <SheetContent className="w-full max-w-md!">
          <SheetHeader className="border-b">
            <SheetTitle>Update Payment Collection</SheetTitle>
            <SheetDescription>
              {paymentRecord
                ? `${paymentRecord.studentName} | ${paymentRecord.referenceNumber}`
                : "Update student payment account."}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4">
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Charges</span>
                <span className="font-semibold">
                  {currency.format(paymentRecord?.totalCharges ?? 0)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Remaining Balance</span>
                <span className="font-semibold text-amber-700">
                  {currency.format(
                    Math.max(
                      (paymentRecord?.totalCharges ?? 0) -
                        paymentDraft.amountPaid,
                      0,
                    ),
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="payment-amount-paid">Amount Paid</Label>
              <Input
                id="payment-amount-paid"
                type="number"
                min={0}
                step={100}
                value={paymentDraft.amountPaid}
                onChange={(event) =>
                  setPaymentDraft((current) => ({
                    ...current,
                    amountPaid: Number(event.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select
                value={paymentDraft.paymentMethod}
                onValueChange={(value) =>
                  setPaymentDraft((current) => ({
                    ...current,
                    paymentMethod: value,
                  }))
                }
              >
                <SelectTrigger className="w-full" id="payment-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="payment-due-date">Due Date</Label>
              <Input
                id="payment-due-date"
                type="date"
                value={paymentDraft.dueDate}
                onChange={(event) =>
                  setPaymentDraft((current) => ({
                    ...current,
                    dueDate: event.target.value,
                  }))
                }
              />
            </div>

            <p className="rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Payment status is calculated automatically from the recorded amount
              and remaining balance.
            </p>
          </div>

          <SheetFooter className="border-t">
            <Button
              type="button"
              disabled={updateFeeCollectionPaymentMutation.isPending}
              onClick={() => {
                void handleSavePaymentCollection();
              }}
            >
              <Save className="size-4" />
              {updateFeeCollectionPaymentMutation.isPending
                ? "Saving..."
                : "Save Payment"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Page;
