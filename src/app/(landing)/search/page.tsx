import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Home,
  Megaphone,
  Search,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type CountFilter = [label: string, count: string, checked: boolean];
type DateFilter = [label: string, checked: boolean];

const contentTypes: CountFilter[] = [
  ["All Results", "24", true],
  ["Pages", "8", false],
  ["Announcements", "6", false],
  ["Documents", "5", false],
  ["Events", "3", false],
  ["Resources", "2", false],
];

const categories: CountFilter[] = [
  ["All Categories", "24", true],
  ["Academics", "8", false],
  ["Admissions", "3", false],
  ["Student Life", "4", false],
  ["Resources", "5", false],
  ["News & Announcements", "4", false],
];

const dateFilters: DateFilter[] = [
  ["Any Time", true],
  ["Past Week", false],
  ["Past Month", false],
  ["Past 6 Months", false],
  ["Past Year", false],
];

const results: {
  title: string;
  description: string;
  category: string;
  path: string;
  date: string;
  type: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Academic Calendar",
    description:
      "View the academic calendar for the current semester, important dates, holidays, and deadlines.",
    category: "Academics",
    path: "Academic Calendar",
    date: "May 2, 2024",
    type: "Page",
    icon: CalendarDays,
  },
  {
    title: "Academic Calendar AY 2024-2025",
    description:
      "Download the official academic calendar for Academic Year 2024-2025.",
    category: "Resources",
    path: "Documents",
    date: "April 30, 2024",
    type: "Document",
    icon: FileText,
  },
  {
    title: "Update: Academic Calendar Changes",
    description:
      "Please be informed of the recent changes made to the academic calendar for the second semester.",
    category: "Announcements",
    path: "",
    date: "April 15, 2024",
    type: "Announcement",
    icon: Megaphone,
  },
  {
    title: "Enrollment Period - 2nd Semester",
    description:
      "Enrollment for the 2nd semester will begin on June 10, 2024. Please check the academic calendar for other important dates.",
    category: "Events Calendar",
    path: "",
    date: "April 10, 2024",
    type: "Event",
    icon: CalendarDays,
  },
  {
    title: "How to Read the Academic Calendar",
    description:
      "A quick guide on how to understand and use the academic calendar effectively.",
    category: "Student Life",
    path: "Guides",
    date: "March 28, 2024",
    type: "Page",
    icon: BookOpen,
  },
];

const typeBadgeClassName: Record<string, string> = {
  Page: "bg-[#e8f3ee] text-[#0b4b39]",
  Document: "bg-[#edf5f1] text-[#0b4b39]",
  Announcement: "bg-[#e8f3ee] text-[#0b4b39]",
  Event: "bg-[#e8f3ee] text-[#0b4b39]",
};

const FilterCheckbox = ({
  label,
  count,
  checked,
}: {
  label: string;
  count?: string;
  checked: boolean;
}) => (
  <label className="flex items-center justify-between gap-3 text-sm text-[#31463f]">
    <span className="flex items-center gap-2">
      <span
        className={`flex size-4 items-center justify-center rounded border ${
          checked
            ? "border-[#0b4b39] bg-[#0b4b39]"
            : "border-[#0b3327]/20 bg-white"
        }`}
      >
        {checked ? <span className="size-1.5 rounded-full bg-white" /> : null}
      </span>
      {label}
    </span>
    {count ? <span className="text-xs text-[#31463f]/70">({count})</span> : null}
  </label>
);

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/4567486/pexels-photo-4567486.jpeg"
          alt="Pearl of The Orient campus"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.98)_0%,rgba(0,52,39,0.84)_48%,rgba(0,52,39,0.36)_78%,rgba(0,52,39,0.26)_100%)]" />

        <div className="container mx-auto px-6 py-14 lg:px-20">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Search
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Find information, pages, announcements, and resources across the
            portal.
          </p>

          <div className="mt-8 flex max-w-5xl items-center gap-3 rounded-md bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
            <Search className="ml-3 size-5 shrink-0 text-[#0b4b39]" />
            <div className="flex-1 px-1 text-sm font-semibold text-[#31463f]">
              academic calendar
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 text-[#31463f] hover:bg-[#eef5f2]"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </Button>
            <Button className="h-10 rounded-md bg-[#003f2b] px-6 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 lg:px-20">
        <div className="container mx-auto">
          <nav className="flex items-center gap-2 text-xs font-semibold text-[#31463f]">
            <Home className="size-3.5 text-[#0b4b39]" />
            <Link href="/" className="hover:text-[#c48a17]">
              Home
            </Link>
            <span>›</span>
            <span>Search</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">Refine Results</h2>
                <SlidersHorizontal className="size-4 text-[#0b4b39]" />
              </div>

              <div className="mt-6 space-y-8">
                <section>
                  <h3 className="text-sm font-extrabold">Content Type</h3>
                  <div className="mt-4 space-y-3">
                    {contentTypes.map(([label, count, checked]) => (
                      <FilterCheckbox
                        key={label}
                        label={label}
                        count={count}
                        checked={checked === true}
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-extrabold">Categories</h3>
                  <div className="mt-4 space-y-3">
                    {categories.map(([label, count, checked]) => (
                      <FilterCheckbox
                        key={label}
                        label={label}
                        count={count}
                        checked={checked === true}
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-extrabold">Date Posted</h3>
                  <div className="mt-4 space-y-3">
                    {dateFilters.map(([label, checked]) => (
                      <FilterCheckbox
                        key={label}
                        label={label}
                        checked={checked === true}
                      />
                    ))}
                  </div>
                </section>
              </div>

              <Button
                variant="outline"
                className="mt-8 h-10 w-full rounded-md bg-white text-sm font-semibold text-[#0b3327] shadow-none"
              >
                <X className="size-4" />
                Clear Filters
              </Button>
            </aside>

            <section>
              <div className="rounded-md border border-[#0b3327]/10 bg-white shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
                <div className="flex flex-col gap-4 border-b border-[#0b3327]/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[#31463f]">
                    Showing 1 - 10 of 24 results for{" "}
                    <span className="font-bold text-[#c48a17]">
                      &quot;academic calendar&quot;
                    </span>
                  </p>
                  <Button
                    variant="outline"
                    className="h-10 w-fit rounded-md bg-white text-sm font-semibold text-[#0b3327] shadow-none"
                  >
                    Sort by: Relevance
                    <ChevronDown className="size-4" />
                  </Button>
                </div>

                <div>
                  {results.map((result) => {
                    const Icon = result.icon;

                    return (
                      <article
                        key={result.title}
                        className="grid gap-5 border-b border-[#0b3327]/10 px-6 py-6 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)_120px]"
                      >
                        <div className="flex size-14 items-center justify-center rounded-full bg-[#eef5f2] text-[#0b4b39]">
                          <Icon className="size-7" strokeWidth={1.6} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold">{result.title}</h2>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#31463f]">
                            {result.description}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#31463f]/75">
                            <span>{result.category}</span>
                            {result.path ? (
                              <>
                                <span>›</span>
                                <span>{result.path}</span>
                              </>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex flex-row items-start justify-between gap-4 sm:flex-col sm:items-end">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              typeBadgeClassName[result.type]
                            }`}
                          >
                            {result.type}
                          </span>
                          <span className="text-xs text-[#31463f]/70">
                            {result.date}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-md bg-white"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="icon"
                    className={
                      page === 1
                        ? "size-9 rounded-md bg-[#003f2b] text-white"
                        : "size-9 rounded-md bg-white"
                    }
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-md bg-white"
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </section>
          </div>

          <div className="mt-10 flex flex-col gap-5 rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#0b4b39] ring-1 ring-[#0b3327]/10">
                <HelpCircle className="size-6" />
              </div>
              <div>
                <h2 className="font-bold">Still can&apos;t find what you&apos;re looking for?</h2>
                <p className="mt-1 text-sm text-[#31463f]">
                  Try using different keywords or contact our Help Center.
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-10 w-fit rounded-md bg-white px-5 text-sm font-bold text-[#0b4b39] shadow-none"
            >
              <Link href="/help-center">
                Visit Help Center
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
