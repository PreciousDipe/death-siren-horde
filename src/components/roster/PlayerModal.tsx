import { useEffect } from "react";
import { X, BadgeCheck, Trophy, Swords, Target, Instagram, Twitter, Youtube } from "lucide-react";
import { type Player, roleAccent } from "@/data/players";

interface Props {
  player: Player | null;
  onClose: () => void;
}

export function PlayerModal({ player, onClose }: Props) {
  useEffect(() => {
    if (!player) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [player, onClose]);

  if (!player) return null;
  const accent = roleAccent[player.role];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-[#080808]/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#181818] shadow-[0_20px_80px_-20px_rgba(0,184,255,0.35)] animate-scale-in"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#080808]/70 text-[#A0A0A0] hover:text-white hover:bg-[#080808]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c0c0c]">
          <img src={player.photo} alt={player.ign} className="h-full w-full object-cover object-top" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/30 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#8B3DFF] px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.18em] text-white">
                {player.role}
              </span>
              {player.verified && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#00B8FF]/15 px-2 py-1 text-[11px] font-semibold text-[#00B8FF]">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-white">
              {player.realName}
            </h2>
            <div className="..." style={{ fontFamily: "'Noto Sans', 'Noto Sans Symbols', system-ui, sans-serif" }}>
              {player.ign}
            </div>
          </div>
        </div>

        <div className="px-5 md:px-7 py-6">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Player ID" value={`#${player.playerId}`} />
            <Info label="Nationality" value={`${player.flag} ${player.nationality}`} />
            {/* <Info label="Age" value={`${player.age}`} /> */}
            <Info label="Years Active" value={`${player.yearsActive}`} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat icon={<Target className="h-4 w-4" />} label="Win Rate" value={`${player.winRate}%`} />
            <Stat icon={<Swords className="h-4 w-4" />} label="Matches" value={`${player.matches}`} />
            <Stat icon={<Trophy className="h-4 w-4" />} label="Trophies" value={`${player.tournamentWins}`} accent={accent.text} />
          </div>

          {player.socials && (
            <div className="mt-6 flex gap-2">
              {player.socials.instagram && (
                <SocialLink href={player.socials.instagram}><Instagram className="h-4 w-4" /></SocialLink>
              )}
              {player.socials.twitter && (
                <SocialLink href={player.socials.twitter}><Twitter className="h-4 w-4" /></SocialLink>
              )}
              {player.socials.youtube && (
                <SocialLink href={player.socials.youtube}><Youtube className="h-4 w-4" /></SocialLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-[#121212] p-3">
      <div className="text-[10px] font-bold tracking-[0.2em] text-[#A0A0A0]">{label}</div>
      <div className="mt-1 font-display text-base font-bold text-white">{value}</div>
    </div>
  );
}

function Stat({ icon, label, value, accent = "text-[#00B8FF]" }: { icon: React.ReactNode; label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-[#121212] p-3 text-center">
      <div className={`mx-auto inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/5 ${accent}`}>
        {icon}
      </div>
      <div className="mt-2 font-display text-xl font-extrabold text-white">{value}</div>
      <div className="text-[10px] font-bold tracking-[0.2em] text-[#A0A0A0] mt-0.5">{label}</div>
    </div>
  );
}

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-[#121212] text-white/80 transition hover:text-[#00B8FF] hover:border-[#00B8FF]/60"
    >
      {children}
    </a>
  );
}
