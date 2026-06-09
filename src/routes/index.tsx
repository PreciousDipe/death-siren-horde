import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { AboutSection } from "@/components/home/AboutSection";
import { RosterPreview } from "@/components/home/RosterPreview";
import { BottomGrid } from "@/components/home/BottomGrid";
import { WhyJoin } from "@/components/home/WhyJoin";
import { CtaTrio } from "@/components/home/CtaTrio";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DeathSirens — Nigeria's Elite Mobile Legends Esports Squad" },
      { name: "description", content: "DeathSirens is Nigeria's premier Mobile Legends esports organization. Competing, dominating, and building champions on the global stage." },
      { property: "og:title", content: "DeathSirens Esports" },
      { property: "og:description", content: "Nigeria's elite Mobile Legends squad — competing, dominating, building champions." },
      { property: "og:image", content: logo },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <StatsBar />
      <AboutSection />
      <RosterPreview />
      <BottomGrid />
      <WhyJoin />
      <CtaTrio />
    </SiteShell>
  );
}
