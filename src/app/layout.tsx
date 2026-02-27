import type { Metadata } from "next";
import { DM_Sans, Cinzel } from "next/font/google";
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
    "Salon Sara – Ihr Familienfriseur in Solingen-Mitte. Damen- & Herrenhaarschnitte, Balayage, Foliensträhnen, Bartpflege, Keratin-Glättung & Braut-Styling. 989+ Google-Bewertungen ★ 5.0 Sterne. Jetzt Termin vereinbaren!",
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
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: "/logo.png",
  },
  openGraph: {
    title: "Salon Sara | Friseur Solingen – Damen, Herren & Kinder",
    description:
      "Ihr Familienfriseur in Solingen-Mitte. Damen- & Herrenhaarschnitte, Balayage, Bartpflege & mehr. 989+ Bewertungen · 5.0 Sterne.",
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
      "Ihr Familienfriseur in Solingen-Mitte. Damen, Herren & Kinder. 989+ Bewertungen · 5.0 Sterne.",
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
    <html lang="de" className={`${dmSans.variable} ${cinzel.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/logo.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/logo.png" media="(prefers-color-scheme: dark)" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HairSalon",
              name: "Salon Sara",
              image: "https://salonsara.de/images/team.jpg",
              url: "https://salonsara.de",
              telephone: "+4921224926647",
              email: "salon.sara.sg@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Hauptstraße 39",
                addressLocality: "Solingen",
                postalCode: "42651",
                addressCountry: "DE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 51.1667,
                longitude: 7.0833,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "06:00",
                  closes: "21:00",
                },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5.0",
                reviewCount: "989",
                bestRating: "5",
                worstRating: "1",
              },
              priceRange: "€€",
              sameAs: [
                "https://www.instagram.com/salon_s_sara/",
                "https://www.tiktok.com/@salon_s._sara",
                "https://www.facebook.com/100188862682787",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Friseur-Dienstleistungen",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Damen Haarschnitt",
                      description: "Waschen, Schneiden, Föhnen für Damen",
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      price: "30.00",
                      priceCurrency: "EUR",
                      minPrice: "30.00",
                      maxPrice: "38.00",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Herren Haarschnitt",
                      description: "Waschen, Schneiden, Föhnen für Herren",
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      price: "20.00",
                      priceCurrency: "EUR",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Balayage",
                      description: "Professionelle Balayage-Färbetechnik",
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      price: "160.00",
                      priceCurrency: "EUR",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
