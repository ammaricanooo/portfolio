"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageLoader() {
  const layer1Ref  = useRef<HTMLDivElement>(null);
  const layer2Ref  = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const [count, setCount]     = useState(0);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  const runLoader = () => {
    if (!layer1Ref.current || !layer2Ref.current || !barRef.current) return;

    // Reset both layers to cover screen
    setVisible(true);
    setCount(0);
    gsap.set([layer1Ref.current, layer2Ref.current], { yPercent: 0 });
    gsap.set(barRef.current, { width: "0%" });

    // Count 0 → 100
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

        // Layer 2 follows slightly later — the "lag" effect
        gsap.to(layer2Ref.current, {
          yPercent: -100,
          duration: 0.75,
          ease: "power4.inOut",
          delay: 0.4,
          onComplete() {
            setVisible(false);
            // Signal all pages that loader is done
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

  if (!visible) return null;

  return (
    <>
      {/* Layer 2 — behind, slightly slower (rendered first = lower z) */}
      <div
        ref={layer2Ref}
        className="fixed inset-0 z-9998 bg-black dark:bg-zinc-700"
      />

      {/* Layer 1 — front, faster */}
      <div
        ref={layer1Ref}
        className="fixed inset-0 z-9999 bg-zinc-50 dark:bg-black flex flex-col"
      >
        {/* % counter — bottom right */}
        <div className="flex-1 flex items-end justify-end pr-8 pb-10 md:pr-16">
          <h2 className="font-mono text-2xl font-medium tabular-nums md:text-4xl">
            {count}%
          </h2>
        </div>

        {/* Progress bar — bottom 5px */}
        <div className="relative h-[5px] w-full bg-zinc-200 dark:bg-zinc-800">
          <div
            ref={barRef}
            className="absolute inset-y-0 left-0 bg-black dark:bg-white"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </>
  );
}
