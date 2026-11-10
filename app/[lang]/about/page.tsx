"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ScrollRevealText from "../../components/ScrollRevealText";
import ExpandingCards from "../../components/ExpandingCards";
import Arrow from "../../components/Arrow";
import { scramble } from "../../lib/scramble";
import { ACTIVITIES } from "../../lib/data";
import { useLoader } from "../../lib/loaderContext";
import { useClock } from "../../lib/useClock";
import { useGsapReady } from "../../lib/useGsapReady";
import { useIsMobile } from "../../lib/useIsMobile";
import { useCurrentLang } from "../../lib/useCurrentLang";
import { getDictionary } from "../../lib/dictionary";

// ─── Accordion item ───────────────────────────────────────────────────────────
function AccordionItem({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.inOut",
      });
    }
  }, [open]);

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left text-xl font-medium uppercase transition-opacity hover:opacity-60 md:text-2xl cursor-pointer"
      >
        <span>{label}</span>
        <div className="relative h-6 w-6 shrink-0">
          {/* Plus */}
          <svg
            className={`absolute inset-0 h-full w-full transition-all duration-300 ${open ? "rotate-180 opacity-0" : "rotate-0 opacity-100"}`}
            fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {/* Minus */}
          <svg
            className={`absolute inset-0 h-full w-full transition-all duration-300 ${open ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"}`}
            fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </div>
      </button>
      <div
        ref={contentRef}
        style={{ height: 0, opacity: 0, overflow: "hidden" }}
      >
        <ul className="pb-4 space-y-2">
          {items.map((item) => (
            <li key={item} className="font-mono text-sm uppercase tracking-widest opacity-60">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const { ready } = useLoader();
  const time = useClock();
  const isMobile = useIsMobile();
  const lang = useCurrentLang();
  const dict = getDictionary(lang);
  useGsapReady();

  // Scramble — wait for loader
  useEffect(() => {
    if (!ready) return;
    scramble(heroNameRef.current, dict.about.heroScramble, 1.5);
  }, [ready, dict.about.heroScramble]);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const isMobileDevice = window.innerWidth < 768;

      const DELAY = {
        revealBlock: isMobileDevice ? 0.3 : 0.5,
        ammarClip: isMobileDevice ? 0.3 : 0.5,
        heroImg: isMobileDevice ? 0.6 : 0.8,
      };

      // Parallax for image in personal interest
      gsap.to(".parallax-img", {
        y: isMobileDevice ? "5%" : "35%",
        ease: "none",
        scrollTrigger: {
          trigger: ".interest-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Intro: reveal-block + reveal-content
      gsap.timeline()
        .fromTo(".reveal-block",
          { scaleX: 0, transformOrigin: "left" },
          { scaleX: 1, duration: 0.7, ease: "power4.inOut", delay: DELAY.revealBlock }
        )
        .set(".reveal-content", { opacity: 1 })
        .to(".reveal-block",
          { scaleX: 0, transformOrigin: "right", duration: 0.7, ease: "power4.inOut", delay: 0.5 }
        );

      // Tags fade in
      gsap.fromTo(".about-hero-tag",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.1 }
      );

      // Clip reveal for photo
      gsap.fromTo(".ammar-clip",
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.8,
          ease: "power4.inOut",
          delay: DELAY.ammarClip,
        }
      );

      // Container fade-in
      gsap.fromTo(".about-hero-img",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: DELAY.heroImg }
      );

      // Journey section — sequential
      gsap.fromTo(".journey-heading",
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".journey-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo(".journey-word-section",
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.15,
          scrollTrigger: { trigger: ".journey-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );

      // Tech section (/00-2) — sequential
      gsap.fromTo(".tech-label",
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".tech-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo(".tech-heading",
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1,
          scrollTrigger: { trigger: ".tech-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo(".tech-accordion",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.25,
          scrollTrigger: { trigger: ".tech-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );

      // Activities section (/00-3) — sequential
      gsap.fromTo(".activities-label",
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".activities-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo(".activities-heading",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1,
          scrollTrigger: { trigger: ".activities-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo([".activities-sub", ".activities-badge"],
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.2, stagger: 0.05,
          scrollTrigger: { trigger: ".activities-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo(".activities-gallery",
        { opacity: 0 },
        {
          opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.3,
          scrollTrigger: { trigger: ".activities-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );

      // Interest section (/00-4) — sequential
      gsap.fromTo(".interest-label",
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".interest-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo(".interest-heading",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1,
          scrollTrigger: { trigger: ".interest-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo(".interest-img",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2,
          scrollTrigger: { trigger: ".interest-img", start: isMobileDevice ? "top 75%" : "top 65%", once: true },
        }
      );

      // CTA section (/00-5) — sequential
      gsap.fromTo(".cta-label",
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".cta-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo(".cta-heading",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1,
          scrollTrigger: { trigger: ".cta-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo(".cta-button",
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.2,
          scrollTrigger: { trigger: ".cta-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );
      gsap.fromTo(".cta-meta",
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.3,
          scrollTrigger: { trigger: ".cta-section", start: isMobileDevice ? "top 80%" : "top 75%", once: true },
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white overflow-x-clip selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black"
    >
      <Header activePage="about" />

      <main className="w-full">

        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <section className="relative flex flex-col justify-start px-6 pt-[18vh] pb-12 md:px-16 md:pt-[28vh]">

          {/* Tags */}
          <div className="mb-6 flex items-center justify-between">
            <span className="about-hero-tag opacity-0 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              {dict.about.basedIn}
            </span>
            <span className="about-hero-tag opacity-0 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              {dict.about.roleBadge}
            </span>
          </div>

          {/* "An Ever-Growing" */}
          <h1
            ref={heroNameRef}
            className="font-serif text-[clamp(1rem,6vw,3rem)] uppercase leading-none tracking-tight"
          />

          {/* Role text */}
          <div className="relative mt-2 inline-block overflow-hidden w-fit">
            <span className="reveal-content opacity-0 pl-4 font-sans text-[clamp(1rem,6vw,3rem)] font-semibold uppercase md:pl-16 block">
              {dict.about.heroTitle}
            </span>
            <div className="reveal-block absolute inset-0 ml-4 scale-x-0 bg-black dark:bg-white md:ml-16" />
          </div>

          {/* Photo */}
          <div className="about-hero-img opacity-0 mt-6 flex justify-end mb-8">
            <div className="overflow-hidden ammar-clip"
              style={{
                width: "clamp(140px, 22vw, 320px)",
                clipPath: "inset(0% 0% 100% 0%)"
              }}>
              <Image
                src="/ammar.jpeg"
                alt="Ammar Abdul Malik"
                width={1020}
                height={1100}
                priority
                className="w-full object-cover scale-250 bg-zinc-200 dark:bg-zinc-800"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          </div>

        </section>

        {/* ══ JOURNEY ═══════════════════════════════════════════════════════════ */}
        <section className="journey-section px-6 py-20 md:px-16 md:py-28">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7">
              <h2 className="journey-heading opacity-0 font-serif text-2xl uppercase leading-tight md:text-4xl">
                {dict.about.journeyHeading}
              </h2>
            </div>
            <div className="md:col-span-5">
              <div className="journey-word-section opacity-0 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
                {dict.about.journeyParagraphs.map((para, pi) => (
                  <p key={pi}>
                    <ScrollRevealText
                      text={para}
                      baseOpacity={0.1}
                      start={isMobile ? "top 90%" : "top 85%"}
                      end={isMobile ? "top 60%" : "top 50%"}
                      scrub={0.8}
                    />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="tech-section border-t border-zinc-200 dark:border-zinc-800 px-6 py-20 md:px-16 md:py-28">
          <p className="section-label tech-label opacity-0 mb-6 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            /00-2
          </p>

          <h3 className="tech-heading opacity-0 mb-10 text-xl font-medium leading-snug md:text-2xl max-w-2xl">
            {dict.about.techHeading}
          </h3>

          <div className="tech-accordion opacity-0">
            {dict.about.techCategories.map((cat) => (
              <AccordionItem key={cat.label} label={cat.label} items={cat.items} />
            ))}
          </div>
        </section>

        {/* ══ ACTIVITIES ══════════════════════════════════════════════════════ */}
        <section className="activities-section border-t border-zinc-200 dark:border-zinc-800 px-6 pt-20 pb-0 md:px-16 md:pt-28 md:pb-0">
          <p className="section-label activities-label opacity-0 mb-6 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            /00-3
          </p>

          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="activities-heading opacity-0 font-serif text-2xl uppercase leading-tight md:text-4xl">
                {dict.about.activitiesHeading}
              </h2>
              <p className="activities-sub opacity-0 mt-2 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {dict.about.activitiesSub}
              </p>
            </div>
            <span className="activities-badge opacity-0 font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {dict.about.activitiesBadge}
            </span>
          </div>

          <div className="activities-gallery opacity-0">
            <ExpandingCards items={ACTIVITIES} showHint={false} />
          </div>
        </section>

        {/* ══ PERSONAL INTEREST ═════════════════════════════════════════════════ */}
        <section className="interest-section relative z-40 bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-800 px-6 py-20 md:px-16 md:py-28">
          <p className="section-label interest-label opacity-0 mb-6 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            /00-4
          </p>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="interest-heading opacity-0 text-2xl font-serif uppercase md:text-4xl lg:text-5xl leading-tight">
                {dict.about.interestHeading}
              </h2>
            </div>

            <div className="md:col-span-8 space-y-8">
              <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base max-w-xl text-justify">
                <p>
                  <ScrollRevealText
                    text={dict.about.interestP1}
                    baseOpacity={0.1}
                    start={isMobile ? "top 90%" : "top 75%"}
                    end={isMobile ? "top 60%" : "top 55%"}
                    scrub={0.8}
                  />
                </p>
              </div>

              {/* Image dengan efek zoom + parallax */}
              <div className="interest-img opacity-0 aspect-video w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src="/showcase.jpeg"
                  alt="Music — personal interest"
                  width={1280}
                  height={720}
                  className="parallax-img h-full w-full object-cover md:-translate-y-40"
                  style={{ transform: "scale(1.10)" }}
                />
              </div>

              <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base max-w-xl md:ml-auto">
                <p>
                  <ScrollRevealText
                    text={dict.about.interestP2}
                    baseOpacity={0.1}
                    start={isMobile ? "top 90%" : "top 85%"}
                    end={isMobile ? "top 60%" : "top 55%"}
                    scrub={0.8}
                  />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA + NAME ════════════════════════════════════════════════════════ */}
        <section className="cta-section border-t border-zinc-200 dark:border-zinc-800 px-6 py-20 md:px-16 md:py-28">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
            <div className="cta-meta opacity-0 hidden md:col-span-7 md:flex items-center justify-around">
              <div className="mb-10">
                <span className="font-mono text-xs font-medium uppercase text-zinc-400 dark:text-zinc-600">
                  Ammar Abdul Malik
                </span>
              </div>
              <div className="mt-10">
                <span className="font-mono text-xs font-medium uppercase text-zinc-400 dark:text-zinc-600">
                  Software Engineer
                </span>
              </div>
            </div>

            <div className="md:col-span-5">
              <p className="section-label cta-label opacity-0 mb-4 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                /00-5
              </p>
              <h2 className="cta-heading opacity-0 mb-6 text-3xl font-medium uppercase leading-tight">
                {dict.about.ctaHeading}
              </h2>
              <a
                href="mailto:ammarithm@gmail.com"
                className="cta-button opacity-0 group inline-flex items-center gap-3 relative justify-center whitespace-nowrap font-mono font-medium py-2 uppercase text-sm
                  after:w-full after:pointer-events-none after:absolute after:bottom-0 after:h-px after:bg-current
                  after:transition-transform after:duration-500 after:ease-in-out
                  after:left-0 after:origin-bottom-right hover:after:origin-bottom-left
                  after:scale-x-0 hover:after:scale-x-100"
              >
                <span>{dict.about.ctaBtn}</span>
                <Arrow size="md" direction="right" />
              </a>
            </div>
          </div>
        </section>

        <Footer time={time} />
      </main>
    </div>
  );
}

