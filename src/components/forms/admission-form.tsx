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
import { CalendarIcon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const ADMISSION_NUMBER_PREFIX = "POTSC";
const ADMISSION_NUMBER_STORAGE_KEY = "potsc-admission-sequence";

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

const optionalString = z.string().trim().optional();

const today = new Date();
const todayYear = today.getFullYear();
const todayDateOnly = new Date(todayYear, today.getMonth(), today.getDate());

const curriculumPrograms = {
  "Certificate Programs": [
    "Certificate in Christian Evangelism",
    "Certificate in Christian Ministry",
    "Certificate in ECE & SPED Management",
    "Certificate in Ministerial",
    "Certificate in Advance Ministerial",
    "Certificate in Associate Theology",
  ],
  "Bachelor Programs": [
    "Bachelor of Theology",
    "Bachelor of Theology major in Pastoral Ministry",
    "Bachelor of Theology major in Chaplaincy",
    "Bachelor of Religious Education",
    "Bachelor of Christian Ministry in Naturopathic Medicine",
    "Bachelor of Christian Ministry major in Human Resources & Community Development",
    "Bachelor in Mission major in Cross-Culture",
    "Bachelor in Christian Counseling",
  ],
  "Master Program with Thesis": [
    "Master in Theology",
    "Master of Divinity",
    "Master of Religious Education",
    "Master of Christian Ministry in Complementary and Alternative Medicine major in Naturopathy",
    "Master of Christian Ministry major in Christian Leadership",
    "Master of Arts & Mission",
    "Master in Christian Guidance & Counseling",
  ],
  "Doctorate Program with Dissertation": [
    "Doctor of Christian Ministry",
    "Doctor of Christian Ministry major in Complementary and Alternative Medicine",
    "Doctor of Theology",
    "Doctor of Religious Education",
    "Doctor of Philosophy major in Christian Leadership & Management",
    "Doctor of Philosophy major in Biblical Studies",
    "Doctor of Philosophy in Theology",
    "Doctor of Philosophy in Christian Apologetics",
    "Doctor of Philosophy in Religion",
    "Doctor of Philosophy in Pastoral Ministry",
    "Doctor of Philosophy major in Pastoral Guidance & Counseling",
  ],
} as const;

const formSchema = z.object({
  admissionNumber: requiredString("Admission number"),
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

const academicYearOptions: SelectOption[] = [
  { label: "2025-2026", value: "2025-2026" },
  { label: "2026-2027", value: "2026-2027" },
  { label: "2027-2028", value: "2027-2028" },
];

const genderOptions: SelectOption[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const civilStatusOptions: SelectOption[] = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Widowed", value: "widowed" },
  { label: "Separated", value: "separated" },
];

const formatAdmissionNumber = (year: number, sequence: number) =>
  `${ADMISSION_NUMBER_PREFIX}-${year}-${String(sequence).padStart(4, "0")}`;

const getStoredAdmissionSequence = (year: number) => {
  if (typeof window === "undefined") {
    return 1;
  }

  const storedValue = window.localStorage.getItem(ADMISSION_NUMBER_STORAGE_KEY);

  if (!storedValue) {
    return 1;
  }

  try {
    const parsed = JSON.parse(storedValue) as { sequence?: number; year?: number };
    if (parsed.year === year && typeof parsed.sequence === "number") {
      return parsed.sequence;
    }
  } catch {
    return 1;
  }

  return 1;
};

const setStoredAdmissionSequence = (year: number, sequence: number) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    ADMISSION_NUMBER_STORAGE_KEY,
    JSON.stringify({ year, sequence }),
  );
};

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

const createDefaultValues = (admissionNumber: string, academicYear = "2025-2026"): AdmissionFormValues => ({
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
  disableDate,
  disabled,
  label,
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

        <Popover>
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={disabled}
              id={buttonId}
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(field.value, "PPP")
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          {!disabled && (
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                initialFocus
                disabled={disableDate}
                selected={field.value}
                onSelect={field.onChange}
              />
            </PopoverContent>
          )}
        </Popover>

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
      const selectedValues = Array.isArray(field.value) ? field.value : [];

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

export const AdmissionForm = () => {
  const initialAdmissionNumber = useMemo(
    () => formatAdmissionNumber(todayYear, 1),
    [],
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
    const nextSequence = getStoredAdmissionSequence(todayYear);
    form.setValue("admissionNumber", formatAdmissionNumber(todayYear, nextSequence), {
      shouldDirty: false,
      shouldValidate: false,
    });
    form.setValue("admissionDate", todayDateOnly, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [form]);

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

  const getNextAdmissionNumber = () => {
    const nextSequence = getStoredAdmissionSequence(todayYear) + 1;
    setStoredAdmissionSequence(todayYear, nextSequence);
    return formatAdmissionNumber(todayYear, nextSequence);
  };

  const onSubmit = (values: AdmissionFormValues) => {
    console.log(values);

    form.reset(createDefaultValues(getNextAdmissionNumber(), values.academicYear));
  };

  const onReset = () => {
    const currentAdmissionNumber = form.getValues("admissionNumber");
    form.reset(createDefaultValues(currentAdmissionNumber));
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
            disableDate={(date) => date > todayDateOnly}
            label="Date of Birth"
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
          {Object.entries(curriculumPrograms).map(([groupLabel, options]) => (
            <CheckboxGroupField
              key={groupLabel}
              className="col-span-12"
              control={form.control}
              label={groupLabel}
              name="curriculumOfInterest"
              options={options}
              requirement={groupLabel === "Certificate Programs" ? "required" : undefined}
            />
          ))}
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
        <Button type="reset" variant="outline">
          Reset
        </Button>
        <Button type="submit">
          <SaveIcon />
          Save Admission
        </Button>
      </div>
    </form>
  );
};
