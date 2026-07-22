import type { ProgramLevel } from "../../_components/student-data";

export type ProgramGroup = {
  label: `${ProgramLevel} Programs`;
  level: ProgramLevel;
  programs: string[];
};

export const programGroups: ProgramGroup[] = [
  {
    label: "Certificate Programs",
    level: "Certificate",
    programs: [
      "Certificate in Christian Evangelism",
      "Certificate in Christian Ministry",
      "Certificate in ECE & SPED Management",
      "Certificate in Advanced Ministerial",
      "Certificate in Advanced Theology",
      "Professional Chaplaincy",
    ],
  },
  {
    label: "Bachelor Programs",
    level: "Bachelor",
    programs: [
      "Bachelor of Theology",
      "Bachelor of Theology (Major in Pastoral Ministry)",
      "Bachelor of Theology (Major in Chaplaincy)",
      "Bachelor of Religious Education",
      "Bachelor of Christian Ministry (Major in Human Resources & Community Development)",
      "Bachelor of Christian Ministry (Major in Christian Leadership)",
      "Bachelor in Mission (Major in Cross-Culture)",
      "Bachelor in Christian Counseling",
      "Bachelor of Christian Ministry in Naturopathic Medicine",
    ],
  },
  {
    label: "Masteral Programs",
    level: "Masteral",
    programs: [
      "Master in Theology",
      "Master in Divinity",
      "Master of Religious Education",
      "Master of Christian Ministry in Complementary and Alternative Medicine (Major in Naturopathy)",
      "Master of Christian Ministry (Major in Christian Leadership)",
      "Master of Arts & Mission",
      "Master in Christian Counseling",
    ],
  },
  {
    label: "Doctorate Programs",
    level: "Doctorate",
    programs: [
      "Doctor of Christian Ministry",
      "Doctor of Ministry Alternative Medicine",
      "Doctor of Theology",
      "Doctor of Sacred Theology",
      "Doctor of Religious Education",
      "Doctor of Philosophy (Major in Christian Leadership & Management)",
      "Doctor of Philosophy (Major in Biblical Studies)",
      "Doctor of Philosophy in Theology",
      "Doctor of Philosophy in Christian Apologetics",
      "Doctor of Philosophy in Religion",
      "Doctor of Philosophy (Major in Pastoral Ministry)",
      "Doctor of Philosophy (Major in Pastoral Guidance & Counseling)",
    ],
  },
];

export const programLevelOptions = programGroups.map((group) => ({
  label: group.level,
  value: group.level,
}));

export const getProgramsByLevel = (level: ProgramLevel) =>
  programGroups.find((group) => group.level === level)?.programs ?? [];
