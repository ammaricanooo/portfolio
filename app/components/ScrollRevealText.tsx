"use client";

import { useEffect, useRef, Fragment } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoader } from "../lib/loaderContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  baseOpacity?: number;
}

export default function ScrollRevealText({
  text,
  className = "",
  wordClassName = "",
  start = "top 80%",
  end = "top 45%",
  scrub = 1,
  baseOpacity = 0.08,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { ready } = useLoader();

  useEffect(() => {
    if (!ready || !containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".reveal-word");
    if (words.length === 0) return;

    // Reset words opacity to baseOpacity before registering new trigger
    gsap.set(words, { opacity: baseOpacity });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: baseOpacity },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: start,
            end: end,
            scrub: scrub,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [ready, start, end, scrub, baseOpacity]);

  return (
    <span ref={containerRef} className={`${className} inline-block`}>
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          <span
            className={`reveal-word inline-block ${wordClassName}`}
            style={{ opacity: baseOpacity, willChange: "opacity" }}
          >
            {word}
          </span>
          {" "}
        </Fragment>
      ))}
    </span>
  );
}
