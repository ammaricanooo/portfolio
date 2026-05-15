import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import PageLoader from "./components/PageLoader";
import SmoothScroll from "./components/SmoothScroll";
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
        className={`${plusJakartaSans.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased`}
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
