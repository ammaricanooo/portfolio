"use client";

import { SOCIALS } from "../lib/data";

interface FooterProps {
  time?: string;
}

export default function Footer({ time }: FooterProps) {
  return (
    <footer className="border-t border-zinc-200 px-8 py-8 dark:border-zinc-800 md:px-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-30">
            © 2026 — Ammar Abdul Malik
          </span>
          {time && (
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-20">
              {time} (GMT +7)
            </span>
          )}
        </div>
        <ul className="flex flex-wrap gap-6">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-widest opacity-40 transition-opacity duration-200 hover:opacity-100"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
