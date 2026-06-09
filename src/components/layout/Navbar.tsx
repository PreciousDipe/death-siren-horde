import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/roster", label: "Roster" },
  { to: "/tournaments", label: "Tournaments" },
  { to: "/achievements", label: "Achievements" },
  { to: "/media", label: "Media" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        scrolled
          ? "border-white/10 bg-[#080808]/90 backdrop-blur-md"
          : "border-transparent bg-[#080808]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="DeathSirens logo"
            className="h-9 w-9 object-contain drop-shadow-[0_0_8px_rgba(139,61,255,0.6)] transition-transform group-hover:scale-105"
            width={36}
            height={36}
          />
          <span className="font-display text-lg font-extrabold tracking-widest text-white">
            DEATHSIRENS
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-[#00B8FF]" }}
              className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-white/80 transition-colors hover:text-[#00B8FF]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center justify-center rounded-md bg-[#8B3DFF] px-4 h-11 font-display text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_0_18px_rgba(139,61,255,0.4)] transition-all hover:brightness-110 hover:shadow-[0_0_28px_rgba(139,61,255,0.7)]"
          >
            Join the Squad
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-[#121212] text-white"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden border-t border-white/5 bg-[#0c0c0c] transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-[#00B8FF]" }}
              className="py-3 font-display text-sm font-semibold uppercase tracking-[0.18em] text-white/85 border-b border-white/5 last:border-0"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex items-center justify-center rounded-md bg-[#8B3DFF] h-11 font-display text-xs font-bold uppercase tracking-[0.16em] text-white"
          >
            Join the Squad
          </Link>
        </nav>
      </div>
    </header>
  );
}
