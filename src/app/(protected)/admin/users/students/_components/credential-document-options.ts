import type { SeminaryCredentialDocumentType } from "@/features/seminary/seminary.types";

export const credentialDocumentTypeOptions: Array<{
  label: string;
  value: SeminaryCredentialDocumentType;
}> = [
  { label: "Certificate", value: "CERTIFICATE" },
  { label: "Diploma", value: "DIPLOMA" },
  { label: "Transcript", value: "TRANSCRIPT" },
];

export const credentialDocumentTypeLabelMap: Record<
  SeminaryCredentialDocumentType,
  string
> = {
  CERTIFICATE: "Certificate",
  DIPLOMA: "Diploma",
  TRANSCRIPT: "Transcript",
};
