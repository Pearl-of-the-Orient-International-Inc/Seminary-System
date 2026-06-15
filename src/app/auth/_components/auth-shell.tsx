import Image from "next/image";

export const AuthShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen relative isolate flex items-center justify-center bg-white text-[#0b3327]">
      <Image
        src="/main/hero.jpg"
        alt=""
        fill
        sizes="calc(100vw - 450px)"
        className="absolute inset-0 -z-20 object-cover opacity-[0.080]"
      />
      <div className="w-full max-w-2xl">{children}</div>
    </main>
  );
};
