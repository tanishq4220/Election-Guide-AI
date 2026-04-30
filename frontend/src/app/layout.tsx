import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Election Guide AI — Your Intelligent Democracy Assistant",
  description:
    "AI-powered voting assistant that simplifies democracy for every citizen. Get personalized election guidance, readiness checks, and instant answers.",
  keywords: [
    "election",
    "voting",
    "AI",
    "guide",
    "India",
    "voter registration",
    "democracy",
    "polling booth",
    "Voter ID",
  ],
  authors: [{ name: "Election Guide AI Team" }],
  openGraph: {
    title: "Election Guide AI",
    description: "Your intelligent guide to democracy — powered by Google Gemini",
    type: "website",
    siteName: "Election Guide AI",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Election Guide AI",
    description: "AI-powered voting assistant — simplifying democracy for every citizen",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {/* Skip Navigation Link — Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-[1000] focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
        <main id="main-content" role="main" aria-label="Election Guide AI Application">
          {children}
        </main>
      </body>
    </html>
  );
}
