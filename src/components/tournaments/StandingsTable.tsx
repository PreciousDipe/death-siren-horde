import { standings } from "@/data/tournaments";

export function StandingsTable() {
  return (
    <div>
      <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-wider mb-6">
        STANDINGS
      </h3>
      <div className="overflow-hidden rounded-xl border border-white/5">
        <div className="grid grid-cols-[40px_1fr_60px_60px_70px] md:grid-cols-[60px_1fr_80px_80px_100px] gap-2 px-4 md:px-6 py-3 bg-[#0c0c0c] text-[11px] font-bold tracking-[0.18em] text-[#A0A0A0]">
          <div>#</div>
          <div>TEAM</div>
          <div className="text-right">W</div>
          <div className="text-right">L</div>
          <div className="text-right">PTS</div>
        </div>
        {standings.map((row, i) => (
          <div
            key={row.team}
            className={`grid grid-cols-[40px_1fr_60px_60px_70px] md:grid-cols-[60px_1fr_80px_80px_100px] gap-2 px-4 md:px-6 py-4 items-center ${
              row.highlight
                ? "bg-[#00B8FF]/15 border-l-2 border-[#00B8FF]"
                : "bg-[#181818]"
            }`}
          >
            <div className={`font-display font-bold ${row.highlight ? "text-[#00B8FF]" : "text-white"}`}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="font-display text-sm font-bold tracking-wider truncate">
              {row.team}
            </div>
            <div className="text-right font-display font-bold text-[#00FF88]">{row.w}</div>
            <div className="text-right font-display font-bold text-[#FF3B3B]">{row.l}</div>
            <div className="text-right font-display font-extrabold">{row.pts}</div>
          </div>
        ))}
      </div>
      <button className="mt-6 inline-flex h-11 items-center justify-center rounded-md border border-white px-6 font-display text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-white hover:text-[#080808] transition">
        View Full Standings
      </button>
    </div>
  );
}
