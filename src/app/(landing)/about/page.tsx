import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Goal,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

import StatsBand from "@/components/website/stats-band";

type TextPillar = {
  title: string;
  icon: LucideIcon;
  body: string;
};

const pillars: TextPillar[] = [
  {
    title: "Mission",
    icon: Goal,
    body: "Pursuit of excellence, loving God, creativity and appreciation of nature, arts and technology. Emphasizes spiritual formation, mastery of biblical content and interpretation, cultivation of biblical worldview, and ministry skill development.",
  },
  {
    title: "Vision",
    icon: Eye,
    body: "We envision a certified international seminary with excellent leaders and quality education, recognized and accepted by students and graduates as well as busy thinking people from private and public entities all over the world, bridging shores globally to deliver holistic services and quality education.",
  },
  {
    title: "Philosophy",
    icon: Lightbulb,
    body: "Pearl of The Orient Theological Seminary & Colleges Inc. believes in the vagueness of individual and it must be rested as a creation of God. We believe the quality of education is an instrument for liberating from the bondage of poverty. Quality of education must be indiscriminately accessible to all in order to realize the ultimate aim of existence.",
  },
];

const leaders = [
  {
    name: "Rev. Dr. Samuel P. Reyes",
    role: "President",
    initials: "SR",
  },
  {
    name: "Dr. Maria Lourdes Tan",
    role: "Dean of Academics",
    initials: "MT",
  },
  {
    name: "Rev. Dr. Daniel C. Mercado",
    role: "Dean of Pastoral Ministry",
    initials: "DM",
  },
  {
    name: "Dr. Rachel Ann Baloy",
    role: "Dean of Counseling & Chaplaincy",
    initials: "RB",
  },
  {
    name: "Rev. Capt. Elmer Dela Cruz",
    role: "Director, Chaplaincy Programs",
    initials: "EC",
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-88 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="/main/about.jpg"
          alt="Pearl of The Orient Theological Seminary and Colleges campus"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.96)_0%,rgba(0,52,39,0.82)_42%,rgba(0,52,39,0.3)_78%,rgba(0,52,39,0.16)_100%)]" />

        <div className="container mx-auto px-6 py-16 lg:px-20">
          <nav className="flex items-center gap-2 text-xs font-semibold text-white/76">
            <Link href="/" className="hover:text-[#f5b739]">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#f5b739]">About</span>
          </nav>

          <h1 className="mt-5 max-w-2xl font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            About Pearl of The Orient
            <br />
            Theological Seminary
            <br />
            and Colleges
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-md text-sm leading-6 text-white/88 sm:text-base">
            A Christ-centered academic community committed to equipping
            faithful leaders for ministry, chaplaincy, education, and
            compassionate service.
          </p>
        </div>
      </section>

      <section className="border-b border-[#0b3327]/8 bg-white px-6 py-9 lg:px-20">
        <div className="container mx-auto grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.title}
                className="border-[#0b3327]/10 md:border-l md:pl-9 md:first:border-l-0 md:first:pl-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#003f2b] text-[#f5b739]">
                    <Icon className="size-6" strokeWidth={1.7} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{pillar.title}</h2>
                    <div className="mt-2 h-0.5 w-12 bg-[#f5b739]" />
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-[#31463f]">
                  {pillar.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#fafcfb] px-6 py-12 lg:px-20">
        <div className="container mx-auto">
          <div className="grid items-center gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="mx-auto">
              <Image
                src="/main/logo.png"
                alt="Pearl of The Orient Theological Seminary and Colleges seal"
                width={230}
                height={230}
                className="drop-shadow-[0_14px_26px_rgba(10,51,39,0.18)]"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Our Story</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <div className="mt-6 space-y-4 text-sm leading-7 text-[#31463f]">
                <p>
                  Pearl of The Orient Theological Seminary and Colleges (POTSC)
                  was founded with a passion to raise and equip God-called
                  leaders who will faithfully serve the Church and society.
                  Grounded on the authority of Scripture, we provide a holistic
                  Christian education that integrates theology, leadership, and
                  practical ministry.
                </p>
                <p>
                  Over the years, POTSC has trained thousands of individuals who
                  are now serving as pastors, missionaries, educators, and
                  chaplains in the Philippines and around the world.
                </p>
                <p>
                  We continue to uphold our commitment to academic excellence,
                  spiritual growth, and relevant training for the challenges of
                  today&apos;s world.
                </p>
              </div>
            </div>
          </div>

          <StatsBand
            className="mt-10"
            itemClassName="min-h-24"
            iconClassName="size-8"
            valueClassName="text-2xl drop-shadow-none"
            labelClassName="text-xs text-white/88"
          />
        </div>
      </section>

      <section className="bg-white px-6 pb-16 pt-6 lg:px-20">
        <div className="container mx-auto">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold">Our Leadership</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
            </div>
            <Link
              href="/faculty"
              className="hidden items-center gap-2 text-sm font-bold text-[#0b4b39] hover:text-[#c48a17] sm:flex"
            >
              View All Leadership
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {leaders.map((leader) => (
              <article
                key={leader.name}
                className="overflow-hidden rounded-md border border-[#0b3327]/10 bg-white shadow-[0_10px_26px_rgba(10,51,39,0.08)]"
              >
                <div className="flex h-36 items-end justify-center bg-[linear-gradient(135deg,#eee8dd,#ffffff_48%,#d6cdc0)] px-6 pt-5">
                  <div className="flex size-28 items-center justify-center rounded-t-full bg-[linear-gradient(160deg,#123d31,#0b4b39)] text-3xl font-bold text-[#f5b739] shadow-[0_12px_28px_rgba(10,51,39,0.22)]">
                    {leader.initials}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-extrabold leading-tight">
                    {leader.name}
                  </h3>
                  <p className="mt-2 text-xs font-bold leading-5 text-[#273f37]">
                    {leader.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
