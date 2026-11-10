"use client";

import { useRef } from "react";
import Image from "next/image";
import { ACTIVITIES } from "../lib/data";
import type { ActivityItem } from "../lib/types";
import { useCurrentLang } from "../lib/useCurrentLang";

interface ExpandingCardsProps {
  items?: ActivityItem[];
  className?: string;
  showHint?: boolean;
}

export default function ExpandingCards({
  items,
  className = "",
  showHint = false,
}: ExpandingCardsProps) {
  const lang = useCurrentLang();
  const isId = lang === "id";
  const displayItems = items && items.length > 0 ? items : ACTIVITIES;

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleHeaderClick = (index: number) => {
    const el = cardRefs.current[index];
    if (!el) return;

    // Header offset perhitungan posisi stack saat judul menempel di atas
    const isMd = typeof window !== "undefined" && window.innerWidth >= 768;
    const baseTop = isMd ? 104 : 84;
    const headerHeight = isMd ? 56 : 48;
    const targetTop =
      el.getBoundingClientRect().top +
      window.scrollY -
      (baseTop + index * headerHeight);

    const win = window as unknown as { lenis?: { scrollTo: (target: number) => void } };
    if (win.lenis && typeof win.lenis.scrollTo === "function") {
      win.lenis.scrollTo(targetTop);
    } else {
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }
  };

  if (!displayItems || displayItems.length === 0) {
    return null;
  }

  return (
    <div
      className={`relative -mx-6 md:-mx-16 w-[calc(100%+3rem)] md:w-[calc(100%+8rem)] border-t border-zinc-200 dark:border-zinc-800 [--base-top:84px] [--header-height:48px] md:[--base-top:104px] md:[--header-height:56px] ${className}`}
    >
      {showHint && (
        <div className="px-6 md:px-16 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-black">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 bg-black dark:bg-white" />
            Activity Gallery
          </span>
          <span>Scroll down for sticky title stack</span>
        </div>
      )}

      {/* Stacking Cards Container — Tanpa gap antar foto, transisi rapat & rapat ke seksi berikutnya */}
      <div className="relative flex flex-col w-full pb-0">
        {displayItems.map((item, index) => {
          const title = isId ? (item.title_id || item.title) : (item.title_en || item.title);
          const category = isId ? (item.category_id || item.category) : (item.category_en || item.category);
          const subtitle = isId ? (item.subtitle_id || item.subtitle) : (item.subtitle_en || item.subtitle);
          const desc = isId ? (item.desc_id || item.desc) : (item.desc_en || item.desc);

          return (
            <div
              key={item.id || index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              style={{
                // Judul menumpuk rapi di bawah header navbar (base-top 104px desktop / 84px mobile)
                top: `calc(var(--base-top) + ${index} * var(--header-height))`,
                zIndex: index + 10,
                transform: "translate3d(0, 0, 0)",
                WebkitTransform: "translate3d(0, 0, 0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              className="sticky w-full will-change-transform"
            >
              {/* Card Inner — Full width, background solid, warna normal tanpa efek gelap */}
              <div
                style={{
                  transform: "translate3d(0, 0, 0)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                className="relative w-full bg-zinc-50 dark:bg-black border-b border-zinc-200 dark:border-zinc-800 overflow-hidden rounded-none"
              >
                {/* ── Title Bar di LUAR foto — Stack rapi bertingkat di atas, z-30 agar selalu di atas foto ── */}
                <button
                  type="button"
                  onClick={() => handleHeaderClick(index)}
                  className="relative z-30 w-full h-[48px] md:h-[56px] flex items-center justify-between gap-4 px-6 md:px-16 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-left transition-colors duration-150 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <span className="font-mono text-xs md:text-sm font-semibold opacity-40 shrink-0">
                      /{item.id}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base md:text-xl uppercase tracking-tight text-black dark:text-white font-medium truncate">
                      {title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                      {category && <span>{category}</span>}
                      {item.year && <span className="hidden sm:inline">· {item.year}</span>}
                    </div>
                    <span className="inline-block h-1.5 w-1.5 bg-black dark:bg-white" />
                  </div>
                </button>

                {/* ── Kontainer Foto + Info — Dikembalikan ke tinggi penuh semula (500px) ── */}
                <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] bg-zinc-950 flex flex-col justify-end px-6 py-6 md:px-16 md:py-8 select-none">
                  <Image
                    src={`/${item.img}`}
                    alt={title}
                    fill
                    sizes="100vw"
                    priority={true}
                    className="object-cover object-center"
                  />

                  {/* Gradient Overlay di bawah untuk keterbacaan teks deskripsi */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none z-10" />

                  {/* Text Overlay di bagian bawah foto */}
                  <div className="relative z-20 max-w-2xl pointer-events-none">
                    {subtitle && (
                      <p className="font-mono text-xs uppercase tracking-wider text-zinc-300 mb-1.5">
                        {subtitle}
                      </p>
                    )}

                    <p className="font-sans text-xs sm:text-sm md:text-base text-zinc-100 leading-relaxed line-clamp-3 sm:line-clamp-4">
                      {desc}
                    </p>

                    {item.location && (
                      <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400">
                        <span>{item.location}</span>
                        <span>{item.year}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
