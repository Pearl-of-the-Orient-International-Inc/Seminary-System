import { Alert, AlertTitle } from "@/components/ui/alert";
import { IconAlertCircleFilled } from "@tabler/icons-react";

import { StudentForm } from "./_components/student-form";

type PageProps = {
  params: Promise<{
    studentId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { studentId } = await params;
  const decodedStudentId = decodeURIComponent(studentId);
  const mode = decodedStudentId === "new" ? "create" : "update";

  return (
    <section className="space-y-6 p-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "create" ? "Add Student" : "Update Student"}
        </h1>
        <Alert className="border-none bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400">
          <IconAlertCircleFilled />
          <AlertTitle>
            {mode === "create"
              ? "Fill in the details below to create a student record."
              : "Review and update the student record details below."}
          </AlertTitle>
        </Alert>
      </div>

      <StudentForm mode={mode} studentId={decodedStudentId} />
    </section>
  );
};

export default Page;
