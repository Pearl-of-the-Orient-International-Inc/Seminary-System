"use client";

import { useState } from "react";

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

import type { StudentRecord } from "./student-data";

type Props = {
  open: boolean;
  student: StudentRecord | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (password: string, confirmPassword: string) => void;
};

export function ChangeStudentPasswordDialog({
  open,
  student,
  isPending,
  onOpenChange,
  onSubmit,
}: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl!">
        <DialogHeader>
          <DialogTitle>Change student password</DialogTitle>
          <DialogDescription>
            Set a new password for {student?.name ?? "this student"}. If this
            is an older student record, this also creates their Seminary portal
            account. They sign in using their student number.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(password, confirmPassword);
          }}
        >
          <label className="block space-y-2 text-sm font-medium">
            New password
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Confirm new password
            <Input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !student?.application?.studentId}
            >
              {isPending ? "Saving…" : "Save password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
