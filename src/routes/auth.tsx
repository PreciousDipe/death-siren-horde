import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/layout/SiteShell";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Team Login — Darkstar" },
      { name: "description", content: "Darkstar team member login and signup." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/profile" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/auth",
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (data.user && !data.session) {
          toast.success("Account created. Check your email to confirm, then wait for admin approval.");
        } else {
          toast.success("Account created. Awaiting admin approval before you can edit.");
          navigate({ to: "/profile" });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
        navigate({ to: "/profile" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "h-11 w-full rounded-md border border-white/10 bg-[#121212] px-3 text-sm text-white outline-none focus:border-[#00B8FF] focus:ring-1 focus:ring-[#00B8FF]/40";

  return (
    <SiteShell>
      <section className="mx-auto max-w-md px-4 md:px-6 py-20">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ TEAM ACCESS</span>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-extrabold">
          {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {mode === "signin"
            ? "Team members only."
            : "New accounts require admin approval before edits go live."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Display Name</label>
              <input className={input} value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Email</label>
            <input type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Password</label>
            <input type="password" minLength={6} className={input} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#8B3DFF] font-display text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(139,61,255,0.5)] transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-center text-sm text-white/60 hover:text-[#00B8FF]"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs uppercase tracking-widest text-white/40 hover:text-white/70">
            ← Back to site
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
