import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/layout/SiteShell";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Team Login — Darkstar" },
      { name: "description", content: "Darkstar team member login." },
    ],
  }),
  // Intercept the route before it loads to prevent layout flicker
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({
        to: "/profile",
      });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Signed in successfully.");
      navigate({ to: "/profile" });
    } catch (err: any) {
      toast.error(err.message ?? "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "h-11 w-full rounded-md border border-white/10 bg-[#121212] px-3 text-sm text-white outline-none focus:border-[#00B8FF] focus:ring-1 focus:ring-[#00B8FF]/40";

  return (
    <SiteShell>
      <section className="mx-auto max-w-md px-4 md:px-6 py-20">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">
          / TEAM ACCESS
        </span>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-extrabold">
          TEAM LOGIN
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Please log in using the credentials provided by your administrator.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">
              Email
            </label>
            <input
              type="email"
              className={input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">
              Password
            </label>
            <input
              type="password"
              className={input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#8B3DFF] font-display text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(139,61,255,0.5)] transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Need an account? Contact your admin or email{" "}
          <a
            href="mailto:darkstaresports1@gmail.com"
            className="text-[#00B8FF] hover:underline"
          >
            Darkstar Squad Leader
          </a>
        </p>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-xs uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}