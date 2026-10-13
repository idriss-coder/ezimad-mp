import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "EZIMAD — Prix préférentiels pour les salariés MAGZI",
    template: "%s · EZIMAD",
  },
  description:
    "Les produits des entreprises MAGZI, à prix préférentiels pour les salariés des zones industrielles. Inscrivez-vous et choisissez vos catégories de produits.",
  openGraph: {
    type: "website",
    locale: "fr_CM",
    siteName: "EZIMAD",
  },
};

export const viewport: Viewport = {
  themeColor: "#131921",
};

// Polices système uniquement : page légère et rendu « web d'avant » voulu par le client.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
