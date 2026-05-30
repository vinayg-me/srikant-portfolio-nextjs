import type { Metadata } from "next";
import { Outfit, Cinzel } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Srikant Krishna - Music Composer, Producer, Orchestrator",
  description: "Official portfolio of Srikant Krishna, Grammy-winning arranger, film scoring specialist, and music producer.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cinzel.variable} h-full antialiased scroll-smooth`}
    >
      <body className="bg-[#070708] text-neutral-100 min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
