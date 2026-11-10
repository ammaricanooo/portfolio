"use client";

import { createContext, useContext, useState, useEffect } from "react";
import gsap from "gsap";

interface LoaderCtx {
  ready: boolean;
}

const LoaderContext = createContext<LoaderCtx>({ ready: false });

export function useLoader() {
  return useContext(LoaderContext);
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Akhir: Ketika tirai loader mulai meluncur ke atas, pudarkan masuk (fade in) halaman baru
    const doneHandler = () => {
      const main = document.querySelector("main");
      if (main) {
        gsap.fromTo(
          main,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.08 }
        );
      }
      gsap.to(".header-anim", { opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.15, overwrite: "auto" });
      setReady(true);
    };

    // Awal: Ketika tombol navigasi diklik & transisi dimulai
    const startHandler = () => {
      setReady(false);
    };

    window.addEventListener("loaderDone", doneHandler);
    window.addEventListener("startPageLoader", startHandler);

    // Fallback: jika loaderDone tidak terpanggil dalam 3.5s pada render awal
    const timer = setTimeout(() => {
      const main = document.querySelector("main");
      if (main) gsap.set(main, { clearProps: "opacity" });
      gsap.to(".header-anim", { opacity: 1, duration: 0.3, overwrite: "auto" });
      setReady(true);
    }, 3500);

    return () => {
      window.removeEventListener("loaderDone", doneHandler);
      window.removeEventListener("startPageLoader", startHandler);
      clearTimeout(timer);
    };
  }, []);

  return (
    <LoaderContext.Provider value={{ ready }}>
      {children}
    </LoaderContext.Provider>
  );
}
