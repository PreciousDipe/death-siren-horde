import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/layout/SiteShell";
import { toast } from "sonner";
import { getSignedUrl, uploadAvatar } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile — Darkstar" }] }),
  component: ProfilePage,
});

interface Profile {
  id: string;
  display_name: string | null;
  ign: string | null;
  role_in_team: string | null;
  bio: string | null;
  photo_url: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  is_approved: boolean;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setEmail(userData.user.email ?? "");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (error) toast.error(error.message);
      setProfile((data as Profile) ?? null);
      setLoading(false);
    })();
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => (p ? { ...p, [key]: value } : p));
  }

  async function save() {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name,
        ign: profile.ign,
        role_in_team: profile.role_in_team,
        bio: profile.bio,
        photo_url: profile.photo_url,
        instagram: profile.instagram,
        twitter: profile.twitter,
        youtube: profile.youtube,
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const input =
    "h-11 w-full rounded-md border border-white/10 bg-[#121212] px-3 text-sm text-white outline-none focus:border-[#00B8FF]";
  const textarea =
    "min-h-24 w-full rounded-md border border-white/10 bg-[#121212] p-3 text-sm text-white outline-none focus:border-[#00B8FF]";

  return (
    <SiteShell>
      <section className="mx-auto max-w-2xl px-4 md:px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ ACCOUNT</span>
            <h1 className="mt-2 font-display text-3xl md:text-4xl font-extrabold">MY PROFILE</h1>
            <p className="mt-1 text-sm text-white/60">{email}</p>
          </div>
          <button
            onClick={signOut}
            className="h-10 rounded-md border border-white/15 px-4 text-xs font-bold uppercase tracking-widest text-white/80 hover:bg-white/5"
          >
            Sign Out
          </button>
        </div>

        {loading ? (
          <p className="mt-10 text-white/60">Loading…</p>
        ) : !profile ? (
          <p className="mt-10 text-white/60">No profile found.</p>
        ) : (
          <>
            {!profile.is_approved && (
              <div className="mt-6 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                Your account is awaiting admin approval. You can edit your profile,
                but changes will only display publicly once approved.
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Display Name</label>
                <input className={input} value={profile.display_name ?? ""} onChange={(e) => update("display_name", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">IGN</label>
                <input className={input} value={profile.ign ?? ""} onChange={(e) => update("ign", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Team Role</label>
                <input className={input} placeholder="GOLD LANE, MID LANE…" value={profile.role_in_team ?? ""} onChange={(e) => update("role_in_team", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Profile Photo</label>
                <div className="flex items-center gap-3">
                  <PhotoPreview path={profile.photo_url} />
                  <input
                    type="file"
                    accept="image/*"
                    className="text-xs text-white/70"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const path = await uploadAvatar(profile.id, file);
                        update("photo_url", path);
                        toast.success("Photo uploaded. Click Save to keep it.");
                      } catch (err: any) {
                        toast.error(err.message ?? "Upload failed");
                      }
                    }}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Bio</label>
                <textarea className={textarea} value={profile.bio ?? ""} onChange={(e) => update("bio", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Instagram</label>
                <input className={input} value={profile.instagram ?? ""} onChange={(e) => update("instagram", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Twitter / X</label>
                <input className={input} value={profile.twitter ?? ""} onChange={(e) => update("twitter", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">YouTube</label>
                <input className={input} value={profile.youtube ?? ""} onChange={(e) => update("youtube", e.target.value)} />
              </div>
            </div>

            <button
              onClick={save}
              disabled={saving}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-[#8B3DFF] px-8 font-display text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(139,61,255,0.5)] transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>

            <MyStats playerId={profile.id} />
          </>
        )}
      </section>
    </SiteShell>
  );
}

function PhotoPreview({ path }: { path: string | null }) {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    let cancelled = false;
    if (!path) { setUrl(""); return; }
    getSignedUrl(path).then((u) => { if (!cancelled) setUrl(u); });
    return () => { cancelled = true; };
  }, [path]);
  return (
    <div className="h-16 w-16 rounded-md bg-[#0c0c0c] border border-white/10 overflow-hidden flex-shrink-0">
      {url && <img src={url} alt="" className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />}
    </div>
  );
}

type Match = {
  id: string; match_date: string; result: "WIN" | "LOSE";
  hero: string; kills: number; deaths: number; assists: number;
  gold: number; hero_damage: number; teamfight_participation: number; is_mvp: boolean;
};

function MyStats({ playerId }: { playerId: string }) {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("match_stats")
        .select("id, match_date, result, hero, kills, deaths, assists, gold, hero_damage, teamfight_participation, is_mvp")
        .eq("player_id", playerId)
        .order("match_date", { ascending: false });
      if (error) { setErr(error.message); return; }
      setMatches((data ?? []) as Match[]);
    })();
  }, [playerId]);

  if (err) return <div className="mt-10 text-sm text-rose-400">Couldn't load your stats: {err}</div>;
  if (!matches) return <div className="mt-10 text-sm text-white/50">Loading your stats…</div>;

  const total = matches.length;
  const wins = matches.filter((m) => m.result === "WIN").length;
  const k = matches.reduce((a, m) => a + m.kills, 0);
  const d = matches.reduce((a, m) => a + m.deaths, 0);
  const a = matches.reduce((s, m) => s + m.assists, 0);
  const mvp = matches.filter((m) => m.is_mvp).length;
  const kda = d === 0 ? (k + a).toFixed(2) : ((k + a) / d).toFixed(2);
  const wr = total ? Math.round((wins / total) * 100) : 0;

  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl font-extrabold">MY STATS</h2>
      <p className="mt-1 text-xs text-white/50">Only you and admins can see this.</p>

      {total === 0 ? (
        <div className="mt-4 rounded-xl border border-white/5 bg-[#181818] p-6 text-sm text-white/60">
          No matches recorded yet. An admin will log your matches from the dashboard.
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatMini label="Matches" value={`${total}`} />
            <StatMini label="Win Rate" value={`${wr}%`} />
            <StatMini label="KDA" value={kda} />
            <StatMini label="MVP" value={`${mvp}`} />
          </div>

          <div className="mt-4 rounded-xl border border-white/5 bg-[#181818] overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-3">Date</th>
                  <th className="text-left">Hero</th>
                  <th>Result</th>
                  <th>KDA</th>
                  <th>TFP</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={m.id} className={i % 2 ? "bg-[#121212]" : ""}>
                    <td className="py-2 px-3 text-xs">{m.match_date}</td>
                    <td className="font-semibold">{m.hero}</td>
                    <td className="text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.result === "WIN" ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                        {m.result}
                      </span>
                    </td>
                    <td className="text-center font-mono">{m.kills}/{m.deaths}/{m.assists}</td>
                    <td className="text-center">{m.teamfight_participation}%</td>
                    <td className="text-center">{m.is_mvp && "★"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#181818] p-4">
      <div className="text-[10px] tracking-[0.2em] text-white/50 font-bold">{label}</div>
      <div className="mt-2 font-display text-2xl font-extrabold">{value}</div>
    </div>
  );
}

