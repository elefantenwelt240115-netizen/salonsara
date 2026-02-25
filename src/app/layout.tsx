import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salon Sara | Ihr Friseur in Solingen",
  description:
    "Salon Sara - Ihr Familienfriseur an der Hauptstraße in Solingen. Haarschnitte, Färben, Bart, Braut-Styling & mehr. 624+ Google-Bewertungen mit 5.0 Sternen.",
  keywords:
    "Friseur Solingen, Salon Sara, Haarschnitt Solingen, Balayage, Herrenfriseur, Damenfriseur, Bart, Braut Solingen",
  openGraph: {
    title: "Salon Sara | Ihr Friseur in Solingen",
    description:
      "Seit 2022 verwöhnen wir nicht nur Ihre Haare, sondern auch Ihr Herz. 624+ Bewertungen · 5.0 Sterne.",
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
    <html lang="de" className={`${dmSans.variable} ${dmSerif.variable} scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
