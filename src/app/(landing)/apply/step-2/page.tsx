"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Trash2, UploadCloud } from "lucide-react";

import {
  ApplicationShell,
  TextAreaBox,
  useApplyFormField,
  validateApplyStep,
} from "../_components/application-shell";
import { Button } from "@/components/ui/button";
import {
  toApiError,
  useUploadSeminaryRequirementMutation,
} from "@/features/seminary/seminary.hooks";
import { useToast } from "@/hooks/use-toast";

const uploads = [
  {
    title: "Transcript of Records (TOR) - To Follow",
    description:
      "Upload a certified true copy of your Transcript of Records from your last school attended, or submit it later.",
    name: "transcript_of_records_file",
  },
  {
    title: "2 pcs 2x2 ID Picture - To Follow",
    description:
      "Upload two recent 2x2 ID pictures with white background, or submit them later.",
    name: "id_picture_file",
  },
  {
    title: "Pastor's Recommendation Letter - To Follow",
    description:
      "Upload a recommendation letter from your pastor, or submit it later.",
    name: "pastor_recommendation_file",
  },
];

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const UploadRequirement = ({
  upload,
  index,
}: {
  upload: (typeof uploads)[number];
  index: number;
}) => {
  const [fileName, setFileName] = useApplyFormField(`${upload.name}_name`);
  const [fileSize, setFileSize] = useApplyFormField(`${upload.name}_size`);
  const [fileUrl, setFileUrl] = useApplyFormField(`${upload.name}_url`);
  const [, setMimeType] = useApplyFormField(`${upload.name}_mime_type`);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "uploaded" | "failed"
  >("idle");
  const uploadMutation = useUploadSeminaryRequirementMutation();
  const { toast } = useToast();

  const handleFileChange = async (file: File) => {
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setUploadStatus("uploading");

    try {
      const uploaded = await uploadMutation.mutateAsync(file);

      setFileUrl(uploaded.fileUrl);
      setFileName(uploaded.fileName ?? file.name);
      setMimeType(uploaded.mimeType ?? file.type);
      setFileSize(
        typeof uploaded.fileSize === "number"
          ? formatFileSize(uploaded.fileSize)
          : uploaded.fileSize || formatFileSize(file.size)
      );
      setUploadStatus("uploaded");
    } catch (error) {
      const apiError = toApiError(error);
      setFileUrl("");
      setMimeType("");
      setUploadStatus("failed");
      uploadMutation.reset();
      toast({
        title: "Upload failed",
        description:
          apiError.message ??
          "We could not upload this file yet. Please make sure you are logged in and try again.",
        variant: "error",
      });
    }
  };

  return (
    <article className="grid gap-5 rounded-md border border-[#0b3327]/10 p-5 lg:grid-cols-[minmax(0,1fr)_330px]">
      <div>
        <h3 className="font-bold">
          {index + 1}. {upload.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#31463f]">
          {upload.description}
        </p>
        <p className="mt-5 text-xs text-[#31463f]/75">
          Accepted formats: PDF, JPG, PNG <span className="px-3">|</span>
          Max size: 5MB
        </p>
      </div>
      <div>
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#0b3327]/20 bg-[#fbfcfb] p-4 text-center transition hover:border-[#0b4b39]/45">
          <UploadCloud className="size-9 text-[#0b4b39]" />
          <p className="mt-2 text-sm font-semibold">
            Drag and drop file here
          </p>
          <p className="text-xs text-[#31463f]">or click to browse</p>
          <input
            name={upload.name}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              void handleFileChange(file);
            }}
          />
        </label>
        {fileName ? (
          <>
            <div className="mt-3 flex items-center justify-between rounded-md bg-[#f8faf9] px-3 py-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <FileText className="size-4 shrink-0 text-[#0b4b39]" />
                <span className="truncate text-[#0b4b39] underline">
                  {fileName}
                </span>
              </span>
              <span className="ml-3 flex shrink-0 items-center gap-3 text-xs text-[#31463f]">
                {fileSize}
                <button
                  type="button"
                  onClick={() => {
                    setFileName("");
                    setFileSize("");
                    setFileUrl("");
                    setMimeType("");
                    setUploadStatus("idle");
                  }}
                  aria-label={`Remove ${upload.title}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </span>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#14713f]">
              <CheckCircle2 className="size-4" />
              {uploadStatus === "uploading"
                ? "Uploading file..."
                : fileUrl
                  ? "File uploaded and remembered"
                : uploadStatus === "failed"
                  ? "File selected, upload failed"
                  : "File selected, upload pending"}
            </p>
          </>
        ) : null}
      </div>
    </article>
  );
};

const Page = () => {
  const router = useRouter();
  const [validationMessage, setValidationMessage] = useState("");

  const handleContinue = () => {
    const result = validateApplyStep(2);

    if (!result.isValid) {
      setValidationMessage(result.message);
      return;
    }

    setValidationMessage("");
    router.push("/apply/step-3");
  };

  return (
    <ApplicationShell activeStep={2}>
      <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
        <h2 className="font-serif text-2xl font-bold">
          2. Submission of Requirements
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#31463f]">
          Upload documents now if available. TOR, 2x2 ID picture, and
          pastor&apos;s recommendation letter may be submitted later.
        </p>

        <div className="mt-6 space-y-5">
          {uploads.map((upload, index) => (
            <UploadRequirement
              key={upload.title}
              upload={upload}
              index={index}
            />
          ))}

          <article className="rounded-md border border-[#0b3327]/10 p-5">
            <TextAreaBox
              label="Brief History of Conversion"
              placeholder="I came to know the Lord Jesus Christ as my personal Savior and have continued to grow in faith through prayer, reading the Bible, and serving in my local church."
              name="brief_history_of_conversion"
              isRequired
            />
            <p className="mt-2 text-xs text-[#31463f]/75">
              Maximum of 500 words.
            </p>
          </article>
        </div>

        <div className="mt-6 rounded-md bg-[#eef8ee] px-4 py-3 text-sm text-[#31463f]">
          You may continue even if these documents are still to follow.
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-md bg-white px-5 text-sm font-bold text-[#0b4b39] shadow-none"
          >
            <Link href="/apply/step-1">
              <ArrowLeft className="size-4" />
              Previous
            </Link>
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            className="h-10 rounded-md bg-[#003f2b] px-6 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
          >
            Continue to Payment
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
