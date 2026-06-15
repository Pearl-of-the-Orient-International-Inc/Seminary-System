export type GradeRecordStatus =
  | "Complete"
  | "Pending Review"
  | "In Progress"
  | "Incomplete";

export type GradeProgram =
  | "Certificate"
  | "Bachelor"
  | "Masteral"
  | "Doctorate";

export type GradeTerm = "1st Semester" | "2nd Semester" | "Summer";

export type GradeRecord = {
  courseCode: string;
  courseTitle: string;
  finalGrade: string;
  instructor: string;
  program: GradeProgram;
  recordId: string;
  remarks: "Passed" | "Conditional" | "Failed" | "Ongoing";
  status: GradeRecordStatus;
  studentId: string;
  studentName: string;
  term: GradeTerm;
};

export const gradeProgramOptions = [
  "Certificate",
  "Bachelor",
  "Masteral",
  "Doctorate",
] as const;

export const gradeStatusOptions = [
  "Complete",
  "Pending Review",
  "In Progress",
  "Incomplete",
] as const;

export const gradeTermOptions = [
  "1st Semester",
  "2nd Semester",
  "Summer",
] as const;

export const gradeRecords: GradeRecord[] = [
  {
    recordId: "POTSC-GR-2026-0001",
    studentId: "POTSC-2026-0001",
    studentName: "Juan Dela Cruz",
    program: "Certificate",
    courseCode: "CHAP-101",
    courseTitle: "Foundations of Chaplaincy Ministry",
    instructor: "Ptr. Jonathan P. Reyes",
    term: "1st Semester",
    finalGrade: "1.50",
    remarks: "Passed",
    status: "Complete",
  },
  {
    recordId: "POTSC-GR-2026-0002",
    studentId: "POTSC-2026-0002",
    studentName: "Maria L. Santos",
    program: "Bachelor",
    courseCode: "TH-201",
    courseTitle: "Systematic Theology I",
    instructor: "Dr. Estrella C. Navarro",
    term: "1st Semester",
    finalGrade: "1.75",
    remarks: "Passed",
    status: "Complete",
  },
  {
    recordId: "POTSC-GR-2026-0003",
    studentId: "POTSC-2026-0003",
    studentName: "Ramon D. Bautista",
    program: "Bachelor",
    courseCode: "PM-220",
    courseTitle: "Pastoral Counseling",
    instructor: "Rev. Joel A. Mendoza",
    term: "1st Semester",
    finalGrade: "2.25",
    remarks: "Conditional",
    status: "Pending Review",
  },
  {
    recordId: "POTSC-GR-2026-0004",
    studentId: "POTSC-2026-0004",
    studentName: "Angela P. Flores",
    program: "Masteral",
    courseCode: "MDIV-301",
    courseTitle: "Advanced Hermeneutics",
    instructor: "Rev. Daniel M. Soriano",
    term: "2nd Semester",
    finalGrade: "1.25",
    remarks: "Passed",
    status: "Complete",
  },
  {
    recordId: "POTSC-GR-2026-0005",
    studentId: "POTSC-2026-0005",
    studentName: "Josephine M. Rivera",
    program: "Masteral",
    courseCode: "CE-310",
    courseTitle: "Curriculum Design for Ministry",
    instructor: "Dr. Miriam L. Gutierrez",
    term: "2nd Semester",
    finalGrade: "1.50",
    remarks: "Passed",
    status: "Complete",
  },
  {
    recordId: "POTSC-GR-2026-0006",
    studentId: "POTSC-2026-0006",
    studentName: "Benjamin T. Reyes",
    program: "Doctorate",
    courseCode: "DMIN-401",
    courseTitle: "Leadership in Complex Ministries",
    instructor: "Dr. Patricia V. Alcantara",
    term: "2nd Semester",
    finalGrade: "1.75",
    remarks: "Passed",
    status: "Pending Review",
  },
  {
    recordId: "POTSC-GR-2026-0007",
    studentId: "POTSC-2026-0008",
    studentName: "Michael C. Gamboa",
    program: "Bachelor",
    courseCode: "OT-110",
    courseTitle: "Old Testament Survey",
    instructor: "Rev. Daniel M. Soriano",
    term: "Summer",
    finalGrade: "--",
    remarks: "Ongoing",
    status: "In Progress",
  },
  {
    recordId: "POTSC-GR-2026-0008",
    studentId: "POTSC-2026-0010",
    studentName: "David B. Aquino",
    program: "Doctorate",
    courseCode: "RES-501",
    courseTitle: "Dissertation Writing Seminar",
    instructor: "Dr. Patricia V. Alcantara",
    term: "Summer",
    finalGrade: "5.00",
    remarks: "Failed",
    status: "Incomplete",
  },
];
