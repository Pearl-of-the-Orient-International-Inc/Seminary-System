"use client";

import {
  Award,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { NumberTicker } from "@/components/animated-ui/number-ticker";
import { cn } from "@/lib/utils";

export type WebsiteStat = {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
};

export const websiteStats: WebsiteStat[] = [
  {
    label: "Years of Excellence",
    value: 20,
    suffix: "+",
    icon: Award,
  },
  {
    label: "Alumni Worldwide",
    value: 1200,
    suffix: "+",
    icon: Users,
  },
  {
    label: "Faculty & Instructors",
    value: 50,
    suffix: "+",
    icon: GraduationCap,
  },
  {
    label: "Academic Programs",
    value: 15,
    suffix: "+",
    icon: BookOpen,
  },
  {
    label: "Faith-Based Education",
    value: 100,
    suffix: "%",
    icon: ShieldCheck,
  },
];

type StatsBandProps = {
  className?: string;
  itemClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
  stats?: WebsiteStat[];
};

const StatsBand = ({
  className,
  itemClassName,
  valueClassName,
  labelClassName,
  iconClassName,
  stats = websiteStats,
}: StatsBandProps) => {
  return (
    <div
      className={cn(
        "rounded-md border border-white/24 bg-[#003f2b] px-5 py-6 sm:px-7",
        className
      )}
    >
      <div className="grid grid-cols-2 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className={cn(
                "flex min-h-28 items-center justify-center px-3 lg:border-l lg:border-[#d7a53c]/70 lg:first:border-l-0",
                itemClassName
              )}
            >
              <div className="text-center">
                <Icon
                  className={cn("mx-auto size-9 text-[#f5b739]", iconClassName)}
                  strokeWidth={1.5}
                />
                <div
                  className={cn(
                    "mt-3 text-3xl font-bold leading-none text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]",
                    valueClassName
                  )}
                >
                  <NumberTicker
                    value={stat.value}
                    delay={index * 0.15}
                    className="tracking-normal text-white"
                  />
                  {stat.suffix}
                </div>
                <div
                  className={cn(
                    "mt-2 text-sm leading-tight text-white/92",
                    labelClassName
                  )}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsBand;
