import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import deathsirenBg from "@/assets/darkstar_group.png";
import deathsirenTeam from "@/assets/death_siren_bg.png";
import { ParticleField } from "@/components/home/ParticleField";

const slides = [
  { image: heroBg, alt: "Darkstar Hero" },
  { image: deathsirenBg, alt: "Darkstar Background" },
  { image: deathsirenTeam, alt: "Darkstar Team" },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCurrent(0);
      return;
    }
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isMobile]);

  return (
    <section className="relative isolate overflow-hidden w-full transition-all duration-1000">

      {/* FIXED FRAME FOR IMAGES AND WATERMARKS */}
      <div className="relative -z-10 w-full">
        {/* Slider Images */}
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.image}
            alt={slide.alt}
            className={`w-full transition-all duration-1000 ease-out ${
              // The active image controls the height layout (relative), inactive ones float behind (absolute)
              i === current ? "relative block" : "absolute inset-0 invisible"
            } ${
              i === 0 
                ? "object-cover object-center h-[90vh] lg:h-screen" // Slide 0: Main homepage logo view
                : i === 1 
                  ? "object-contain object-top bg-[#080808] h-auto max-h-[75vh]" // Slide 1: Fits all 5 people completely
                  : "object-cover object-[center_25%] h-[180vh]" // Slide 2: Full screen format, focused on faces
            } ${
              i === current
                ? `${i === 1 || i === 2 ? "opacity-100" : "opacity-30"} scale-100`
                : "opacity-0 scale-105"
              }`}
            width={1920}
            height={1100}
          />
        ))}

        {/* Side watermarks - STARTED DIRECTLY UNDER NAVBAR */}
        <div className="pointer-events-none absolute bottom-0 top-[10px] left-0 z-0 hidden md:flex items-start overflow-hidden w-fit">
          <span className="rotate-180 [writing-mode:vertical-rl] font-display text-[10rem] leading-none font-extrabold tracking-[0.4em] text-white/[0.03] select-none pt-4">
            DARK
          </span>
        </div>
        <div className="pointer-events-none absolute bottom-0 top-[0px] right-0 z-0 hidden md:flex items-start justify-end overflow-hidden w-fit ml-auto">
          <span className="[writing-mode:vertical-rl] font-display text-[10rem] leading-none font-extrabold tracking-[0.4em] text-white/[0.03] select-none pt-4">
            STAR
          </span>
        </div>
      </div>

      {/* Dark Overlay Layer - Clear for BOTH group images */}
      <div className={`absolute inset-0 -z-10 transition-colors duration-1000 ${
        current === 1 || current === 2 
          ? "bg-black/30" // Keeps both photos completely clear and crisp
          : "bg-[radial-gradient(ellipse_at_center,rgba(139,61,255,0.18),transparent_60%),linear-gradient(to_bottom,rgba(8,8,8,0.55),#080808_85%)]"
      }`} />

      {/* Animated particle network */}
      <ParticleField className="-z-10 opacity-90" />
      

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-[#00B8FF]"
                : "w-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Hero Content - Fades out on BOTH group pictures */}
      <div className={`mx-auto absolute inset-x-0 top-0 flex max-w-5xl flex-col items-center px-4 py-20 text-center md:py-32 transition-opacity duration-1000 ${
        current === 1 || current === 2 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}>
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
          Building Champions for Global Stage.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            to="/contact"
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#8B3DFF] px-7 font-display text-sm font-bold uppercase tracking-[0.18em] shadow-[0_0_24px_rgba(139,61,255,0.5)] transition hover:brightness-110 hover:shadow-[0_0_36px_rgba(139,61,255,0.8)]"
          >
            Join Darkstar
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
