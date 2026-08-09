import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Ammar Abdul Malik — full-stack web applications, RESTful APIs, and modern interfaces built with Next.js, Laravel, Node.js, TypeScript, and PostgreSQL.",
  keywords: [
    "Ammar Abdul Malik Projects",
    "Software Engineer Portfolio",
    "Next.js Projects",
    "Laravel Projects",
    "Full-Stack Web App",
    "Web Development Indonesia",
  ],
  alternates: {
    canonical: "https://ammaricano.my.id/work",
  },
  openGraph: {
    title: "Work — Ammar Abdul Malik",
    description:
      "Selected projects by Ammar Abdul Malik — full-stack web applications, RESTful APIs, and modern interfaces built with Next.js, Laravel, Node.js, TypeScript, and PostgreSQL.",
    url: "https://ammaricano.my.id/work",
    type: "website",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Work — Ammar Abdul Malik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work — Ammar Abdul Malik",
    description:
      "Selected projects by Ammar Abdul Malik — full-stack web applications, RESTful APIs, and modern interfaces built with Next.js, Laravel, and Node.js.",
    images: ["/og-image"],
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
