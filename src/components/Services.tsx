"use client";

import { useState } from "react";

type ServiceCategory = "damen" | "herren" | "kosmetik" | "kinder";

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
        { name: "Foliensträhnen", prices: ["35 €", "48 €", "70 €"] },
        { name: "Balayage", price: "ab 160 €" },
        { name: "Ansatz Farbe", price: "ab 30 €" },
        { name: "Global Farbe", prices: ["36 €", "46 €", "70 €"] },
      ],
    },
    {
      title: "Styling & Specials",
      items: [
        { name: "Dauerwelle", prices: ["42 €", "65 €", "75 €"] },
        { name: "Hochsteckfrisur", price: "Nach Absprache" },
        { name: "Haarverlängerung", price: "Nach Absprache" },
        { name: "Keratin-Glättung", price: "Nach Absprache" },
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
      title: "Bart & Farbe",
      items: [
        { name: "Bart Rasur", price: "12 €" },
        { name: "Färben", price: "ab 20 €" },
      ],
    },
  ],
  kosmetik: [
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
  kinder: [
    {
      title: "Trockenhaarschnitt",
      items: [
        { name: "Jungen bis 12 Jahren", price: "14 €" },
        { name: "Jungen bis 16 Jahren", price: "16 €" },
        { name: "Mädchen bis 12 Jahren", price: "16 €" },
        { name: "Mädchen bis 16 Jahren", price: "18 €" },
      ],
    },
  ],
};

const tabs: { key: ServiceCategory; label: string }[] = [
  { key: "damen", label: "Damen" },
  { key: "herren", label: "Herren" },
  { key: "kosmetik", label: "Kosmetik" },
  { key: "kinder", label: "Kinder" },
];

function PriceRow({ item }: { item: ServiceItem }) {
  return (
    <div className="price-row group py-4 border-b border-gray-light/60 last:border-b-0">
      {item.prices ? (
        /* Multi-price: stack on mobile, row on sm+ */
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[0.9375rem] text-black">{item.name}</span>
            <div className="hidden gap-6 text-right text-[0.9375rem] sm:flex">
              {item.prices.map((p, i) => (
                <span key={i} className="min-w-[52px] font-medium text-black">{p}</span>
              ))}
            </div>
          </div>
          {item.note && <p className="mt-1 text-xs text-gray/70">{item.note}</p>}
          <div className="mt-2 flex gap-4 text-[0.8125rem] sm:hidden">
            {item.prices.map((p, i) => (
              <span key={i} className="font-medium text-black">
                <span className="text-gray/50 text-[0.6875rem]">{["K", "M", "L"][i]} </span>{p}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* Single price: always row */
        <div className="flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[0.9375rem] text-black">{item.name}</span>
            {item.note && <p className="mt-1 text-xs text-gray/70">{item.note}</p>}
          </div>
          <span className="shrink-0 text-[0.9375rem] font-medium text-black">{item.price}</span>
        </div>
      )}
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
            <div className="mb-6 hidden justify-end gap-6 border-b border-gray-light/60 pb-4 text-xs font-semibold tracking-wide text-gray sm:flex">
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

        <div className="mt-10 text-center">
          <a href="#kontakt" className="btn-gold">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Jetzt Termin vereinbaren
          </a>
        </div>
      </div>
    </section>
  );
}
