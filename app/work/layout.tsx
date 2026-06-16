import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Ammar Abdul Malik — full-stack web applications, RESTful APIs, and modern interfaces built with Next.js, Laravel, Node.js, and more.",
  openGraph: {
    title: "Work — Ammar Abdul Malik",
    description:
      "Selected projects by Ammar Abdul Malik — full-stack web applications, RESTful APIs, and modern interfaces built with Next.js, Laravel, Node.js, and more.",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
