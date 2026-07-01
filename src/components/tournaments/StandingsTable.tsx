import { useStandings } from "@/lib/hooks/use-team-data";
import { Skeleton } from "@/components/ui/skeleton";

export function StandingsTable() {
  const { data: standings = [], isLoading, error } = useStandings();
  return (
    <div>
      <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-wider mb-6">STANDINGS</h3>
      {error ? (
        <p className="text-[#A0A0A0]">Couldn't load standings.</p>
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-md" />)}
        </div>
      ) : standings.length === 0 ? (
        <p className="text-[#A0A0A0]">No standings yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/5">
          <div className="grid grid-cols-[40px_1fr_60px_60px_70px] md:grid-cols-[60px_1fr_80px_80px_100px] gap-2 px-4 md:px-6 py-3 bg-[#0c0c0c] text-[11px] font-bold tracking-[0.18em] text-[#A0A0A0]">
            <div>#</div><div>TEAM</div>
            <div className="text-right">W</div><div className="text-right">L</div><div className="text-right">PTS</div>
          </div>
          {standings.map((row, i) => (
            <div
              key={row.id}
              className={`grid grid-cols-[40px_1fr_60px_60px_70px] md:grid-cols-[60px_1fr_80px_80px_100px] gap-2 px-4 md:px-6 py-4 items-center ${
                row.highlight ? "bg-[#00B8FF]/15 border-l-2 border-[#00B8FF]" : "bg-[#181818]"
              }`}
            >
              <div className={`font-display font-bold ${row.highlight ? "text-[#00B8FF]" : "text-white"}`}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-display text-sm font-bold tracking-wider truncate">{row.team}</div>
              <div className="text-right font-display font-bold text-[#00FF88]">{row.w}</div>
              <div className="text-right font-display font-bold text-[#FF3B3B]">{row.l}</div>
              <div className="text-right font-display font-extrabold">{row.pts}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
