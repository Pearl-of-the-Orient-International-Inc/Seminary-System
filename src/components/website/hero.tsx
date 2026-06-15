"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import StatsBand from "@/components/website/stats-band";

const Hero = () => {
  return (
    <section className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-[#082f25] text-white">
      <Image
        src="/main/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,33,30,0.95)_0%,rgba(0,48,35,0.84)_38%,rgba(0,52,36,0.44)_70%,rgba(0,45,33,0.6)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_26%,rgba(245,183,57,0.18),transparent_22%),linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,31,25,0.82)_100%)]" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full container flex-col px-6 pb-20 pt-12 sm:pb-24 lg:px-20 lg:pt-25">
        <div className="grid flex-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-[3.7rem]">
              Pearl of The Orient
              <br />
              Theological Seminary
              <br />
              and Colleges
            </h1>

            <div className="mt-6 h-1 w-24 bg-[#f5b739]" />

            <p className="mt-6 max-w-xl text-base text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.65)] sm:text-lg">
              Equipping Faithful Leaders for Ministry,
              <br className="hidden sm:block" />
              Chaplaincy, Education, and Community Service.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-12 rounded-lg bg-[#f5b739] px-6 text-sm font-extrabold text-[#073722] shadow-none hover:bg-[#e7a82f]"
              >
                <Link href="/enroll">
                  Enroll Now
                  <ArrowRight className="size-4" strokeWidth={2.5} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-lg border-[#f5b739] bg-[#05291f]/50 px-6 text-sm font-extrabold text-white shadow-none hover:bg-[#f5b739] hover:text-[#073722]"
              >
                <Link href="/academics">Explore Programs</Link>
              </Button>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <Image
              src="/main/badge.png"
              alt="Pearl of The Orient Theological Seminary and Colleges seal"
              width={330}
              height={330}
              priority
              className="w-70 max-w-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.42)]"
            />
          </div>
        </div>

        <StatsBand className="relative z-10 mt-10 lg:mt-20" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-0 h-180 bg-white"
        style={{
          clipPath:
            "polygon(0 100%, 0 75%, 5% 80%, 95% 80%, 100% 75%, 100% 100%)",
        }}
      />
    </section>
  );
};

export default Hero;
