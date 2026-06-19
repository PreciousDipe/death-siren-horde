import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, X, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Profile = { id: string; display_name: string | null; ign: string | null };
type MatchStat = {
  id: string;
  player_id: string;
  match_date: string;
  battle_id: string | null;
  result: "WIN" | "LOSE";
  hero: string;
  role: string;
  kills: number;
  deaths: number;
  assists: number;
  gold: number;
  hero_damage: number;
  turret_damage: number;
  damage_taken: number;
  teamfight_participation: number;
  is_mvp: boolean;
  duration_minutes: number | null;
  notes: string | null;
};

const ROLES = ["GOLD LANE", "MID LANE", "EXP LANE", "ROAMER", "JUNGLE"];

const input = "w-full h-10 rounded-md bg-[#0c0c0c] border border-white/10 px-3 text-sm text-white outline-none focus:border-[#00B8FF]";
const btn = "inline-flex items-center gap-2 h-10 px-4 rounded-md text-xs font-bold uppercase tracking-[0.16em] bg-gradient-to-r from-[#00B8FF] to-[#8B3DFF] text-white shadow-[0_0_18px_rgba(0,184,255,0.35)]";
const btnGhost = "inline-flex items-center gap-2 h-9 px-3 rounded-md text-xs font-semibold bg-[#181818] border border-white/10 hover:text-[#00B8FF]";

const blankMatch = (player_id = ""): Omit<MatchStat, "id"> => ({
  player_id,
  match_date: new Date().toISOString().slice(0, 10),
  battle_id: "",
  result: "WIN",
  hero: "",
  role: "MID LANE",
  kills: 0, deaths: 0, assists: 0,
  gold: 0, hero_damage: 0, turret_damage: 0, damage_taken: 0,
  teamfight_participation: 0,
  is_mvp: false,
  duration_minutes: null,
  notes: "",
});

export function MatchStatsTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<MatchStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Omit<MatchStat, "id"> & { id?: string }) | null>(null);
  const [filterPlayer, setFilterPlayer] = useState<string>("");

  async function reload() {
    setLoading(true);
    const [{ data: p }, { data: m }] = await Promise.all([
      supabase.from("profiles").select("id, display_name, ign").order("display_name"),
      supabase.from("match_stats").select("*").order("match_date", { ascending: false }),
    ]);
    setProfiles((p as Profile[]) ?? []);
    setMatches((m as MatchStat[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { reload(); }, []);

  const playerName = (id: string) => {
    const p = profiles.find((x) => x.id === id);
    return p?.ign || p?.display_name || id.slice(0, 8);
  };

  const filtered = useMemo(
    () => (filterPlayer ? matches.filter((m) => m.player_id === filterPlayer) : matches),
    [matches, filterPlayer],
  );

  async function save() {
    if (!editing) return;
    if (!editing.player_id) return toast.error("Select a player");
    if (!editing.hero.trim()) return toast.error("Hero required");

    const payload = { ...editing, duration_minutes: editing.duration_minutes || null, battle_id: editing.battle_id || null, notes: editing.notes || null };
    const { id, ...rest } = payload;
    const { error } = id
      ? await supabase.from("match_stats").update(rest).eq("id", id)
      : await supabase.from("match_stats").insert(rest);

    if (error) return toast.error(error.message);
    toast.success("Match saved");
    setEditing(null);
    reload();
  }

  async function del(id: string) {
    if (!confirm("Delete this match?")) return;
    const { error } = await supabase.from("match_stats").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h3 className="font-display text-xl font-extrabold">MATCH STATS</h3>
          <p className="text-xs text-[#A0A0A0]">Track MLBB performance per player.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={filterPlayer} onChange={(e) => setFilterPlayer(e.target.value)} className={input + " w-48"}>
            <option value="">All players</option>
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.ign || p.display_name}</option>)}
          </select>
          <button onClick={() => setEditing(blankMatch(filterPlayer))} className={btn}>
            <Plus className="h-4 w-4" /> Add Match
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#181818] overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-sm text-[#A0A0A0] animate-pulse">Loading matches…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#A0A0A0]">No matches recorded yet.</div>
        ) : (
          <table className="w-full text-sm min-w-[900px]">
            <thead className="text-[10px] uppercase tracking-[0.18em] text-[#A0A0A0]">
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-3">Date</th>
                <th className="text-left">Player</th>
                <th className="text-left">Hero</th>
                <th className="text-left">Role</th>
                <th>Result</th>
                <th>KDA</th>
                <th>Gold</th>
                <th>HD</th>
                <th>MVP</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id} className={i % 2 ? "bg-[#121212]" : ""}>
                  <td className="py-2 px-3 text-xs">{m.match_date}</td>
                  <td className="font-semibold">{playerName(m.player_id)}</td>
                  <td>{m.hero}</td>
                  <td className="text-[10px] text-[#8B3DFF] font-bold tracking-widest">{m.role}</td>
                  <td className="text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.result === "WIN" ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                      {m.result}
                    </span>
                  </td>
                  <td className="text-center font-mono">{m.kills}/{m.deaths}/{m.assists}</td>
                  <td className="text-center font-mono text-amber-400">{m.gold.toLocaleString()}</td>
                  <td className="text-center font-mono">{m.hero_damage.toLocaleString()}</td>
                  <td className="text-center">{m.is_mvp && <Crown className="inline h-4 w-4 text-amber-400" />}</td>
                  <td className="pr-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setEditing(m)} className={btnGhost}><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => del(m.id)} className={btnGhost + " hover:text-[#FF3B3B]"}><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-[#080808]/80 backdrop-blur-md" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#181818] p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-extrabold">{editing.id ? "EDIT MATCH" : "NEW MATCH"}</h3>
              <button onClick={() => setEditing(null)} className={btnGhost}><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldL label="Player">
                <select className={input} value={editing.player_id} onChange={(e) => setEditing({ ...editing, player_id: e.target.value })}>
                  <option value="">Select…</option>
                  {profiles.map((p) => <option key={p.id} value={p.id}>{p.ign || p.display_name}</option>)}
                </select>
              </FieldL>
              <FieldL label="Date"><input type="date" className={input} value={editing.match_date} onChange={(e) => setEditing({ ...editing, match_date: e.target.value })} /></FieldL>
              <FieldL label="Hero"><input className={input} value={editing.hero} onChange={(e) => setEditing({ ...editing, hero: e.target.value })} /></FieldL>
              <FieldL label="Role">
                <select className={input} value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })}>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </FieldL>
              <FieldL label="Result">
                <select className={input} value={editing.result} onChange={(e) => setEditing({ ...editing, result: e.target.value as "WIN" | "LOSE" })}>
                  <option>WIN</option><option>LOSE</option>
                </select>
              </FieldL>
              <FieldL label="Battle ID"><input className={input} value={editing.battle_id ?? ""} onChange={(e) => setEditing({ ...editing, battle_id: e.target.value })} /></FieldL>
              <FieldL label="Kills"><input type="number" className={input} value={editing.kills} onChange={(e) => setEditing({ ...editing, kills: +e.target.value })} /></FieldL>
              <FieldL label="Deaths"><input type="number" className={input} value={editing.deaths} onChange={(e) => setEditing({ ...editing, deaths: +e.target.value })} /></FieldL>
              <FieldL label="Assists"><input type="number" className={input} value={editing.assists} onChange={(e) => setEditing({ ...editing, assists: +e.target.value })} /></FieldL>
              <FieldL label="Gold"><input type="number" className={input} value={editing.gold} onChange={(e) => setEditing({ ...editing, gold: +e.target.value })} /></FieldL>
              <FieldL label="Hero Damage"><input type="number" className={input} value={editing.hero_damage} onChange={(e) => setEditing({ ...editing, hero_damage: +e.target.value })} /></FieldL>
              <FieldL label="Turret Damage"><input type="number" className={input} value={editing.turret_damage} onChange={(e) => setEditing({ ...editing, turret_damage: +e.target.value })} /></FieldL>
              <FieldL label="Damage Taken"><input type="number" className={input} value={editing.damage_taken} onChange={(e) => setEditing({ ...editing, damage_taken: +e.target.value })} /></FieldL>
              <FieldL label="Teamfight %"><input type="number" max={100} className={input} value={editing.teamfight_participation} onChange={(e) => setEditing({ ...editing, teamfight_participation: +e.target.value })} /></FieldL>
              <FieldL label="Duration (min)"><input type="number" step="0.1" className={input} value={editing.duration_minutes ?? ""} onChange={(e) => setEditing({ ...editing, duration_minutes: e.target.value ? +e.target.value : null })} /></FieldL>
              <FieldL label="MVP">
                <label className="inline-flex items-center gap-2 h-10 text-sm">
                  <input type="checkbox" checked={editing.is_mvp} onChange={(e) => setEditing({ ...editing, is_mvp: e.target.checked })} /> Yes
                </label>
              </FieldL>
              <div className="col-span-2">
                <FieldL label="Notes">
                  <textarea rows={2} className={input + " h-auto py-2"} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
                </FieldL>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className={btnGhost}>Cancel</button>
              <button onClick={save} className={btn}><Save className="h-4 w-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldL({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-[0.18em] text-[#A0A0A0] mb-1">{label.toUpperCase()}</label>
      {children}
    </div>
  );
}
