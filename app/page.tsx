"use client";

import { useEffect, useRef, Fragment, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WorkList from "./components/WorkList";
import { scramble } from "./lib/scramble";
import { WORK_PROJECTS } from "./lib/data";
import { useLoader } from "./lib/loaderContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const HERO_TEXT =
  "SOFTWARE ENGINEER DRIVEN BY CURIOSITY AND TECHNICAL PRECISION. OVER THREE YEARS OF DEDICATED LEARNING AND HANDS-ON EXPERIENCE IN MODERN DEVELOPMENT. FOCUSING ON BUILDING SEAMLESS DIGITAL SOLUTIONS WHILE CONTINUOUSLY REFINING THE ART OF CLEAN CODE. EVERY LINE MATTERS. THE JOURNEY STARTS HERE.";

const ABOUT_TEXT =
  "Hi, I'm Ammar. A Software Engineer based in Indonesia with a deep focus on building robust web systems—from high-performance Next.js interfaces to complex Laravel backends. I thrive at the intersection of clean code and server infrastructure, ensuring every application I build is solid, secure, and scalable.";

const MARQUEE_ROW1 = ["Full-Stack Web Development", "Backend Engineering", "System Administration", "Clean Architecture", "API Design"];
const MARQUEE_ROW2 = ["Next.js", "Laravel", "Node.js", "Express.js", "TypeScript", "PostgreSQL", "Nginx", "Cloudflare Tunnels", "Docker"];

const TECH_LOGOS = [
  { src: "/nextjs.svg", alt: "Next.js" },
  { src: "/laravel.webp", alt: "Laravel" },
  { src: "/nginx.png", alt: "Nginx" },
  { src: "/nodejs.svg", alt: "Node.js" },
  { src: "/expressjs.svg", alt: "Express.js" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const [time, setTime] = useState("");
  const { ready } = useLoader();

  // Clock
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
          .format(new Date()).toUpperCase()
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Initial scramble — wait for loader
  useEffect(() => {
    if (!ready) return;
    scramble(heroNameRef.current, "Ammar Abdul Malik", 1.5);
  }, [ready]);

  // Main GSAP — wait for loader
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {

      // Intro timeline — animates header via .header-anim class
      gsap.timeline()
        .fromTo(".reveal-block",
          { scaleX: 0, transformOrigin: "left" },
          { scaleX: 1, duration: 0.7, ease: "power4.inOut", delay: 0.5 }
        )
        .set(".reveal-content", { opacity: 1 })
        .to(".reveal-block",
          { scaleX: 0, transformOrigin: "right", duration: 0.7, ease: "power4.inOut" }
        );

      // Hero words
      gsap.to(".hero-word", {
        opacity: 1, duration: 0.8,
        stagger: { each: 0.04, from: "random" },
        delay: 0.6,
      });

      // About scroll reveal
      gsap.to(".about-word", {
        scrollTrigger: { trigger: ".about-section", start: "top 50%", end: "top -20%", scrub: 0.5 },
        opacity: 1, stagger: 0.04,
      });

      // Marquee
      gsap.to(".marquee-track-1", {
        xPercent: -50, ease: "none",
        scrollTrigger: { trigger: ".marquee-section", start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.fromTo(".marquee-track-2",
        { xPercent: -50 },
        {
          xPercent: 0, ease: "none",
          scrollTrigger: { trigger: ".marquee-section", start: "top bottom", end: "bottom top", scrub: 1 }
        }
      );

      // Circle stroke
      gsap.fromTo(".circle-path",
        { strokeDasharray: 1000, strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          scrollTrigger: { trigger: ".circle-section", start: "top 80%", end: "top -30%", scrub: 0.4 }
        }
      );

      // Blink words — sekali saja
      gsap.to(".blink-word", {
        scrollTrigger: { trigger: ".circle-section", start: "top 30%", once: true },
        keyframes: [
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.1 },
          { opacity: 0.5, duration: 0.1 },
          { opacity: 1, duration: 0.3 },
        ],
        stagger: 0.15,
        ease: "none",
      });
      gsap.to(".blink-word-2", {
        scrollTrigger: { trigger: ".work-section", start: "top 60%", once: true },
        keyframes: [
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.1 },
          { opacity: 0.5, duration: 0.1 },
          { opacity: 1, duration: 0.3 },
        ],
        stagger: 0.25,
        ease: "none",
      });
      gsap.to(".blink-word-3", {
        scrollTrigger: { trigger: ".contact-section", start: "top 60%", once: true },
        keyframes: [
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.1 },
          { opacity: 0.5, duration: 0.1 },
          { opacity: 1, duration: 0.3 },
        ],
        stagger: 0.25,
        ease: "none",
      });

    }, containerRef);
    return () => ctx.revert();
  }, [ready]);

  // Work hover handlers moved to WorkList component

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white overflow-x-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black"
    >
      {/* Shared header — no activePage = home */}
      <Header />

      <main className="w-full">

        {/* ══ HERO ════════════════════════════════════════════════════════════ */}
        <section className="relative flex h-svh flex-col justify-start px-4 pt-[18vh] pb-8 md:px-16">
          <h1
            ref={heroNameRef}
            className="font-serif text-[clamp(1rem,6vw,3rem)] uppercase leading-none tracking-tight"
          />
          <div className="relative mt-2 inline-block overflow-hidden w-fit">
            <h2 className="reveal-content opacity-0 pl-4 font-sans text-[clamp(1rem,6vw,3rem)] font-semibold uppercase md:pl-16">
              Software Engineer
            </h2>
            <div className="reveal-block absolute inset-0 ml-4 scale-x-0 bg-black dark:bg-white md:ml-16" />
          </div>
          <div className="mt-32 flex justify-end">
            <p className="max-w-xs text-justify text-sm leading-relaxed text-zinc-400 dark:text-zinc-500 md:max-w-md">
              {HERO_TEXT.split(" ").map((word, i) => (
                <Fragment key={i}>
                  <span className="hero-word inline-block opacity-0">{word}</span>{" "}
                </Fragment>
              ))}
            </p>
          </div>
          <div className="absolute bottom-6 inset-x-0 px-8 md:px-16 flex items-end justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              Bogor, Indonesia
            </span>
            <div className="c-scrolldown" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              {time || "00:00 AM"}<span className="hidden md:inline"> (GMT +7)</span>
            </span>
          </div>
        </section>

        {/* ══ ABOUT ═══════════════════════════════════════════════════════════ */}
        <section className="about-section flex min-h-screen w-full items-center justify-center bg-white px-8 py-20 dark:bg-zinc-950 md:px-16">
          <div className="max-w-5xl w-full">
            <h2 className="text-xl font-semibold uppercase leading-snug md:text-4xl text-justify">
              {ABOUT_TEXT.split(" ").map((word, i) => (
                <Fragment key={i}>
                  <span className="about-word inline-block opacity-5">{word}</span>{" "}
                </Fragment>
              ))}
            </h2>
          </div>
        </section>

        {/* ══ MARQUEE ══════════════════════════════════════════════════════════ */}
        <section className="marquee-section overflow-hidden border-y border-zinc-200 py-10 dark:border-zinc-800 md:py-16">
          <div className="-rotate-1 border-y border-zinc-200 py-3 dark:border-zinc-800 md:py-6">
            <div className="marquee-track-1 flex whitespace-nowrap font-serif text-5xl uppercase leading-none md:text-7xl">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="pr-12">{MARQUEE_ROW1.join(" — ")} —</span>
              ))}
            </div>
          </div>
          <div className="-rotate-1 border-y border-zinc-200 py-3 dark:border-zinc-800 md:py-6">
            <div className="marquee-track-2 flex whitespace-nowrap font-mono text-sm uppercase leading-none tracking-widest opacity-30 md:text-base">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="pr-12">{MARQUEE_ROW2.join(" · ")} ·</span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CIRCLE ═══════════════════════════════════════════════════════════ */}
        <section className="circle-section flex min-h-screen flex-col items-center justify-center py-20">
          <div className="w-full max-w-xl px-4">
            <div className="relative mx-auto aspect-square w-full flex items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.3" className="opacity-10" />
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.8"
                  strokeLinecap="round" pathLength="1000" className="circle-path" />
              </svg>
              <div className="relative z-10 text-center">
                <h2 className="text-2xl font-semibold uppercase leading-tight md:text-4xl">
                  {["Always", "Growing, ", "One", "at", "a", "Time"].map((word, i) => (
                    <Fragment key={i}>
                      <span className="blink-word mx-1 inline-block opacity-0">
                        {word}{i === 1 ? "" : i === 0 ? "" : " "}
                      </span>
                      {i === 1 && <br />}
                    </Fragment>
                  ))}
                </h2>
              </div>
            </div>
            <div className="mt-16 text-center">
              <p className="mb-8 font-mono text-[10px] font-semibold uppercase tracking-widest opacity-40">
                Most Favorite Tech
              </p>
              <div className="group/logos flex flex-wrap items-center justify-center gap-10 md:gap-16">
                {TECH_LOGOS.map((t) => (
                  <img
                    key={t.alt}
                    src={t.src}
                    alt={t.alt}
                    className="h-7 w-auto object-contain grayscale opacity-40 transition-all duration-500 hover:grayscale-0 hover:opacity-100! group-hover/logos:opacity-20 md:gap-16"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ WORK ════════════════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-200 px-8 py-24 dark:border-zinc-800 md:px-16 work-section">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-serif text-2xl uppercase leading-none tracking-tighter md:text-4xl">
              Selected <em className="not-italic font-bold blink-word-2">Work</em>
            </h2>
            <span className="mb-1 font-mono text-[10px] uppercase tracking-widest opacity-40">
              (Projects / '23–'26)
            </span>
          </div>
          <WorkList projects={WORK_PROJECTS} />
        </section>

        {/* ══ CONTACT ══════════════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-200 px-8 py-24 dark:border-zinc-800 md:px-16 contact-section">
          <h2 className="mb-6 font-sans text-4xl font-semibold uppercase leading-none tracking-tighter md:text-6xl">
            <span className="font-serif italic">Let's Have</span> <span className="blink-word-3">a Chat</span>
          </h2>
          <p className="mb-10 max-w-xs font-mono text-sm uppercase leading-relaxed opacity-60">
            Whether it's an idea or just a hello<br />— my inbox is open.
          </p>
          <a
            href="mailto:ammarithm@gmail.com"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-black px-8 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-500 dark:border-white"
          >
            <span className="absolute inset-0 translate-y-full bg-black transition-transform duration-500 group-hover:translate-y-0" />
            <span className="relative mix-blend-difference text-white">Get in Touch</span>
          </a>
          <div className="mt-20 flex flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-widest opacity-30">
            <span>Based in Indonesia</span>
            <span>{time || "00:00 AM"} (GMT +7)</span>
          </div>
        </section>

        {/* Shared footer */}
        <Footer time={time} />

      </main>
    </div>
  );
}

