import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Election Guide AI",
  description: "AI-powered voting assistant — simplifying democracy for every citizen",
  keywords: ["election", "voting", "AI", "guide", "India", "voter registration"],
  authors: [{ name: "Election Guide AI Team" }],
  openGraph: {
    title: "Election Guide AI",
    description: "Your intelligent guide to democracy",
    type: "website",
  },
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {/* Skip Navigation Link — Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-[1000] focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Skip to main content
        </a>
        <div id="main-content" role="main">
          {children}
        </div>
      </body>
    </html>
  );
}
