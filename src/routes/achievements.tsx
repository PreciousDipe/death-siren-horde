import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { Trophy, Medal, Star } from "lucide-react";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — DeathSirens Esports" },
      { name: "description", content: "Trophies, titles and milestones of the DeathSirens Mobile Legends roster." },
      { property: "og:title", content: "DeathSirens Achievements" },
      { property: "og:description", content: "Our trophy cabinet — championships, finals and notable runs." },
    ],
  }),
  component: AchievementsPage,
});

const trophies = [
  { year: "2025", title: "MPL Nigeria — Spring Split Champions", Icon: Trophy },
  { year: "2024", title: "West African Invitational — Champions", Icon: Trophy },
  { year: "2024", title: "MSC Qualifiers — 2nd Place", Icon: Medal },
  { year: "2024", title: "Lagos Open — Champions", Icon: Trophy },
  { year: "2023", title: "MPL Nigeria — Fall Split Runner-Up", Icon: Medal },
  { year: "2023", title: "Rookie of the Year — ZEPHYR", Icon: Star },
];

function AchievementsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-8">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ TROPHY CABINET</span>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-extrabold">ACHIEVEMENTS</h1>
        <p className="mt-3 italic font-semibold text-[#A0A0A0]">Every title earned. Every banner raised.</p>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="grid gap-4 md:grid-cols-2">
          {trophies.map(({ year, title, Icon }) => (
            <div key={title} className="rounded-xl border border-white/5 bg-[#181818] p-5 flex items-center gap-4 hover-glow-brand">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#8B3DFF]/15 text-[#8B3DFF] ring-1 ring-[#8B3DFF]/40">
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold tracking-[0.2em] text-[#00B8FF]">{year}</div>
                <div className="font-display text-base font-bold tracking-wider">{title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
