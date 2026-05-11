"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface LoaderCtx {
  ready: boolean; // true = loader selesai, page boleh animasi
}

const LoaderContext = createContext<LoaderCtx>({ ready: false });

export function useLoader() {
  return useContext(LoaderContext);
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  // Reset setiap route change
  useEffect(() => {
    setReady(false);
  }, [pathname]);

  // Listen for loader done event
  useEffect(() => {
    const handler = () => setReady(true);
    window.addEventListener("loaderDone", handler);
    return () => window.removeEventListener("loaderDone", handler);
  }, []);

  return (
    <LoaderContext.Provider value={{ ready }}>
      {children}
    </LoaderContext.Provider>
  );
}
