"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useClock } from "../lib/useClock";
import type { Project, TechCategory, TechItem } from "../lib/types";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const time = useClock();

  // Management State
  const [activeTab, setActiveTab] = useState<"projects" | "tech">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [techCategories, setTechCategories] = useState<TechCategory[]>([]);
  
  // Loading & Action states
  const [projectModal, setProjectModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Project | null }>({
    open: false,
    mode: "add",
    data: null,
  });
  const [techModal, setTechModal] = useState<{ open: boolean; mode: "add" | "edit"; data: TechCategory | null }>({
    open: false,
    mode: "add",
    data: null,
  });

  // Verify auth on load
  useEffect(() => {
    // Check if we already have session
    fetch("/api/projects")
      .then((res) => {
        if (res.ok) {
          // If we can fetch/check credentials without error (e.g. standard endpoint check)
          // We check if a test auth verification endpoint is ok or try to fetch data.
          // For now, we will verify by checking a dummy POST to /api/auth.
          // Let's just default to requiring password entry once, or read cookie.
          // Actually, we can check by querying if we can perform a protected action, or if we have the cookie.
        }
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, []);

  // Fetch Data
  const fetchData = async () => {
    try {
      const pRes = await fetch("/api/projects");
      const pData = await pRes.json();
      if (Array.isArray(pData)) setProjects(pData);

      const tRes = await fetch("/api/tech-categories");
      const tData = await tRes.json();
      if (Array.isArray(tData)) setTechCategories(tData);
    } catch {
      // Fetch failed silently
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchData();
    }
  }, [isAuthenticated]);

  // Handle Auth Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        const errData = await res.json();
        setAuthError(errData.error || "Password tidak cocok");
      }
    } catch {
      setAuthError("Koneksi gagal");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setPassword("");
  };

  // Project CRUD Actions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      title: formData.get("title"),
      tech: formData.get("tech"),
      url: formData.get("url"),
      year: formData.get("year"),
      desc: formData.get("desc"),
      img: formData.get("img"),
      order: Number(formData.get("order") || 0),
    };

    const isEdit = projectModal.mode === "edit";
    const url = isEdit && projectModal.data ? `/api/projects/${projectModal.data.id}` : "/api/projects";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setProjectModal({ open: false, mode: "add", data: null });
        fetchData();
      } else {
        alert("Gagal menyimpan proyek");
      }
    } catch {
      // Save failed silently
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      // Save failed silently
    }
  };

  // Tech Category CRUD Actions
  const handleSaveTechCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const itemInputs = form.querySelectorAll<HTMLInputElement>("[name='techItem']");
    const items: string[] = [];
    itemInputs.forEach((input) => {
      if (input.value.trim()) items.push(input.value.trim());
    });

    const payload = {
      label: formData.get("label"),
      order: Number(formData.get("order") || 0),
      items,
    };

    const isEdit = techModal.mode === "edit";
    const url = isEdit && techModal.data?.id ? `/api/tech-categories/${techModal.data.id}` : "/api/tech-categories";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setTechModal({ open: false, mode: "add", data: null });
        fetchData();
      } else {
        alert("Gagal menyimpan kategori teknologi");
      }
    } catch {
      // Save failed silently
    }
  };

  const handleDeleteTechCategory = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori teknologi ini?")) return;
    try {
      const res = await fetch(`/api/tech-categories/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      // Save failed silently
    }
  };

  // Tech items dynamic inputs management inside Modal
  const [modalTechItems, setModalTechItems] = useState<string[]>([]);
  useEffect(() => {
    if (techModal.open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalTechItems(techModal.data?.items?.map((item: TechItem) => item.name) || []);
    }
  }, [techModal.open, techModal.data]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Verifying Session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white flex flex-col font-sans">
      <Header activePage="" />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-32 md:px-12">
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="max-w-md mx-auto my-12 p-8 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md shadow-xl">
            <div className="text-center mb-8">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-2">
                Secured Admin Access
              </span>
              <h2 className="font-serif text-3xl uppercase tracking-wide">
                Dashboard
              </h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 focus:outline-hidden focus:border-black dark:focus:border-white transition-colors"
                />
              </div>

              {authError && (
                <p className="text-xs font-mono text-red-500 uppercase tracking-wider text-center mt-2">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-mono text-xs uppercase tracking-widest text-white dark:text-black bg-black dark:bg-white hover:opacity-85 transition-opacity"
              >
                Authenticate
              </button>
            </form>
          </div>
        ) : (
          /* Management Dashboard */
          <div>
            {/* Header Admin */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1">
                  Control Room
                </span>
                <h1 className="font-serif text-4xl uppercase tracking-wide leading-none">
                  Content Manager
                </h1>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border border-red-500/30 text-red-500 rounded-full hover:bg-red-500/10 transition-colors self-start md:self-auto"
              >
                Logout Session
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8">
              <button
                onClick={() => setActiveTab("projects")}
                className={`pb-2 px-1 font-serif text-lg tracking-wide uppercase transition-colors relative ${
                  activeTab === "projects" ? "text-black dark:text-white" : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                Projects
                {activeTab === "projects" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black dark:bg-white" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("tech")}
                className={`pb-2 px-1 font-serif text-lg tracking-wide uppercase transition-colors relative ${
                  activeTab === "tech" ? "text-black dark:text-white" : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                Tech Stack
                {activeTab === "tech" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black dark:bg-white" />
                )}
              </button>
            </div>

            {/* TAB CONTENT: PROJECTS */}
            {activeTab === "projects" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Projects ({projects.length})
                  </h3>
                  <button
                    onClick={() => setProjectModal({ open: true, mode: "add", data: null })}
                    className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-mono text-[10px] uppercase tracking-widest hover:opacity-85 transition-opacity"
                  >
                    + Add New Project
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 font-semibold">
                            Order {proj.order} &bull; {proj.year}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 font-mono scale-95 opacity-60">
                            {proj.id}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">{proj.title}</h4>
                        <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 mb-3">{proj.tech}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">{proj.desc}</p>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
                        <button
                          onClick={() => setProjectModal({ open: true, mode: "edit", data: proj })}
                          className="flex-1 py-2 font-mono text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                          Edit Details
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: TECH STACK */}
            {activeTab === "tech" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Tech Categories ({techCategories.length})
                  </h3>
                  <button
                    onClick={() => setTechModal({ open: true, mode: "add", data: null })}
                    className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-mono text-[10px] uppercase tracking-widest hover:opacity-85 transition-opacity"
                  >
                    + Add New Category
                  </button>
                </div>

                <div className="space-y-6">
                  {techCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xs"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 font-semibold block">
                            Order {cat.order}
                          </span>
                          <h4 className="text-xl font-bold uppercase tracking-wide text-zinc-800 dark:text-zinc-200 mt-1">
                            {cat.label}
                          </h4>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setTechModal({ open: true, mode: "edit", data: cat })}
                            className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => cat.id && handleDeleteTechCategory(cat.id)}
                            className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {cat.items && cat.items.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-200/30 dark:border-zinc-800/40">
                          {cat.items.map((item) => (
                            <span
                              key={item.id}
                              className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/20"
                            >
                              {item.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: PROJECT */}
      {projectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl uppercase tracking-wide mb-6">
              {projectModal.mode === "edit" ? "Edit Project" : "Add Project"}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={projectModal.data?.title || ""}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Tech Stack *</label>
                  <input
                    type="text"
                    name="tech"
                    defaultValue={projectModal.data?.tech || ""}
                    placeholder="e.g. Next.js, Tailwind"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Year *</label>
                  <input
                    type="text"
                    name="year"
                    defaultValue={projectModal.data?.year || ""}
                    placeholder="e.g. 2024"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">URL</label>
                  <input
                    type="text"
                    name="url"
                    defaultValue={projectModal.data?.url || "#"}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Order</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={projectModal.data?.order || 0}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Image Link (URL)</label>
                <input
                  type="text"
                  name="img"
                  defaultValue={projectModal.data?.img || ""}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Description</label>
                <textarea
                  name="desc"
                  defaultValue={projectModal.data?.desc || ""}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-hidden text-xs leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900/60 justify-end">
                <button
                  type="button"
                  onClick={() => setProjectModal({ open: false, mode: "add", data: null })}
                  className="px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-mono text-[10px] uppercase tracking-widest rounded-lg hover:opacity-85"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TECH CATEGORY */}
      {techModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl uppercase tracking-wide mb-6">
              {techModal.mode === "edit" ? "Edit Tech Category" : "Add Tech Category"}
            </h3>

            <form onSubmit={handleSaveTechCategory} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Category Label *</label>
                  <input
                    type="text"
                    name="label"
                    defaultValue={techModal.data?.label || ""}
                    placeholder="e.g. Frontend, Backend"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Order</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={techModal.data?.order || 0}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Tech Items List */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Tech Items ({modalTechItems.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setModalTechItems([...modalTechItems, ""])}
                    className="px-3 py-1 font-mono text-[9px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {modalTechItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        name="techItem"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...modalTechItems];
                          newItems[idx] = e.target.value;
                          setModalTechItems(newItems);
                        }}
                        placeholder="e.g. React, Node.js, MySQL"
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setModalTechItems(modalTechItems.filter((_, i) => i !== idx))}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-md text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900/60 justify-end">
                <button
                  type="button"
                  onClick={() => setTechModal({ open: false, mode: "add", data: null })}
                  className="px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-mono text-[10px] uppercase tracking-widest rounded-lg hover:opacity-85"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer time={time} />
    </div>
  );
}
