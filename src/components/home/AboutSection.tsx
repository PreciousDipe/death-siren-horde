import { Link } from "@tanstack/react-router";

export function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-20">
      <div className="max-w-3xl">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">
          / ABOUT US
        </span>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold">
          ABOUT <span className="text-gradient-brand">DEATHSIRENS</span>
        </h2>
        <p className="mt-6 text-base md:text-lg leading-relaxed text-[#A0A0A0]">
          DeathSirens is Nigeria's premier Mobile Legends esports organization,
          founded to give African talent a real stage on the global circuit. We
          compete at the highest levels of MPL and international invitationals,
          building a roster of disciplined athletes, world-class coaches, and a
          community that bleeds the colors. From Lagos to the world — we are the
          siren they hear before the storm.
        </p>
        <Link
          to="/achievements"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md border border-[#00B8FF] px-6 font-display text-xs font-bold uppercase tracking-[0.2em] text-[#00B8FF] transition hover:bg-[#00B8FF] hover:text-[#080808]"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}
