"use client";

import { ArrowRight, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { seminaryDocumentTemplates, type SeminaryDocumentType } from "./certifications-records-data";

type DocumentTypeDialogProps = { open: boolean; onOpenChange: (open: boolean) => void; onContinue: (type: SeminaryDocumentType) => void };

export function DocumentTypeDialog({ open, onOpenChange, onContinue }: DocumentTypeDialogProps) {
  const [selectedType, setSelectedType] = useState<SeminaryDocumentType>("TRANSCRIPT");
  const selectedTemplate = useMemo(() => seminaryDocumentTemplates.find((template) => template.value === selectedType) ?? seminaryDocumentTemplates[0], [selectedType]);

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-5xl! gap-0 overflow-hidden rounded-2xl! p-0">
      <DialogHeader className="border-b px-5 py-4 text-left">
        <DialogTitle className="text-xl font-semibold tracking-tight">What type of school document would you like to create?</DialogTitle>
        <DialogDescription className="max-w-3xl text-sm!">Choose a document type first. The next step will let you select a student and complete the document details.</DialogDescription>
      </DialogHeader>
      <div className="space-y-6 px-6 py-6 sm:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {seminaryDocumentTemplates.map((template) => {
            const Icon = template.icon;
            const isSelected = template.value === selectedType;
            return <button key={template.value} type="button" disabled={!template.available} onClick={() => setSelectedType(template.value)} className={cn("group relative flex min-h-40 flex-col items-center justify-center overflow-hidden rounded-2xl border bg-card px-4 py-4 text-center transition-all hover:border-primary/50 hover:shadow-sm", isSelected && "border-primary ring-primary/15 shadow-sm ring-4", !template.available && "cursor-not-allowed opacity-65")}>
              {!template.available ? <span className="absolute -right-9 top-4 rotate-45 bg-muted-foreground px-10 py-1 text-[10px] font-bold uppercase tracking-wide text-background">Coming soon</span> : null}
              {isSelected ? <span className="bg-primary text-primary-foreground absolute right-4 top-4 inline-flex size-5 items-center justify-center rounded-full"><Check className="size-3" /></span> : null}
              <span className="mb-3 size-13 rounded-2xl bg-emerald-700/10" style={{ backgroundImage: "url('/template-icons/seminary-document-templates.png')", backgroundSize: "300% 200%", backgroundPosition: template.value === "TRANSCRIPT" ? "50% 0%" : template.value === "CERTIFICATE" ? "0% 0%" : template.value === "DIPLOMA" ? "100% 0%" : template.value === "ACADEMIC_RECORD" ? "0% 100%" : template.value === "CLEARANCE" ? "50% 100%" : "100% 100%" }}><Icon className="sr-only size-7" /></span>
              <div className="space-y-2"><p className="text-base font-semibold">{template.title}</p><p className="text-xs text-muted-foreground">{template.description}</p></div>
            </button>;
          })}
        </div>
        <div className="rounded-2xl border bg-accent/20 p-4"><p className="text-sm font-medium">{selectedTemplate.title}</p><p className="mt-1 text-xs text-muted-foreground">{selectedTemplate.description}</p></div>
      </div>
      <DialogFooter className="border-t px-5 py-4"><Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button><Button size="sm" onClick={() => onContinue(selectedType)}>Continue <ArrowRight className="size-4" /></Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
