"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const LOADING_WORDS = [
  "Loading",      // English
  "로딩 중",       // Korean
  "Laden",        // German
  "Chargement",   // French
  "Cargando",     // Spanish
  "読み込み中",    // Japanese
  "Загрузка",     // Russian
  "تحميل",        // Arabic
  "Caricamento",  // Italian
];

export default function PageLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const animValRef = useRef(0);
  const tlRef = useRef<gsap.core.Tween | null>(null);
  const doneRef = useRef(false);
  const isFirstLoadRef = useRef(true);

  const [count, setCount] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [done, setDone] = useState(false);
  const pathname = usePathname();

  // ── Word cycling ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      if (!wordRef.current) return;
      gsap.to(wordRef.current, {
        yPercent: -120,
        opacity: 0,
        duration: 0.25,
        ease: "power3.in",
        onComplete() {
          setWordIdx((i) => (i + 1) % LOADING_WORDS.length);
          gsap.fromTo(
            wordRef.current,
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.3, ease: "power3.out" }
          );
        },
      });
    }, 400);
    return () => clearInterval(interval);
  }, [done]);

  // ── Finish: animasi slide ke atas (curtain / shutter effect) ─────────────────
  const finish = useCallback(() => {
    if (tlRef.current) tlRef.current.kill();

    // Beritahu konteks bahwa tirai mulai terbuka, halaman baru mulai memudar masuk (fade in)
    window.dispatchEvent(new CustomEvent("loaderDone"));

    if (!layer1Ref.current || !layer2Ref.current) {
      document.documentElement.classList.remove("is-loading");
      document.body.style.overflow = "";
      doneRef.current = true;
      setDone(true);
      return;
    }

    gsap.killTweensOf([layer1Ref.current, layer2Ref.current]);

    // Layer 1 (depan) meluncur ke atas
    gsap.to(layer1Ref.current, {
      yPercent: -100,
      duration: 0.6,
      ease: "power4.inOut",
      delay: 0.05,
    });

    // Layer 2 (belakang) meluncur ke atas menyusul layer 1
    gsap.to(layer2Ref.current, {
      yPercent: -100,
      duration: 0.6,
      ease: "power4.inOut",
      delay: 0.22,
      onComplete() {
        document.documentElement.classList.remove("is-loading");
        document.body.style.overflow = "";
        doneRef.current = true;
        setDone(true);
      },
    });
  }, []);

  // ── Animate counter display ─────────────────────────────────────────────────
  const animateTo = useCallback((target: number, duration: number, onDone?: () => void) => {
    if (tlRef.current) tlRef.current.kill();
    const obj = { val: animValRef.current };
    tlRef.current = gsap.to(obj, {
      val: target,
      duration,
      ease: "power2.out",
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
  }, []);

  // ── First load: measure real DOM & network loading state ───────────────────
  const runFirstLoad = useCallback(() => {
    if (!layer1Ref.current || !layer2Ref.current || !barRef.current) return;

    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("is-loading");

    setDone(false);
    setCount(0);
    setWordIdx(0);
    animValRef.current = 0;
    doneRef.current = false;

    gsap.set([layer1Ref.current, layer2Ref.current], { opacity: 1, yPercent: 0 });
    gsap.set(barRef.current, { width: "0%" });
    if (wordRef.current) gsap.set(wordRef.current, { yPercent: 0, opacity: 1 });

    if (document.readyState === "complete") {
      animateTo(100, 0.35, finish);
    } else {
      const checkProgress = () => {
        const images = Array.from(document.images);
        const totalImages = images.length;
        const loadedImages = images.filter((img) => img.complete).length;
        let calcProgress = 30;
        if (totalImages > 0) {
          calcProgress += Math.round((loadedImages / totalImages) * 60);
        } else {
          calcProgress = 80;
        }
        return Math.min(calcProgress, 95);
      };

      animateTo(checkProgress(), 0.3);

      let finished = false;
      const completeLoading = () => {
        if (finished) return;
        finished = true;
        animateTo(100, 0.3, finish);
      };

      window.addEventListener("load", completeLoading, { once: true });
      if (document.fonts) {
        document.fonts.ready.then(() => {
          if (!finished) animateTo(checkProgress(), 0.2);
        });
      }

      const fallbackTimer = setTimeout(() => {
        completeLoading();
      }, 1500);

      window.addEventListener("load", () => clearTimeout(fallbackTimer), { once: true });
    }
  }, [animateTo, finish]);

  // ── Transition loader: muncul setelah halaman fade out & saat proses compiling ──
  const startTransitionLoader = useCallback(() => {
    if (!layer1Ref.current || !layer2Ref.current || !barRef.current) return;

    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("is-loading");

    setDone(false);
    setCount(0);
    setWordIdx(0);
    animValRef.current = 0;
    doneRef.current = false;

    gsap.killTweensOf([layer1Ref.current, layer2Ref.current, barRef.current]);
    if (tlRef.current) tlRef.current.kill();

    if (barRef.current) barRef.current.style.width = "0%";
    if (wordRef.current) gsap.set(wordRef.current, { yPercent: 0, opacity: 1 });

    // Posisikan kedua layer kembali ke layar penuh (yPercent: 0, opacity: 1)
    gsap.set([layer1Ref.current, layer2Ref.current], { yPercent: 0, opacity: 1 });

    // Counter bertambah secara alami menuju ~85% selama proses compiling rute baru
    animateTo(85, 2.5);
  }, [animateTo]);

  // Listen for navigation click event ("startPageLoader")
  useEffect(() => {
    const handler = () => {
      startTransitionLoader();
    };
    window.addEventListener("startPageLoader", handler);
    return () => window.removeEventListener("startPageLoader", handler);
  }, [startTransitionLoader]);

  // Saat pathname berganti: Next.js selesai compiling & halaman baru siap ditampilkan
  useEffect(() => {
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      runFirstLoad();
      return;
    }

    // Reset scroll ke atas di balik tirai loader sebelum tirai meluncur ke atas
    const win = window as unknown as {
      lenis?: { scrollTo: (target: number, opts?: { immediate?: boolean }) => void };
    };
    if (win.lenis && typeof win.lenis.scrollTo === "function") {
      win.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    // Navigasi rute selesai: counter langsung 100%, lalu slide ke atas!
    animateTo(100, 0.2, finish);
  }, [pathname, runFirstLoad, animateTo, finish]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9997,
        pointerEvents: done ? "none" : "all",
      }}
    >
      {/* Layer 2 — behind (slider hitam sesuai warna bar di bawah) */}
      <div
        ref={layer2Ref}
        className="fixed inset-0 z-9998 bg-black dark:bg-white"
      />

      {/* Layer 1 — front (konten loader utama) */}
      <div
        ref={layer1Ref}
        className="fixed inset-0 z-9999 bg-zinc-50 dark:bg-black text-[#09090b] dark:text-white flex flex-col justify-between"
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
