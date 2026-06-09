// Target date ~14 days from build time for live countdown demo
const now = new Date();
const upcoming = new Date(now);
upcoming.setDate(upcoming.getDate() + 14);
upcoming.setHours(18, 0, 0, 0);

export const upcomingTournament = {
  name: "MPL NIGERIA PLAYOFFS",
  tag: "PLAYOFFS",
  target: upcoming.toISOString(),
};

export const schedule = [
  { date: "15 JUN", opponent: "LAGOS LIONS", time: "18:00 WAT" },
  { date: "18 JUN", opponent: "ABUJA TITANS", time: "20:00 WAT" },
  { date: "22 JUN", opponent: "PORT HARCOURT FURY", time: "19:00 WAT" },
  { date: "25 JUN", opponent: "KANO STORM", time: "18:30 WAT" },
  { date: "29 JUN", opponent: "IBADAN WOLVES", time: "21:00 WAT" },
];

export interface StandingRow {
  team: string;
  w: number;
  l: number;
  pts: number;
  highlight?: boolean;
}

export const standings: StandingRow[] = [
  { team: "DEATHSIRENS", w: 12, l: 2, pts: 36, highlight: true },
  { team: "LAGOS LIONS", w: 10, l: 4, pts: 30 },
  { team: "ABUJA TITANS", w: 9, l: 5, pts: 27 },
  { team: "PORT HARCOURT FURY", w: 7, l: 7, pts: 21 },
  { team: "KANO STORM", w: 5, l: 9, pts: 15 },
  { team: "IBADAN WOLVES", w: 3, l: 11, pts: 9 },
];
