"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import gsap from "gsap";

export function usePageTransition() {
  const router = useRouter();

  const navigate = useCallback((href: string) => {
    // Fade out main content + header bersamaan
    gsap.to(["main", ".header-anim"], {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        router.push(href);
      },
    });
  }, [router]);

  return { navigate };
}
