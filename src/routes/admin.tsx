import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LogOut, Users, Trophy, Newspaper, Image as ImageIcon, Award, Settings as SettingsIcon,
  Plus, Pencil, Trash2, Save, X,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { players as seedPlayers, ROLES, type Player, type Role } from "@/data/players";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Darkstar" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const SESSION_KEY = "darkstar_admin_session";
const STORE_KEY = "darkstar_admin_store";

type Tournament = { id: string; name: string; date: string; result: string; status: "WIN" | "LOSE" | "UPCOMING"; image?: string };
type NewsItem = { id: string; title: string; date: string; category: string; content: string; image?: string };
type Achievement = { id: string; title: string; year: string; image?: string };
type Media = { id: string; caption: string; url: string };
type Settings = {
  teamName: string; tagline: string; heroText: string; aboutText: string; logoUrl: string;
  instagram: string; twitter: string; discord: string; email: string;
};

interface Store {
  players: Player[];
  tournaments: Tournament[];
  news: NewsItem[];
  achievements: Achievement[];
  media: Media[];
  settings: Settings;
}

const defaultStore = (): Store => ({
  players: seedPlayers,
  tournaments: [
    { id: "1", name: "MPL Nigeria Spring", date: "2025-05-12", result: "1st Place", status: "WIN" },
    { id: "2", name: "SEA Invitational", date: "2025-07-20", result: "TBD", status: "UPCOMING" },
  ],
  news: [
    { id: "1", title: "Darkstar Claim MPL Nigeria Title", date: "2025-05-12", category: "Tournament", content: "Champions again." },
  ],
  achievements: [
    { id: "1", title: "MPL Nigeria Champions", year: "2025" },
  ],
  media: [],
  settings: {
    teamName: "Darkstar",
    tagline: "Competing. Dominating. Building Champions.",
    heroText: "NIGERIA'S ELITE MOBILE LEGENDS SQUAD",
    aboutText: "Darkstar is Nigeria's premier Mobile Legends esports organization.",
    logoUrl: logo,
    instagram: "https://instagram.com/darkstar",
    twitter: "https://twitter.com/darkstar",
    discord: "https://discord.gg/darkstar",
    email: "contact@darkstar.gg",
  },
});

function loadStore(): Store {
  if (typeof window === "undefined") return defaultStore();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultStore();
    return { ...defaultStore(), ...JSON.parse(raw) };
  } catch {
    return defaultStore();
  }
}
function saveStore(s: Store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(localStorage.getItem(SESSION_KEY) === "1");
    setReady(true);
  }, []);

  if (!ready) return <div className="min-h-screen bg-[#080808]" />;
  if (!authed) return <Login onLogin={() => { localStorage.setItem(SESSION_KEY, "1"); setAuthed(true); }} />;
  return <Dashboard onLogout={() => { localStorage.removeItem(SESSION_KEY); setAuthed(false); }} />;
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (u === "admin" && p === "darkstar2024") {
            toast.success("Welcome back, Admin");
            onLogin();
          } else {
            toast.error("Invalid credentials");
          }
        }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#181818] p-8 shadow-[0_20px_80px_-20px_rgba(0,184,255,0.35)]"
      >
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="" className="h-16 w-16 drop-shadow-[0_0_15px_#00B8FF]" />
          <h1 className="mt-3 font-display text-2xl font-extrabold">ADMIN ACCESS</h1>
          <p className="text-xs text-[#A0A0A0] mt-1">Darkstar Control Panel</p>
        </div>
        <Label>Username</Label>
        <input value={u} onChange={(e) => setU(e.target.value)} className={inputCls} autoFocus />
        <Label className="mt-4">Password</Label>
        <input type="password" value={p} onChange={(e) => setP(e.target.value)} className={inputCls} />
        <button type="submit" className="mt-6 w-full h-12 rounded-md font-display text-sm font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-[#00B8FF] to-[#8B3DFF] text-white shadow-[0_0_24px_rgba(0,184,255,0.4)]">
          Sign In
        </button>
        <p className="mt-4 text-[11px] text-center text-[#A0A0A0]">Default: admin / darkstar2024</p>
      </form>
    </div>
  );
}

const TABS = [
  { id: "players", label: "Team", Icon: Users },
  { id: "tournaments", label: "Tournaments", Icon: Trophy },
  { id: "achievements", label: "Achievements", Icon: Award },
  { id: "news", label: "News", Icon: Newspaper },
  { id: "media", label: "Media", Icon: ImageIcon },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
] as const;
type TabId = typeof TABS[number]["id"];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>("players");
  const [store, setStore] = useState<Store>(defaultStore);

  useEffect(() => { setStore(loadStore()); }, []);
  const update = (next: Store) => { setStore(next); saveStore(next); };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      {/* Sidebar */}
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
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as TabId)}
              className="md:hidden bg-[#181818] border border-white/10 rounded-md px-2 h-9 text-xs"
            >
              {TABS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <button onClick={onLogout} className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-[#181818] border border-white/10 text-sm hover:text-[#FF3B3B]">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1">
          {tab === "players" && <PlayersTab store={store} update={update} />}
          {tab === "tournaments" && <TournamentsTab store={store} update={update} />}
          {tab === "achievements" && <AchievementsTab store={store} update={update} />}
          {tab === "news" && <NewsTab store={store} update={update} />}
          {tab === "media" && <MediaTab store={store} update={update} />}
          {tab === "settings" && <SettingsTab store={store} update={update} />}
        </main>
      </div>
    </div>
  );
}

/* ---------- Reusable styles ---------- */
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
function TableRow({ children, i }: { children: React.ReactNode; i: number }) {
  return <tr className={i % 2 ? "bg-[#121212]" : "bg-[#181818]"}>{children}</tr>;
}

/* ---------- Players ---------- */
function PlayersTab({ store, update }: { store: Store; update: (s: Store) => void }) {
  const [editing, setEditing] = useState<Player | null>(null);
  const blank = (): Player => ({
    ign: "", realName: "", role: "MID LANE", photo: logo, verified: false,
    playerId: "", nationality: "Nigeria", flag: "🇳🇬", age: 18, yearsActive: 1,
    winRate: 50, matches: 0, tournamentWins: 0,
  });

  const save = (p: Player) => {
    const exists = store.players.find((x) => x.ign === editing?.ign);
    const next = exists
      ? store.players.map((x) => (x.ign === editing?.ign ? p : x))
      : [...store.players, p];
    update({ ...store, players: next });
    toast.success("Player saved");
    setEditing(null);
  };
  const del = (ign: string) => {
    if (!confirm("Delete this player?")) return;
    update({ ...store, players: store.players.filter((x) => x.ign !== ign) });
    toast.success("Player deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing(blank())} className={btnPrimary}><Plus className="h-4 w-4" /> Add Player</button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.18em] text-[#A0A0A0]">
              <tr><th className="text-left py-3 px-3">IGN</th><th className="text-left">Name</th><th className="text-left">Role</th><th className="text-left">Win %</th><th></th></tr>
            </thead>
            <tbody>
              {store.players.map((p, i) => (
                <TableRow key={p.ign} i={i}>
                  <td className="py-3 px-3 font-display font-bold">{p.ign}{p.verified && <span className="ml-2 text-[10px] text-[#00B8FF]">✓</span>}</td>
                  <td>{p.realName}</td>
                  <td><span className="text-[10px] font-bold tracking-widest text-[#8B3DFF]">{p.role}</span></td>
                  <td>{p.winRate}%</td>
                  <td className="text-right pr-3">
                    <div className="inline-flex gap-1">
                      <button onClick={() => setEditing(p)} className={btnGhost}><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => del(p.ign)} className={btnGhost + " hover:text-[#FF3B3B]"}><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && <PlayerForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function PlayerForm({ initial, onSave, onCancel }: { initial: Player; onSave: (p: Player) => void; onCancel: () => void }) {
  const [p, setP] = useState<Player>(initial);
  const set = <K extends keyof Player>(k: K, v: Player[K]) => setP((s) => ({ ...s, [k]: v }));
  const onPhoto = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set("photo", String(r.result));
    r.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-[#080808]/80 backdrop-blur-md" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#181818] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-extrabold">{initial.ign ? "EDIT PLAYER" : "NEW PLAYER"}</h3>
          <button onClick={onCancel} className={btnGhost}><X className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>IGN</Label><input className={inputCls} value={p.ign} onChange={(e) => set("ign", e.target.value)} /></div>
          <div><Label>Real Name</Label><input className={inputCls} value={p.realName} onChange={(e) => set("realName", e.target.value)} /></div>
          <div><Label>Player ID</Label><input className={inputCls} value={p.playerId} onChange={(e) => set("playerId", e.target.value)} /></div>
          <div><Label>Role</Label>
            <select className={inputCls} value={p.role} onChange={(e) => set("role", e.target.value as Role)}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div><Label>Nationality</Label><input className={inputCls} value={p.nationality} onChange={(e) => set("nationality", e.target.value)} /></div>
          <div><Label>Flag emoji</Label><input className={inputCls} value={p.flag} onChange={(e) => set("flag", e.target.value)} /></div>
          <div><Label>Age</Label><input type="number" className={inputCls} value={p.age} onChange={(e) => set("age", +e.target.value)} /></div>
          <div><Label>Years Active</Label><input type="number" className={inputCls} value={p.yearsActive} onChange={(e) => set("yearsActive", +e.target.value)} /></div>
          <div><Label>Win Rate %</Label><input type="number" className={inputCls} value={p.winRate} onChange={(e) => set("winRate", +e.target.value)} /></div>
          <div><Label>Matches</Label><input type="number" className={inputCls} value={p.matches} onChange={(e) => set("matches", +e.target.value)} /></div>
          <div><Label>Tournament Wins</Label><input type="number" className={inputCls} value={p.tournamentWins} onChange={(e) => set("tournamentWins", +e.target.value)} /></div>
          <div className="flex items-end gap-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={p.verified} onChange={(e) => set("verified", e.target.checked)} /> Verified
            </label>
          </div>
          <div className="col-span-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-3">
              <img src={p.photo} alt="" className="h-16 w-16 object-cover rounded-md border border-white/10" />
              <input type="file" accept="image/*" onChange={(e) => onPhoto(e.target.files?.[0])} className="text-xs" />
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

/* ---------- Generic simple CRUD list ---------- */
function SimpleList<T extends { id: string }>({
  items, fields, blank, onChange, titleField,
}: {
  items: T[];
  fields: { key: keyof T; label: string; type?: "text" | "textarea" | "select" | "image" | "date"; options?: string[] }[];
  blank: () => T;
  onChange: (next: T[]) => void;
  titleField: keyof T;
}) {
  const [editing, setEditing] = useState<T | null>(null);
  const save = (item: T) => {
    const exists = items.find((x) => x.id === item.id);
    onChange(exists ? items.map((x) => x.id === item.id ? item : x) : [...items, item]);
    toast.success("Saved");
    setEditing(null);
  };
  const del = (id: string) => {
    if (!confirm("Delete?")) return;
    onChange(items.filter((x) => x.id !== id));
    toast.success("Deleted");
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className={btnPrimary} onClick={() => setEditing(blank())}><Plus className="h-4 w-4" /> Add</button>
      </div>
      <Card>
        {items.length === 0 ? (
          <p className="text-sm text-[#A0A0A0] text-center py-8">No entries yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {items.map((it, i) => (
              <li key={it.id} className={`flex items-center gap-3 py-3 ${i % 2 ? "" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold truncate">{String(it[titleField])}</div>
                </div>
                <button onClick={() => setEditing(it)} className={btnGhost}><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => del(it.id)} className={btnGhost + " hover:text-[#FF3B3B]"}><Trash2 className="h-3.5 w-3.5" /></button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-[#080808]/80 backdrop-blur-md" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#181818] p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-extrabold">EDIT</h3>
              <button onClick={() => setEditing(null)} className={btnGhost}><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={String(f.key)}>
                  <Label>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <textarea className={textareaCls} value={String(editing[f.key] ?? "")} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value } as T)} />
                  ) : f.type === "select" ? (
                    <select className={inputCls} value={String(editing[f.key] ?? "")} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value } as T)}>
                      {f.options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : f.type === "image" ? (
                    <div className="flex items-center gap-3">
                      {editing[f.key] && <img src={String(editing[f.key])} alt="" className="h-14 w-14 object-cover rounded-md border border-white/10" />}
                      <input type="file" accept="image/*" className="text-xs" onChange={(e) => {
                        const file = e.target.files?.[0]; if (!file) return;
                        const r = new FileReader(); r.onload = () => setEditing({ ...editing, [f.key]: String(r.result) } as T); r.readAsDataURL(file);
                      }} />
                    </div>
                  ) : (
                    <input type={f.type === "date" ? "date" : "text"} className={inputCls} value={String(editing[f.key] ?? "")} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value } as T)} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button className={btnGhost} onClick={() => setEditing(null)}>Cancel</button>
              <button className={btnPrimary} onClick={() => save(editing)}><Save className="h-4 w-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const uid = () => Math.random().toString(36).slice(2, 10);

function TournamentsTab({ store, update }: { store: Store; update: (s: Store) => void }) {
  return (
    <SimpleList<Tournament>
      items={store.tournaments}
      titleField="name"
      blank={() => ({ id: uid(), name: "", date: "", result: "", status: "UPCOMING" })}
      onChange={(next) => update({ ...store, tournaments: next })}
      fields={[
        { key: "name", label: "Name" },
        { key: "date", label: "Date", type: "date" },
        { key: "result", label: "Result" },
        { key: "status", label: "Status", type: "select", options: ["WIN", "LOSE", "UPCOMING"] },
        { key: "image", label: "Image", type: "image" },
      ]}
    />
  );
}
function AchievementsTab({ store, update }: { store: Store; update: (s: Store) => void }) {
  return (
    <SimpleList<Achievement>
      items={store.achievements}
      titleField="title"
      blank={() => ({ id: uid(), title: "", year: "" })}
      onChange={(next) => update({ ...store, achievements: next })}
      fields={[
        { key: "title", label: "Title" },
        { key: "year", label: "Year" },
        { key: "image", label: "Image", type: "image" },
      ]}
    />
  );
}
function NewsTab({ store, update }: { store: Store; update: (s: Store) => void }) {
  return (
    <SimpleList<NewsItem>
      items={store.news}
      titleField="title"
      blank={() => ({ id: uid(), title: "", date: "", category: "News", content: "" })}
      onChange={(next) => update({ ...store, news: next })}
      fields={[
        { key: "title", label: "Title" },
        { key: "date", label: "Date", type: "date" },
        { key: "category", label: "Category" },
        { key: "content", label: "Content", type: "textarea" },
        { key: "image", label: "Thumbnail", type: "image" },
      ]}
    />
  );
}
function MediaTab({ store, update }: { store: Store; update: (s: Store) => void }) {
  return (
    <SimpleList<Media>
      items={store.media}
      titleField="caption"
      blank={() => ({ id: uid(), caption: "", url: "" })}
      onChange={(next) => update({ ...store, media: next })}
      fields={[
        { key: "caption", label: "Caption" },
        { key: "url", label: "Image", type: "image" },
      ]}
    />
  );
}

function SettingsTab({ store, update }: { store: Store; update: (s: Store) => void }) {
  const [s, setS] = useState(store.settings);
  useEffect(() => setS(store.settings), [store.settings]);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((p) => ({ ...p, [k]: v }));
  const onLogo = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set("logoUrl", String(r.result));
    r.readAsDataURL(file);
  };
  return (
    <div className="space-y-4 max-w-2xl">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label>Team Name</Label><input className={inputCls} value={s.teamName} onChange={(e) => set("teamName", e.target.value)} /></div>
          <div><Label>Tagline</Label><input className={inputCls} value={s.tagline} onChange={(e) => set("tagline", e.target.value)} /></div>
          <div className="md:col-span-2"><Label>Hero Text</Label><input className={inputCls} value={s.heroText} onChange={(e) => set("heroText", e.target.value)} /></div>
          <div className="md:col-span-2"><Label>About Text</Label><textarea className={textareaCls} value={s.aboutText} onChange={(e) => set("aboutText", e.target.value)} /></div>
          <div className="md:col-span-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-3">
              <img src={s.logoUrl} alt="" className="h-16 w-16 object-contain rounded-md border border-white/10 drop-shadow-[0_0_10px_#00B8FF]" />
              <input type="file" accept="image/*" onChange={(e) => onLogo(e.target.files?.[0])} className="text-xs" />
            </div>
          </div>
          <div><Label>Instagram</Label><input className={inputCls} value={s.instagram} onChange={(e) => set("instagram", e.target.value)} /></div>
          <div><Label>Twitter</Label><input className={inputCls} value={s.twitter} onChange={(e) => set("twitter", e.target.value)} /></div>
          <div><Label>Discord</Label><input className={inputCls} value={s.discord} onChange={(e) => set("discord", e.target.value)} /></div>
          <div><Label>Email</Label><input className={inputCls} value={s.email} onChange={(e) => set("email", e.target.value)} /></div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={() => { update({ ...store, settings: s }); toast.success("Settings saved"); }} className={btnPrimary}><Save className="h-4 w-4" /> Save Settings</button>
        </div>
      </Card>
    </div>
  );
}
