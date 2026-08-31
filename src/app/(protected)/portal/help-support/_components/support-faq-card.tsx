"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

import type { SupportTicket } from "./support-data";

type SupportFaqCardProps = {
  tickets: SupportTicket[];
};

export const SupportFaqCard = ({ tickets }: SupportFaqCardProps) => {
  const portalRaised = tickets.filter((ticket) => ticket.channel === "Portal").length;
  const financeRaised = tickets.filter((ticket) => ticket.category === "Payments").length;
  const lmsRaised = tickets.filter((ticket) => ticket.category === "LMS").length;

  return (
    <Card className="overflow-hidden pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
      <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Quick Support Guide</h2>
          <p className="text-sm text-emerald-50/80">
            Common concerns raised across accounts, academic systems, and payment
            processing.
          </p>
        </div>
      </div>

      <CardContent className="space-y-5 p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Portal Raised
            </div>
            <div className="mt-2 text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
              {portalRaised}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Payment Issues
            </div>
            <div className="mt-2 text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
              {financeRaised}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.03] p-4 dark:border-emerald-100/10 dark:bg-emerald-100/[0.04]">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              LMS Concerns
            </div>
            <div className="mt-2 text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
              {lmsRaised}
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem
            value="account-access"
            className="rounded-2xl border border-emerald-950/10 px-4 dark:border-emerald-100/10"
          >
            <AccordionTrigger className="text-left font-medium">
              Account access and password issues
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-6 text-muted-foreground">
              Confirm that the registered email is correct, advise the user to check
              spam folders, and escalate to IT support if reset emails are still not
              received after verification.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="payment-validation"
            className="rounded-2xl border border-emerald-950/10 px-4 dark:border-emerald-100/10"
          >
            <AccordionTrigger className="text-left font-medium">
              Payment validation and partial payment follow-up
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-6 text-muted-foreground">
              Ask for the receipt reference or proof-of-payment upload, then confirm
              whether the charge ledger and remaining balance have already been
              updated by the finance office.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="grades-and-lms"
            className="rounded-2xl border border-emerald-950/10 px-4 dark:border-emerald-100/10"
          >
            <AccordionTrigger className="text-left font-medium">
              Grades, reports, and LMS availability
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-6 text-muted-foreground">
              Review the current term configuration, class assignment, and resource
              links first. If the issue affects multiple users, escalate it as a
              platform-wide incident instead of a single-user ticket.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
