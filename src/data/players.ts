// Types + display helpers for players. The actual player data lives in
// Supabase — see `src/lib/hooks/use-team-data.ts` for the query hooks.

export type Role =
  | "GOLD LANE"
  | "MID LANE"
  | "EXP LANE"
  | "ROAMER"
  | "JUNGLE";

export type Squad = "DARKSTAR" | "DEATHSIREN";

export const ROLES: Role[] = [
  "GOLD LANE",
  "MID LANE",
  "EXP LANE",
  "ROAMER",
  "JUNGLE",
];

export const SQUADS: Squad[] = ["DARKSTAR", "DEATHSIREN"];

export interface Player {
  ign: string;
  realName: string;
  role: Role;
  squad: Squad;
  photo: string;
  verified: boolean;
  playerId: string;
  nationality: string;
  flag: string;
  age: number;
  yearsActive: number;
  winRate: number;
  matches: number;
  tournamentWins: number;
  socials?: { instagram?: string; twitter?: string; youtube?: string };
}

export const roleAccent: Record<Role, { bg: string; text: string }> = {
  "GOLD LANE": { bg: "bg-amber-500/15", text: "text-amber-400" },
  "MID LANE": { bg: "bg-[#00B8FF]/15", text: "text-[#00B8FF]" },
  "EXP LANE": { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  "ROAMER": { bg: "bg-[#8B3DFF]/15", text: "text-[#8B3DFF]" },
  "JUNGLE": { bg: "bg-rose-500/15", text: "text-rose-400" },
};
