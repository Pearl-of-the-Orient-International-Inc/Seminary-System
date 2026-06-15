"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Edit3, Send } from "lucide-react";

import {
  APPLY_DRAFT_STORAGE_KEY,
  ApplicationShell,
  getApplyDraft,
} from "../_components/application-shell";
import { Button } from "@/components/ui/button";
import {
  toApiError,
  useUpsertCurrentSeminaryApplicationMutation,
} from "@/features/seminary/seminary.hooks";
import type { SeminaryApplicationPayload } from "@/features/seminary/seminary.types";

type Draft = Record<string, string>;

const reviewSections: {
  title: string;
  editHref: string;
  fields: [string, string][];
}[] = [
  {
    title: "Personal Information",
    editHref: "/apply/step-1",
    fields: [
      ["Academic Year", "academic_year"],
      ["Surname", "surname"],
      ["Given Name", "given_name"],
      ["Middle Name", "middle_name"],
      ["Email Address", "email_address"],
      ["Mobile Phone", "mobile_phone"],
      ["Home Address", "home_address"],
      ["Date of Birth", "date_of_birth"],
      ["Birth Place", "birth_place"],
      ["Age", "age"],
      ["Gender", "gender"],
      ["Height", "height"],
      ["Weight", "weight"],
      ["Civil Status", "civil_status"],
      ["Office Phone", "office_phone"],
    ],
  },
  {
    title: "Ministry",
    editHref: "/apply/step-1",
    fields: [
      ["Church Attended", "name_of_church_you_attended"],
      ["Church Address", "church_address"],
      ["Name of Pastor", "name_of_pastor"],
      ["Contact Number", "contact_number"],
      ["Ministry Involved", "ministry_you_involved"],
    ],
  },
  {
    title: "Curriculum of Interest",
    editHref: "/apply/step-1",
    fields: [
      ["Program Level", "program_level"],
      ["Program/Course", "program_course"],
    ],
  },
  {
    title: "Educational Background",
    editHref: "/apply/step-1",
    fields: [
      ["High School", "high_school"],
      ["High School Year Graduated", "high_school_year_graduated"],
      ["College School", "college_school"],
      ["College Course", "college_course"],
      ["College Year Graduated", "college_year_graduated"],
      ["Vocational School", "vocational_school"],
      ["Vocational Course", "vocational_course"],
      ["Vocational Year Graduated", "vocational_year_graduated"],
      ["Others School", "others_school"],
      ["Others Course", "others_course"],
      ["Others Year Graduated", "others_year_graduated"],
    ],
  },
  {
    title: "Uploaded Requirements",
    editHref: "/apply/step-2",
    fields: [
      ["Transcript of Records", "transcript_of_records_file_name"],
      ["2x2 ID Picture", "id_picture_file_name"],
      ["Pastor's Recommendation Letter", "pastor_recommendation_file_name"],
      ["Brief History of Conversion", "brief_history_of_conversion"],
    ],
  },
  {
    title: "Payment of Admission Fee",
    editHref: "/apply/step-3",
    fields: [
      ["Payment Type", "payment_type"],
      ["Payment Method", "payment_method"],
      ["Amount Paid", "payment_amount"],
      ["Proof of Receipt", "proof_of_receipt_file_name"],
      ["Total Amount Due", "total_amount_due"],
    ],
  },
];

const Page = () => {
  const router = useRouter();
  const [draft] = useState<Draft>(() => ({
    total_amount_due: "PHP 4,500.00",
    ...getApplyDraft(),
  }));
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const submitApplicationMutation =
    useUpsertCurrentSeminaryApplicationMutation();

  const applicationPayload = useMemo(
    (): SeminaryApplicationPayload => ({
      personalInformation: {
        academicYear: draft.academic_year ?? "2026-2027",
        surname: draft.surname ?? "",
        givenName: draft.given_name ?? "",
        middleName: draft.middle_name ?? "",
        emailAddress: draft.email_address ?? "",
        mobilePhone: draft.mobile_phone ?? "",
        homeAddress: draft.home_address ?? "",
        dateOfBirth: draft.date_of_birth ?? "",
        birthPlace: draft.birth_place ?? "",
        age: draft.age ?? "",
        gender: draft.gender ?? "",
        height: draft.height ?? "",
        weight: draft.weight ?? "",
        civilStatus: draft.civil_status ?? "",
        officePhone: draft.office_phone ?? "",
      },
      ministry: {
        churchAttended: draft.name_of_church_you_attended ?? "",
        churchAddress: draft.church_address ?? "",
        pastorName: draft.name_of_pastor ?? "",
        contactNumber: draft.contact_number ?? "",
        ministryInvolved: draft.ministry_you_involved ?? "",
      },
      curriculum: {
        programLevel: draft.program_level ?? "",
        programCourse: draft.program_course ?? "",
      },
      educationalBackground: {
        highSchool: draft.high_school ?? "",
        highSchoolYearGraduated: draft.high_school_year_graduated ?? "",
        collegeSchool: draft.college_school ?? "",
        collegeCourse: draft.college_course ?? "",
        collegeYearGraduated: draft.college_year_graduated ?? "",
        vocationalSchool: draft.vocational_school ?? "",
        vocationalCourse: draft.vocational_course ?? "",
        vocationalYearGraduated: draft.vocational_year_graduated ?? "",
        othersSchool: draft.others_school ?? "",
        othersCourse: draft.others_course ?? "",
        othersYearGraduated: draft.others_year_graduated ?? "",
      },
      requirements: {
        transcriptOfRecordsUrl: draft.transcript_of_records_file_url ?? "",
        transcriptOfRecordsFileName:
          draft.transcript_of_records_file_name ?? "",
        transcriptOfRecordsMimeType:
          draft.transcript_of_records_file_mime_type ?? "",
        transcriptOfRecordsFileSize:
          draft.transcript_of_records_file_size ?? "",
        idPictureUrl: draft.id_picture_file_url ?? "",
        idPictureFileName: draft.id_picture_file_name ?? "",
        idPictureMimeType: draft.id_picture_file_mime_type ?? "",
        idPictureFileSize: draft.id_picture_file_size ?? "",
        pastorRecommendationUrl:
          draft.pastor_recommendation_file_url ?? "",
        pastorRecommendationFileName:
          draft.pastor_recommendation_file_name ?? "",
        pastorRecommendationMimeType:
          draft.pastor_recommendation_file_mime_type ?? "",
        pastorRecommendationFileSize:
          draft.pastor_recommendation_file_size ?? "",
        briefHistoryOfConversion: draft.brief_history_of_conversion ?? "",
      },
      payment: {
        type: draft.payment_type ?? "",
        method: draft.payment_method ?? "",
        amountPaid: draft.payment_amount ?? "",
        proofOfReceiptUrl: draft.proof_of_receipt_file_url ?? "",
        proofOfReceiptFileName: draft.proof_of_receipt_file_name ?? "",
        proofOfReceiptMimeType: draft.proof_of_receipt_mime_type ?? "",
        proofOfReceiptFileSize: draft.proof_of_receipt_file_size ?? "",
        totalAmountDue: "PHP 4,500.00",
      },
    }),
    [draft]
  );

  const handleSubmit = async () => {
    setSubmitStatus(null);

    try {
      const response = await submitApplicationMutation.mutateAsync(
        applicationPayload
      );

      setSubmitStatus(
        response.message || "Your seminary application was submitted."
      );

      window.localStorage.removeItem(APPLY_DRAFT_STORAGE_KEY);
      router.replace("/");
    } catch (error) {
      const apiError = toApiError(error);
      const validationError = apiError.errors?.[0];

      setSubmitStatus(
        validationError
          ? `${validationError.path}: ${validationError.message}`
          : apiError.message ??
              "We could not submit your application yet. Please make sure you are logged in and try again."
      );
    }
  };

  return (
    <ApplicationShell activeStep={4}>
      <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
        <h2 className="font-serif text-2xl font-bold">4. Review</h2>
        <p className="mt-2 text-sm leading-6 text-[#31463f]">
          Please review all the information you have provided. Click Submit
          Application when you&apos;re ready.
        </p>

        <div className="mt-6 space-y-4">
          {reviewSections.map((section) => (
            <section
              key={section.title}
              className="rounded-md border border-[#0b3327]/10 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-xl font-bold">{section.title}</h3>
                <Button
                  asChild
                  variant="outline"
                  className="h-9 rounded-md bg-white px-3 text-xs font-bold text-[#0b4b39] shadow-none"
                >
                  <Link href={section.editHref}>
                    <Edit3 className="size-3" />
                    Edit
                  </Link>
                </Button>
              </div>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {section.fields.map(([label, key]) => (
                  <div key={`${section.title}-${key}`}>
                    <dt className="text-xs font-extrabold text-[#0b3327]">
                      {label}
                    </dt>
                    <dd className="mt-1 wrap-break-word text-sm text-[#31463f]">
                      {draft[key] || "Not provided"}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <section className="mt-6 grid gap-5 rounded-md bg-[#eef8ee] p-6">
          <div>
            <h3 className="font-serif text-2xl font-bold">
              You&apos;re Almost Set
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#31463f]">
              Please make sure every detail above is accurate before submitting.
              Once received, the Admissions Office will review your application,
              payment details, and any uploaded documents.
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[#31463f]">
              <li className="flex gap-2">
                <Check className="mt-1 size-4 shrink-0 text-[#0b4b39]" />
                You will receive an update after your application has been
                reviewed.
              </li>
              <li className="flex gap-2">
                <Check className="mt-1 size-4 shrink-0 text-[#0b4b39]" />
                Documents marked to follow may be submitted to the Admissions
                Office when available.
              </li>
              <li className="flex gap-2">
                <Check className="mt-1 size-4 shrink-0 text-[#0b4b39]" />
                Keep your payment receipt and contact details available for
                verification.
              </li>
            </ul>
            {submitStatus ? (
              <p className="mt-4 rounded-md bg-white px-4 py-3 text-sm font-semibold text-[#0b4b39]">
                {submitStatus}
              </p>
            ) : null}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-md bg-white px-5 text-sm font-bold text-[#0b4b39] shadow-none"
          >
            <Link href="/apply/step-3">
              <ArrowLeft className="size-4" />
              Previous
            </Link>
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitApplicationMutation.isPending}
            className="h-10 rounded-md bg-[#003f2b] px-6 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
          >
            {submitApplicationMutation.isPending
              ? "Submitting..."
              : "Submit Application"}
            <Send className="size-4" />
          </Button>
        </div>
      </section>
    </ApplicationShell>
  );
};

export default Page;
