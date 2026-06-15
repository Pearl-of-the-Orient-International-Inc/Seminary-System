import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Mail, Phone, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Introduction",
    body: "Pearl of The Orient Theological Seminary and Colleges (POTSC) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.",
  },
  {
    title: "Information We Collect",
    body: "We may collect personal information that you provide to us, such as your name, email address, phone number, student details, academic records, uploaded documents, payment information, and other details when you register, submit forms, or communicate with us.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to process admissions, manage student records, provide academic services, communicate with you, respond to inquiries, improve our website, maintain security, and comply with legal obligations.",
  },
  {
    title: "How We Share Your Information",
    body: "We do not sell your personal information. We may share information with trusted service providers, school personnel, regulatory bodies, or legal authorities when required to operate our services and protect the rights and safety of our community.",
  },
  {
    title: "Data Security",
    body: "We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    title: "Your Rights and Choices",
    body: "You may request access, correction, or deletion of your personal information, subject to applicable policies and legal requirements. You may also opt out of receiving non-essential communications from us at any time.",
  },
  {
    title: "Cookies and Tracking Technologies",
    body: "Our website may use cookies and similar technologies to improve your browsing experience, analyze site traffic, and understand how users interact with our content.",
  },
  {
    title: "Third-Party Links",
    body: "Our website may contain links to other websites. We are not responsible for the privacy practices or content of those websites. We encourage you to read their privacy policies.",
  },
  {
    title: "Children's Privacy",
    body: "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children without appropriate consent.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Updates will be posted on this page with the updated date.",
  },
  {
    title: "Contact Us",
    body: "If you have any questions or concerns about this Privacy Policy, please contact us through the contact details below.",
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-72 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/12188471/pexels-photo-12188471.jpeg"
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
            <span className="text-[#f5b739]">Privacy Policy</span>
          </nav>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Your privacy is important to us. This Privacy Policy explains how
            POTSC collects, uses, protects, and discloses your information.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-20">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <section className="rounded-md bg-[#f8faf9] p-5 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <h2 className="font-serif text-lg font-bold">On This Page</h2>
              <div className="mt-4 space-y-1">
                {sections.map((section, index) => (
                  <a
                    key={section.title}
                    href={`#section-${index + 1}`}
                    className={`block rounded-md px-3 py-2 text-sm font-semibold ${
                      index === 0
                        ? "bg-[#003f2b] text-white"
                        : "text-[#31463f] hover:bg-white hover:text-[#0b4b39]"
                    }`}
                  >
                    {index + 1}. {section.title}
                  </a>
                ))}
              </div>
            </section>
          </aside>

          <article className="rounded-md border border-[#0b3327]/10 bg-white p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] sm:p-8">
            <p className="text-sm text-[#31463f]">Last Updated: May 10, 2024</p>
            <div className="mt-6 space-y-7">
              {sections.map((section, index) => (
                <section key={section.title} id={`section-${index + 1}`}>
                  <h2 className="font-serif text-xl font-bold">
                    {index + 1}. {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#31463f]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-8 grid gap-3 border-t border-[#0b3327]/10 pt-5 text-sm text-[#31463f] md:grid-cols-3">
              <p className="flex gap-2">
                <MapPin className="size-4 shrink-0 text-[#0b4b39]" />
                Purok 1, Brgy. San Isidro, Tanauan City, Batangas, Philippines
                4232
              </p>
              <p className="flex gap-2">
                <Phone className="size-4 shrink-0 text-[#0b4b39]" />
                (043) 123-4567
              </p>
              <p className="flex gap-2">
                <Mail className="size-4 shrink-0 text-[#0b4b39]" />
                info@pearloftheorient.edu.ph
              </p>
            </div>
          </article>
        </div>

        <div className="container mx-auto mt-8 rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#003f2b] text-[#f5b739]">
                <ShieldCheck className="size-7" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">
                  Your Privacy Matters
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#31463f]">
                  We are committed to safeguarding your personal information and
                  being transparent about how it is used.
                </p>
              </div>
            </div>
            <Button
              asChild
              className="h-10 rounded-md bg-[#003f2b] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#07533a]"
            >
              <Link href="/contact">
                Go to Contact Us
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
