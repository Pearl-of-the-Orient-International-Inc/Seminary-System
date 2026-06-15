export type InstructorStatus = "Active" | "Part-time" | "On Leave" | "Inactive";

export type InstructorProgram =
  | "Certificate"
  | "Bachelor"
  | "Masteral"
  | "Doctorate";

export type InstructorRank =
  | "Adjunct Instructor"
  | "Lecturer"
  | "Assistant Professor"
  | "Associate Professor"
  | "Professor";

export type InstructorRecord = {
  contactNumber: string;
  department: string;
  email: string;
  facultyId: string;
  loadUnits: number;
  name: string;
  rank: InstructorRank;
  specialization: string;
  status: InstructorStatus;
  teachingProgram: InstructorProgram;
};

export const instructorProgramOptions = [
  "Certificate",
  "Bachelor",
  "Masteral",
  "Doctorate",
] as const;

export const instructorStatusOptions = [
  "Active",
  "Part-time",
  "On Leave",
  "Inactive",
] as const;

export const instructorRecords: InstructorRecord[] = [
  {
    facultyId: "POTSC-FAC-2026-0001",
    name: "Rev. Daniel M. Soriano",
    email: "daniel.soriano@potsc.edu.ph",
    contactNumber: "09171234567",
    department: "Biblical Studies",
    specialization: "Old Testament Theology",
    teachingProgram: "Bachelor",
    rank: "Associate Professor",
    loadUnits: 12,
    status: "Active",
  },
  {
    facultyId: "POTSC-FAC-2026-0002",
    name: "Dr. Estrella C. Navarro",
    email: "estrella.navarro@potsc.edu.ph",
    contactNumber: "09182345678",
    department: "Systematic Theology",
    specialization: "Doctrinal Studies",
    teachingProgram: "Doctorate",
    rank: "Professor",
    loadUnits: 9,
    status: "Active",
  },
  {
    facultyId: "POTSC-FAC-2026-0003",
    name: "Ptr. Jonathan P. Reyes",
    email: "jonathan.reyes@potsc.edu.ph",
    contactNumber: "09193456789",
    department: "Pastoral Ministry",
    specialization: "Chaplaincy Formation",
    teachingProgram: "Certificate",
    rank: "Lecturer",
    loadUnits: 6,
    status: "Part-time",
  },
  {
    facultyId: "POTSC-FAC-2026-0004",
    name: "Dr. Miriam L. Gutierrez",
    email: "miriam.gutierrez@potsc.edu.ph",
    contactNumber: "09204567890",
    department: "Christian Education",
    specialization: "Curriculum Development",
    teachingProgram: "Masteral",
    rank: "Professor",
    loadUnits: 9,
    status: "Active",
  },
  {
    facultyId: "POTSC-FAC-2026-0005",
    name: "Atty. Samuel R. Dizon",
    email: "samuel.dizon@potsc.edu.ph",
    contactNumber: "09215678901",
    department: "Church Administration",
    specialization: "Ecclesiastical Governance",
    teachingProgram: "Bachelor",
    rank: "Adjunct Instructor",
    loadUnits: 3,
    status: "Part-time",
  },
  {
    facultyId: "POTSC-FAC-2026-0006",
    name: "Sis. Clarita B. Flores",
    email: "clarita.flores@potsc.edu.ph",
    contactNumber: "09226789012",
    department: "Languages and Hermeneutics",
    specialization: "Greek Exegesis",
    teachingProgram: "Bachelor",
    rank: "Assistant Professor",
    loadUnits: 10,
    status: "On Leave",
  },
  {
    facultyId: "POTSC-FAC-2026-0007",
    name: "Rev. Joel A. Mendoza",
    email: "joel.mendoza@potsc.edu.ph",
    contactNumber: "09237890123",
    department: "Homiletics and Worship",
    specialization: "Preaching and Liturgical Practice",
    teachingProgram: "Certificate",
    rank: "Lecturer",
    loadUnits: 8,
    status: "Active",
  },
  {
    facultyId: "POTSC-FAC-2026-0008",
    name: "Dr. Patricia V. Alcantara",
    email: "patricia.alcantara@potsc.edu.ph",
    contactNumber: "09248901234",
    department: "Research and Graduate Studies",
    specialization: "Theological Research Methods",
    teachingProgram: "Doctorate",
    rank: "Associate Professor",
    loadUnits: 6,
    status: "Inactive",
  },
];
