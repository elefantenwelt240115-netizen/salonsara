import type { Metadata } from "next";
import { DM_Sans, Cinzel } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Salon Sara | Friseur Solingen – Damen, Herren & Kinder",
    template: "%s | Salon Sara Solingen",
  },
  description:
    "Salon Sara – Ihr Familienfriseur in Solingen-Mitte. Damen- & Herrenhaarschnitte, Balayage, Foliensträhnen, Bartpflege, Keratin-Glättung & Braut-Styling. 1.000+ Google-Bewertungen ★ 5.0 Sterne. Jetzt Termin vereinbaren!",
  keywords: [
    "Friseur Solingen",
    "Salon Sara",
    "Haarschnitt Solingen",
    "Balayage Solingen",
    "Herrenfriseur Solingen",
    "Damenfriseur Solingen",
    "Bartpflege Solingen",
    "Braut-Styling Solingen",
    "Keratin Glättung Solingen",
    "Kinderfriseur Solingen",
    "Foliensträhnen Solingen",
    "Friseur Hauptstraße Solingen",
    "Haarverlängerung Solingen",
    "Dauerwelle Solingen",
    "Augenbrauen zupfen Solingen",
  ],
  authors: [{ name: "Salon Sara" }],
  creator: "Salon Sara",
  metadataBase: new URL("https://salonsara.de"),
  alternates: {
    canonical: "/",
    languages: {
      "de-DE": "/",
    },
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: "/logo.png",
  },
  openGraph: {
    title: "Salon Sara | Friseur Solingen – Damen, Herren & Kinder",
    description:
      "Ihr Familienfriseur in Solingen-Mitte. Damen- & Herrenhaarschnitte, Balayage, Bartpflege & mehr. 1.000+ Bewertungen · 5.0 Sterne.",
    type: "website",
    locale: "de_DE",
    url: "https://salonsara.de",
    siteName: "Salon Sara",
    images: [
      {
        url: "/images/team.jpg",
        width: 1200,
        height: 630,
        alt: "Salon Sara Team in Solingen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salon Sara | Friseur Solingen",
    description:
      "Ihr Familienfriseur in Solingen-Mitte. Damen, Herren & Kinder. 1.000+ Bewertungen · 5.0 Sterne.",
    images: ["/images/team.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${dmSans.variable} ${cinzel.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="icon" href="/logo.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/logo.png" media="(prefers-color-scheme: dark)" />
        {/* Google Search Console – Platzhalter: Ersetze DEIN_CODE mit dem echten Verifizierungscode */}
        {/* <meta name="google-site-verification" content="DEIN_CODE" /> */}
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
