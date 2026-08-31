import { instructorRecords, type InstructorRecord } from "./instructor-data";

export const instructorStorageKey = "seminary.instructors.records";

export const getStoredInstructors = (): InstructorRecord[] => {
  if (typeof window === "undefined") return instructorRecords;

  const stored = window.localStorage.getItem(instructorStorageKey);
  if (!stored) return instructorRecords;

  try {
    const parsed = JSON.parse(stored) as InstructorRecord[];
    return Array.isArray(parsed) ? parsed : instructorRecords;
  } catch {
    window.localStorage.removeItem(instructorStorageKey);
    return instructorRecords;
  }
};

export const saveStoredInstructors = (records: InstructorRecord[]) => {
  window.localStorage.setItem(instructorStorageKey, JSON.stringify(records));
};

export const buildNextFacultyId = (records: InstructorRecord[]) => {
  const latestSeries = records.reduce((latest, instructor) => {
    const series = Number.parseInt(
      instructor.facultyId.split("-").at(-1) ?? "0",
      10,
    );
    return Number.isFinite(series) ? Math.max(latest, series) : latest;
  }, 0);

  return `POTSC-FAC-2026-${String(latestSeries + 1).padStart(4, "0")}`;
};
