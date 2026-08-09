"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollRevealText from "../components/ScrollRevealText";
import { scramble } from "../lib/scramble";
import { useLoader } from "../lib/loaderContext";
import { useClock } from "../lib/useClock";
import { useGsapReady } from "../lib/useGsapReady";
import { useIsMobile } from "../lib/useIsMobile";

// ─── Data ─────────────────────────────────────────────────────────────────────
const TECH_CATEGORIES = [
  {
    label: "IOT",
    items: ["ESP32", "Arduino"],
  },
  {
    label: "Backend",
    items: ["JavaScript", "PHP", "Python", "Node.js"],
  },
  {
    label: "Styling",
    items: ["Tailwind CSS", "SCSS / CSS", "Styled Components"],
  },
  {
    label: "Database",
    items: ["SQL", "MongoDB", "Firebase", "MySQL"],
  },
  {
    label: "Web Framework",
    items: ["Next.js", "Laravel", "express.js"],
  },
  {
    label: "Animation",
    items: ["GSAP", "Framer Motion", "CSS Animation"],
  },
];

const JOURNEY_PARAGRAPHS = [
  "Been a software engineer since early 2023. Since then, my sense of precision has grown. Years of experience in developing applications gave me an opportunity to improve my engineering skills to be more robust and scalable.",
  "In my career journey, I've collaborated with various teams, delivering solutions across different domains — from government systems to consumer apps. Each project has its own challenges, and each one becomes an opportunity to learn something new.",
  "I am currently focused on mastering modern full-stack development, building clean APIs, and crafting seamless user experiences.",
];

const INTEREST_P1 =
  "In my free time, I spend most of it at home, chilling out and doing something I like. I love diving deep into new technologies, reading about system design, and experimenting with side projects that push my limits.";

const INTEREST_P2 =
  "I also enjoy listening to music across genres — from lo-fi and jazz to electronic and indie. Music keeps me in the zone when I'm deep in a coding session. My Spotify Wrapped always surprises me with how many minutes I've logged.";

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
  useGsapReady();

  // Scramble — wait for loader
  useEffect(() => {
    if (!ready) return;
    scramble(heroNameRef.current, "An Ever-Growing", 1.5);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const isMobileDevice = window.innerWidth < 768;

      // Responsive ScrollTrigger start positions tailored per device
      const START = {
        journeyHeading: isMobileDevice ? "top 85%" : "top 70%",
        journeyWord: isMobileDevice ? "top 85%" : "top 70%",
        techHeading: isMobileDevice ? "top 80%" : "top 60%",
        techAccordion: isMobileDevice ? "top 55%" : "top 20%",
        sectionLabel: isMobileDevice ? "top 95%" : "top 88%",
        interestHeading: isMobileDevice ? "top 80%" : "top 60%",
        interestImg: isMobileDevice ? "top 75%" : "top 55%",
        ctaSection: isMobileDevice ? "top 80%" : "top 60%",
      };

      // Entrance animation delays adjusted for touch/desktop
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

      // Journey section
      gsap.fromTo(".journey-heading",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".journey-section", start: START.journeyHeading, once: true },
        }
      );
      gsap.fromTo(".journey-word-section",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2,
          scrollTrigger: { trigger: ".journey-word-section", start: START.journeyWord, once: true },
        }
      );

      // Tech section
      gsap.fromTo(".tech-heading",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".tech-section", start: START.techHeading, once: true },
        }
      );
      gsap.fromTo(".tech-accordion",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".tech-section", start: START.techAccordion, once: true },
        }
      );

      // Section labels (/00-2, /00-3, /00-4)
      gsap.utils.toArray<HTMLElement>(".section-label").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: el, start: START.sectionLabel, once: true },
          }
        );
      });

      // Interest section
      gsap.fromTo(".interest-heading",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".interest-section", start: START.interestHeading, once: true },
        }
      );
      gsap.fromTo(".interest-img",
        { opacity: 0 },
        {
          opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".interest-img", start: START.interestImg, once: true },
        }
      );

      // CTA section
      gsap.fromTo(".cta-section",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".cta-section", start: START.ctaSection, once: true },
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
      <Header activePage="about" />

      <main className="w-full">

        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <section className="relative flex flex-col justify-start px-6 pt-[18vh] pb-12 md:px-16 md:pt-[28vh]">

          {/* Tags */}
          <div className="mb-6 flex items-center justify-between">
            <span className="about-hero-tag opacity-0 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              Based in Indonesia
            </span>
            <span className="about-hero-tag opacity-0 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              Engineer
            </span>
          </div>

          {/* "An Ever-Growing" */}
          <h1
            ref={heroNameRef}
            className="font-serif text-[clamp(1rem,6vw,3rem)] uppercase leading-none tracking-tight"
          />

          {/* "Software Engineer" — same h1 visually, rendered as span inside a styled div */}
          <div className="relative mt-2 inline-block overflow-hidden w-fit">
            <span className="reveal-content opacity-0 pl-4 font-sans text-[clamp(1rem,6vw,3rem)] font-semibold uppercase md:pl-16 block">
              Software Engineer
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
                width={320}
                height={400}
                priority
                className="w-full object-cover scale-110 bg-zinc-200 dark:bg-zinc-800"
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
                A Journey of Progression
              </h2>
            </div>
            <div className="md:col-span-5">
              <div className="journey-word-section opacity-0 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
                {JOURNEY_PARAGRAPHS.map((para, pi) => (
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
          <p className="section-label opacity-0 mb-6 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            /00-2
          </p>

          <h3 className="tech-heading opacity-0 mb-10 text-xl font-medium leading-snug md:text-2xl max-w-2xl">
            In my development process, I try to achieve the best result without making it complex.
            I selectively choose some technologies by analyzing what the website needs. In that case,
            there are various technologies that I constantly use for my work.
          </h3>

          <div className="tech-accordion opacity-0">
            {TECH_CATEGORIES.map((cat) => (
              <AccordionItem key={cat.label} label={cat.label} items={cat.items} />
            ))}
          </div>
        </section>

        {/* ══ PERSONAL INTEREST ═════════════════════════════════════════════════ */}
        <section className="interest-section border-t border-zinc-200 dark:border-zinc-800 px-6 py-20 md:px-16 md:py-28">
          <p className="section-label opacity-0 mb-6 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            /00-3
          </p>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
            {/* Left: heading */}
            <div className="md:col-span-4">
              <h2 className="interest-heading opacity-0 text-2xl font-serif uppercase md:text-4xl lg:text-5xl leading-tight">
                Personal Interest
              </h2>
            </div>

            {/* Right: content */}
            <div className="md:col-span-8 space-y-8">
              <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base max-w-xl text-justify">
                <p>
                  <ScrollRevealText
                    text={INTEREST_P1}
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
                    text={INTEREST_P2}
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
        <section className="cta-section opacity-0 border-t border-zinc-200 dark:border-zinc-800 px-6 py-20 md:px-16 md:py-28">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">

            {/* Left: name + role — hidden on mobile */}
            <div className="hidden md:col-span-7 md:flex items-center justify-around">
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

            {/* Right: CTA */}
            <div className="md:col-span-5">
              <p className="section-label opacity-0 mb-4 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                /00-4
              </p>
              <h2 className="mb-6 text-3xl font-medium uppercase leading-tight">
                Your Next Software Dev Is Right Here.
              </h2>
              <a
                href="mailto:ammarithm@gmail.com"
                className="inline-flex items-center relative justify-center whitespace-nowrap font-mono font-medium py-2 uppercase text-sm
                  after:w-full after:pointer-events-none after:absolute after:bottom-0 after:h-px after:bg-current
                  after:transition-transform after:duration-500 after:ease-in-out
                  after:left-0 after:origin-bottom-right hover:after:origin-bottom-left
                  after:scale-x-0 hover:after:scale-x-100"
              >
                → Contact Me
              </a>
            </div>
          </div>
        </section>

        <Footer time={time} />
      </main>
    </div>
  );
}
