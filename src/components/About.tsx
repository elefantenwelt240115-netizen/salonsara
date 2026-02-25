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
      <div className="font-heading text-4xl text-black lg:text-5xl">
        {count}{suffix}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="ueber-uns" className="section-padding bg-warm-white">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center lg:mb-20">
          <p className="section-label">Unser Salon</p>
          <h2 className="section-heading">ÜBER UNS</h2>
          <div className="gold-line mx-auto" />
        </div>

        {/* Content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image Placeholder */}
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-cream lg:max-w-none" style={{ aspectRatio: "4/5" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-heading mb-3 text-6xl text-gold/20">S</div>
                <p className="text-sm text-gray/60">Salon Foto</p>
              </div>
            </div>
            <div className="absolute inset-4 rounded-xl border border-gold/10" />
          </div>

          {/* Text Content */}
          <div>
            <h3 className="font-heading mb-6 text-2xl leading-snug lg:text-3xl">
              Wo Handwerk auf
              <br />
              Leidenschaft trifft
            </h3>
            <div className="space-y-5 text-[0.9375rem] leading-relaxed text-gray">
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
            <div className="mt-12 grid grid-cols-3 gap-6 rounded-2xl border border-gray-light/80 bg-white p-8">
              <div className="text-center">
                <CountUp end={989} suffix="+" />
                <p className="mt-2 text-xs font-medium tracking-wide text-gray">Bewertungen</p>
              </div>
              <div className="text-center">
                <CountUp end={5} suffix=".0" />
                <p className="mt-2 text-xs font-medium tracking-wide text-gray">Sterne</p>
              </div>
              <div className="text-center">
                <CountUp end={2} />
                <p className="mt-2 text-xs font-medium tracking-wide text-gray">Standorte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
