"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Locale } from "./dictionary";

export function useCurrentLang(): Locale {
  const pathname = usePathname();
  const first = pathname ? pathname.split("/").filter(Boolean)[0]?.toLowerCase() : "en";
  const lang: Locale = first === "id" ? "id" : "en";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return lang;
}
