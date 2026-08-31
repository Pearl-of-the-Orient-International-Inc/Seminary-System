"use client";

import { ReceiptText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { ChargeBreakdownItem } from "./fee-collection-data";
import { currency } from "./columns";

type ChargeBreakdownCardProps = {
  items: ChargeBreakdownItem[];
  total: number;
};

export const ChargeBreakdownCard = ({
  items,
  total,
}: ChargeBreakdownCardProps) => (
  <Card className="overflow-hidden border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
    <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-100/70">
        <ReceiptText className="size-3.5" />
        Fee Matrix
      </div>
      <h2 className="mt-2 text-2xl font-semibold text-white">Breakdown of Charges</h2>
      <p className="mt-1 text-sm text-emerald-50/80">
        Standard charge reference for the current collection cycle.
      </p>
    </div>

    <CardContent className="space-y-4 p-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between rounded-2xl border bg-background/80 px-4 py-3"
        >
          <span className="font-semibold uppercase tracking-[0.04em]">
            {item.label}
          </span>
          <span className="text-lg font-bold">{currency.format(item.amount)}</span>
        </div>
      ))}

      <div className="rounded-2xl border border-emerald-900/15 bg-emerald-900/4 px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-emerald-950 dark:text-emerald-50">
            Total
          </span>
          <span className="text-3xl font-bold text-rose-600 dark:text-rose-400">
            {currency.format(total)}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);
