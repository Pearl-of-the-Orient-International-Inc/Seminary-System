"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Award, FileCheck2, FileStack, GraduationCap, LayoutGrid, MoreHorizontal, Plus, Rows3, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GlobalDataTable } from "@/components/DataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAllSeminaryCredentialDocumentsQuery } from "@/features/seminary/seminary.hooks";
import { documentTypeLabels, type SeminaryDocumentRecord, type SeminaryDocumentType } from "./certifications-records-data";
import { DocumentTypeDialog } from "./document-type-dialog";
import { documentRecordColumns } from "./document-record-columns";
import { DocumentGenerationSheet } from "./document-generation-sheet";

type ViewMode = "grid" | "table";
type Filter = "ALL" | SeminaryDocumentType;
type StatusFilter = "ALL" | SeminaryDocumentRecord["status"];
const dateFormatter = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" });
const statusVariant = { DRAFT: "secondary", READY: "outline", RELEASED: "default" } as const;
const documentIcon = { CERTIFICATE: Award, TRANSCRIPT: ScrollText, DIPLOMA: GraduationCap, ACADEMIC_RECORD: FileStack, CLEARANCE: FileCheck2, OTHER: FileStack } as const;

export function CertificationsRecordsPageContent() {
  const { toast } = useToast();
  const documentsQuery = useAllSeminaryCredentialDocumentsQuery({ limit: 100 });
  const [filter, setFilter] = useState<Filter>("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [documentType, setDocumentType] =
    useState<SeminaryDocumentType>("TRANSCRIPT");
  const records = useMemo<SeminaryDocumentRecord[]>(() => (documentsQuery.data?.data ?? []).map((document) => ({ id: document.id, referenceNumber: document.documentNumber, type: document.type, title: document.title || document.type, studentName: [document.application?.givenName, document.application?.middleName, document.application?.surname].filter(Boolean).join(" ") || document.application?.studentId || "Seminary student", program: document.application?.programCourse || "Program not set", status: document.status === "ACTIVE" ? "READY" : "DRAFT", issuedAt: document.issuedAt })), [documentsQuery.data]);
  const filteredRecords = useMemo(
    () =>
      records.filter(
        (record) =>
          (filter === "ALL" || record.type === filter) &&
          (statusFilter === "ALL" || record.status === statusFilter),
      ),
    [filter, records, statusFilter],
  );

  return <section className="space-y-6 p-6 sm:p-10">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1"><h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">Certifications &amp; Records</h1><p className="max-w-2xl text-sm leading-6 text-muted-foreground">Prepare, issue, and track certificates, transcripts, diplomas, and other official Seminary documents.</p></div>
      <Button onClick={() => setIsDocumentDialogOpen(true)}><Plus className="size-4" />Create document</Button>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard title="Total Documents" value={String(records.length)} subtitle="Issued registrar documents" icon={<FileStack className="size-4" />} tone="bg-blue-700/10 text-blue-700 dark:bg-blue-300/10 dark:text-blue-300" />
      <SummaryCard title="Certificates" value={String(records.filter((item) => item.type === "CERTIFICATE").length)} subtitle="Enrollment and completion certificates" icon={<Award className="size-4" />} tone="bg-emerald-700/10 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-300" />
      <SummaryCard title="Transcripts" value={String(records.filter((item) => item.type === "TRANSCRIPT").length)} subtitle="Official academic records" icon={<ScrollText className="size-4" />} tone="bg-amber-700/10 text-amber-700 dark:bg-amber-300/10 dark:text-amber-300" />
      <SummaryCard title="Ready to Release" value={String(records.filter((item) => item.status === "READY").length)} subtitle="Awaiting registrar release" icon={<FileCheck2 className="size-4" />} tone="bg-violet-700/10 text-violet-700 dark:bg-violet-300/10 dark:text-violet-300" />
    </div>

    <Card className="bg-transparent"><CardHeader className="border-b"><div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}><div className="scrollbar-hide max-w-full overflow-x-auto overscroll-x-contain pb-1"><TabsList variant="line" className="inline-flex min-w-max pr-2"><TabsTrigger value="ALL">All ({records.length})</TabsTrigger>{(Object.keys(documentTypeLabels) as SeminaryDocumentType[]).map((type) => <TabsTrigger key={type} value={type}>{documentTypeLabels[type]} ({records.filter((record) => record.type === type).length})</TabsTrigger>)}</TabsList></div></Tabs>
      <ToggleGroup type="single" variant="outline" size="sm" className="justify-self-start lg:justify-self-end" value={viewMode} onValueChange={(value) => { if (value === "grid" || value === "table") setViewMode(value); }} aria-label="Toggle document view"><ToggleGroupItem value="grid" aria-label="Grid view"><LayoutGrid className="size-4" /><span className="hidden sm:inline">Grid</span></ToggleGroupItem><ToggleGroupItem value="table" aria-label="Table view"><Rows3 className="size-4" /><span className="hidden sm:inline">Table</span></ToggleGroupItem></ToggleGroup>
    </div></CardHeader>
      <CardContent className="pt-6">
        {viewMode === "grid" ? (
          <DocumentGrid records={filteredRecords} />
        ) : (
          <GlobalDataTable
            columns={documentRecordColumns}
            data={filteredRecords}
            cellAction={() => <DocumentActions />}
            filterPlaceholder="Search student, document, program, or reference number..."
            emptyMessage="No document records found."
            exportFileName="seminary-documents"
            pageSizeOptions={[8, 10, 20, 50]}
            toolbarActions={
              <>
                <Select value={filter} onValueChange={(value) => setFilter(value as Filter)}>
                  <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All types" /></SelectTrigger>
                  <SelectContent><SelectItem value="ALL">All types</SelectItem>{(Object.keys(documentTypeLabels) as SeminaryDocumentType[]).map((type) => <SelectItem key={type} value={type}>{documentTypeLabels[type]}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                  <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All statuses" /></SelectTrigger>
                  <SelectContent><SelectItem value="ALL">All statuses</SelectItem><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="READY">Ready</SelectItem><SelectItem value="RELEASED">Released</SelectItem></SelectContent>
                </Select>
              </>
            }
          />
        )}
      </CardContent>
    </Card>

    <DocumentTypeDialog
      open={isDocumentDialogOpen}
      onOpenChange={setIsDocumentDialogOpen}
      onContinue={(type) => {
        setDocumentType(type);
        setIsDocumentDialogOpen(false);
        setIsGeneratorOpen(true);
      }}
    />
    <DocumentGenerationSheet
      open={isGeneratorOpen}
      onOpenChange={setIsGeneratorOpen}
      documentType={documentType}
    />
  </section>;
}

function DocumentGrid({ records }: { records: SeminaryDocumentRecord[] }) {
  if (!records.length) return <EmptyDocuments />;
  return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{records.map((record) => { const Icon = documentIcon[record.type]; return <Card key={record.id} className="group overflow-hidden border-border/70 py-0 shadow-xs transition-colors hover:border-primary/40"><CardContent className="space-y-4 px-4 py-4"><div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><span className="rounded-md bg-red-500 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">PDF</span><p className="truncate text-sm font-medium">{record.referenceNumber}</p></div><DocumentActions /></div><div className="flex gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-200"><Icon className="size-5" /></div><div className="min-w-0 space-y-1"><p className="text-[10px] font-semibold uppercase text-muted-foreground">{documentTypeLabels[record.type]}</p><p className="line-clamp-2 text-sm font-semibold leading-snug">{record.title}</p></div></div><div className="rounded-xl bg-accent/45 p-3 text-sm"><p className="font-medium">{record.studentName}</p><p className="mt-1 text-xs text-muted-foreground">{record.program}</p></div><div className="flex items-center justify-between gap-3 text-xs text-muted-foreground"><span>{dateFormatter.format(new Date(record.issuedAt))}</span><Badge variant={statusVariant[record.status]}>{record.status.replaceAll("_", " ")}</Badge></div></CardContent></Card>; })}</div>;
}

function DocumentActions() { const { toast } = useToast(); return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Open document actions"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem onClick={() => toast({ title: "Preview coming next", description: "Document previews will be connected during the backend phase.", variant: "info" })}>Preview document</DropdownMenuItem><DropdownMenuItem onClick={() => toast({ title: "Download coming next", description: "Generated documents will be available for download after backend integration.", variant: "info" })}>Download PDF</DropdownMenuItem></DropdownMenuContent></DropdownMenu>; }
function EmptyDocuments() { return <div className="rounded-xl border border-dashed p-12 text-center"><FileStack className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-medium">No documents found</p><p className="mt-1 text-sm text-muted-foreground">Choose another filter or create a new school document.</p></div>; }
function SummaryCard({ title, value, subtitle, icon, tone }: { title: string; value: string; subtitle: string; icon: ReactNode; tone: string }) { return <div className="rounded-lg border bg-card p-4 shadow-xs"><div className="mb-2 flex items-center justify-between"><p className="text-xs font-medium uppercase text-muted-foreground">{title}</p><span className={`rounded-md p-1.5 ${tone}`}>{icon}</span></div><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{subtitle}</p></div>; }
