import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Ammar Abdul Malik — a Software Engineer based in Bogor, Indonesia with 3+ years of experience in full-stack web development, Next.js, Laravel, and clean architecture.",
  keywords: [
    "Ammar Abdul Malik About",
    "Software Engineer Bogor Indonesia",
    "Full-Stack Developer Profile",
    "Next.js Laravel Developer",
    "Web Developer Background",
  ],
  alternates: {
    canonical: "https://ammaricano.my.id/about",
  },
  openGraph: {
    title: "About — Ammar Abdul Malik",
    description:
      "Learn about Ammar Abdul Malik — a Software Engineer based in Bogor, Indonesia with 3+ years of experience in full-stack web development, Next.js, Laravel, and clean architecture.",
    url: "https://ammaricano.my.id/about",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Ammar Abdul Malik",
    description:
      "Learn about Ammar Abdul Malik — a Software Engineer based in Bogor, Indonesia with 3+ years of experience in full-stack web development.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
