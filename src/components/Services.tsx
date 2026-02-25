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
        { name: "Waschen, Schneiden, Föhnen", prices: ["30 €", "34 €", "38 €"] },
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
        { name: "Extensions & Keratin", note: "Tape / Clip / Bonding / Microring / Keratin-Glättung", price: "auf Anfrage" },
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
    <div className="group py-4 border-b border-gray-light/60 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[0.9375rem] text-black">{item.name}</span>
          {item.note && <p className="mt-1 text-xs text-gray/70">{item.note}</p>}
        </div>
        <div className="flex shrink-0 items-baseline gap-4">
          {item.prices ? (
            <div className="flex gap-6 text-right text-[0.9375rem]">
              {item.prices.map((p, i) => (
                <span key={i} className="min-w-[52px] font-medium text-black">{p}</span>
              ))}
            </div>
          ) : (
            <span className="text-[0.9375rem] font-medium text-black">{item.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [activeTab, setActiveTab] = useState<ServiceCategory>("damen");

  return (
    <section id="preise" className="section-padding bg-cream">
      <div className="mx-auto max-w-3xl">
        {/* Section Header */}
        <div className="mb-16 text-center lg:mb-20">
          <p className="section-label">Services & Preise</p>
          <h2 className="section-heading">UNSERE PREISE</h2>
          <div className="gold-line mx-auto" />
        </div>

        {/* Tabs */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-full border border-gray-light bg-white p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-7 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-black text-white shadow-sm"
                    : "text-gray hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Card */}
        <div className="rounded-2xl border border-gray-light/60 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-10">
          {/* Length Legend for Damen */}
          {activeTab === "damen" && (
            <div className="mb-6 flex justify-end gap-6 border-b border-gray-light/60 pb-4 text-xs font-semibold tracking-wide text-gray">
              <span>Kurz</span>
              <span>Mittel</span>
              <span>Lang</span>
            </div>
          )}

          {/* Service Groups */}
          <div className="space-y-8">
            {serviceData[activeTab].map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 text-[0.6875rem] font-semibold tracking-[0.25em] text-gold uppercase">
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
        </div>

        <p className="mt-8 text-center text-xs text-gray/70">
          Alle Preise inkl. MwSt. · Preisänderungen vorbehalten
        </p>
      </div>
    </section>
  );
}
