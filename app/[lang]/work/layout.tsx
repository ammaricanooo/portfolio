import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === "id";

  const title = isId ? "Karya & Proyek" : "Work & Projects";
  const desc = isId
    ? "Daftar proyek dan karya pilihan Ammar Abdul Malik — sistem web full-stack, arsitektur backend, dan aplikasi digital modern."
    : "Selected projects by Ammar Abdul Malik — full-stack web applications, backend architectures, and modern digital products.";

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://ammaricano.my.id/${lang}/work`,
      languages: {
        en: "https://ammaricano.my.id/en/work",
        id: "https://ammaricano.my.id/id/work",
      },
    },
    openGraph: {
      title: `${title} — Ammar Abdul Malik`,
      description: desc,
      url: `https://ammaricano.my.id/${lang}/work`,
      type: "website",
      images: [
        {
          url: "/og-image",
          width: 1200,
          height: 630,
          alt: `Work — Ammar Abdul Malik`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Ammar Abdul Malik`,
      description: desc,
      images: ["/og-image"],
    },
  };
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

