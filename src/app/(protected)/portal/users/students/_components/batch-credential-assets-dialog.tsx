"use client";

import { useMemo, useState } from "react";
import bwipjs from "bwip-js/browser";
import QRCode from "qrcode";
import { Barcode, Download, LoaderCircle, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toApiError } from "@/lib/http-client";
import { generateSeminaryCredentialDocument } from "@/features/seminary/seminary.api";
import type { SeminaryCredentialDocumentType } from "@/features/seminary/seminary.types";

import {
  credentialDocumentTypeLabelMap,
  credentialDocumentTypeOptions,
} from "./credential-document-options";
import type { StudentRecord } from "./student-data";

type BatchAssetMode = "barcode" | "qr";

type BatchCredentialAssetsDialogProps = {
  mode: BatchAssetMode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  students: StudentRecord[];
};

export function BatchCredentialAssetsDialog({
  mode,
  onOpenChange,
  open,
  students,
}: BatchCredentialAssetsDialogProps) {
  const [selectedType, setSelectedType] =
    useState<SeminaryCredentialDocumentType>("CERTIFICATE");
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const title = mode === "barcode" ? "Batch Barcodes" : "Batch QR Codes";
  const Icon = mode === "barcode" ? Barcode : QrCode;
  const selectedTypeLabel = credentialDocumentTypeLabelMap[selectedType];
  const selectedStudents = useMemo(
    () => students.filter((student) => student.application?.studentId),
    [students],
  );

  const handleDownloadAll = async () => {
    setError(null);
    setIsDownloading(true);

    try {
      for (const student of selectedStudents) {
        const response = await generateSeminaryCredentialDocument({
          payload: { type: selectedType },
          studentId: student.id,
        });
        const credentialDocument = response.data;
        const dataUrl =
          mode === "barcode"
            ? buildBarcodeDataUrl(credentialDocument.barcodeNumber ?? "")
            : await buildQrDataUrl(
                credentialDocument.verificationToken
                  ? buildVerificationUrl(credentialDocument.verificationToken)
                  : "",
              );

        if (!dataUrl) continue;

        downloadDataUrl(
          dataUrl,
          `${buildFileBaseName(student)}-${selectedType.toLowerCase()}-${mode}.png`,
        );
        await delay(120);
      }
    } catch (err) {
      const apiError = toApiError(err);
      setError(apiError.message ?? `Unable to download ${mode} files.`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl!">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="size-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Generate {selectedTypeLabel.toLowerCase()} {mode} assets for{" "}
            {selectedStudents.length} selected student
            {selectedStudents.length === 1 ? "" : "s"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-[1fr_160px] sm:items-center">
            <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              {selectedStudents.length} eligible selected record
              {selectedStudents.length === 1 ? "" : "s"}
            </div>
            <Select
              value={selectedType}
              onValueChange={(value) =>
                setSelectedType(value as SeminaryCredentialDocumentType)
              }
            >
              <SelectTrigger className="w-full">
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

          <ScrollArea className="h-72 rounded-lg border">
            <div className="divide-y">
              {selectedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {student.name}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {student.id} - {student.program}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">
                    {student.schoolAffiliation}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <DialogFooter showCloseButton>
          <Button
            disabled={isDownloading || selectedStudents.length === 0}
            onClick={handleDownloadAll}
          >
            {isDownloading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {isDownloading ? "Preparing..." : `Download ${title}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function buildBarcodeDataUrl(value: string) {
  if (!value || typeof document === "undefined") return null;

  try {
    const canvas = document.createElement("canvas");
    bwipjs.toCanvas(canvas, {
      bcid: "ean13",
      text: value,
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
}

async function buildQrDataUrl(value: string) {
  if (!value) return null;

  try {
    return await QRCode.toDataURL(value, {
      width: 320,
      margin: 2,
      color: {
        dark: "#111111",
        light: "#ffffff",
      },
    });
  } catch {
    return null;
  }
}

function buildVerificationUrl(token: string) {
  const seminaryUrl =
    process.env.NEXT_PUBLIC_SEMINARY_URL?.replace(/\/$/, "") ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://seminary.pearlchaplaincy.org");

  return `${seminaryUrl}/credentials/verify/${encodeURIComponent(token)}`;
}

function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
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

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
