"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { scramble } from "../lib/scramble";
import { useLoader } from "../lib/loaderContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TECH_CATEGORIES = [
  {
    label: "Web Framework",
    items: ["Next.js", "React", "Vue.js", "Nuxt.js"],
  },
  {
    label: "Styling",
    items: ["Tailwind CSS", "SCSS / CSS", "Styled Components"],
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
        className="flex w-full items-center justify-between py-4 text-left text-xl font-medium uppercase transition-opacity hover:opacity-60 md:text-2xl"
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
  const [time, setTime] = useState("");
  const { ready } = useLoader();

  // Clock
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
          .format(new Date()).toUpperCase()
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scramble — wait for loader
  useEffect(() => {
    if (!ready) return;
    scramble(heroNameRef.current, "An Ever-Growing", 1.5);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      // Parallax untuk image di personal interest
      gsap.to(".parallax-img", {
        y: "10%",
        ease: "none",
        scrollTrigger: {
          trigger: ".interest-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,        // tambah scrub dari 0.5 jadi 1.5 (lebih lambat & smooth)
        },
      });

      // ── Intro: reveal-block + reveal-content — identik dengan homepage ──
      gsap.timeline()
        .fromTo(".reveal-block",
          { scaleX: 0, transformOrigin: "left" },
          { scaleX: 1, duration: 0.7, ease: "power4.inOut", delay: 0.5 }
        )
        .set(".reveal-content", { opacity: 1 })
        .to(".reveal-block",
          { scaleX: 0, transformOrigin: "right", duration: 0.7, ease: "power4.inOut" }
        );

      // Tags fade in
      gsap.fromTo(".about-hero-tag",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.1, delay: 0.3 }
      );

      // Clip reveal untuk gambar Ammar dari atas ke bawah
      gsap.fromTo(".ammar-clip",
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 2,
          ease: "power4.inOut",
          delay: 0.5,
        }
      );

      // Fade in untuk container gambarnya (opsional, tanpa y)
      gsap.fromTo(".about-hero-img",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 0.8 }
      );

      // Journey
      gsap.fromTo(".journey-heading",
        { opacity: 0 },
        {
          opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".journey-section", start: "top 55%", once: true },
        }
      );
      gsap.utils.toArray<HTMLElement>(".journey-word").forEach((word) => {
        gsap.fromTo(word,
          { opacity: 0.08 },
          { opacity: 1, scrollTrigger: { trigger: word, start: "top 70%", end: "top 55%", scrub: 0.6 } }
        );
      });

      // Tech
      gsap.fromTo(".tech-heading",
        { opacity: 0 },
        {
          opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".tech-section", start: "top 50%", once: true },
        }
      );
      gsap.fromTo(".tech-accordion",
        { opacity: 0 },
        {
          opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".tech-section", start: "top 15%", once: true },
        }
      );

      // Section labels (/00-2, /00-3, /00-4)
      gsap.utils.toArray<HTMLElement>(".section-label").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0 },
          {
            opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 68%", once: true },
          }
        );
      });

      // Interest
      gsap.fromTo(".interest-heading",
        { opacity: 0 },
        {
          opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".interest-section", start: "top 50%", once: true },
        }
      );
      gsap.utils.toArray<HTMLElement>(".interest-word").forEach((word) => {
        gsap.fromTo(word,
          { opacity: 0.08 },
          { opacity: 1, scrollTrigger: { trigger: word, start: "top 68%", end: "top 65%", scrub: 0.4 } }
        );
      });

      // Interest image fade-in
      gsap.fromTo(".interest-img",
        { opacity: 0 },
        {
          opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".interest-img", start: "top 55%", once: true },
        }
      );

      // CTA
      gsap.fromTo(".cta-section",
        { opacity: 0 },
        {
          opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".cta-section", start: "top 50%", once: true },
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
        <section className="relative flex flex-col justify-start px-8 pt-[20vh] md:pt-[32vh] md:px-16">

          {/* Tags — kiri & kanan, sama posisi dengan bottom bar homepage */}
          <div className="mb-6 flex items-center justify-between">
            <span className="about-hero-tag opacity-0 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              Based in Indonesia
            </span>
            <span className="about-hero-tag opacity-0 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              Engineer
            </span>
          </div>

          {/* "An Ever-Growing" — heroNameRef + scramble, identik dengan homepage */}
          <h1
            ref={heroNameRef}
            className="font-serif text-[clamp(1rem,6vw,3rem)] uppercase leading-none tracking-tight"
          />

          {/* "Software Engineer" — reveal-block + reveal-content, identik dengan homepage */}
          <div className="relative mt-2 inline-block overflow-hidden w-fit">
            <h2 className="reveal-content opacity-0 pl-4 font-sans text-[clamp(1rem,6vw,3rem)] font-semibold uppercase md:pl-16">
              Software Engineer
            </h2>
            <div className="reveal-block absolute inset-0 ml-4 scale-x-0 bg-black dark:bg-white md:ml-16" />
          </div>

          {/* Photo — pojok kanan */}
          <div className="about-hero-img opacity-0 mt-6 flex justify-end mb-8">
            <div className="overflow-hidden ammar-clip"
              style={{
                width: "clamp(140px, 22vw, 320px)",
                clipPath: "inset(0% 0% 100% 0%)"  // changed: dari 0% bawah 100%
              }}>
              <img
                src="/ammar.png"
                alt="Ammar Abdul Malik"
                className="w-full object-cover scale-110 bg-zinc-200 dark:bg-zinc-800"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          </div>

        </section>

        {/* ══ JOURNEY ═══════════════════════════════════════════════════════════ */}
        <section className="journey-section px-8 pb-16 md:px-16 md:py-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7">
              <h3 className="journey-heading opacity-0 font-serif text-2xl uppercase leading-tight md:text-4xl">
                A Journey of Progression
              </h3>
            </div>
            <div className="md:col-span-5">
              <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
                {JOURNEY_PARAGRAPHS.map((para, pi) => (
                  <p key={pi}>
                    {para.split(" ").map((word, i) => (
                      <Fragment key={i}>
                        <span className="journey-word inline-block opacity-10">{word}</span>{" "}
                      </Fragment>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="tech-section border-t border-zinc-200 dark:border-zinc-800 px-8 py-16 md:px-16 md:py-24">
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
        <section className="interest-section border-t border-zinc-200 dark:border-zinc-800 px-8 py-16 md:px-16 md:py-24">
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
                  {INTEREST_P1.split(" ").map((word, i) => (
                    <Fragment key={i}>
                      <span className="interest-word inline-block opacity-10">{word}</span>{" "}
                    </Fragment>
                  ))}
                </p>
              </div>

              {/* Image dengan efek zoom + parallax */}
              <div className="interest-img opacity-0 aspect-video w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                <img
                  src="music.png"
                  alt=""
                  className="parallax-img h-full w-full object-cover md:-translate-y-40"
                  style={{ transform: "scale(1.20)" }}
                />
              </div>

              <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base max-w-xl md:ml-auto">
                <p>
                  {INTEREST_P2.split(" ").map((word, i) => (
                    <Fragment key={i}>
                      <span className="interest-word inline-block opacity-10">{word}</span>{" "}
                    </Fragment>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA + NAME ════════════════════════════════════════════════════════ */}
        <section className="cta-section opacity-0 border-t border-zinc-200 dark:border-zinc-800 px-8 py-16 md:px-16 md:py-20">
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