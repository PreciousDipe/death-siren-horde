import { schedule } from "@/data/tournaments";
import logo from "@/assets/logo.png";

export function ScheduleTable() {
  return (
    <div>
      <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-wider mb-6">
        TOURNAMENT SCHEDULE
      </h3>
      <div className="overflow-hidden rounded-xl border border-white/5">
        {schedule.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-[80px_1fr_auto_1fr_auto] md:grid-cols-[120px_1fr_auto_1fr_120px] items-center gap-3 px-4 md:px-6 py-4 ${
              i % 2 === 0 ? "bg-[#181818]" : "bg-[#121212]"
            }`}
          >
            <div className="font-display text-sm md:text-base font-bold text-[#00B8FF]">
              {row.date}
            </div>
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <img src={logo} alt="" className="h-7 w-7 flex-none" width={28} height={28} loading="lazy" />
              <span className="font-display text-sm font-bold truncate">DEATHSIRENS</span>
            </div>
            <div className="font-display text-xs font-bold text-[#A0A0A0]">VS</div>
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="h-7 w-7 flex-none rounded bg-gradient-to-br from-[#8B3DFF] to-[#00B8FF] opacity-60" />
              <span className="font-display text-sm font-bold truncate">{row.opponent}</span>
            </div>
            <div className="text-right text-xs md:text-sm text-[#A0A0A0] font-semibold">
              {row.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
