import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { Play } from "lucide-react";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import n1 from "@/assets/news-1.jpg";
import n2 from "@/assets/news-2.jpg";
import n3 from "@/assets/news-3.jpg";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media — DeathSirens Esports" },
      { name: "description", content: "Photos, highlights and behind-the-scenes content from the DeathSirens Mobile Legends squad." },
      { property: "og:title", content: "DeathSirens Media" },
      { property: "og:description", content: "Photos, highlights and behind-the-scenes from the squad." },
    ],
  }),
  component: MediaPage,
});

const items = [
  { src: g1, video: true }, { src: n1, video: false },
  { src: g2, video: true }, { src: n2, video: false },
  { src: g3, video: false }, { src: n3, video: true },
  { src: g4, video: false },
];

function MediaPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-8">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ GALLERY</span>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-extrabold">MEDIA</h1>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((it, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg group">
              <img src={it.src} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
              {it.video && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#00B8FF] text-[#080808]">
                    <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
