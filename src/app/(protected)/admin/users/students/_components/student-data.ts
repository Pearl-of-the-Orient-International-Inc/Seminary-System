import type { SeminaryApplicationDetails } from "@/features/seminary/seminary.types";

export type StudentStatus =
  "Active" | "Graduating" | "Leave of Absence" | "Inactive";

export type ProgramLevel =
  "Certificate" | "Bachelor" | "Masteral" | "Doctorate";

export type EnrollmentType = "Regular" | "Transferee" | "Cross Enrollee";
export type SchoolAffiliation = "In-House" | "Partner School";

export type StudentRecord = {
  academicYear: string;
  contactNumber: string;
  email: string;
  enrollmentType: EnrollmentType;
  id: string;
  name: string;
  program: string;
  programLevel: ProgramLevel;
  schoolAffiliation: SchoolAffiliation;
  status: StudentStatus;
  townCity: string;
  yearLevel: string;
  application?: SeminaryApplicationDetails;
};

export const academicYearOptions = ["2025-2026", "2026-2027"] as const;

export const programLevelOptions = [
  "Certificate",
  "Bachelor",
  "Masteral",
  "Doctorate",
] as const;

export const studentRecords: StudentRecord[] = [
  {
    id: "POTSC-2026-0001",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@potsc.edu.ph",
    contactNumber: "09171234567",
    townCity: "Quezon City",
    program: "Certificate in Chaplaincy Ministry",
    programLevel: "Certificate",
    yearLevel: "Foundation",
    academicYear: "2025-2026",
    enrollmentType: "Regular",
    schoolAffiliation: "In-House",
    status: "Active",
  },
  {
    id: "POTSC-2026-0002",
    name: "Maria L. Santos",
    email: "maria.santos@potsc.edu.ph",
    contactNumber: "09181234567",
    townCity: "Pasig City",
    program: "Bachelor of Theology",
    programLevel: "Bachelor",
    yearLevel: "1st Year",
    academicYear: "2025-2026",
    enrollmentType: "Regular",
    schoolAffiliation: "In-House",
    status: "Active",
  },
  {
    id: "POTSC-2026-0003",
    name: "Ramon D. Bautista",
    email: "ramon.bautista@potsc.edu.ph",
    contactNumber: "09192345678",
    townCity: "Marikina City",
    program: "Bachelor of Pastoral Ministry",
    programLevel: "Bachelor",
    yearLevel: "2nd Year",
    academicYear: "2025-2026",
    enrollmentType: "Transferee",
    schoolAffiliation: "Partner School",
    status: "Active",
  },
  {
    id: "POTSC-2026-0004",
    name: "Angela P. Flores",
    email: "angela.flores@potsc.edu.ph",
    contactNumber: "09201234567",
    townCity: "Caloocan City",
    program: "Master of Divinity",
    programLevel: "Masteral",
    yearLevel: "1st Year",
    academicYear: "2025-2026",
    enrollmentType: "Regular",
    schoolAffiliation: "In-House",
    status: "Active",
  },
  {
    id: "POTSC-2026-0005",
    name: "Josephine M. Rivera",
    email: "josephine.rivera@potsc.edu.ph",
    contactNumber: "09213456789",
    townCity: "Antipolo City",
    program: "Master of Arts in Christian Education",
    programLevel: "Masteral",
    yearLevel: "2nd Year",
    academicYear: "2025-2026",
    enrollmentType: "Regular",
    schoolAffiliation: "In-House",
    status: "Graduating",
  },
  {
    id: "POTSC-2026-0006",
    name: "Benjamin T. Reyes",
    email: "benjamin.reyes@potsc.edu.ph",
    contactNumber: "09224567890",
    townCity: "Manila City",
    program: "Doctor of Ministry",
    programLevel: "Doctorate",
    yearLevel: "Residency",
    academicYear: "2025-2026",
    enrollmentType: "Regular",
    schoolAffiliation: "In-House",
    status: "Active",
  },
  {
    id: "POTSC-2026-0007",
    name: "Clarisse M. Villanueva",
    email: "clarisse.villanueva@potsc.edu.ph",
    contactNumber: "09235678901",
    townCity: "Makati City",
    program: "Certificate in Biblical Studies",
    programLevel: "Certificate",
    yearLevel: "Foundation",
    academicYear: "2026-2027",
    enrollmentType: "Cross Enrollee",
    schoolAffiliation: "Partner School",
    status: "Active",
  },
  {
    id: "POTSC-2026-0008",
    name: "Michael C. Gamboa",
    email: "michael.gamboa@potsc.edu.ph",
    contactNumber: "09246789012",
    townCity: "San Jose del Monte",
    program: "Bachelor of Theology",
    programLevel: "Bachelor",
    yearLevel: "3rd Year",
    academicYear: "2026-2027",
    enrollmentType: "Regular",
    schoolAffiliation: "In-House",
    status: "Leave of Absence",
  },
  {
    id: "POTSC-2026-0009",
    name: "Teresa V. Mendoza",
    email: "teresa.mendoza@potsc.edu.ph",
    contactNumber: "09257890123",
    townCity: "Taguig City",
    program: "Master of Religious Education",
    programLevel: "Masteral",
    yearLevel: "1st Year",
    academicYear: "2026-2027",
    enrollmentType: "Transferee",
    schoolAffiliation: "Partner School",
    status: "Active",
  },
  {
    id: "POTSC-2026-0010",
    name: "David B. Aquino",
    email: "david.aquino@potsc.edu.ph",
    contactNumber: "09268901234",
    townCity: "Cainta, Rizal",
    program: "Doctor of Philosophy in Theology",
    programLevel: "Doctorate",
    yearLevel: "Dissertation",
    academicYear: "2026-2027",
    enrollmentType: "Regular",
    schoolAffiliation: "In-House",
    status: "Inactive",
  },
  {
    id: "POTSC-2026-0011",
    name: "Rhea N. Salazar",
    email: "rhea.salazar@potsc.edu.ph",
    contactNumber: "09279012345",
    townCity: "Bulacan",
    program: "Bachelor of Pastoral Ministry",
    programLevel: "Bachelor",
    yearLevel: "4th Year",
    academicYear: "2026-2027",
    enrollmentType: "Regular",
    schoolAffiliation: "In-House",
    status: "Graduating",
  },
  {
    id: "POTSC-2026-0012",
    name: "Samuel P. Dizon",
    email: "samuel.dizon@potsc.edu.ph",
    contactNumber: "09280123456",
    townCity: "Valenzuela City",
    program: "Certificate in Chaplaincy Ministry",
    programLevel: "Certificate",
    yearLevel: "Foundation",
    academicYear: "2026-2027",
    enrollmentType: "Regular",
    schoolAffiliation: "In-House",
    status: "Active",
  },
];
