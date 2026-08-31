export type InstructorStatus = "Active" | "Part-time" | "On Leave" | "Inactive";

export type InstructorProgram =
  | "Certificate"
  | "Bachelor"
  | "Masteral"
  | "Doctorate";

export type InstructorRank =
  | "Adjunct Instructor"
  | "Lecturer"
  | "Assistant Professor"
  | "Associate Professor"
  | "Professor";

export type InstructorRating =
  | "Outstanding"
  | "Excellent"
  | "Very Satisfactory"
  | "Satisfactory"
  | "Fair"
  | "Passing"
  | "Needs Improvement";

export type InstructorRankingClassification =
  | "With Distinction"
  | "With Honors"
  | "Commendable Performance"
  | "Qualified Member"
  | "Needs Improvement";

export type InstructorAward = "Gold Award" | "Silver Award" | "Bronze Award" | "No Award";

export type InstructorEvaluation = {
  attendanceParticipation: number;
  leadershipCharacter: number;
  ministryCommunityEngagement: number;
  knowledgeSkillsAssessment: number;
  professionalConductEthics: number;
  totalScore: number;
  rating: InstructorRating;
  rankingClassification: InstructorRankingClassification;
  award: InstructorAward;
};

export type InstructorRecord = {
  areasOfExpertise: string[];
  biography: string;
  credentials: string[];
  contactNumber: string;
  educationalBackground: string;
  email: string;
  evaluation: InstructorEvaluation;
  facultyId: string;
  formalPhotoUrl: string;
  highSchoolGraduateOrEquivalent: boolean;
  id?: string;
  inviteAcceptedAt?: string | null;
  inviteTokenSentAt?: string | null;
  isFilipinoCitizen: boolean;
  loadUnits: number;
  ministerialExperienceYears: number;
  name: string;
  professionalTitle: string;
  rank: InstructorRank;
  status: InstructorStatus;
  submissionDeadline: string;
  teachingPrograms: InstructorProgram[];
};

export const instructorProgramOptions = [
  "Certificate",
  "Bachelor",
  "Masteral",
  "Doctorate",
] as const;

export const instructorStatusOptions = [
  "Active",
  "Part-time",
  "On Leave",
  "Inactive",
] as const;

export const createInstructorEvaluation = ({
  attendanceParticipation,
  leadershipCharacter,
  ministryCommunityEngagement,
  knowledgeSkillsAssessment,
  professionalConductEthics,
}: Omit<
  InstructorEvaluation,
  "award" | "rankingClassification" | "rating" | "totalScore"
>): InstructorEvaluation => {
  const totalScore =
    attendanceParticipation * 0.2 +
    leadershipCharacter * 0.2 +
    ministryCommunityEngagement * 0.25 +
    knowledgeSkillsAssessment * 0.2 +
    professionalConductEthics * 0.15;
  const roundedScore = Number(totalScore.toFixed(2));

  const rating: InstructorRating =
    roundedScore >= 98
      ? "Outstanding"
      : roundedScore >= 95
        ? "Excellent"
        : roundedScore >= 90
          ? "Very Satisfactory"
          : roundedScore >= 85
            ? "Satisfactory"
            : roundedScore >= 80
              ? "Fair"
              : roundedScore >= 75
                ? "Passing"
                : "Needs Improvement";

  const rankingClassification: InstructorRankingClassification =
    roundedScore >= 95
      ? "With Distinction"
      : roundedScore >= 90
        ? "With Honors"
        : roundedScore >= 85
          ? "Commendable Performance"
          : roundedScore >= 75
            ? "Qualified Member"
            : "Needs Improvement";

  const award: InstructorAward =
    roundedScore >= 95
      ? "Gold Award"
      : roundedScore >= 90
        ? "Silver Award"
        : roundedScore >= 85
          ? "Bronze Award"
          : "No Award";

  return {
    attendanceParticipation,
    award,
    knowledgeSkillsAssessment,
    leadershipCharacter,
    ministryCommunityEngagement,
    professionalConductEthics,
    rankingClassification,
    rating,
    totalScore: roundedScore,
  };
};

export const instructorRecords: InstructorRecord[] = [
  {
    areasOfExpertise: ["Old Testament", "Biblical Theology", "Seminary Formation"],
    biography:
      "Experienced minister and biblical studies instructor focused on forming Scripture-grounded leaders for church and community service.",
    facultyId: "POTSC-FAC-2026-0001",
    name: "Rev. Daniel M. Soriano",
    professionalTitle: "Associate Professor of Biblical Studies",
    email: "daniel.soriano@potsc.edu.ph",
    contactNumber: "09171234567",
    educationalBackground: "Master of Divinity; Bachelor of Theology",
    credentials: ["Certificate of Christian Service", "Ministry Leadership Certificate"],
    formalPhotoUrl: "",
    isFilipinoCitizen: true,
    highSchoolGraduateOrEquivalent: true,
    ministerialExperienceYears: 12,
    teachingPrograms: ["Bachelor"],
    rank: "Associate Professor",
    loadUnits: 12,
    status: "Active",
    submissionDeadline: "2026-08-01",
    evaluation: createInstructorEvaluation({
      attendanceParticipation: 96,
      leadershipCharacter: 97,
      ministryCommunityEngagement: 98,
      knowledgeSkillsAssessment: 96,
      professionalConductEthics: 97,
    }),
  },
  {
    areasOfExpertise: ["Systematic Theology", "Doctrine", "Graduate Research"],
    biography:
      "Graduate faculty member specializing in doctrinal studies, academic mentoring, and theological research formation.",
    facultyId: "POTSC-FAC-2026-0002",
    name: "Dr. Estrella C. Navarro",
    professionalTitle: "Professor of Systematic Theology",
    email: "estrella.navarro@potsc.edu.ph",
    contactNumber: "09182345678",
    educationalBackground: "Doctor of Theology; Master of Arts in Theology",
    credentials: ["Professional Teaching Certification", "Research Leadership Award"],
    formalPhotoUrl: "",
    isFilipinoCitizen: true,
    highSchoolGraduateOrEquivalent: true,
    ministerialExperienceYears: 18,
    teachingPrograms: ["Doctorate"],
    rank: "Professor",
    loadUnits: 9,
    status: "Active",
    submissionDeadline: "2026-08-01",
    evaluation: createInstructorEvaluation({
      attendanceParticipation: 98,
      leadershipCharacter: 98,
      ministryCommunityEngagement: 97,
      knowledgeSkillsAssessment: 99,
      professionalConductEthics: 98,
    }),
  },
  {
    areasOfExpertise: ["Chaplaincy", "Pastoral Care", "Field Ministry"],
    biography:
      "Chaplaincy formation lecturer with field ministry experience in pastoral care and community engagement.",
    facultyId: "POTSC-FAC-2026-0003",
    name: "Ptr. Jonathan P. Reyes",
    professionalTitle: "Lecturer in Chaplaincy Formation",
    email: "jonathan.reyes@potsc.edu.ph",
    contactNumber: "09193456789",
    educationalBackground: "Bachelor of Theology; Chaplaincy Training Program",
    credentials: ["Chaplaincy Training Certificate", "Community Service Certificate"],
    formalPhotoUrl: "",
    isFilipinoCitizen: true,
    highSchoolGraduateOrEquivalent: true,
    ministerialExperienceYears: 9,
    teachingPrograms: ["Certificate"],
    rank: "Lecturer",
    loadUnits: 6,
    status: "Part-time",
    submissionDeadline: "2026-08-01",
    evaluation: createInstructorEvaluation({
      attendanceParticipation: 90,
      leadershipCharacter: 91,
      ministryCommunityEngagement: 94,
      knowledgeSkillsAssessment: 89,
      professionalConductEthics: 92,
    }),
  },
  {
    areasOfExpertise: ["Christian Education", "Curriculum", "Teaching Design"],
    biography:
      "Christian education professor supporting curriculum design, instructional planning, and faculty mentoring.",
    facultyId: "POTSC-FAC-2026-0004",
    name: "Dr. Miriam L. Gutierrez",
    professionalTitle: "Professor of Christian Education",
    email: "miriam.gutierrez@potsc.edu.ph",
    contactNumber: "09204567890",
    educationalBackground: "Doctor of Education; Master of Religious Education",
    credentials: ["Training and Seminar Certificates", "Awards and Recognitions"],
    formalPhotoUrl: "",
    isFilipinoCitizen: true,
    highSchoolGraduateOrEquivalent: true,
    ministerialExperienceYears: 16,
    teachingPrograms: ["Masteral"],
    rank: "Professor",
    loadUnits: 9,
    status: "Active",
    submissionDeadline: "2026-08-01",
    evaluation: createInstructorEvaluation({
      attendanceParticipation: 94,
      leadershipCharacter: 95,
      ministryCommunityEngagement: 93,
      knowledgeSkillsAssessment: 96,
      professionalConductEthics: 95,
    }),
  },
  {
    areasOfExpertise: ["Church Administration", "Governance", "Compliance"],
    biography:
      "Adjunct instructor providing church administration, governance, and organizational policy instruction.",
    facultyId: "POTSC-FAC-2026-0005",
    name: "Atty. Samuel R. Dizon",
    professionalTitle: "Adjunct Instructor in Church Administration",
    email: "samuel.dizon@potsc.edu.ph",
    contactNumber: "09215678901",
    educationalBackground: "Juris Doctor; Bachelor of Theology",
    credentials: ["Professional License", "Leadership Certificates"],
    formalPhotoUrl: "",
    isFilipinoCitizen: true,
    highSchoolGraduateOrEquivalent: true,
    ministerialExperienceYears: 7,
    teachingPrograms: ["Bachelor"],
    rank: "Adjunct Instructor",
    loadUnits: 3,
    status: "Part-time",
    submissionDeadline: "2026-08-01",
    evaluation: createInstructorEvaluation({
      attendanceParticipation: 86,
      leadershipCharacter: 88,
      ministryCommunityEngagement: 85,
      knowledgeSkillsAssessment: 90,
      professionalConductEthics: 91,
    }),
  },
  {
    areasOfExpertise: ["Greek", "Hermeneutics", "Biblical Languages"],
    biography:
      "Assistant professor specializing in biblical language instruction and interpretive method.",
    facultyId: "POTSC-FAC-2026-0006",
    name: "Sis. Clarita B. Flores",
    professionalTitle: "Assistant Professor of Biblical Languages",
    email: "clarita.flores@potsc.edu.ph",
    contactNumber: "09226789012",
    educationalBackground: "Master of Biblical Languages; Bachelor of Theology",
    credentials: ["Training Certificates", "Seminar Certificates"],
    formalPhotoUrl: "",
    isFilipinoCitizen: true,
    highSchoolGraduateOrEquivalent: true,
    ministerialExperienceYears: 8,
    teachingPrograms: ["Bachelor"],
    rank: "Assistant Professor",
    loadUnits: 10,
    status: "On Leave",
    submissionDeadline: "2026-08-01",
    evaluation: createInstructorEvaluation({
      attendanceParticipation: 84,
      leadershipCharacter: 86,
      ministryCommunityEngagement: 83,
      knowledgeSkillsAssessment: 88,
      professionalConductEthics: 87,
    }),
  },
  {
    areasOfExpertise: ["Homiletics", "Worship", "Preaching"],
    biography:
      "Lecturer training students in preaching, worship leadership, and pastoral communication.",
    facultyId: "POTSC-FAC-2026-0007",
    name: "Rev. Joel A. Mendoza",
    professionalTitle: "Lecturer in Homiletics and Worship",
    email: "joel.mendoza@potsc.edu.ph",
    contactNumber: "09237890123",
    educationalBackground: "Master of Divinity; Certificate in Worship Leadership",
    credentials: ["Ministry Training Certificate", "Christian Service Certificate"],
    formalPhotoUrl: "",
    isFilipinoCitizen: true,
    highSchoolGraduateOrEquivalent: true,
    ministerialExperienceYears: 11,
    teachingPrograms: ["Certificate"],
    rank: "Lecturer",
    loadUnits: 8,
    status: "Active",
    submissionDeadline: "2026-08-01",
    evaluation: createInstructorEvaluation({
      attendanceParticipation: 91,
      leadershipCharacter: 92,
      ministryCommunityEngagement: 93,
      knowledgeSkillsAssessment: 90,
      professionalConductEthics: 92,
    }),
  },
  {
    areasOfExpertise: ["Research Methods", "Dissertation Advising", "Theology"],
    biography:
      "Research faculty member supporting doctoral scholarship, thesis advising, and theological methodology.",
    facultyId: "POTSC-FAC-2026-0008",
    name: "Dr. Patricia V. Alcantara",
    professionalTitle: "Associate Professor of Research",
    email: "patricia.alcantara@potsc.edu.ph",
    contactNumber: "09248901234",
    educationalBackground: "Doctor of Philosophy in Theology; Master of Divinity",
    credentials: ["Research Awards", "Professional Certifications"],
    formalPhotoUrl: "",
    isFilipinoCitizen: true,
    highSchoolGraduateOrEquivalent: true,
    ministerialExperienceYears: 14,
    teachingPrograms: ["Doctorate"],
    rank: "Associate Professor",
    loadUnits: 6,
    status: "Inactive",
    submissionDeadline: "2026-08-01",
    evaluation: createInstructorEvaluation({
      attendanceParticipation: 82,
      leadershipCharacter: 84,
      ministryCommunityEngagement: 80,
      knowledgeSkillsAssessment: 86,
      professionalConductEthics: 85,
    }),
  },
];
