"use client";

import { useMemo, useState } from "react";
import {
  FileCheck2,
  FileClock,
  PackageCheck,
  Plus,
  Settings2,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  toApiError,
  useCreateSeminaryDocumentRequestTypeMutation,
  useSeminaryDocumentRequestTypesQuery,
  useSeminaryDocumentRequestsQuery,
  useUpdateSeminaryDocumentRequestStatusMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryDocumentPaymentStatus,
  SeminaryDocumentRequest,
  SeminaryDocumentRequestStatus,
} from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

const statusLabel = (status: string) => status.replaceAll("_", " ");
const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(
    new Date(value),
  );
const money = (value: number | string | null) =>
  value === null
    ? "No fee"
    : `₱${Number(value).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
const studentName = (request: SeminaryDocumentRequest) =>
  [
    request.studentApplication.givenName,
    request.studentApplication.middleName,
    request.studentApplication.surname,
  ]
    .filter(Boolean)
    .join(" ") || "Student";

const nextStatus: Partial<
  Record<SeminaryDocumentRequestStatus, SeminaryDocumentRequestStatus[]>
> = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["PROCESSING"],
  PROCESSING: ["READY_FOR_RELEASE"],
  READY_FOR_RELEASE: ["RELEASED"],
};

export default function DocumentRequestsPage() {
  const { toast } = useToast();
  const requestsQuery = useSeminaryDocumentRequestsQuery();
  const typesQuery = useSeminaryDocumentRequestTypesQuery({
    includeInactive: true,
  });
  const update = useUpdateSeminaryDocumentRequestStatusMutation();
  const createType = useCreateSeminaryDocumentRequestTypeMutation();
  const [selected, setSelected] = useState<SeminaryDocumentRequest | null>(
    null,
  );
  const [status, setStatus] =
    useState<SeminaryDocumentRequestStatus>("PENDING");
  const [paymentStatus, setPaymentStatus] =
    useState<SeminaryDocumentPaymentStatus>("NOT_APPLICABLE");
  const [reviewRemarks, setReviewRemarks] = useState("");
  const [releaseReference, setReleaseReference] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [typesOpen, setTypesOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDescription, setNewTypeDescription] = useState("");
  const [newTypeFee, setNewTypeFee] = useState("");
  const [requiresSupportingDetails, setRequiresSupportingDetails] =
    useState(false);
  const requests = useMemo(
    () => requestsQuery.data?.data ?? [],
    [requestsQuery.data?.data],
  );
  const counts = useMemo(
    () => ({
      pending: requests.filter((request) => request.status === "PENDING")
        .length,
      processing: requests.filter((request) =>
        ["APPROVED", "PROCESSING"].includes(request.status),
      ).length,
      ready: requests.filter(
        (request) => request.status === "READY_FOR_RELEASE",
      ).length,
      released: requests.filter((request) => request.status === "RELEASED")
        .length,
    }),
    [requests],
  );
  const open = (request: SeminaryDocumentRequest) => {
    setSelected(request);
    setStatus(request.status);
    setPaymentStatus(request.paymentStatus);
    setReviewRemarks(request.reviewRemarks ?? "");
    setReleaseReference(request.releaseReference ?? "");
    setReceivedBy(request.receivedBy ?? "");
  };
  const save = async () => {
    if (!selected) return;
    try {
      await update.mutateAsync({
        id: selected.id,
        payload: {
          status,
          paymentStatus,
          reviewRemarks: reviewRemarks || undefined,
          releaseReference: releaseReference || undefined,
          receivedBy: receivedBy || undefined,
        },
      });
      toast({ title: "Document request updated", variant: "success" });
      setSelected(null);
    } catch (error) {
      toast({
        title: "Update failed",
        description: toApiError(error).message,
        variant: "error",
      });
    }
  };
  const addType = async () => {
    if (!newTypeName.trim()) return;
    try {
      await createType.mutateAsync({
        name: newTypeName.trim(),
        description: newTypeDescription || null,
        fee: newTypeFee ? Number(newTypeFee) : null,
        requiresSupportingDetails,
        isActive: true,
        sortOrder: typesQuery.data?.data.length ?? 0,
      });
      setNewTypeName("");
      setNewTypeDescription("");
      setNewTypeFee("");
      setRequiresSupportingDetails(false);
      toast({ title: "Document type added", variant: "success" });
    } catch (error) {
      toast({
        title: "Document type not added",
        description: toApiError(error).message,
        variant: "error",
      });
    }
  };
  const availableStatuses = selected
    ? [selected.status, ...(nextStatus[selected.status] ?? [])]
    : [];

  return (
    <section className="space-y-6 p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Administration</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Document Requests
          </h1>
          <p className="mt-1 text-muted-foreground">
            Review Seminary document requests and record payment, release, and
            delivery details.
          </p>
        </div>
        <Button variant="outline" onClick={() => setTypesOpen(true)}>
          <Settings2 className="size-4" />
          Configure document types
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Pending review", counts.pending, FileClock],
          ["In process", counts.processing, FileCheck2],
          ["Ready for release", counts.ready, PackageCheck],
          ["Released", counts.released, WalletCards],
        ].map(([label, value, Icon]) => {
          const StatIcon = Icon as typeof FileClock;
          return (
            <Card className="py-0!" key={label as string}>
              <CardContent className="flex items-center gap-4 p-5">
                <span className="rounded-xl bg-primary/10 p-3 text-primary">
                  <StatIcon className="size-5" />
                </span>
                <div>
                  <p className="text-2xl font-semibold">{value as number}</p>
                  <p className="text-sm text-muted-foreground">
                    {label as string}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="py-0!">
        <CardContent className="p-0">
          <div className="border-b p-5">
            <h2 className="font-semibold">Request directory</h2>
            <p className="text-sm text-muted-foreground">
              Only authorized staff can change a request’s lifecycle.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Document</th>
                  <th className="p-4">Delivery</th>
                  <th className="p-4">Fee / payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-t">
                    <td className="p-4">
                      <p className="font-medium">{request.referenceNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {dateLabel(request.createdAt)}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{studentName(request)}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.studentApplication.studentId ??
                          "No student ID"}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{request.documentType.name}</p>
                      <p className="max-w-55 truncate text-xs text-muted-foreground">
                        {request.purpose}
                      </p>
                    </td>
                    <td className="p-4">
                      {statusLabel(request.deliveryMethod)}
                    </td>
                    <td className="p-4">
                      <p>{money(request.fee)}</p>
                      <p className="text-xs text-muted-foreground">
                        {statusLabel(request.paymentStatus)}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          request.status === "REJECTED"
                            ? "destructive"
                            : request.status === "RELEASED"
                              ? "success"
                              : "secondary"
                        }
                      >
                        {statusLabel(request.status)}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => open(request)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
                {!requests.length && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center text-muted-foreground"
                    >
                      No document requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Sheet
        open={Boolean(selected)}
        onOpenChange={(isOpen) => !isOpen && setSelected(null)}
      >
        <SheetContent
          side="right"
          className="w-full gap-0 overflow-y-auto max-w-xl!"
        >
          <SheetHeader className="border-b px-6 py-5">
            <SheetTitle>Review document request</SheetTitle>
            <SheetDescription>
              {selected?.referenceNumber} · {selected?.documentType.name}
            </SheetDescription>
          </SheetHeader>
          {selected && (
            <div className="space-y-5 px-6 py-5">
              <Card className="py-0!">
                <CardContent className="space-y-2 p-4 text-sm">
                  <p>
                    <span className="font-medium">Student:</span>{" "}
                    {studentName(selected)}
                  </p>
                  <p>
                    <span className="font-medium">Purpose:</span>{" "}
                    {selected.purpose}
                  </p>
                  <p>
                    <span className="font-medium">Delivery:</span>{" "}
                    {statusLabel(selected.deliveryMethod)}
                  </p>
                  {selected.supportingDetails && (
                    <p>
                      <span className="font-medium">Supporting details:</span>{" "}
                      {selected.supportingDetails}
                    </p>
                  )}
                </CardContent>
              </Card>
              <Field>
                <FieldLabel>Workflow status</FieldLabel>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as SeminaryDocumentRequestStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map((value) => (
                      <SelectItem key={value} value={value}>
                        {statusLabel(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Payment status</FieldLabel>
                <Select
                  value={paymentStatus}
                  onValueChange={(value) =>
                    setPaymentStatus(value as SeminaryDocumentPaymentStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["NOT_APPLICABLE", "PENDING", "PAID", "WAIVED"].map(
                      (value) => (
                        <SelectItem key={value} value={value}>
                          {statusLabel(value)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Review remarks</FieldLabel>
                <Textarea
                  value={reviewRemarks}
                  onChange={(event) => setReviewRemarks(event.target.value)}
                  placeholder="Approval, rejection, or processing notes"
                />
              </Field>
              {status === "RELEASED" && (
                <>
                  <Field>
                    <FieldLabel>Receiving or delivery reference</FieldLabel>
                    <Input
                      value={releaseReference}
                      onChange={(event) =>
                        setReleaseReference(event.target.value)
                      }
                      placeholder="Courier tracking number, email reference, or pickup slip"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Received by</FieldLabel>
                    <Input
                      value={receivedBy}
                      onChange={(event) => setReceivedBy(event.target.value)}
                      placeholder="Recipient name"
                    />
                  </Field>
                </>
              )}
            </div>
          )}
          <SheetFooter className="flex-row justify-end border-t px-6 py-4">
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={update.isPending}>
              {update.isPending ? "Saving…" : "Save request"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet open={typesOpen} onOpenChange={setTypesOpen}>
        <SheetContent
          side="right"
          className="w-full gap-0 overflow-y-auto sm:max-w-xl"
        >
          <SheetHeader className="border-b px-6 py-5">
            <SheetTitle>Document types</SheetTitle>
            <SheetDescription>
              These are the supported records students may request.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5 px-6 py-5">
            <div className="space-y-2">
              {(typesQuery.data?.data ?? []).map((type) => (
                <div key={type.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <p className="font-medium">{type.name}</p>
                    <Badge variant={type.isActive ? "success" : "secondary"}>
                      {type.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {type.description || "No description"} · {money(type.fee)}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-4 border-t pt-5">
              <p className="font-medium">Add supported document</p>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={newTypeName}
                  onChange={(event) => setNewTypeName(event.target.value)}
                  placeholder="e.g., Honorable Dismissal"
                />
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  value={newTypeDescription}
                  onChange={(event) =>
                    setNewTypeDescription(event.target.value)
                  }
                  placeholder="When should students request this?"
                />
              </Field>
              <Field>
                <FieldLabel>Applicable fee (optional)</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  value={newTypeFee}
                  onChange={(event) => setNewTypeFee(event.target.value)}
                  placeholder="0.00"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={requiresSupportingDetails}
                  onChange={(event) =>
                    setRequiresSupportingDetails(event.target.checked)
                  }
                />
                Require supporting details
              </label>
              <Button
                onClick={addType}
                disabled={createType.isPending || !newTypeName.trim()}
              >
                <Plus className="size-4" />
                {createType.isPending ? "Adding…" : "Add document type"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
