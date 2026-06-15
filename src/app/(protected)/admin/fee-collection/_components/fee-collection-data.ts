export type CollectionStatus =
  | "Pending"
  | "Partially Paid"
  | "Paid"
  | "Overdue";

export type CollectionProgram =
  | "Certificate"
  | "Bachelor"
  | "Masteral"
  | "Doctorate";

export type PaymentMethod = "Cash" | "GCash" | "Bank Transfer" | "Installment";

export type FeeCollectionRecord = {
  amountPaid: number;
  balance: number;
  dueDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  status: CollectionStatus;
  studentId: string;
  studentName: string;
  totalCharges: number;
  program: string;
  programLevel: CollectionProgram;
};

export type ChargeBreakdownItem = {
  amount: number;
  label: string;
};

export const collectionStatusOptions = [
  "Pending",
  "Partially Paid",
  "Paid",
  "Overdue",
] as const;

export const collectionProgramOptions = [
  "Certificate",
  "Bachelor",
  "Masteral",
  "Doctorate",
] as const;

export const chargeBreakdown: ChargeBreakdownItem[] = [
  { label: "Registration Fee", amount: 500 },
  { label: "Tuition Fee", amount: 3000 },
  { label: "School Uniform", amount: 900 },
  { label: "Graduation Fee", amount: 5000 },
  { label: "Google Meet Subscription", amount: 100 },
];

export const totalChargeAmount = chargeBreakdown.reduce(
  (sum, item) => sum + item.amount,
  0,
);

export const feeCollectionRecords: FeeCollectionRecord[] = [
  {
    referenceNumber: "POTSC-FEE-2026-0001",
    studentId: "POTSC-2026-0002",
    studentName: "Maria L. Santos",
    program: "Bachelor of Theology",
    programLevel: "Bachelor",
    totalCharges: totalChargeAmount,
    amountPaid: 9500,
    balance: 0,
    dueDate: "2026-05-25",
    paymentMethod: "GCash",
    status: "Paid",
  },
  {
    referenceNumber: "POTSC-FEE-2026-0002",
    studentId: "POTSC-2026-0005",
    studentName: "Josephine M. Rivera",
    program: "Master of Arts in Christian Education",
    programLevel: "Masteral",
    totalCharges: totalChargeAmount,
    amountPaid: 5000,
    balance: 4500,
    dueDate: "2026-05-24",
    paymentMethod: "Installment",
    status: "Partially Paid",
  },
  {
    referenceNumber: "POTSC-FEE-2026-0003",
    studentId: "POTSC-2026-0001",
    studentName: "Juan Dela Cruz",
    program: "Certificate in Chaplaincy Ministry",
    programLevel: "Certificate",
    totalCharges: totalChargeAmount,
    amountPaid: 0,
    balance: 9500,
    dueDate: "2026-05-23",
    paymentMethod: "Cash",
    status: "Pending",
  },
  {
    referenceNumber: "POTSC-FEE-2026-0004",
    studentId: "POTSC-2026-0006",
    studentName: "Benjamin T. Reyes",
    program: "Doctor of Ministry",
    programLevel: "Doctorate",
    totalCharges: totalChargeAmount,
    amountPaid: 9500,
    balance: 0,
    dueDate: "2026-05-20",
    paymentMethod: "Bank Transfer",
    status: "Paid",
  },
  {
    referenceNumber: "POTSC-FEE-2026-0005",
    studentId: "POTSC-2026-0010",
    studentName: "David B. Aquino",
    program: "Doctor of Philosophy in Theology",
    programLevel: "Doctorate",
    totalCharges: totalChargeAmount,
    amountPaid: 3000,
    balance: 6500,
    dueDate: "2026-05-18",
    paymentMethod: "Installment",
    status: "Overdue",
  },
  {
    referenceNumber: "POTSC-FEE-2026-0006",
    studentId: "POTSC-2026-0012",
    studentName: "Samuel P. Dizon",
    program: "Certificate in Chaplaincy Ministry",
    programLevel: "Certificate",
    totalCharges: totalChargeAmount,
    amountPaid: 4500,
    balance: 5000,
    dueDate: "2026-05-27",
    paymentMethod: "Cash",
    status: "Partially Paid",
  },
];
