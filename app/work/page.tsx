"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WorkList from "../components/WorkList";
import { WORK_PROJECTS } from "../lib/data";
import { useLoader } from "../lib/loaderContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("");
  const { ready } = useLoader();

  // Clock
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
          .format(new Date())
          .toUpperCase()
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {

      // Hero entrance — pure opacity
      gsap.timeline()
        .fromTo(".work-hero-label",
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power3.out" }
        )
        .fromTo(".work-hero-title",
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(".work-hero-meta",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.3"
        );

      // Fade in work-list section border
      gsap.fromTo(".work-list-section",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.3 }
      );

      // Scroll sections
      gsap.fromTo(".work-count",
        { opacity: 0 },
        {
          opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".work-count", start: "top 80%", once: true },
        }
      );
      gsap.fromTo(".work-cta",
        { opacity: 0 },
        {
          opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".work-cta", start: "top 80%", once: true },
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, [ready]);

  // Hover handlers moved to WorkList component

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white overflow-x-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black"
    >
      <Header activePage="work" />

      <main className="w-full">

        {/* ══ HERO ════════════════════════════════════════════════════════ */}
        <section className="relative flex min-h-[55vh] flex-col justify-end px-8 pb-16 pt-40 md:px-16">
          <span className="work-hero-label opacity-0 font-mono text-[10px] uppercase tracking-widest mb-6">
            Selected Work
          </span>
          <h1 className="work-hero-title opacity-0 font-serif text-[clamp(3.5rem,10vw,9rem)] uppercase leading-none tracking-tight">
            Projects
          </h1>
          <div className="work-hero-meta opacity-0 mt-6 flex items-center gap-8">
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
              {WORK_PROJECTS.length} Projects
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
              '23–'26
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
              {time}
            </span>
          </div>
        </section>

        {/* ══ WORK LIST ═══════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 px-8 md:px-16 opacity-0 work-list-section">
          <WorkList projects={WORK_PROJECTS} />
        </section>

        {/* ══ PROJECT COUNT ═══════════════════════════════════════════════ */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 px-8 py-16 md:px-16 bg-white dark:bg-zinc-950 opacity-0 work-count">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-2">Total Projects</p>
              <p className="font-serif text-6xl uppercase leading-none md:text-8xl">
                {String(WORK_PROJECTS.length).padStart(2, "0")}
              </p>
            </div>
            <div className="max-w-xs">
              <p className="font-mono text-xs uppercase leading-relaxed opacity-50">
                A collection of projects built with curiosity, precision, and a drive to ship things that work.
              </p>
            </div>
          </div>
        </section>

        {/* ══ CTA ═════════════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 px-8 py-24 md:px-16 md:py-32 opacity-0 work-cta">
          <h2 className="mb-10 font-serif text-4xl uppercase leading-none tracking-tight md:text-6xl">
            Have a Project<br />in Mind?
          </h2>
          <a
            href="mailto:ammarithm@gmail.com"
            className="group inline-flex items-center gap-3 font-mono text-sm uppercase tracking-widest transition-opacity duration-300 hover:opacity-60"
          >
            <span className="text-lg">→</span>
            <span>Let's Talk</span>
          </a>
        </section>

        <Footer time={time} />
      </main>
    </div>
  );
}
