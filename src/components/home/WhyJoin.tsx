import { Briefcase, GraduationCap, Globe2, Megaphone, Users } from "lucide-react";

const items = [
  { Icon: Briefcase, title: "Professional Environment", desc: "Bootcamp facility, scrim partners, analyst-driven prep." },
  { Icon: GraduationCap, title: "Experienced Coaches", desc: "Tier-1 coaching staff with international scene experience." },
  { Icon: Globe2, title: "Global Exposure", desc: "Compete in MPL, MSC, and international invitationals." },
  { Icon: Megaphone, title: "Grow Your Brand", desc: "Content, branding, and media support for every player." },
  { Icon: Users, title: "Strong Community", desc: "A fanbase that travels and a culture that wins together." },
];

export function WhyJoin() {
  return (
    <section className="bg-[#0c0c0c] py-20 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ THE EDGE</span>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">
            WHY JOIN <span className="text-gradient-brand">DEATHSIRENS?</span>
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(({ Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center group">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#00B8FF]/10 text-[#00B8FF] ring-1 ring-[#00B8FF]/30 transition group-hover:shadow-[0_0_24px_rgba(0,184,255,0.45)]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-sm font-bold tracking-wider">{title}</h3>
              <p className="mt-2 text-xs text-[#A0A0A0] leading-relaxed max-w-[14rem]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
