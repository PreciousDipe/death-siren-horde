import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CountdownCard } from "@/components/tournaments/CountdownCard";
import { ScheduleTable } from "@/components/tournaments/ScheduleTable";
import { StandingsTable } from "@/components/tournaments/StandingsTable";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "Tournaments — DeathSirens Esports" },
      { name: "description", content: "Upcoming matches, schedule and current MPL Nigeria standings for the DeathSirens Mobile Legends squad." },
      { property: "og:title", content: "DeathSirens Tournaments" },
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
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-extrabold">TOURNAMENTS</h1>
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
