export type AnnouncementEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    location: string;
    audience: string;
    category: "Academic" | "Administration" | "Formation" | "Admissions";
    summary: string;
  };
};

export const announcementEvents: AnnouncementEvent[] = [
  {
    id: "april-01",
    title: "Holy Week Reflection and Prayer Vigil",
    start: "2026-04-01T16:00:00",
    end: "2026-04-01T18:00:00",
    backgroundColor: "#1f6a39",
    borderColor: "#1f6a39",
    extendedProps: {
      location: "Main Chapel",
      audience: "Students and Faculty",
      category: "Formation",
      summary: "An evening formation gathering focused on prayer, reflection, and spiritual preparation.",
    },
  },
  {
    id: "april-02",
    title: "Academic Council Planning Session",
    start: "2026-04-10T09:00:00",
    end: "2026-04-10T11:30:00",
    backgroundColor: "#4d8b57",
    borderColor: "#4d8b57",
    extendedProps: {
      location: "Dean's Conference Room",
      audience: "Academic Officers",
      category: "Administration",
      summary: "Curriculum sequencing, schedule planning, and faculty workload review for the next term.",
    },
  },
  {
    id: "april-03",
    title: "Admissions Open House",
    start: "2026-04-18",
    allDay: true,
    backgroundColor: "#d08a5a",
    borderColor: "#d08a5a",
    extendedProps: {
      location: "Seminary Lobby",
      audience: "Prospective Applicants",
      category: "Admissions",
      summary: "A public-facing admissions event for new applicants and ministry partners.",
    },
  },
  {
    id: "april-04",
    title: "Faculty Formation Recollection",
    start: "2026-04-24",
    end: "2026-04-25",
    allDay: true,
    backgroundColor: "#7cab7d",
    borderColor: "#7cab7d",
    extendedProps: {
      location: "Retreat House",
      audience: "Faculty",
      category: "Formation",
      summary: "An overnight recollection to support faculty spiritual renewal and ministry reflection.",
    },
  },
  {
    id: "may-01",
    title: "Student Orientation Program",
    start: "2026-05-20T08:00:00",
    end: "2026-05-20T12:00:00",
    backgroundColor: "#1f6a39",
    borderColor: "#1f6a39",
    extendedProps: {
      location: "Main Auditorium",
      audience: "Incoming Students",
      category: "Academic",
      summary: "Orientation covering seminary life, academic expectations, and student services.",
    },
  },
  {
    id: "may-02",
    title: "Faculty Meeting",
    start: "2026-05-22T10:00:00",
    end: "2026-05-22T11:30:00",
    backgroundColor: "#4d8b57",
    borderColor: "#4d8b57",
    extendedProps: {
      location: "Dean's Office",
      audience: "Faculty and Staff",
      category: "Administration",
      summary: "Monthly alignment meeting on instruction, policies, and operational priorities.",
    },
  },
  {
    id: "may-03",
    title: "Registrar Review and Records Audit",
    start: "2026-05-26T13:30:00",
    end: "2026-05-26T15:00:00",
    backgroundColor: "#7cab7d",
    borderColor: "#7cab7d",
    extendedProps: {
      location: "Records Unit",
      audience: "Registrar Team",
      category: "Administration",
      summary: "Records audit and verification of pending student documents and enrollment files.",
    },
  },
  {
    id: "may-04",
    title: "Midyear Enrollment Caravan",
    start: "2026-05-29",
    allDay: true,
    backgroundColor: "#d08a5a",
    borderColor: "#d08a5a",
    extendedProps: {
      location: "Admissions Center",
      audience: "Applicants and Parents",
      category: "Admissions",
      summary: "Walk-in admissions support, assessment, and payment orientation for incoming applicants.",
    },
  },
  {
    id: "june-01",
    title: "Opening Convocation",
    start: "2026-06-03T08:30:00",
    end: "2026-06-03T10:30:00",
    backgroundColor: "#1f6a39",
    borderColor: "#1f6a39",
    extendedProps: {
      location: "Seminary Grounds",
      audience: "Whole Community",
      category: "Academic",
      summary: "Formal opening of the term with worship, welcome remarks, and institutional direction.",
    },
  },
  {
    id: "june-02",
    title: "Graduate Research Colloquium",
    start: "2026-06-11T14:00:00",
    end: "2026-06-11T17:00:00",
    backgroundColor: "#4d8b57",
    borderColor: "#4d8b57",
    extendedProps: {
      location: "Research Hall",
      audience: "Masteral and Doctoral Students",
      category: "Academic",
      summary: "Presentation and critique of graduate-level research proposals and ministry studies.",
    },
  },
  {
    id: "june-03",
    title: "Community Service and Outreach Day",
    start: "2026-06-19",
    allDay: true,
    backgroundColor: "#7cab7d",
    borderColor: "#7cab7d",
    extendedProps: {
      location: "Partner Barangays",
      audience: "Students and Chaplaincy Volunteers",
      category: "Formation",
      summary: "A seminary-wide outreach program focused on service, pastoral presence, and community partnership.",
    },
  },
  {
    id: "june-04",
    title: "Admissions Interview Week",
    start: "2026-06-22",
    end: "2026-06-27",
    allDay: true,
    backgroundColor: "#d08a5a",
    borderColor: "#d08a5a",
    extendedProps: {
      location: "Admissions Office",
      audience: "Prospective Students",
      category: "Admissions",
      summary: "Scheduled interviews and application reviews for incoming certificate, bachelor, masteral, and doctoral applicants.",
    },
  },
];
