"use client";

import { useState, useEffect, useCallback } from "react";

const reviews = [
  {
    text: "Mit Abstand der beste Friseur in ganz Solingen. Man merkt, dass er sein Handwerk beherrscht.",
    author: "Zufriedener Kunde",
    stars: 5,
  },
  {
    text: "Bei Samir ist man sehr gut aufgehoben und man fühlt sich wie Zuhause. Service top, sehr kompetent und es wird auf Wünsche eingegangen.",
    author: "Stammkundin",
    stars: 5,
  },
  {
    text: "Super freundliche Beratung, nette Friseure und sehr kompetent. Die Hygiene im Salon ist ebenfalls top.",
    author: "Neukunde",
    stars: 5,
  },
  {
    text: "Ein super Friseur – freundlich, kompetent und das alles für einen absolut tollen Preis. Klare Empfehlung!",
    author: "Zufriedener Kunde",
    stars: 5,
  },
  {
    text: "Meine jahrelange Angst vor Friseurbesuchen wurde hier überwunden. Das Handwerk wird super beherrscht, meine Haare sehen wieder gesund und voll aus.",
    author: "Stammkundin",
    stars: 5,
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
    <section id="bewertungen" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-gold uppercase">
            Kundenstimmen
          </p>
          <h2
            className="text-3xl tracking-[0.15em] text-black uppercase sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Bewertungen
          </h2>
          <div className="mx-auto mt-4 h-[1px] w-16 bg-gold" />
        </div>

        {/* Rating Overview */}
        <div className="mb-12 flex items-center justify-center gap-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="#B8956A"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray">
            5.0 von 5 · 624+ Bewertungen auf Google
          </span>
        </div>

        {/* Review Carousel */}
        <div className="relative">
          {/* Large decorative quote */}
          <div
            className="absolute -top-6 left-0 text-7xl leading-none text-gold/15 select-none lg:-top-8 lg:text-9xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;
          </div>

          <div className="relative overflow-hidden py-8">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="w-full shrink-0 px-4 text-center sm:px-12"
                >
                  <blockquote
                    className="mb-8 text-xl leading-relaxed text-black sm:text-2xl lg:text-3xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {review.text}
                  </blockquote>
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(review.stars)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="#B8956A"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs tracking-wide text-gray">
                      — {review.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center border border-gray-light text-gray transition-all hover:border-gold hover:text-gold"
              aria-label="Vorherige Bewertung"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-6 bg-gold" : "w-1.5 bg-gray-light"
                  }`}
                  aria-label={`Bewertung ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center border border-gray-light text-gray transition-all hover:border-gold hover:text-gold"
              aria-label="Nächste Bewertung"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Google Reviews Link */}
        <div className="mt-12 text-center">
          <a
            href="https://www.google.com/search?q=Salon+Sara+Solingen+Rezensionen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b border-gold/30 pb-1 text-sm tracking-wide text-black transition-colors hover:border-gold hover:text-gold"
          >
            Alle Bewertungen auf Google ansehen
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
