import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import PageLoader from "./components/PageLoader";
import SmoothScroll from "./components/SmoothScroll";
import { JsonLd } from "./components/JsonLd";
import { LoaderProvider } from "./lib/loaderContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plusjakartasans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ammaricano.dev"),
  title: {
    default: "Ammar Abdul Malik Software Engineer",
    template: "%s | Ammar Abdul Malik",
  },
  description:
    "Software Engineer based in Indonesia specializing in full-stack web development, building seamless digital solutions with clean code and modern architecture.",
  keywords: [
    "Ammar Abdul Malik",
    "Software Engineer",
    "Full-Stack Developer",
    "Next.js",
    "Laravel",
    "Web Developer Indonesia",
    "Portfolio",
  ],
  authors: [{ name: "Ammar Abdul Malik", url: "https://ammaricano.dev" }],
  creator: "Ammar Abdul Malik",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ammaricano.dev",
    siteName: "Ammar Abdul Malik Software Engineer",
    title: "Ammar Abdul Malik Software Engineer",
    description:
      "Software Engineer based in Indonesia specializing in full-stack web development, building seamless digital solutions with clean code.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ammar Abdul Malik Software Engineer",
    description:
      "Software Engineer based in Indonesia specializing in full-stack web development, building seamless digital solutions with clean code.",
    creator: "@ammaricano",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <JsonLd />
        <LoaderProvider>
          <PageLoader />
          <SmoothScroll />
          {children}
        </LoaderProvider>
      </body>
    </html>
  );
}
