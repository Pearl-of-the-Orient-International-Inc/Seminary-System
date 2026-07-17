"use client";

import { useMemo, useRef, useState } from "react";
import { FileSpreadsheet, Plus, Trash2, Upload } from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  toApiError,
  useBulkImportSeminaryStudentsMutation,
} from "@/features/seminary/seminary.hooks";
import type { SeminaryStudentPayload } from "@/features/seminary/seminary.types";
import type { ProgramLevel } from "./student-data";
import {
  getProgramsByLevel,
  programGroups,
  programLevelOptions,
} from "../[studentId]/_components/program-options";

type BulkImportDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

type ImportRow = SeminaryStudentPayload & {
  rowId: string;
};

type EditableColumn = {
  key: keyof SeminaryStudentPayload;
  label: string;
  placeholder?: string;
  type?: "programCourse" | "programLevel" | "select" | "text";
};

const editableColumns: EditableColumn[] = [
  { key: "studentId", label: "Student No.", placeholder: "POTSC-26-0001" },
  { key: "surname", label: "Last Name" },
  { key: "givenName", label: "First Name" },
  { key: "middleName", label: "M.I." },
  { key: "gender", label: "Gender", placeholder: "Male", type: "select" },
  { key: "emailAddress", label: "Email" },
  { key: "mobilePhone", label: "Contact #" },
  { key: "birthPlace", label: "Birth Place" },
  { key: "academicYear", label: "Academic Year", placeholder: "2026-2027" },
  {
    key: "programLevel",
    label: "Program Level",
    placeholder: "Certificate",
    type: "programLevel",
  },
  { key: "programCourse", label: "Program/Course", type: "programCourse" },
  { key: "yearLevel", label: "Year Level" },
  {
    key: "enrollmentType",
    label: "Enrollment",
    placeholder: "Regular",
    type: "select",
  },
  {
    key: "schoolAffiliation",
    label: "School",
    placeholder: "In-House",
    type: "select",
  },
  {
    key: "studentStatus",
    label: "Status",
    placeholder: "Active",
    type: "select",
  },
  { key: "homeAddress", label: "Address" },
  { key: "civilStatus", label: "Civil Status" },
];

const genderOptions = ["Male", "Female", "Prefer not to say"];
const enrollmentTypeOptions = ["Regular", "Transferee", "Cross Enrollee"];
const schoolAffiliationOptions = ["In-House", "Partner School"];
const studentStatusOptions = [
  "Active",
  "Graduating",
  "Leave of Absence",
  "Inactive",
];

const normalizeHeader = (header: string) =>
  header
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const normalizeGender = (value: string) => {
  const normalized = value.trim().toLowerCase();

  if (normalized === "m" || normalized === "male") {
    return "Male";
  }

  if (normalized === "f" || normalized === "female") {
    return "Female";
  }

  return value.trim();
};

const normalizeProgramText = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\b(of|in|major|with|and|the)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const inferProgram = (rawProgram: string) => {
  const normalized = normalizeProgramText(rawProgram);

  if (!normalized) {
    return { programCourse: "", programLevel: "" };
  }

  let bestMatch: {
    programCourse: string;
    programLevel: ProgramLevel;
    score: number;
  } | null = null;

  for (const group of programGroups) {
    for (const program of group.programs) {
      const programText = normalizeProgramText(program);
      const importedWords = normalized.split(" ").filter(Boolean);
      const optionWords = programText.split(" ").filter(Boolean);
      const hits = importedWords.filter((word) =>
        optionWords.includes(word),
      ).length;
      const score =
        hits / Math.max(importedWords.length, optionWords.length, 1);

      if (score > (bestMatch?.score ?? 0)) {
        bestMatch = {
          programCourse: program,
          programLevel: group.level,
          score,
        };
      }
    }
  }

  if (bestMatch && bestMatch.score >= 0.45) {
    return {
      programCourse: bestMatch.programCourse,
      programLevel: bestMatch.programLevel,
    };
  }

  if (normalized.includes("master")) {
    return { programCourse: "", programLevel: "Masteral" };
  }

  if (normalized.includes("doctor") || normalized.includes("philosophy")) {
    return { programCourse: "", programLevel: "Doctorate" };
  }

  if (normalized.includes("bachelor")) {
    return { programCourse: "", programLevel: "Bachelor" };
  }

  if (normalized.includes("certificate") || normalized.includes("certified")) {
    return { programCourse: "", programLevel: "Certificate" };
  }

  return { programCourse: "", programLevel: "" };
};

const getValue = (row: Record<string, unknown>, aliases: string[]) => {
  const normalizedEntries: [string, unknown][] = Object.entries(row).map(
    ([key, value]) => [normalizeHeader(key), value],
  );
  const found = normalizedEntries.find(([key]) => aliases.includes(key));

  if (!found || found[1] === null || found[1] === undefined) {
    return "";
  }

  return String(found[1]).trim();
};

const mapExcelRow = (
  row: Record<string, unknown>,
  index: number,
): ImportRow => {
  const rawProgram = getValue(row, [
    "program",
    "program course",
    "course",
    "curriculum",
  ]);
  const inferredProgram = inferProgram(rawProgram);

  return {
    rowId: `${Date.now()}-${index}`,
    studentId: getValue(row, [
      "student no",
      "student no.",
      "student number",
      "student id",
    ]),
    surname: getValue(row, ["last name", "surname"]),
    givenName: getValue(row, ["first name", "given name"]),
    middleName: getValue(row, ["m i", "mi", "middle initial", "middle name"]),
    gender: normalizeGender(getValue(row, ["gender", "sex"])),
    emailAddress: getValue(row, ["email", "email address"]),
    mobilePhone: getValue(row, [
      "contact",
      "contact #",
      "contact number",
      "mobile phone",
    ]),
    homeAddress: getValue(row, ["address", "home address"]),
    birthPlace: getValue(row, ["birth place", "birthplace"]),
    academicYear: getValue(row, ["academic year"]),
    programLevel: inferredProgram.programLevel,
    programCourse: inferredProgram.programCourse,
    yearLevel: getValue(row, ["year level", "year"]),
    enrollmentType:
      getValue(row, ["enrollment type", "enrollment"]) || "Regular",
    schoolAffiliation:
      getValue(row, [
        "school affiliation",
        "school type",
        "school",
        "affiliation",
      ]) || "In-House",
    studentStatus: getValue(row, ["status", "student status"]) || "Active",
    civilStatus: getValue(row, ["civil status"]),
  };
};

const emptyRow = (): ImportRow => ({
  rowId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  enrollmentType: "Regular",
  schoolAffiliation: "In-House",
  studentStatus: "Active",
});

const parseSheetRows = (sheet: XLSX.WorkSheet) => {
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    blankrows: false,
    defval: "",
    header: 1,
  });
  const headerIndex = rows.findIndex((row) =>
    row.some((cell) =>
      ["student no", "surname", "first name", "course"].includes(
        normalizeHeader(String(cell ?? "")),
      ),
    ),
  );

  if (headerIndex === -1) {
    return [];
  }

  const headers = rows[headerIndex].map((cell) => String(cell ?? ""));

  return rows.slice(headerIndex + 1).map((row) => {
    const record: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      if (header.trim()) {
        record[header] = row[index] ?? "";
      }
    });
    return record;
  });
};

const stripRowId = (importRow: ImportRow) => {
  const { rowId, ...row } = importRow;
  void rowId;
  return row;
};

export const BulkImportDialog = ({
  onOpenChange,
  open,
}: BulkImportDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bulkImportMutation = useBulkImportSeminaryStudentsMutation();

  const populatedRows = useMemo(
    () =>
      rows.filter((row) =>
        editableColumns.some((column) => String(row[column.key] ?? "").trim()),
      ),
    [rows],
  );

  const handleFileChange = async (file?: File) => {
    if (!file) {
      return;
    }

    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = parseSheetRows(sheet);
      const parsedRows = data
        .map(mapExcelRow)
        .filter((row) =>
          editableColumns.some((column) =>
            String(row[column.key] ?? "").trim(),
          ),
        );

      const nextRows = parsedRows.length ? parsedRows : [emptyRow()];
      setRows(nextRows);
      setSelectedRowId(nextRows[0]?.rowId ?? null);
    } catch {
      setError("Unable to read spreadsheet. Use .xlsx, .xls, or .csv.");
    }
  };

  const addRow = () => {
    const nextRow = emptyRow();
    setRows((current) => [...current, nextRow]);
    setSelectedRowId(nextRow.rowId);
  };

  const updateCell = (
    rowId: string,
    key: keyof SeminaryStudentPayload,
    value: string,
  ) => {
    setRows((current) =>
      current.map((row) =>
        row.rowId === rowId
          ? {
              ...row,
              [key]: value,
              ...(key === "programLevel" ? { programCourse: "" } : {}),
            }
          : row,
      ),
    );
  };

  const removeRow = (rowId: string) => {
    setRows((current) => {
      const nextRows = current.filter((row) => row.rowId !== rowId);

      if (selectedRowId === rowId) {
        setSelectedRowId(nextRows[0]?.rowId ?? null);
      }

      return nextRows;
    });
  };

  const handleSubmit = async () => {
    setError(null);

    if (!populatedRows.length) {
      setError("Add at least one row before importing.");
      return;
    }

    try {
      await bulkImportMutation.mutateAsync({
        students: populatedRows.map(stripRowId),
      });
      setRows([]);
      setSelectedRowId(null);
      onOpenChange(false);
    } catch (err) {
      const apiError = toApiError(err);
      const firstIssue = apiError.errors?.[0];
      setError(
        firstIssue
          ? `${firstIssue.path}: ${firstIssue.message}`
          : (apiError.message ?? "Bulk import failed."),
      );
    }
  };

  const selectedRow =
    rows.find((row) => row.rowId === selectedRowId) ?? rows[0] ?? null;

  const getRowTitle = (row: ImportRow, index: number) => {
    const name = [row.givenName, row.middleName, row.surname]
      .filter(Boolean)
      .join(" ")
      .trim();

    return name || `Row ${index + 1}`;
  };

  const renderField = (row: ImportRow, column: EditableColumn) => {
    const fieldValue = String(row[column.key] ?? "");

    if (column.type === "programLevel") {
      return (
        <Select
          value={fieldValue}
          onValueChange={(value) => updateCell(row.rowId, column.key, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select program level" />
          </SelectTrigger>
          <SelectContent>
            {programLevelOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (column.type === "programCourse") {
      const programLevel = row.programLevel as ProgramLevel | undefined;
      const courseOptions = programLevel
        ? getProgramsByLevel(programLevel)
        : [];

      return (
        <Select
          value={fieldValue}
          disabled={!courseOptions.length}
          onValueChange={(value) => updateCell(row.rowId, column.key, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                courseOptions.length
                  ? "Select program/course"
                  : "Select program level first"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {courseOptions.map((program) => (
              <SelectItem key={program} value={program}>
                {program}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (column.key === "gender") {
      return (
        <Select
          value={fieldValue}
          onValueChange={(value) => updateCell(row.rowId, column.key, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (column.key === "enrollmentType") {
      return (
        <Select
          value={fieldValue}
          onValueChange={(value) => updateCell(row.rowId, column.key, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select enrollment" />
          </SelectTrigger>
          <SelectContent>
            {enrollmentTypeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (column.key === "schoolAffiliation") {
      return (
        <Select
          value={fieldValue}
          onValueChange={(value) => updateCell(row.rowId, column.key, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select school" />
          </SelectTrigger>
          <SelectContent>
            {schoolAffiliationOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (column.key === "studentStatus") {
      return (
        <Select
          value={fieldValue}
          onValueChange={(value) => updateCell(row.rowId, column.key, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {studentStatusOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        placeholder={column.placeholder}
        value={fieldValue}
        onChange={(event) =>
          updateCell(row.rowId, column.key, event.target.value)
        }
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-275 flex-col overflow-hidden p-0 sm:max-w-[1100px]">
        <DialogHeader>
          <div className="space-y-2 px-6 pt-6">
            <DialogTitle>Bulk Import Students</DialogTitle>
            <DialogDescription>
              Upload Excel, review parsed rows, then edit missing fields before
              import.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-hidden px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              ref={fileInputRef}
              accept=".xlsx,.xls,.csv"
              className="hidden"
              type="file"
              onChange={(event) => handleFileChange(event.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-4" />
              Upload Excel
            </Button>
            <Button type="button" variant="outline" onClick={addRow}>
              <Plus className="size-4" />
              Add Row
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="size-4" />
              {populatedRows.length} row{populatedRows.length === 1 ? "" : "s"}{" "}
              ready
            </div>
          </div>

          {error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="grid min-h-0 overflow-hidden rounded-md border lg:grid-cols-[280px_1fr]">
            <div className="border-b bg-muted/20 lg:border-r lg:border-b-0">
              <div className="border-b px-4 py-3 text-sm font-medium">
                Parsed Rows
              </div>
              <div className="h-48 overflow-y-auto lg:h-[min(56vh,480px)]">
                {rows.length ? (
                  <div className="space-y-1 p-2">
                    {rows.map((row, index) => (
                      <button
                        key={row.rowId}
                        type="button"
                        className={`flex w-full items-start justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                          selectedRow?.rowId === row.rowId
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedRowId(row.rowId)}
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium">
                            {getRowTitle(row, index)}
                          </span>
                          <span className="block truncate text-xs opacity-75">
                            {row.emailAddress ||
                              row.mobilePhone ||
                              "No contact"}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs opacity-75">
                          {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                    Upload Excel to start editing rows.
                  </div>
                )}
              </div>
            </div>

            <div className="min-h-0">
              <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                <div>
                  <div className="text-sm font-medium">
                    {selectedRow
                      ? getRowTitle(selectedRow, rows.indexOf(selectedRow))
                      : "No row selected"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Edit selected row fields. No horizontal scrolling.
                  </div>
                </div>
                {selectedRow ? (
                  <Button
                    aria-label="Remove selected row"
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    onClick={() => removeRow(selectedRow.rowId)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </div>

              <div className="h-[min(56vh,480px)] overflow-y-auto p-4">
                {selectedRow ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {editableColumns.map((column) => (
                      <label key={column.key} className="grid gap-2 text-sm">
                        <span className="font-medium">{column.label}</span>
                        {renderField(selectedRow, column)}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                    Select a row to edit.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={bulkImportMutation.isPending || !populatedRows.length}
            onClick={handleSubmit}
          >
            {bulkImportMutation.isPending ? "Importing..." : "Import Students"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
