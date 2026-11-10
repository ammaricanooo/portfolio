"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { scramble } from "../lib/scramble";
import TransitionLink from "./TransitionLink";
import Arrow from "./Arrow";
import { useLoader } from "../lib/loaderContext";
import { useCurrentLang } from "../lib/useCurrentLang";
import { getDictionary, getLocalizedPath } from "../lib/dictionary";

interface HeaderProps {
  activePage?: "home" | "about" | "work" | "";
}

export default function Header({ activePage = "" }: HeaderProps) {
  const labsBtnRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const { ready } = useLoader();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const lang = useCurrentLang();
  const dict = getDictionary(lang);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on page change
  useEffect(() => {
    setMenuOpen(false);
  }, [activePage]);

  // Fade in saat ready, reset opacity-0 dulu setiap kali re-mount
  useEffect(() => {
    gsap.set(".header-anim", { opacity: 0 });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (nameRef.current) {
      nameRef.current.style.width = `${nameRef.current.offsetWidth}px`;
    }
    gsap.to(".header-anim", { opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.1 });
  }, [ready]);

  const onHover = (e: React.MouseEvent<HTMLAnchorElement>, text: string) => {
    scramble(e.currentTarget.querySelector<HTMLElement>(".sc"), text, 0.4, true);
  };

  const onMagMove = (e: React.MouseEvent) => {
    if (!labsBtnRef.current) return;
    const { left, top, width, height } = labsBtnRef.current.getBoundingClientRect();
    gsap.to(labsBtnRef.current, {
      x: (e.clientX - (left + width / 2)) * 0.6,
      y: (e.clientY - (top + height / 2)) * 0.6,
      duration: 0.3, ease: "power2.out",
    });
  };
  const onMagLeave = () =>
    gsap.to(labsBtnRef.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(3,1)" });

  const navItems = [
    { key: "home", label: dict.nav.home, href: `/${lang}` },
    { key: "about", label: dict.nav.about, href: `/${lang}/about` },
    { key: "work", label: dict.nav.work, href: `/${lang}/work` },
  ];

  return (
    <>
      <header className="header-anim fixed inset-x-0 top-0 z-50 py-6 opacity-0 mix-blend-difference text-white tracking-wide">
        <div className="mx-auto flex items-center justify-between px-4 md:px-16">
          <TransitionLink
            href={`/${lang}`}
            className="relative font-mono text-sm uppercase mr-8
              after:w-full after:pointer-events-none after:absolute after:bottom-0 after:h-px after:bg-current
              after:transition-transform after:duration-500 after:ease-in-out
              after:left-0 after:origin-bottom-right hover:after:origin-bottom-left
              after:scale-x-0 hover:after:scale-x-100"
            onMouseEnter={(e) => onHover(e, "Ammar Abdul Malik")}
          >
            <span ref={nameRef} className="sc">
              Ammar Abdul Malik
            </span>
          </TransitionLink>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 md:gap-12">
            {navItems.map((item) => {
              const isActive = activePage === item.key;
              return (
                <li key={item.key}>
                  {isActive ? (
                    <TransitionLink
                      href={item.href}
                      className="group relative font-mono text-sm uppercase opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
                      onMouseEnter={(e) => onHover(e, item.label)}
                    >
                      <span className="sc">{item.label}</span>
                    </TransitionLink>
                  ) : (
                    <TransitionLink
                      href={item.href}
                      className="group relative font-mono text-sm uppercase
                        after:w-full after:pointer-events-none after:absolute after:bottom-0 after:h-px after:bg-current
                        after:transition-transform after:duration-500 after:ease-in-out
                        after:left-0 after:origin-bottom-right hover:after:origin-bottom-left
                        after:scale-x-0 hover:after:scale-x-100"
                      onMouseEnter={(e) => onHover(e, item.label)}
                    >
                      <span className="sc">{item.label}</span>
                    </TransitionLink>
                  )}
                </li>
              );
            })}

            <li>
              <div
                ref={labsBtnRef}
                onMouseMove={onMagMove}
                onMouseLeave={onMagLeave}
                className="inline-block whitespace-nowrap overflow-hidden shrink-0"
              >
                <a
                  href="https://api.ammaricano.my.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden bg-white px-5 py-2 font-mono text-sm font-bold uppercase text-black transition-all duration-300 hover:scale-95"
                >
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                    {dict.nav.api}
                  </span>
                  <span className="absolute inset-x-0 top-0 block translate-y-full bg-white px-5 py-2 text-black transition-transform duration-300 group-hover:translate-y-0">
                    {dict.nav.api}
                  </span>
                </a>
              </div>
            </li>

            {/* Language Switcher Desktop — paling pojok kanan, tanpa border, tanpa underline, tanpa bold, simpel */}
            <li className="flex items-center">
              <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest select-none">
                <TransitionLink
                  href={getLocalizedPath(pathname, "en")}
                  className={`transition-opacity duration-200 ${lang === "en" ? "opacity-100" : "opacity-40 hover:opacity-100"
                    }`}
                >
                  EN
                </TransitionLink>
                <span className="opacity-30">/</span>
                <TransitionLink
                  href={getLocalizedPath(pathname, "id")}
                  className={`transition-opacity duration-200 ${lang === "id" ? "opacity-100" : "opacity-40 hover:opacity-100"
                    }`}
                >
                  ID
                </TransitionLink>
              </div>
            </li>
          </ul>

          {/* Mobile Right Controls: Menu Button + Language Switcher */}
          <div className="md:hidden flex items-center gap-5">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="relative flex flex-col justify-center items-end w-8 h-8 gap-2 cursor-pointer focus:outline-none select-none"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span
                className={`block h-[1.5px] w-8 bg-white transition-all duration-300 ease-out origin-center ${menuOpen ? "translate-y-[4.75px] rotate-45" : ""
                  }`}
              />
              <span
                className={`block h-[1.5px] w-8 bg-white transition-all duration-300 ease-out origin-center ${menuOpen ? "-translate-y-[4.75px] -rotate-45" : ""
                  }`}
              />
            </button>

            {/* Language Switcher Mobile — paling pojok kanan, simpel */}
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest select-none">
              <TransitionLink
                href={getLocalizedPath(pathname, "en")}
                className={`transition-opacity duration-200 ${lang === "en" ? "opacity-100" : "opacity-40"
                  }`}
              >
                EN
              </TransitionLink>
              <span className="opacity-30">/</span>
              <TransitionLink
                href={getLocalizedPath(pathname, "id")}
                className={`transition-opacity duration-200 ${lang === "id" ? "opacity-100" : "opacity-40"
                  }`}
              >
                ID
              </TransitionLink>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer / Fullscreen Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-zinc-50 dark:bg-black text-black dark:text-white flex flex-col justify-between px-6 pt-28 pb-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen
          ? "opacity-100 pointer-events-auto translate-y-0"
          : "opacity-0 pointer-events-none -translate-y-4"
          }`}
      >
        <nav className="flex flex-col gap-6 my-auto">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              {dict.nav.navigation}
            </p>
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest select-none">
              <TransitionLink
                href={getLocalizedPath(pathname, "en")}
                onClick={() => setMenuOpen(false)}
                className={`transition-opacity duration-200 ${lang === "en" ? "opacity-100" : "opacity-40"
                  }`}
              >
                EN
              </TransitionLink>
              <span className="opacity-30">/</span>
              <TransitionLink
                href={getLocalizedPath(pathname, "id")}
                onClick={() => setMenuOpen(false)}
                className={`transition-opacity duration-200 ${lang === "id" ? "opacity-100" : "opacity-40"
                  }`}
              >
                ID
              </TransitionLink>
            </div>
          </div>

          <TransitionLink
            href={`/${lang}`}
            onClick={() => setMenuOpen(false)}
            className="flex items-baseline justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 group"
          >
            <span
              className={`font-serif text-3xl uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300 ${activePage === "home" || activePage === "" ? "opacity-40" : ""
                }`}
            >
              {dict.nav.home}
            </span>
            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">/01</span>
          </TransitionLink>

          <TransitionLink
            href={`/${lang}/about`}
            onClick={() => setMenuOpen(false)}
            className="flex items-baseline justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 group"
          >
            <span
              className={`font-serif text-3xl uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300 ${activePage === "about" ? "opacity-40" : ""
                }`}
            >
              {dict.nav.about}
            </span>
            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">/02</span>
          </TransitionLink>

          <TransitionLink
            href={`/${lang}/work`}
            onClick={() => setMenuOpen(false)}
            className="flex items-baseline justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 group"
          >
            <span
              className={`font-serif text-3xl uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300 ${activePage === "work" ? "opacity-40" : ""
                }`}
            >
              {dict.nav.work}
            </span>
            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">/03</span>
          </TransitionLink>

          <a
            href="mailto:ammarithm@gmail.com"
            onClick={() => setMenuOpen(false)}
            className="flex items-baseline justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 group"
          >
            <span className="font-serif text-3xl uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
              {dict.nav.contact}
            </span>
            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600 inline-flex items-center gap-1.5">
              <span>/04</span>
              <Arrow size="xs" direction="right" className="opacity-70 group-hover:opacity-100" />
            </span>
          </a>
        </nav>

        {/* Secondary Endpoint Link — kecil & dibedakan di paling bawah menu */}
        <div className="pt-4 pb-2">
          <a
            href="https://api.ammaricano.my.id"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span className="inline-block h-1.5 w-1.5 bg-black dark:bg-white" />
            <span>Public REST API <span className="underline">api.ammaricano.my.id</span></span>
            <Arrow size="xs" direction="right" className="opacity-60 group-hover:opacity-100" />
          </a>
        </div>

        {/* Footer info in mobile drawer */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-end justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          <div>
            <p className="text-black dark:text-white font-semibold mb-1">Ammar Abdul Malik</p>
            <p>Bogor, Indonesia</p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/ammaricanooo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              GH
            </a>
            <a
              href="https://linkedin.com/in/ammaricano"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              IN
            </a>
            <a
              href="https://instagram.com/ammaricano"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              IG
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
