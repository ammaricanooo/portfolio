"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useClock } from "../../lib/useClock";
import type { Project } from "../../lib/types";

export default function AdminProjectsPage() {
  const time = useClock();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

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

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) void fetchProjects();
  }, [isAuthenticated, fetchProjects]);

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
    setProjects([]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus project ini?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) void fetchProjects();
    } catch {
      // silent
    }
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
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-sm transition-colors focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus:border-zinc-600"
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
            <h1 className="font-serif text-3xl uppercase tracking-wide">Projects Admin</h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              Manage portfolio projects
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/tech"
              className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Tech Categories →
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 flex justify-end">
          <Link
            href="/admin/projects/add"
            className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-mono text-[10px] uppercase tracking-widest hover:opacity-85 transition-opacity"
          >
            + Add New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 font-mono text-[10px] uppercase tracking-widest text-zinc-300 dark:text-zinc-700">
            Belum ada project — klik &quot;+ Add New Project&quot;
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 font-semibold">
                      #{proj.order ?? 0}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600">
                      {proj.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium mb-1">{proj.title}</h3>
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-500 mb-3">
                    {proj.tech}
                  </p>
                  {proj.desc && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                      {proj.desc}
                    </p>
                  )}
                  {proj.img && (
                    <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden mb-3">
                      <img src={proj.img} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/admin/projects/edit/${proj.id}`}
                    className="flex-1 px-4 py-2 text-center rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-[10px] uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="flex-1 px-4 py-2 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 font-mono text-[10px] uppercase tracking-widest text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer time={time} />
    </div>
  );
}
