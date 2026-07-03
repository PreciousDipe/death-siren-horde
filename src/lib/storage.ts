import { supabase } from "@/integrations/supabase/client";

const BUCKET = "team-assets";
const SIGNED_TTL_SECONDS = 3600;

const cache = new Map<string, { url: string; expires: number }>();

/**
 * Turn a storage path (e.g. "players/player-1.jpg") into a signed URL
 * the browser can render. Falls back to "" when the path is missing so
 * consumers can render a graceful placeholder.
 */
export async function getSignedUrl(path: string | null | undefined): Promise<string> {
  if (!path) return "";
  const now = Date.now();
  const cached = cache.get(path);
  if (cached && cached.expires > now + 60_000) return cached.url;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_TTL_SECONDS);
  if (error || !data) return "";
  cache.set(path, { url: data.signedUrl, expires: now + SIGNED_TTL_SECONDS * 1000 });
  return data.signedUrl;
}

/**
 * Upload a user avatar to `avatars/{userId}/…`. The corresponding storage
 * RLS policy scopes writes to the user's own folder, and the DB trigger
 * on `profiles.photo_url` enforces the same shape.
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `avatars/${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  cache.delete(path);
  return path;
}

/**
 * Admin-only upload for team assets (players, news, tournament media).
 * Writes to `<folder>/<timestamp>-<slug>.<ext>` and returns the storage path.
 */
export async function uploadTeamAsset(folder: string, file: File): Promise<string> {
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "") || "misc";
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const slug = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "asset";
  const path = `${safeFolder}/${Date.now()}-${slug}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  cache.delete(path);
  return path;
}

