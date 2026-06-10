import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import { ParticleField } from "@/components/home/ParticleField";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        width={1920}
        height={1088}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(139,61,255,0.18),transparent_60%),linear-gradient(to_bottom,rgba(8,8,8,0.55),#080808_85%)]" />

      {/* Animated particle network */}
      <ParticleField className="-z-10 opacity-90" />



      {/* Side watermark */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden md:flex items-center overflow-hidden">
        <span className="rotate-180 [writing-mode:vertical-rl] font-display text-[10rem] leading-none font-extrabold tracking-[0.4em] text-white/[0.03] select-none">
          DARKSTAR
        </span>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden md:flex items-center overflow-hidden">
        <span className="[writing-mode:vertical-rl] font-display text-[10rem] leading-none font-extrabold tracking-[0.4em] text-white/[0.03] select-none">
          DARKSTAR
        </span>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center md:py-32">
        <img
          src={logo}
          alt="Darkstar"
          width={180}
          height={180}
          className="h-32 w-32 md:h-44 md:w-44 object-contain drop-shadow-[0_0_30px_rgba(139,61,255,0.6)]"
          style={{ animation: "float-slow 6s ease-in-out infinite" }}
        />
        <h1 className="mt-8 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
          NIGERIA'S ELITE
          <br />
          <span className="text-gradient-brand">MOBILE LEGENDS</span> SQUAD
        </h1>
        <p className="mt-6 italic font-bold text-base md:text-xl text-[#A0A0A0]">
          Competing. Dominating. Building Champions.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            to="/contact"
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#8B3DFF] px-7 font-display text-sm font-bold uppercase tracking-[0.18em] shadow-[0_0_24px_rgba(139,61,255,0.5)] transition hover:brightness-110 hover:shadow-[0_0_36px_rgba(139,61,255,0.8)]"
          >
            Join the Squad
          </Link>
          <Link
            to="/roster"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/80 px-7 font-display text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#080808]"
          >
            View Roster
          </Link>
        </div>
      </div>
    </section>
  );
}
