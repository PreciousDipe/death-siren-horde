import { Trophy, Swords, Target, Users } from "lucide-react";

const stats = [
  { Icon: Trophy, value: "27", label: "TOURNAMENT WINS" },
  { Icon: Swords, value: "189", label: "MATCHES PLAYED" },
  { Icon: Target, value: "68%", label: "WIN RATE" },
  { Icon: Users, value: "7", label: "ACTIVE PLAYERS" },
];

export function StatsBar() {
  return (
    <section className="mx-auto max-w-7xl px-4 -mt-10 relative z-10 md:px-6">
      <div className="rounded-xl border border-white/5 bg-[#181818] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ Icon, value, label }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#00B8FF]/10 text-[#00B8FF] ring-1 ring-[#00B8FF]/30">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl font-extrabold text-[#00B8FF] leading-none">
                  {value}
                </div>
                <div className="mt-1 text-[10px] md:text-xs font-semibold tracking-[0.18em] text-[#A0A0A0]">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
