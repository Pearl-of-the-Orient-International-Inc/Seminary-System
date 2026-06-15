"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  IconBooks,
  IconBroadcast,
  IconChartBar,
  IconClipboardText,
  IconCreditCard,
  IconFileDescription,
  IconFileText,
  IconHelpCircle,
  IconLayoutDashboard,
  IconReceipt2,
  IconReportAnalytics,
  IconSchool,
  IconSettings,
  IconUsers,
  IconUserStar,
  IconNotebook,
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconTopologyStar,
  IconTableColumn,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

type SidebarItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

type SidebarSection = {
  label: string;
  items: SidebarItem[];
};

const sections: SidebarSection[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: IconLayoutDashboard,
      },
      {
        title: "Announcement",
        url: "/admin/announcement",
        icon: IconBroadcast,
        badge: "2",
      },
      {
        title: "Admissions",
        url: "/admin/admissions",
        icon: IconTopologyStar,
      },
    ],
  },
  {
    label: "Academics",
    items: [
      {
        title: "Students",
        url: "/admin/users/students",
        icon: IconUsers,
      },
      {
        title: "Enrollment",
        url: "/admin/enrollment",
        icon: IconBuilding,
      },
      {
        title: "Program & Courses",
        url: "/admin/academics/courses",
        icon: IconBooks,
      },
      {
        title: "Grades & Transcripts",
        url: "/admin/grade/records",
        icon: IconClipboardText,
      },
      {
        title: "Assignments",
        url: "/admin/lms/assignments",
        icon: IconNotebook,
      },
      {
        title: "Examinations",
        url: "/admin/lms/examinations",
        icon: IconBriefcase,
      },
      {
        title: "Learning Materials",
        url: "/admin/lms/study-materials",
        icon: IconSchool,
      },
      {
        title: "Attendance Management",
        url: "/admin/academics/attendance",
        icon: IconChartBar,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Faculty",
        url: "/admin/users/instructors",
        icon: IconUserStar,
      },
      {
        title: "Document Requests",
        url: "/admin/document-requests",
        icon: IconFileText,
      },
      {
        title: "Fees & Payments",
        url: "/admin/fee-collection",
        icon: IconCreditCard,
      },
      {
        title: "Thesis & Dissertation",
        url: "/admin/academics/thesis-dissertation",
        icon: IconReceipt2,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Settings",
        url: "/admin/school-settings",
        icon: IconSettings,
      },
      {
        title: "Academic Years",
        url: "/admin/academic-years",
        icon: IconCalendar,
      },
      {
        title: "Time Table",
        url: "/admin/academics/timetable",
        icon: IconTableColumn,
      },
      {
        title: "Grade Configuration",
        url: "/admin/grade/configuration",
        icon: IconReportAnalytics,
      },
      {
        title: "Reports",
        url: "/admin/reports",
        icon: IconFileDescription,
      },
      {
        title: "Help & Support",
        url: "/admin/help-support",
        icon: IconHelpCircle,
      },
    ],
  },
];

function isItemActive(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`);
}

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader className="border-b border-white/8 bg-[#173f20] px-4 py-3 text-white">
        {isCollapsed ? (
          <div className="flex relative size-6 items-center justify-center">
            <Image
              src="/main/logo.png"
              alt="Pearl of the Orient"
              fill
              className="object-contain rounded-full"
            />
          </div>
        ) : (
          <div className="space-y-3 text-center">
            <div className="mx-auto flex justify-center">
              <Image
                src="/main/logo.png"
                alt="Pearl of the Orient"
                width={60}
                height={60}
                className="size-15 rounded-full"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase">
                Pearl of the Orient Theological Seminary and Colleges
              </p>
              <Badge>Admin Portal</Badge>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-[#173f20] px-3 py-4 scrollbar-hide text-white">
        <div className="space-y-5">
          {sections.map((section) => (
            <section
              key={section.label}
              className={cn(
                "space-y-2",
                !isCollapsed &&
                  "border-t border-white/14 pt-3 first:border-t-0 first:pt-0",
              )}
            >
              {!isCollapsed ? (
                <p className="px-2 text-[11px] font-medium uppercase">
                  {section.label}
                </p>
              ) : null}

              <SidebarMenu className="gap-1">
                {section.items.map((item) => {
                  const active = isItemActive(pathname, item.url);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className={cn(
                          "h-10 rounded-xl border border-transparent px-3 text-white transition-all hover:bg-white/6 hover:text-white data-[active=true]:bg-[#6ea775] data-[active=true]:text-white",
                          isCollapsed && "justify-center px-0",
                          !active && "bg-transparent",
                        )}
                      >
                        <Link
                          href={item.url}
                          className={cn(
                            "flex w-full items-center gap-3",
                            isCollapsed && "justify-center",
                          )}
                        >
                          <Icon className="size-5 shrink-0" />
                          {!isCollapsed ? (
                            <>
                              <span className="truncate text-[15px] font-medium">
                                {item.title}
                              </span>
                              {item.badge ? (
                                <span className="ml-auto inline-flex min-w-7 items-center justify-center rounded-full bg-[#c65252] px-2 py-0.5 text-xs font-semibold text-white">
                                  {item.badge}
                                </span>
                              ) : null}
                            </>
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </section>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="bg-[#173f20]" />
    </Sidebar>
  );
};
