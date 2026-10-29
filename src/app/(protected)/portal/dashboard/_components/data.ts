import { type ChartConfig } from "@/components/ui/chart";

export const trendConfig = {
  enrolled: { label: "Enrolled", color: "#1f6a39" },
  pending: { label: "Pending", color: "#9eb6a4" },
} satisfies ChartConfig;

export const paymentConfig = {
  verified: { label: "Verified", color: "#1f6a39" },
  pending: { label: "Pending", color: "#82a887" },
  rejected: { label: "Rejected", color: "#d08a5a" },
} satisfies ChartConfig;

export const programConfig = {
  CERTIFICATE: { label: "Certificate", color: "#c8dabc" },
  BACHELOR: { label: "Bachelor", color: "#1f6a39" },
  MASTER_WITH_THESIS: { label: "Masteral", color: "#4d8b57" },
  DOCTORATE_WITH_DISSERTATION: { label: "Doctorate", color: "#7cab7d" },
} satisfies ChartConfig;
