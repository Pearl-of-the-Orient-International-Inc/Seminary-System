import { Monitor, UserRound } from "lucide-react";

import type { TimetableSubject } from "./data";

type TimetableSessionCardProps = {
  subject: TimetableSubject | null;
  onClick?: () => void;
};

export const TimetableSessionCard = ({
  subject,
  onClick,
}: TimetableSessionCardProps) => {
  if (!subject) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex h-full min-h-24 w-full items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/10 px-3 py-4 text-center text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
      >
        Add class schedule
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col gap-1 rounded-md border border-border/70 border-l-2 bg-background px-3 py-2 text-left shadow-xs transition hover:border-primary/40 hover:shadow-sm ${subject.accentClassName}`}
    >
      <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
        {subject.code}
      </span>
      <span className="text-sm font-semibold text-foreground">{subject.title}</span>
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <UserRound className="size-3" />
        {subject.lecturer}
      </span>
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Monitor className="size-3" />
        {subject.modality}
      </span>
    </button>
  );
};
