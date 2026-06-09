import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { news } from "@/data/news";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — DeathSirens Esports" },
      { name: "description", content: "Latest DeathSirens news — roster updates, results, signings and announcements." },
      { property: "og:title", content: "DeathSirens News" },
      { property: "og:description", content: "Roster updates, results, signings and announcements." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-8">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ NEWSROOM</span>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-extrabold">LATEST NEWS</h1>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <article key={n.title} className="overflow-hidden rounded-xl border border-white/5 bg-[#181818] hover-glow-blue">
              <img src={n.image} alt="" className="aspect-video w-full object-cover" loading="lazy" />
              <div className="p-5">
                <div className="text-[11px] font-bold tracking-[0.2em] text-[#A0A0A0]">{n.date}</div>
                <h3 className="mt-2 font-display text-lg font-bold tracking-wider">{n.title}</h3>
                <p className="mt-3 text-sm text-[#A0A0A0] line-clamp-3">
                  Full story coming soon — follow our community channels for live updates and the inside scoop from the squad.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
