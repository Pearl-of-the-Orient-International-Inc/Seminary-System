import Hero from "@/components/website/hero";
import Process from "@/components/website/process";
import AcademicPrograms from "@/components/website/academic-programs";
import Faculty from "@/components/website/faculty";

const Page = () => {
  return (
    <main className="bg-white">
      <Hero />
      <Process />
      <AcademicPrograms />
      <Faculty />
    </main>
  );
};

export default Page;
