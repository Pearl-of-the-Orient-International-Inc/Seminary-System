"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSeminaryGradeRecordsQuery, useSeminaryStudentsQuery } from "@/features/seminary/seminary.hooks";

import { TranscriptPreview } from "../(protected)/portal/certifications-records/_components/tor-preview";

function DocumentPreviewContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("student");
  const studentsQuery = useSeminaryStudentsQuery({ page: 1, limit: 100 });
  const application = (studentsQuery.data?.data ?? []).find((item) => item.studentId === studentId) ?? studentsQuery.data?.data?.[0];
  const student = application ? { name: [application.givenName, application.middleName, application.surname].filter(Boolean).join(" ") || application.studentId || "Seminary student", program: application.programCourse || "Program not set", studentNumber: application.studentId || "—" } : { name: "Loading student…", program: "", studentNumber: "" };
  const gradesQuery = useSeminaryGradeRecordsQuery({ page: 1, limit: 100, search: student.studentNumber });
  const grades = (gradesQuery.data?.data ?? []).filter((grade) => grade.studentId === student.studentNumber).map((grade) => ({ courseCode: grade.courseCode, courseTitle: grade.courseTitle, finalGrade: grade.finalGrade, units: null, remarks: grade.remarks, term: grade.term }));

  return <main className="min-h-screen bg-muted/40 px-4 py-6 sm:px-8">
    <div className="mx-auto max-w-6xl"><div className="document-preview-toolbar mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold">Transcript of Records Preview</h1><p className="mt-1 text-sm text-muted-foreground">Full-page preview for {student.name}</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => window.close()}><ArrowLeft className="size-4" />Close preview</Button><Button variant="outline" onClick={() => window.print()}><Printer className="size-4" />Print</Button><Button disabled><Download className="size-4" />Download PDF</Button></div></div><div className="document-preview-frame rounded-2xl border bg-card p-4 shadow-sm sm:p-8"><div className="tor-print-document"><TranscriptPreview student={student} grades={grades} /></div></div></div>
  </main>;
}

export default function DocumentPreviewPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-muted/40" />}>
      <DocumentPreviewContent />
    </Suspense>
  );
}
