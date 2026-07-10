"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const LOADING_WORDS = [
  "Loading",      // English
  "Laden",        // German
  "로딩 중",       // Korean
  "Chargement",   // French
  "Cargando",     // Spanish
  "読み込み中",    // Japanese
  "Загрузка",     // Russian
  "تحميل",        // Arabic
  "Caricamento",  // Italian
];

export default function PageLoader() {
  const layer1Ref  = useRef<HTMLDivElement>(null);
  const layer2Ref  = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const wordRef    = useRef<HTMLSpanElement>(null);
  const [count, setCount]   = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [done, setDone]     = useState(false);
  const pathname = usePathname();

  // Cycle through loading words with a clip-path reveal/hide
  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      if (!wordRef.current) return;
      // Slide out upward
      gsap.to(wordRef.current, {
        yPercent: -120,
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
        onComplete() {
          setWordIdx((i) => (i + 1) % LOADING_WORDS.length);
          // Slide in from below
          gsap.fromTo(
            wordRef.current,
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
          );
        },
      });
    }, 500);
    return () => clearInterval(interval);
  }, [done]);

  const runLoader = () => {
    if (!layer1Ref.current || !layer2Ref.current || !barRef.current) return;

    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("is-loading");

    setDone(false);
    setCount(0);
    setWordIdx(0);
    gsap.killTweensOf([layer1Ref.current, layer2Ref.current, barRef.current]);
    gsap.set([layer1Ref.current, layer2Ref.current], { yPercent: 0 });
    gsap.set(barRef.current, { width: "0%" });
    if (wordRef.current) {
      gsap.set(wordRef.current, { yPercent: 0, opacity: 1 });
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate() {
        const v = Math.round(obj.val);
        setCount(v);
        if (barRef.current) barRef.current.style.width = `${v}%`;
      },
      onComplete() {
        document.documentElement.classList.remove("is-loading");

        gsap.to(layer1Ref.current, {
          yPercent: -100,
          duration: 0.75,
          ease: "power4.inOut",
          delay: 0.1,
        });

        gsap.to(layer2Ref.current, {
          yPercent: -100,
          duration: 0.75,
          ease: "power4.inOut",
          delay: 0.4,
          onComplete() {
            document.body.style.overflow = "";
            setDone(true);
            window.dispatchEvent(new CustomEvent("loaderDone"));
          },
        });
      },
    });
  };

  useEffect(() => {
    runLoader();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9997,
        pointerEvents: done ? "none" : "all",
      }}
    >
      {/* Layer 2 — behind */}
      <div
        ref={layer2Ref}
        className="fixed inset-0 z-9998 bg-black dark:bg-zinc-700"
      />

      {/* Layer 1 — front */}
      <div
        ref={layer1Ref}
        className="fixed inset-0 z-9999 bg-zinc-50 dark:bg-black flex flex-col"
      >
        {/* Cycling word — centered */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <span
            ref={wordRef}
            className="font-serif text-3xl uppercase tracking-widest text-black dark:text-white select-none md:text-5xl"
          >
            {LOADING_WORDS[wordIdx]}
          </span>
        </div>

        {/* Counter */}
        <div className="flex items-end justify-end pr-8 pb-10 md:pr-16">
          <h2 className="font-mono text-2xl font-medium tabular-nums md:text-4xl">
            {count}%
          </h2>
        </div>

        {/* Progress bar */}
        <div className="relative h-[5px] w-full bg-zinc-200 dark:bg-zinc-800">
          <div
            ref={barRef}
            className="absolute inset-y-0 left-0 bg-black dark:bg-white"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
