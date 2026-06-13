import { Link } from "@tanstack/react-router";

export function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-20">
      <div className="max-w-3xl">
        <span className="text-xs font-bold tracking-[0.3em] text-[#00B8FF]">
          / ABOUT US
        </span>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold">
          ABOUT <span className="text-gradient-brand">DARKSTAR</span>
        </h2>
        <p className="mt-6 text-base md:text-lg leading-relaxed text-[#A0A0A0]">
          Darkstar is Nigeria's leading Mobile Legends esports team, 
          built to showcase African talent on the global stage. 
          We're a community of elite players, passionate fans, 
          and relentless competitors driven by one mission, to put Nigerian MLBB at the top. 
          Through discipline, structured teamwork, and a ruthless commitment to improvement, 
          we compete at the highest level while building a movement that inspires the next generation of African esports champions.
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
