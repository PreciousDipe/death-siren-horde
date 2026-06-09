import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { toast } from "sonner";

export function CtaTrio() {
  const [email, setEmail] = useState("");

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-20">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-[#181818] p-8 text-center hover-glow-purple">
          <h3 className="font-display text-xl font-extrabold tracking-wider">RECRUITMENT</h3>
          <p className="mt-3 text-sm text-[#A0A0A0]">
            We are always looking for talented and dedicated players to join the squad.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#8B3DFF] px-6 font-display text-xs font-bold uppercase tracking-[0.18em] text-white"
          >
            Apply to Join
          </Link>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#181818] p-8 text-center hover-glow-blue">
          <h3 className="font-display text-xl font-extrabold tracking-wider">TOURNAMENT REGISTRATION</h3>
          <p className="mt-3 text-sm text-[#A0A0A0]">
            Register your team for upcoming tournaments and community events.
          </p>
          <Link
            to="/tournaments"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md border border-white px-6 font-display text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-white hover:text-[#080808]"
          >
            Register Team
          </Link>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#181818] p-8 text-center hover-glow-blue">
          <h3 className="font-display text-xl font-extrabold tracking-wider">STAY UPDATED</h3>
          <p className="mt-3 text-sm text-[#A0A0A0]">
            Subscribe to our newsletter for roster news, schedules and results.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes("@")) {
                toast.error("Enter a valid email");
                return;
              }
              toast.success("Subscribed! Welcome to the Siren network.");
              setEmail("");
            }}
            className="mt-6 flex items-center gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-11 flex-1 rounded-md border border-white/10 bg-[#121212] px-3 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#00B8FF]"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#00B8FF] text-[#080808] hover:brightness-110"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
