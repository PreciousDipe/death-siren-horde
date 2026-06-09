import p1 from "@/assets/player-1.jpg";
import p2 from "@/assets/player-2.jpg";
import p3 from "@/assets/player-3.jpg";
import p4 from "@/assets/player-4.jpg";
import p5 from "@/assets/player-5.jpg";
import p6 from "@/assets/player-6.jpg";
import p7 from "@/assets/player-7.jpg";

export type Role =
  | "GOLD LANE"
  | "MID LANE"
  | "EXP LANE"
  | "ROAMER"
  | "JUNGLE";

export const ROLES: Role[] = [
  "GOLD LANE",
  "MID LANE",
  "EXP LANE",
  "ROAMER",
  "JUNGLE",
];

export interface Player {
  ign: string;
  realName: string;
  role: Role;
  photo: string;
  verified: boolean;
}

export const players: Player[] = [
  { ign: "ZEPHYR", realName: "Tunde Adebayo", role: "GOLD LANE", photo: p1, verified: true },
  { ign: "NOVA", realName: "Chinedu Okafor", role: "MID LANE", photo: p2, verified: true },
  { ign: "PHANTOM", realName: "Emeka Obi", role: "EXP LANE", photo: p3, verified: true },
  { ign: "VENOM", realName: "Amara Bello", role: "ROAMER", photo: p4, verified: true },
  { ign: "BLAZE", realName: "Kola Adeyemi", role: "JUNGLE", photo: p5, verified: true },
  { ign: "SHADOW", realName: "Ifeanyi Uche", role: "MID LANE", photo: p6, verified: true },
  { ign: "TITAN", realName: "Bayo Ogundimu", role: "EXP LANE", photo: p7, verified: true },
];

export const roleAccent: Record<Role, { bg: string; text: string }> = {
  "GOLD LANE": { bg: "bg-amber-500/15", text: "text-amber-400" },
  "MID LANE": { bg: "bg-[#00B8FF]/15", text: "text-[#00B8FF]" },
  "EXP LANE": { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  "ROAMER": { bg: "bg-[#8B3DFF]/15", text: "text-[#8B3DFF]" },
  "JUNGLE": { bg: "bg-rose-500/15", text: "text-rose-400" },
};
