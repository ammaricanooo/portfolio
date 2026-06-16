import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Ammar Abdul Malik — a Software Engineer based in Indonesia with expertise in full-stack web development, modern frameworks, and clean architecture.",
  openGraph: {
    title: "About — Ammar Abdul Malik",
    description:
      "Learn about Ammar Abdul Malik — a Software Engineer based in Indonesia with expertise in full-stack web development, modern frameworks, and clean architecture.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
