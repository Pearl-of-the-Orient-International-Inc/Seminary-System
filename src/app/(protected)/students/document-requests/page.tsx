"use client";

import { useState } from "react";
import { FilePlus2, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toApiError, useCreateSeminaryDocumentRequestMutation, useSeminaryDocumentRequestsQuery, useSeminaryDocumentRequestTypesQuery } from "@/features/seminary/seminary.hooks";
import type { SeminaryDocumentDeliveryMethod, SeminaryDocumentRequestType } from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

const label = (value: string) => value.replaceAll("_", " ");
const date = (value: string) => new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(value));
const money = (value: number | string | null) => value === null ? "No fee" : `₱${Number(value).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export default function StudentDocumentRequestsPage() {
  const { toast } = useToast();
  const typesQuery = useSeminaryDocumentRequestTypesQuery();
  const requestsQuery = useSeminaryDocumentRequestsQuery();
  const create = useCreateSeminaryDocumentRequestMutation();
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<SeminaryDocumentDeliveryMethod>("PICKUP");
  const [supportingDetails, setSupportingDetails] = useState("");
  const types = typesQuery.data?.data ?? [];
  const selectedType = types.find((type) => type.id === documentTypeId) as SeminaryDocumentRequestType | undefined;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!documentTypeId || !purpose.trim()) {
      toast({ title: "Complete the request", description: "Choose a document type and state its purpose.", variant: "error" });
      return;
    }
    try {
      const result = await create.mutateAsync({ documentTypeId, purpose, deliveryMethod, supportingDetails: supportingDetails || undefined });
      toast({ title: "Request submitted", description: result.message, variant: "success" });
      setDocumentTypeId(""); setPurpose(""); setDeliveryMethod("PICKUP"); setSupportingDetails("");
    } catch (error) { toast({ title: "Request not submitted", description: toApiError(error).message, variant: "error" }); }
  };

  return <section className="space-y-6 p-6 md:p-10">
    <div className="rounded-2xl bg-linear-to-r from-emerald-950 to-emerald-800 px-6 py-7 text-white shadow-sm"><p className="text-xs font-medium uppercase tracking-wider text-emerald-100/75">Student services</p><h1 className="mt-2 font-serif text-3xl">Document Requests</h1><p className="mt-2 text-sm text-emerald-50/85">Request a Seminary record, then follow its review and release status here.</p></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"><Card><CardContent className="p-6"><div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-3 text-primary"><FilePlus2 className="size-5" /></span><div><h2 className="font-semibold">New document request</h2><p className="text-sm text-muted-foreground">Only configured document types are available.</p></div></div><form className="space-y-5" onSubmit={submit}><Field><FieldLabel>Document type</FieldLabel><Select value={documentTypeId} onValueChange={setDocumentTypeId}><SelectTrigger><SelectValue placeholder="Select a document" /></SelectTrigger><SelectContent>{types.map((type) => <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>)}</SelectContent></Select>{selectedType && <p className="mt-2 text-xs text-muted-foreground">{selectedType.description || "No additional description."} {selectedType.fee !== null && `Fee: ${money(selectedType.fee)}.`}</p>}</Field><Field><FieldLabel>Purpose</FieldLabel><Textarea value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="Why do you need this document?" /></Field><Field><FieldLabel>Delivery or release method</FieldLabel><Select value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as SeminaryDocumentDeliveryMethod)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PICKUP">Pickup</SelectItem><SelectItem value="EMAIL">Email</SelectItem><SelectItem value="COURIER">Courier</SelectItem></SelectContent></Select></Field><Field><FieldLabel>{selectedType?.requiresSupportingDetails ? "Supporting details (required)" : "Supporting details (optional)"}</FieldLabel><Input value={supportingDetails} onChange={(event) => setSupportingDetails(event.target.value)} placeholder="Recipient, school, address, or other required information" /></Field><Button type="submit" className="w-full" disabled={create.isPending}><Send className="size-4" />{create.isPending ? "Submitting…" : "Submit document request"}</Button></form></CardContent></Card>
      <Card><CardContent className="p-0"><div className="border-b p-6"><h2 className="font-semibold">My requests</h2><p className="text-sm text-muted-foreground">The registrar will update each request as it moves through the workflow.</p></div><div className="divide-y">{(requestsQuery.data?.data ?? []).map((request) => <div key={request.id} className="space-y-3 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium">{request.documentType.name}</p><p className="text-sm text-muted-foreground">{request.referenceNumber} · {date(request.createdAt)}</p></div><Badge variant={request.status === "REJECTED" ? "destructive" : request.status === "RELEASED" ? "success" : "secondary"}>{label(request.status)}</Badge></div><p className="text-sm">{request.purpose}</p><div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground"><span>{label(request.deliveryMethod)}</span><span>{money(request.fee)}</span><span>Payment: {label(request.paymentStatus)}</span></div>{request.reviewRemarks && <p className="rounded-md bg-muted p-3 text-sm"><span className="font-medium">Registrar note:</span> {request.reviewRemarks}</p>}{request.releasedAt && <p className="text-sm text-emerald-700">Released {date(request.releasedAt)}{request.releaseReference ? ` · ${request.releaseReference}` : ""}</p>}</div>)}{!(requestsQuery.data?.data ?? []).length && <p className="p-6 text-sm text-muted-foreground">You have not submitted any document requests.</p>}</div></CardContent></Card></div>
  </section>;
}
