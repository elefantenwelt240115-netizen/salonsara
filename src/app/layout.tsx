import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salon Sara | Ihr Friseur in Solingen",
  description:
    "Salon Sara - Ihr Familienfriseur an der Hauptstraße in Solingen. Haarschnitte, Färben, Bart, Braut-Styling & mehr. 989+ Google-Bewertungen mit 5.0 Sternen.",
  keywords:
    "Friseur Solingen, Salon Sara, Haarschnitt Solingen, Balayage, Herrenfriseur, Damenfriseur, Bart, Braut Solingen",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
  openGraph: {
    title: "Salon Sara | Ihr Friseur in Solingen",
    description:
      "Seit 2022 verwöhnen wir nicht nur Ihre Haare, sondern auch Ihr Herz. 989+ Bewertungen · 5.0 Sterne.",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${dmSans.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/logo.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/logo.png" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
