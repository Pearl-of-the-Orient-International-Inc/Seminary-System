import { Alert, AlertTitle } from "@/components/ui/alert";
import { IconAlertCircleFilled } from "@tabler/icons-react";

import { InstructorForm } from "./_components/instructor-form";

type PageProps = {
  params: Promise<{
    instructorId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { instructorId } = await params;
  const decodedInstructorId = decodeURIComponent(instructorId);
  const mode = decodedInstructorId === "new" ? "create" : "update";

  return (
    <section className="space-y-6 p-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "create" ? "Create Instructor" : "Update Instructor"}
        </h1>
        <Alert className="border-none bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400">
          <IconAlertCircleFilled />
          <AlertTitle>
            {mode === "create"
              ? "Fill in the faculty profile, credentials, qualifications, and evaluation below."
              : "Review and update the instructor profile details below."}
          </AlertTitle>
        </Alert>
      </div>

      <InstructorForm instructorId={mode === "create" ? undefined : decodedInstructorId} />
    </section>
  );
};

export default Page;
