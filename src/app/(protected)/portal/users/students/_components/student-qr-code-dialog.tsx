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

type QrCodeDestination = "STUDENT_ID" | "CREDENTIAL";

export function StudentQrCodeDialog({
  open,
  onOpenChange,
  student,
}: StudentQrCodeDialogProps) {
  const [generatedForUrl, setGeneratedForUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [selectedType, setSelectedType] =
    useState<SeminaryCredentialDocumentType>("CERTIFICATE");
  const [selectedDestination, setSelectedDestination] =
    useState<QrCodeDestination>("STUDENT_ID");
  const generateDocumentMutation =
    useGenerateSeminaryCredentialDocumentMutation();
  const { mutate: generateDocument } = generateDocumentMutation;
  const credentialDocument = generateDocumentMutation.data?.data;

  const verificationUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const seminaryUrl =
      process.env.NEXT_PUBLIC_SEMINARY_URL?.replace(/\/$/, "") ??
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "https://seminary.pearlchaplaincy.org");

    if (selectedDestination === "STUDENT_ID") {
      return student?.id
        ? `${seminaryUrl}/student/${encodeURIComponent(student.id)}`
        : "";
    }

    return credentialDocument?.verificationToken
      ? `${seminaryUrl}/credentials/verify/${encodeURIComponent(
          credentialDocument.verificationToken,
        )}`
      : "";
  }, [credentialDocument, selectedDestination, student?.id]);

  const isGenerating =
    selectedDestination === "CREDENTIAL" &&
    open &&
    (generateDocumentMutation.isPending ||
      (Boolean(verificationUrl) && generatedForUrl !== verificationUrl));
  const visibleQrDataUrl =
    generatedForUrl === verificationUrl ? qrDataUrl : null;
  const errorMessage = generateDocumentMutation.error
    ? toApiError(generateDocumentMutation.error).message
    : null;

  useEffect(() => {
    if (!open || !student?.id || selectedDestination !== "CREDENTIAL") return;

    generateDocument({
      payload: { type: selectedType },
      studentId: student.id,
    });
  }, [generateDocument, open, selectedDestination, selectedType, student?.id]);

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
    link.download = `${buildFileBaseName(student)}-${
      selectedDestination === "STUDENT_ID" ? "student-id" : "authenticity"
    }-qr.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] w-[min(calc(100vw-2rem),42rem)] max-w-none! overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Student QR Code</DialogTitle>
          <DialogDescription>
            Generate a public student-ID profile or credential verification QR code for{" "}
            {student?.name ?? "this student"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid min-w-0 gap-3">
            <div className="min-w-0 overflow-hidden rounded-lg border bg-muted/30 px-3">
              <p className="mt-1.5 truncate text-sm font-medium text-foreground">
                {verificationUrl || "Generating..."}
              </p>
            </div>

            <Select
              value={selectedDestination}
              onValueChange={(value) =>
                setSelectedDestination(value as QrCodeDestination)
              }
            >
              <SelectTrigger className="w-full min-w-0">
                <SelectValue placeholder="QR destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT_ID">Student ID profile</SelectItem>
                <SelectItem value="CREDENTIAL">Credential document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedDestination === "CREDENTIAL" ? (
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
          ) : null}

          {selectedDestination === "CREDENTIAL" && credentialDocument ? (
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

          {selectedDestination === "CREDENTIAL" && errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex min-h-80 min-w-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-6">
            {isGenerating ? (
              <div className="text-muted-foreground flex h-64 w-64 items-center justify-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                Generating credential QR code...
              </div>
            ) : visibleQrDataUrl ? (
              <Image
                src={visibleQrDataUrl}
                alt={`${selectedDestination === "STUDENT_ID" ? "Student ID" : "Credential authenticity"} QR code for ${student?.name ?? "student"}`}
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
                Open {selectedDestination === "STUDENT_ID" ? "student profile" : "verification"}
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
