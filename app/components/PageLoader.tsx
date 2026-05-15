"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageLoader() {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const barRef    = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  // Setelah loader selesai, sembunyikan pointer events tapi tetap di DOM
  const [done, setDone] = useState(false);
  const pathname = usePathname();

  const runLoader = () => {
    if (!layer1Ref.current || !layer2Ref.current || !barRef.current) return;

    // Block scroll selama loader aktif
    document.body.style.overflow = "hidden";

    // Reset: pastikan layer langsung cover screen sebelum React re-render
    setDone(false);
    setCount(0);
    gsap.killTweensOf([layer1Ref.current, layer2Ref.current, barRef.current]);
    gsap.set([layer1Ref.current, layer2Ref.current], { yPercent: 0 });
    gsap.set(barRef.current, { width: "0%" });

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
        // Layer 1 swipes up first
        gsap.to(layer1Ref.current, {
          yPercent: -100,
          duration: 0.75,
          ease: "power4.inOut",
          delay: 0.1,
        });

        // Layer 2 follows slightly later
        gsap.to(layer2Ref.current, {
          yPercent: -100,
          duration: 0.75,
          ease: "power4.inOut",
          delay: 0.4,
          onComplete() {
            // Restore scroll, mark done, signal page
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Tetap render — jangan return null agar refs tidak hilang
  // Saat done: pointer-events none + tidak visible tapi masih di DOM
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9997,
        pointerEvents: done ? "none" : "all",
        // Saat done, sembunyikan wrapper tapi layer sudah di atas layar (yPercent -100)
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
        <div className="flex-1 flex items-end justify-end pr-8 pb-10 md:pr-16">
          <h2 className="font-mono text-2xl font-medium tabular-nums md:text-4xl">
            {count}%
          </h2>
        </div>
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
