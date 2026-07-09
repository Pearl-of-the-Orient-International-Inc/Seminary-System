"use client";

import Link from "next/link";
import {
  Barcode,
  Pencil,
  MoreHorizontal,
  QrCode,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { StudentRecord } from "./student-data";

type CellActionsProps = {
  data: StudentRecord;
  onGenerateBarcode: (record: StudentRecord) => void;
  onGenerateQrCode: (record: StudentRecord) => void;
  onToggleStatus: (record: StudentRecord) => void;
};

export const CellActions = ({
  data,
  onGenerateBarcode,
  onGenerateQrCode,
  onToggleStatus,
}: CellActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label="Open student actions">
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem asChild>
        <Link href={`/admin/users/students/${encodeURIComponent(data.id)}`}>
          <Pencil className="size-4" />
          Edit profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onToggleStatus(data)}>
        <UserCheck className="size-4" />
        {data.status === "Active" ? "Set inactive" : "Set active"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onGenerateBarcode(data)}>
        <Barcode className="size-4" />
        Generate barcode
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onGenerateQrCode(data)}>
        <QrCode className="size-4" />
        Generate QR code
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
