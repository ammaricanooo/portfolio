"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

export function usePageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const isNavigatingRef = useRef(false);

  // When route changes, release navigation lock
  useEffect(() => {
    isNavigatingRef.current = false;
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      // Handle hash anchor links
      if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) {
          const win = window as unknown as { lenis?: { scrollTo: (target: Element) => void } };
          if (win.lenis && typeof win.lenis.scrollTo === "function") {
            win.lenis.scrollTo(el);
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
        return;
      }

      // Normalize paths for comparison (ignoring query params, hash, trailing slashes)
      const normalize = (path: string) => {
        if (!path) return "/";
        const clean = path.split("?")[0].split("#")[0];
        const trimmed = clean.replace(/\/+$/, "");
        return trimmed === "" ? "/" : trimmed;
      };

      const currentPath = normalize(pathname);
      const targetPath = normalize(href);

      // If already on the requested page, keep content visible and smoothly scroll to top
      if (currentPath === targetPath) {
        const main = document.querySelector("main");
        if (main) gsap.set(main, { clearProps: "opacity" });
        gsap.to(".header-anim", { opacity: 1, duration: 0.2, overwrite: "auto" });
        document.documentElement.classList.remove("is-loading");

        const win = window as unknown as { lenis?: { scrollTo: (target: number) => void } };
        if (win.lenis && typeof win.lenis.scrollTo === "function") {
          win.lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      // Prevent concurrent duplicate transition calls
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      // 1. Halaman lama memudar keluar (Fade Out) terlebih dahulu secara jelas
      gsap.to(["main", ".header-anim"], {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          // 2. Setelah halaman selesai fade out, baru munculkan PageLoader untuk proses compiling
          window.dispatchEvent(new CustomEvent("startPageLoader"));

          // 3. Mulai proses navigasi rute di Next.js (compiling)
          router.push(href);
        },
      });

      // Safety timeout fallback: jika router.push memakan waktu > 10s
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 10000);
    },
    [router, pathname]
  );

  return { navigate };
}
