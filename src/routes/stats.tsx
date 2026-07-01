import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { useEffect, useMemo, useState } from "react";
import { Crown, Swords, Trophy, Coins, Shield, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Player Stats — Darkstar Esports" },
      { name: "description", content: "Track Darkstar player match performance, MVP counts, hero pools and key MLBB stats." },
      { property: "og:title", content: "Darkstar Player Stats" },
      { property: "og:description", content: "MLBB match tracker for the Darkstar and Deathsiren squads." },
    ],
  }),
  component: StatsPage,
});

type Profile = { id: string; display_name: string | null; ign: string | null; photo_url: string | null; role_in_team: string | null };
type Match = {
  id: string; player_id: string; match_date: string; result: "WIN" | "LOSE";
  hero: string; role: string;
  kills: number; deaths: number; assists: number;
  gold: number; hero_damage: number; turret_damage: number; damage_taken: number;
  teamfight_participation: number; is_mvp: boolean;
};

function StatsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { getSignedUrl } = await import("@/lib/storage");
      const [{ data: p }, { data: m }] = await Promise.all([
        supabase.from("profiles").select("id, display_name, ign, photo_url, role_in_team").eq("is_approved", true),
        supabase.from("match_stats").select("*").order("match_date", { ascending: false }),
      ]);
      const signed = await Promise.all(((p as Profile[]) ?? []).map(async (pr) => ({
        ...pr,
        photo_url: pr.photo_url ? await getSignedUrl(pr.photo_url) : null,
      })));
      setProfiles(signed);
      setMatches((m as Match[]) ?? []);
      setActiveId(signed[0]?.id ?? null);
      setLoading(false);
    })();
  }, []);

  const active = profiles.find((p) => p.id === activeId);
  const playerMatches = useMemo(
    () => (active ? matches.filter((m) => m.player_id === active.id) : []),
    [matches, active],
  );

  const agg = useMemo(() => {
    if (playerMatches.length === 0) return null;
    const wins = playerMatches.filter((m) => m.result === "WIN").length;
    const k = sum(playerMatches, "kills");
    const d = sum(playerMatches, "deaths");
    const a = sum(playerMatches, "assists");
    const mvp = playerMatches.filter((m) => m.is_mvp).length;
    const heroPool: Record<string, number> = {};
    for (const m of playerMatches) heroPool[m.hero] = (heroPool[m.hero] ?? 0) + 1;
    const top = Object.entries(heroPool).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return {
      total: playerMatches.length,
      wins,
      winRate: Math.round((wins / playerMatches.length) * 100),
      kda: d === 0 ? (k + a).toFixed(2) : ((k + a) / d).toFixed(2),
      avgKills: (k / playerMatches.length).toFixed(1),
      avgDeaths: (d / playerMatches.length).toFixed(1),
      avgAssists: (a / playerMatches.length).toFixed(1),
      mvp,
      avgGold: Math.round(sum(playerMatches, "gold") / playerMatches.length),
      avgHeroDmg: Math.round(sum(playerMatches, "hero_damage") / playerMatches.length),
      avgTaken: Math.round(sum(playerMatches, "damage_taken") / playerMatches.length),
      avgTfp: Math.round(sum(playerMatches, "teamfight_participation") / playerMatches.length),
      heroPool: top,
    };
  }, [playerMatches]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ PERFORMANCE</span>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-extrabold">PLAYER STATS</h1>
        <p className="mt-3 text-sm text-[#A0A0A0]">MLBB match tracker — KDA, MVP count, hero pool and key combat metrics.</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 mt-10 pb-20">
        {loading ? (
          <div className="text-sm text-[#A0A0A0] animate-pulse">Loading stats…</div>
        ) : profiles.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-[#181818] p-10 text-center text-sm text-[#A0A0A0]">
            No approved players yet. Once accounts are approved their stats will appear here.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-xl border border-white/5 bg-[#181818] p-3 h-fit">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#A0A0A0] px-2 py-2">ROSTER</div>
              <ul className="space-y-1">
                {profiles.map((p) => {
                  const isActive = p.id === activeId;
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => setActiveId(p.id)}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition ${
                          isActive ? "bg-[#00B8FF]/10 text-white border-l-2 border-[#00B8FF]" : "text-[#A0A0A0] hover:text-white"
                        }`}
                      >
                        <div className="h-9 w-9 rounded-full bg-[#0c0c0c] overflow-hidden flex-shrink-0">
                          {p.photo_url && <img src={p.photo_url} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-display font-bold text-sm truncate">{p.ign || p.display_name}</div>
                          {p.role_in_team && <div className="text-[10px] tracking-widest text-[#8B3DFF]">{p.role_in_team}</div>}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            <div className="space-y-6 min-w-0">
              {active && (
                <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#181818] to-[#121212] p-6 flex items-center gap-5">
                  <div className="h-20 w-20 rounded-xl bg-[#0c0c0c] overflow-hidden flex-shrink-0">
                    {active.photo_url && <img src={active.photo_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] tracking-[0.2em] text-[#00B8FF] font-bold">{active.role_in_team || "PLAYER"}</div>
                    <h2 className="font-display text-3xl font-extrabold truncate">{active.ign || active.display_name}</h2>
                  </div>
                </div>
              )}

              {!agg ? (
                <div className="rounded-xl border border-white/5 bg-[#181818] p-10 text-center text-sm text-[#A0A0A0]">
                  No matches recorded for this player yet.
                </div>
              ) : (
                <>
                  <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                    <Stat icon={<Trophy className="h-4 w-4" />} label="Matches" value={`${agg.total}`} sub={`${agg.wins} W`} />
                    <Stat icon={<Target className="h-4 w-4" />} label="Win Rate" value={`${agg.winRate}%`} accent="text-emerald-400" />
                    <Stat icon={<Swords className="h-4 w-4" />} label="Avg KDA" value={agg.kda} sub={`${agg.avgKills}/${agg.avgDeaths}/${agg.avgAssists}`} />
                    <Stat icon={<Crown className="h-4 w-4" />} label="MVP" value={`${agg.mvp}`} accent="text-amber-400" />
                    <Stat icon={<Coins className="h-4 w-4" />} label="Avg Gold" value={agg.avgGold.toLocaleString()} accent="text-amber-400" />
                    <Stat icon={<Swords className="h-4 w-4" />} label="Avg Hero DMG" value={agg.avgHeroDmg.toLocaleString()} accent="text-rose-400" />
                    <Stat icon={<Shield className="h-4 w-4" />} label="Avg DMG Taken" value={agg.avgTaken.toLocaleString()} />
                    <Stat icon={<Target className="h-4 w-4" />} label="Teamfight %" value={`${agg.avgTfp}%`} accent="text-[#00B8FF]" />
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#181818] p-5">
                    <h3 className="font-display text-sm font-bold tracking-[0.2em] text-[#A0A0A0] mb-3">HERO POOL</h3>
                    <div className="flex flex-wrap gap-2">
                      {agg.heroPool.map(([hero, count]) => (
                        <span key={hero} className="inline-flex items-center gap-2 rounded-md bg-[#0c0c0c] border border-white/10 px-3 py-1.5 text-sm">
                          <span className="font-semibold">{hero}</span>
                          <span className="text-xs text-[#00B8FF] font-bold">×{count}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#181818] overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead className="text-[10px] uppercase tracking-[0.18em] text-[#A0A0A0]">
                        <tr className="border-b border-white/5">
                          <th className="text-left py-3 px-3">Date</th>
                          <th className="text-left">Hero</th>
                          <th>Result</th>
                          <th>KDA</th>
                          <th>Gold</th>
                          <th>Hero DMG</th>
                          <th>TFP</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerMatches.map((m, i) => (
                          <tr key={m.id} className={i % 2 ? "bg-[#121212]" : ""}>
                            <td className="py-2 px-3 text-xs">{m.match_date}</td>
                            <td className="font-semibold">{m.hero}</td>
                            <td className="text-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.result === "WIN" ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                                {m.result}
                              </span>
                            </td>
                            <td className="text-center font-mono">{m.kills}/{m.deaths}/{m.assists}</td>
                            <td className="text-center font-mono text-amber-400">{m.gold.toLocaleString()}</td>
                            <td className="text-center font-mono">{m.hero_damage.toLocaleString()}</td>
                            <td className="text-center">{m.teamfight_participation}%</td>
                            <td className="text-center">{m.is_mvp && <Crown className="inline h-4 w-4 text-amber-400" />}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function Stat({ icon, label, value, sub, accent = "text-white" }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#181818] p-4">
      <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#A0A0A0] font-bold">
        {icon} {label}
      </div>
      <div className={`mt-2 font-display text-2xl font-extrabold ${accent}`}>{value}</div>
      {sub && <div className="text-[10px] text-[#A0A0A0] mt-1">{sub}</div>}
    </div>
  );
}

function sum<T>(arr: T[], key: keyof T): number {
  return arr.reduce((acc, x) => acc + (x[key] as unknown as number), 0);
}
