export const academicYearOptions = [
  "2024-2025",
  "2025-2026",
  "2026-2027",
] as const;

export const classOptions = [
  "First Year Theology",
  "Second Year Theology",
  "Third Year Theology",
  "Fourth Year Theology",
  "Master of Divinity Year I",
] as const;

export const sectionOptions = ["A", "B"] as const;

export const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export type AcademicYearOption = (typeof academicYearOptions)[number];
export type ClassOption = (typeof classOptions)[number];
export type SectionOption = (typeof sectionOptions)[number];
export type WeekDay = (typeof weekDays)[number];

export type TimetableSubject = {
  scheduleId?: string;
  courseId?: string;
  instructorId?: string;
  code: string;
  title: string;
  lecturer: string;
  modality: "Online" | "Face to Face";
  accentClassName: string;
  location?: string | null;
  meetingLink?: string | null;
};

export type TimetableEntry = {
  day: WeekDay;
  subject: TimetableSubject | null;
};

export type TimetableRow =
  | {
      type: "class";
      time: string;
      entries: TimetableEntry[];
    }
  | {
      type: "break";
      time: string;
      label: string;
      accentClassName: string;
    };

export type TimetableRecord = {
  academicYear: string;
  className: string;
  section: string;
  rows: TimetableRow[];
};

const subjectCatalog = {
  hermeneutics: {
    code: "TH101",
    title: "Biblical Hermeneutics",
    lecturer: "Fr. N. Santiago",
    modality: "Face to Face",
    accentClassName: "border-l-blue-500",
  },
  theology: {
    code: "TH201",
    title: "Systematic Theology",
    lecturer: "Fr. M. De Vera",
    modality: "Face to Face",
    accentClassName: "border-l-emerald-500",
  },
  counseling: {
    code: "PC301",
    title: "Pastoral Counseling",
    lecturer: "Sr. M. Lopez",
    modality: "Online",
    accentClassName: "border-l-violet-500",
  },
  history: {
    code: "CH110",
    title: "Church History",
    lecturer: "Fr. B. Cruz",
    modality: "Online",
    accentClassName: "border-l-amber-500",
  },
  homiletics: {
    code: "HM220",
    title: "Homiletics",
    lecturer: "Fr. R. Bautista",
    modality: "Face to Face",
    accentClassName: "border-l-rose-500",
  },
  ethics: {
    code: "CE205",
    title: "Christian Ethics",
    lecturer: "Dr. E. Ramos",
    modality: "Online",
    accentClassName: "border-l-cyan-500",
  },
  exegesis: {
    code: "GR320",
    title: "Greek Exegesis",
    lecturer: "Fr. A. Reyes",
    modality: "Face to Face",
    accentClassName: "border-l-indigo-500",
  },
  missiology: {
    code: "MS210",
    title: "Missiology",
    lecturer: "Fr. P. Navarro",
    modality: "Face to Face",
    accentClassName: "border-l-orange-500",
  },
  formation: {
    code: "SF110",
    title: "Spiritual Formation",
    lecturer: "Fr. J. Mendoza",
    modality: "Face to Face",
    accentClassName: "border-l-teal-500",
  },
  canonLaw: {
    code: "CL305",
    title: "Canon Law",
    lecturer: "Fr. V. Lim",
    modality: "Online",
    accentClassName: "border-l-fuchsia-500",
  },
} satisfies Record<string, TimetableSubject>;

const buildRows = (
  morningSet: [TimetableSubject, TimetableSubject, TimetableSubject, TimetableSubject, TimetableSubject],
  lateMorningSet: [TimetableSubject, TimetableSubject, TimetableSubject, TimetableSubject, TimetableSubject],
  middaySet: [TimetableSubject, TimetableSubject, TimetableSubject, TimetableSubject, TimetableSubject],
  afternoonSet: [TimetableSubject, TimetableSubject, TimetableSubject, TimetableSubject, TimetableSubject],
): TimetableRow[] => [
  {
    type: "class",
    time: "08:00 - 08:50",
    entries: weekDays.map((day, index) => ({
      day,
      subject: morningSet[index],
    })),
  },
  {
    type: "class",
    time: "09:00 - 09:50",
    entries: weekDays.map((day, index) => ({
      day,
      subject: lateMorningSet[index],
    })),
  },
  {
    type: "break",
    time: "10:00 - 10:30",
    label: "Community Prayer and Break",
    accentClassName: "bg-emerald-50 text-emerald-700",
  },
  {
    type: "class",
    time: "10:30 - 11:20",
    entries: weekDays.map((day, index) => ({
      day,
      subject: middaySet[index],
    })),
  },
  {
    type: "class",
    time: "11:30 - 12:20",
    entries: weekDays.map((day, index) => ({
      day,
      subject: afternoonSet[index],
    })),
  },
  {
    type: "break",
    time: "12:20 - 01:30",
    label: "Lunch and Angelus",
    accentClassName: "bg-amber-50 text-amber-700",
  },
];

export const timetableData: TimetableRecord[] = [
  {
    academicYear: "2024-2025",
    className: "First Year Theology",
    section: "A",
    rows: buildRows(
      [
        subjectCatalog.hermeneutics,
        subjectCatalog.theology,
        subjectCatalog.history,
        subjectCatalog.ethics,
        subjectCatalog.formation,
      ],
      [
        subjectCatalog.theology,
        subjectCatalog.hermeneutics,
        subjectCatalog.ethics,
        subjectCatalog.history,
        subjectCatalog.missiology,
      ],
      [
        subjectCatalog.history,
        subjectCatalog.ethics,
        subjectCatalog.hermeneutics,
        subjectCatalog.theology,
        subjectCatalog.formation,
      ],
      [
        subjectCatalog.formation,
        subjectCatalog.history,
        subjectCatalog.theology,
        subjectCatalog.hermeneutics,
        subjectCatalog.ethics,
      ],
    ),
  },
  {
    academicYear: "2024-2025",
    className: "First Year Theology",
    section: "B",
    rows: buildRows(
      [
        subjectCatalog.history,
        subjectCatalog.hermeneutics,
        subjectCatalog.theology,
        subjectCatalog.ethics,
        subjectCatalog.missiology,
      ],
      [
        subjectCatalog.ethics,
        subjectCatalog.history,
        subjectCatalog.hermeneutics,
        subjectCatalog.theology,
        subjectCatalog.formation,
      ],
      [
        subjectCatalog.theology,
        subjectCatalog.ethics,
        subjectCatalog.history,
        subjectCatalog.hermeneutics,
        subjectCatalog.missiology,
      ],
      [
        subjectCatalog.formation,
        subjectCatalog.missiology,
        subjectCatalog.theology,
        subjectCatalog.history,
        subjectCatalog.hermeneutics,
      ],
    ),
  },
  {
    academicYear: "2025-2026",
    className: "Master of Divinity Year I",
    section: "A",
    rows: buildRows(
      [
        subjectCatalog.counseling,
        subjectCatalog.homiletics,
        subjectCatalog.exegesis,
        subjectCatalog.canonLaw,
        subjectCatalog.theology,
      ],
      [
        subjectCatalog.homiletics,
        subjectCatalog.counseling,
        subjectCatalog.canonLaw,
        subjectCatalog.exegesis,
        subjectCatalog.formation,
      ],
      [
        subjectCatalog.exegesis,
        subjectCatalog.canonLaw,
        subjectCatalog.counseling,
        subjectCatalog.homiletics,
        subjectCatalog.theology,
      ],
      [
        subjectCatalog.theology,
        subjectCatalog.formation,
        subjectCatalog.homiletics,
        subjectCatalog.counseling,
        subjectCatalog.canonLaw,
      ],
    ),
  },
  {
    academicYear: "2025-2026",
    className: "Master of Divinity Year I",
    section: "B",
    rows: buildRows(
      [
        subjectCatalog.exegesis,
        subjectCatalog.counseling,
        subjectCatalog.homiletics,
        subjectCatalog.theology,
        subjectCatalog.canonLaw,
      ],
      [
        subjectCatalog.canonLaw,
        subjectCatalog.exegesis,
        subjectCatalog.counseling,
        subjectCatalog.homiletics,
        subjectCatalog.formation,
      ],
      [
        subjectCatalog.homiletics,
        subjectCatalog.theology,
        subjectCatalog.exegesis,
        subjectCatalog.counseling,
        subjectCatalog.canonLaw,
      ],
      [
        subjectCatalog.formation,
        subjectCatalog.canonLaw,
        subjectCatalog.theology,
        subjectCatalog.exegesis,
        subjectCatalog.counseling,
      ],
    ),
  },
];
