import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import {
  MessageCircle,
  Instagram,
  Facebook,
  Music2,
  Twitter,
  Send,
} from "lucide-react";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/roster", label: "Roster" },
  { to: "/tournaments", label: "Tournaments" },
  { to: "/achievements", label: "Achievements" },
  { to: "/media", label: "Media" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="relative bg-[#080808] mt-24">
      <div className="h-[2px] w-full bg-gradient-brand" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-9 w-9" width={36} height={36} loading="lazy" />
            <span className="font-display text-lg font-extrabold tracking-widest">
              DEATHSIRENS
            </span>
          </div>
          <p className="text-sm text-[#A0A0A0] italic font-semibold max-w-xs">
            Competing. Dominating. Building Champions.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] text-white/90 mb-4">
            QUICK LINKS
          </h4>
          <ul className="grid grid-cols-2 gap-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-[#00B8FF] hover:underline underline-offset-4"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4">
          <div className="flex items-center gap-2">
            {[
              { Icon: MessageCircle, label: "Discord" },
              { Icon: Send, label: "WhatsApp" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Music2, label: "TikTok" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Twitter, label: "X" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-[#121212] text-white/80 transition hover:text-[#00B8FF] hover:border-[#00B8FF]/60"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-xs text-[#A0A0A0]">
            © {new Date().getFullYear()} DeathSirens Esports. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
