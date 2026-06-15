"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Smartphone,
  Trash2,
  UploadCloud,
  WalletCards,
} from "lucide-react";

import {
  ApplicationShell,
  SelectBox,
  useApplyFormField,
  validateApplyStep,
} from "../_components/application-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  toApiError,
  useUploadSeminaryPaymentReceiptMutation,
} from "@/features/seminary/seminary.hooks";
import { useToast } from "@/hooks/use-toast";

const fees = [
  ["Registration Fee", "₱500.00","One-time, non-refundable registration fee"],
  ["Tuition Fee", "₱3,000.00", "Tuition fee for the current academic term"],
  ["School Uniform", "₱900.00", "Includes 2 sets of prescribed school uniform"],
  ["Technology Subscription", "₱100.00", "Access to online classes and virtual learning"],
];

const paymentMethods = [
  {
    title: "Bank Deposit / Bank Transfer",
    description: "Deposit or transfer the payment to our official bank account.",
    details:
      "Account Name: Pearl of The Orient Theological Seminary and Colleges",
    icon: Building2,
  },
  {
    title: "GCash",
    description: "Pay conveniently using your GCash account.",
    details:
      "Scan the QR code or enter our GCash number to complete your payment.",
    icon: Smartphone,
  },
  {
    title: "Maya",
    description: "Pay conveniently using your Maya account.",
    details:
      "Scan the QR code or enter our Maya number to complete your payment.",
    icon: WalletCards,
  },
];

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const Page = () => {
  const router = useRouter();
  const [validationMessage, setValidationMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useApplyFormField(
    "payment_method",
    paymentMethods[0].title
  );
  const [paymentType, setPaymentType] = useApplyFormField(
    "payment_type",
    "Full Payment"
  );
  const [paymentAmount, setPaymentAmount] = useApplyFormField(
    "payment_amount",
    "4500.00"
  );
  const [receiptFileName, setReceiptFileName] = useApplyFormField(
    "proof_of_receipt_file_name"
  );
  const [receiptFileSize, setReceiptFileSize] = useApplyFormField(
    "proof_of_receipt_file_size"
  );
  const [, setReceiptFileUrl] = useApplyFormField("proof_of_receipt_file_url");
  const [, setReceiptMimeType] = useApplyFormField(
    "proof_of_receipt_mime_type"
  );
  const [receiptUploadStatus, setReceiptUploadStatus] = useState<
    "idle" | "uploading" | "uploaded" | "failed"
  >("idle");
  const receiptUploadMutation = useUploadSeminaryPaymentReceiptMutation();
  const { toast } = useToast();

  const handleContinue = () => {
    if (paymentType === "Full Payment" && paymentAmount !== "4500.00") {
      setPaymentAmount("4500.00");
    }

    const result = validateApplyStep(3);

    if (!result.isValid) {
      setValidationMessage(result.message);
      return;
    }

    setValidationMessage("");
    router.push("/apply/step-4");
  };

  const handleReceiptFileChange = async (file: File) => {
    setReceiptFileName(file.name);
    setReceiptFileSize(formatFileSize(file.size));
    setReceiptUploadStatus("uploading");

    try {
      const uploaded = await receiptUploadMutation.mutateAsync(file);

      setReceiptFileUrl(uploaded.fileUrl);
      setReceiptFileName(uploaded.fileName ?? file.name);
      setReceiptMimeType(uploaded.mimeType ?? file.type);
      setReceiptFileSize(
        typeof uploaded.fileSize === "number"
          ? formatFileSize(uploaded.fileSize)
          : uploaded.fileSize || formatFileSize(file.size)
      );
      setReceiptUploadStatus("uploaded");
    } catch (error) {
      const apiError = toApiError(error);
      setReceiptFileUrl("");
      setReceiptMimeType("");
      setReceiptUploadStatus("failed");
      receiptUploadMutation.reset();
      toast({
        title: "Receipt upload failed",
        description:
          apiError.message ??
          "We could not upload your receipt yet. Please make sure you are logged in and try again.",
        variant: "error",
      });
    }
  };

  return (
    <ApplicationShell activeStep={3}>
      <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
        <h2 className="font-serif text-2xl font-bold">
          3. Payment of Admission Fee
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#31463f]">
          Please review the breakdown of fees, enter your payment amount, attach
          your receipt, and select your preferred payment method.
        </p>

        <section className="mt-6 rounded-md border border-[#0b3327]/10 p-5">
          <h3 className="font-serif text-xl font-bold">Breakdown of Fees</h3>
          <div className="mt-4 overflow-x-auto rounded-md border border-[#0b3327]/10">
            <table className="w-full min-w-162.5 text-left text-sm">
              <thead className="bg-[#f8faf9]">
                <tr>
                  <th className="px-4 py-3 font-bold">Description</th>
                  <th className="px-4 py-3 font-bold">Amount (₱)</th>
                  <th className="px-4 py-3 font-bold">Details</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(([description, amount, detail], index) => (
                  <tr
                    key={description}
                    className="border-t border-[#0b3327]/10"
                  >
                    <td className="px-4 py-4">{index + 1}. {description}</td>
                    <td className="px-4 py-4 font-semibold">{amount}</td>
                    <td className="px-4 py-4 text-[#31463f]">{detail}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#f8faf9]">
                <tr>
                  <td className="px-4 py-4 text-lg font-bold" colSpan={2}>
                    Total Amount Due
                  </td>
                  <td className="px-4 py-4 text-2xl font-extrabold text-[#003f2b]">
                    ₱ 4,500.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-md border border-[#0b3327]/10 p-5">
          <h3 className="font-serif text-xl font-bold">Payment Amount</h3>
          <p className="mt-2 text-sm leading-6 text-[#31463f]">
            You may pay the full amount or make a partial payment. Remaining
            balances will be reviewed by the Admissions Office.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SelectBox
              label="Payment Type"
              name="payment_type"
              placeholder="Select payment type"
              isRequired
              options={["Full Payment", "Partial Payment"]}
              value={paymentType}
              onValueChange={(nextPaymentType) => {
                setPaymentType(nextPaymentType);
                setPaymentAmount(
                  nextPaymentType === "Full Payment" ? "4500.00" : ""
                );
              }}
            />
            {paymentType === "Partial Payment" ? (
              <label className="block">
                <span className="text-sm font-bold text-[#0b3327]">
                  Amount Paid (₱) <span className="text-destructive">*</span>
                </span>
                <Input
                  name="payment_amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                  placeholder="Enter amount paid"
                  className="mt-1 h-9 border-[#0b3327]/10 bg-white text-sm shadow-none focus-visible:border-[#0b4b39] focus-visible:ring-3 focus-visible:ring-[#0b4b39]/12"
                />
              </label>
            ) : (
              <div>
                <p className="text-sm font-bold text-[#0b3327]">
                  Amount Paid (₱)
                </p>
                <div className="mt-2 flex h-10 items-center rounded-md border border-[#0b3327]/10 bg-[#f8faf9] px-3 text-sm font-bold text-[#0b4b39]">
                  ₱4,500.00
                </div>
                <input type="hidden" name="payment_amount" value="4500.00" />
              </div>
            )}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="font-serif text-xl font-bold">Select Payment Method</h3>
          <div className="mt-4 space-y-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.title;

              return (
                <label
                  key={method.title}
                  className={`grid cursor-pointer gap-4 rounded-md border p-5 transition lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.85fr)] ${
                    isSelected
                      ? "border-[#0b4b39] bg-[#fbfcfb]"
                      : "border-[#0b3327]/10 bg-white"
                  }`}
                >
                  <div className="flex gap-4">
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.title}
                      checked={isSelected}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="mt-1 size-5 shrink-0 accent-[#0b4b39]"
                    />
                    <Icon className="size-10 shrink-0 text-[#0b4b39]" />
                    <div>
                      <h4 className="font-bold">{method.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-[#31463f]">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-md bg-[#f8faf9] p-4 text-sm leading-6 text-[#31463f]">
                    {method.details}
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-md border border-[#0b3327]/10 p-5">
          <h3 className="font-serif text-xl font-bold">
            Proof of Receipt Attachment
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#31463f]">
            Upload a screenshot or scanned copy of your payment receipt.
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div className="rounded-md bg-[#f8faf9] p-4 text-sm leading-6 text-[#31463f]">
              Accepted formats: PDF, JPG, PNG
              <br />
              Max file size: 5MB
              <br />
              Include your name and payment reference number if available.
            </div>
            <div>
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#0b3327]/20 bg-[#fbfcfb] p-4 text-center transition hover:border-[#0b4b39]/45">
                <UploadCloud className="size-9 text-[#0b4b39]" />
                <p className="mt-2 text-sm font-semibold">
                  Drag and drop receipt here
                </p>
                <p className="text-xs text-[#31463f]">or click to browse</p>
                <input
                  name="proof_of_receipt_file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (!file) {
                      return;
                    }

                    void handleReceiptFileChange(file);
                  }}
                />
              </label>
              {receiptFileName ? (
                <>
                  <div className="mt-3 flex items-center justify-between rounded-md bg-[#f8faf9] px-3 py-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="size-4 shrink-0 text-[#0b4b39]" />
                      <span className="truncate text-[#0b4b39] underline">
                        {receiptFileName}
                      </span>
                    </span>
                    <span className="ml-3 flex shrink-0 items-center gap-3 text-xs text-[#31463f]">
                      {receiptFileSize}
                      <button
                        type="button"
                      onClick={() => {
                        setReceiptFileName("");
                        setReceiptFileSize("");
                        setReceiptFileUrl("");
                        setReceiptMimeType("");
                        setReceiptUploadStatus("idle");
                      }}
                        aria-label="Remove proof of receipt"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </span>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#14713f]">
                    <CheckCircle2 className="size-4" />
                    {receiptUploadStatus === "uploading"
                      ? "Uploading receipt..."
                      : receiptFileName && receiptUploadStatus === "uploaded"
                        ? "Receipt uploaded and remembered"
                      : receiptUploadStatus === "failed"
                        ? "Receipt selected, upload failed"
                        : "Receipt selected, upload pending"}
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-6 flex items-center gap-2 rounded-md bg-[#eef8ee] px-4 py-3 text-sm text-[#31463f]">
          <CheckCircle2 className="size-4 text-[#0b4b39]" />
          Partial payments are accepted. Your application will be processed once
          the attached receipt is verified.
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-md bg-white px-5 text-sm font-bold text-[#0b4b39] shadow-none"
          >
            <Link href="/apply/step-2">
              <ArrowLeft className="size-4" />
              Previous
            </Link>
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            className="h-10 rounded-md bg-[#003f2b] px-6 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
          >
            Continue to Review
            <ArrowRight className="size-4" />
          </Button>
        </div>
        {validationMessage ? (
          <p className="mt-4 rounded-md bg-[#fff2f0] px-4 py-3 text-sm font-semibold text-[#b42318] ring-1 ring-[#f1b7ad]">
            {validationMessage}
          </p>
        ) : null}
      </section>
    </ApplicationShell>
  );
};

export default Page;
