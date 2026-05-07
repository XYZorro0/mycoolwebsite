import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RetroOS — Portfolio",
  description:
    "An interactive retro-OS portfolio: boot sequence, draggable windows, and a few easter eggs.",
  applicationName: "RetroOS Portfolio",
  authors: [{ name: "Portfolio" }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-[#e6f2ff] antialiased">
        <a
          href="#desktop-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[9999] focus:rounded focus:bg-white focus:px-3 focus:py-1 focus:text-black"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
