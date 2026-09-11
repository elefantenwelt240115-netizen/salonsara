import { connection } from "next/server";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getSiteContent, type SiteContent } from "@/lib/site-content";

function parsePrice(value: string) {
  const match = value.match(/\d+(?:[.,]\d{1,2})?/);
  return match ? match[0].replace(",", ".") : null;
}

function buildSalonJsonLd(content: SiteContent) {
  const offers = content.services.flatMap((category) =>
    category.groups.flatMap((group) =>
      group.items.map((item) => {
        const displayedPrices = item.prices?.length
          ? item.prices
          : item.price
            ? [item.price]
            : [];
        const numericPrices = displayedPrices
          .map(parsePrice)
          .filter((price): price is string => Boolean(price));
        const priceValues = numericPrices.map(Number);

        return {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: item.name,
            category: category.label,
            ...(item.note ? { description: item.note } : {}),
          },
          ...(numericPrices.length
            ? {
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "EUR",
                  minPrice: Math.min(...priceValues).toFixed(2),
                  maxPrice: Math.max(...priceValues).toFixed(2),
                },
              }
            : {}),
        };
      }),
    ),
  );

  return {
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
      latitude: 51.1714,
      longitude: 7.0839,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "1000",
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
      itemListElement: offers,
    },
  };
}

export default async function Home() {
  await connection();
  const content = await getSiteContent();
  const jsonLd = JSON.stringify(buildSalonJsonLd(content)).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <SiteHeader announcement={content.announcement} />
      <main>
        <Hero />
        <About />
        <Services services={content.services} />
        <Gallery />
        <Reviews />
        <Contact openingHours={content.openingHours} />
      </main>
      <Footer openingHours={content.openingHours} />
    </>
  );
}
