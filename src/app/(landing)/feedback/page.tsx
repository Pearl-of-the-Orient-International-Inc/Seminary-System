import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronDown,
  GraduationCap,
  Headphones,
  Laptop,
  Mail,
  Megaphone,
  MessageSquare,
  Send,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const feedbackTopics: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Academic Programs",
    description:
      "Share your thoughts about our courses, curriculum, and academic support.",
    icon: GraduationCap,
  },
  {
    title: "Campus Facilities",
    description:
      "Help us improve our facilities, amenities, and learning environment.",
    icon: Building2,
  },
  {
    title: "Student Services",
    description:
      "Tell us about your experience with our student services and staff.",
    icon: Users,
  },
  {
    title: "Events & Activities",
    description:
      "Feedback on campus events, activities, and student engagement.",
    icon: CalendarDays,
  },
  {
    title: "Website & Portal",
    description: "Share your experience using our website and student portal.",
    icon: Laptop,
  },
  {
    title: "Other Concerns",
    description:
      "Any other suggestions or concerns you would like to share.",
    icon: MessageSquare,
  },
];

const connectOptions: {
  title: string;
  description: string;
  action: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Visit Help Center",
    description: "Find answers to frequently asked questions.",
    action: "Go to Help Center",
    href: "/help-center",
    icon: Headphones,
  },
  {
    title: "Contact Us",
    description: "Get in touch with our support team directly.",
    action: "Go to Contact Us",
    href: "/contact",
    icon: Mail,
  },
  {
    title: "Report an Issue",
    description: "Experiencing a problem? Let us know.",
    action: "Report Now",
    href: "/report-an-issue",
    icon: Megaphone,
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-72 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/35655038/pexels-photo-35655038.jpeg"
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
            <span className="text-[#f5b739]">Feedback</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Feedback
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            We value your feedback! Share your thoughts, suggestions, or
            concerns to help us improve our services and your experience.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-20">
        <div className="container mx-auto">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
            <section>
              <h2 className="font-serif text-2xl font-bold">
                We&apos;d Love to Hear From You
              </h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <p className="mt-4 text-sm leading-6 text-[#31463f]">
                Please fill out the form below. All feedback is important to us.
              </p>

              <form className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex h-11 items-center gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                    <UserRound className="size-4 text-[#0b4b39]" />
                    First Name *
                  </label>
                  <label className="flex h-11 items-center gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                    <UserRound className="size-4 text-[#0b4b39]" />
                    Last Name *
                  </label>
                </div>
                <label className="flex h-11 items-center gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                  <Mail className="size-4 text-[#0b4b39]" />
                  Email Address *
                </label>
                <label className="flex h-12 items-center justify-between gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                  <span>
                    <span className="block text-xs font-semibold text-[#31463f]">
                      I am a... *
                    </span>
                    Select an option
                  </span>
                  <ChevronDown className="size-4 text-[#0b4b39]" />
                </label>
                <label className="flex h-12 items-center justify-between gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                  <span>
                    <span className="block text-xs font-semibold text-[#31463f]">
                      Feedback Type *
                    </span>
                    Select an option
                  </span>
                  <ChevronDown className="size-4 text-[#0b4b39]" />
                </label>
                <label className="flex h-11 items-center gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                  <MessageSquare className="size-4 text-[#0b4b39]" />
                  Subject *
                </label>
                <label className="flex min-h-40 items-start gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 py-3 text-sm text-[#31463f]/65">
                  <MessageSquare className="mt-1 size-4 text-[#0b4b39]" />
                  Your Feedback *
                </label>

                <section className="pt-2">
                  <h3 className="text-sm font-bold">Rate Your Experience</h3>
                  <p className="mt-1 text-xs text-[#31463f]">
                    Please rate your overall experience with our services.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        aria-label={`Rate ${rating} star`}
                        className="text-[#f5b739] transition hover:scale-110"
                      >
                        <Star className="size-7" strokeWidth={1.6} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-[#31463f]/75">
                      Select a rating
                    </span>
                  </div>
                </section>

                <label className="flex items-center gap-3 text-xs text-[#31463f]">
                  <span className="size-4 rounded border border-[#0b3327]/20 bg-white" />
                  You may contact me for more details about my feedback.
                </label>

                <Button className="h-12 w-full rounded-md bg-[#003f2b] text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
                  <Send className="size-4" strokeWidth={1.7} />
                  Submit Feedback
                </Button>
              </form>
            </section>

            <aside className="border-[#0b3327]/10 lg:border-l lg:pl-10">
              <h2 className="font-serif text-2xl font-bold">
                What You Can Provide Feedback On
              </h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />

              <div className="mt-6 space-y-5">
                {feedbackTopics.map((topic) => {
                  const Icon = topic.icon;

                  return (
                    <article key={topic.title} className="flex gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-[#eef5f2] text-[#0b4b39]">
                        <Icon className="size-6" strokeWidth={1.6} />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold">{topic.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-[#31463f]">
                          {topic.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <section className="mt-8 rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
                <div className="flex gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#0b4b39] ring-1 ring-[#0b3327]/10">
                    <ShieldCheck className="size-6" strokeWidth={1.6} />
                  </div>
                  <div>
                    <h3 className="font-bold">Your Feedback Matters</h3>
                    <p className="mt-2 text-sm leading-6 text-[#31463f]">
                      Your feedback helps us enhance our services and create a
                      better experience for everyone in our community.
                    </p>
                    <p className="mt-4 text-sm leading-6 text-[#31463f]">
                      Thank you for taking the time to share your thoughts with
                      us!
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          <section className="mt-12 rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
            <h2 className="font-serif text-xl font-bold">
              Other Ways to Connect
            </h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              {connectOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <article key={option.title} className="flex gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#eef5f2] text-[#0b4b39]">
                      <Icon className="size-7" strokeWidth={1.6} />
                    </div>
                    <div>
                      <h3 className="font-bold">{option.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#31463f]">
                        {option.description}
                      </p>
                      <Button
                        asChild
                        variant="link"
                        className="mt-2 h-auto p-0! text-sm font-bold text-[#0b4b39] hover:text-[#c48a17]"
                      >
                        <Link href={option.href}>
                          {option.action}
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Page;
