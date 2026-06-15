import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Church,
  Globe,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Lightbulb,
  Music,
  Quote,
  Sparkles,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Marquee } from "@/components/animated-ui/marquee";
import { Button } from "@/components/ui/button";

const values = [
  {
    title: "Christ-Centered Community",
    description: "A community rooted in faith, love, and service.",
    icon: BookOpen,
  },
  {
    title: "Personal Growth",
    description: "Opportunities to develop your gifts and character.",
    icon: Users,
  },
  {
    title: "Leadership Development",
    description: "Equipping leaders for the church and the world.",
    icon: HandHeart,
  },
  {
    title: "Global Perspective",
    description: "Preparing for mission and outreach.",
    icon: Globe,
  },
  {
    title: "Service-Oriented",
    description: "Making a difference in the church and society.",
    icon: HeartHandshake,
  },
  {
    title: "Lifelong Friendships",
    description: "Building meaningful relationships that last.",
    icon: BookOpen,
  },
];

const campusLife = [
  {
    title: "Active Community",
    description: "Student organizations",
    icon: Users,
  },
  {
    title: "Weekly Chapel",
    description: "Chapel & devotionals",
    icon: Church,
  },
  {
    title: "Year-round",
    description: "Ministry engagement",
    icon: Sun,
  },
];

const organizations = [
  { title: "Theology Fellowship", icon: BookOpen },
  { title: "Worship Ministry", icon: Music },
  { title: "Mission Guild", icon: Globe },
  { title: "Student Government", icon: Users },
  { title: "The Word Club", icon: BookOpen },
  { title: "Media & Communications", icon: Lightbulb },
  { title: "Youth Ministry", icon: Users },
  { title: "Sports & Recreation", icon: Sparkles },
];

const events = [
  ["MAY", "20", "Chapel Service", "9:00 AM - 10:00 AM", "POTSC Chapel"],
  ["MAY", "24", "Leadership Training", "9:00 AM - 4:00 PM", "Conference Room"],
  ["MAY", "30", "Outreach Ministry", "8:00 AM - 3:00 PM", "Community Center"],
  [
    "JUN",
    "06",
    "Student Fellowship Night",
    "7:00 PM - 9:00 PM",
    "Community Center",
  ],
  ["JUN", "14", "Mission Trip Orientation", "8:00 AM - 11:00 AM", "Room 201"],
];

const ministryCards = [
  {
    title: "Local Outreach",
    description:
      "Serve our local communities through evangelism and compassionate ministries.",
    image:
      "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: HandHeart,
  },
  {
    title: "Mission Trips",
    description:
      "Participate in local and cross-cultural ministry opportunities.",
    image:
      "https://images.pexels.com/photos/6647004/pexels-photo-6647004.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Globe,
  },
  {
    title: "Worship & Arts",
    description: "Use your creative gifts to glorify God and inspire others.",
    image:
      "https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Music,
  },
  {
    title: "Discipleship",
    description:
      "Grow deeper in your faith through mentorship and discipleship groups.",
    image:
      "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: BookOpen,
  },
];

const services: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Spiritual Guidance",
    description: "Counseling and pastoral care.",
    icon: Church,
  },
  {
    title: "Academic Support",
    description: "Library, writing assistance, and tutoring.",
    icon: GraduationCap,
  },
  {
    title: "Career Development",
    description: "Internship and ministry placement.",
    icon: Briefcase,
  },
  {
    title: "Health & Wellness",
    description: "Nurturing physical, mental, and spiritual well-being.",
    icon: HeartHandshake,
  },
];

const testimonials = [
  {
    quote: "POTSC is more than a school; it is a family and a mission.",
    name: "Jared",
    role: "B.Th. Student",
  },
  {
    quote: "The community helped me discover my calling and grow with courage.",
    name: "Maria",
    role: "M.A.C.D. Student",
  },
  {
    quote:
      "Serving in ministry has helped me become more faithful and grounded.",
    name: "Daniel",
    role: "B.C.M. Student",
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-88 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/6321231/pexels-photo-6321231.jpeg"
          alt="Students walking and talking on campus"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.96)_0%,rgba(0,52,39,0.84)_44%,rgba(0,52,39,0.28)_78%,rgba(0,52,39,0.14)_100%)]" />

        <div className="container mx-auto px-6 py-14 lg:px-20">
          <nav className="flex items-center gap-2 text-xs font-semibold text-white/76">
            <Link href="/" className="hover:text-[#f5b739]">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#f5b739]">Student Life</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Student Life
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            At POTSC, education goes beyond the classroom. We are committed to
            helping you grow spiritually, academically, socially, and
            personally.
          </p>
        </div>
      </section>

      <section className="bg-[#003f2b] px-6 py-6 text-white lg:px-20">
        <div className="container mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="border-white/16 text-center lg:border-l lg:px-4 lg:first:border-l-0"
              >
                <Icon
                  className="mx-auto size-8 text-[#f5b739]"
                  strokeWidth={1.7}
                />
                <h2 className="mt-3 text-sm font-extrabold">{value.title}</h2>
                <p className="mt-1 text-xs leading-5 text-white/76">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-12 lg:px-20">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[1fr_410px]">
          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold">Campus Life</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <p className="mt-4 text-sm leading-6 text-[#31463f]">
                Experience a vibrant and supportive campus where faith and
                learning come together.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {campusLife.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-md border border-[#0b3327]/10 bg-white p-5 text-center shadow-[0_12px_30px_rgba(10,51,39,0.06)]"
                    >
                      <Icon
                        className="mx-auto size-8 text-[#0b4b39]"
                        strokeWidth={1.6}
                      />
                      <h3 className="mt-4 font-bold">{item.title}</h3>
                      <p className="mt-1 text-xs text-[#31463f]">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Student Organizations & Clubs
              </h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <p className="mt-4 text-sm leading-6 text-[#31463f]">
                Get involved and discover your passion through our student-led
                organizations and clubs.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">
                {organizations.map((org) => {
                  const Icon = org.icon;

                  return (
                    <article
                      key={org.title}
                      className="rounded-md border border-[#0b3327]/10 bg-white p-4 text-center shadow-[0_12px_30px_rgba(10,51,39,0.06)]"
                    >
                      <Icon
                        className="mx-auto size-7 text-[#0b4b39]"
                        strokeWidth={1.6}
                      />
                      <h3 className="mt-3 text-xs font-bold leading-4">
                        {org.title}
                      </h3>
                    </article>
                  );
                })}
              </div>

              <Button
                asChild
                className="mx-auto mt-7 flex h-11 w-fit rounded-md bg-[#003f2b] px-6 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
              >
                <Link href="/student-life">
                  View All Organizations
                  <ArrowRight className="size-4" strokeWidth={2.5} />
                </Link>
              </Button>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="text-xl font-bold">Upcoming Events</h2>
              <div className="mt-5 space-y-5">
                {events.map(([month, day, title, time, place]) => (
                  <article key={`${title}-${day}`} className="flex gap-4">
                    <div className="flex size-13 shrink-0 flex-col items-center justify-center rounded-md border border-[#0b3327]/15 bg-[#eef3f0] text-center">
                      <span className="text-[10px] font-bold leading-none text-[#0b4b39]">
                        {month}
                      </span>
                      <span className="mt-1 text-lg font-bold leading-none">
                        {day}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold leading-tight">
                        {title}
                      </h3>
                      <p className="mt-1 text-xs text-[#31463f]">{time}</p>
                      <p className="text-xs text-[#31463f]/70">{place}</p>
                    </div>
                  </article>
                ))}
              </div>
              <Link
                href="/calendar"
                className="mt-6 flex items-center gap-2 text-sm font-bold text-[#0b4b39] hover:text-[#c48a17]"
              >
                View Full Calendar
                <ArrowRight className="size-4" strokeWidth={2.5} />
              </Link>
            </section>

            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="text-xl font-bold">Student Services</h2>
              <div className="mt-5 space-y-4">
                {services.map((service) => {
                  const Icon = service.icon;

                  return (
                    <article key={service.title} className="flex gap-3">
                      <Icon
                        className="size-5 shrink-0 text-[#0b4b39]"
                        strokeWidth={1.6}
                      />
                      <div>
                        <h3 className="text-sm font-extrabold">
                          {service.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#31463f]">
                          {service.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
              <Link
                href="/student/dashboard"
                className="mt-6 flex items-center gap-2 text-sm font-bold text-[#c48a17] hover:text-[#0b4b39]"
              >
                Explore Services
                <ArrowRight className="size-4" strokeWidth={2.5} />
              </Link>
            </section>
          </aside>
        </div>
      </section>

      <section className="bg-[#fafcfb] px-6 py-12 lg:px-20">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold">Ministry & Service</h2>
          <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#31463f]">
            Serve, lead, and make an impact through various ministry and
            outreach programs.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ministryCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="overflow-hidden rounded-md border border-[#0b3327]/10 bg-white shadow-[0_12px_30px_rgba(10,51,39,0.06)]"
                >
                  <div className="relative h-40">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <Icon className="size-8 text-[#0b4b39]" strokeWidth={1.6} />
                    <h3 className="mt-3 font-bold">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#31463f]">
                      {card.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 pb-16 lg:px-20">
        <div className="container mx-auto overflow-hidden rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
          <Marquee
            pauseOnHover
            repeat={4}
            className="[--duration:28s] [--gap:1.5rem]"
          >
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="w-[320px] shrink-0 rounded-md border border-[#0b3327]/10 bg-white p-5 shadow-[0_10px_24px_rgba(10,51,39,0.06)]"
              >
                <Quote className="size-7 text-[#f5b739]" fill="currentColor" />
                <p className="mt-3 font-serif text-lg font-bold leading-7">
                  {item.quote}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#003f2b] text-sm font-bold text-[#f5b739]">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{item.name}</h3>
                    <p className="text-xs text-[#31463f]">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </Marquee>
        </div>
      </section>
    </main>
  );
};

export default Page;
