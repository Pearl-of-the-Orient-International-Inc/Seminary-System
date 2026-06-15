import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  ArrowRight,
  Bell,
  BookOpen,
  Bookmark,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  HelpCircle,
  Mail,
  Newspaper,
  Phone,
  Play,
  Search,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const resourceTypes: {
  title: string;
  description: string;
  count: string;
  icon: LucideIcon;
}[] = [
  {
    title: "E-Books",
    description: "Access thousands of digital books and reference materials.",
    count: "2,400+ Titles",
    icon: BookOpen,
  },
  {
    title: "Academic Journals",
    description: "Scholarly articles and peer-reviewed journals.",
    count: "1,875+ Journals",
    icon: Newspaper,
  },
  {
    title: "Thesis & Dissertations",
    description: "Research papers and academic dissertations.",
    count: "575+ Papers",
    icon: FileText,
  },
  {
    title: "Archives & Collections",
    description: "Historical documents and special collections.",
    count: "230+ Collections",
    icon: Archive,
  },
];

const featuredResources = [
  {
    title: "Theology for the Church",
    author: "Dennis, Allen",
    type: "E-Book",
    cover: "bg-[#5b1f1f]",
    description:
      "A comprehensive introduction to biblical doctrines and application in ministry.",
    action: "View",
  },
  {
    title: "Church History",
    author: "Williams, Philip",
    type: "E-Book",
    cover: "bg-[#b58a55]",
    description:
      "A classic account of the development of the Christian church from apostolic times.",
    action: "View",
  },
  {
    title: "The Gospel of John",
    author: "D.A. Carson",
    type: "E-Book",
    cover: "bg-[#173f33]",
    description:
      "An in-depth commentary on the Gospel of John by renowned scholar D.A. Carson.",
    action: "View",
  },
  {
    title: "Systematic Theology",
    author: "Wayne Grudem",
    type: "E-Book",
    cover: "bg-[#11243d]",
    description:
      "An in-depth exploration of Christian doctrines and theological truth.",
    action: "View",
  },
];

const announcements = [
  {
    title: "New Resource Added",
    description: "New journals and e-books added this month.",
    icon: BookOpen,
  },
  {
    title: "Database Update",
    description: "Several databases have been updated for better access.",
    icon: CalendarClock,
  },
  {
    title: "Maintenance Schedule",
    description: "Library system will undergo maintenance on May 25, 2025 from 8:00 AM - 4:00 AM.",
    icon: CalendarClock,
  },
];

const quickLinks = [
  "My Bookmarks",
  "My Reading History",
  "Saved Searches",
  "Citation Generator",
  "Research Guides",
  "User Guides (How to Use)",
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-72 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="/resources.jpg"
          alt="Digital library resources"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.98)_0%,rgba(0,52,39,0.88)_46%,rgba(0,52,39,0.38)_78%,rgba(0,52,39,0.28)_100%)]" />

        <div className="container mx-auto px-6 py-12 lg:px-20">
          <nav className="flex items-center gap-2 text-xs font-semibold text-white/76">
            <Link href="/" className="hover:text-[#f5b739]">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#f5b739]">Resources</span>
            <span>›</span>
            <span className="text-[#f5b739]">Digital Library</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Digital Library
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Access a wide collection of digital resources to support your
            studies, research, and spiritual growth.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-20">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div>
            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="text-xl font-bold">Search the Library</h2>
              <div className="mt-5 flex flex-col gap-3 md:flex-row">
                <div className="flex min-h-11 flex-1 items-center gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4">
                  <Search className="size-4 text-[#0b4b39]" />
                  <span className="text-sm text-[#31463f]/65">
                    Search books, articles, journals, authors, topics...
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="h-11 rounded-md bg-white px-5 text-sm font-semibold text-[#0b3327] shadow-none"
                >
                  All Resources
                  <ChevronRight className="size-4 rotate-90" />
                </Button>
                <Button className="h-11 rounded-md bg-[#003f2b] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
                  <Search className="size-4" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#31463f]">
                <span className="font-bold text-[#0b3327]">Popular searches:</span>
                {[
                  "Bible Commentary",
                  "Church History",
                  "Systematic Theology",
                  "Ministry",
                  "Christian Ethics",
                ].map((term) => (
                  <Link key={term} href="/resources" className="hover:text-[#c48a17]">
                    {term}
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Browse by Resource Type</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {resourceTypes.map((type) => {
                  const Icon = type.icon;

                  return (
                    <article
                      key={type.title}
                      className="rounded-md border border-[#0b3327]/10 bg-white p-5 text-center shadow-[0_12px_30px_rgba(10,51,39,0.06)]"
                    >
                      <Icon
                        className="mx-auto size-9 text-[#0b4b39]"
                        strokeWidth={1.6}
                      />
                      <h3 className="mt-4 text-sm font-extrabold">
                        {type.title}
                      </h3>
                      <p className="mt-2 text-xs text-[#31463f]">
                        {type.description}
                      </p>
                      <p className="mt-5 text-xs font-bold text-[#c48a17]">
                        {type.count}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Featured Resources</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featuredResources.map((resource) => (
                  <article
                    key={resource.title}
                    className="overflow-hidden rounded-md border border-[#0b3327]/10 bg-white shadow-[0_12px_30px_rgba(10,51,39,0.06)]"
                  >
                    <div
                      className={`flex h-44 items-center justify-center px-5 text-center text-white ${resource.cover}`}
                    >
                      <div>
                        <p className="font-serif text-lg font-bold uppercase leading-6">
                          {resource.title}
                        </p>
                        <p className="mt-3 text-xs text-white/72">
                          {resource.author}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-extrabold leading-tight">
                        {resource.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#31463f]">
                        {resource.author}
                      </p>
                      <p className="mt-2 text-xs font-bold text-[#c48a17]">
                        {resource.type}
                      </p>
                      <p className="mt-3 min-h-16 text-xs leading-5 text-[#31463f]">
                        {resource.description}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4 h-9 w-full rounded-md bg-white text-xs font-bold text-[#0b4b39] shadow-none"
                      >
                        {resource.action}
                        {resource.action === "Play" ? (
                          <Play className="size-3" />
                        ) : (
                          <ArrowRight className="size-3" />
                        )}
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-7 flex justify-center">
                <Button className="h-11 rounded-md bg-[#003f2b] px-7 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
                  View All Resources
                  <ArrowRight className="size-4" strokeWidth={2.5} />
                </Button>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Bell className="size-5 text-[#c48a17]" />
                Library Announcements
              </h2>
              <div className="mt-5 space-y-5">
                {announcements.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.title} className="flex gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#eef5f2] text-[#0b4b39]">
                        <Icon className="size-5" strokeWidth={1.6} />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#31463f]">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
              <Link
                href="/resources"
                className="mt-6 flex items-center gap-2 text-sm font-bold text-[#c48a17] hover:text-[#0b4b39]"
              >
                View All Announcements
                <ArrowRight className="size-4" />
              </Link>
            </section>

            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="text-lg font-bold">Quick Links</h2>
              <div className="mt-5 space-y-3">
                {quickLinks.map((link, index) => (
                  <Link
                    key={link}
                    href="/resources"
                    className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#0b3327] ring-1 ring-[#0b3327]/5 hover:text-[#c48a17]"
                  >
                    <span className="flex items-center gap-2">
                      {index === 0 ? (
                        <Bookmark className="size-4 text-[#0b4b39]" />
                      ) : index === 5 ? (
                        <HelpCircle className="size-4 text-[#0b4b39]" />
                      ) : (
                        <CheckCircle2 className="size-4 text-[#0b4b39]" />
                      )}
                      {link}
                    </span>
                    <ChevronRight className="size-4" />
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="text-lg font-bold">Need Help?</h2>
              <p className="mt-3 text-sm leading-6 text-[#31463f]">
                Our library staff is here to assist you.
              </p>
              <div className="mt-5 space-y-3 text-sm text-[#31463f]">
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-[#0b4b39]" />
                  <span>(043) 123-4567 loc. 105</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-[#0b4b39]" />
                  <span>library@potsc.edu.ph</span>
                </div>
                <div className="flex items-center gap-3">
                  <Download className="size-4 text-[#0b4b39]" />
                  <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
              <Button className="mt-6 h-11 w-full rounded-md bg-[#003f2b] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
                Ask a Librarian
                <ArrowRight className="size-4" strokeWidth={2.5} />
              </Button>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Page;
