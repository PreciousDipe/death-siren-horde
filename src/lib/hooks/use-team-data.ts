import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrl } from "@/lib/storage";
import type { Role, Squad, Player } from "@/data/players";

const STALE = 5 * 60_000;

export interface PlayerRow extends Player {
  id: string;
  photoPath: string | null;
}

export function usePlayers() {
  return useQuery<PlayerRow[]>({
    queryKey: ["players"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return Promise.all(
        (data ?? []).map(async (r) => ({
          id: r.id,
          ign: r.ign,
          realName: r.real_name ?? "",
          role: r.role as Role,
          squad: r.squad as Squad,
          photoPath: r.photo_url,
          photo: await getSignedUrl(r.photo_url),
          verified: !!r.verified,
          playerId: r.player_id ?? "",
          nationality: r.nationality ?? "",
          flag: r.flag ?? "",
          age: r.age ?? 0,
          yearsActive: r.years_active ?? 0,
          winRate: r.win_rate ?? 0,
          matches: r.matches ?? 0,
          tournamentWins: r.tournament_wins ?? 0,
          socials: {
            instagram: r.instagram ?? undefined,
            twitter: r.twitter ?? undefined,
            youtube: r.youtube ?? undefined,
          },
        })),
      );
    },
  });
}

export interface NewsRow {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string | null;
  image: string;
}

export function useNews() {
  return useQuery<NewsRow[]>({
    queryKey: ["news"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return Promise.all(
        (data ?? []).map(async (r) => ({
          id: r.id,
          title: r.title,
          date: r.date,
          category: r.category ?? "",
          content: r.content,
          image: await getSignedUrl(r.image_url),
        })),
      );
    },
  });
}

export interface TournamentMeta {
  id: string;
  name: string;
  tag: string;
  target_date: string;
}

export function useTournamentMeta() {
  return useQuery<TournamentMeta | null>({
    queryKey: ["tournament-meta"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournament_meta")
        .select("id, name, tag, target_date")
        .eq("is_active", true)
        .order("target_date", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as TournamentMeta | null;
    },
  });
}

export interface ScheduleRow {
  id: string;
  date: string;
  opponent: string;
  time: string;
}

export function useSchedule() {
  return useQuery<ScheduleRow[]>({
    queryKey: ["tournament-schedule"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournament_schedule")
        .select("id, date, opponent, time")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ScheduleRow[];
    },
  });
}

export interface StandingRow {
  id: string;
  team: string;
  w: number;
  l: number;
  pts: number;
  highlight: boolean;
}

export function useStandings() {
  return useQuery<StandingRow[]>({
    queryKey: ["tournament-standings"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournament_standings")
        .select("id, team, w, l, pts, highlight")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        team: r.team,
        w: r.w ?? 0,
        l: r.l ?? 0,
        pts: r.pts ?? 0,
        highlight: !!r.highlight,
      }));
    },
  });
}

export interface SiteSettings {
  contact_email: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  discord: string;
}

export function useSiteSettings() {
  return useQuery<SiteSettings | null>({
    queryKey: ["site-settings"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("contact_email, instagram, twitter, tiktok, discord")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as SiteSettings | null;
    },
  });
}

