import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SahakarSeva — Working Model",
  description:
    "Cooperative-owned digital marketplace for skilled workers. 95% to the worker, 5% to the platform. SIH 2026 demo build."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans sahakar-shell">{children}</body>
    </html>
  );
}
