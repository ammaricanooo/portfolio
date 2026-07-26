import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 | Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white flex flex-col items-center justify-center px-8">
      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-4">
        /404
      </p>
      <h1 className="font-serif text-6xl md:text-8xl uppercase leading-none mb-6">
        Not Found
      </h1>
      <p className="font-mono text-sm uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-10 max-w-md text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full border border-black dark:border-white px-8 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
      >
        Back to Home
      </Link>
    </div>
  );
}
