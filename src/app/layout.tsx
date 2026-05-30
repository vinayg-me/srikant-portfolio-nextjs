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
  metadataBase: new URL("https://srikantkrishna.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "Srikant Krishna - Music Composer, Producer, Orchestrator",
    description: "Official portfolio of Srikant Krishna, Grammy-winning arranger, film scoring specialist, and music producer.",
    url: "https://srikantkrishna.com",
    siteName: "Srikant Krishna Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Srikant-Logo.jpg",
        width: 800,
        height: 800,
        alt: "Srikant Krishna Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Srikant Krishna - Music Composer, Producer, Orchestrator",
    description: "Official portfolio of Srikant Krishna, Grammy-winning arranger, film scoring specialist, and music producer.",
    images: ["/Srikant-Logo.jpg"],
  },
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
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#070708] text-neutral-100 min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
