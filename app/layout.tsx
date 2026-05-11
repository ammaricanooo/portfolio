import type { Metadata } from "next";
import { Geist_Mono, Manrope, Playfair_Display } from "next/font/google";
import PageLoader from "./components/PageLoader";
import SmoothScroll from "./components/SmoothScroll";
import { LoaderProvider } from "./lib/loaderContext";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ammar Abdul Malik — Software Engineer",
  description: "Software Engineer based in Indonesia. Building seamless digital solutions with clean code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${playfair.variable} ${geistMono.variable} antialiased`}
      >
        <LoaderProvider>
          <PageLoader />
          <SmoothScroll />
          {children}
        </LoaderProvider>
      </body>
    </html>
  );
}
