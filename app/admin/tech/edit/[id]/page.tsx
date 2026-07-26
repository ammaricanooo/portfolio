"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useClock } from "../../../../lib/useClock";
import type { TechCategory, TechItem } from "../../../../lib/types";

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

export default function EditTechCategoryPage() {
  const time = useClock();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [category, setCategory] = useState<TechCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch("/api/tech-categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((c: TechCategory) => c.id === id);
          if (found) {
            setCategory(found);
            setItems(found.items?.map((item: TechItem) => item.name) || []);
          }
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    void fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      label: formData.get("label"),
      order: Number(formData.get("order") || 0),
      items: items.filter((i) => i.trim()),
    };

    try {
      const res = await fetch(`/api/tech-categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/tech");
      } else {
        const err = await res.json().catch(() => ({}));
        setSaveError(err?.error || "Gagal menyimpan kategori.");
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

  if (!category) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
        <Header activePage="" />
        <main className="flex min-h-screen items-center justify-center px-4 py-20 md:px-16">
          <div className="text-center">
            <p className="text-lg mb-4">Kategori tidak ditemukan</p>
            <Link href="/admin/tech" className="text-blue-500 hover:underline">
              Kembali ke daftar kategori
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
            <h1 className="font-serif text-3xl uppercase tracking-wide">Edit Category</h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              {category.label}
            </p>
          </div>
          <Link
            href="/admin/tech"
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            ← Back
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category Label" required>
                <input
                  type="text"
                  name="label"
                  defaultValue={category.label}
                  required
                  className={inputCls}
                  placeholder="Frontend, Backend..."
                />
              </Field>
              <Field label="Order">
                <input
                  type="number"
                  name="order"
                  defaultValue={category.order ?? 0}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Tech Items ({items.length})
                </span>
                <button
                  type="button"
                  onClick={() => setItems([...items, ""])}
                  className="px-3 py-1 font-mono text-[9px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  + Tambah Item
                </button>
              </div>

              {items.length === 0 && (
                <p className="text-center py-4 font-mono text-[10px] text-zinc-300 dark:text-zinc-700 uppercase tracking-widest">
                  Belum ada item — klik &quot;+ Tambah Item&quot;
                </p>
              )}

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx] = e.target.value;
                        setItems(next);
                      }}
                      placeholder="React, Node.js, MySQL..."
                      className={`flex-1 ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={() => setItems(items.filter((_, i) => i !== idx))}
                      className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors text-sm flex-shrink-0 cursor-pointer"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {saveError && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 px-4 py-3 text-xs font-mono text-red-600 dark:text-red-400">
                {saveError}
              </div>
            )}

            <div className="flex gap-3 justify-end border-t border-zinc-100 dark:border-zinc-900 pt-6">
              <Link
                href="/admin/tech"
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
