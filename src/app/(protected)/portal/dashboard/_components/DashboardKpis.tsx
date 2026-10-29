"use client";

import { IconCreditCard, IconFileText, IconSchool, IconUsers } from "@tabler/icons-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SeminaryDashboardData } from "@/features/seminary/seminary.types";

export const DashboardKpis = ({ kpis, isLoading }: Pick<SeminaryDashboardData, "kpis"> & { isLoading?: boolean }) => {
  const cards = [
    { title: "Total Students", value: kpis.totalStudents, description: "Registered Seminary student records", icon: IconUsers },
    { title: "Pending Enrollments", value: kpis.pendingEnrollments, description: "Submitted, reviewed, or approved", icon: IconSchool },
    { title: "Pending Payments", value: kpis.pendingPayments, description: "Awaiting payment verification", icon: IconCreditCard },
    { title: "Submitted Documents", value: kpis.submittedDocuments, description: "Applications with uploaded requirements", icon: IconFileText },
  ];

  return <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">{cards.map((card) => {
    const Icon = card.icon;
    return <Card key={card.title} className="border-border/70 bg-card/95 shadow-sm"><CardHeader className="gap-1"><div className="flex items-start justify-between"><div className="space-y-1"><CardDescription className="text-xs uppercase">{card.title}</CardDescription><CardTitle className="text-4xl font-serif">{isLoading ? "—" : card.value}</CardTitle></div><div className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#eef3ec] text-[#1f6a39] dark:bg-[#213126] dark:text-[#d4e5d6]"><Icon className="size-4.5" /></div></div><p className="text-sm text-muted-foreground">{card.description}</p></CardHeader></Card>;
  })}</div>;
};
