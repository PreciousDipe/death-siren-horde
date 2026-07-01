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
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Photo URL</label>
                <input className={input} value={profile.photo_url ?? ""} onChange={(e) => update("photo_url", e.target.value)} />
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
          </>
        )}
      </section>
    </SiteShell>
  );
}
