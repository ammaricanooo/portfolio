import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === "id";

  const title = isId ? "Tentang" : "About";
  const desc = isId
    ? "Mengenal Ammar Abdul Malik — Software Engineer asal Bogor, Indonesia dengan keahlian pengembangan web full-stack, Laravel, Next.js, dan arsitektur backend."
    : "Learn about Ammar Abdul Malik — Software Engineer based in Bogor, Indonesia specializing in full-stack web development, Laravel, Next.js, and backend architecture.";

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://ammaricano.my.id/${lang}/about`,
      languages: {
        en: "https://ammaricano.my.id/en/about",
        id: "https://ammaricano.my.id/id/about",
      },
    },
    openGraph: {
      title: `${title} — Ammar Abdul Malik`,
      description: desc,
      url: `https://ammaricano.my.id/${lang}/about`,
      type: "profile",
      images: [
        {
          url: "/og-image",
          width: 1200,
          height: 630,
          alt: `About Ammar Abdul Malik`,
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

