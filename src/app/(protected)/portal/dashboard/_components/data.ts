import {
  IconCreditCard,
  IconFileText,
  IconSchool,
  IconUsers,
} from "@tabler/icons-react";
import { type ChartConfig } from "@/components/ui/chart";

export const academicYear = "Academic Year 2025-2026 | 1st Semester";

export const kpiCards = [
  {
    title: "Total Students",
    value: 58,
    delta: "+12 this semester",
    positive: true,
    icon: IconUsers,
  },
  {
    title: "Pending Enrollments",
    value: 12,
    delta: "-5 this week",
    positive: false,
    icon: IconSchool,
  },
  {
    title: "Pending Payments",
    value: 12,
    delta: "+3 awaiting review",
    positive: true,
    icon: IconCreditCard,
  },
  {
    title: "Submitted Documents",
    value: 41,
    delta: "+9 verified today",
    positive: true,
    icon: IconFileText,
  },
] as const;

export const enrollmentTrend = [
  { date: "2026-01-05", enrolled: 6, pending: 3 },
  { date: "2026-01-12", enrolled: 10, pending: 5 },
  { date: "2026-01-19", enrolled: 12, pending: 4 },
  { date: "2026-01-26", enrolled: 16, pending: 5 },
  { date: "2026-02-02", enrolled: 18, pending: 6 },
  { date: "2026-02-09", enrolled: 24, pending: 8 },
  { date: "2026-02-16", enrolled: 31, pending: 7 },
  { date: "2026-02-23", enrolled: 35, pending: 9 },
  { date: "2026-03-02", enrolled: 40, pending: 8 },
  { date: "2026-03-09", enrolled: 47, pending: 6 },
  { date: "2026-03-16", enrolled: 52, pending: 4 },
  { date: "2026-03-23", enrolled: 58, pending: 3 },
];

export const paymentStatusTrend = [
  { period: "Jan", verified: 12, pending: 6, flagged: 2 },
  { period: "Feb", verified: 16, pending: 7, flagged: 3 },
  { period: "Mar", verified: 19, pending: 5, flagged: 2 },
  { period: "Apr", verified: 22, pending: 4, flagged: 2 },
  { period: "May", verified: 24, pending: 3, flagged: 1 },
];

export const programDistribution = [
  { name: "Certificate", value: 9, fill: "#c8dabc" },
  { name: "Bachelor", value: 22, fill: "#1f6a39" },
  { name: "Masteral", value: 16, fill: "#4d8b57" },
  { name: "Doctorate", value: 11, fill: "#7cab7d" },
];

export const recentApplications = [
  {
    student: "Joyce C. Orog",
    id: "POTSC-2026-0001",
    program: "Bachelor of Theology",
    programLevel: "Bachelor",
    applicationType: "New",
    enrollmentStatus: "Pending",
    paymentStatus: "For verification",
    submittedAt: "2026-05-18",
  },
  {
    student: "Ramon D. Elma",
    id: "POTSC-2026-0002",
    program: "Certificate in Chaplaincy Ministry",
    programLevel: "Certificate",
    applicationType: "Returning",
    enrollmentStatus: "Enrolled",
    paymentStatus: "Paid",
    submittedAt: "2026-05-17",
  },
  {
    student: "Grace T. Tolentino",
    id: "POTSC-2026-0003",
    program: "Master of Arts in Christian Education",
    programLevel: "Masteral",
    applicationType: "Transferee",
    enrollmentStatus: "Pending",
    paymentStatus: "Awaiting proof",
    submittedAt: "2026-05-13",
  },
  {
    student: "Noel P. Santos",
    id: "POTSC-2026-0004",
    program: "Doctor of Ministry",
    programLevel: "Doctorate",
    applicationType: "New",
    enrollmentStatus: "Enrolled",
    paymentStatus: "Paid",
    submittedAt: "2026-05-10",
  },
  {
    student: "Mira S. Candelaria",
    id: "POTSC-2026-0005",
    program: "Master of Divinity",
    programLevel: "Masteral",
    applicationType: "New",
    enrollmentStatus: "Pending",
    paymentStatus: "Pending",
    submittedAt: "2026-05-08",
  },
];

export const upcomingEvents = [
  {
    date: "2026-05-22",
    title: "Faculty Meeting",
    time: "10:00 AM",
    location: "Dean's Office",
    tag: "Admin",
  },
  {
    date: "2026-05-20",
    title: "Student Orientation",
    time: "08:00 AM",
    location: "Chapel",
    tag: "Academic",
  },
  {
    date: "2026-05-26",
    title: "Registrar Review",
    time: "01:30 PM",
    location: "Records Unit",
    tag: "Enrollment",
  },
] as const;

export const trendConfig = {
  enrolled: { label: "Enrolled", color: "#1f6a39" },
  pending: { label: "Pending", color: "#9eb6a4" },
} satisfies ChartConfig;

export const paymentConfig = {
  verified: { label: "Verified", color: "#1f6a39" },
  pending: { label: "Pending", color: "#82a887" },
  flagged: { label: "Flagged", color: "#d08a5a" },
} satisfies ChartConfig;

export const programConfig = {
  Certificate: { label: "Certificate", color: "#c8dabc" },
  Bachelor: { label: "Bachelor", color: "#1f6a39" },
  Masteral: { label: "Masteral", color: "#4d8b57" },
  Doctorate: { label: "Doctorate", color: "#7cab7d" },
} satisfies ChartConfig;

export type ApplicationRecord = (typeof recentApplications)[number];
export type EventRecord = (typeof upcomingEvents)[number];
