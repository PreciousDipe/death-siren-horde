import { Swords, GraduationCap, Trophy, Brain, Users } from "lucide-react";

const items = [
  { Icon: Swords, title: "Weekly Scrims", desc: "Regular scrims to make you better and competitive." },
  { Icon: GraduationCap, title: "Learn From Pros", desc: "Learn from the best and improve your game play style." },
  { Icon: Trophy, title: "Tournaments", desc: "Play real tournaments and represent Darkstar in international competitions." },
  { Icon: Brain, title: "Strategies", desc: "Learn drafting and plan games built to win every match." },
  { Icon: Users, title: "Strong Community", desc: "A small dedicated squad growing together and shares wins together." },
];

export function WhyJoin() {
  return (
    <section className="bg-[#0c0c0c] py-20 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ THE EDGE</span>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">
            WHY JOIN <span className="text-gradient-brand">DARKSTAR?</span>
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
