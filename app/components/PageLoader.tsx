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
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const barRef    = useRef<HTMLDivElement>(null);
  const wordRef   = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);       // actual progress 0–100
  const animValRef  = useRef(0);       // animated display value
  const tlRef       = useRef<gsap.core.Tween | null>(null);

  const [count, setCount]     = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [done, setDone]       = useState(false);
  const pathname = usePathname();

  // ── Word cycling ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      if (!wordRef.current) return;
      gsap.to(wordRef.current, {
        yPercent: -120,
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
        onComplete() {
          setWordIdx((i) => (i + 1) % LOADING_WORDS.length);
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

  // ── Loader run ──────────────────────────────────────────────────────────────
  const runLoader = () => {
    if (!layer1Ref.current || !layer2Ref.current || !barRef.current) return;

    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("is-loading");

    setDone(false);
    setCount(0);
    setWordIdx(0);
    progressRef.current = 0;
    animValRef.current  = 0;

    gsap.killTweensOf([layer1Ref.current, layer2Ref.current, barRef.current]);
    if (tlRef.current) tlRef.current.kill();

    gsap.set([layer1Ref.current, layer2Ref.current], { yPercent: 0 });
    gsap.set(barRef.current, { width: "0%" });
    if (wordRef.current) gsap.set(wordRef.current, { yPercent: 0, opacity: 1 });

    // ── Finish: slide layers out, then signal ready ────────────────────────
    const finish = () => {
      // Keep is-loading until layers are fully gone so content never flashes
      gsap.to(layer1Ref.current, {
        yPercent: -100,
        duration: 0.75,
        ease: "power4.inOut",
        delay: 0.15,
      });
      gsap.to(layer2Ref.current, {
        yPercent: -100,
        duration: 0.75,
        ease: "power4.inOut",
        delay: 0.45,
        onComplete() {
          document.documentElement.classList.remove("is-loading");
          document.body.style.overflow = "";
          setDone(true);
          window.dispatchEvent(new CustomEvent("loaderDone"));
        },
      });
    };

    // ── Animate display counter to current progressRef value ──────────────
    const animateTo = (target: number, duration: number, onDone?: () => void) => {
      if (tlRef.current) tlRef.current.kill();
      const obj = { val: animValRef.current };
      tlRef.current = gsap.to(obj, {
        val: target,
        duration,
        ease: "power1.out",
        onUpdate() {
          const v = Math.round(obj.val);
          animValRef.current = v;
          setCount(v);
          if (barRef.current) barRef.current.style.width = `${v}%`;
        },
        onComplete() {
          animValRef.current = target;
          onDone?.();
        },
      });
    };

    // ── Phase 1: animate to ~30% quickly to show activity ─────────────────
    animateTo(30, 0.6);

    // ── Phase 2: wait for page load event ─────────────────────────────────
    const onLoaded = () => {
      // Animate from current to 100%, then finish
      animateTo(100, 0.7, finish);
    };

    if (document.readyState === "complete") {
      // Already loaded — short pause so loader is visible, then complete
      setTimeout(() => animateTo(100, 0.5, finish), 300);
    } else {
      // Creep slowly to 85% while waiting
      animateTo(85, 3.5);
      window.addEventListener("load", onLoaded, { once: true });
      // Safety fallback: if load takes too long, finish anyway after 5s
      const fallback = setTimeout(() => {
        window.removeEventListener("load", onLoaded);
        animateTo(100, 0.5, finish);
      }, 5000);
      window.addEventListener("load", () => clearTimeout(fallback), { once: true });
    }
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
