import { BadgeCheck } from "lucide-react";
import { type Player, roleAccent } from "@/data/players";

interface Props {
  player: Player;
  showRealName?: boolean;
  className?: string;
  onClick?: (player: Player) => void;
}

export function PlayerCard({ player, showRealName, className = "", onClick }: Props) {
  const accent = roleAccent[player.role];
  return (
    <button
      type="button"
      onClick={() => onClick?.(player)}
      className={`group relative w-full text-left overflow-hidden rounded-xl border border-white/5 bg-[#181818] hover-glow-brand cursor-pointer ${className}`}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <img
          src={player.photo}
          alt={player.ign}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={640}
          height={800}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
        <span
          className={`absolute left-3 top-3 inline-flex items-center rounded-md px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.18em] ring-1 ring-white/10 backdrop-blur ${accent.bg} ${accent.text}`}
        >
          {player.role}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="text-xl font-extrabold uppercase tracking-wider text-white" style={{ fontFamily: "'Noto Sans', 'Noto Sans Symbols', system-ui, sans-serif" }}>
          {player.ign}
        </div>
        {showRealName && (
          <div className="text-xs text-[#A0A0A0] mt-0.5">{player.realName}</div>
        )}
        {player.verified && (
          <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#00B8FF]">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified
          </div>
        )}
      </div>
    </button>
  );
}
