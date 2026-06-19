import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CountdownCard } from "@/components/tournaments/CountdownCard";
import { ScheduleTable } from "@/components/tournaments/ScheduleTable";
import { StandingsTable } from "@/components/tournaments/StandingsTable";
import darkstarLogo from "@/assets/logo.png";
import deathsirenLogo from "@/assets/deathsiren-logo.jpg.asset.json";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "Tournaments — Darkstar Esports" },
      { name: "description", content: "Upcoming matches, schedule and current MPL Nigeria standings for the Darkstar Mobile Legends squad." },
      { property: "og:title", content: "Darkstar Tournaments" },
      { property: "og:description", content: "Upcoming matches, schedule and current standings." },
    ],
  }),
  component: TournamentsPage,
});

function TournamentsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ COMPETE</span>
        <div className="mt-2 flex items-center gap-4 flex-wrap">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold">TOURNAMENTS</h1>
          <div className="flex items-center gap-3 ml-auto">
            <img
              src={darkstarLogo}
              alt="Darkstar logo"
              className="h-14 w-14 md:h-16 md:w-16 object-contain drop-shadow-[0_0_18px_rgba(0,184,255,0.6)]"
            />
            <span className="text-[#A0A0A0] font-display font-bold text-xl">×</span>
            <img
              src={deathsirenLogo.url}
              alt="Deathsiren logo"
              className="h-14 w-14 md:h-16 md:w-16 object-contain drop-shadow-[0_0_18px_rgba(139,61,255,0.6)] rounded-lg"
            />
          </div>
        </div>
        <p className="mt-3 text-sm text-[#A0A0A0]">
          Tracking the schedule, standings and live matches across both Darkstar and Deathsiren squads.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 mt-10">
        <CountdownCard />
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 mt-16 grid gap-12 lg:grid-cols-2">
        <ScheduleTable />
        <StandingsTable />
      </section>

      <div className="h-16" />
    </SiteShell>
  );
}

