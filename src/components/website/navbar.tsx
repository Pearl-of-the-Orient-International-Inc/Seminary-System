"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 w-full bg-[#003a25] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 w-full container items-center justify-between gap-6 px-20"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90"
          aria-label="Pearl of The Orient Theological Seminary and Colleges home"
        >
          <Image
            src="/main/logo.png"
            alt=""
            width={60}
            height={60}
            priority
            className="size-14 shrink-0 rounded-full object-contain"
          />
          <span className="hidden text-sm font-semibold tracking-tight text-white sm:block">
            Pearl of The Orient <br /> Theological Seminary and Colleges
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-9 xl:flex">
          <div className="flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 text-[13px] font-bold text-white/95 transition-colors hover:text-[#f5b739]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-lg border-[#f5b739]/85 bg-transparent px-5 text-[13px] font-extrabold text-white shadow-none hover:bg-[#f5b739] hover:text-[#063b28]"
            >
              <Link href="/auth/access">Student Portal</Link>
            </Button>
            <Button
              asChild
              className="h-10 rounded-lg bg-[#f5b739] px-5 text-[13px] font-extrabold text-[#073722] shadow-none hover:bg-[#e7a82f]"
            >
              <Link href="/apply">Apply Now</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.push("/search")}
              aria-label="Search"
              className="size-10 rounded-full text-white hover:bg-white/10 hover:text-[#f5b739]"
            >
              <Search className="size-6" strokeWidth={2.5} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="size-10 rounded-full text-white hover:bg-white/10"
          >
            <Search className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="size-10 rounded-full text-white hover:bg-white/10"
          >
            <Menu className="size-6" />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
