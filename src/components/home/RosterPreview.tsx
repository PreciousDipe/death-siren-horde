import { Link } from "@tanstack/react-router";
import { players } from "@/data/players";
import { PlayerCard } from "@/components/roster/PlayerCard";
import { ArrowRight } from "lucide-react";

export function RosterPreview() {
  const five = players.slice(0, 5);
  return (
    <section className="bg-[#0c0c0c] py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">
              / SQUAD
            </span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">
              OUR ROSTER
            </h2>
          </div>
          <Link
            to="/roster"
            className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-[#00B8FF] hover:underline underline-offset-4"
          >
            View all players <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-flow-col auto-cols-[80%] sm:auto-cols-[45%] md:grid-flow-row md:grid-cols-5 md:auto-cols-auto gap-4 overflow-x-auto md:overflow-visible snap-x pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {five.map((p) => (
            <div key={p.ign} className="snap-start">
              <PlayerCard player={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
