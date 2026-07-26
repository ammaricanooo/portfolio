"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useClock } from "../lib/useClock";

const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700";

export default function AdminDashboardPage() {
  const time = useClock();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/auth");
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch {
        // silent
      } finally {
        setIsVerifying(false);
      }
    };
    void verifySession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setAuthError("Password salah.");
      }
    } catch {
      setAuthError("Koneksi gagal.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setPassword("");
  };

  if (isVerifying) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
        <Header activePage="" />
        <main className="flex min-h-screen items-center justify-center px-4 py-20 md:px-16">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/40 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/40">
            <h1 className="mb-6 text-center font-serif text-2xl uppercase tracking-wide">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputCls}
                />
              </div>
              {authError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-mono text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full rounded-xl bg-black px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-white transition-opacity hover:opacity-80 disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </main>
        <Footer time={time} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
        <Header activePage="" />

      <main className="px-4 pt-[18vh] pb-8 md:px-16 md:pt-[20vh] md:pb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl uppercase tracking-wide">Admin Dashboard</h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              Content management system
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Link
            href="/admin/projects"
            className="group p-8 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
          >
            <div className="mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                Manage
              </span>
              <h2 className="font-serif text-2xl uppercase tracking-wide mt-1 group-hover:translate-x-1 transition-transform">
                Projects →
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Create, edit, and manage portfolio projects
            </p>
          </Link>

          <Link
            href="/admin/tech"
            className="group p-8 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
          >
            <div className="mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                Manage
              </span>
              <h2 className="font-serif text-2xl uppercase tracking-wide mt-1 group-hover:translate-x-1 transition-transform">
                Tech Stack →
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Manage technology categories and items
            </p>
          </Link>
        </div>
      </main>

      <Footer time={time} />
    </div>
  );
}
