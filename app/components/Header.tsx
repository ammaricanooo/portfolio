"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { scramble } from "../lib/scramble";
import TransitionLink from "./TransitionLink";
import { useLoader } from "../lib/loaderContext";

interface HeaderProps {
  activePage?: "about" | "work" | "";
}

export default function Header({ activePage = "" }: HeaderProps) {
  const labsBtnRef = useRef<HTMLDivElement>(null);
  const nameRef    = useRef<HTMLSpanElement>(null);
  const { ready }  = useLoader();

  // Fade in saat ready, reset opacity-0 dulu setiap kali re-mount
  useEffect(() => {
    gsap.set(".header-anim", { opacity: 0 });
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Lock width sebelum animate
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

  return (
    <header className="header-anim fixed inset-x-0 top-0 z-50 py-6 opacity-0 mix-blend-difference text-white tracking-wide">
      <div className="mx-auto flex items-center justify-between px-4 md:px-16">
        <TransitionLink
          href="/"
          className="relative font-mono text-sm uppercase mr-8
            after:w-full after:pointer-events-none after:absolute after:bottom-0 after:h-px after:bg-current
            after:transition-transform after:duration-500 after:ease-in-out
            after:left-0 after:origin-bottom-right hover:after:origin-bottom-left
            after:scale-x-0 hover:after:scale-x-100"
          onMouseEnter={(e) => onHover(e, "Ammar Abdul Malik")}
        >
          <span ref={nameRef} className="sc">Ammar Abdul Malik</span>
        </TransitionLink>

        <ul className="flex items-center gap-8 md:gap-12">
          {(["About", "Work"] as const).map((item) => {
            const isActive = activePage === item.toLowerCase();
            return (
              <li key={item}>
                {isActive ? (
                  <span className="font-mono text-sm uppercase opacity-40 cursor-default">
                    {item}
                  </span>
                ) : (
                  <TransitionLink
                    href={`/${item.toLowerCase()}`}
                    className="group relative font-mono text-sm uppercase
                      after:w-full after:pointer-events-none after:absolute after:bottom-0 after:h-px after:bg-current
                      after:transition-transform after:duration-500 after:ease-in-out
                      after:left-0 after:origin-bottom-right hover:after:origin-bottom-left
                      after:scale-x-0 hover:after:scale-x-100"
                    onMouseEnter={(e) => onHover(e, item)}
                  >
                    <span className="sc">{item}</span>
                  </TransitionLink>
                )}
              </li>
            );
          })}
          <li>
            <div ref={labsBtnRef} onMouseMove={onMagMove} onMouseLeave={onMagLeave} className="inline-block whitespace-nowrap overflow-hidden shrink-0">
              <a
                href="#"
                className="group relative block overflow-hidden bg-white px-5 py-2 font-mono text-sm font-bold uppercase text-black transition-all duration-300 hover:scale-95"
              >
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">API</span>
                <span className="absolute inset-x-0 top-0 block translate-y-full bg-white px-5 py-2 text-black transition-transform duration-300 group-hover:translate-y-0">API</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
}
