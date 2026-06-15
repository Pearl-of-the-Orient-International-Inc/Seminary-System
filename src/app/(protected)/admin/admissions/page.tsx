import { AdmissionForm } from "@/components/forms/admission-form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { IconAlertCircleFilled } from "@tabler/icons-react";

const Page = () => {
  return (
    <section className="space-y-6 p-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Admission</h1>
        <Alert className="border-none bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400">
          <IconAlertCircleFilled />
          <AlertTitle>Fill in the details below to register a new student for admission.</AlertTitle>
        </Alert>
      </div>

      <AdmissionForm />
    </section>
  );
};

export default Page;
