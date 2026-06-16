"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function useGsapReady() {
  useEffect(() => {
    if (!registered && typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
  }, []);
}
