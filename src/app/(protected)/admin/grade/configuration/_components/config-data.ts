export type GradeScaleRow = {
  equivalent: string;
  percentageRange: string;
  remarks: string;
};

export const defaultGradeScale: GradeScaleRow[] = [
  { equivalent: "1.00", percentageRange: "98-100", remarks: "Excellent" },
  { equivalent: "1.25", percentageRange: "95-97", remarks: "Superior" },
  { equivalent: "1.50", percentageRange: "92-94", remarks: "Very Good" },
  { equivalent: "1.75", percentageRange: "89-91", remarks: "Good" },
  { equivalent: "2.00", percentageRange: "86-88", remarks: "Satisfactory" },
  { equivalent: "2.25", percentageRange: "83-85", remarks: "Fair" },
  { equivalent: "2.50", percentageRange: "80-82", remarks: "Passing" },
  { equivalent: "2.75", percentageRange: "77-79", remarks: "Conditional" },
  { equivalent: "3.00", percentageRange: "75-76", remarks: "Barely Passed" },
  { equivalent: "5.00", percentageRange: "Below 75", remarks: "Failed" },
];

export const gradingWeightProfiles = [
  "Standard Coursework",
  "Ministry Practicum",
  "Research and Defense",
] as const;

export const releaseWindows = [
  "Immediately after approval",
  "After dean confirmation",
  "End of term only",
] as const;
