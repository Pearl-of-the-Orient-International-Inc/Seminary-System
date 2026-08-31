"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, DragEvent } from "react";
import {
  AlertCircle,
  BookOpenText,
  CloudUpload,
  Download,
  FileClock,
  Filter,
  FileUp,
  Plus,
  ScrollText,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  toApiError,
  useCreateSeminaryStudyMaterialMutation,
  useDeleteSeminaryStudyMaterialMutation,
  useSeminaryCoursesQuery,
  useSeminaryStudyMaterialsQuery,
  useUpdateSeminaryStudyMaterialMutation,
  useUploadSeminaryStudyMaterialMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryStudyMaterial,
  SeminaryStudyMaterialStatus,
  SeminaryStudyMaterialType,
} from "@/features/seminary/seminary.types";
import { useToast } from "@/hooks/use-toast";

import { CellActions } from "./_components/cell-actions";
import {
  columns,
  studyMaterialClassOptions,
  studyMaterialStatusOptions,
  studyMaterialTopicOptions,
  studyMaterialTypeOptions,
  type StudyMaterialClass,
  type StudyMaterialRecord,
  type StudyMaterialTopic,
  type StudyMaterialType,
} from "./_components/columns";

type AcademicYearOption = "2024-2025" | "2025-2026";
type ClassFilterOption = "All Classes" | StudyMaterialClass;
type SubjectFilterOption = "All Subjects" | string;
type TopicFilterOption = "All Topics" | StudyMaterialTopic;
type TypeFilterOption = "All Types" | StudyMaterialType;

const academicYearOptions: AcademicYearOption[] = ["2024-2025", "2025-2026"];
const classFilterOptions: ClassFilterOption[] = [
  "All Classes",
  ...studyMaterialClassOptions,
];
const topicFilterOptions: TopicFilterOption[] = [
  "All Topics",
  ...studyMaterialTopicOptions,
];
const typeFilterOptions: TypeFilterOption[] = [
  "All Types",
  ...studyMaterialTypeOptions,
];

type StudyMaterialFormState = {
  file?: File;
  fileName: string;
  status: StudyMaterialRecord["status"];
  subject: string;
  subtitle: string;
  title: string;
  type: StudyMaterialType;
};

const defaultMaterialForm: StudyMaterialFormState = {
  fileName: "",
  status: "Draft",
  subject: "",
  subtitle: "",
  title: "",
  type: "Document",
};

const materialTypeValueMap: Record<StudyMaterialType, SeminaryStudyMaterialType> = {
  Notes: "NOTES",
  Presentation: "PRESENTATION",
  Document: "DOCUMENT",
  Chart: "CHART",
  Archive: "ARCHIVE",
};

const materialTypeLabelMap: Record<SeminaryStudyMaterialType, StudyMaterialType> = {
  NOTES: "Notes",
  PRESENTATION: "Presentation",
  DOCUMENT: "Document",
  CHART: "Chart",
  ARCHIVE: "Archive",
};

const materialStatusValueMap: Record<
  StudyMaterialRecord["status"],
  SeminaryStudyMaterialStatus
> = {
  Published: "PUBLISHED",
  Draft: "DRAFT",
};

const materialStatusLabelMap: Record<
  SeminaryStudyMaterialStatus,
  StudyMaterialRecord["status"]
> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
};

const formatUploadDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);

const formatUploadTime = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

const toStudyMaterialRecord = (
  material: SeminaryStudyMaterial,
  index: number,
): StudyMaterialRecord => {
  const uploadedAt = new Date(material.createdAt);

  return {
    id: material.id,
    order: index + 1,
    title: material.title,
    subtitle: material.subtitle ?? material.fileName,
    subject: material.subject,
    className: "General",
    topic: material.fileName,
    type: materialTypeLabelMap[material.type],
    uploadedBy: material.uploadedByName,
    uploadedRole: material.uploadedByRole,
    uploadedOnDate: formatUploadDate(uploadedAt),
    uploadedOnTime: formatUploadTime(uploadedAt),
    downloads: material.downloads,
    status: materialStatusLabelMap[material.status],
    fileUrl: material.fileUrl,
    fileName: material.fileName,
  };
};

const Page = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: currentUser } = useCurrentUserQuery();
  const { toast } = useToast();
  const [academicYear, setAcademicYear] = useState<AcademicYearOption>("2024-2025");
  const [classFilter, setClassFilter] = useState<ClassFilterOption>("All Classes");
  const [subjectFilter, setSubjectFilter] =
    useState<SubjectFilterOption>("All Subjects");
  const [topicFilter, setTopicFilter] = useState<TopicFilterOption>("All Topics");
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>("All Types");
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<StudyMaterialRecord | null>(
    null,
  );
  const [editingRecord, setEditingRecord] = useState<StudyMaterialRecord | null>(
    null,
  );
  const [materialForm, setMaterialForm] =
    useState<StudyMaterialFormState>(defaultMaterialForm);
  const uploaderName = currentUser?.name ?? "Current Instructor";
  const coursesQuery = useSeminaryCoursesQuery({ limit: 100, page: 1 });
  const materialsQuery = useSeminaryStudyMaterialsQuery({ limit: 100, page: 1 });
  const uploadMaterialMutation = useUploadSeminaryStudyMaterialMutation();
  const createMaterialMutation = useCreateSeminaryStudyMaterialMutation();
  const updateMaterialMutation = useUpdateSeminaryStudyMaterialMutation();
  const deleteMaterialMutation = useDeleteSeminaryStudyMaterialMutation();

  const subjectOptions = useMemo(
    () => {
      const isInstructor = currentUser?.role === "INSTRUCTOR";

      return Array.from(
        new Set(
          (coursesQuery.data?.data ?? [])
            .flatMap((course) => course.subjects ?? [])
            .filter(
              (subject) =>
                !isInstructor ||
                subject.professor.toLowerCase() === uploaderName.toLowerCase(),
            )
            .map((subject) => subject.subjectName)
            .filter(Boolean),
        ),
      ).sort((first, second) => first.localeCompare(second));
    },
    [coursesQuery.data?.data, currentUser?.role, uploaderName],
  );
  const subjectFilterOptions = useMemo<SubjectFilterOption[]>(
    () => ["All Subjects", ...subjectOptions],
    [subjectOptions],
  );
  const materials = useMemo(
    () => (materialsQuery.data?.data ?? []).map(toStudyMaterialRecord),
    [materialsQuery.data?.data],
  );

  const stats = useMemo(() => {
    const publishedCount = materials.filter(
      (material) => material.status === "Published",
    ).length;
    const draftCount = materials.filter(
      (material) => material.status === "Draft",
    ).length;
    const totalDownloads = materials.reduce(
      (sum, material) => sum + material.downloads,
      0,
    );
    const publishedPercent =
      materials.length > 0
        ? `${((publishedCount / materials.length) * 100).toFixed(2)}% of total`
        : "0% of total";

    return [
      {
        title: "Total Materials",
        value: String(materials.length),
        description: "All time",
        icon: <BookOpenText className="size-6" />,
        accentClassName:
          "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
      },
      {
        title: "Published",
        value: String(publishedCount),
        description: publishedPercent,
        icon: <ScrollText className="size-6" />,
        accentClassName:
          "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
      },
      {
        title: "Drafts",
        value: String(draftCount),
        description: "Pending publication",
        icon: <FileClock className="size-6" />,
        accentClassName:
          "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
      },
      {
        title: "Total Downloads",
        value: totalDownloads.toLocaleString(),
        description: "Across all materials",
        icon: <Download className="size-6" />,
        accentClassName:
          "bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
      },
    ];
  }, [materials]);

  const filteredMaterials = useMemo(
    () =>
      materials.filter((material) => {
        const classMatch =
          classFilter === "All Classes" ||
          material.className.startsWith(classFilter);
        const subjectMatch =
          subjectFilter === "All Subjects" || material.subject === subjectFilter;
        const topicMatch =
          topicFilter === "All Topics" || material.topic === topicFilter;
        const typeMatch = typeFilter === "All Types" || material.type === typeFilter;

        return classMatch && subjectMatch && topicMatch && typeMatch;
      }),
    [classFilter, materials, subjectFilter, topicFilter, typeFilter],
  );

  const handleDelete = async (targetRecord: StudyMaterialRecord) => {
    try {
      await deleteMaterialMutation.mutateAsync(targetRecord.id);
      toast({
        title: "Material deleted",
        description: `${targetRecord.title} was removed.`,
        variant: "success",
      });
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Delete failed",
        description: apiError.message ?? "Unable to delete material.",
        variant: "error",
      });
    }
  };

  const handleCreateMaterial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedSubject = subjectOptions.includes(materialForm.subject)
      ? materialForm.subject
      : subjectOptions[0];

    if (!selectedSubject || (!editingRecord && !materialForm.file)) {
      return;
    }

    try {
      const payload = {
        title: materialForm.title.trim(),
        subtitle: materialForm.subtitle.trim() || undefined,
        subject: selectedSubject,
        type: materialTypeValueMap[materialForm.type],
        status: materialStatusValueMap[materialForm.status],
      };

      if (editingRecord) {
        await updateMaterialMutation.mutateAsync({
          id: editingRecord.id,
          payload,
        });
      } else if (materialForm.file) {
        const uploaded = await uploadMaterialMutation.mutateAsync(materialForm.file);
        await createMaterialMutation.mutateAsync({
          ...payload,
          fileUrl: uploaded.fileUrl,
          fileName: uploaded.fileName ?? materialForm.fileName,
          mimeType:
            typeof uploaded.mimeType === "string"
              ? uploaded.mimeType
              : materialForm.file.type,
          fileSize:
            typeof uploaded.fileSize === "number"
              ? uploaded.fileSize
              : materialForm.file.size,
        });
      }

      toast({
        title: editingRecord ? "Material updated" : "Material uploaded",
        description: `${materialForm.title.trim()} was saved.`,
        variant: "success",
      });
      setMaterialForm(defaultMaterialForm);
      setEditingRecord(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setUploadSheetOpen(false);
      await materialsQuery.refetch();
      router.refresh();
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Upload failed",
        description: apiError.message ?? "Unable to save material.",
        variant: "error",
      });
    }
  };

  const processMaterialFile = (file?: File) => {
    if (!file) {
      return;
    }

    setMaterialForm((current) => ({
      ...current,
      file,
      fileName: file.name,
      title: current.title || file.name.replace(/\.[^.]+$/, ""),
    }));
  };

  const handleMaterialFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    processMaterialFile(event.target.files?.[0]);
  };

  const handleMaterialFileDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    processMaterialFile(event.dataTransfer.files[0]);
  };

  const handleEdit = (record: StudyMaterialRecord) => {
    setEditingRecord(record);
    setMaterialForm({
      fileName: record.fileName ?? "",
      status: record.status,
      subject: record.subject,
      subtitle: record.subtitle,
      title: record.title,
      type: record.type,
    });
    setUploadSheetOpen(true);
  };

  const handleDownload = (record: StudyMaterialRecord) => {
    if (!record.fileUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = record.fileUrl;
    link.download = record.fileName ?? record.title;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const renderCellActions = (row: Row<StudyMaterialRecord>) => (
    <CellActions
      data={row.original}
      onPreview={setPreviewRecord}
      onEdit={handleEdit}
      onDownload={handleDownload}
      onDelete={handleDelete}
    />
  );
  const selectedMaterialSubject = subjectOptions.includes(materialForm.subject)
    ? materialForm.subject
    : subjectOptions[0] || "";

  return (
    <>
    <section className="space-y-6 p-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
            Study Materials
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize and share learning materials with students.
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
              <BreadcrumbPage>Learning Management System</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Study Materials</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-border/70 bg-white py-0 shadow-sm"
          >
            <CardContent className="flex items-start gap-4 p-5">
              <div
                className={`flex size-13 items-center justify-center rounded-lg ${stat.accentClassName}`}
              >
                {stat.icon}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-4xl font-semibold tracking-tight text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Academic Year</p>
              <Select
                value={academicYear}
                onValueChange={(value) => setAcademicYear(value as AcademicYearOption)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYearOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Class</p>
              <Select
                value={classFilter}
                onValueChange={(value) => setClassFilter(value as ClassFilterOption)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classFilterOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Subject</p>
              <Select
                value={subjectFilter}
                onValueChange={(value) =>
                  setSubjectFilter(value as SubjectFilterOption)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectFilterOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Topic</p>
              <Select
                value={topicFilter}
                onValueChange={(value) => setTopicFilter(value as TopicFilterOption)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topicFilterOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Type</p>
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as TypeFilterOption)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {typeFilterOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <GlobalDataTable
            columns={columns}
            data={filteredMaterials}
            cellAction={renderCellActions}
            exportFileName="study-materials"
            filterPlaceholder="Search materials..."
            emptyMessage={
              materialsQuery.isLoading
                ? "Loading study materials..."
                : "No study materials found."
            }
            pageSizeOptions={[7, 10, 20]}
            toolbarActions={
              <>
                <Button variant="outline">
                  <Filter className="size-4" />
                  Filters
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setEditingRecord(null);
                    setMaterialForm((current) => ({
                      ...defaultMaterialForm,
                      subject: current.subject || subjectOptions[0] || "",
                    }));
                    setUploadSheetOpen(true);
                  }}
                >
                  <Plus className="size-4" />
                  Upload Material
                </Button>
              </>
            }
            onDeleteSelected={async (selectedRows) => {
              await Promise.all(
                selectedRows.map((material) =>
                  deleteMaterialMutation.mutateAsync(material.id),
                ),
              );
            }}
          />
        </CardContent>
      </Card>
    </section>
    <Sheet
      open={uploadSheetOpen}
      onOpenChange={(open) => {
        setUploadSheetOpen(open);
        if (!open) {
          setEditingRecord(null);
          setMaterialForm(defaultMaterialForm);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-xl"
      >
        <form onSubmit={handleCreateMaterial} className="flex min-h-full flex-col">
          <SheetHeader className="border-b px-6 py-5 text-left">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-700">
              <FileUp className="size-5" />
            </div>
            <SheetTitle>
              {editingRecord ? "Edit Study Material" : "Upload Study Material"}
            </SheetTitle>
            <SheetDescription>
              {editingRecord
                ? "Update material details and publication status."
                : "Create a material record and attach source file details."}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-5 px-6 py-5">
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
              <div className="text-muted-foreground">Uploaded by</div>
              <div className="font-medium">{uploaderName}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material-title">Title</Label>
              <Input
                id="material-title"
                value={materialForm.title}
                onChange={(event) =>
                  setMaterialForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Enter material title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material-subtitle">Subtitle</Label>
              <Textarea
                id="material-subtitle"
                value={materialForm.subtitle}
                onChange={(event) =>
                  setMaterialForm((current) => ({
                    ...current,
                    subtitle: event.target.value,
                  }))
                }
                placeholder="Short description or module note"
                className="min-h-24"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={selectedMaterialSubject}
                  onValueChange={(value) =>
                    setMaterialForm((current) => ({
                      ...current,
                      subject: value,
                    }))
                  }
                  disabled={coursesQuery.isLoading || subjectOptions.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        coursesQuery.isLoading
                          ? "Loading subjects..."
                          : "Select subject"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={materialForm.type}
                  onValueChange={(value) =>
                    setMaterialForm((current) => ({
                      ...current,
                      type: value as StudyMaterialType,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {studyMaterialTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={materialForm.status}
                onValueChange={(value) =>
                  setMaterialForm((current) => ({
                    ...current,
                    status: value as StudyMaterialRecord["status"],
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {studyMaterialStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Material File</Label>
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleMaterialFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                className="flex min-h-48 w-full flex-col gap-2 rounded-2xl border-dashed bg-primary/5 py-10 text-center"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleMaterialFileDrop}
              >
                <CloudUpload className="size-10 text-primary" strokeWidth={1.5} />
                {materialForm.fileName || "Upload material file"}
                <span className="text-xs font-normal text-muted-foreground">
                  {editingRecord
                    ? "Current file is kept unless a new upload is needed later."
                    : "Drag and drop your file here"}
                  <br /> or click to browse
                </span>
              </Button>
              <div className="flex items-start gap-2 rounded-xl border border-dashed bg-blue-600/10 p-4 text-xs text-blue-600">
                <AlertCircle className="size-4 shrink-0" strokeWidth={1.5} />
                Upload notes, documents, presentations, charts, or archives for
                student access.
              </div>
            </div>
          </div>

          <SheetFooter className="mt-auto border-t px-6 py-4 sm:flex-row sm:justify-end">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button
              type="submit"
              disabled={
                !materialForm.title.trim() ||
                !selectedMaterialSubject ||
                (!editingRecord && !materialForm.file) ||
                uploadMaterialMutation.isPending ||
                createMaterialMutation.isPending ||
                updateMaterialMutation.isPending
              }
            >
              {uploadMaterialMutation.isPending ||
              createMaterialMutation.isPending ||
              updateMaterialMutation.isPending
                ? "Saving..."
                : editingRecord
                  ? "Save Changes"
                  : "Upload Material"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
    <Dialog open={Boolean(previewRecord)} onOpenChange={() => setPreviewRecord(null)}>
      <DialogContent className="max-h-[90vh] max-w-5xl! border-0! overflow-hidden p-0!">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{previewRecord?.title}</DialogTitle>
          <DialogDescription>
            {previewRecord?.subject} - {previewRecord?.fileName}
          </DialogDescription>
        </DialogHeader>
        <div className="h-[70vh] bg-muted">
          {previewRecord?.fileUrl ? (
            <iframe
              src={previewRecord.fileUrl}
              title={previewRecord.title}
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No preview available.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Page;
