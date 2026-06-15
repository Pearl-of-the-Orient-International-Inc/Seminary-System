import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileUp,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const nextSteps = [
  {
    title: "Receive Confirmation",
    description:
      "You will receive an email confirmation with a reference number.",
    icon: Mail,
  },
  {
    title: "We Review Your Issue",
    description: "Our team will review and investigate the issue.",
    icon: AlertCircle,
  },
  {
    title: "We Resolve It",
    description: "We will work on a solution and keep you updated.",
    icon: Sparkles,
  },
  {
    title: "You're Notified",
    description: "You will receive a notification once the issue is resolved.",
    icon: CheckCircle2,
  },
];

const supportContacts = [
  {
    title: "Live Chat",
    description: "Chat with our support team",
    details: "Start Live Chat",
    icon: MessageSquare,
  },
  {
    title: "Call Us",
    description: "(043) 123-4567",
    details: "Mon - Fri, 8:00 AM - 5:00 PM",
    icon: Phone,
  },
  {
    title: "Email Us",
    description: "support@pearloftheorient.edu.ph",
    details: "",
    icon: Mail,
  },
];

const priorities = [
  {
    label: "Low",
    description: "Minor issue that doesn&apos;t affect my work",
  },
  {
    label: "Medium",
    description: "Moderate issue that partially affects my work",
    checked: true,
  },
  {
    label: "High",
    description: "Major issue that prevents me from completing my work",
  },
  {
    label: "Urgent",
    description: "Critical issue that requires immediate attention",
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-64 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/3747132/pexels-photo-3747132.jpeg"
          alt="Pearl of The Orient campus"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.98)_0%,rgba(0,52,39,0.86)_46%,rgba(0,52,39,0.38)_78%,rgba(0,52,39,0.24)_100%)]" />

        <div className="container mx-auto px-6 py-14 lg:px-20">
          <nav className="flex items-center gap-2 text-xs font-semibold text-white/76">
            <Link href="/" className="hover:text-[#f5b739]">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#f5b739]">Report an Issue</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Report an Issue
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Experiencing a problem? Let us know so we can resolve it quickly
            and improve your experience.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-20">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#eef5f2] text-[#0b4b39]">
                <AlertCircle className="size-6" strokeWidth={1.6} />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold">Issue Details</h2>
                <p className="mt-1 text-sm leading-6 text-[#31463f]">
                  Please provide as much detail as possible so our team can help
                  you better.
                </p>
              </div>
            </div>

            <form className="mt-7 space-y-4">
              <label className="block">
                <span className="text-sm font-bold">Category *</span>
                <div className="mt-2 flex h-11 items-center justify-between rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                  Select an issue category
                  <ChevronDown className="size-4 text-[#0b4b39]" />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold">Issue Title *</span>
                <div className="mt-2 flex h-11 items-center rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                  Briefly describe the issue
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold">Description *</span>
                <div className="mt-2 flex min-h-32 items-start rounded-md border border-[#0b3327]/10 bg-white px-4 py-3 text-sm text-[#31463f]/65">
                  Please provide detailed information about the issue you are
                  experiencing.
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold">
                  Where did you encounter this issue? *
                </span>
                <div className="mt-2 flex h-11 items-center rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                  e.g. Student Portal, Online Enrollment, Payment, etc.
                </div>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold">
                    When did this issue occur? *
                  </span>
                  <div className="mt-2 flex h-11 items-center justify-between rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                    Select date
                    <CalendarDays className="size-4 text-[#0b4b39]" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-bold">&nbsp;</span>
                  <div className="mt-2 flex h-11 items-center justify-between rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                    Select time (optional)
                    <Clock className="size-4 text-[#0b4b39]" />
                  </div>
                </label>
              </div>

              <section>
                <h3 className="text-sm font-bold">Priority Level *</h3>
                <div className="mt-3 space-y-3">
                  {priorities.map((priority) => (
                    <label key={priority.label} className="flex gap-3">
                      <span
                        className={`mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                          priority.checked
                            ? "border-[#003f2b]"
                            : "border-[#0b3327]/30"
                        }`}
                      >
                        {priority.checked ? (
                          <span className="size-2 rounded-full bg-[#003f2b]" />
                        ) : null}
                      </span>
                      <span>
                        <span className="block text-sm font-bold">
                          {priority.label}
                        </span>
                        <span className="block text-xs leading-5 text-[#31463f]">
                          {priority.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold">Attachments (Optional)</h3>
                <div className="mt-2 flex min-h-20 flex-col items-center justify-center rounded-md border border-dashed border-[#0b3327]/20 bg-[#fbfcfb] px-4 py-5 text-center">
                  <FileUp className="size-6 text-[#0b4b39]" />
                  <p className="mt-2 text-sm font-semibold text-[#31463f]">
                    Drag and drop files here or click to browse
                  </p>
                  <p className="mt-1 text-xs text-[#31463f]/70">
                    Max file size: 10MB (PNG, JPG, PDF)
                  </p>
                </div>
              </section>

              <label className="flex items-start gap-3 text-xs leading-5 text-[#31463f]">
                <span className="mt-0.5 size-4 rounded border border-[#0b3327]/20 bg-white" />
                I agree to the processing of my data in accordance with the
                Privacy Policy.
              </label>

              <div className="flex flex-wrap gap-3">
                <Button className="h-10 rounded-md bg-[#003f2b] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
                  <Send className="size-4" strokeWidth={1.7} />
                  Submit Issue
                </Button>
                <Button
                  variant="outline"
                  className="h-10 rounded-md bg-white px-5 text-sm font-bold text-[#0b4b39] shadow-none"
                >
                  <X className="size-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="font-serif text-lg font-bold">Before You Submit</h2>
              <div className="mt-3 h-1 w-12 bg-[#f5b739]" />
              <p className="mt-4 text-sm leading-6 text-[#31463f]">
                Please check our Help Center for solutions to common issues. Your
                problem might already have an answer.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-5 h-10 rounded-md bg-white px-4 text-sm font-bold text-[#0b4b39]"
              >
                <Link href="/help-center">
                  Go to Help Center
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </section>

            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="font-serif text-lg font-bold">
                What Happens Next?
              </h2>
              <div className="mt-3 h-1 w-12 bg-[#f5b739]" />
              <div className="mt-5 space-y-5">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <article key={step.title} className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#e8f3ee] text-[#0b4b39] ring-1 ring-[#0b3327]/10">
                          <Icon className="size-5" strokeWidth={1.6} />
                        </div>
                        {index < nextSteps.length - 1 ? (
                          <span className="mt-2 h-7 w-px bg-[#0b3327]/15" />
                        ) : null}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">{step.title}</h3>
                        <p className="mt-1 text-xs leading-5 text-[#31463f]">
                          {step.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="font-serif text-lg font-bold">
                Need Immediate Help?
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#31463f]">
                Contact our support team for urgent concerns or time-sensitive
                issues.
              </p>
              <div className="mt-5 space-y-5">
                {supportContacts.map((contact) => {
                  const Icon = contact.icon;

                  return (
                    <article key={contact.title} className="flex gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0b4b39] ring-1 ring-[#0b3327]/10">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">{contact.title}</h3>
                        <p className="text-xs leading-5 text-[#31463f]">
                          {contact.description}
                        </p>
                        {contact.details ? (
                          <p className="text-xs font-semibold text-[#0b4b39]">
                            {contact.details}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Page;
