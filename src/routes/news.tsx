import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { useNews } from "@/lib/hooks/use-team-data";
import { Skeleton } from "@/components/ui/skeleton";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — Darkstar Esports" },
      { name: "description", content: "Latest Darkstar news — roster updates, results, signings and announcements." },
      { property: "og:title", content: "Darkstar News" },
      { property: "og:description", content: "Roster updates, results, signings and announcements." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data: news = [], isLoading, error } = useNews();

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-8">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">/ NEWSROOM</span>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-extrabold">LATEST NEWS</h1>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        {error ? (
          <p className="text-center text-[#FF3B3B] py-12">Couldn't load news. Please refresh.</p>
        ) : isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-[#181818] overflow-hidden">
                <Skeleton className="aspect-video w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <p className="text-center text-[#A0A0A0] py-12">No news posted yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <article key={n.id} className="overflow-hidden rounded-xl border border-white/5 bg-[#181818] hover-glow-blue">
                <img
                  src={n.image || logo}
                  alt=""
                  className="aspect-video w-full object-cover bg-[#0c0c0c]"
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = logo; }}
                />
                <div className="p-5">
                  <div className="text-[11px] font-bold tracking-[0.2em] text-[#A0A0A0]">{n.date}</div>
                  <h3 className="mt-2 font-display text-lg font-bold tracking-wider">{n.title}</h3>
                  <p className="mt-3 text-sm text-[#A0A0A0] line-clamp-3">
                    {n.content || "Full story coming soon — follow our community channels for live updates."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
