import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";

import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

import { Button } from "@/components/ui/button";

const footerColumns = [
  {
    title: "Academics",
    links: [
      { label: "Programs & Courses", href: "/academics" },
      { label: "Academic Calendar", href: "/calendar" },
      { label: "Faculty & Staff", href: "/faculty" },
      { label: "Library", href: "/library" },
      { label: "Accreditation", href: "/accreditation" },
    ],
  },
  {
    title: "Admissions",
    links: [
      { label: "Admission Process", href: "/admissions" },
      { label: "Requirements", href: "/admissions/requirements" },
      { label: "Tuition & Fees", href: "/admissions/tuition-fees" },
      { label: "Scholarships", href: "/admissions/scholarships" },
      { label: "Apply Now", href: "/admissions" },
    ],
  },
  {
    title: "Student Portal",
    links: [
      { label: "LMS Login", href: "/student/dashboard" },
      { label: "Grades & Records", href: "/student/dashboard" },
      { label: "Attendance", href: "/student/dashboard" },
      { label: "Student Services", href: "/student/dashboard" },
      { label: "Forms & Requests", href: "/student/dashboard" },
    ],
  },
  {
    title: "Faculty Portal",
    links: [
      { label: "Instructor Login", href: "/instructor/dashboard" },
      { label: "Class Management", href: "/instructor/dashboard" },
      { label: "Grade Encoding", href: "/instructor/dashboard" },
      { label: "Reports", href: "/instructor/dashboard" },
      { label: "Resources", href: "/resources" },
    ],
  },
];

const contactItems: {
  label: string;
  href?: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Purok 1, Brgy. San Isidro\nTanauan City, Batangas\nPhilippines 4232",
    icon: MapPin,
  },
  {
    label: "(043) 123-4567",
    href: "tel:+63431234567",
    icon: Phone,
  },
  {
    label: "info@pearloftheorient.edu.ph",
    href: "mailto:info@pearloftheorient.edu.ph",
    icon: Mail,
  },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebook },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
  { label: "Email", href: "mailto:info@pearloftheorient.edu.ph", icon: SiGmail },
];

const Footer = () => {
  return (
    <footer className="bg-[#003f2b] px-6 py-6 text-white lg:px-20">
      <div className="container mx-auto">
        <div className="grid gap-9 lg:grid-cols-[1.25fr_repeat(5,1fr)]">
          <div className="lg:pr-8">
            <h2 className="text-lg font-extrabold">About POTSC</h2>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/78">
              Pearl of The Orient Theological Seminary and Colleges is
              committed to equipping faithful leaders for ministry, chaplaincy,
              education, and community service.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 h-9 rounded-md border-[#f5b739]/70 bg-transparent px-4 text-xs font-semibold text-white shadow-none hover:bg-[#f5b739] hover:text-[#073722]"
            >
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>

          {footerColumns.map((column) => (
            <div
              key={column.title}
              className="border-white/16 lg:border-l lg:pl-9"
            >
              <h2 className="text-lg font-extrabold">{column.title}</h2>
              <ul className="mt-5 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/78 underline-offset-4 transition-colors hover:text-[#f5b739] hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="border-white/16 lg:border-l lg:pl-9">
            <h2 className="text-lg font-extrabold">Contact Us</h2>
            <div className="mt-5 space-y-3.5">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <Icon className="mt-0.5 size-4 shrink-0 text-white" />
                    <span className="whitespace-pre-line text-sm leading-5 text-white/78">
                      {item.label}
                    </span>
                  </>
                );

                return item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex gap-3 transition-colors hover:[&_span]:text-[#f5b739]"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={item.label} className="flex gap-3">
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="flex size-9 items-center justify-center rounded-full bg-white text-[#003f2b] transition-colors hover:bg-[#f5b739]"
                  >
                    <Icon className="size-5" fill="currentColor" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 text-sm text-white/76 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Pearl of The Orient Theological Seminary and Colleges. All
            Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy"
              className="underline-offset-4 hover:text-[#f5b739] hover:underline"
            >
              Privacy Policy
            </Link>
            <span className="text-white/50">|</span>
            <Link
              href="/terms-of-use"
              className="underline-offset-4 hover:text-[#f5b739] hover:underline"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
