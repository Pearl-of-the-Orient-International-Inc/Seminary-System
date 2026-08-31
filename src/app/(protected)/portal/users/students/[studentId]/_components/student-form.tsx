"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  useForm,
  useWatch,
} from "react-hook-form";
import { ArrowLeft, SaveIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  toApiError,
  useCreateSeminaryStudentMutation,
  useSeminaryStudentQuery,
  useUpdateSeminaryStudentMutation,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryApplicationDetails,
  SeminaryStudentPayload,
} from "@/features/seminary/seminary.types";

import {
  academicYearOptions,
  type ProgramLevel,
} from "../../_components/student-data";
import { getProgramsByLevel, programLevelOptions } from "./program-options";

type StudentFormMode = "create" | "update";
type Requirement = "required" | "optional";

type SelectOption = {
  label: string;
  value: string;
};

type BaseFieldProps<TFieldValues extends FieldValues> = {
  className: string;
  control: Control<TFieldValues>;
  disabled?: boolean;
  label: string;
  name: FieldPath<TFieldValues>;
  placeholder: string;
  requirement?: Requirement;
};

type TextFormFieldProps<TFieldValues extends FieldValues> =
  BaseFieldProps<TFieldValues> & {
    type?: "email" | "tel" | "text";
  };

type SelectFormFieldProps<TFieldValues extends FieldValues> =
  BaseFieldProps<TFieldValues> & {
    options: SelectOption[];
  };

type TextareaFormFieldProps<TFieldValues extends FieldValues> =
  BaseFieldProps<TFieldValues>;

const STUDENT_NUMBER_PREFIX = "POTSC";

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

const optionalString = z.string().trim().optional();

const formSchema = z.object({
  academicYear: requiredString("Academic year"),
  birthPlace: optionalString,
  churchAddress: optionalString,
  churchName: optionalString,
  civilStatus: optionalString,
  contactNumber: requiredString("Contact number"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  enrollmentType: requiredString("Enrollment type"),
  givenName: requiredString("Given name"),
  homeAddress: optionalString,
  id: requiredString("Student ID"),
  middleName: optionalString,
  ministryInvolved: optionalString,
  pastorContactNumber: optionalString,
  pastorName: optionalString,
  program: requiredString("Curriculum of interest"),
  programLevel: requiredString("Program level"),
  schoolAffiliation: requiredString("School affiliation"),
  status: requiredString("Status"),
  surname: requiredString("Surname"),
  townCity: requiredString("Town/City"),
  yearLevel: requiredString("Year level"),
});

type StudentFormValues = z.infer<typeof formSchema>;

type StudentFormProps = {
  mode: StudentFormMode;
  studentId: string;
};

const enrollmentTypeOptions: SelectOption[] = [
  { label: "Regular", value: "Regular" },
  { label: "Transferee", value: "Transferee" },
  { label: "Cross Enrollee", value: "Cross Enrollee" },
];

const schoolAffiliationOptions: SelectOption[] = [
  { label: "In-House", value: "In-House" },
  { label: "Partner School", value: "Partner School" },
];

const statusOptions: SelectOption[] = [
  { label: "Active", value: "Active" },
  { label: "Graduating", value: "Graduating" },
  { label: "Leave of Absence", value: "Leave of Absence" },
  { label: "Inactive", value: "Inactive" },
];

const yearLevelOptions: SelectOption[] = [
  { label: "Foundation", value: "Foundation" },
  { label: "1st Year", value: "1st Year" },
  { label: "2nd Year", value: "2nd Year" },
  { label: "3rd Year", value: "3rd Year" },
  { label: "4th Year", value: "4th Year" },
  { label: "Residency", value: "Residency" },
  { label: "Dissertation", value: "Dissertation" },
];

const academicYearSelectOptions = academicYearOptions.map((academicYear) => ({
  label: academicYear,
  value: academicYear,
}));

const formatStudentNumber = () =>
  `${STUDENT_NUMBER_PREFIX}-${String(new Date().getFullYear()).slice(-2)}-0001`;

const programLevelLabelMap: Record<string, ProgramLevel> = {
  CERTIFICATE: "Certificate",
  BACHELOR: "Bachelor",
  MASTER_WITH_THESIS: "Masteral",
  DOCTORATE_WITH_DISSERTATION: "Doctorate",
};

const enrollmentTypeLabelMap: Record<string, string> = {
  REGULAR: "Regular",
  TRANSFEREE: "Transferee",
  CROSS_ENROLLEE: "Cross Enrollee",
};

const schoolAffiliationLabelMap: Record<string, string> = {
  IN_HOUSE: "In-House",
  PARTNER_SCHOOL: "Partner School",
};

const studentStatusLabelMap: Record<string, string> = {
  ACTIVE: "Active",
  GRADUATING: "Graduating",
  LEAVE_OF_ABSENCE: "Leave of Absence",
  INACTIVE: "Inactive",
};

const civilStatusLabelMap: Record<string, string> = {
  SINGLE: "Single",
  MARRIED: "Married",
  WIDOWED: "Widowed",
  SEPARATED: "Separated",
  ANNULLED: "Annulled",
};

const createDefaultValues = (
  mode: StudentFormMode,
  studentId: string,
  student?: SeminaryApplicationDetails,
): StudentFormValues => {
  return {
    id:
      student?.studentId ??
      (mode === "create" ? formatStudentNumber() : studentId),
    surname: student?.surname ?? "",
    givenName: student?.givenName ?? "",
    middleName: student?.middleName ?? "",
    email: student?.emailAddress ?? "",
    contactNumber: student?.mobilePhone ?? "",
    townCity: student?.homeAddress ?? "",
    homeAddress: student?.homeAddress ?? "",
    birthPlace: student?.birthPlace ?? "",
    civilStatus: student?.civilStatus
      ? (civilStatusLabelMap[student.civilStatus] ?? student.civilStatus)
      : "",
    churchName: student?.churchAttended ?? "",
    churchAddress: student?.churchAddress ?? "",
    pastorName: student?.pastorName ?? "",
    pastorContactNumber: student?.contactNumber ?? "",
    ministryInvolved: student?.ministryInvolved ?? "",
    programLevel: student?.programLevel
      ? (programLevelLabelMap[student.programLevel] ?? "Certificate")
      : "Certificate",
    program: student?.programCourse ?? "",
    yearLevel: student?.yearLevel ?? "Foundation",
    academicYear: student?.academicYear ?? academicYearOptions[0],
    enrollmentType: student?.enrollmentType
      ? (enrollmentTypeLabelMap[student.enrollmentType] ?? "Regular")
      : "Regular",
    schoolAffiliation: student?.schoolAffiliation
      ? (schoolAffiliationLabelMap[student.schoolAffiliation] ?? "In-House")
      : "In-House",
    status: student?.studentStatus
      ? (studentStatusLabelMap[student.studentStatus] ?? "Active")
      : "Active",
  };
};

const FormFieldLabel = ({
  children,
  requirement,
}: {
  children: string;
  requirement?: Requirement;
}) => (
  <FieldLabel className="flex w-auto! gap-1">
    <span>{children}</span>
    {requirement === "required" && <span className="text-destructive">*</span>}
    {requirement === "optional" && (
      <span className="text-muted-foreground">(optional)</span>
    )}
  </FieldLabel>
);

const TextFormField = <TFieldValues extends FieldValues>({
  className,
  control,
  disabled,
  label,
  name,
  placeholder,
  requirement,
  type = "text",
}: TextFormFieldProps<TFieldValues>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field
        className={`${className} flex flex-col items-start gap-2 space-y-0`}
        data-invalid={fieldState.invalid}
      >
        <FormFieldLabel requirement={requirement}>{label}</FormFieldLabel>
        <Input
          disabled={disabled}
          placeholder={placeholder}
          type={type}
          {...field}
        />
        <div className="min-h-5">
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </div>
      </Field>
    )}
  />
);

const TextareaFormField = <TFieldValues extends FieldValues>({
  className,
  control,
  disabled,
  label,
  name,
  placeholder,
  requirement,
}: TextareaFormFieldProps<TFieldValues>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field
        className={`${className} flex flex-col items-start gap-2 space-y-0`}
        data-invalid={fieldState.invalid}
      >
        <FormFieldLabel requirement={requirement}>{label}</FormFieldLabel>
        <Textarea disabled={disabled} placeholder={placeholder} {...field} />
        <div className="min-h-5">
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </div>
      </Field>
    )}
  />
);

const SelectFormField = <TFieldValues extends FieldValues>({
  className,
  control,
  disabled,
  label,
  name,
  options,
  placeholder,
  requirement,
}: SelectFormFieldProps<TFieldValues>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field
        className={`${className} flex flex-col items-start gap-2 space-y-0`}
        data-invalid={fieldState.invalid}
      >
        <FormFieldLabel requirement={requirement}>{label}</FormFieldLabel>

        <Select
          disabled={disabled}
          name={field.name}
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="min-h-5">
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </div>
      </Field>
    )}
  />
);

const SectionTitle = ({
  subtitle,
  title,
}: {
  subtitle?: string;
  title: string;
}) => (
  <div className="space-y-1">
    <p className="font-semibold text-primary">{title}</p>
    {subtitle ? (
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    ) : null}
  </div>
);

export const StudentForm = ({ mode, studentId }: StudentFormProps) => {
  const router = useRouter();
  const isCreateMode = mode === "create";
  const studentQuery = useSeminaryStudentQuery(studentId, {
    enabled: !isCreateMode,
  });
  const createStudentMutation = useCreateSeminaryStudentMutation();
  const updateStudentMutation = useUpdateSeminaryStudentMutation();
  const serverStudent = studentQuery.data?.data;
  const defaultValues = useMemo(
    () => createDefaultValues(mode, studentId, serverStudent),
    [mode, serverStudent, studentId],
  );

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedProgramLevel = useWatch({
    control: form.control,
    name: "programLevel",
  }) as ProgramLevel;

  const programOptions = useMemo(
    () =>
      getProgramsByLevel(selectedProgramLevel).map((program) => ({
        label: program,
        value: program,
      })),
    [selectedProgramLevel],
  );

  const onProgramLevelChange = (value: string) => {
    form.setValue("programLevel", value as ProgramLevel, {
      shouldValidate: true,
    });
    form.setValue("program", "", { shouldDirty: true, shouldValidate: true });
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const onSubmit = async (values: StudentFormValues) => {
    const payload: SeminaryStudentPayload = {
      academicYear: values.academicYear,
      birthPlace: values.birthPlace ?? "",
      churchAddress: values.churchAddress ?? "",
      churchAttended: values.churchName ?? "",
      civilStatus: values.civilStatus ?? "",
      contactNumber: values.pastorContactNumber ?? "",
      emailAddress: values.email,
      enrollmentType: values.enrollmentType,
      givenName: values.givenName,
      homeAddress: values.homeAddress || values.townCity,
      middleName: values.middleName ?? "",
      ministryInvolved: values.ministryInvolved ?? "",
      mobilePhone: values.contactNumber,
      pastorName: values.pastorName ?? "",
      programCourse: values.program,
      programLevel: values.programLevel,
      schoolAffiliation: values.schoolAffiliation,
      studentStatus: values.status,
      surname: values.surname,
      yearLevel: values.yearLevel,
    };

    try {
      if (isCreateMode) {
        await createStudentMutation.mutateAsync(payload);
      } else {
        await updateStudentMutation.mutateAsync({ payload, studentId });
      }

      router.push("/admin/users/students");
    } catch (error) {
      const apiError = toApiError(error);
      form.setError("root", {
        message: apiError.message ?? "Unable to save student.",
      });
    }
  };

  const isSaving =
    createStudentMutation.isPending || updateStudentMutation.isPending;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 rounded-xl border border-border/70 bg-card p-5 shadow-sm @container md:p-6"
    >
      <div className="space-y-4">
        <SectionTitle
          title="Personal Information"
          subtitle="Student identity, contact details, and core profile fields."
        />
        <div className="grid grid-cols-12 items-start gap-4">
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            disabled
            label="Student ID"
            name="id"
            placeholder="Auto Generated"
            requirement="required"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Surname"
            name="surname"
            placeholder="Enter Surname"
            requirement="required"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Given Name"
            name="givenName"
            placeholder="Enter Given Name"
            requirement="required"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Middle Name"
            name="middleName"
            placeholder="Enter Middle Name"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Email Address"
            name="email"
            placeholder="Enter Email Address"
            requirement="required"
            type="email"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Mobile Phone"
            name="contactNumber"
            placeholder="Enter Mobile Phone"
            requirement="required"
            type="tel"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Town/City"
            name="townCity"
            placeholder="Enter Town/City"
            requirement="required"
          />
          <TextareaFormField
            className="col-span-12 @4xl:col-span-6"
            control={form.control}
            label="Home Address"
            name="homeAddress"
            placeholder="Enter Home Address"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Birth Place"
            name="birthPlace"
            placeholder="Enter Birth Place"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Civil Status"
            name="civilStatus"
            placeholder="Enter Civil Status"
            requirement="optional"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SectionTitle
          title="Enrollment"
          subtitle="Academic year, status, enrollment type, and level assignment."
        />
        <div className="grid grid-cols-12 items-start gap-4">
          <SelectFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Academic Year"
            name="academicYear"
            options={academicYearSelectOptions}
            placeholder="Select Academic Year"
            requirement="required"
          />
          <SelectFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Enrollment Type"
            name="enrollmentType"
            options={enrollmentTypeOptions}
            placeholder="Select Enrollment"
            requirement="required"
          />
          <SelectFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="School Affiliation"
            name="schoolAffiliation"
            options={schoolAffiliationOptions}
            placeholder="Select School"
            requirement="required"
          />
          <SelectFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Year Level"
            name="yearLevel"
            options={yearLevelOptions}
            placeholder="Select Year Level"
            requirement="required"
          />
          <SelectFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Status"
            name="status"
            options={statusOptions}
            placeholder="Select Status"
            requirement="required"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SectionTitle
          title="Curriculum of Interest"
          subtitle="Programs match Academics page certificate, bachelor, masteral, and doctorate lists."
        />
        <div className="grid grid-cols-12 items-start gap-4">
          <Controller
            control={form.control}
            name="programLevel"
            render={({ fieldState }) => (
              <Field
                className="col-span-12 flex flex-col items-start gap-2 space-y-0 @4xl:col-span-4"
                data-invalid={fieldState.invalid}
              >
                <FormFieldLabel requirement="required">
                  Program Level
                </FormFieldLabel>
                <Select
                  name="programLevel"
                  value={selectedProgramLevel}
                  onValueChange={onProgramLevelChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Program Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {programLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="min-h-5">
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </div>
              </Field>
            )}
          />

          <SelectFormField
            className="col-span-12 @4xl:col-span-8"
            control={form.control}
            label="Program"
            name="program"
            options={programOptions}
            placeholder="Select Curriculum"
            requirement="required"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SectionTitle title="Ministry" />
        <div className="grid grid-cols-12 items-start gap-4">
          <TextFormField
            className="col-span-12 @4xl:col-span-6"
            control={form.control}
            label="Church Name"
            name="churchName"
            placeholder="Enter Church Name"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-6"
            control={form.control}
            label="Pastor Name"
            name="pastorName"
            placeholder="Enter Pastor Name"
            requirement="optional"
          />
          <TextareaFormField
            className="col-span-12 @4xl:col-span-8"
            control={form.control}
            label="Church Address"
            name="churchAddress"
            placeholder="Enter Church Address"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Pastor Contact Number"
            name="pastorContactNumber"
            placeholder="Enter Pastor Contact Number"
            requirement="optional"
            type="tel"
          />
          <TextareaFormField
            className="col-span-12"
            control={form.control}
            label="Ministry Involved"
            name="ministryInvolved"
            placeholder="Describe ministry involvement"
            requirement="optional"
          />
        </div>
      </div>

      {studentQuery.isLoading ? (
        <div className="rounded-lg border border-dashed border-border/70 bg-muted/15 p-4 text-sm text-muted-foreground">
          Loading student record...
        </div>
      ) : null}

      {form.formState.errors.root?.message ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {form.formState.errors.root.message}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild type="button" variant="outline">
          <Link href="/admin/users/students">
            <ArrowLeft className="size-4" />
            Back to Students
          </Link>
        </Button>
        <Button type="submit" disabled={isSaving || studentQuery.isLoading}>
          <SaveIcon className="size-4" />
          {isSaving
            ? "Saving..."
            : mode === "create"
              ? "Create Student"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
