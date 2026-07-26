"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useClock } from "../../../../lib/useClock";
import type { Project } from "../../../../lib/types";

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
      {label}
      {required && <span className="ml-1 text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700";

const readImageAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });

export default function EditProjectPage() {
  const time = useClock();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((p: Project) => p.id === id);
          if (found) {
            setProject(found);
            setImgUrl(found.img || "");
          }
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    void fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    let imageValue = imgUrl.trim();

    if (selectedImage && selectedImage.size > 0) {
      try {
        imageValue = await readImageAsDataUrl(selectedImage);
      } catch {
        setSaveError("Gagal membaca file gambar.");
        setSaving(false);
        return;
      }
    } else if (!imageValue && project?.img) {
      imageValue = project.img;
    }

    const payload = {
      title: formData.get("title"),
      tech: formData.get("tech"),
      url: formData.get("url"),
      year: formData.get("year"),
      desc: formData.get("desc"),
      img: imageValue,
      order: Number(formData.get("order") || 0),
    };

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/projects");
      } else {
        const err = await res.json().catch(() => ({}));
        setSaveError(err?.error || "Gagal menyimpan project.");
      }
    } catch {
      setSaveError("Koneksi gagal. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
        <Header activePage="" />
        <main className="flex min-h-screen items-center justify-center px-4 py-20 md:px-16">
          <div className="text-center">
            <p className="text-lg mb-4">Project tidak ditemukan</p>
            <Link href="/admin/projects" className="text-blue-500 hover:underline">
              Kembali ke daftar project
            </Link>
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
            <h1 className="font-serif text-3xl uppercase tracking-wide">Edit Project</h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              {project.title}
            </p>
          </div>
          <Link
            href="/admin/projects"
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            ← Back
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Field label="Title" required>
                  <input
                    type="text"
                    name="title"
                    defaultValue={project.title}
                    required
                    className={inputCls}
                    placeholder="Project name"
                  />
                </Field>
              </div>
              <div>
                <Field label="Tech Stack" required>
                  <input
                    type="text"
                    name="tech"
                    defaultValue={project.tech}
                    required
                    className={inputCls}
                    placeholder="Next.js, Tailwind"
                  />
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Field label="Year" required>
                  <input
                    type="text"
                    name="year"
                    defaultValue={project.year}
                    required
                    className={inputCls}
                    placeholder="2024"
                  />
                </Field>
              </div>
              <div>
                <Field label="URL">
                  <input
                    type="text"
                    name="url"
                    defaultValue={project.url}
                    className={inputCls}
                    placeholder="https://..."
                  />
                </Field>
              </div>
              <div>
                <Field label="Order">
                  <input
                    type="number"
                    name="order"
                    defaultValue={project.order ?? 0}
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-2.5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Image — upload file atau isi URL eksternal
              </p>

              <input
                ref={fileInputRef}
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setSelectedImage(file);
                  if (file) setImgUrl("");
                }}
                className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-black file:px-3 file:py-1.5 file:font-mono file:text-[10px] file:uppercase file:tracking-widest file:text-white dark:file:bg-white dark:file:text-black cursor-pointer"
              />

              {selectedImage && (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50/60 dark:border-gray-900/40 dark:bg-gray-950/20 px-3 py-2 text-[10px] font-mono">
                  <span className="truncate text-gray-700 dark:text-gray-400">{selectedImage.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-red-400 hover:text-red-600 ml-2"
                  >
                    Hapus
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-300 dark:text-zinc-700">atau</span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              </div>

              <input
                type="text"
                name="img"
                value={imgUrl}
                onChange={(e) => {
                  setImgUrl(e.target.value);
                  if (e.target.value) setSelectedImage(null);
                }}
                disabled={Boolean(selectedImage)}
                placeholder="https://example.com/image.jpg"
                className={`${inputCls} disabled:cursor-not-allowed disabled:opacity-50`}
              />

              {project.img && !selectedImage && !imgUrl && (
                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 truncate">
                  Current: {project.img.startsWith("data:") ? "[embedded image]" : project.img}
                </p>
              )}
            </div>

            <div>
              <Field label="Description">
                <textarea
                  name="desc"
                  defaultValue={project.desc}
                  rows={4}
                  className={`${inputCls} resize-none leading-relaxed`}
                  placeholder="Deskripsi singkat tentang project..."
                />
              </Field>
            </div>

            {saveError && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 px-4 py-3 text-xs font-mono text-red-600 dark:text-red-400">
                {saveError}
              </div>
            )}

            <div className="flex gap-3 justify-end border-t border-zinc-100 dark:border-zinc-900 pt-6">
              <Link
                href="/admin/projects"
                className="px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-mono text-[10px] uppercase tracking-widest rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {saving && (
                  <span className="inline-block w-3 h-3 border border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                )}
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer time={time} />
    </div>
  );
}
