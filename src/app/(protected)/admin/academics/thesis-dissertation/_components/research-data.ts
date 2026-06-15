export type ResearchTrack = "Masteral" | "Doctorate";

export type ResearchStage =
  | "Proposal Review"
  | "Writing"
  | "For Defense"
  | "Completed";

export type ResearchType = "Thesis" | "Dissertation";

export type ResearchRecord = {
  adviser: string;
  defenseDate: string | null;
  panelChair: string;
  program: string;
  referenceNumber: string;
  researcherName: string;
  researcherStudentId: string;
  stage: ResearchStage;
  title: string;
  track: ResearchTrack;
  type: ResearchType;
};

export const researchTrackOptions = ["Masteral", "Doctorate"] as const;
export const researchStageOptions = [
  "Proposal Review",
  "Writing",
  "For Defense",
  "Completed",
] as const;
export const researchTypeOptions = ["Thesis", "Dissertation"] as const;

export const researchRecords: ResearchRecord[] = [
  {
    referenceNumber: "POTSC-RES-2026-0001",
    researcherStudentId: "POTSC-2026-0005",
    researcherName: "Josephine M. Rivera",
    title: "Transformative Christian Education Models for Urban Ministry Contexts",
    type: "Thesis",
    track: "Masteral",
    program: "Master of Arts in Christian Education",
    adviser: "Dr. Miriam L. Gutierrez",
    panelChair: "Dr. Estrella C. Navarro",
    stage: "Writing",
    defenseDate: null,
  },
  {
    referenceNumber: "POTSC-RES-2026-0002",
    researcherStudentId: "POTSC-2026-0006",
    researcherName: "Benjamin T. Reyes",
    title: "Adaptive Chaplaincy Leadership in Crisis-Responsive Faith Communities",
    type: "Dissertation",
    track: "Doctorate",
    program: "Doctor of Ministry",
    adviser: "Dr. Patricia V. Alcantara",
    panelChair: "Rev. Daniel M. Soriano",
    stage: "For Defense",
    defenseDate: "2026-06-14",
  },
  {
    referenceNumber: "POTSC-RES-2026-0003",
    researcherStudentId: "POTSC-2026-0009",
    researcherName: "Teresa V. Mendoza",
    title: "Faith Formation Pedagogies for Multi-Generational Congregations",
    type: "Thesis",
    track: "Masteral",
    program: "Master of Religious Education",
    adviser: "Dr. Miriam L. Gutierrez",
    panelChair: "Ptr. Jonathan P. Reyes",
    stage: "Proposal Review",
    defenseDate: null,
  },
  {
    referenceNumber: "POTSC-RES-2026-0004",
    researcherStudentId: "POTSC-2026-0010",
    researcherName: "David B. Aquino",
    title: "Hermeneutical Approaches to Public Theology in Southeast Asian Contexts",
    type: "Dissertation",
    track: "Doctorate",
    program: "Doctor of Philosophy in Theology",
    adviser: "Dr. Estrella C. Navarro",
    panelChair: "Dr. Patricia V. Alcantara",
    stage: "Writing",
    defenseDate: null,
  },
  {
    referenceNumber: "POTSC-RES-2026-0005",
    researcherStudentId: "POTSC-2026-0013",
    researcherName: "Angela P. Flores",
    title: "Integrative Spiritual Care Models for Hospital-Based Chaplaincy",
    type: "Thesis",
    track: "Masteral",
    program: "Master of Divinity",
    adviser: "Rev. Joel A. Mendoza",
    panelChair: "Dr. Miriam L. Gutierrez",
    stage: "Completed",
    defenseDate: "2026-04-28",
  },
  {
    referenceNumber: "POTSC-RES-2026-0006",
    researcherStudentId: "POTSC-2026-0014",
    researcherName: "Noel P. Santos",
    title: "Contextual Leadership Formation for Mission-Driven Local Churches",
    type: "Dissertation",
    track: "Doctorate",
    program: "Doctor of Ministry",
    adviser: "Dr. Patricia V. Alcantara",
    panelChair: "Rev. Daniel M. Soriano",
    stage: "Proposal Review",
    defenseDate: null,
  },
];
