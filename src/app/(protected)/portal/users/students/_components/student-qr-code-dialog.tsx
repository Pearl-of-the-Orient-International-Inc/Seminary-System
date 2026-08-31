"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Download, ExternalLink, LoaderCircle } from "lucide-react";

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

type StudentQrCodeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentRecord | null;
};

export function StudentQrCodeDialog({
  open,
  onOpenChange,
  student,
}: StudentQrCodeDialogProps) {
  const [generatedForUrl, setGeneratedForUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [selectedType, setSelectedType] =
    useState<SeminaryCredentialDocumentType>("CERTIFICATE");
  const generateDocumentMutation =
    useGenerateSeminaryCredentialDocumentMutation();
  const { mutate: generateDocument } = generateDocumentMutation;
  const credentialDocument = generateDocumentMutation.data?.data;

  const verificationUrl = useMemo(() => {
    if (!credentialDocument?.verificationToken || typeof window === "undefined") {
      return "";
    }

    const websiteUrl =
      process.env.NEXT_PUBLIC_WEBSITE_URL?.replace(/\/$/, "") ??
      "https://pearlchaplaincy.org";

    return `${websiteUrl}/credentials/verify/${encodeURIComponent(
      credentialDocument.verificationToken,
    )}`;
  }, [credentialDocument]);

  const isGenerating =
    open &&
    (generateDocumentMutation.isPending ||
      (Boolean(verificationUrl) && generatedForUrl !== verificationUrl));
  const visibleQrDataUrl =
    generatedForUrl === verificationUrl ? qrDataUrl : null;
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

  useEffect(() => {
    let active = true;

    if (!open || !verificationUrl || generatedForUrl === verificationUrl) {
      return;
    }

    QRCode.toDataURL(verificationUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: "#111111",
        light: "#ffffff",
      },
    })
      .then((value) => {
        if (!active) return;
        setGeneratedForUrl(verificationUrl);
        setQrDataUrl(value);
      })
      .catch(() => {
        if (!active) return;
        setGeneratedForUrl(verificationUrl);
        setQrDataUrl(null);
      });

    return () => {
      active = false;
    };
  }, [generatedForUrl, open, verificationUrl]);

  const handleDownload = () => {
    if (!visibleQrDataUrl || !student) return;

    const link = document.createElement("a");
    link.href = visibleQrDataUrl;
    link.download = `${buildFileBaseName(student)}-authenticity-qr.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] w-[min(calc(100vw-2rem),42rem)] max-w-none! overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Authenticity QR Code</DialogTitle>
          <DialogDescription>
            Generate public verification QR code for{" "}
            {student?.name ?? "this student"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
            <div className="min-w-0 overflow-hidden rounded-lg border bg-muted/30 px-3">
              <p className="mt-1.5 truncate text-sm font-medium text-foreground">
                {verificationUrl || "Generating..."}
              </p>
            </div>

            <Select
              value={selectedType}
              onValueChange={(value) =>
                setSelectedType(value as SeminaryCredentialDocumentType)
              }
            >
              <SelectTrigger className="h-full min-w-0">
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
            <div className="min-w-0 overflow-hidden rounded-lg border bg-muted/30 p-4 text-sm">
              <div className="line-clamp-2 font-medium">
                {credentialDocument.title ??
                  credentialDocumentTypeLabelMap[credentialDocument.type]}
              </div>
              <div className="text-muted-foreground mt-1 line-clamp-2">
                {credentialDocument.documentNumber} -{" "}
                {credentialDocument.application?.programCourse ?? "No program set"}
              </div>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex min-h-80 min-w-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-6">
            {isGenerating ? (
              <div className="text-muted-foreground flex h-64 w-64 items-center justify-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                Generating QR code...
              </div>
            ) : visibleQrDataUrl ? (
              <Image
                src={visibleQrDataUrl}
                alt={`Authenticity QR code for ${student?.name ?? "student"}`}
                width={320}
                height={320}
                className="h-auto w-full max-w-72 object-contain"
                unoptimized
              />
            ) : (
              <div className="text-muted-foreground flex h-64 w-64 items-center justify-center text-sm">
                QR code preview is unavailable.
              </div>
            )}
          </div>
        </div>

        <DialogFooter showCloseButton className="flex-wrap gap-2">
          {verificationUrl ? (
            <Button asChild variant="outline">
              <a href={verificationUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                Open verification
              </a>
            </Button>
          ) : null}
          <Button onClick={handleDownload} disabled={!visibleQrDataUrl}>
            <Download className="size-4" />
            Download QR code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
