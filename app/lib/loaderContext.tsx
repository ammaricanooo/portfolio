"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  // Reset ready setiap route change
  useEffect(() => {
    setReady(false);
  }, [pathname]);

  // Listen for loader done — clear GSAP exit opacity lalu set ready
  useEffect(() => {
    const handler = () => {
      // Hapus inline opacity yang ditinggalkan exit animation
      const main = document.querySelector("main");
      if (main) gsap.set(main, { clearProps: "opacity" });
      setReady(true);
    };
    window.addEventListener("loaderDone", handler);
    return () => window.removeEventListener("loaderDone", handler);
  }, []);

  return (
    <LoaderContext.Provider value={{ ready }}>
      {children}
    </LoaderContext.Provider>
  );
}
