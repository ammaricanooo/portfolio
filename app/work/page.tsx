"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WorkList from "../components/WorkList";
import { WORK_PROJECTS } from "../lib/data";
import { useLoader } from "../lib/loaderContext";
import { useClock } from "../lib/useClock";
import { useGsapReady } from "../lib/useGsapReady";

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const projects = WORK_PROJECTS;
  const { ready } = useLoader();
  const time = useClock();
  useGsapReady();

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
        <section className="relative flex min-h-[55vh] flex-col justify-end px-6 pb-12 pt-[18vh] md:px-16 md:pt-[28vh]">
          <span className="work-hero-label opacity-0 font-mono text-[10px] uppercase tracking-widest mb-6">
            Selected Work
          </span>
          <h1 className="work-hero-title opacity-0 font-serif text-[clamp(3.5rem,10vw,9rem)] uppercase leading-none tracking-tight">
            Projects
          </h1>
          <div className="work-hero-meta opacity-0 mt-6 flex items-center gap-8">
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
              {projects.length} Projects
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
              &apos;23–&apos;26
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
              {time}
            </span>
          </div>
        </section>

        {/* ══ WORK LIST ═══════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 px-6 md:px-16 opacity-0 work-list-section">
          <WorkList projects={projects} />
        </section>

        {/* ══ PROJECT COUNT ═══════════════════════════════════════════════ */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-20 md:px-16 md:py-28 bg-white dark:bg-zinc-950 opacity-0 work-count">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-2">Total Projects</p>
              <p className="font-serif text-6xl uppercase leading-none md:text-8xl">
                {String(projects.length).padStart(2, "0")}
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
        <section className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-20 md:px-16 md:py-28 opacity-0 work-cta">
          <h2 className="mb-10 font-serif text-4xl uppercase leading-none tracking-tight md:text-6xl">
            Have a Project<br />in Mind?
          </h2>
          <a
            href="mailto:ammarithm@gmail.com"
            className="inline-flex items-center relative justify-center whitespace-nowrap font-mono font-medium py-2 uppercase text-sm
                  after:w-full after:pointer-events-none after:absolute after:bottom-0 after:h-px after:bg-current
                  after:transition-transform after:duration-500 after:ease-in-out
                  after:left-0 after:origin-bottom-right hover:after:origin-bottom-left
                  after:scale-x-0 hover:after:scale-x-100"
              >
                → Let&apos;s Talk
          </a>
        </section>

        <Footer time={time} />
      </main>
    </div>
  );
}
