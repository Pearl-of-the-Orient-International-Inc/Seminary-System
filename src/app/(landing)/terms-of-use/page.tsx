import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Mail, Phone, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using the website and services of Pearl of The Orient Theological Seminary and Colleges (POTSC), you agree to be bound by these Terms of Use.",
  },
  {
    title: "Use of the Website",
    body: "You agree to use our website and services only for lawful purposes and in accordance with these Terms. You must not misuse the website, attempt unauthorized access, or interfere with its proper operation.",
  },
  {
    title: "User Accounts",
    body: "Some features may require an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.",
  },
  {
    title: "Intellectual Property",
    body: "All content on this website, including text, graphics, logos, images, and software, is the property of POTSC or its content suppliers and is protected by applicable intellectual property laws.",
  },
  {
    title: "User Conduct",
    body: "You agree not to use the website to transmit unlawful, harmful, offensive, or misleading content, or to engage in activity that may interfere with the website's performance or security.",
  },
  {
    title: "Third-Party Links",
    body: "Our website may contain links to third-party websites. These links are provided for convenience only. We are not responsible for the content or practices of those external sites.",
  },
  {
    title: "Disclaimer of Warranties",
    body: "The website and its content are provided as is and as available without warranties of any kind, either express or implied.",
  },
  {
    title: "Limitation of Liability",
    body: "POTSC shall not be liable for indirect, incidental, consequential, or special damages arising out of or in connection with your use of the website.",
  },
  {
    title: "Indemnification",
    body: "You agree to indemnify and hold POTSC harmless from any claims, damages, losses, and expenses arising from your use of the website or violation of these Terms.",
  },
  {
    title: "Termination",
    body: "We reserve the right to terminate or restrict your access to the website or services if you violate these Terms or engage in conduct that we believe is harmful to other users or us.",
  },
  {
    title: "Governing Law",
    body: "These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines.",
  },
  {
    title: "Changes to These Terms",
    body: "We may update these Terms from time to time. Changes will be posted on this page with the updated date.",
  },
  {
    title: "Contact Us",
    body: "If you have any questions about these Terms of Use, please contact us through the contact details below.",
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-72 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/12153576/pexels-photo-12153576.jpeg"
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
            <span className="text-[#f5b739]">Terms of Use</span>
          </nav>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Terms of Use
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            Please read these Terms of Use carefully before accessing or using
            the POTSC website and online services.
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
                  Responsible Use, Stronger Community
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#31463f]">
                  By using our website, you help us maintain a safe, respectful,
                  and trustworthy online environment for everyone.
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
