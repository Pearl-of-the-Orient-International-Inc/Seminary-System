"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Mail, Phone, ShieldCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";

export const applySteps = [
  {
    title: "Online Application Form",
    shortTitle: "Application Form",
    href: "/apply/step-1",
  },
  {
    title: "Submission of Requirements",
    shortTitle: "Requirements",
    href: "/apply/step-2",
  },
  {
    title: "Payment of Admission Fee",
    shortTitle: "Payment",
    href: "/apply/step-3",
  },
  {
    title: "Review",
    shortTitle: "Review",
    href: "/apply/step-4",
  },
];

const reminders = [
  "Please review all information carefully before submitting.",
  "All fields marked with * are required.",
  "Upload clear and valid documents.",
  "You can save your progress and continue later.",
];

export const APPLY_DRAFT_STORAGE_KEY = "potsc-application-draft-v1";
const APPLY_DRAFT_FIELD_EVENT = "potsc-application-draft-field";

type ApplyDraft = Record<string, string>;

const toFieldName = (label: string) =>
  label
    .replace(/\*/g, "")
    .replace(/#/g, "number")
    .replace(/\([^)]*\)/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

const readDraft = (): ApplyDraft => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(
      window.localStorage.getItem(APPLY_DRAFT_STORAGE_KEY) ?? "{}"
    ) as ApplyDraft;
  } catch {
    return {};
  }
};

const writeDraftField = (name: string, value: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const nextDraft = {
    ...readDraft(),
    [name]: value,
  };

  window.localStorage.setItem(
    APPLY_DRAFT_STORAGE_KEY,
    JSON.stringify(nextDraft)
  );

  window.dispatchEvent(
    new CustomEvent(APPLY_DRAFT_FIELD_EVENT, {
      detail: { name, value },
    })
  );
};

export const getApplyDraft = () => readDraft();

const requiredStepOneFields: [string, string][] = [
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
  ["Name of Church You Attended", "name_of_church_you_attended"],
  ["Church Address", "church_address"],
  ["Name of Pastor", "name_of_pastor"],
  ["Contact Number", "contact_number"],
  ["Ministry Involved", "ministry_you_involved"],
  ["Program Level", "program_level"],
  ["Program/Course", "program_course"],
  ["High School", "high_school"],
  ["High School Year Graduated", "high_school_year_graduated"],
];

const hasValue = (value?: string) => Boolean(value?.trim());

const countWords = (value?: string) =>
  value?.trim().split(/\s+/).filter(Boolean).length ?? 0;

export const validateApplyStep = (step: 1 | 2 | 3) => {
  const draft = readDraft();

  if (step === 1) {
    const missingField = requiredStepOneFields.find(
      ([, fieldName]) => !hasValue(draft[fieldName])
    );

    if (missingField) {
      return {
        isValid: false,
        message: `Please complete the required field: ${missingField[0]}.`,
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email_address)) {
      return {
        isValid: false,
        message: "Please enter a valid email address.",
      };
    }

    if (!/^\d{11}$/.test(draft.mobile_phone)) {
      return {
        isValid: false,
        message: "Mobile phone must be exactly 11 digits.",
      };
    }
  }

  if (step === 2) {
    if (!hasValue(draft.brief_history_of_conversion)) {
      return {
        isValid: false,
        message: "Please write your brief history of conversion.",
      };
    }

    if (countWords(draft.brief_history_of_conversion) > 500) {
      return {
        isValid: false,
        message:
          "Brief history of conversion must be 500 words or fewer before continuing.",
      };
    }
  }

  if (step === 3) {
    if (!hasValue(draft.payment_type)) {
      return {
        isValid: false,
        message: "Please select a payment type.",
      };
    }

    if (!hasValue(draft.payment_method)) {
      return {
        isValid: false,
        message: "Please select a payment method.",
      };
    }

    if (
      draft.payment_type === "Partial Payment" &&
      (!hasValue(draft.payment_amount) || Number(draft.payment_amount) <= 0)
    ) {
      return {
        isValid: false,
        message: "Please enter the amount paid for partial payment.",
      };
    }

    if (!hasValue(draft.proof_of_receipt_file_url)) {
      return {
        isValid: false,
        message: "Please upload your proof of receipt before continuing.",
      };
    }
  }

  return {
    isValid: true,
    message: "",
  };
};

export const useApplyFormField = (name: string, initialValue = "") => {
  const [value, setValue] = React.useState(() => {
    const draft = readDraft();
    return draft[name] ?? initialValue;
  });

  const updateValue = React.useCallback(
    (nextValue: string) => {
      setValue(nextValue);
      writeDraftField(name, nextValue);
    },
    [name]
  );

  React.useEffect(() => {
    if (!initialValue) {
      return;
    }

    const draft = readDraft();

    if (!hasValue(draft[name])) {
      writeDraftField(name, initialValue);
    }
  }, [initialValue, name]);

  React.useEffect(() => {
    const handleDraftField = (event: Event) => {
      const customEvent = event as CustomEvent<{
        name?: string;
        value?: string;
      }>;

      if (customEvent.detail?.name === name) {
        setValue(customEvent.detail.value ?? "");
      }
    };

    window.addEventListener(APPLY_DRAFT_FIELD_EVENT, handleDraftField);

    return () => {
      window.removeEventListener(APPLY_DRAFT_FIELD_EVENT, handleDraftField);
    };
  }, [name]);

  return [value, updateValue] as const;
};

const getPlaceholder = (label: string) =>
  `Enter ${label.replace(" *", "").toLowerCase()}`;

const getInputType = (label: string) => {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("email")) {
    return "email";
  }

  if (normalizedLabel.includes("date")) {
    return "date";
  }

  if (normalizedLabel.includes("age")) {
    return "number";
  }

  if (
    normalizedLabel.includes("height") ||
    normalizedLabel.includes("weight")
  ) {
    return "number";
  }

  if (
    normalizedLabel.includes("mobile") ||
    normalizedLabel.includes("telephone") ||
    normalizedLabel.includes("phone") ||
    normalizedLabel.includes("contact")
  ) {
    return "tel";
  }

  return "text";
};

const getTodayDateString = () => new Date().toISOString().split("T")[0];

const computeAge = (birthDate: string) => {
  if (!birthDate) {
    return "";
  }

  const birthday = new Date(birthDate);

  if (Number.isNaN(birthday.getTime())) {
    return "";
  }

  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDifference = today.getMonth() - birthday.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthday.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "";
};

const getSelectOptions = (label: string) => {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("gender")) {
    return ["Male", "Female", "Prefer not to say"];
  }

  if (normalizedLabel.includes("civil status")) {
    return ["Single", "Married", "Widowed", "Separated", "Divorced"];
  }

  if (normalizedLabel.includes("nationality")) {
    return ["Filipino", "Foreign National"];
  }

  if (normalizedLabel.includes("educational attainment")) {
    return ["Senior High School", "Bachelor's Degree", "Master's Degree"];
  }

  if (normalizedLabel.includes("year graduated")) {
    return ["2026", "2025", "2024", "2023", "2022"];
  }

  if (normalizedLabel.includes("year level")) {
    return ["Grade 12", "1st Year", "2nd Year", "3rd Year", "4th Year"];
  }

  if (normalizedLabel.includes("academic level")) {
    return ["Certificate", "Undergraduate", "Masteral", "Doctorate"];
  }

  if (normalizedLabel.includes("program/course")) {
    return [
      "Certificate in Christian Discipleship",
      "Bachelor of Theology",
      "Master of Divinity",
      "Doctor of Ministry",
    ];
  }

  if (normalizedLabel.includes("specialization")) {
    return ["Christian Ministry", "Pastoral Care", "Chaplaincy", "Counseling"];
  }

  if (normalizedLabel.includes("school year")) {
    return ["2025-2026", "2026-2027"];
  }

  if (normalizedLabel.includes("semester")) {
    return ["1st Semester", "2nd Semester", "Summer"];
  }

  if (normalizedLabel.includes("mode of study")) {
    return ["On-site", "Online", "Blended Learning"];
  }

  return ["Option 1", "Option 2", "Option 3"];
};

export const FieldBox = ({
  label,
  className,
  isRequired = false,
  name,
}: {
  label: string;
  className?: string;
  isRequired?: boolean;
  name?: string;
}) => {
  const fieldName = name ?? toFieldName(label);
  const isAcademicYear = fieldName === "academic_year";
  const isBirthDate = fieldName === "date_of_birth";
  const isAge = fieldName === "age";
  const isMobilePhone = fieldName === "mobile_phone";
  const isNumericMeasurement = fieldName === "height" || fieldName === "weight";
  const [value, setValue] = useApplyFormField(
    fieldName,
    isAcademicYear ? "2026-2027" : ""
  );

  React.useEffect(() => {
    if (isAcademicYear && value !== "2026-2027") {
      setValue("2026-2027");
    }
  }, [isAcademicYear, setValue, value]);

  React.useEffect(() => {
    if (!isAge) {
      return;
    }

    const ageFromBirthDate = computeAge(readDraft().date_of_birth);

    if (ageFromBirthDate && value !== ageFromBirthDate) {
      setValue(ageFromBirthDate);
    }
  }, [isAge, setValue, value]);

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let nextValue = event.target.value;

    if (isMobilePhone) {
      nextValue = nextValue.replace(/\D/g, "").slice(0, 11);
    }

    if (isNumericMeasurement) {
      nextValue = nextValue.replace(/[^\d.]/g, "");
    }

    if (isBirthDate) {
      const today = getTodayDateString();

      if (nextValue > today) {
        nextValue = today;
      }

      writeDraftField("age", computeAge(nextValue));
    }

    setValue(nextValue);
  };

  return (
    <label className={cn("block", className)}>
      <p className="text-sm font-bold text-[#0b3327]">
        {label} {isRequired && <span className="text-destructive">*</span>}
      </p>
      <div className="relative mt-2">
        <Input
          name={fieldName}
          type={getInputType(label)}
          value={value}
          onChange={handleFieldChange}
          disabled={isAcademicYear || isAge}
          max={isBirthDate ? getTodayDateString() : undefined}
          maxLength={isMobilePhone ? 11 : undefined}
          min={isAge || isNumericMeasurement ? 0 : undefined}
          inputMode={
            isMobilePhone
              ? "numeric"
              : isNumericMeasurement || isAge
                ? "decimal"
                : undefined
          }
          pattern={isMobilePhone ? "[0-9]{11}" : undefined}
          placeholder={getPlaceholder(label)}
          className={cn(
            "h-9 border-[#0b3327]/10 bg-white text-sm shadow-none focus-visible:border-[#0b4b39] focus-visible:ring-3 focus-visible:ring-[#0b4b39]/12",
            (isAcademicYear || isAge) &&
              "cursor-not-allowed bg-[#f3f6f4] text-[#31463f]"
          )}
        />
      </div>
    </label>
  );
};

export const LegacySelectBox = ({
  label,
  placeholder = "Select option",
  className,
}: {
  label: string;
  placeholder?: string;
  className?: string;
}) => (
  <label className={cn("block", className)}>
    <span className="text-sm font-bold text-[#0b3327]">{label}</span>
    <div className="mt-2 flex h-11 items-center justify-between rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/60">
      {placeholder}
      <span className="text-[#0b4b39]">⌄</span>
    </div>
  </label>
);

export const SelectBox = ({
  label,
  placeholder = "Select option",
  className,
  options,
  isRequired = false,
  name,
  value,
  onValueChange,
}: {
  label: string;
  placeholder?: string;
  className?: string;
  options?: string[];
  isRequired?: boolean;
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const fieldName = name ?? toFieldName(label);
  const [persistedValue, setPersistedValue] = useApplyFormField(fieldName);
  const selectedValue = value ?? persistedValue;
  const updateValue = (nextValue: string) => {
    setPersistedValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div className={cn("block", className)}>
      <p className="text-sm font-bold text-[#0b3327]">
        {label} {isRequired && <span className="text-destructive">*</span>}
      </p>
      <Select value={selectedValue} onValueChange={updateValue}>
        <SelectTrigger className="mt-2 h-10 w-full border-[#0b3327]/10 bg-white text-sm text-[#31463f]/80 shadow-none focus-visible:border-[#0b4b39] focus-visible:ring-[#0b4b39]/12">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {(options ?? getSelectOptions(label)).map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={fieldName} value={selectedValue} />
    </div>
  );
};

export const TextAreaBox = ({
  label,
  placeholder,
  className,
  name,
  isRequired = false,
}: {
  label: string;
  placeholder: string;
  className?: string;
  name?: string;
  isRequired?: boolean;
}) => {
  const fieldName = name ?? toFieldName(label);
  const [value, setValue] = useApplyFormField(fieldName);

  return (
    <label className={cn("block", className)}>
      <p className="text-sm font-bold text-[#0b3327]">
        {label} {isRequired && <span className="text-destructive">*</span>}
      </p>
      <textarea
        name={fieldName}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-32 w-full rounded-md border border-[#0b3327]/10 bg-white px-4 py-3 text-sm leading-6 text-[#31463f] outline-none transition focus-visible:border-[#0b4b39] focus-visible:ring-3 focus-visible:ring-[#0b4b39]/12"
      />
    </label>
  );
};

export const ApplicationShell = ({
  activeStep,
  children,
}: {
  activeStep: number;
  children: React.ReactNode;
}) => {
  const progress = Math.round((activeStep / applySteps.length) * 100);

  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-72 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/7821577/pexels-photo-7821577.jpeg"
          alt="Pearl of The Orient campus"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.98)_0%,rgba(0,52,39,0.88)_46%,rgba(0,52,39,0.48)_78%,rgba(0,52,39,0.32)_100%)]" />

        <div className="container mx-auto flex flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-20">
          <div>
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
              Online Application
            </h1>
            <nav className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/76">
              <Link href="/" className="hover:text-[#f5b739]">
                Home
              </Link>
              <span>›</span>
              <Link href="/admissions" className="hover:text-[#f5b739]">
                Admissions
              </Link>
              <span>›</span>
              <span className="text-[#f5b739]">Online Application</span>
            </nav>
          </div>

          <aside className="w-full rounded-md bg-[#003f2b] p-6 shadow-[0_16px_36px_rgba(0,0,0,0.28)] ring-1 ring-[#f5b739]/30 lg:max-w-sm">
            <h2 className="flex items-center gap-3 font-serif text-xl font-bold">
              <ShieldCheck className="size-6 text-[#f5b739]" />
              Need Help?
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/86">
              If you have questions, please contact our Admissions Office.
            </p>
            <div className="mt-4 space-y-2 text-sm font-semibold">
              <p className="flex items-center gap-3">
                <Mail className="size-4 text-[#f5b739]" />
                admissions@potc.edu.ph
              </p>
              <p className="flex items-center gap-3">
                <Phone className="size-4 text-[#f5b739]" />
                (043) 123-4567
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-20">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
              <h2 className="text-lg font-bold">Application Progress</h2>
              <p className="mt-2 text-sm text-[#31463f]">
                Step {activeStep} of {applySteps.length}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#0b3327]/10">
                  <div
                    className="h-full rounded-full bg-[#f5b739]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold">{progress}%</span>
              </div>

              <div className="mt-7 space-y-5">
                {applySteps.map((step, index) => {
                  const stepNumber = index + 1;
                  const isComplete = stepNumber < activeStep;
                  const isActive = stepNumber === activeStep;

                  return (
                    <Link
                      key={step.title}
                      href={step.href}
                      className="flex items-center gap-4 text-sm font-semibold"
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                          isComplete
                            ? "bg-[#0b4b39] text-white"
                            : isActive
                              ? "bg-[#f5b739] text-[#073722]"
                              : "bg-[#e8eeeb] text-[#31463f]",
                        )}
                      >
                        {isComplete ? <Check className="size-5" /> : stepNumber}
                      </span>
                      <span>{step.shortTitle}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="rounded-md bg-[#fffaf0] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#f5b739]/20">
              <h2 className="font-serif text-lg font-bold">
                Important Reminders
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[#31463f]">
                {reminders.map((reminder) => (
                  <li key={reminder}>{reminder}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-md bg-[#003f2b] p-6 text-white shadow-[0_12px_30px_rgba(10,51,39,0.16)]">
              <h2 className="flex items-center gap-3 font-serif text-lg font-bold">
                <ShieldCheck className="size-6 text-[#f5b739]" />
                Your Information is Secure
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/82">
                We value your privacy. All information submitted is encrypted
                and used solely for admission purposes.
              </p>
            </section>
          </aside>

          <div>{children}</div>
        </div>
      </section>
    </main>
  );
};
