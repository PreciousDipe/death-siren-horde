import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { useTournamentMeta } from "@/lib/hooks/use-team-data";
import { Skeleton } from "@/components/ui/skeleton";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
}

export function CountdownCard() {
  const { data: meta, isLoading, error } = useTournamentMeta();
  const target = meta ? new Date(meta.target_date).getTime() : 0;
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    if (!target) return;
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (isLoading) {
    return <Skeleton className="h-56 w-full rounded-2xl" />;
  }
  if (error || !meta) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#181818] p-8 text-center text-[#A0A0A0]">
        No upcoming tournament right now.
      </div>
    );
  }

  const boxes: [string, number][] = [
    ["DAYS", t.days],
    ["HOURS", t.hours],
    ["MINS", t.mins],
    ["SECS", t.secs],
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#181818] p-8 md:p-10">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,184,255,0.18),transparent_60%)]" />
      <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-[#8B3DFF]/15 px-2.5 py-1 text-[11px] font-bold tracking-[0.18em] text-[#8B3DFF] ring-1 ring-[#8B3DFF]/40">
              {meta.tag}
            </span>
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#A0A0A0]">NEXT TOURNAMENT</span>
          </div>
          <h3 className="mt-3 font-display text-3xl md:text-4xl font-extrabold tracking-wider">{meta.name}</h3>
          <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3 max-w-md">
            {boxes.map(([label, val]) => (
              <div key={label} className="rounded-lg border border-[#00B8FF]/40 bg-[#0c0c0c] p-3 text-center">
                <div className="font-display text-2xl md:text-3xl font-extrabold text-[#00B8FF] tabular-nums">
                  {String(val).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] font-bold tracking-[0.18em] text-[#A0A0A0]">{label}</div>
              </div>
            ))}
          </div>
          <Link
            to="/tournaments"
            className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-[#00B8FF] px-6 font-display text-xs font-bold uppercase tracking-[0.18em] text-[#080808] hover:brightness-110"
          >
            View Details
          </Link>
        </div>
        <img
          src={logo}
          alt=""
          width={180}
          height={180}
          className="hidden md:block h-40 w-40 lg:h-52 lg:w-52 object-contain opacity-90 drop-shadow-[0_0_30px_rgba(139,61,255,0.5)]"
          loading="lazy"
        />
      </div>
    </div>
  );
}
