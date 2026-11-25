import Image from "next/image";

type TranscriptPreviewProps = {
  student: { name: string; program: string; studentNumber: string };
  grades?: Array<{ courseCode: string; courseTitle: string; finalGrade: string; units?: number | null; remarks: string; term?: string }>;
};

const courses = [
  ["CHAP 101", "Chaplain Ministry", "1.00", "3"],
  ["POLSCI 2", "Philippine Constitution and Family Code", "1.25", "3"],
  ["PPBC 101", "Pastoral Psychology and Biblical Counseling", "1.00", "3"],
  ["PEC 253", "Critical Incident and Stress Management", "1.25", "3"],
  ["TPOC 102", "Theology and Practice of an Ordained Chaplain", "1.00", "3"],
  ["ETHICS", "Ethics and Accountability of a Chaplain", "1.25", "3"],
  ["GOVDEV 101", "Governance and Development", "1.00", "3"],
  ["CLM 101", "Christian Leadership and Management", "1.00", "3"],
  ["PEDEV 101", "Personality Development", "1.25", "3"],
];

const partnerBase = "/partners/Accreditation%20of%20POILE-POTSCI";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p>
      <b>{label}</b> {children}
    </p>
  );
}

export function TranscriptPreview({ student, grades }: TranscriptPreviewProps) {
  const transcriptCourses = grades?.length ? grades.map((grade) => [grade.courseCode, grade.courseTitle, grade.finalGrade || "—", String(grade.units ?? "—"), grade.remarks, grade.term ?? ""] as const) : courses.map((course) => [...course, "Passed", ""] as const);
  return (
    <div
      className="relative mx-auto aspect-2650/4500 w-full max-w-full overflow-hidden bg-white text-black"
      style={{ backgroundImage: "url('/TOR-bg.png')", backgroundSize: "cover" }}
    >
      <Image
        src="/main/logo.png"
        alt=""
        width={500}
        height={500}
        className="pointer-events-none absolute left-1/2 top-[39%] z-0 w-[66%] -translate-x-1/2 opacity-[0.14]"
      />

      <main className="relative z-10 flex h-full flex-col px-[5%] pb-[4.2%] pt-[3.3%] text-[clamp(4px,0.71vw,8px)]">
        <header className="relative min-h-[8.9%] gap-5 flex items-center text-center">
          <Image
            src="/main/logo.png"
            alt="Pearl of the Orient Seminary seal"
            width={140}
            height={140}
            className="h-auto w-[15%]"
            priority
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium">Republic of the Philippines</p>
            <p
              className="mt-[1%] whitespace-nowrap text-2xl leading-none text-green-600"
              style={{ fontFamily: '"Old English Text MT", serif' }}
            >
              Pearl of the Orient Theological Seminary &amp; Colleges Inc.
            </p>
            <p className="mt-[1.5%] text-xs font-medium">
              Blk 151 Lot 14-18 Phase 1 Mabuhay II, Paliparan 3, Dasmariñas
              City, Cavite, Philippines
            </p>
            <p className="text-xs mt-1 font-medium">
              SEC: CN201737900 &nbsp; • &nbsp; Country TIN 009-885-848
            </p>
            <p
              className="mt-1 text-sm italic text-destructive"
              style={{ fontFamily: '"Bodoni MT", Georgia, serif' }}
            >
              “Leading Today, Educating Leaders, Tomorrow&apos;s Nation”
            </p>
          </div>
        </header>

        <section
          className="mt-5 text-center"
          style={{ fontFamily: '"Bodoni MT", Georgia, serif' }}
        >
          <p className="text-lg font-bold">OFFICE OF THE REGISTRAR</p>
          <p className="mt-[.2%] border-b-3 border-black pb-[.4%] text-xl font-bold">
            OFFICIAL TRANSCRIPT OF RECORDS
          </p>
        </section>

        <section className="mt-[1.35%] grid grid-cols-2 gap-x-[6%] text-xs">
          <div>
            <Field label="Name:">{student.name.toUpperCase()}</Field>
            <Field label="Address:">On file with the Registrar</Field>
            <Field label="Gender:">Female</Field>
            <Field label="Nationality:">Filipino</Field>
            <Field label="Date of Birth:">—</Field>
            <Field label="Admission Credentials:">
              OTR from Fishers Theologian Mobile Bible Seminary
            </Field>
            <p className="pl-[25%]">Bachelor of Theology</p>
            <p className="pl-[25%]">
              OTR from Didaskalos International Theological School
            </p>
            <p className="pl-[25%]">Master of Divinity in Pastoral Ministry</p>
          </div>
          <div>
            <Field label="Student Number:">{student.studentNumber}</Field>
            <Field label="Date City:">Laguna</Field>
            <Field label="Date Released:">March 4, 2026</Field>
            <Field label="Date of Admission:">August, 2024</Field>
            <Field label="Date of Graduation:">December 12, 2025</Field>
          </div>
        </section>

        <div className="mt-3 flex items-end justify-between text-xs">
          <p>
            <b>Course/Degree:</b>{" "}
            <span className="font-bold underline">
              {student.program.toUpperCase()}
            </span>
          </p>
          <p className="pr-[3%] text-xs font-semibold italic">Page 1 of 1</p>
        </div>

        <section className="relative mt-[1%] text-xs">
          <table className="w-full table-fixed border-collapse border border-black">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[45.5%]" />
              <col className="w-[7.2%]" />
              <col className="w-[6.2%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead className="text-center text-[11px] font-bold">
              <tr>
                {[
                  "SCHOOL YEAR",
                  "COURSE CODE",
                  "COURSE DESCRIPTION",
                  "GRADE",
                  "CREDIT",
                  "REMARKS",
                ].map((heading) => (
                  <th key={heading} className="border border-black py-[1.2%]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-y border-black text-center font-bold">
                <td colSpan={6} className="py-[1%]">
                  <p>FISHERS THEOLOGIAN MOBILE BIBLE SEMINARY</p>
                  <p className="text-[.90em] font-normal">
                    GRADUATED WITH THE DEGREE OF BACHELOR OF THEOLOGY LAST APRIL
                    5, 2002.
                  </p>
                  <p className="mt-[.35%]">
                    DIDASKALOS INTERNATIONAL THEOLOGICAL SCHOOL
                  </p>
                  <p className="text-[.90em] font-normal">
                    GRADUATED WITH THE DEGREE OF MASTER OF DIVINITY IN PASTORAL
                    MINISTRY LAST APRIL 1, 2008.
                  </p>
                  <p className="mt-[.8%] text-xs">
                    PEARL OF THE ORIENT THEOLOGICAL SEMINARY &amp; COLLEGES INC.
                  </p>
                </td>
              </tr>
              {transcriptCourses.map(([code, description, grade, credit, remarks, term], index) => (
                <tr key={code} className="text-xs font-medium">
                  <td className="py-[.35%] border-x border-black text-center">
                    {index === 0 ? term || "(A.Y. 2023-2024)" : ""}
                  </td>
                  <td className="py-[.35%] pl-3 border-x border-black">
                    {code}
                  </td>
                  <td className="py-[.35%] border-x pl-3 border-black">
                    {description}
                  </td>
                  <td className="py-[.35%] text-center border-x border-black">
                    {grade}
                  </td>
                  <td className="py-[.35%] text-center border-x border-black">
                    {credit}
                  </td>
                  <td className="py-[.35%] text-center border-x border-black">
                    {remarks}
                  </td>
                </tr>
              ))}
              <tr className="h-63.75 relative">
                <td className="border-x border-b border-black">
                  <div className="absolute inset-x-0 top-6 z-20 flex items-center justify-center gap-[1%] overflow-hidden whitespace-nowrap text-center text-[.9em] font-bold italic">
                    <span className="min-w-0 flex-1 basis-0 overflow-hidden text-right">
                      Pearl@Pearl@Pearl@Pearl@Pearl@Pearl@Pearl@Pearl@Pearl@
                    </span>
                    <span className="shrink-0 not-italic">
                      -----Nothing Follows-----
                    </span>
                    <span className="min-w-0 flex-1 basis-0 overflow-hidden text-left">
                      @Pearl@Pearl@Pearl@Pearl@Pearl@Pearl@Pearl@Pearl@Pearl@
                    </span>
                  </div>
                </td>
                <td className="border-x border-b border-black" />
                <td className="border-x border-b border-black align-top text-center">
                  <div className="flex flex-col items-center pt-[7%] pb-5">
                    <p className="mt-[10%] text-sm font-bold italic underline underline-offset-10 decoration-dashed decoration-2">
                      This TOR is not Valid Without Documentary Stamp
                    </p>
                    <p className="mt-10 font-bold text-sm">
                      GRADUATED on December 12, 2025
                    </p>
                    <p className="mt-2 font-serif font-extrabold text-base italic">
                      REPUBLIC ACT 11476
                    </p>
                    <p className="mt-[1.7%] text-base italic tracking-tight font-serif">
                      AN ACT INSTITUTIONALIZING GOOD MANNERS AND RIGHT CONDUCT
                      AND VALUES EDUCATION
                    </p>
                    <p className="mt-5 text-sm font-semibold">
                      Member Accredited by:
                    </p>
                    <div className="mt-5 w-full space-y-4 pl-5">
                      {/* Row 1 */}
                      <div className="grid grid-cols-[85px_1fr] items-center">
                        <div className="flex justify-center">
                          <Image
                            src={`${partnerBase}/International%20Association%20for%20Theological%20Accreditation%20%28IATA%29.png`}
                            alt="International Association for Theological Accreditation"
                            width={62}
                            height={42}
                            className="h-auto w-27 object-contain"
                          />
                        </div>
                        <div className="flex flex-col text-center font-serif text-sm font-bold tracking-tight">
                          <p>
                            International Association of Theological
                            Accreditation
                          </p>
                          <p>3347- Millash Trail Buford, GA U.S.A –30519</p>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="grid grid-cols-[85px_1fr] items-center">
                        <div className="flex justify-center">
                          <Image
                            src={`${partnerBase}/Covenant%20School%20of%20Ministry%20and%20Divinity.png`}
                            alt="Covenant School Global"
                            width={52}
                            height={52}
                            className="h-auto w-14 object-contain"
                          />
                        </div>
                        <div className="flex flex-col text-center font-serif text-sm font-bold tracking-tight">
                          <p>Covenant School of Ministry and Divinity</p>
                          <p>Covenant Global Inc – U.S.A.</p>
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="grid grid-cols-[85px_1fr] items-center">
                        <div className="flex justify-center">
                          <Image
                            src={`${partnerBase}/Association%20of%20Christian%20Schools%20International%20%28ACSI%29.png`}
                            alt="Association of Christian Schools International"
                            width={74}
                            height={32}
                            className="h-auto w-24 object-contain"
                          />
                        </div>
                        <div className="flex flex-col text-center font-serif text-sm font-bold tracking-tight">
                          <p>Association of Christian Schools International</p>
                          <p>Colorado Springs, Colorado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border-x border-b border-black" />
                <td className="border-x border-b border-black" />
                <td className="border-x border-b border-black" />
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={6}
                  className="border border-black px-[1.3%] py-[.8%] text-xs"
                >
                  <p>
                    <b className="underline underline-offset-2 decoration-2">
                      LEGEND FOR GRADING SYSTEM:
                    </b>
                  </p>
                  <p className="mt-5 text-sm">
                    <b className="italic">PERCENTAGE:</b> &nbsp; 1.00 -
                    (98-100%) &nbsp; 1.25 - (95-97%) &nbsp; 1.50 - (92-94%)
                    &nbsp; 1.75 - (91-93%) &nbsp; 2.00 - (86-90%) &nbsp; 2.25 -
                    C+ (83-85%)
                  </p>
                  <p className="mt-3 text-xs">
                    <b className="italic">Note:</b> This document is subject to
                    revocation if the records upon which it is based are
                    subsequently found to be fraudulent.
                  </p>
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        <p className="mt-5 text-sm">
          <b>REMARKS:</b> Graduated with the course of {student.program} last
          December 12, 2025.
        </p>
        <footer className="mt-20 grid grid-cols-2 gap-[16%] px-[5%] text-center text-sm font-bold">
          <div>
            <p className="border-b border-black pb-[2%]">NOIME B. BAYONG</p>
            <p className="mt-[2%] font-normal">REGISTRAR</p>
          </div>
          <div>
            <p className="border-b border-black pb-[2%]">
              BISHOP RODEL R. MANZO, PhD., EdD., DMin., MPA
            </p>
            <p className="mt-[2%] font-normal">SCHOOL PRESIDENT</p>
          </div>
        </footer>
        <p className="mt-10 italic text-[11px] tracking-tighter font-medium">
          NOT VALID WITHOUT THE OFFICIAL
          <br />
          SEAL OF POTSCI
        </p>
      </main>
    </div>
  );
}
