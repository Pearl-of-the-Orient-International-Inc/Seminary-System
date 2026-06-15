import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  Download,
  Edit3,
  FileText,
  GraduationCap,
  HelpCircle,
  Megaphone,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

const featureGroups: {
  title: string;
  description: string;
  icon: LucideIcon;
  features: {
    title: string;
    description: string;
    action: string;
    href: string;
    icon: LucideIcon;
  }[];
}[] = [
  {
    title: "Academic Tools",
    description: "Manage your academic life with these essential tools.",
    icon: GraduationCap,
    features: [
      {
        title: "My Courses",
        description: "View your courses, syllabi, and class materials.",
        action: "Go to My Courses",
        href: "/academics",
        icon: BookOpen,
      },
      {
        title: "Grades & Records",
        description: "Check your grades, GPA, and academic records.",
        action: "Go to Grades",
        href: "/auth/access",
        icon: ClipboardCheck,
      },
      {
        title: "Class Schedule",
        description: "View your class schedule and calendar.",
        action: "Go to Schedule",
        href: "/calendar",
        icon: CalendarDays,
      },
      {
        title: "Assessments",
        description: "View quizzes, exams, and assessment results.",
        action: "Go to Assessments",
        href: "/auth/access",
        icon: FileText,
      },
      {
        title: "Academic Advising",
        description: "Connect with your adviser and view advising notes.",
        action: "Go to Advising",
        href: "/contact",
        icon: UserRound,
      },
    ],
  },
  {
    title: "Finances & Accounts",
    description: "Stay on top of your financial information and transactions.",
    icon: WalletCards,
    features: [
      {
        title: "My Account",
        description: "View and update your personal information.",
        action: "Go to My Account",
        href: "/auth/access",
        icon: UserRound,
      },
      {
        title: "Billing & Fees",
        description: "View billing statements and account balances.",
        action: "Go to Billing",
        href: "/apply/step-3",
        icon: FileText,
      },
      {
        title: "Payment History",
        description: "View your payment history and transactions.",
        action: "Go to Payments",
        href: "/apply/step-3",
        icon: CreditCard,
      },
      {
        title: "Financial Aid",
        description: "Check your financial aid status and documents.",
        action: "Go to Financial Aid",
        href: "/admissions",
        icon: WalletCards,
      },
      {
        title: "Scholarships",
        description: "Browse and manage available scholarships.",
        action: "Go to Scholarships",
        href: "/admissions",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Campus Life",
    description: "Get involved and stay connected on campus.",
    icon: Users,
    features: [
      {
        title: "Student Life",
        description: "Explore organizations, events, and campus activities.",
        action: "Go to Student Life",
        href: "/student-life",
        icon: Users,
      },
      {
        title: "Announcements",
        description: "Stay updated with the latest news and announcements.",
        action: "Go to Announcements",
        href: "/announcements",
        icon: Megaphone,
      },
      {
        title: "Events Calendar",
        description: "View and join upcoming events and activities.",
        action: "Go to Calendar",
        href: "/calendar",
        icon: CalendarDays,
      },
      {
        title: "Directory",
        description: "Search for faculty, staff, and student contacts.",
        action: "Go to Directory",
        href: "/contact",
        icon: UserRound,
      },
      {
        title: "Services",
        description: "Discover student services and support resources.",
        action: "Go to Services",
        href: "/help-center",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Resources",
    description: "Access learning materials and helpful resources.",
    icon: BookOpen,
    features: [
      {
        title: "Digital Library",
        description: "Access e-books, journals, and digital resources.",
        action: "Go to Library",
        href: "/resources",
        icon: BookOpen,
      },
      {
        title: "Research Tools",
        description: "Use research databases and citation tools.",
        action: "Go to Research Tools",
        href: "/resources",
        icon: Search,
      },
      {
        title: "Downloads",
        description: "Download forms, guides, and important documents.",
        action: "Go to Downloads",
        href: "/resources",
        icon: Download,
      },
      {
        title: "Help Center",
        description: "Find answers to FAQs and get help when you need it.",
        action: "Go to Help Center",
        href: "/help-center",
        icon: HelpCircle,
      },
      {
        title: "Feedback",
        description: "Share your feedback to help us improve.",
        action: "Go to Feedback",
        href: "/feedback",
        icon: Edit3,
      },
    ],
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-72 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/38519/macbook-laptop-ipad-apple-38519.jpeg"
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
            <span className="text-[#f5b739]">Explore All Features</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Explore All Features
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Discover all the tools and resources available in your student
            portal to support your academic journey and campus life.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-20">
        <div className="container mx-auto">
          <h2 className="font-serif text-2xl font-bold">Portal Features</h2>
          <div className="mt-3 h-1 w-16 bg-[#f5b739]" />

          <div className="mt-7 space-y-9">
            {featureGroups.map((group) => {
              const GroupIcon = group.icon;

              return (
                <section
                  key={group.title}
                  className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]"
                >
                  <div className="flex gap-4 lg:block">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#003f2b] text-[#f5b739]">
                      <GroupIcon className="size-6" strokeWidth={1.7} />
                    </div>
                    <div className="lg:mt-4">
                      <h3 className="font-bold">{group.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#31463f]">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {group.features.map((feature) => {
                      const Icon = feature.icon;

                      return (
                        <Link
                          key={feature.title}
                          href={feature.href}
                          className="group flex min-h-48 flex-col rounded-md border border-[#0b3327]/10 bg-white p-5 text-center shadow-[0_12px_30px_rgba(10,51,39,0.06)] transition-all hover:-translate-y-1 hover:border-[#f5b739]"
                        >
                          <Icon
                            className="mx-auto size-10 text-[#0b4b39]"
                            strokeWidth={1.55}
                          />
                          <h4 className="mt-4 text-sm font-extrabold">
                            {feature.title}
                          </h4>
                          <p className="mt-2 flex-1 text-xs leading-5 text-[#31463f]">
                            {feature.description}
                          </p>
                          <span className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-[#0b4b39]">
                            {feature.action}
                            <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
