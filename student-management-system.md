# Integrated Student Management System
### Next.js + TypeScript — Full System Documentation

> Covers: Admission, Finance, Enrollment, Academic Structure, Class Scheduling, LMS, Examinations, Grading, Student Records, Graduation, Faculty Management, Reporting & Analytics

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Module Features](#module-features)
   - [Admission](#1-admission)
   - [Finance & Fees](#2-finance--fees)
   - [Academic Structure](#3-academic-structure)
   - [Enrollment](#4-enrollment)
   - [Class Scheduling](#5-class-scheduling)
   - [LMS (Learning Management System)](#6-lms-learning-management-system)
   - [Faculty Management](#7-faculty-management)
   - [Examinations & Performance Tasks](#8-examinations--performance-tasks)
   - [Grading System](#9-grading-system)
   - [Student Records](#10-student-records)
   - [Graduation](#11-graduation)
   - [Reporting & Analytics](#12-reporting--analytics)
3. [Shared Core Layer](#shared-core-layer)
4. [Database Schema](#database-schema)
5. [API Routes](#api-routes)
6. [Role & Permissions Matrix](#role--permissions-matrix)
7. [Tech Stack Recommendations](#tech-stack-recommendations)
8. [Project Structure](#project-structure)
9. [Key Integration Points](#key-integration-points)
10. [Development Roadmap](#development-roadmap)

---

## System Overview

This is a fully integrated, role-based Student Information System (SIS) that unifies:

- **Admissions & Enrollment System** — application to section assignment
- **Finance System** — fee assessment, payment, and financial holds
- **LMS** — course content, submissions, quizzes, and attendance
- **Grading System** — weighted grades, transmutation, and transcripts
- **Student Management System** — 201 records, progression, and graduation

**User Roles:** `super_admin` | `registrar` | `finance_officer` | `department_head` | `teacher` | `student` | `parent`

---

## Module Features

---

### 1. Admission

**Purpose:** Manage the full application lifecycle from prospect to accepted student.

#### Features

| Feature | Description |
|---|---|
| Online Application Form | Multi-step form: personal info, previous school, strand/program choice |
| Document Upload | Birth certificate, report card, ID photos, medical certificate |
| Application Tracker | Real-time status: `Draft → Submitted → Under Review → Exam Scheduled → Accepted / Rejected` |
| Entrance Exam Scheduling | Assign exam date/time/room; send automated confirmation email/SMS |
| Interview Scheduling | Optional interview slot booking per department |
| Acceptance/Rejection | Automated notification with acceptance letter or reason for rejection |
| Waitlisting | Waitlist queue with auto-promotion when slots open |
| Returning Student Flow | Separate re-enrollment flow for students who took a leave of absence |
| Admission Year & Term Config | Open/close application windows per academic year and term |
| Application Fee | Trigger finance module for non-refundable application fee collection |

#### Application Status Flow

```
DRAFT → SUBMITTED → UNDER_REVIEW → EXAM_SCHEDULED → INTERVIEWED → ACCEPTED / REJECTED / WAITLISTED
                                                                        ↓
                                                                  ENROLLED (triggers Enrollment module)
```

---

### 2. Finance & Fees

**Purpose:** Assess, collect, and track all student financial obligations.

#### Features

| Feature | Description |
|---|---|
| Fee Schedule Configuration | Define tuition per program/year level, lab fees, miscellaneous fees |
| Discount & Scholarship Management | Sibling discount, honor scholarship, CHED grant, custom discounts |
| Fee Assessment per Student | Auto-generate SOA (Statement of Account) on enrollment |
| Payment Gateway Integration | Online payment via GCash, Maya, credit card, bank transfer |
| Installment Plans | Define payment schedules; track partial payments |
| Official Receipt Generation | Auto-generate OR with reference number after payment |
| Balance & Ledger Tracking | Running balance per student per term |
| Financial Hold Flag | Block enrollment/grade viewing if balance exists beyond deadline |
| Refund Management | Process refund requests with approval workflow |
| Cashier Dashboard | Walk-in payment recording for on-site cashiers |
| Finance Reports | Collections per day, outstanding balances, scholarship summary |

#### Fee Types

```typescript
enum FeeType {
  TUITION       = 'tuition',
  LABORATORY    = 'laboratory',
  MISCELLANEOUS = 'miscellaneous',
  APPLICATION   = 'application',
  GRADUATION    = 'graduation',
  LIBRARY       = 'library',
  ID            = 'id',
  ATHLETIC      = 'athletic',
}
```

---

### 3. Academic Structure

**Purpose:** Define and manage the academic catalog — programs, subjects, curriculum, and prerequisites.

#### Features

| Feature | Description |
|---|---|
| Department Management | Group programs by department/college |
| Program/Course Management | BS Computer Science, BS Nursing, SHS-STEM, etc. |
| Subject/Unit Management | Subject code, title, units, type (lecture/lab/hybrid) |
| Curriculum Builder | Map subjects to year level and semester per program |
| Prerequisite Chaining | Define prerequisite and co-requisite subjects |
| Credit Unit Configuration | Units per subject, max load per student per term |
| Elective Groupings | Group elective subjects; students choose N from group |
| Academic Calendar | Define school year, terms/semesters, and key dates |
| Term Configuration | Semester, Trimester, or Quarter system support |

#### Curriculum Map Example

```
BS Computer Science — Year 2, Semester 1
├── CC101 - Programming 1 (3 units) [no prereq]
├── CC102 - Discrete Mathematics (3 units) [no prereq]
├── CC103 - Data Structures (3 units) [prereq: CC101]
└── GE001 - Ethics (3 units) [no prereq]
```

---

### 4. Enrollment

**Purpose:** Process student enrollment per term, from subject selection to official enrollment confirmation.

#### Features

| Feature | Description |
|---|---|
| Enrollment Window Config | Open/close enrollment per term, by year level or program |
| Prerequisite Validation | Auto-block subjects where prerequisites are not yet passed |
| Financial Clearance Check | Block enrollment if student has financial hold |
| Subject Loading | Student selects subjects from available offerings |
| Section Assignment | Auto-assign or manually assign to a section |
| Max Capacity Enforcement | Prevent over-enrollment beyond section capacity |
| Add/Drop Period | Allow subject changes within the add/drop window |
| Cross-Enrollment | Allow enrollment in subjects from another department/school |
| Form 5 (Certificate of Registration) | Auto-generate official enrollment form as PDF |
| Enrollment Statistics Dashboard | Real-time count per program, year level, section |
| Returning/Irregular Student Handling | Custom subject loading for irregular students |

#### Enrollment Status Flow

```
NOT_ENROLLED → ENROLLING → PENDING_PAYMENT → OFFICIALLY_ENROLLED
                                  ↓ (if not paid by deadline)
                           ENROLLMENT_CANCELLED
```

---

### 5. Class Scheduling

**Purpose:** Generate and manage class schedules — assigning teachers, rooms, and time slots per section.

#### Features

| Feature | Description |
|---|---|
| Course Offerings per Term | Define which subjects are offered each term |
| Section Creation | Create sections per subject (e.g., BSCS-2A, BSCS-2B) |
| Teacher Assignment | Assign a teacher to a subject-section |
| Room Management | Define rooms with capacity and type (lecture, lab, gym) |
| Time Slot Management | Define available time slots per day |
| Conflict Detection | Detect: teacher double-booking, room double-booking, student schedule conflict |
| Teacher Load Computation | Track total teaching units per teacher per term (max load rules) |
| Student Timetable Generation | Auto-generate individual timetable after enrollment |
| Schedule Export | Export as PDF or Excel per teacher/section/room |
| Online/Hybrid Mode Flag | Mark classes as face-to-face, online, or hybrid |

#### Conflict Detection Rules

```typescript
// Teacher conflict: same teacher, overlapping time slot, same day
// Room conflict: same room, overlapping time slot, same day
// Student conflict: same student enrolled in two sections with overlapping schedule
```

---

### 6. LMS (Learning Management System)

**Purpose:** Deliver course content, manage submissions, facilitate online learning, and track attendance.

#### Features

**Course Content**
| Feature | Description |
|---|---|
| Course Modules/Lessons | Organize content into weekly modules or topics |
| File Uploads | PDF, DOCX, PPTX, images, videos per lesson |
| Embedded Videos | YouTube/Vimeo embed or direct upload via S3 |
| External Links | Add resource links per lesson |
| Module Availability Scheduling | Set unlock date/time per module |

**Communication**
| Feature | Description |
|---|---|
| Announcements | Teacher posts class-wide announcements |
| Discussion Forums | Threaded discussions per topic per class |
| Direct Messaging | Student ↔ Teacher messaging |
| Push Notifications | In-app + email on new posts, grades, deadlines |

**Assignments & Quizzes**
| Feature | Description |
|---|---|
| Assignment Submission | File upload or text submission with deadline |
| Plagiarism Detection Hook | Integration point for Turnitin or similar APIs |
| Quiz Builder | MCQ, true/false, short answer, matching type |
| Question Bank | Reusable question pool per subject |
| Randomized Quizzes | Pull N random questions from bank |
| Time-limited Quizzes | Countdown timer, auto-submit on timeout |
| Submission Status Tracking | Track submitted/late/missing per student |
| Grade Passback | Auto-pass quiz scores to Grading System |

**Attendance**
| Feature | Description |
|---|---|
| Manual Attendance | Teacher marks Present/Absent/Late/Excused per session |
| QR Code Attendance | Student scans QR code to mark attendance |
| Attendance Summary | Per student, per subject, per term |
| Attendance Alert | Notify student/parent when absences exceed threshold |

---

### 7. Faculty Management

**Purpose:** Manage teacher profiles, workload, evaluations, and departmental assignments.

#### Features

| Feature | Description |
|---|---|
| Teacher Profile | Personal info, educational attainment, specialization |
| Employment Type | Full-time, part-time, visiting professor |
| Department Assignment | Assign to one or more departments |
| Teaching Load per Term | Auto-compute units taught; enforce max load policy |
| Subjects Handled History | Full record of subjects taught per term |
| Leave Management | File leave requests with approval workflow; adjust schedule |
| Faculty Evaluation | Student evaluation of teachers per term (anonymous) |
| Performance Reports | Evaluation scores, student pass rates, attendance rates |
| Document Management | Upload contracts, certifications, credentials |

---

### 8. Examinations & Performance Tasks

**Purpose:** Configure grading components, schedule and deliver exams, manage performance tasks with rubrics.

#### Features

**Grade Component Setup**
| Feature | Description |
|---|---|
| Grading Formula Builder | Define components: Quizzes, Activities, Midterm, Final, etc. |
| Weight Assignment | Assign percentage weight per component (must sum to 100%) |
| Component Templates | Reusable templates per department or subject type |

**Examinations**
| Feature | Description |
|---|---|
| Exam Scheduling | Set exam date/time/room; conflicts checked against class schedule |
| Permit System | Students with financial hold cannot access exam details |
| Online Exam Delivery | Timed, proctored online exams via LMS quiz engine |
| Exam Room Assignment | Auto-assign students to exam rooms based on enrollment |
| Proctor Assignment | Assign proctor teachers to exam rooms |

**Performance Tasks**
| Feature | Description |
|---|---|
| Task Creation | Create performance tasks with description and rubric |
| Rubric Builder | Define criteria, indicators, and scoring levels |
| Rubric-Based Scoring | Teacher scores per criterion; total auto-computed |
| Portfolio Submission | File-based submission for project/portfolio tasks |
| Peer Assessment | Optional peer review workflow |

**Grade Entry**
| Feature | Description |
|---|---|
| Grade Encoding Interface | Teacher inputs raw scores per component per student |
| Score Validation | Flag scores exceeding max points |
| Bulk Import | Upload grades via Excel template |
| Grade Encoding Deadline | Lock grade entry after deadline; requires admin override |
| Encoding Progress Tracker | Show % of students with grades encoded per subject |

---

### 9. Grading System

**Purpose:** Compute, validate, release, and manage final grades with full audit trail.

#### Features

| Feature | Description |
|---|---|
| Weighted Grade Computation | Auto-compute final grade from components and weights |
| Transmutation Table | Convert raw grade to transmuted grade (configurable per school) |
| Midterm & Final Grade | Separate midterm and final grade computation |
| Incomplete Grade (INC) | Mark as INC with completion deadline; resolve workflow |
| Dropped Subject (W) | Mark withdrawal; exclude from GWA computation |
| Grade Release | Teacher submits → Department Head approves → Released to student |
| Grade Viewing for Students | Students view grades after official release |
| Grade Appeal Workflow | Student files appeal → Teacher reviews → Registrar resolves |
| GWA Computation | Weighted average across all subjects per term and cumulative |
| Dean's List Computation | Auto-flag students meeting honor criteria |
| Honor Roll | Configurable criteria (GWA ≥ 1.50, no failing grade, etc.) |
| Grade History | Full grade record per student per subject per term |

#### Grade Transmutation Example

```
Raw Score (%)  →  Transmuted Grade  →  Equivalent
   99–100              1.00              Excellent
   96–98               1.25
   93–95               1.50
   90–92               1.75
   87–89               2.00              Very Good
   ...
   75–76               3.00              Passed
   Below 75            5.00              Failed
```

#### Grade Approval Workflow

```
TEACHER (encodes) → SUBMITTED → DEPT HEAD (reviews) → APPROVED → RELEASED → VISIBLE TO STUDENT
                                                     ↓ reject
                                              RETURNED_FOR_REVISION
```

---

### 10. Student Records

**Purpose:** Maintain the official academic record of every student from entry to graduation.

#### Features

| Feature | Description |
|---|---|
| Student 201 File | Complete personal, academic, and financial record |
| Academic Transcript (TOR) | Auto-generate official TOR per student |
| Grades Per Term History | Full grade record across all terms |
| GWA Per Term & Cumulative | Computed and stored per term completion |
| Academic Standing | Regular, Irregular, Probationary, Dismissed, LOA |
| Academic Probation Rules | Auto-flag students with GWA below threshold or failing grades |
| Year Level Progression | Auto-promote to next year level upon meeting requirements |
| Units Earned Tracker | Track earned vs required units per program |
| Leave of Absence (LOA) | Process LOA request; preserve records; handle return |
| Dismissal & Readmission | Dismiss with reason; readmission application workflow |
| Document Requests | Request TOR, certification, diploma verification (with fees) |
| Student Photo & ID | Manage official student photo and ID issuance |

---

### 11. Graduation

**Purpose:** Process student graduation from application through clearance to diploma release.

#### Features

| Feature | Description |
|---|---|
| Graduation Application | Student applies for graduation; system checks eligibility |
| Curriculum Completion Check | Validate all required subjects passed with passing grade |
| Units Completion Check | Confirm total units earned meets program requirement |
| Residency Requirement Check | Confirm minimum terms enrolled in institution |
| Clearance Workflow | Multi-department clearance: Library, Finance, Registrar, Dept, Lab |
| Clearance Dashboard | Track clearance status per office; online sign-off |
| Graduation Fee Collection | Trigger finance module for graduation fees |
| Candidacy List | Generate list of approved graduation candidates |
| Latin Honors Computation | Summa, Magna, Cum Laude based on cumulative GWA |
| Commencement Assignments | Assign students to graduation ceremony batch/order |
| Diploma Generation | Print-ready diploma template with student name and program |
| TOR for Graduates | Final official transcript with graduation date and honors |
| Alumni Records Handoff | Move student to alumni database on graduation confirmation |

#### Clearance Offices

```typescript
enum ClearanceOffice {
  LIBRARY      = 'library',
  FINANCE      = 'finance',
  REGISTRAR    = 'registrar',
  DEPARTMENT   = 'department',
  LABORATORY   = 'laboratory',
  STUDENT_AFFAIRS = 'student_affairs',
  ATHLETICS    = 'athletics',
}
```

---

### 12. Reporting & Analytics

**Purpose:** Provide actionable data insights for administrators and decision-makers.

#### Report Categories

**Enrollment Reports**
- Enrollment count per program, year level, section, term
- Enrollment trend (year-over-year)
- New vs returning student breakdown
- Irregular student count per program

**Academic Reports**
- Grade distribution per subject per term
- Passing rate per subject and teacher
- Failure rate analysis
- GWA distribution per program
- Dean's List and Honor Roll per term
- Subject demand (enrollment count per subject)

**Financial Reports**
- Collections per day/week/month
- Outstanding balance report
- Scholarship and discount summary
- Fee type breakdown
- Payment method distribution

**Retention & Attrition**
- Dropout rate per term
- LOA count and return rate
- Academic dismissal rate

**Faculty Reports**
- Teacher evaluation scores per term
- Teaching load summary
- Student pass rate per teacher

**Compliance Reports**
- CHED enrollment report format
- Student headcount per program
- Faculty qualification summary

---

## Shared Core Layer

These services are used across all modules.

### Authentication & Authorization

```typescript
// Role-based access using NextAuth.js + custom RBAC middleware
// roles: super_admin, registrar, finance_officer, dept_head, teacher, student, parent

// Every API route checks:
// 1. Is user authenticated? (session check)
// 2. Does user have permission for this action on this resource?
// 3. Does user own or have scope over this resource?
```

### Notification Service

Triggers across modules for:
- Application status changes
- Payment confirmations
- Enrollment confirmation
- Grade release
- Deadline reminders
- Attendance alerts
- Clearance approvals

Delivery channels: In-app, Email (Resend/Nodemailer), SMS (optional via Semaphore/Vonage)

### File Storage

All file uploads (documents, submissions, profile photos) go through a unified service:
- Provider: AWS S3 or Supabase Storage
- Naming convention: `/{module}/{entity_id}/{timestamp}-{original_name}`
- Access control: private by default; signed URLs for access

### Audit Logging

Every create/update/delete action is logged:
```typescript
interface AuditLog {
  id: string
  userId: string
  userRole: Role
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW'
  resource: string       // e.g. 'grade', 'enrollment', 'payment'
  resourceId: string
  changes: JsonValue     // before/after snapshot
  ipAddress: string
  createdAt: DateTime
}
```

---

## Database Schema

### Core Tables

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// USERS & AUTH
// ─────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          Role
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  student       Student?
  teacher       Teacher?
  auditLogs     AuditLog[]
}

enum Role {
  SUPER_ADMIN
  REGISTRAR
  FINANCE_OFFICER
  DEPARTMENT_HEAD
  TEACHER
  STUDENT
  PARENT
}

// ─────────────────────────────────────────────
// ACADEMIC STRUCTURE
// ─────────────────────────────────────────────

model Department {
  id          String    @id @default(cuid())
  name        String
  code        String    @unique
  programs    Program[]
  teachers    Teacher[]
}

model Program {
  id             String       @id @default(cuid())
  departmentId   String
  name           String
  code           String       @unique
  type           ProgramType  // UNDERGRADUATE, GRADUATE, SHS, JHS
  totalUnits     Int
  department     Department   @relation(fields: [departmentId], references: [id])
  curriculums    Curriculum[]
  students       Student[]
}

enum ProgramType {
  UNDERGRADUATE
  GRADUATE
  SHS
  JHS
}

model Subject {
  id             String        @id @default(cuid())
  code           String        @unique
  title          String
  units          Int
  hoursPerWeek   Int
  type           SubjectType   // LECTURE, LABORATORY, HYBRID
  description    String?
  prerequisites  SubjectPrerequisite[] @relation("Subject")
  requiredBy     SubjectPrerequisite[] @relation("Prerequisite")
  curriculumItems CurriculumItem[]
  offerings      CourseOffering[]
}

enum SubjectType {
  LECTURE
  LABORATORY
  HYBRID
}

model SubjectPrerequisite {
  subjectId      String
  prerequisiteId String
  subject        Subject @relation("Subject", fields: [subjectId], references: [id])
  prerequisite   Subject @relation("Prerequisite", fields: [prerequisiteId], references: [id])
  @@id([subjectId, prerequisiteId])
}

model Curriculum {
  id          String           @id @default(cuid())
  programId   String
  yearLevel   Int
  semester    Semester
  program     Program          @relation(fields: [programId], references: [id])
  items       CurriculumItem[]
}

model CurriculumItem {
  id            String     @id @default(cuid())
  curriculumId  String
  subjectId     String
  isElective    Boolean    @default(false)
  curriculum    Curriculum @relation(fields: [curriculumId], references: [id])
  subject       Subject    @relation(fields: [subjectId], references: [id])
}

enum Semester {
  FIRST
  SECOND
  SUMMER
}

model AcademicYear {
  id          String    @id @default(cuid())
  label       String    // e.g. "2024-2025"
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean   @default(false)
  terms       Term[]
}

model Term {
  id             String       @id @default(cuid())
  academicYearId String
  semester       Semester
  startDate      DateTime
  endDate        DateTime
  enrollmentOpen Boolean      @default(false)
  academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])
  enrollments    Enrollment[]
  offerings      CourseOffering[]
  grades         Grade[]
}

// ─────────────────────────────────────────────
// STUDENTS
// ─────────────────────────────────────────────

model Student {
  id              String           @id @default(cuid())
  userId          String           @unique
  studentNumber   String           @unique
  programId       String
  yearLevel       Int
  academicStatus  AcademicStatus   @default(REGULAR)
  firstName       String
  middleName      String?
  lastName        String
  dateOfBirth     DateTime
  gender          String
  address         String
  contactNumber   String
  photoUrl        String?
  user            User             @relation(fields: [userId], references: [id])
  program         Program          @relation(fields: [programId], references: [id])
  applications    Application[]
  enrollments     Enrollment[]
  grades          Grade[]
  payments        Payment[]
  clearances      GraduationClearance[]
}

enum AcademicStatus {
  REGULAR
  IRREGULAR
  PROBATIONARY
  LOA
  DISMISSED
  GRADUATED
}

// ─────────────────────────────────────────────
// ADMISSION
// ─────────────────────────────────────────────

model Application {
  id              String            @id @default(cuid())
  studentId       String?
  programId       String
  applicantName   String
  email           String
  status          ApplicationStatus @default(DRAFT)
  examDate        DateTime?
  examRoom        String?
  documents       ApplicationDocument[]
  createdAt       DateTime          @default(now())
  student         Student?          @relation(fields: [studentId], references: [id])
}

enum ApplicationStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  EXAM_SCHEDULED
  INTERVIEWED
  ACCEPTED
  REJECTED
  WAITLISTED
}

model ApplicationDocument {
  id            String      @id @default(cuid())
  applicationId String
  type          String      // birth_cert, report_card, id_photo
  fileUrl       String
  application   Application @relation(fields: [applicationId], references: [id])
}

// ─────────────────────────────────────────────
// FINANCE
// ─────────────────────────────────────────────

model FeeSchedule {
  id          String    @id @default(cuid())
  programId   String?
  yearLevel   Int?
  termId      String?
  feeType     FeeType
  amount      Decimal
  description String?
  payments    Payment[]
}

enum FeeType {
  TUITION
  LABORATORY
  MISCELLANEOUS
  APPLICATION
  GRADUATION
  LIBRARY
  ID
  ATHLETIC
}

model Payment {
  id              String        @id @default(cuid())
  studentId       String
  feeScheduleId   String
  amount          Decimal
  status          PaymentStatus @default(PENDING)
  method          PaymentMethod
  referenceNumber String?
  receiptUrl      String?
  paidAt          DateTime?
  student         Student       @relation(fields: [studentId], references: [id])
  feeSchedule     FeeSchedule   @relation(fields: [feeScheduleId], references: [id])
}

enum PaymentStatus {
  PENDING
  PAID
  PARTIAL
  REFUNDED
  CANCELLED
}

enum PaymentMethod {
  CASH
  GCASH
  MAYA
  BANK_TRANSFER
  CREDIT_CARD
  ONLINE
}

model Scholarship {
  id          String    @id @default(cuid())
  name        String
  discountPct Decimal   // percentage discount
  type        String    // sibling, honor, ched_grant, etc.
}

// ─────────────────────────────────────────────
// ENROLLMENT
// ─────────────────────────────────────────────

model Enrollment {
  id              String           @id @default(cuid())
  studentId       String
  termId          String
  status          EnrollmentStatus @default(NOT_ENROLLED)
  enrolledAt      DateTime?
  student         Student          @relation(fields: [studentId], references: [id])
  term            Term             @relation(fields: [termId], references: [id])
  subjectEnrollments SubjectEnrollment[]
}

enum EnrollmentStatus {
  NOT_ENROLLED
  ENROLLING
  PENDING_PAYMENT
  OFFICIALLY_ENROLLED
  CANCELLED
  DROPPED
}

model SubjectEnrollment {
  id              String     @id @default(cuid())
  enrollmentId    String
  offeringId      String
  enrollment      Enrollment @relation(fields: [enrollmentId], references: [id])
  offering        CourseOffering @relation(fields: [offeringId], references: [id])
  @@unique([enrollmentId, offeringId])
}

// ─────────────────────────────────────────────
// CLASS SCHEDULING
// ─────────────────────────────────────────────

model Room {
  id        String    @id @default(cuid())
  name      String
  code      String    @unique
  capacity  Int
  type      RoomType
  offerings CourseOffering[]
}

enum RoomType {
  LECTURE
  LABORATORY
  GYM
  AUDITORIUM
}

model CourseOffering {
  id          String              @id @default(cuid())
  termId      String
  subjectId   String
  teacherId   String
  roomId      String?
  sectionName String              // e.g. BSCS-2A
  capacity    Int
  mode        ClassMode           @default(FACE_TO_FACE)
  schedules   ClassSchedule[]
  term        Term                @relation(fields: [termId], references: [id])
  subject     Subject             @relation(fields: [subjectId], references: [id])
  teacher     Teacher             @relation(fields: [teacherId], references: [id])
  room        Room?               @relation(fields: [roomId], references: [id])
  enrollments SubjectEnrollment[]
  grades      Grade[]
  attendances Attendance[]
}

enum ClassMode {
  FACE_TO_FACE
  ONLINE
  HYBRID
}

model ClassSchedule {
  id         String         @id @default(cuid())
  offeringId String
  dayOfWeek  DayOfWeek
  startTime  String         // "08:00"
  endTime    String         // "09:30"
  offering   CourseOffering @relation(fields: [offeringId], references: [id])
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}

// ─────────────────────────────────────────────
// TEACHERS
// ─────────────────────────────────────────────

model Teacher {
  id             String           @id @default(cuid())
  userId         String           @unique
  employeeNumber String           @unique
  departmentId   String
  firstName      String
  lastName       String
  employmentType EmploymentType
  specialization String?
  user           User             @relation(fields: [userId], references: [id])
  department     Department       @relation(fields: [departmentId], references: [id])
  offerings      CourseOffering[]
  evaluations    TeacherEvaluation[]
}

enum EmploymentType {
  FULL_TIME
  PART_TIME
  VISITING
}

model TeacherEvaluation {
  id          String   @id @default(cuid())
  teacherId   String
  termId      String
  score       Decimal
  respondents Int
  teacher     Teacher  @relation(fields: [teacherId], references: [id])
}

// ─────────────────────────────────────────────
// LMS
// ─────────────────────────────────────────────

model CourseModule {
  id          String         @id @default(cuid())
  offeringId  String
  title       String
  order       Int
  unlockAt    DateTime?
  offering    CourseOffering @relation(fields: [offeringId], references: [id])
  lessons     Lesson[]
}

model Lesson {
  id         String       @id @default(cuid())
  moduleId   String
  title      String
  content    String?      // rich text
  order      Int
  module     CourseModule @relation(fields: [moduleId], references: [id])
  resources  LessonResource[]
}

model LessonResource {
  id       String       @id @default(cuid())
  lessonId String
  type     ResourceType
  url      String
  label    String
  lesson   Lesson       @relation(fields: [lessonId], references: [id])
}

enum ResourceType {
  FILE
  VIDEO
  LINK
}

model Assignment {
  id          String          @id @default(cuid())
  offeringId  String
  title       String
  description String?
  dueDate     DateTime
  maxPoints   Decimal
  submissions AssignmentSubmission[]
}

model AssignmentSubmission {
  id           String     @id @default(cuid())
  assignmentId String
  studentId    String
  fileUrl      String?
  textContent  String?
  submittedAt  DateTime   @default(now())
  score        Decimal?
  feedback     String?
  assignment   Assignment @relation(fields: [assignmentId], references: [id])
}

model Quiz {
  id          String         @id @default(cuid())
  offeringId  String
  title       String
  durationMin Int
  openAt      DateTime?
  closeAt     DateTime?
  questions   QuizQuestion[]
  attempts    QuizAttempt[]
}

model QuizQuestion {
  id       String       @id @default(cuid())
  quizId   String
  text     String
  type     QuestionType
  points   Decimal
  options  QuizOption[]
  quiz     Quiz         @relation(fields: [quizId], references: [id])
}

enum QuestionType {
  MCQ
  TRUE_FALSE
  SHORT_ANSWER
  MATCHING
}

model QuizOption {
  id         String       @id @default(cuid())
  questionId String
  text       String
  isCorrect  Boolean
  question   QuizQuestion @relation(fields: [questionId], references: [id])
}

model QuizAttempt {
  id          String   @id @default(cuid())
  quizId      String
  studentId   String
  startedAt   DateTime @default(now())
  submittedAt DateTime?
  score       Decimal?
  quiz        Quiz     @relation(fields: [quizId], references: [id])
}

model Attendance {
  id          String          @id @default(cuid())
  offeringId  String
  sessionDate DateTime
  studentId   String
  status      AttendanceStatus
  offering    CourseOffering  @relation(fields: [offeringId], references: [id])
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

// ─────────────────────────────────────────────
// GRADING
// ─────────────────────────────────────────────

model GradeComponent {
  id          String         @id @default(cuid())
  offeringId  String
  name        String         // Quizzes, Activities, Midterm Exam, Final Exam
  weight      Decimal        // percentage (sum must = 100)
  maxScore    Decimal
  scores      ComponentScore[]
}

model ComponentScore {
  id          String         @id @default(cuid())
  componentId String
  studentId   String
  rawScore    Decimal
  component   GradeComponent @relation(fields: [componentId], references: [id])
}

model Grade {
  id               String       @id @default(cuid())
  studentId        String
  offeringId       String
  termId           String
  midtermGrade     Decimal?
  finalRawGrade    Decimal?
  finalGrade       Decimal?     // transmuted
  status           GradeStatus  @default(PENDING)
  remarks          String?      // PASSED, FAILED, INC, W, DR
  encodedAt        DateTime?
  approvedAt       DateTime?
  releasedAt       DateTime?
  student          Student       @relation(fields: [studentId], references: [id])
  offering         CourseOffering @relation(fields: [offeringId], references: [id])
  term             Term         @relation(fields: [termId], references: [id])
  @@unique([studentId, offeringId])
}

enum GradeStatus {
  PENDING
  ENCODED
  SUBMITTED
  APPROVED
  RELEASED
  APPEALED
}

// ─────────────────────────────────────────────
// GRADUATION
// ─────────────────────────────────────────────

model GraduationApplication {
  id          String            @id @default(cuid())
  studentId   String
  termId      String
  status      GradAppStatus     @default(PENDING)
  appliedAt   DateTime          @default(now())
  clearances  GraduationClearance[]
}

enum GradAppStatus {
  PENDING
  IN_CLEARANCE
  CLEARED
  APPROVED
  REJECTED
}

model GraduationClearance {
  id            String          @id @default(cuid())
  applicationId String
  studentId     String
  office        ClearanceOffice
  status        ClearanceStatus @default(PENDING)
  clearedAt     DateTime?
  remarks       String?
  student       Student         @relation(fields: [studentId], references: [id])
}

enum ClearanceOffice {
  LIBRARY
  FINANCE
  REGISTRAR
  DEPARTMENT
  LABORATORY
  STUDENT_AFFAIRS
  ATHLETICS
}

enum ClearanceStatus {
  PENDING
  CLEARED
  HOLD
}

// ─────────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────────

model AuditLog {
  id         String   @id @default(cuid())
  userId     String
  action     String
  resource   String
  resourceId String
  changes    Json?
  ipAddress  String?
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
}
```

---

## API Routes

All routes are under `/api/` using Next.js App Router (`app/api/`).

### Admission

```
POST   /api/applications                      Create new application
GET    /api/applications                      List all applications (admin)
GET    /api/applications/:id                  Get application details
PATCH  /api/applications/:id/status           Update application status
POST   /api/applications/:id/documents        Upload document
POST   /api/applications/:id/schedule-exam    Schedule entrance exam
POST   /api/applications/:id/accept           Accept applicant → create Student record
POST   /api/applications/:id/reject           Reject applicant
```

### Finance

```
GET    /api/fee-schedules                     List fee schedules
POST   /api/fee-schedules                     Create fee schedule
GET    /api/students/:id/statement            Get student SOA
POST   /api/payments                          Record payment
GET    /api/payments/:id/receipt              Download receipt PDF
GET    /api/students/:id/financial-hold       Check financial hold status
POST   /api/scholarships                      Create scholarship
POST   /api/students/:id/scholarships         Assign scholarship to student
```

### Academic Structure

```
GET    /api/departments                       List departments
POST   /api/departments                       Create department
GET    /api/programs                          List programs
POST   /api/programs                          Create program
GET    /api/subjects                          List subjects
POST   /api/subjects                          Create subject
POST   /api/subjects/:id/prerequisites        Add prerequisite
GET    /api/curriculums?programId=&yearLevel= Get curriculum
POST   /api/curriculums                       Create curriculum item
GET    /api/academic-years                    List academic years
POST   /api/academic-years                    Create academic year
PATCH  /api/terms/:id/enrollment-open        Open/close enrollment
```

### Enrollment

```
GET    /api/students/:id/enrollment-status    Check enrollment status
POST   /api/enrollments                       Start enrollment process
POST   /api/enrollments/:id/subjects          Add subject to enrollment
DELETE /api/enrollments/:id/subjects/:sid     Drop subject
PATCH  /api/enrollments/:id/confirm           Confirm enrollment
GET    /api/enrollments/:id/form5             Download Form 5 (PDF)
GET    /api/offerings?termId=                 List available course offerings
```

### Class Scheduling

```
GET    /api/offerings                         List all course offerings
POST   /api/offerings                         Create course offering
PATCH  /api/offerings/:id                     Update offering (teacher, room)
GET    /api/offerings/:id/schedule            Get class schedule
POST   /api/offerings/:id/schedule            Add schedule slot
GET    /api/rooms                             List rooms
POST   /api/rooms                             Create room
GET    /api/teachers/:id/schedule             Get teacher timetable
GET    /api/students/:id/timetable            Get student timetable
GET    /api/schedule/conflicts                Check for scheduling conflicts
```

### LMS

```
GET    /api/offerings/:id/modules             List course modules
POST   /api/offerings/:id/modules             Create module
POST   /api/modules/:id/lessons               Create lesson
POST   /api/lessons/:id/resources             Upload resource
POST   /api/offerings/:id/assignments         Create assignment
POST   /api/assignments/:id/submit            Submit assignment
PATCH  /api/submissions/:id/grade             Grade submission
POST   /api/offerings/:id/quizzes             Create quiz
POST   /api/quizzes/:id/attempt               Start quiz attempt
POST   /api/attempts/:id/submit               Submit quiz attempt
POST   /api/offerings/:id/attendance          Record attendance for session
GET    /api/students/:id/attendance/:oid      Get student attendance per offering
```

### Examinations & Grading

```
GET    /api/offerings/:id/components          Get grade components
POST   /api/offerings/:id/components          Create grade component
POST   /api/components/:id/scores             Enter scores (bulk)
GET    /api/offerings/:id/gradebook           Full gradebook view
POST   /api/grades/:id/submit                 Teacher submits grades
POST   /api/grades/:id/approve               Dept head approves
POST   /api/grades/:id/release               Release to students
POST   /api/grades/:id/appeal                Student files grade appeal
GET    /api/students/:id/grades               All grades per student
GET    /api/students/:id/transcript           Generate TOR (PDF)
GET    /api/students/:id/gwa                  Compute GWA
```

### Faculty

```
GET    /api/teachers                          List teachers
POST   /api/teachers                          Create teacher profile
GET    /api/teachers/:id                      Teacher profile details
GET    /api/teachers/:id/load                 Teaching load per term
POST   /api/teachers/:id/evaluations          Submit evaluation
GET    /api/teachers/:id/evaluations          Evaluation results
```

### Graduation

```
POST   /api/graduation/apply                  Student applies for graduation
GET    /api/graduation/:id/eligibility        Check eligibility (curriculum check)
GET    /api/graduation/:id/clearances         Get clearance status
PATCH  /api/graduation/clearances/:id         Update clearance (per office)
POST   /api/graduation/:id/approve           Approve graduation candidacy
GET    /api/graduation/candidates?termId=     List graduation candidates
GET    /api/students/:id/diploma             Download diploma PDF
```

### Reporting

```
GET    /api/reports/enrollment?termId=        Enrollment statistics
GET    /api/reports/grades?termId=&subjectId= Grade distribution
GET    /api/reports/collections?from=&to=     Finance collection report
GET    /api/reports/retention?yearId=         Retention and attrition
GET    /api/reports/dean-list?termId=         Dean's list
GET    /api/reports/faculty?termId=           Faculty performance
GET    /api/reports/ched?termId=              CHED compliance format
```

---

## Role & Permissions Matrix

| Action | super_admin | registrar | finance | dept_head | teacher | student | parent |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Manage departments/programs | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage subjects/curriculum | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Review applications | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage fee schedules | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own SOA | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Process payments | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage enrollment | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Enroll (own) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Create course offerings | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage LMS content | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Submit assignments | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Encode grades | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Approve grades | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View own grades | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View all grades | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Process graduation | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View reports | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## Tech Stack Recommendations

### Core

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Full-stack, SSR, API routes, great DX |
| Language | TypeScript | Type safety across frontend and backend |
| Database | PostgreSQL | Relational data, complex queries, reliability |
| ORM | Prisma | Type-safe queries, migrations, schema management |
| Auth | NextAuth.js v5 | Role-based sessions, multiple providers |
| Validation | Zod | Schema validation on API routes and forms |

### Frontend

| Layer | Technology |
|---|---|
| UI Components | shadcn/ui + Tailwind CSS |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |
| Charts | Recharts or Chart.js |
| PDF Viewer | react-pdf |
| Rich Text Editor | TipTap (for LMS lesson content) |
| State Management | Zustand (client state) + TanStack Query (server state) |

### Backend Services

| Service | Technology |
|---|---|
| File Storage | Supabase Storage or AWS S3 (via uploadthing) |
| Email | Resend (with React Email templates) |
| SMS (optional) | Semaphore API (PH) or Vonage |
| PDF Generation | Puppeteer or @react-pdf/renderer |
| Background Jobs | Inngest or BullMQ (deadline reminders, report generation) |
| Search | PostgreSQL full-text search (pg_trgm) |

### Infrastructure

| Service | Technology |
|---|---|
| Hosting | Vercel (Next.js) + Supabase (DB + Storage) |
| CI/CD | GitHub Actions |
| Monitoring | Sentry (errors) + Vercel Analytics |
| Caching | Vercel KV (Redis) for session and rate limiting |

---

## Project Structure

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── admin/
│   │   │   ├── admission/
│   │   │   ├── enrollment/
│   │   │   ├── scheduling/
│   │   │   ├── finance/
│   │   │   ├── faculty/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── student/
│   │   │   ├── enrollment/
│   │   │   ├── courses/
│   │   │   ├── grades/
│   │   │   ├── payments/
│   │   │   └── profile/
│   │   └── teacher/
│   │       ├── courses/
│   │       ├── gradebook/
│   │       └── schedule/
│   └── api/
│       ├── auth/
│       ├── applications/
│       ├── enrollments/
│       ├── offerings/
│       ├── grades/
│       ├── payments/
│       ├── graduation/
│       └── reports/
├── components/
│   ├── ui/               # shadcn/ui base components
│   ├── admission/
│   ├── enrollment/
│   ├── gradebook/
│   ├── lms/
│   └── shared/
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth.ts           # NextAuth config
│   ├── validations/      # Zod schemas per module
│   ├── pdf/              # PDF generation templates
│   ├── email/            # Email templates
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── types/
│   └── index.ts          # Shared TypeScript types
└── middleware.ts          # Auth + RBAC middleware
```

---

## Key Integration Points

These are the cross-module dependencies that must be designed carefully.

### 1. Financial Hold → Enrollment Block

```typescript
// Before enrollment confirmation:
async function checkFinancialHold(studentId: string): Promise<boolean> {
  const balance = await getOutstandingBalance(studentId)
  const deadline = await getPaymentDeadline()
  return balance > 0 && new Date() > deadline
}
```

### 2. Prerequisite Check → Subject Loading

```typescript
// Before allowing subject enrollment:
async function checkPrerequisites(studentId: string, subjectId: string): Promise<boolean> {
  const prereqs = await getPrerequisites(subjectId)
  const passedSubjects = await getPassedSubjects(studentId) // grade >= 3.0
  return prereqs.every(p => passedSubjects.includes(p.prerequisiteId))
}
```

### 3. Grade Component → Final Grade Computation

```typescript
// Auto-compute weighted grade:
function computeFinalGrade(scores: ComponentScore[], components: GradeComponent[]): number {
  return components.reduce((total, component) => {
    const score = scores.find(s => s.componentId === component.id)
    const percentage = score ? (score.rawScore / component.maxScore) * 100 : 0
    return total + (percentage * (component.weight / 100))
  }, 0)
}
```

### 4. Curriculum Check → Graduation Eligibility

```typescript
async function checkGraduationEligibility(studentId: string): Promise<EligibilityResult> {
  const student = await getStudentWithProgram(studentId)
  const required = await getCurriculumSubjects(student.programId)
  const passed   = await getPassedSubjects(studentId)
  const missing  = required.filter(r => !passed.includes(r.subjectId))
  return { eligible: missing.length === 0, missingSubjects: missing }
}
```

---

## Development Roadmap

### Phase 1 — Foundation (Weeks 1–4)
- [ ] Project setup: Next.js, TypeScript, Prisma, PostgreSQL, NextAuth
- [ ] Database schema and initial migrations
- [ ] Auth system: login, role-based middleware, session management
- [ ] Department, program, subject, curriculum management (admin)
- [ ] Academic year and term configuration

### Phase 2 — Admission & Finance (Weeks 5–8)
- [ ] Online application form (multi-step)
- [ ] Document upload (S3/Supabase)
- [ ] Application status workflow and notifications
- [ ] Fee schedule configuration
- [ ] Payment recording and SOA generation
- [ ] Financial hold logic

### Phase 3 — Enrollment & Scheduling (Weeks 9–12)
- [ ] Student enrollment flow with prerequisite and hold checks
- [ ] Course offerings and section creation
- [ ] Teacher assignment and room booking
- [ ] Conflict detection engine
- [ ] Student timetable generation
- [ ] Form 5 PDF generation

### Phase 4 — LMS (Weeks 13–17)
- [ ] Course modules and lessons
- [ ] File and video resource upload
- [ ] Assignment submission system
- [ ] Quiz builder and quiz delivery
- [ ] Attendance recording
- [ ] Announcements and discussion forums

### Phase 5 — Grading (Weeks 18–21)
- [ ] Grade component configuration
- [ ] Grade entry interface for teachers
- [ ] Weighted grade auto-computation
- [ ] Transmutation table and final grade
- [ ] Grade approval workflow
- [ ] Grade release and student grade viewing
- [ ] GWA and honor roll computation

### Phase 6 — Records & Graduation (Weeks 22–25)
- [ ] Student 201 file management
- [ ] Academic transcript (TOR) generation
- [ ] Graduation application
- [ ] Clearance workflow per office
- [ ] Graduation candidacy list
- [ ] Diploma and TOR PDF generation

### Phase 7 — Reporting & Polish (Weeks 26–28)
- [ ] Enrollment and academic reports
- [ ] Financial reports
- [ ] CHED compliance report
- [ ] Audit logging
- [ ] Performance optimization
- [ ] User acceptance testing

---

*Generated for Next.js + TypeScript SIS implementation*
*Total estimated timeline: 28 weeks (7 months) for a team of 2–3 developers*
