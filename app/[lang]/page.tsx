"use client";

import { useEffect, useRef, Fragment } from "react";
import gsap from "gsap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WorkList from "../components/WorkList";
import ScrollRevealText from "../components/ScrollRevealText";
import { scramble } from "../lib/scramble";
import { WORK_PROJECTS } from "../lib/data";
import { useLoader } from "../lib/loaderContext";
import { useClock } from "../lib/useClock";
import { useGsapReady } from "../lib/useGsapReady";
import { useIsMobile } from "../lib/useIsMobile";
import { useCurrentLang } from "../lib/useCurrentLang";
import { getDictionary } from "../lib/dictionary";

const TECH_LOGOS = [
  { src: "/nextjs.svg", alt: "Next.js" },
  { src: "/laravel.webp", alt: "Laravel" },
  { src: "/nginx.png", alt: "Nginx" },
  { src: "/nodejs.svg", alt: "Node.js" },
  { src: "/expressjs.svg", alt: "Express.js" },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const isMobile = useIsMobile();
  const { ready } = useLoader();
  const time = useClock();
  const lang = useCurrentLang();
  const dict = getDictionary(lang);
  useGsapReady();

  // Initial scramble — wait for loader
  useEffect(() => {
    if (!ready) return;
    scramble(heroNameRef.current, "Ammar Abdul Malik", 1.5);
  }, [ready]);

  // Main GSAP — wait for loader
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const isMobileDevice = window.innerWidth < 768;

      const START = {
        circlePathIn: isMobileDevice ? "top 75%" : "top 75%",
        circlePathOut: isMobileDevice ? "top 10%" : "top -10%",
        circleBlink: isMobileDevice ? "top 55%" : "top 45%",
        circleTech: isMobileDevice ? "top 82%" : "top 78%",
        workSection: isMobileDevice ? "top 78%" : "top 72%",
        contactSection: isMobileDevice ? "top 78%" : "top 72%",
      };

      const DELAY = {
        revealBlock: isMobileDevice ? 0.3 : 0.5,
        heroWord: isMobileDevice ? 0.4 : 0.6,
        heroBottom: isMobileDevice ? 0.8 : 1.2,
      };

      // Intro timeline
      gsap.timeline()
        .fromTo(".reveal-block",
          { scaleX: 0, transformOrigin: "left" },
          { scaleX: 1, duration: 0.7, ease: "power4.inOut", delay: DELAY.revealBlock }
        )
        .set(".reveal-content", { opacity: 1 })
        .to(".reveal-block",
          { scaleX: 0, transformOrigin: "right", duration: 0.7, ease: "power4.inOut" }
        );

      // Hero words
      gsap.to(".hero-word", {
        opacity: 1, duration: 0.8,
        stagger: { each: 0.04, from: "random" },
        delay: DELAY.heroWord,
      });

      // Marquee tracks
      gsap.to(".marquee-track-1", {
        xPercent: -50, ease: "none",
        scrollTrigger: { trigger: ".marquee-section", start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.fromTo(".marquee-track-2",
        { xPercent: -50 },
        {
          xPercent: 0, ease: "none",
          scrollTrigger: { trigger: ".marquee-section", start: "top bottom", end: "bottom top", scrub: 1 }
        }
      );

      // Circle stroke
      gsap.fromTo(".circle-path",
        { strokeDasharray: 1000, strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          scrollTrigger: { trigger: ".circle-section", start: START.circlePathIn, end: START.circlePathOut, scrub: 0.4 }
        }
      );

      // Blink words
      gsap.to(".blink-word", {
        scrollTrigger: { trigger: ".circle-section", start: START.circleBlink, once: true },
        keyframes: [
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.3 },
        ],
        stagger: 0.15,
        ease: "none",
      });
      gsap.to(".blink-word-2", {
        scrollTrigger: { trigger: ".work-section", start: START.workSection, once: true },
        keyframes: [
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.3 },
        ],
        delay: 0.1,
        ease: "none",
      });
      gsap.to(".blink-word-3", {
        scrollTrigger: { trigger: ".contact-section", start: START.contactSection, once: true },
        keyframes: [
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.1 },
          { opacity: 0.2, duration: 0.1 },
          { opacity: 1, duration: 0.3 },
        ],
        stagger: 0.2,
        delay: 0.15,
        ease: "none",
      });

      // Hero bottom bar
      gsap.fromTo(".hero-bottom",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1, delay: DELAY.heroBottom }
      );

      // Circle section — label + logos
      gsap.fromTo(".circle-label",
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".circle-label", start: START.circleTech, once: true },
        }
      );
      gsap.fromTo(
        ".tech-logo",
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 0.4,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.15,
          scrollTrigger: { trigger: ".circle-label", start: START.circleTech, once: true },
        }
      );

      // Work section — sequential reveal
      gsap.fromTo(".work-heading",
        { opacity: 0, y: 20, immediateRender: true },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: ".work-section",
            start: START.workSection,
            once: true,
            fastScrollEnd: true,
          },
        }
      );
      gsap.fromTo(".work-label",
        { opacity: 0, y: 12, immediateRender: true },
        {
          opacity: 0.4, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1,
          scrollTrigger: {
            trigger: ".work-section",
            start: START.workSection,
            once: true,
            fastScrollEnd: true,
          },
        }
      );
      gsap.fromTo(".work-list",
        { opacity: 0, y: 20, immediateRender: true },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2,
          scrollTrigger: {
            trigger: ".work-section",
            start: START.workSection,
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      // Contact section — sequential reveal
      gsap.fromTo(".contact-heading",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".contact-section", start: START.contactSection, once: true },
        }
      );
      gsap.fromTo(".contact-body",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 0.2,
          scrollTrigger: { trigger: ".contact-section", start: START.contactSection, once: true },
        }
      );
      gsap.fromTo(".contact-button",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.35,
          scrollTrigger: { trigger: ".contact-section", start: START.contactSection, once: true },
        }
      );
      gsap.fromTo(".contact-bottom",
        { opacity: 0, y: 12 },
        {
          opacity: 0.3, y: 0, duration: 0.7, ease: "power3.out", delay: 0.45,
          scrollTrigger: { trigger: ".contact-section", start: START.contactSection, once: true },
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white overflow-x-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black"
    >
      <Header activePage="home" />

      <main className="w-full">

        {/* ══ HERO ════════════════════════════════════════════════════════════ */}
        <section className="relative flex h-svh flex-col justify-start px-6 pt-[18vh] pb-12 md:px-16 md:pt-[28vh]">
          <h1
            ref={heroNameRef}
            className="font-serif text-[clamp(1rem,6vw,3rem)] uppercase leading-none tracking-tight"
          />
          <div className="relative mt-2 inline-block overflow-hidden w-fit">
            <h2 className="reveal-content opacity-0 pl-4 font-sans text-[clamp(1rem,6vw,3rem)] font-semibold uppercase md:pl-16">
              {dict.home.role}
            </h2>
            <div className="reveal-block absolute inset-0 ml-4 scale-x-0 bg-black dark:bg-white md:ml-16" />
          </div>
          <div className="mt-32 flex justify-end">
            <p className="max-w-xs text-justify text-sm leading-relaxed text-zinc-400 dark:text-zinc-500 md:max-w-md">
              {dict.home.heroText.split(" ").map((word, i) => (
                <Fragment key={i}>
                  <span className="hero-word inline-block opacity-0">{word}</span>{" "}
                </Fragment>
              ))}
            </p>
          </div>
          <div className="absolute bottom-6 inset-x-0 px-6 md:px-16 flex items-end justify-between">
            <span className="hero-bottom font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 opacity-0">
              Bogor, Indonesia
            </span>
            <div className="hero-bottom c-scrolldown opacity-0" />
            <span className="hero-bottom font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 opacity-0">
              {time || "00:00 AM"}<span className="hidden md:inline"> (GMT +7)</span>
            </span>
          </div>
        </section>

        {/* ══ ABOUT ═══════════════════════════════════════════════════════════ */}
        <section className="about-section flex w-full items-center justify-center bg-white px-6 py-20 dark:bg-zinc-950 md:px-16 md:py-28">
          <div className="max-w-5xl w-full">
            <h2 className="text-xl font-semibold uppercase leading-snug md:text-4xl text-justify">
              <ScrollRevealText
                text={dict.home.aboutText}
                baseOpacity={0.05}
                start={isMobile ? "top 90%" : "top 85%"}
                end={isMobile ? "top 35%" : "top 30%"}
                scrub={0.8}
              />
            </h2>
          </div>
        </section>

        {/* ══ MARQUEE ══════════════════════════════════════════════════════════ */}
        <section className="marquee-section overflow-hidden border-y border-zinc-200 py-10 dark:border-zinc-800 md:py-16">
          <div className="-rotate-1 border-y border-zinc-200 py-3 dark:border-zinc-800 md:py-6">
            <div className="marquee-track-1 flex whitespace-nowrap font-serif text-5xl uppercase leading-none md:text-7xl">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="pr-12">{dict.home.marquee1.join(" — ")} —</span>
              ))}
            </div>
          </div>
          <div className="-rotate-1 border-y border-zinc-200 py-3 dark:border-zinc-800 md:py-6">
            <div className="marquee-track-2 flex whitespace-nowrap font-mono text-sm uppercase leading-none tracking-widest opacity-30 md:text-base">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="pr-12">{dict.home.marquee2.join(" · ")} ·</span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CIRCLE ═══════════════════════════════════════════════════════════ */}
        <section className="circle-section flex min-h-screen flex-col items-center justify-center py-20">
          <div className="w-full max-w-xl px-4">
            <div className="relative mx-auto aspect-square w-full flex items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.3" className="opacity-10" />
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.8"
                  strokeLinecap="round" pathLength="1000" className="circle-path" />
              </svg>
              <div className="relative z-10 text-center">
                <h2 className="text-2xl font-semibold uppercase leading-tight md:text-4xl">
                  {dict.home.circleWords.map((word, i) => (
                    <Fragment key={i}>
                      <span className="blink-word mx-1 inline-block opacity-0">
                        {word}{i === 1 ? "" : i === 0 ? "" : " "}
                      </span>
                      {i === 1 && <br />}
                    </Fragment>
                  ))}
                </h2>
              </div>
            </div>
            <div className="mt-16 text-center">
              <p className="circle-label mb-8 font-mono text-[10px] font-semibold uppercase tracking-widest opacity-0">
                {dict.home.techLabel}
              </p>
              <div className="group/logos flex flex-wrap items-center justify-center gap-10 md:gap-16">
                {TECH_LOGOS.map((t) => (
                  <div key={t.alt} className="tech-logo-mask h-7 overflow-hidden">
                    <img
                      src={t.src}
                      alt={t.alt}
                      className="tech-logo h-7 w-auto object-contain grayscale opacity-0 transition-all duration-500 hover:grayscale-0 hover:opacity-100! group-hover/logos:opacity-20 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ WORK ════════════════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-200 px-6 py-20 dark:border-zinc-800 md:px-16 md:py-28 work-section">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-serif text-2xl uppercase leading-none tracking-tighter md:text-4xl">
              <span className="work-heading opacity-0">{dict.home.workHeading}</span>{" "}
              <em className="not-italic font-bold blink-word-2 opacity-0">{dict.home.workEmphasis}</em>
            </h2>
            <span className="work-label mb-1 font-mono text-[10px] uppercase tracking-widest opacity-0">
              {dict.home.workLabel}
            </span>
          </div>
          <WorkList projects={WORK_PROJECTS} />
        </section>

        {/* ══ CONTACT ══════════════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-200 px-6 py-20 dark:border-zinc-800 md:px-16 md:py-28 contact-section">
          <h2 className="mb-6 font-sans text-4xl font-semibold uppercase leading-none tracking-tighter md:text-6xl">
            <span className="font-serif italic contact-heading opacity-0">{dict.home.contactHeading}</span>{" "}
            <span className="opacity-0 blink-word-3">{dict.home.contactEmphasis}</span>
          </h2>
          <p className="contact-body mb-10 max-w-xs font-mono text-sm uppercase leading-relaxed opacity-0">
            {dict.home.contactBody}
          </p>
          <a
            href="mailto:ammarithm@gmail.com"
            className="contact-button opacity-0 group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full border border-black px-8 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-700 dark:border-white"
          >
            <span className="absolute inset-0 -z-10 bg-zinc-50 dark:bg-black" />
            <span className="absolute inset-0 translate-y-full bg-black transition-transform duration-500 group-hover:translate-y-0" />
            <span className="relative z-10 text-white mix-blend-difference">{dict.home.contactBtn}</span>
          </a>
          <div className="contact-bottom mt-20 flex flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-widest opacity-0">
            <span>{dict.home.basedIn}</span>
            <span>{time || "00:00 AM"} (GMT +7)</span>
          </div>
        </section>

        {/* Shared footer */}
        <Footer time={time} />

      </main>
    </div>
  );
}

