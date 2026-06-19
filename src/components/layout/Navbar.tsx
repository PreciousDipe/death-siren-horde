import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  {
    to: "#",
    label: "Team",
    dropdown: [
      { to: "/darkstar", label: "Darkstar" },
      { to: "/deathsiren", label: "Deathsiren" },
    ],
  },
  { to: "/tournaments", label: "Tournaments" },
  { to: "/stats", label: "Stats" },
  { to: "/achievements", label: "Achievements" },
  { to: "/media", label: "Media" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

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
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={logo}
            alt="Darkstar logo"
            className="h-9 w-9 object-contain drop-shadow-[0_0_8px_rgba(139,61,255,0.6)] transition-transform group-hover:scale-105"
            width={36}
            height={36}
          />
          <span className="font-display text-base font-extrabold tracking-widest text-white">
            DARKSTAR
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 mx-4">
          {links.map((l) => {
            if ("dropdown" in l) {
              return (
                <div
                  key={l.label}
                  className="relative group/dropdown h-16 flex items-center"
                >
                  <button className="flex items-center gap-1 font-display text-xs font-semibold uppercase tracking-[0.08em] text-white/80 transition-colors group-hover/dropdown:text-[#00B8FF]">
                    {l.label}
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover/dropdown:rotate-180" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover/dropdown:block w-44 rounded-md border border-white/10 bg-[#0c0c0c] p-2 shadow-xl">
                    {l.dropdown.map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        className="block rounded-sm px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.08em] text-white/70 transition-colors hover:bg-white/5 hover:text-[#00B8FF]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-[#00B8FF]" }}
                className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-white/80 transition-colors hover:text-[#00B8FF] whitespace-nowrap"
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/auth"
            className="hidden md:inline-flex items-center justify-center rounded-md border border-white/15 px-3 h-9 font-display text-xs font-bold uppercase tracking-[0.08em] text-white/85 hover:bg-white/5 hover:text-[#00B8FF] whitespace-nowrap transition-colors"
          >
            Team Login
          </Link>
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center justify-center rounded-md bg-[#8B3DFF] px-3 h-9 font-display text-xs font-bold uppercase tracking-[0.08em] text-white whitespace-nowrap shadow-[0_0_18px_rgba(139,61,255,0.4)] transition-all hover:brightness-110 hover:shadow-[0_0_28px_rgba(139,61,255,0.7)]"
          >
            Join DARKSTAR
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-[#121212] text-white"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden overflow-hidden border-t border-white/5 bg-[#0c0c0c] transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3">
          {links.map((l) => {
            if ("dropdown" in l) {
              return (
                <div key={l.label} className="border-b border-white/5">
                  <button
                    type="button"
                    onClick={() => setMobileDropdownOpen((v) => !v)}
                    className="flex w-full items-center justify-between py-3 font-display text-sm font-semibold uppercase tracking-[0.08em] text-white/85"
                  >
                    {l.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        mobileDropdownOpen
                          ? "rotate-180 text-[#00B8FF]"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Mobile Dropdown */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out pl-4 ${
                      mobileDropdownOpen
                        ? "max-h-24 opacity-100 pb-2"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {l.dropdown.map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        onClick={() => {
                          setOpen(false);
                          setMobileDropdownOpen(false);
                        }}
                        className="block py-2 font-display text-xs font-bold uppercase tracking-[0.08em] text-white/60 hover:text-[#00B8FF]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-[#00B8FF]" }}
                className="py-3 font-display text-sm font-semibold uppercase tracking-[0.08em] text-white/85 border-b border-white/5 last:border-0"
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex items-center justify-center rounded-md border border-white/15 h-10 font-display text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-white/5 hover:text-[#00B8FF] transition-colors"
          >
            Team Login
          </Link>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-[#8B3DFF] h-10 font-display text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_18px_rgba(139,61,255,0.4)]"
          >
            Join DARKSTAR
          </Link>
        </nav>
      </div>
    </header>
  );
}