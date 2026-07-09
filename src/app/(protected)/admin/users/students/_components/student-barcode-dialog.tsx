"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import bwipjs from "bwip-js/browser";
import { Download, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  toApiError,
  useGenerateSeminaryCredentialDocumentMutation,
} from "@/features/seminary/seminary.hooks";
import type { SeminaryCredentialDocumentType } from "@/features/seminary/seminary.types";

import {
  credentialDocumentTypeLabelMap,
  credentialDocumentTypeOptions,
} from "./credential-document-options";
import type { StudentRecord } from "./student-data";

type StudentBarcodeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentRecord | null;
};

export function StudentBarcodeDialog({
  open,
  onOpenChange,
  student,
}: StudentBarcodeDialogProps) {
  const [selectedType, setSelectedType] =
    useState<SeminaryCredentialDocumentType>("CERTIFICATE");
  const generateDocumentMutation =
    useGenerateSeminaryCredentialDocumentMutation();
  const { mutate: generateDocument } = generateDocumentMutation;
  const credentialDocument = generateDocumentMutation.data?.data;
  const barcodeValue = credentialDocument?.barcodeNumber ?? "";
  const barcodeDataUrl = useMemo(() => {
    if (!barcodeValue || typeof document === "undefined") return null;

    try {
      const canvas = document.createElement("canvas");
      bwipjs.toCanvas(canvas, {
        bcid: "ean13",
        text: barcodeValue,
        scale: 3,
        height: 22,
        includetext: true,
        textxalign: "center",
        textsize: 10,
        backgroundcolor: "FFFFFF",
      });

      return canvas.toDataURL("image/png");
    } catch {
      return null;
    }
  }, [barcodeValue]);
  const errorMessage = generateDocumentMutation.error
    ? toApiError(generateDocumentMutation.error).message
    : null;

  useEffect(() => {
    if (!open || !student?.id) return;

    generateDocument({
      payload: { type: selectedType },
      studentId: student.id,
    });
  }, [generateDocument, open, selectedType, student?.id]);

  const handleDownload = () => {
    if (!barcodeDataUrl || !student) return;

    const link = document.createElement("a");
    link.href = barcodeDataUrl;
    link.download = `${buildFileBaseName(student)}-barcode.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Student Barcode</DialogTitle>
          <DialogDescription>
            Generate internal EAN-13 tracking barcode for{" "}
            {student?.name ?? "this student"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
            <div className="rounded-lg border bg-muted/30 px-3">
              <p className="break-all text-base font-semibold mt-1.5 tracking-wide text-foreground">
                {barcodeValue || "Generating..."}
              </p>
            </div>

            <Select
              value={selectedType}
              onValueChange={(value) =>
                setSelectedType(value as SeminaryCredentialDocumentType)
              }
            >
              <SelectTrigger className="h-full">
                <SelectValue placeholder="Document type" />
              </SelectTrigger>
              <SelectContent>
                {credentialDocumentTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {credentialDocument ? (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <div className="line-clamp-2 font-medium">
                {credentialDocument.title ??
                  credentialDocumentTypeLabelMap[credentialDocument.type]}
              </div>
              <div className="text-muted-foreground mt-1 line-clamp-2">
                {credentialDocument.documentNumber} -{" "}
                {credentialDocument.application?.studentId} -{" "}
                {credentialDocument.application?.programCourse ?? "No program set"}
              </div>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex min-h-58 items-center justify-center rounded-xl border bg-white p-6">
            {barcodeDataUrl ? (
              <div className="flex w-full max-w-sm flex-col items-center gap-2">
                <div className="text-sm font-medium text-foreground">
                  ISBN {formatIsbnLikeBarcode(barcodeValue)}
                </div>
                <Image
                  src={barcodeDataUrl}
                  alt={`EAN-13 barcode for ${student?.name ?? "student"}`}
                  width={420}
                  height={180}
                  className="h-auto w-full rounded bg-white object-contain"
                  unoptimized
                />
              </div>
            ) : generateDocumentMutation.isPending ? (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <LoaderCircle className="size-4 animate-spin" />
                Generating barcode...
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                Barcode preview is unavailable.
              </div>
            )}
          </div>
        </div>

        <DialogFooter showCloseButton>
          <Button onClick={handleDownload} disabled={!barcodeDataUrl}>
            <Download className="size-4" />
            Download barcode
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatIsbnLikeBarcode(value: string) {
  return value.replace(
    /^(\d{3})(\d)(\d{3})(\d{5})(\d)$/,
    "$1-$2-$3-$4-$5",
  );
}

function buildFileBaseName(student: StudentRecord) {
  return [student.name, student.id]
    .map(sanitizeFileNameSegment)
    .filter(Boolean)
    .join("-");
}

function sanitizeFileNameSegment(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
