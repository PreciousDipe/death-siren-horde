import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Mail, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Msg = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  ign: string | null;
  message: string;
  handled: boolean;
  created_at: string;
};

const btnGhost = "inline-flex items-center gap-2 h-9 px-3 rounded-md text-xs font-semibold bg-[#181818] border border-white/10 hover:text-[#00B8FF]";

export function MessagesTab() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setMsgs((data as Msg[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { reload(); }, []);

  async function toggle(m: Msg) {
    const { error } = await supabase.from("contact_messages").update({ handled: !m.handled }).eq("id", m.id);
    if (error) return toast.error(error.message);
    reload();
  }
  async function del(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    reload();
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-extrabold">INBOX</h3>
        <p className="text-xs text-[#A0A0A0]">Messages submitted through the contact form.</p>
      </div>
      {loading ? (
        <div className="rounded-xl border border-white/5 bg-[#181818] p-8 text-center text-sm text-[#A0A0A0] animate-pulse">Loading…</div>
      ) : msgs.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-[#181818] p-8 text-center text-sm text-[#A0A0A0]">No messages yet.</div>
      ) : (
        <ul className="space-y-3">
          {msgs.map((m) => (
            <li key={m.id} className={`rounded-xl border p-5 ${m.handled ? "border-white/5 bg-[#121212] opacity-70" : "border-[#00B8FF]/20 bg-[#181818]"}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold">{m.name}</span>
                    {m.role && <span className="text-[10px] uppercase tracking-widest text-[#8B3DFF] font-bold">{m.role}</span>}
                    {m.ign && <span className="text-xs text-[#A0A0A0]">IGN: {m.ign}</span>}
                  </div>
                  <a href={`mailto:${m.email}?subject=Re: Darkstar inquiry`} className="text-xs text-[#00B8FF] hover:underline inline-flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" /> {m.email}
                  </a>
                </div>
                <div className="text-[11px] text-[#A0A0A0]">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <p className="mt-3 text-sm text-white/90 whitespace-pre-wrap">{m.message}</p>
              <div className="mt-3 flex gap-2 justify-end">
                <button onClick={() => toggle(m)} className={btnGhost}>
                  <Check className="h-3.5 w-3.5" /> {m.handled ? "Mark unhandled" : "Mark handled"}
                </button>
                <button onClick={() => del(m.id)} className={btnGhost + " hover:text-[#FF3B3B]"}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
