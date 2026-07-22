"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useToast } from "@/hooks/use-toast";
import {
  toApiError,
  useCreateSeminaryApplicationMutation,
  useSeminaryAcademicYearsQuery,
  useSeminaryCoursesQuery,
} from "@/features/seminary/seminary.hooks";
import type {
  SeminaryCourse,
  SeminaryProgramLevel,
} from "@/features/seminary/seminary.types";

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

const optionalString = z.string().trim().optional();

const today = new Date();
const todayYear = today.getFullYear();
const todayDateOnly = new Date(todayYear, today.getMonth(), today.getDate());

const formSchema = z.object({
  admissionNumber: z.string().trim().optional(),
  admissionDate: z.date({ message: "Admission date is required." }),
  academicYear: requiredString("Academic year"),
  surname: requiredString("Surname"),
  givenName: requiredString("Given name"),
  middleName: optionalString,
  mailingAddress: requiredString("Mailing address"),
  homeAddress: requiredString("Home address"),
  dateOfBirth: z
    .date({ message: "Date of birth is required." })
    .refine((date) => date <= todayDateOnly, {
      message: "Date of birth cannot be in the future.",
    }),
  birthPlace: requiredString("Birth place"),
  age: optionalString,
  gender: requiredString("Gender"),
  height: optionalString,
  weight: optionalString,
  civilStatus: requiredString("Civil status"),
  officePhone: optionalString,
  mobilePhone: requiredString("Mobile phone"),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Enter a valid email address."),
  churchName: requiredString("Name of church you attended"),
  churchAddress: requiredString("Church address"),
  pastorName: requiredString("Name of pastor"),
  pastorContactNumber: requiredString("Pastor contact number"),
  ministryInvolved: optionalString,
  curriculumOfInterest: z
    .array(z.string())
    .min(1, "Select at least one curriculum of interest."),
  highSchoolName: requiredString("High school"),
  highSchoolYearGraduated: requiredString("High school year graduated"),
  collegeSchoolName: optionalString,
  collegeCourse: optionalString,
  collegeYearGraduated: optionalString,
  vocationalSchoolName: optionalString,
  vocationalCourse: optionalString,
  vocationalYearGraduated: optionalString,
  otherSchoolName: optionalString,
  otherCourse: optionalString,
  otherYearGraduated: optionalString,
});

type AdmissionFormValues = z.infer<typeof formSchema>;
type Requirement = "required" | "optional";

type BaseFieldProps<TFieldValues extends FieldValues> = {
  className: string;
  control: Control<TFieldValues>;
  disabled?: boolean;
  label: string;
  name: FieldPath<TFieldValues>;
  placeholder: string;
  requirement?: Requirement;
};

type FormFieldLabelProps = {
  children: string;
  requirement?: Requirement;
};

type TextFormFieldProps<TFieldValues extends FieldValues> =
  BaseFieldProps<TFieldValues> & {
    type?: "email" | "tel" | "text";
  };

type TextareaFormFieldProps<TFieldValues extends FieldValues> = BaseFieldProps<TFieldValues>;

type SelectOption = {
  label: string;
  value: string;
};

type SelectFormFieldProps<TFieldValues extends FieldValues> =
  BaseFieldProps<TFieldValues> & {
    options: SelectOption[];
  };

type DateFormFieldProps<TFieldValues extends FieldValues> = Omit<
  BaseFieldProps<TFieldValues>,
  "placeholder"
> & {
  buttonId: string;
  disableDate?: (date: Date) => boolean;
  maxDate?: Date;
  minDate?: Date;
  placeholder?: string;
};

type CheckboxGroupFieldProps<TFieldValues extends FieldValues> = {
  className: string;
  control: Control<TFieldValues>;
  label: string;
  name: FieldPath<TFieldValues>;
  options: readonly string[];
  requirement?: Requirement;
};

type CurriculumGroup = {
  label: string;
  options: string[];
  program: SeminaryProgramLevel;
};

const programLevelLabels: Record<SeminaryProgramLevel, string> = {
  CERTIFICATE: "Certificate Programs",
  BACHELOR: "Bachelor Programs",
  MASTER_WITH_THESIS: "Master Program with Thesis",
  DOCTORATE_WITH_DISSERTATION: "Doctorate Program with Dissertation",
};

const programLevelOrder: SeminaryProgramLevel[] = [
  "CERTIFICATE",
  "BACHELOR",
  "MASTER_WITH_THESIS",
  "DOCTORATE_WITH_DISSERTATION",
];

const genderOptions: SelectOption[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const civilStatusOptions: SelectOption[] = [
  { label: "Single", value: "Single" },
  { label: "Married", value: "Married" },
  { label: "Widowed", value: "Widowed" },
  { label: "Separated", value: "Separated" },
];

const formatAdmissionNumber = (year: number, sequence: number) =>
  `POTSC-${String(year).slice(-2)}-${String(sequence).padStart(4, "0")}`;

const calculateAge = (dateOfBirth: Date, referenceDate: Date) => {
  let age = referenceDate.getFullYear() - dateOfBirth.getFullYear();
  const monthDifference = referenceDate.getMonth() - dateOfBirth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && referenceDate.getDate() < dateOfBirth.getDate())
  ) {
    age -= 1;
  }

  return age;
};

const toDateInputValue = (date?: Date) =>
  date instanceof Date && !Number.isNaN(date.getTime())
    ? format(date, "yyyy-MM-dd")
    : "";

const fromDateInputValue = (value: string) => {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const createDefaultValues = (admissionNumber: string, academicYear = ""): AdmissionFormValues => ({
  admissionNumber,
  admissionDate: todayDateOnly,
  academicYear,
  surname: "",
  givenName: "",
  middleName: "",
  mailingAddress: "",
  homeAddress: "",
  dateOfBirth: undefined as unknown as Date,
  birthPlace: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  civilStatus: "",
  officePhone: "",
  mobilePhone: "",
  emailAddress: "",
  churchName: "",
  churchAddress: "",
  pastorName: "",
  pastorContactNumber: "",
  ministryInvolved: "",
  curriculumOfInterest: [],
  highSchoolName: "",
  highSchoolYearGraduated: "",
  collegeSchoolName: "",
  collegeCourse: "",
  collegeYearGraduated: "",
  vocationalSchoolName: "",
  vocationalCourse: "",
  vocationalYearGraduated: "",
  otherSchoolName: "",
  otherCourse: "",
  otherYearGraduated: "",
});

const FormFieldLabel = ({ children, requirement }: FormFieldLabelProps) => (
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
        <Input disabled={disabled} placeholder={placeholder} type={type} {...field} />
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
          value={field.value}
          name={field.name}
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

const DateFormField = <TFieldValues extends FieldValues>({
  buttonId,
  className,
  control,
  disabled,
  label,
  maxDate,
  minDate,
  name,
  placeholder = "dd/mm/yyyy",
  requirement,
}: DateFormFieldProps<TFieldValues>) => (
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
          id={buttonId}
          max={toDateInputValue(maxDate)}
          min={toDateInputValue(minDate)}
          placeholder={placeholder}
          type="date"
          value={toDateInputValue(field.value)}
          onBlur={field.onBlur}
          onChange={(event) => field.onChange(fromDateInputValue(event.target.value))}
        />

        <div className="min-h-5">
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </div>
      </Field>
    )}
  />
);

const CheckboxGroupField = <TFieldValues extends FieldValues>({
  className,
  control,
  label,
  name,
  options,
  requirement,
}: CheckboxGroupFieldProps<TFieldValues>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => {
      const selectedValues: string[] = Array.isArray(field.value)
        ? field.value
        : [];

      const toggleOption = (checked: boolean, option: string) => {
        if (checked) {
          field.onChange([...selectedValues, option]);
          return;
        }

        field.onChange(selectedValues.filter((value: string) => value !== option));
      };

      return (
        <Field
          className={`${className} flex flex-col items-start gap-3 space-y-0`}
          data-invalid={fieldState.invalid}
        >
          <FormFieldLabel requirement={requirement}>{label}</FormFieldLabel>

          <div className="grid gap-3 @4xl:grid-cols-2">
            {options.map((option) => {
              const checked = selectedValues.includes(option);

              return (
                <label
                  key={option}
                  className="flex items-start gap-3 rounded-lg border border-border/70 px-3 py-3 text-sm transition-colors hover:bg-muted/40"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(nextValue) => toggleOption(nextValue === true, option)}
                  />
                  <span className="leading-5">{option}</span>
                </label>
              );
            })}
          </div>

          <div className="min-h-5">
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        </Field>
      );
    }}
  />
);

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="space-y-1">
    <p className="font-semibold text-primary">{title}</p>
    {subtitle ? <p className="text-muted-foreground text-sm">{subtitle}</p> : null}
  </div>
);

const toDateString = (date: Date) => format(date, "yyyy-MM-dd");

const groupCoursesByProgram = (courses: SeminaryCourse[]): CurriculumGroup[] =>
  programLevelOrder
    .map((program) => ({
      label: programLevelLabels[program],
      options: courses
        .filter((course) => course.program === program)
        .sort((left, right) => {
          if (left.sortOrder !== right.sortOrder) {
            return left.sortOrder - right.sortOrder;
          }

          return left.courseName.localeCompare(right.courseName);
        })
        .map((course) => course.courseName),
      program,
    }))
    .filter((group) => group.options.length > 0);

const getSelectedProgramLevel = (
  selectedCourses: string[],
  curriculumGroups: CurriculumGroup[],
) =>
  curriculumGroups.find((group) =>
    group.options.some((option) => selectedCourses.includes(option)),
  )?.program ?? "";

export const AdmissionForm = () => {
  const initialAdmissionNumber = useMemo(
    () => formatAdmissionNumber(todayYear, 1),
    [],
  );
  const { toast } = useToast();
  const createApplicationMutation = useCreateSeminaryApplicationMutation();
  const coursesQuery = useSeminaryCoursesQuery({
    limit: 100,
    page: 1,
    status: "ACTIVE",
  });
  const academicYearsQuery = useSeminaryAcademicYearsQuery({
    limit: 100,
    page: 1,
  });
  const curriculumGroups = useMemo(
    () => groupCoursesByProgram(coursesQuery.data?.data ?? []),
    [coursesQuery.data?.data],
  );
  const academicYearOptions = useMemo<SelectOption[]>(
    () =>
      (academicYearsQuery.data?.data ?? []).map((academicYear) => ({
        label: academicYear.academicYear,
        value: academicYear.academicYear,
      })),
    [academicYearsQuery.data?.data],
  );

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(initialAdmissionNumber),
  });

  const selectedDateOfBirth = useWatch({
    control: form.control,
    name: "dateOfBirth",
  });

  useEffect(() => {
    form.setValue("admissionNumber", formatAdmissionNumber(todayYear, 1), {
      shouldDirty: false,
      shouldValidate: false,
    });
    form.setValue("admissionDate", todayDateOnly, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [form]);

  useEffect(() => {
    if (!form.getValues("academicYear") && academicYearOptions[0]) {
      form.setValue("academicYear", academicYearOptions[0].value, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [academicYearOptions, form]);

  useEffect(() => {
    if (!selectedDateOfBirth) {
      form.setValue("age", "", {
        shouldDirty: false,
        shouldValidate: false,
      });
      return;
    }

    const computedAge = calculateAge(selectedDateOfBirth, todayDateOnly);
    form.setValue("age", String(Math.max(computedAge, 0)), {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [form, selectedDateOfBirth]);

  const onSubmit = async (values: AdmissionFormValues) => {
    try {
      const result = await createApplicationMutation.mutateAsync({
        admissionDate: toDateString(values.admissionDate),
        academicYear: values.academicYear,
        surname: values.surname,
        givenName: values.givenName,
        middleName: values.middleName ?? "",
        emailAddress: values.emailAddress,
        mobilePhone: values.mobilePhone,
        mailingAddress: values.mailingAddress,
        homeAddress: values.homeAddress,
        dateOfBirth: toDateString(values.dateOfBirth),
        birthPlace: values.birthPlace,
        age: values.age ?? "",
        gender: values.gender,
        height: values.height ?? "",
        weight: values.weight ?? "",
        civilStatus: values.civilStatus,
        officePhone: values.officePhone ?? "",
        churchAttended: values.churchName,
        churchAddress: values.churchAddress,
        pastorName: values.pastorName,
        contactNumber: values.pastorContactNumber,
        ministryInvolved: values.ministryInvolved ?? "",
        programLevel: getSelectedProgramLevel(
          values.curriculumOfInterest,
          curriculumGroups,
        ),
        programCourse: values.curriculumOfInterest.join("; "),
        highSchool: values.highSchoolName,
        highSchoolYearGraduated: values.highSchoolYearGraduated,
        collegeSchool: values.collegeSchoolName ?? "",
        collegeCourse: values.collegeCourse ?? "",
        collegeYearGraduated: values.collegeYearGraduated ?? "",
        vocationalSchool: values.vocationalSchoolName ?? "",
        vocationalCourse: values.vocationalCourse ?? "",
        vocationalYearGraduated: values.vocationalYearGraduated ?? "",
        othersSchool: values.otherSchoolName ?? "",
        othersCourse: values.otherCourse ?? "",
        othersYearGraduated: values.otherYearGraduated ?? "",
      });

      toast({
        title: "Admission saved",
        description: `Admission number ${result.data.admissionNumber ?? "created"}.`,
      });
      form.reset(createDefaultValues(formatAdmissionNumber(todayYear, 1), values.academicYear));
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "Failed to save admission",
        description: apiError.message,
        variant: "error",
      });
    }
  };

  const onReset = () => {
    const currentAdmissionNumber = form.getValues("admissionNumber");
    form.reset(createDefaultValues(currentAdmissionNumber ?? "", form.getValues("academicYear")));
    form.clearErrors();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="space-y-8 rounded-xl border border-border/70 bg-card p-5 shadow-sm @container md:p-6"
    >
      <div className="space-y-4">
        <SectionTitle
          title="Personal Information"
          subtitle="Based on Pearl Seminary Form 1 personal information section."
        />
        <div className="grid grid-cols-12 items-start gap-4">
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            disabled
            label="Admission No."
            name="admissionNumber"
            placeholder="Auto Generated"
            requirement="required"
          />
          <DateFormField
            buttonId="admission-date"
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            disabled
            label="Admission Date"
            name="admissionDate"
            requirement="required"
          />
          <SelectFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            disabled={academicYearsQuery.isLoading || academicYearOptions.length === 0}
            label="Academic Year"
            name="academicYear"
            options={academicYearOptions}
            placeholder="Select Academic Year"
            requirement="required"
          />

          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Surname"
            name="surname"
            placeholder="Enter Surname"
            requirement="required"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Given Name"
            name="givenName"
            placeholder="Enter Given Name"
            requirement="required"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Middle Name"
            name="middleName"
            placeholder="Enter Middle Name"
            requirement="optional"
          />

          <TextareaFormField
            className="col-span-12 @4xl:col-span-6"
            control={form.control}
            label="Mailing Address"
            name="mailingAddress"
            placeholder="Enter Mailing Address"
            requirement="required"
          />
          <TextareaFormField
            className="col-span-12 @4xl:col-span-6"
            control={form.control}
            label="Home Address"
            name="homeAddress"
            placeholder="Enter Home Address"
            requirement="required"
          />

          <DateFormField
            buttonId="date-of-birth"
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Date of Birth"
            maxDate={todayDateOnly}
            name="dateOfBirth"
            requirement="required"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Birth Place"
            name="birthPlace"
            placeholder="Enter Birth Place"
            requirement="required"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-2"
            control={form.control}
            disabled
            label="Age"
            name="age"
            placeholder="Auto Generated"
          />
          <SelectFormField
            className="col-span-12 @4xl:col-span-2"
            control={form.control}
            label="Gender"
            name="gender"
            options={genderOptions}
            placeholder="Select Gender"
            requirement="required"
          />
          <SelectFormField
            className="col-span-12 @4xl:col-span-2"
            control={form.control}
            label="Civil Status"
            name="civilStatus"
            options={civilStatusOptions}
            placeholder="Select Status"
            requirement="required"
          />

          <TextFormField
            className="col-span-12 @4xl:col-span-2"
            control={form.control}
            label="Height"
            name="height"
            placeholder="e.g. 5'7"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-2"
            control={form.control}
            label="Weight"
            name="weight"
            placeholder="e.g. 62 kg"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Office Phone"
            name="officePhone"
            placeholder="Enter Office Phone"
            requirement="optional"
            type="tel"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-2"
            control={form.control}
            label="Mobile Phone"
            name="mobilePhone"
            placeholder="Enter Mobile Phone"
            requirement="required"
            type="tel"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Email Address"
            name="emailAddress"
            placeholder="Enter Email Address"
            requirement="required"
            type="email"
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
            label="Name of Church You Attended"
            name="churchName"
            placeholder="Enter Church Name"
            requirement="required"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-6"
            control={form.control}
            label="Name of Pastor"
            name="pastorName"
            placeholder="Enter Pastor Name"
            requirement="required"
          />
          <TextareaFormField
            className="col-span-12 @4xl:col-span-8"
            control={form.control}
            label="Church Address"
            name="churchAddress"
            placeholder="Enter Church Address"
            requirement="required"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Pastor Contact Number"
            name="pastorContactNumber"
            placeholder="Enter Pastor Contact Number"
            requirement="required"
            type="tel"
          />
          <TextareaFormField
            className="col-span-12"
            control={form.control}
            label="Ministry You Involved"
            name="ministryInvolved"
            placeholder="Describe ministry involvement"
            requirement="optional"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SectionTitle
          title="Curriculum of Interest"
          subtitle="Please check one or more programs aligned with the applicant's seminary interest."
        />
        <div className="space-y-6">
          {coursesQuery.isLoading ? (
            <p className="rounded-lg border border-border/70 px-3 py-3 text-sm text-muted-foreground">
              Loading active courses...
            </p>
          ) : curriculumGroups.length ? (
            curriculumGroups.map((group, index) => (
              <CheckboxGroupField
                key={group.program}
                className="col-span-12"
                control={form.control}
                label={group.label}
                name="curriculumOfInterest"
                options={group.options}
                requirement={index === 0 ? "required" : undefined}
              />
            ))
          ) : (
            <p className="rounded-lg border border-border/70 px-3 py-3 text-sm text-muted-foreground">
              No active courses found. Add courses first.
            </p>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SectionTitle title="Educational Background" />
        <div className="grid grid-cols-12 items-start gap-4">
          <TextFormField
            className="col-span-12 @4xl:col-span-8"
            control={form.control}
            label="High School"
            name="highSchoolName"
            placeholder="Enter High School"
            requirement="required"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Year Graduated"
            name="highSchoolYearGraduated"
            placeholder="Enter Year Graduated"
            requirement="required"
          />

          <TextFormField
            className="col-span-12 @4xl:col-span-5"
            control={form.control}
            label="College School"
            name="collegeSchoolName"
            placeholder="Enter College School"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Course"
            name="collegeCourse"
            placeholder="Enter Course"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Year Graduated"
            name="collegeYearGraduated"
            placeholder="Enter Year"
            requirement="optional"
          />

          <TextFormField
            className="col-span-12 @4xl:col-span-5"
            control={form.control}
            label="Vocational School"
            name="vocationalSchoolName"
            placeholder="Enter Vocational School"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Course"
            name="vocationalCourse"
            placeholder="Enter Course"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Year Graduated"
            name="vocationalYearGraduated"
            placeholder="Enter Year"
            requirement="optional"
          />

          <TextFormField
            className="col-span-12 @4xl:col-span-5"
            control={form.control}
            label="Others School"
            name="otherSchoolName"
            placeholder="Enter Other School"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-4"
            control={form.control}
            label="Course"
            name="otherCourse"
            placeholder="Enter Course"
            requirement="optional"
          />
          <TextFormField
            className="col-span-12 @4xl:col-span-3"
            control={form.control}
            label="Year Graduated"
            name="otherYearGraduated"
            placeholder="Enter Year"
            requirement="optional"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4 rounded-lg border border-dashed border-border/70 bg-muted/15 p-4">
        <SectionTitle title="School Requirements" />
        <ul className="grid gap-2 text-sm text-muted-foreground">
          <li>• Transcript of Records (High School or College - Last School Year)</li>
          <li>• 2 pcs. (2x2 ID Picture)</li>
          <li>• Pastor&apos;s Letter of Recommendation</li>
          <li>• Brief History of Conversion</li>
        </ul>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button disabled={createApplicationMutation.isPending} type="reset" variant="outline">
          Reset
        </Button>
        <Button
          disabled={
            createApplicationMutation.isPending ||
            coursesQuery.isLoading ||
            academicYearsQuery.isLoading ||
            curriculumGroups.length === 0 ||
            academicYearOptions.length === 0
          }
          type="submit"
        >
          <SaveIcon />
          {createApplicationMutation.isPending ? "Saving..." : "Save Admission"}
        </Button>
      </div>
    </form>
  );
};
