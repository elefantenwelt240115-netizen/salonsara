"use client";

import { useEffect, useRef, useState } from "react";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl text-black lg:text-5xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {count}
        {suffix}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="ueber-uns" className="bg-warm-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-gold uppercase">
            Unser Salon
          </p>
          <h2
            className="text-3xl tracking-[0.15em] text-black uppercase sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Über Uns
          </h2>
          <div className="mx-auto mt-4 h-[1px] w-16 bg-gold" />
        </div>

        {/* Content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image Placeholder */}
          <div className="relative aspect-[4/5] overflow-hidden bg-cream">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-6xl text-gold/30" style={{ fontFamily: "var(--font-serif)" }}>S</div>
                <p className="text-sm tracking-wide text-gray">Salon Foto</p>
              </div>
            </div>
            {/* Decorative border */}
            <div className="absolute inset-4 border border-gold/20" />
          </div>

          {/* Text Content */}
          <div>
            <h3
              className="mb-6 text-2xl leading-snug text-black lg:text-3xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Wo Handwerk auf
              <br />
              Leidenschaft trifft
            </h3>
            <div className="space-y-4 text-sm leading-relaxed text-gray">
              <p>
                Seit 2022 verwöhnen wir nicht nur Ihre Haare, sondern auch Ihr
                Herz. Als Familienbetrieb – Vater und Sohn – liegt uns
                persönliche Beratung besonders am Herzen.
              </p>
              <p>
                Unser Ziel ist es, Sie glücklich zu machen, denn nichts ist
                schöner als ein Haarstyling, das perfekt zu Ihrer individuellen
                Persönlichkeit passt.
              </p>
              <p>
                Mit zwei Salons an der Hauptstraße in Solingen-Mitte sind wir
                Ihr Anlaufpunkt für professionelle Haarkunst – von klassischen
                Schnitten bis hin zu Balayage, Braut-Styling und Bartpflege.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-gray-light pt-10">
              <div className="text-center">
                <CountUp end={624} suffix="+" />
                <p className="mt-2 text-xs tracking-wide text-gray">
                  Bewertungen
                </p>
              </div>
              <div className="text-center">
                <CountUp end={5} suffix=".0" />
                <p className="mt-2 text-xs tracking-wide text-gray">Sterne</p>
              </div>
              <div className="text-center">
                <CountUp end={2} />
                <p className="mt-2 text-xs tracking-wide text-gray">
                  Standorte
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
