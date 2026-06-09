import { Link } from "@tanstack/react-router";
import { ArrowRight, Play, ChevronLeft, ChevronRight, MessageCircle, Send, Instagram, Music2, Facebook, Twitter } from "lucide-react";
import { useState } from "react";
import { news } from "@/data/news";
import { players } from "@/data/players";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import mvpImg from "@/assets/mvp.jpg";

const gallery = [
  { src: g1, video: false },
  { src: g2, video: true },
  { src: g3, video: false },
  { src: g4, video: true },
];

export function BottomGrid() {
  const mvpPool = players.slice(0, 4);
  const [mvpIdx, setMvpIdx] = useState(0);
  const mvp = mvpPool[mvpIdx];
  const cyclePool = [{ ...mvp, photo: mvpImg }, ...mvpPool.slice(1)];
  const featured = mvpIdx === 0 ? cyclePool[0] : mvpPool[mvpIdx];

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-20">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* News */}
        <div className="rounded-xl border border-white/5 bg-[#181818] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-extrabold tracking-wider">LATEST NEWS</h3>
            <Link to="/news" className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B8FF] inline-flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="space-y-4">
            {news.map((n) => (
              <li key={n.title} className="flex gap-3 group">
                <img src={n.image} alt="" className="h-16 w-20 flex-none rounded-md object-cover" width={80} height={64} loading="lazy" />
                <div>
                  <p className="text-sm font-semibold leading-snug text-white group-hover:text-[#00B8FF] transition-colors line-clamp-2">{n.title}</p>
                  <p className="mt-1 text-[11px] text-[#A0A0A0]">{n.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Media gallery */}
        <div className="rounded-xl border border-white/5 bg-[#181818] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-extrabold tracking-wider">MEDIA GALLERY</h3>
            <Link to="/media" className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B8FF] inline-flex items-center gap-1">
              View Gallery <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {gallery.map((g, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-md group">
                <img src={g.src} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" width={300} height={300} loading="lazy" />
                {g.video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#00B8FF] text-[#080808]">
                      <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MVP Spotlight */}
        <div className="rounded-xl border border-white/5 bg-[#181818] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-extrabold tracking-wider">MVP SPOTLIGHT</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setMvpIdx((i) => (i - 1 + mvpPool.length) % mvpPool.length)}
                aria-label="Previous"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/80 hover:text-[#00B8FF] hover:border-[#00B8FF]/60"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMvpIdx((i) => (i + 1) % mvpPool.length)}
                aria-label="Next"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/80 hover:text-[#00B8FF] hover:border-[#00B8FF]/60"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-md">
            <img src={featured.photo} alt={featured.ign} className="h-full w-full object-cover" width={400} height={500} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="font-display text-xl font-extrabold uppercase">{featured.ign}</div>
              <div className="text-[11px] text-[#A0A0A0]">MVP — Playoffs Week 4</div>
            </div>
          </div>
        </div>

        {/* Community */}
        <div className="rounded-xl border border-white/5 bg-[#181818] p-5">
          <h3 className="font-display text-lg font-extrabold tracking-wider mb-4">COMMUNITY</h3>
          <p className="text-sm text-[#A0A0A0] mb-5">Join our growing community of fans, scrim partners, and aspiring pros.</p>
          <div className="space-y-2">
            <a href="#" className="flex items-center justify-center gap-2 h-11 rounded-md bg-[#1e2a78] font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:brightness-110 transition">
              <MessageCircle className="h-4 w-4" /> Join Discord
            </a>
            <a href="#" className="flex items-center justify-center gap-2 h-11 rounded-md bg-[#1aa64b] font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:brightness-110 transition">
              <Send className="h-4 w-4" /> WhatsApp Group
            </a>
          </div>
          <div className="mt-5 flex items-center gap-2">
            {[Instagram, Music2, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-white/80 hover:text-[#00B8FF] hover:border-[#00B8FF]/60 transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
