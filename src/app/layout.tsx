import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "EZIMAD — Prix préférentiels pour les salariés MAGZI",
    template: "%s · EZIMAD",
  },
  description:
    "Les produits des entreprises MAGZI, à prix préférentiels pour les salariés des zones industrielles. Inscription gratuite.",
  openGraph: {
    type: "website",
    locale: "fr_CM",
    siteName: "EZIMAD",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${hostGrotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
