"use client";

import { useState, useEffect, useCallback } from "react";
import RevealSection from "./RevealSection";

const reviews = [
  {
    text: "Mit Abstand der beste Friseur in ganz Solingen. Man merkt, dass er sein Handwerk beherrscht.",
    author: "Mehmet K.",
    timeAgo: "vor 2 Monaten",
  },
  {
    text: "Bester Friseur in einem sehr schönen und gepflegten Salon. Haarschnitt und Bartpflege hervorragend.",
    author: "Lukas W.",
    timeAgo: "vor 3 Monaten",
  },
  {
    text: "Der absolut beste Friseursalon in Solingen! Super Team, tolle Atmosphäre und super Haarschnitt. 100% Weiterempfehlung!",
    author: "Sarah M.",
    timeAgo: "vor 1 Monat",
  },
  {
    text: "Hier wird Freundlichkeit und Dienstleistung GROSS geschrieben. Weiter so, Salon Sara Team!",
    author: "Aylin D.",
    timeAgo: "vor 4 Monaten",
  },
  {
    text: "Super Friseur – freundlich, kompetent und das alles für einen absolut tollen Preis. Klare Empfehlung!",
    author: "Tobias R.",
    timeAgo: "vor 2 Wochen",
  },
  {
    text: "Meine jahrelange Angst vor Friseurbesuchen wurde hier überwunden. Das Handwerk wird super beherrscht.",
    author: "Julia S.",
    timeAgo: "vor 5 Monaten",
  },
];

export default function Reviews() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="bewertungen" className="section-padding bg-cream">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <RevealSection>
          <div className="mb-16 text-center lg:mb-20">
            <p className="section-label">Kundenstimmen</p>
            <h2 className="section-heading">BEWERTUNGEN</h2>
            <div className="gold-line mx-auto" />
          </div>
        </RevealSection>

        {/* Google Rating Badge */}
        <RevealSection variant="scale">
          <div className="mb-14 flex justify-center">
            <div className="inline-flex items-center gap-5 rounded-full border border-gray-light/80 bg-white px-8 py-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-black">5.0</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray">989+ Bewertungen auf Google</p>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Review Card — Crossfade */}
        <RevealSection>
          <div className="relative min-h-[280px]">
            <div key={current} className="review-enter">
              <div className="rounded-2xl border border-gray-light/50 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-10">
                <div className="mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>

                <blockquote className="mb-8 text-xl leading-relaxed text-black sm:text-2xl">
                  &ldquo;{reviews[current].text}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-sm font-semibold text-gold">
                    {reviews[current].author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">{reviews[current].author}</p>
                    <p className="text-xs text-gray">{reviews[current].timeAgo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-light text-gray transition-all duration-300 hover:border-gold hover:text-gold"
            aria-label="Vorherige Bewertung"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === current ? "w-8 bg-gold" : "w-2 bg-gray-light hover:bg-gold/30"
                }`}
                aria-label={`Bewertung ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-light text-gray transition-all duration-300 hover:border-gold hover:text-gold"
            aria-label="Nächste Bewertung"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://www.google.com/search?q=Salon+Sara+Solingen+Rezensionen"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !text-xs"
          >
            Alle Bewertungen auf Google
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="7" y1="17" x2="17" y2="7"/>
              <polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
