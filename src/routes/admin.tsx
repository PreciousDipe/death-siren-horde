import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  LogOut, Users, Trophy, Newspaper, Settings as SettingsIcon,
  Plus, Pencil, Trash2, Save, X, UserPlus, BarChart3, MessageSquare, Calendar, ListOrdered,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { ROLES, SQUADS, type Role, type Squad } from "@/data/players";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrl, uploadTeamAsset } from "@/lib/storage";
import { MatchStatsTab } from "@/components/admin/MatchStatsTab";
import { MessagesTab } from "@/components/admin/MessagesTab";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Darkstar" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

/* ─── Auth gate ─────────────────────────────────────────── */
function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setReady(true);
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (isAdmin) setAuthed(true);
      setReady(true);
    })();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    toast.success("Logged out");
    navigate({ to: "/" });
  };

  if (!ready) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-[#A0A0A0] text-sm animate-pulse">Checking access...</div>
    </div>
  );
  if (!authed) return <Login onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={handleLogout} />;
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      if (!isAdmin) {
        await supabase.auth.signOut();
        toast.error("Access denied. Admin privileges required.");
        return;
      }
      toast.success("Welcome back, Admin");
      onLogin();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#181818] p-8 shadow-[0_20px_80px_-20px_rgba(0,184,255,0.35)]">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="" className="h-16 w-16 drop-shadow-[0_0_15px_#00B8FF]" />
          <h1 className="mt-3 font-display text-2xl font-extrabold">ADMIN ACCESS</h1>
          <p className="text-xs text-[#A0A0A0] mt-1">Darkstar Admin Panel</p>
        </div>
        <Label>Email</Label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="admin@example.com" autoFocus required />
        <Label className="mt-4">Password</Label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" required />
        <button type="submit" disabled={loading} className="mt-6 w-full h-12 rounded-md font-display text-sm font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-[#00B8FF] to-[#8B3DFF] text-white shadow-[0_0_24px_rgba(0,184,255,0.4)] disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="mt-4 text-[11px] text-center text-[#A0A0A0]">Admin access only</p>
      </form>
    </div>
  );
}

/* ─── Dashboard ─────────────────────────────────────────── */
const TABS = [
  { id: "players", label: "Team", Icon: Users },
  { id: "accounts", label: "Accounts", Icon: UserPlus },
  { id: "matchstats", label: "Match Stats", Icon: BarChart3 },
  { id: "messages", label: "Messages", Icon: MessageSquare },
  { id: "tournaments", label: "Tournaments", Icon: Trophy },
  { id: "news", label: "News", Icon: Newspaper },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
] as const;
type TabId = typeof TABS[number]["id"];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>("players");
  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      <aside className="hidden md:flex w-60 flex-col bg-[#121212] border-r border-white/5">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-white/5">
          <img src={logo} alt="" className="h-8 w-8 drop-shadow-[0_0_8px_#00B8FF]" />
          <span className="font-display font-extrabold tracking-widest text-sm">DARKSTAR</span>
        </div>
        <nav className="flex-1 py-4">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-3 w-full px-5 py-3 text-sm font-semibold transition ${
                tab === id
                  ? "bg-[#00B8FF]/10 text-white border-l-2 border-[#00B8FF]"
                  : "text-[#A0A0A0] hover:text-white border-l-2 border-transparent"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#0c0c0c]">
          <h2 className="font-display text-lg font-bold uppercase tracking-widest">{TABS.find((t) => t.id === tab)?.label}</h2>
          <div className="flex items-center gap-2">
            <select value={tab} onChange={(e) => setTab(e.target.value as TabId)} className="md:hidden bg-[#181818] border border-white/10 rounded-md px-2 h-9 text-xs">
              {TABS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <button onClick={onLogout} className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-[#181818] border border-white/10 text-sm hover:text-[#FF3B3B]">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1">
          {tab === "players" && <PlayersTab />}
          {tab === "accounts" && <AccountsTab />}
          {tab === "matchstats" && <MatchStatsTab />}
          {tab === "messages" && <MessagesTab />}
          {tab === "tournaments" && <TournamentsTab />}
          {tab === "news" && <NewsTab />}
          {tab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

/* ─── Shared UI ─────────────────────────────────────────── */
const inputCls = "w-full h-11 rounded-md bg-[#0c0c0c] border border-white/10 px-3 text-sm text-white outline-none focus:border-[#00B8FF]";
const textareaCls = "w-full rounded-md bg-[#0c0c0c] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#00B8FF] min-h-[100px]";
const btnPrimary = "inline-flex items-center gap-2 h-10 px-4 rounded-md text-xs font-bold uppercase tracking-[0.16em] bg-gradient-to-r from-[#00B8FF] to-[#8B3DFF] text-white shadow-[0_0_18px_rgba(0,184,255,0.35)]";
const btnGhost = "inline-flex items-center gap-2 h-10 px-3 rounded-md text-xs font-semibold bg-[#181818] border border-white/10 hover:text-[#00B8FF]";
function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-[11px] font-bold tracking-[0.18em] text-[#A0A0A0] mb-1 ${className}`}>{children}</label>;
}
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-white/5 bg-[#181818] p-5">{children}</div>;
}

/* ─── Accounts (unchanged) ─────────────────────────────── */
function AccountsTab() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password are required.");
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("create-team-user", {
        body: JSON.stringify({ email, password, role }),
        headers: { "Content-Type": "application/json" },
      });
      if (error) throw error;
      toast.success(`Account created for ${email}`);
      setEmail(""); setPassword(""); setRole("member");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create account.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h3 className="font-display text-xl font-extrabold mb-1">CREATE TEAM ACCOUNT</h3>
        <p className="text-sm text-[#A0A0A0]">Generate login credentials for team members or new admins.</p>
      </div>
      <Card>
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div><Label>Email Address</Label><input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div><Label>Temporary Password</Label><input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
          <div><Label>System Role</Label>
            <select className={inputCls} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="member">Team Member (Standard)</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading} className={btnPrimary + " disabled:opacity-50"}>
              {loading ? "CREATING..." : <><UserPlus className="h-4 w-4" /> CREATE ACCOUNT</>}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ─── Players (Supabase CRUD) ─────────────────────────── */
type PlayerRecord = {
  id?: string;
  ign: string;
  real_name: string;
  role: Role;
  squad: Squad;
  photo_url: string | null;
  verified: boolean;
  player_id: string;
  nationality: string;
  flag: string;
  age: number;
  years_active: number;
  win_rate: number;
  matches: number;
  tournament_wins: number;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  sort_order: number;
};

const blankPlayer = (): PlayerRecord => ({
  ign: "", real_name: "", role: "MID LANE", squad: "DARKSTAR", photo_url: null, verified: false,
  player_id: "", nationality: "Nigeria", flag: "🇳🇬", age: 18, years_active: 1,
  win_rate: 50, matches: 0, tournament_wins: 0,
  instagram: null, twitter: null, youtube: null, sort_order: 100,
});

function PlayersTab() {
  const [rows, setRows] = useState<PlayerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PlayerRecord | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("players").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setRows((data ?? []) as PlayerRecord[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (p: PlayerRecord) => {
    // Client-side validation
    if (p.ign.trim().length < 2) return toast.error("IGN is required (min 2 chars).");
    if (p.ign.length > 40) return toast.error("IGN must be under 40 characters.");
    if (p.real_name.length > 120) return toast.error("Real name must be under 120 characters.");
    if (p.win_rate < 0 || p.win_rate > 100) return toast.error("Win rate must be between 0 and 100.");
    if (p.age < 0 || p.age > 120) return toast.error("Age must be between 0 and 120.");
    if (p.matches < 0 || p.tournament_wins < 0 || p.years_active < 0) return toast.error("Numeric fields cannot be negative.");
    for (const [label, url] of [["Instagram", p.instagram], ["Twitter", p.twitter], ["YouTube", p.youtube]] as const) {
      if (url && !/^https?:\/\//i.test(url)) return toast.error(`${label} URL must start with http(s)://`);
    }

    const payload = { ...p };
    if (payload.id) {
      const { error } = await supabase.from("players").update(payload).eq("id", payload.id);
      if (error) return toast.error(error.message);
    } else {
      const { id: _drop, ...insert } = payload;
      void _drop;
      const { error } = await supabase.from("players").insert(insert);
      if (error) return toast.error(error.message);
    }
    toast.success("Player saved");
    setEditing(null);
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this player?")) return;
    const { error } = await supabase.from("players").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Player deleted");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing(blankPlayer())} className={btnPrimary}><Plus className="h-4 w-4" /> Add Player</button>
      </div>
      <Card>
        {loading ? <p className="text-sm text-[#A0A0A0] py-6 text-center">Loading players…</p> : rows.length === 0 ? (
          <p className="text-sm text-[#A0A0A0] py-6 text-center">No players yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-[0.18em] text-[#A0A0A0]">
                <tr><th className="text-left py-3 px-3">IGN</th><th className="text-left">Name</th><th className="text-left">Role</th><th className="text-left">Squad</th><th className="text-left">Win %</th><th></th></tr>
              </thead>
              <tbody>
                {rows.map((p, i) => (
                  <tr key={p.id} className={i % 2 ? "bg-[#121212]" : "bg-[#181818]"}>
                    <td className="py-3 px-3 font-display font-bold">{p.ign}{p.verified && <span className="ml-2 text-[10px] text-[#00B8FF]">✓</span>}</td>
                    <td>{p.real_name}</td>
                    <td><span className="text-[10px] font-bold tracking-widest text-[#8B3DFF]">{p.role}</span></td>
                    <td className="text-[10px] font-bold tracking-widest text-[#A0A0A0]">{p.squad}</td>
                    <td>{p.win_rate}%</td>
                    <td className="text-right pr-3">
                      <div className="inline-flex gap-1">
                        <button onClick={() => setEditing(p)} className={btnGhost}><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => p.id && del(p.id)} className={btnGhost + " hover:text-[#FF3B3B]"}><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {editing && <PlayerForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function PlayerForm({ initial, onSave, onCancel }: { initial: PlayerRecord; onSave: (p: PlayerRecord) => void; onCancel: () => void }) {
  const [p, setP] = useState<PlayerRecord>(initial);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof PlayerRecord>(k: K, v: PlayerRecord[K]) => setP((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    (async () => setPreview(await getSignedUrl(p.photo_url)))();
  }, [p.photo_url]);

  const onPhoto = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadTeamAsset("players", file);
      set("photo_url", path);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-[#080808]/80 backdrop-blur-md" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#181818] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-extrabold">{p.id ? "EDIT PLAYER" : "NEW PLAYER"}</h3>
          <button onClick={onCancel} className={btnGhost}><X className="h-4 w-4" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div><Label>IGN</Label><input className={inputCls} value={p.ign} onChange={(e) => set("ign", e.target.value)} /></div>
          <div><Label>Real Name</Label><input className={inputCls} value={p.real_name} onChange={(e) => set("real_name", e.target.value)} /></div>
          <div><Label>Player ID</Label><input className={inputCls} value={p.player_id} onChange={(e) => set("player_id", e.target.value)} /></div>
          <div><Label>Role</Label>
            <select className={inputCls} value={p.role} onChange={(e) => set("role", e.target.value as Role)}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div><Label>Squad</Label>
            <select className={inputCls} value={p.squad} onChange={(e) => set("squad", e.target.value as Squad)}>
              {SQUADS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div><Label>Nationality</Label><input className={inputCls} value={p.nationality} onChange={(e) => set("nationality", e.target.value)} /></div>
          <div><Label>Flag emoji</Label><input className={inputCls} value={p.flag} onChange={(e) => set("flag", e.target.value)} /></div>
          <div><Label>Age</Label><input type="number" className={inputCls} value={p.age} onChange={(e) => set("age", +e.target.value)} /></div>
          <div><Label>Years Active</Label><input type="number" className={inputCls} value={p.years_active} onChange={(e) => set("years_active", +e.target.value)} /></div>
          <div><Label>Win Rate %</Label><input type="number" className={inputCls} value={p.win_rate} onChange={(e) => set("win_rate", +e.target.value)} /></div>
          <div><Label>Matches</Label><input type="number" className={inputCls} value={p.matches} onChange={(e) => set("matches", +e.target.value)} /></div>
          <div><Label>Tournament Wins</Label><input type="number" className={inputCls} value={p.tournament_wins} onChange={(e) => set("tournament_wins", +e.target.value)} /></div>
          <div><Label>Sort Order</Label><input type="number" className={inputCls} value={p.sort_order} onChange={(e) => set("sort_order", +e.target.value)} /></div>
          <div className="flex items-end gap-2">
            <label className="inline-flex items-center gap-2 text-sm text-white">
              <input type="checkbox" checked={p.verified} onChange={(e) => set("verified", e.target.checked)} /> Verified
            </label>
          </div>
          <div><Label>Instagram URL</Label><input className={inputCls} value={p.instagram ?? ""} onChange={(e) => set("instagram", e.target.value || null)} /></div>
          <div><Label>Twitter URL</Label><input className={inputCls} value={p.twitter ?? ""} onChange={(e) => set("twitter", e.target.value || null)} /></div>
          <div className="col-span-2"><Label>YouTube URL</Label><input className={inputCls} value={p.youtube ?? ""} onChange={(e) => set("youtube", e.target.value || null)} /></div>

          <div className="col-span-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-3">
              {preview && <img src={preview} alt="" className="h-16 w-16 object-cover rounded-md border border-white/10" />}
              <input type="file" accept="image/*" onChange={(e) => onPhoto(e.target.files?.[0])} className="text-xs" />
              {uploading && <span className="text-xs text-[#A0A0A0]">Uploading…</span>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className={btnGhost}>Cancel</button>
          <button onClick={() => onSave(p)} className={btnPrimary}><Save className="h-4 w-4" /> Save</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Generic Supabase list editor ─────────────────────── */
type FieldType = "text" | "textarea" | "number" | "date" | "datetime-local" | "select" | "checkbox" | "image";
type FieldSpec<T> = {
  key: keyof T & string;
  label: string;
  type?: FieldType;
  options?: string[];
  folder?: string; // for image
  required?: boolean;
};

function SupabaseList<T extends { id?: string }>({
  table, orderBy = "sort_order", titleField, blank, fields, validate,
}: {
  table: string;
  orderBy?: string;
  titleField: keyof T & string;
  blank: () => T;
  fields: FieldSpec<T>[];
  validate?: (item: T) => string | null;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);

  const load = async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from(table as any) as any).select("*").order(orderBy, { ascending: true });
    if (error) toast.error(error.message);
    else setRows((data ?? []) as T[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, [table]);

  const save = async (item: T) => {
    if (validate) {
      const err = validate(item);
      if (err) return toast.error(err);
    }
    const payload = { ...item };
    if (payload.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from(table as any) as any).update(payload).eq("id", payload.id);
      if (error) return toast.error(error.message);
    } else {
      const { id: _drop, ...insert } = payload;
      void _drop;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from(table as any) as any).insert(insert);
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setEditing(null);
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from(table as any) as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing(blank())} className={btnPrimary}><Plus className="h-4 w-4" /> Add</button>
      </div>
      <Card>
        {loading ? <p className="text-sm text-[#A0A0A0] py-6 text-center">Loading…</p> : rows.length === 0 ? (
          <p className="text-sm text-[#A0A0A0] py-6 text-center">No entries yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {rows.map((it) => (
              <li key={it.id} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold truncate">{String((it as Record<string, unknown>)[titleField] ?? "")}</div>
                </div>
                <button onClick={() => setEditing(it)} className={btnGhost}><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => it.id && del(it.id)} className={btnGhost + " hover:text-[#FF3B3B]"}><Trash2 className="h-3.5 w-3.5" /></button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {editing && (
        <RowEditor
          item={editing}
          fields={fields}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function RowEditor<T extends { id?: string }>({ item, fields, onCancel, onSave }: {
  item: T;
  fields: FieldSpec<T>[];
  onCancel: () => void;
  onSave: (v: T) => void;
}) {
  const [v, setV] = useState<T>(item);
  const set = <K extends keyof T & string>(k: K, val: unknown) => setV((s) => ({ ...s, [k]: val } as T));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-[#080808]/80 backdrop-blur-md" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#181818] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-extrabold">{v.id ? "EDIT" : "NEW"}</h3>
          <button onClick={onCancel} className={btnGhost}><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          {fields.map((f) => (
            <FieldRenderer key={f.key} f={f} value={(v as Record<string, unknown>)[f.key]} onChange={(val) => set(f.key, val)} />
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className={btnGhost}>Cancel</button>
          <button onClick={() => onSave(v)} className={btnPrimary}><Save className="h-4 w-4" /> Save</button>
        </div>
      </div>
    </div>
  );
}

function FieldRenderer<T>({ f, value, onChange }: { f: FieldSpec<T>; value: unknown; onChange: (v: unknown) => void }) {
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (f.type === "image") (async () => setPreview(await getSignedUrl(typeof value === "string" ? value : null)))();
  }, [f.type, value]);

  const str = value == null ? "" : String(value);

  if (f.type === "textarea") {
    return (
      <div>
        <Label>{f.label}</Label>
        <textarea className={textareaCls} value={str} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (f.type === "select") {
    return (
      <div>
        <Label>{f.label}</Label>
        <select className={inputCls} value={str} onChange={(e) => onChange(e.target.value)}>
          {f.options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (f.type === "checkbox") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-white">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}
      </label>
    );
  }
  if (f.type === "image") {
    return (
      <div>
        <Label>{f.label}</Label>
        <div className="flex items-center gap-3">
          {preview && <img src={preview} alt="" className="h-14 w-14 object-cover rounded-md border border-white/10" />}
          <input type="file" accept="image/*" className="text-xs" onChange={async (e) => {
            const file = e.target.files?.[0]; if (!file) return;
            setUploading(true);
            try {
              const path = await uploadTeamAsset(f.folder ?? "misc", file);
              onChange(path);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Upload failed");
            } finally { setUploading(false); }
          }} />
          {uploading && <span className="text-xs text-[#A0A0A0]">Uploading…</span>}
        </div>
      </div>
    );
  }
  return (
    <div>
      <Label>{f.label}</Label>
      <input
        type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "datetime-local" ? "datetime-local" : "text"}
        className={inputCls}
        value={str}
        onChange={(e) => onChange(f.type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
}

/* ─── Tournaments (meta + schedule + standings) ────────── */
function TournamentsTab() {
  const [sub, setSub] = useState<"meta" | "schedule" | "standings">("meta");
  const subs = [
    { id: "meta" as const, label: "Featured", Icon: Trophy },
    { id: "schedule" as const, label: "Schedule", Icon: Calendar },
    { id: "standings" as const, label: "Standings", Icon: ListOrdered },
  ];
  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {subs.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setSub(id)} className={`inline-flex items-center gap-2 h-10 px-4 rounded-md text-xs font-bold uppercase tracking-[0.16em] border ${sub === id ? "border-[#00B8FF] text-white bg-[#00B8FF]/10" : "border-white/10 text-[#A0A0A0] hover:text-white"}`}>
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {sub === "meta" && (
        <SupabaseList<TMeta>
          table="tournament_meta"
          orderBy="target_date"
          titleField="name"
          blank={() => ({ name: "", tag: "", target_date: new Date().toISOString(), is_active: true })}
          validate={(v) => {
            if (!v.name.trim()) return "Tournament name is required.";
            if (v.name.length > 120) return "Tournament name must be under 120 chars.";
            if (v.target_date && isNaN(Date.parse(v.target_date))) return "Start date must be a valid ISO datetime.";
            return null;
          }}
          fields={[
            { key: "name", label: "Tournament Name" },
            { key: "tag", label: "Tag / Category" },
            { key: "target_date", label: "Start Date/Time (ISO)", type: "text" },
            { key: "is_active", label: "Featured on homepage", type: "checkbox" },
          ]}
        />
      )}
      {sub === "schedule" && (
        <SupabaseList<TSchedule>
          table="tournament_schedule"
          titleField="opponent"
          blank={() => ({ date: "", opponent: "", time: "", sort_order: 100 })}
          validate={(v) => {
            if (!v.opponent.trim()) return "Opponent is required.";
            if (v.opponent.length > 120) return "Opponent must be under 120 chars.";
            return null;
          }}
          fields={[
            { key: "date", label: "Match Date" },
            { key: "opponent", label: "Opponent" },
            { key: "time", label: "Time" },
            { key: "sort_order", label: "Sort Order", type: "number" },
          ]}
        />
      )}
      {sub === "standings" && (
        <SupabaseList<TStanding>
          table="tournament_standings"
          titleField="team"
          blank={() => ({ team: "", w: 0, l: 0, pts: 0, highlight: false, sort_order: 100 })}
          validate={(v) => {
            if (!v.team.trim()) return "Team name is required.";
            if (v.w < 0 || v.l < 0 || v.pts < 0) return "Wins/losses/points cannot be negative.";
            return null;
          }}
          fields={[
            { key: "team", label: "Team Name" },
            { key: "w", label: "Wins", type: "number" },
            { key: "l", label: "Losses", type: "number" },
            { key: "pts", label: "Points", type: "number" },
            { key: "highlight", label: "Highlight (Darkstar)", type: "checkbox" },
            { key: "sort_order", label: "Sort Order", type: "number" },
          ]}
        />
      )}
    </div>
  );
}

type TMeta = { id?: string; name: string; tag: string; target_date: string; is_active: boolean };
type TSchedule = { id?: string; date: string; opponent: string; time: string; sort_order: number };
type TStanding = { id?: string; team: string; w: number; l: number; pts: number; highlight: boolean; sort_order: number };
type NewsRec = { id?: string; title: string; date: string; category: string; content: string; image_url: string | null; sort_order: number };

/* ─── News ─────────────────────────────────────────────── */
function NewsTab() {
  return (
    <SupabaseList<NewsRec>
      table="news_items"
      titleField="title"
      blank={() => ({ title: "", date: "", category: "News", content: "", image_url: null, sort_order: 100 })}
      validate={(v) => {
        if (!v.title.trim()) return "Title is required.";
        if (v.title.length > 200) return "Title must be under 200 chars.";
        if (v.category && v.category.length > 60) return "Category must be under 60 chars.";
        if (v.content && v.content.length > 20000) return "Content must be under 20,000 chars.";
        return null;
      }}
      fields={[
        { key: "title", label: "Title" },
        { key: "date", label: "Date (display)" },
        { key: "category", label: "Category" },
        { key: "content", label: "Content", type: "textarea" },
        { key: "image_url", label: "Thumbnail", type: "image", folder: "news" },
        { key: "sort_order", label: "Sort Order", type: "number" },
      ]}
    />
  );
}


/* ─── Site Settings ────────────────────────────────────── */
type SiteSettings = {
  id?: string;
  contact_email: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  discord: string;
};

function SettingsTab() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) return toast.error(error.message);
      setS(data ? (data as SiteSettings) : { contact_email: "", instagram: "", twitter: "", tiktok: "", discord: "" });
    })();
  }, []);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((p) => (p ? { ...p, [k]: v } : p));

  const save = async () => {
    if (!s) return;
    setSaving(true);
    try {
      if (s.id) {
        const { error } = await supabase.from("site_settings").update({
          contact_email: s.contact_email, instagram: s.instagram, twitter: s.twitter, tiktok: s.tiktok, discord: s.discord,
        }).eq("id", s.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("site_settings").insert({
          contact_email: s.contact_email, instagram: s.instagram, twitter: s.twitter, tiktok: s.tiktok, discord: s.discord,
        }).select().single();
        if (error) throw error;
        setS(data as SiteSettings);
      }
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const fields = useMemo(() => ([
    { key: "contact_email" as const, label: "Contact / Recipient Email" },
    { key: "instagram" as const, label: "Instagram URL" },
    { key: "twitter" as const, label: "Twitter URL" },
    { key: "tiktok" as const, label: "TikTok URL" },
    { key: "discord" as const, label: "Discord Invite URL" },
  ]), []);

  if (!s) return <p className="text-sm text-[#A0A0A0]">Loading…</p>;


  return (
    <div className="space-y-4 max-w-2xl">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.key} className={f.key === "contact_email" ? "md:col-span-2" : ""}>
              <Label>{f.label}</Label>
              <input className={inputCls} value={s[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={save} disabled={saving} className={btnPrimary + " disabled:opacity-60"}>
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
        <p className="mt-4 text-xs text-[#A0A0A0]">
          The contact email is used as the reply-from address shown on the public contact page and in messages the team sends. All contact-form submissions are stored in the Messages tab.
        </p>
      </Card>
    </div>
  );
}
