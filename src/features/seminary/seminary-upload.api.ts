import { genUploader } from "uploadthing/client";
import { API_BASE_URL } from "@/lib/http-client";
import type { SeminaryUploadedFile } from "./seminary.types";

const requirementsUploader = genUploader({
  url: `${API_BASE_URL}/seminary/requirements/upload`,
});

const paymentReceiptUploader = genUploader({
  url: `${API_BASE_URL}/seminary/payment-receipts/upload`,
});

const getServerData = (uploaded: unknown): SeminaryUploadedFile => {
  const item = uploaded as { serverData?: SeminaryUploadedFile };

  if (!item.serverData?.fileUrl) {
    throw new Error("Upload completed but no file URL was returned.");
  }

  return item.serverData;
};

export async function uploadSeminaryRequirement(file: File) {
  const uploaded = await requirementsUploader.uploadFiles(
    "seminaryRequirementUploader",
    {
      files: [file],
    }
  );

  return getServerData(uploaded?.[0]);
}

export async function uploadSeminaryPaymentReceipt(file: File) {
  const uploaded = await paymentReceiptUploader.uploadFiles(
    "seminaryPaymentReceiptUploader",
    {
      files: [file],
    }
  );

  return getServerData(uploaded?.[0]);
}
