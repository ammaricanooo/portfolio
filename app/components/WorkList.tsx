"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { scramble } from "../lib/scramble";
import { useLoader } from "../lib/loaderContext";

interface Project {
  id: string;
  title: string;
  tech: string;
  url: string;
  img: string;
  year?: string;
}

interface WorkListProps {
  projects: Project[];
}

export default function WorkList({ projects }: WorkListProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const { ready } = useLoader();

  // Hide rows immediately on mount — no flash
  // (opacity-0 sudah di-set via class di JSX, useEffect ini tidak diperlukan)

  // Entrance animation — left to right, then scramble text
  useEffect(() => {
    if (!ready || !listRef.current) return;

    const rows = listRef.current.querySelectorAll<HTMLElement>(".work-row");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          delay: 0.5,
        }
      );
    }, listRef);

    return () => ctx.revert();
  }, [ready]);

  const handleWorkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const layer = e.currentTarget.querySelector<HTMLElement>(".work-layer");
    if (!layer) return;
    const rect    = e.currentTarget.getBoundingClientRect();
    const fromTop = (e.clientY - rect.top) < rect.height / 2;
    gsap.killTweensOf(layer);
    gsap.set(layer, { clipPath: fromTop ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" });
    gsap.to(layer, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.out" });

    e.currentTarget.querySelectorAll<HTMLElement>(".sc-title").forEach((el) =>
      scramble(el, el.dataset.target ?? el.textContent ?? "", 0.45, true)
    );
    e.currentTarget.querySelectorAll<HTMLElement>(".sc-tech").forEach((el) =>
      scramble(el, el.dataset.target ?? el.textContent ?? "", 0.45, true)
    );
    e.currentTarget.querySelectorAll<HTMLElement>(".sc-id").forEach((el) =>
      scramble(el, el.dataset.target ?? el.textContent ?? "", 0.45, true)
    );
  };

  const handleWorkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const layer = e.currentTarget.querySelector<HTMLElement>(".work-layer");
    if (!layer) return;
    const rect     = e.currentTarget.getBoundingClientRect();
    const goingTop = (e.clientY - rect.top) < rect.height / 2;
    gsap.killTweensOf(layer);
    gsap.to(layer, {
      clipPath: goingTop ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)",
      duration: 0.45, ease: "power3.inOut",
    });
  };

  return (
    <div ref={listRef} className="flex flex-col">
      {projects.map((p, i) => (
        <a
          key={p.id}
          href={p.url}
          data-project-id={p.id}
          onMouseEnter={handleWorkEnter}
          onMouseLeave={handleWorkLeave}
          className={
            "work-row opacity-0 group relative overflow-hidden px-2 py-5 md:py-12" +
            (i !== 0 ? " border-t border-zinc-200 dark:border-zinc-800" : "")
          }
        >
          {/* Solid background — required so mix-blend-difference has a reference color */}
          <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950" />

          {/* Hover layer — black curtain + image, sits above bg but below text */}
          <div
            className="work-layer absolute inset-0 z-10 pointer-events-none flex items-center justify-end px-4"
            style={{ clipPath: "inset(100% 0% 0% 0%)" }}
          >
            <div className="absolute inset-0 bg-black" />
            <div
              className="relative z-10 overflow-hidden hidden md:block"
              style={{ width: "20rem", height: "75%" }}
            >
              <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
            </div>
          </div>

          {/* ── MOBILE: text content ────────────────────────────────────── */}
          <div className="relative z-20 md:hidden mix-blend-difference text-white">
            <div className="flex items-center justify-between mb-1">
              <span
                className="sc-id font-mono text-xs group-hover:underline underline-offset-2"
                data-target={`PROJECT ${p.id}`}
              >
                PROJECT {p.id}
              </span>
              <span
                className="sc-tech font-mono text-xs uppercase tracking-widest"
                data-target={p.tech}
              >
                {p.tech}
              </span>
            </div>
            <h3
              className="sc-title text-2xl font-semibold uppercase tracking-tight mb-3"
              data-target={p.title}
            >
              {p.title}
            </h3>
          </div>

          {/* Gambar mobile — static, always visible */}
          <div className="md:hidden relative z-20 w-full overflow-hidden" style={{ height: "5rem" }}>
            <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
          </div>

          {/* ── DESKTOP: text content ───────────────────────────────────── */}
          <div className="hidden relative z-20 md:grid grid-cols-2 mix-blend-difference text-white">
            <div className="flex items-center gap-8">
              <span
                className="sc-id font-mono text-sm group-hover:underline underline-offset-2"
                data-target={`PROJECT ${p.id}`}
              >
                PROJECT {p.id}
              </span>
              <h3
                className="sc-title text-2xl font-semibold uppercase tracking-tight lg:text-3xl"
                data-target={p.title}
              >
                {p.title}
              </h3>
            </div>
            <span
              className="sc-tech font-mono text-sm uppercase tracking-widest"
              data-target={p.tech}
            >
              {p.tech}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
