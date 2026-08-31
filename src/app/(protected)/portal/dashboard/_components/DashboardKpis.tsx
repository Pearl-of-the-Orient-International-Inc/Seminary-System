"use client";

import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { kpiCards } from "./data";

export const DashboardKpis = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {kpiCards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} className="border-border/70 bg-card/95 shadow-sm">
            <CardHeader className="gap-1">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardDescription className="text-xs uppercase">
                    {card.title}
                  </CardDescription>
                  <CardTitle className="text-4xl font-serif">{card.value}</CardTitle>
                </div>
                <div className="rounded-2xl bg-[#eef3ec] size-8 flex items-center justify-center shrink-0 text-[#1f6a39] dark:bg-[#213126] dark:text-[#d4e5d6]">
                  <Icon className="size-4.5" />
                </div>
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  card.positive ? "text-[#2c8a45]" : "text-[#c65252]"
                }`}
              >
                {card.positive ? (
                  <IconArrowUpRight className="size-4" />
                ) : (
                  <IconArrowDownRight className="size-4" />
                )}
                <span>{card.delta}</span>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};
