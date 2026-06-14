import p1 from "@/assets/player-1.jpg";
import p2 from "@/assets/player-2.jpg";
import p3 from "@/assets/player-3.jpg";
import p4 from "@/assets/player-4.jpg";
import p5 from "@/assets/player-5.jpg";
import p6 from "@/assets/player-6.jpg";
import p7 from "@/assets/player-7.jpg";
import p8 from "@/assets/player-8.jpg";
import p9 from "@/assets/player-9.jpg";
import p10 from "@/assets/player-10.jpg";
import p11 from "@/assets/player-11.jpg";

export type Role =
  | "GOLD LANE"
  | "MID LANE"
  | "EXP LANE"
  | "ROAMER"
  | "JUNGLE";

// ─── NEW: Squad type ──────────────────────────────────────────────────────────
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
  email?: string;
}

export const players: Player[] = [
  // ─── DARKSTAR SQUAD (first 5) ─────────────────────────────────────────────
  {
    ign: "→ vєHYM",
    realName: "Tunde Adebayo",
    role: "GOLD LANE",
    squad: "DARKSTAR",
    photo: p1,
    verified: true,
    playerId: "12345678",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 22,
    yearsActive: 4,
    winRate: 72,
    matches: 318,
    tournamentWins: 6,
    socials: { instagram: "#", twitter: "#" },
  },
  {
    ign: "DONDIPSY",
    realName: "Chinedu Okafor",
    role: "MID LANE",
    squad: "DARKSTAR",
    photo: p2,
    verified: true,
    playerId: "23456789",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 21,
    yearsActive: 3,
    winRate: 68,
    matches: 274,
    tournamentWins: 4,
    socials: { instagram: "#" },
  },
  {
    ign: "KΞLTo",
    realName: "Emeka Obi",
    role: "EXP LANE",
    squad: "DARKSTAR",
    photo: p3,
    verified: true,
    playerId: "34567890",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 24,
    yearsActive: 5,
    winRate: 70,
    matches: 402,
    tournamentWins: 7,
  },
  {
    ign: "MOSQUITO (DIO)",
    realName: "Amara Bello",
    role: "ROAMER",
    squad: "DARKSTAR",
    photo: p4,
    verified: true,
    playerId: "45678901",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 23,
    yearsActive: 4,
    winRate: 65,
    matches: 289,
    tournamentWins: 5,
  },
  {
    ign: "YUKI CAN'T DASH",
    realName: "Kola Adeyemi",
    role: "JUNGLE",
    squad: "DARKSTAR",
    photo: p5,
    verified: true,
    playerId: "56789012",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 20,
    yearsActive: 2,
    winRate: 74,
    matches: 196,
    tournamentWins: 3,
  },

  // ─── DEATHSIREN SQUAD (last 6) ────────────────────────────────────────────
  {
    ign: "​KHIA.",
    realName: "Ifeanyi Uche",
    role: "GOLD LANE",
    squad: "DEATHSIREN",
    photo: p6,
    verified: true,
    playerId: "67890123",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 22,
    yearsActive: 3,
    winRate: 67,
    matches: 245,
    tournamentWins: 4,
  },
  {
    ign: "MAKI 2.0",
    realName: "Bayo Ogundimu",
    role: "GOLD LANE",
    squad: "DEATHSIREN",
    photo: p7,
    verified: true,
    playerId: "78901234",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 25,
    yearsActive: 6,
    winRate: 71,
    matches: 451,
    tournamentWins: 8,
  },
  {
    ign: "​MICA CHAN",
    realName: "Bayo Ogundimu",
    role: "EXP LANE",
    squad: "DEATHSIREN",
    photo: p8,
    verified: true,
    playerId: "78901234",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 25,
    yearsActive: 6,
    winRate: 71,
    matches: 451,
    tournamentWins: 8,
  },
  {
    ign: "​NAGΞ 𓃠",
    realName: "Bayo Ogundimu",
    role: "MID LANE",
    squad: "DEATHSIREN",
    photo: p9,
    verified: true,
    playerId: "78901234",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 25,
    yearsActive: 6,
    winRate: 71,
    matches: 451,
    tournamentWins: 8,
  },
  {
    ign: "​MAЯIPΣSA",
    realName: "Bayo Ogundimu",
    role: "MID LANE",
    squad: "DEATHSIREN",
    photo: p10,
    verified: true,
    playerId: "78901234",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 25,
    yearsActive: 6,
    winRate: 71,
    matches: 451,
    tournamentWins: 8,
  },
  {
    ign: "​ᕲIᕵΞ",
    realName: "Bayo Ogundimu",
    role: "ROAMER",
    squad: "DEATHSIREN",
    photo: p11,
    verified: true,
    playerId: "78901234",
    nationality: "Nigeria",
    flag: "🇳🇬",
    age: 25,
    yearsActive: 6,
    winRate: 71,
    matches: 451,
    tournamentWins: 8,
    socials: { instagram: "#", twitter: "#" },
    email: "preciousdipe@gmail.com",
  },
];

export const roleAccent: Record<Role, { bg: string; text: string }> = {
  "GOLD LANE": { bg: "bg-amber-500/15", text: "text-amber-400" },
  "MID LANE": { bg: "bg-[#00B8FF]/15", text: "text-[#00B8FF]" },
  "EXP LANE": { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  "ROAMER": { bg: "bg-[#8B3DFF]/15", text: "text-[#8B3DFF]" },
  "JUNGLE": { bg: "bg-rose-500/15", text: "text-rose-400" },
};