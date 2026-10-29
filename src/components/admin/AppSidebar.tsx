/* eslint-disable react-hooks/set-state-in-effect */
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
  IconLayoutDashboard,
  IconReceipt2,
  IconReportAnalytics,
  IconSchool,
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
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import { useSeminaryAnnouncementsQuery } from "@/features/seminary/seminary.hooks";
import { isInstructorAllowedPath } from "./instructor-access";

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
        url: "/portal/dashboard",
        icon: IconLayoutDashboard,
      },
      {
        title: "Announcement",
        url: "/portal/announcement",
        icon: IconBroadcast,
      },
      {
        title: "Admissions",
        url: "/portal/admissions",
        icon: IconTopologyStar,
      },
    ],
  },
  {
    label: "Academics",
    items: [
      {
        title: "Students",
        url: "/portal/users/students",
        icon: IconUsers,
      },
      {
        title: "Enrollment",
        url: "/portal/enrollment",
        icon: IconBuilding,
      },
      {
        title: "Program & Courses",
        url: "/portal/academics/courses",
        icon: IconBooks,
      },
      {
        title: "Grades & Transcripts",
        url: "/portal/grade/records",
        icon: IconClipboardText,
      },
      {
        title: "Assignments",
        url: "/portal/lms/assignments",
        icon: IconNotebook,
      },
      {
        title: "Examinations",
        url: "/portal/lms/examinations",
        icon: IconBriefcase,
      },
      {
        title: "Learning Materials",
        url: "/portal/lms/study-materials",
        icon: IconSchool,
      },
      {
        title: "Attendance Management",
        url: "/portal/academics/attendance",
        icon: IconChartBar,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Faculty",
        url: "/portal/users/instructors",
        icon: IconUserStar,
      },
      {
        title: "Document Requests",
        url: "/portal/document-requests",
        icon: IconFileText,
      },
      {
        title: "Fees & Payments",
        url: "/portal/fee-collection",
        icon: IconCreditCard,
      },
      {
        title: "Thesis & Dissertation",
        url: "/portal/academics/thesis-dissertation",
        icon: IconReceipt2,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Academic Years",
        url: "/portal/academic-years",
        icon: IconCalendar,
      },
      {
        title: "Time Table",
        url: "/portal/academics/timetable",
        icon: IconTableColumn,
      },
      {
        title: "Grade Configuration",
        url: "/portal/grade/configuration",
        icon: IconReportAnalytics,
      },
      {
        title: "Reports",
        url: "/portal/reports",
        icon: IconFileDescription,
      },
    ],
  },
];

const studentSections: SidebarSection[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/students/dashboard",
        icon: IconLayoutDashboard,
      },
      {
        title: "Announcements",
        url: "/students/announcements",
        icon: IconBroadcast,
      },
      { title: "My Grades", url: "/students/grades", icon: IconClipboardText },
    ],
  },
  {
    label: "Learning",
    items: [
      {
        title: "Learning Materials",
        url: "/students/materials",
        icon: IconSchool,
      },
      {
        title: "Assignments",
        url: "/students/assignments",
        icon: IconNotebook,
      },
      {
        title: "Examinations",
        url: "/students/examinations",
        icon: IconBriefcase,
      },
      {
        title: "Document Requests",
        url: "/students/document-requests",
        icon: IconFileText,
      },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "My Profile", url: "/students/profile", icon: IconUserStar },
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
  const { data: currentUser } = useCurrentUserQuery();
  const announcementsQuery = useSeminaryAnnouncementsQuery();
  const isCollapsed = state === "collapsed";
  const [seenAnnouncementsAt, setSeenAnnouncementsAt] = React.useState(0);
  const announcementUrl =
    currentUser?.role === "MEMBER"
      ? "/students/announcements"
      : "/portal/announcement";
  const announcementStorageKey = currentUser?.id
    ? `seminary-announcements-seen:${currentUser.id}`
    : null;
  const unreadAnnouncements = React.useMemo(() => {
    const visibleAnnouncements =
      announcementsQuery.data?.data.filter(
        (item) => item.status === "PUBLISHED",
      ) ?? [];
    if (!announcementStorageKey || typeof window === "undefined")
      return visibleAnnouncements.length;
    const seenAt =
      seenAnnouncementsAt ||
      Number(window.localStorage.getItem(announcementStorageKey) ?? 0);
    return visibleAnnouncements.filter(
      (item) => new Date(item.createdAt).getTime() > seenAt,
    ).length;
  }, [
    announcementStorageKey,
    announcementsQuery.data?.data,
    seenAnnouncementsAt,
  ]);

  React.useEffect(() => {
    if (announcementStorageKey && isItemActive(pathname, announcementUrl)) {
      const now = Date.now();
      window.localStorage.setItem(announcementStorageKey, String(now));
      setSeenAnnouncementsAt(now);
    }
  }, [announcementStorageKey, announcementUrl, pathname]);
  const visibleSections =
    currentUser?.role === "MEMBER"
      ? studentSections
      : currentUser?.role === "INSTRUCTOR"
        ? sections
            .map((section) => ({
              ...section,
              items: section.items.filter((item) =>
                isInstructorAllowedPath(item.url),
              ),
            }))
            .filter((section) => section.items.length > 0)
        : sections;

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
              <Badge>
                {currentUser?.role === "MEMBER"
                  ? "Student"
                  : currentUser?.role === "ADMIN"
                    ? "Admin"
                    : "Instructor"}{" "}
                Portal
              </Badge>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-[#173f20] px-3 py-4 scrollbar-hide text-white">
        <div className="space-y-5">
          {visibleSections.map((section) => (
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
                  const badge =
                    item.url === announcementUrl && unreadAnnouncements > 0
                      ? String(unreadAnnouncements)
                      : item.badge;

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
                              {badge ? (
                                <span className="ml-auto inline-flex min-w-7 items-center justify-center rounded-full bg-[#c65252] px-2 py-0.5 text-xs font-semibold text-white">
                                  {badge}
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
