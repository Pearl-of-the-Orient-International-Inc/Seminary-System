import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  MessageSquareMore,
  Phone,
  Send,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const contactDetails = [
  {
    title: "Visit Us",
    lines: [
      "Purok 1, Brgy. San Isidro",
      "Tanauan City, Batangas",
      "Philippines 4232",
    ],
    icon: MapPin,
  },
  {
    title: "Call Us",
    lines: ["(043) 123-4567", "Mobile: 0917 123 4567"],
    icon: Phone,
  },
  {
    title: "Email Us",
    lines: ["info@pearloftheorient.edu.ph", "admissions@pearloftheorient.edu.ph"],
    icon: Mail,
  },
  {
    title: "Office Hours",
    lines: ["Monday - Friday: 8:00 AM - 5:00 PM", "Saturday: 8:00 AM - 12:00 PM", "Sunday: Closed"],
    icon: Clock,
  },
];

const quickContacts: {
  title: string;
  description: string;
  phone: string;
  email: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Admission",
    description: "For application and admission requirements.",
    phone: "(043) 123-4567",
    email: "www.seminar.pearlchaplaincy.org/admissions",
    icon: Building2,
  },
  {
    title: "Library",
    description: "For library resources and research assistance.",
    phone: "(043) 123-4570",
    email: "www.seminar.pearlchaplaincy.org/resources",
    icon: BookOpen,
  },
];

const Page = () => {
  return (
    <main className="bg-white text-[#0b3327]">
      <section className="relative isolate min-h-72 overflow-hidden bg-[#082f25] text-white">
        <Image
          src="https://images.pexels.com/photos/7821095/pexels-photo-7821095.jpeg"
          alt="Pearl of The Orient Theological Seminary and Colleges campus"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,42,35,0.98)_0%,rgba(0,52,39,0.86)_44%,rgba(0,52,39,0.32)_78%,rgba(0,52,39,0.18)_100%)]" />

        <div className="container mx-auto px-6 py-14 lg:px-20">
          <nav className="flex items-center gap-2 text-xs font-semibold text-white/76">
            <Link href="/" className="hover:text-[#f5b739]">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#f5b739]">Contact Us</span>
          </nav>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Contact Us
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#f5b739]" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/88 sm:text-base">
            We&apos;re here to help! Get in touch with us for inquiries,
            assistance, or feedback.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-20">
        <div className="container mx-auto">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr]">
            <section>
              <h2 className="text-2xl font-bold">Get in Touch</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />

              <div className="mt-7 space-y-6">
                {contactDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.title} className="flex gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#003f2b] text-white">
                        <Icon className="size-5" strokeWidth={1.7} />
                      </div>
                      <div>
                        <h3 className="font-bold">{item.title}</h3>
                        <div className="mt-2 space-y-1 text-sm leading-5 text-[#31463f]">
                          {item.lines.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-8">
                <h3 className="font-bold">Follow Us</h3>
                <div className="mt-3 flex gap-3">
                  {[
                    { label: "Facebook", icon: FaFacebook },
                    { label: "Linked", icon: FaLinkedin },
                    { label: "Email", icon: SiGmail },
                  ].map((social) => {
                    const Icon = social.icon;

                    return (
                      <Link
                        key={social.label}
                        href="/contact"
                        aria-label={social.label}
                        className="flex size-9 items-center justify-center rounded-full bg-[#003f2b] text-white transition-colors hover:bg-[#f5b739] hover:text-[#073722]"
                      >
                        <Icon className="size-4" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="border-[#0b3327]/10 lg:border-l lg:pl-10">
              <h2 className="text-2xl font-bold">Send Us a Message</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <p className="mt-4 text-sm leading-6 text-[#31463f]">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>

              <form className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex h-11 items-center gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                    <UserRound className="size-4 text-[#0b4b39]" />
                    First Name *
                  </label>
                  <label className="flex h-11 items-center gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                    <UserRound className="size-4 text-[#0b4b39]" />
                    Last Name *
                  </label>
                </div>
                <label className="flex h-11 items-center gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                  <Mail className="size-4 text-[#0b4b39]" />
                  Email Address *
                </label>
                <label className="flex h-11 items-center gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 text-sm text-[#31463f]/65">
                  <MessageSquare className="size-4 text-[#0b4b39]" />
                  Subject *
                </label>
                <label className="flex min-h-36 items-start gap-3 rounded-md border border-[#0b3327]/10 bg-white px-4 py-3 text-sm text-[#31463f]/65">
                  <MessageSquare className="mt-1 size-4 text-[#0b4b39]" />
                  Message *
                </label>
                <label className="flex items-center gap-3 text-xs text-[#31463f]">
                  <span className="size-4 rounded border border-[#0b3327]/20 bg-white" />
                  I agree to the processing of my data in accordance with the
                  Privacy Policy.
                </label>
                <Button className="h-11 w-full rounded-md bg-[#003f2b] text-sm font-semibold text-white shadow-none hover:bg-[#07533a]">
                  <Send className="size-4" strokeWidth={1.7} />
                  Send My Message
                </Button>
              </form>
            </section>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <section>
              <h2 className="text-2xl font-bold">Quick Contacts</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {quickContacts.map((contact) => {
                  const Icon = contact.icon;

                  return (
                    <article
                      key={contact.title}
                      className="rounded-md border border-[#0b3327]/10 bg-white p-5 text-center shadow-[0_12px_30px_rgba(10,51,39,0.06)]"
                    >
                      <Icon
                        className="mx-auto size-9 text-[#0b4b39]"
                        strokeWidth={1.6}
                      />
                      <h3 className="mt-4 text-sm font-extrabold">
                        {contact.title}
                      </h3>
                      <p className="mt-2 text-xs text-[#31463f]">
                        {contact.description}
                      </p>
                      <p className="mt-3 text-xs font-bold text-[#0b4b39]">
                        {contact.phone}
                      </p>
                      <p className="mt-1 break-all text-xs text-[#31463f]">
                        {contact.email}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold">Our Location</h2>
              <div className="mt-3 h-1 w-16 bg-[#f5b739]" />
              <div className="mt-6 overflow-hidden rounded-md border border-[#0b3327]/10 bg-[#eef3f0] shadow-[0_12px_30px_rgba(10,51,39,0.06)]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.8284810073656!2d120.99307067541388!3d14.321393586132553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d71ac0ec20bd%3A0x6d4c26f82be599db!2sPearl%20of%20the%20Orient%20International%20Leaders%20%26%20Educators!5e0!3m2!1sen!2sph!4v1780632974725!5m2!1sen!2sph"
                  title="Pearl of The Orient International Leaders and Educators map"
                  width="600"
                  height="450"
                  className="h-64 w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <div className="flex gap-5">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#003f2b] text-[#f5b739]">
                  <HelpCircle className="size-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    Need Immediate Assistance?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#31463f]">
                    Visit our Help Center for answers to frequently asked
                    questions or reach out to us through our support channels.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 h-10 rounded-md bg-white px-5 text-sm font-bold text-[#0b4b39] shadow-none"
                  >
                    <Link href="/resources">
                      Go to Help Center
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>

            <section className="rounded-md bg-[#f8faf9] p-6 shadow-[0_12px_30px_rgba(10,51,39,0.06)] ring-1 ring-[#0b3327]/5">
              <div className="flex gap-5">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#003f2b] text-[#f5b739]">
                  <MessageSquareMore className="size-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">We Value Your Feedback</h2>
                  <p className="mt-2 text-sm leading-6 text-[#31463f]">
                    Your feedback helps us improve our services and support your
                    journey. Please share your thoughts, suggestions, or any issues you may have encountered.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 h-10 rounded-md bg-white px-5 text-sm font-bold text-[#0b4b39] shadow-none"
                  >
                    <Link href="/feedback">
                      Provide Feedback
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
