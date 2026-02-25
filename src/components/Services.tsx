"use client";

import { useState } from "react";

type ServiceCategory = "damen" | "herren" | "beauty";

interface ServiceItem {
  name: string;
  prices?: string[];
  price?: string;
  note?: string;
}

interface ServiceGroup {
  title: string;
  items: ServiceItem[];
}

const serviceData: Record<ServiceCategory, ServiceGroup[]> = {
  damen: [
    {
      title: "Schnitt",
      items: [
        { name: "Trockenhaarschnitt", prices: ["20 €", "23 €", "25 €"] },
        {
          name: "Waschen, Schneiden, Föhnen",
          prices: ["30 €", "34 €", "38 €"],
        },
      ],
    },
    {
      title: "Farbe",
      items: [
        { name: "Global Farbe", prices: ["36 €", "46 €", "56 €"] },
        { name: "Foliensträhnen", prices: ["35 €", "48 €", "70 €"] },
        { name: "Ansatz Farbe", price: "ab 30 €" },
        { name: "Balayage", price: "ab 160 €" },
      ],
    },
    {
      title: "Styling",
      items: [
        { name: "Dauerwelle", prices: ["42 €", "65 €", "75 €"] },
        { name: "Hochsteckfrisur", price: "ab 99 €" },
      ],
    },
    {
      title: "Specials",
      items: [
        { name: "Braut-Paket", price: "250 €" },
        { name: "Make-up", price: "ab 49 €" },
        {
          name: "Extensions & Keratin",
          note: "Tape / Clip / Bonding / Microring / Keratin-Glättung",
          price: "auf Anfrage",
        },
      ],
    },
  ],
  herren: [
    {
      title: "Schnitt",
      items: [
        { name: "Trockenhaarschnitt", price: "18 €" },
        { name: "Waschen, Schneiden, Föhnen", price: "20 €" },
      ],
    },
    {
      title: "Farbe & Bart",
      items: [
        { name: "Färben", price: "ab 20 €" },
        { name: "Bart rasieren", price: "auf Anfrage" },
      ],
    },
  ],
  beauty: [
    {
      title: "Augenbrauen & Gesicht",
      items: [
        { name: "Augenbrauen zupfen (mit Faden)", price: "8 €" },
        { name: "Augenbrauen färben", price: "8 €" },
        { name: "Gesichtshaarentfernung (mit Faden)", price: "10 €" },
        { name: "Wimpern färben", price: "10 €" },
      ],
    },
  ],
};

const tabs: { key: ServiceCategory; label: string }[] = [
  { key: "damen", label: "Damen" },
  { key: "herren", label: "Herren" },
  { key: "beauty", label: "Beauty" },
];

function PriceRow({ item }: { item: ServiceItem }) {
  return (
    <div className="group">
      <div className="flex items-baseline justify-between gap-4 py-3">
        <div className="min-w-0">
          <span className="text-sm text-black">{item.name}</span>
          {item.note && (
            <p className="mt-0.5 text-xs text-gray">{item.note}</p>
          )}
        </div>
        <div className="flex shrink-0 items-baseline gap-2">
          {item.prices ? (
            <div className="flex gap-4 text-right text-sm">
              {item.prices.map((p, i) => (
                <span key={i} className="min-w-[50px] text-black">
                  {p}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-black">{item.price}</span>
          )}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-light transition-colors group-hover:bg-gold/30" />
    </div>
  );
}

export default function Services() {
  const [activeTab, setActiveTab] = useState<ServiceCategory>("damen");

  return (
    <section id="preise" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-gold uppercase">
            Services & Preise
          </p>
          <h2
            className="text-3xl tracking-[0.15em] text-black uppercase sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Unsere Preise
          </h2>
          <div className="mx-auto mt-4 h-[1px] w-16 bg-gold" />
        </div>

        {/* Tabs */}
        <div className="mb-12 flex justify-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all ${
                activeTab === tab.key
                  ? "text-black"
                  : "text-gray hover:text-black"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Length Legend for Damen */}
        {activeTab === "damen" && (
          <div className="mb-8 flex justify-end gap-4 text-xs text-gray">
            <span>Kurz</span>
            <span>Mittel</span>
            <span>Lang</span>
          </div>
        )}

        {/* Service Groups */}
        <div className="space-y-10">
          {serviceData[activeTab].map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-xs tracking-[0.2em] text-gold uppercase">
                {group.title}
              </h3>
              <div>
                {group.items.map((item) => (
                  <PriceRow key={item.name} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-12 text-center text-xs text-gray">
          Alle Preise inkl. MwSt. · Preisänderungen vorbehalten
        </p>
      </div>
    </section>
  );
}
