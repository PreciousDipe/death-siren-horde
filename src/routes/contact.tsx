import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/lib/hooks/use-team-data";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Apply — Darkstar Esports" },
      { name: "description", content: "Apply to join the Darkstar roster, reach out for partnerships, or contact the team." },
      { property: "og:title", content: "Contact Darkstar" },
      { property: "og:description", content: "Apply, partner, or just say hi to the squad." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", role: "", ign: "", message: "" });
  const [honeypot, setHoneypot] = useState(""); // bots fill this hidden field
  const [mountedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const { data: settings } = useSiteSettings();
  const contactEmail = settings?.contact_email?.trim() || "";
  const discordUrl = settings?.discord?.trim() || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Bot checks — silently accept honeypot fills, block sub-3s submits
    if (honeypot.trim() !== "") {
      toast.success("Thanks! The squad will reach out via email soon.");
      setForm({ name: "", email: "", role: "", ign: "", message: "" });
      return;
    }
    if (Date.now() - mountedAt < 3000) {
      toast.error("Please take a moment to review before sending.");
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (name.length < 2 || name.length > 120) return toast.error("Name must be 2–120 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return toast.error("Please enter a valid email address.");
    if (message.length < 10) return toast.error("Message must be at least 10 characters.");
    if (message.length > 4000) return toast.error("Message must be under 4000 characters.");

    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: name.slice(0, 120),
        email: email.slice(0, 255),
        role: form.role || null,
        ign: form.ign.trim() || null,
        message: message.slice(0, 4000),
      });
      if (error) throw error;
      toast.success("Thanks! The squad will reach out via email soon.");
      setForm({ name: "", email: "", role: "", ign: "", message: "" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-8">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ JOIN DARKSTAR</span>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-extrabold">CONTACT US</h1>
        <p className="mt-3 italic font-semibold text-[#A0A0A0]">Apply for a tryout, partner with us, or just say hi.</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/5 bg-[#181818] p-6 md:p-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Your Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Role" type="select" value={form.role} onChange={(v) => setForm({ ...form, role: v })} options={["Marksman", "Mage", "Jungle", "Roam", "Exp", "Other / Partnership"]} />
            <Field label="In-Game Name (IGN)" value={form.ign} onChange={(v) => setForm({ ...form, ign: v })} />
          </div>
          <div>
            <label className="text-[11px] font-bold tracking-[0.2em] text-[#A0A0A0]">MESSAGE</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              maxLength={4000}
              required
              className="mt-2 w-full rounded-md border border-white/10 bg-[#121212] px-3 py-2 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#00B8FF]"
              placeholder="Tell us about your experience playing Mobile Legends and why you're interested in joining Darkstar..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#8B3DFF] px-8 font-display text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(139,61,255,0.5)] hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Submit Application"}
          </button>
          <p className="text-[11px] text-[#A0A0A0]">
            Your email will be used only to respond to your message{contactEmail ? <>. We'll reply from <span className="text-white/80">{contactEmail}</span></> : ""}.
          </p>
        </form>

        <aside className="space-y-3">
          {[
            contactEmail ? { Icon: Mail, label: "Email", value: contactEmail } : null,
            discordUrl ? { Icon: MessageCircle, label: "Discord", value: discordUrl } : null,
          ].filter((x): x is { Icon: typeof Mail; label: string; value: string } => x !== null).map(({ Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-white/5 bg-[#181818] p-4 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#00B8FF]/10 text-[#00B8FF] ring-1 ring-[#00B8FF]/30">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold tracking-[0.2em] text-[#A0A0A0]">{label}</div>
                <div className="text-sm font-semibold truncate">{value}</div>
              </div>
            </div>
          ))}
          {!contactEmail && !discordUrl && (
            <div className="rounded-xl border border-white/5 bg-[#181818] p-4 text-xs text-[#A0A0A0]">
              Contact details will appear here once an admin adds them in the dashboard.
            </div>
          )}
        </aside>

      </section>
    </SiteShell>
  );
}


function Field({
  label,
  value,
  onChange,
  type = "text",
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "select";
  options?: string[];
}) {
  return (
    <div>
      <label className="text-[11px] font-bold tracking-[0.2em] text-[#A0A0A0]">{label.toUpperCase()}</label>
      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#121212] px-3 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#00B8FF]"
        >
          <option value="" disabled>
            Select a role
          </option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#121212] px-3 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#00B8FF]"
        />
      )}
    </div>
  );
}
