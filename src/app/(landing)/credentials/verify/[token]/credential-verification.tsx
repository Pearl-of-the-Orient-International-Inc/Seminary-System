"use client";

import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, CircleAlert, FileCheck2, LoaderCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  verifyMemberCredentialDocument,
  verifySeminaryCredentialDocument,
} from "@/features/seminary/seminary.api";
import type {
  MemberCredentialDocument,
  MemberCredentialDocumentType,
  SeminaryCredentialDocument,
  SeminaryCredentialDocumentType,
} from "@/features/seminary/seminary.types";

const documentTypeLabelMap: Record<SeminaryCredentialDocumentType, string> = {
  CERTIFICATE: "Certificate",
  DIPLOMA: "Diploma",
  TRANSCRIPT: "Transcript",
};
const memberDocumentTypeLabelMap: Record<MemberCredentialDocumentType, string> = {
  CERTIFICATE: "Certificate",
  RECOGNITION: "Recognition",
};

type CredentialVerificationProps = {
  token: string;
};

export function CredentialVerification({ token }: CredentialVerificationProps) {
  const verificationQuery = useQuery({
    queryKey: ["seminary", "credential-document", "verify", token],
    queryFn: async () => {
      try {
        const response = await verifySeminaryCredentialDocument(token);
        return { kind: "seminary" as const, document: response.data };
      } catch {
        const response = await verifyMemberCredentialDocument(token);
        return { kind: "member" as const, document: response.data };
      }
    },
    retry: false,
    staleTime: 60_000,
  });

  const result = verificationQuery.data;
  const document = result?.document;
  const isMemberDocument = result?.kind === "member";
  const memberDocument = isMemberDocument
    ? (document as MemberCredentialDocument | undefined)
    : undefined;
  const seminaryDocument = !isMemberDocument
    ? (document as SeminaryCredentialDocument | undefined)
    : undefined;
  const personName = [
    memberDocument?.member?.firstName ?? seminaryDocument?.application?.givenName,
    seminaryDocument?.application?.middleName,
    memberDocument?.member?.lastName ?? seminaryDocument?.application?.surname,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-950">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-3 py-1 text-sm font-medium text-emerald-900">
            <FileCheck2 className="size-4" />
            Pearl of the Orient Theological Seminary and Colleges
          </div>
          <h1 className="font-serif text-4xl">Credential Verification</h1>
          <p className="text-muted-foreground max-w-2xl">
            This page confirms whether a diploma, certificate, or transcript was
            issued by Pearl of the Orient records office.
          </p>
        </div>

        <Card className="border-emerald-900/10 shadow-sm">
          <CardContent className="p-8">
            {verificationQuery.isLoading ? (
              <div className="text-muted-foreground flex min-h-80 items-center justify-center gap-2">
                <LoaderCircle className="size-5 animate-spin" />
                Verifying credential...
              </div>
            ) : document ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <BadgeCheck className="size-6" />
                      <span className="text-lg font-semibold">
                        Verified Authentic
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      Record matched active credential document.
                    </p>
                  </div>
                  <Badge variant="success" className="rounded-full">
                    {document.status}
                  </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <VerificationField
                    label="Document Number"
                    value={document.documentNumber}
                  />
                  <VerificationField
                    label="Document Type"
                    value={
                      isMemberDocument
                        ? memberDocumentTypeLabelMap[
                            memberDocument?.type as MemberCredentialDocumentType
                          ]
                        : documentTypeLabelMap[
                            seminaryDocument?.type as SeminaryCredentialDocumentType
                          ]
                    }
                  />
                  <VerificationField
                    label={isMemberDocument ? "Member" : "Student"}
                    value={personName || "No name on record"}
                  />
                  {isMemberDocument ? (
                    <VerificationField
                      label="Member ID"
                      value={memberDocument?.member?.uniqueId ?? "N/A"}
                    />
                  ) : (
                    <>
                      <VerificationField
                        label="Student Number"
                        value={seminaryDocument?.application?.studentId ?? "N/A"}
                      />
                      <VerificationField
                        label="Program"
                        value={seminaryDocument?.application?.programCourse ?? "N/A"}
                      />
                    </>
                  )}
                  <VerificationField
                    label="Issued"
                    value={new Date(document.issuedAt).toLocaleDateString()}
                  />
                </div>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-center">
                <div className="rounded-full bg-red-50 p-3 text-red-700">
                  <CircleAlert className="size-7" />
                </div>
                <h2 className="text-xl font-semibold">Credential Not Verified</h2>
                <p className="text-muted-foreground max-w-md">
                  No active credential document matched this QR code.
                  Contact records office if document should be valid.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function VerificationField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-muted-foreground text-xs font-medium uppercase">
        {label}
      </div>
      <div className="mt-2 font-medium">{value}</div>
    </div>
  );
}
