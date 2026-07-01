import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { PlayerCard } from "@/components/roster/PlayerCard";
import { PlayerModal } from "@/components/roster/PlayerModal";
import { ROLES, type Role, type Player } from "@/data/players";
import { usePlayers } from "@/lib/hooks/use-team-data";
import { Skeleton } from "@/components/ui/skeleton";

type Filter = "ALL" | Role;
const tabs: Filter[] = ["ALL", ...ROLES];

export const Route = createFileRoute("/darkstar")({
  head: () => ({
    meta: [
      { title: "Our Players — Darkstar Squad" },
      { name: "description", content: "Meet the Darkstar squad players." },
      { property: "og:title", content: "Darkstar Squad" },
      { property: "og:description", content: "The Darkstar main squad roster." },
    ],
  }),
  component: DarkstarPage,
});

function DarkstarPage() {
  const [active, setActive] = useState<Filter>("ALL");
  const [selected, setSelected] = useState<Player | null>(null);
  const { data: players = [], isLoading, error } = usePlayers();

  const filtered = useMemo(() => {
    const squadPlayers = players.filter((p) => p.squad === "DARKSTAR");
    return active === "ALL" ? squadPlayers : squadPlayers.filter((p) => p.role === active);
  }, [active, players]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-8">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ THE SQUAD</span>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-extrabold">OUR PLAYERS</h1>
        <p className="mt-3 text-base md:text-lg text-[#A0A0A0] italic font-semibold">
          Team Members of Darkstar
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap gap-2 border-y border-white/5 py-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`h-11 px-4 rounded-md font-display text-xs font-bold uppercase tracking-[0.18em] transition ${
                active === t
                  ? "bg-[#00B8FF] text-[#080808] shadow-[0_0_18px_rgba(0,184,255,0.5)]"
                  : "bg-[#181818] text-white/80 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        {error ? (
          <p className="text-center text-[#FF3B3B] py-12">Couldn't load players. Please refresh.</p>
        ) : isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PlayerCard key={p.ign} player={p} onClick={setSelected} />
              ))}
            </div>
            <PlayerModal player={selected} onClose={() => setSelected(null)} />
            {filtered.length === 0 && (
              <p className="text-center text-[#A0A0A0] py-12">No players in this role yet.</p>
            )}
          </>
        )}
      </section>

      <section className="relative mt-10 overflow-hidden border-y border-white/5 bg-[#0c0c0c] py-20">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,rgba(139,61,255,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold">
            THINK YOU HAVE <span className="text-gradient-brand">WHAT IT TAKES?</span>
          </h2>
          <p className="mt-4 text-[#A0A0A0]">Join our Team and start your journey to become a champion.</p>
          <Link
            to="/contact"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-[#8B3DFF] px-8 font-display text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(139,61,255,0.5)]"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
