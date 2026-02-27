"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import RevealSection from "./RevealSection";

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
      <div className="text-4xl font-bold text-black lg:text-5xl">
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
        <RevealSection>
          <div className="mb-16 text-center lg:mb-20">
            <p className="section-label">Unser Salon</p>
            <h2 className="section-heading">ÜBER UNS</h2>
            <div className="gold-line mx-auto" />
          </div>
        </RevealSection>

        {/* Content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Team Photo */}
          <RevealSection variant="scale">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl lg:max-w-none" style={{ aspectRatio: "3/4" }}>
              <Image
                src="/images/team.jpg"
                alt="Das Salon Sara Team – Familienfriseur in Solingen-Mitte"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Gold gradient overlay bottom to top */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(184,149,106,0.85) 0%, rgba(184,149,106,0.4) 25%, rgba(184,149,106,0.08) 50%, transparent 70%)",
                }}
              />
              {/* Optional subtle vignette for depth */}
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at center, transparent 50%, rgba(26,26,26,0.15) 100%)",
                }}
              />
            </div>
          </RevealSection>

          {/* Text Content */}
          <RevealSection delay={150}>
            <div>
              <h3 className="mb-6 text-2xl font-bold leading-snug lg:text-3xl">
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
                {[
                  { end: 989, suffix: "+", label: "Bewertungen" },
                  { end: 5, suffix: ".0", label: "Sterne" },
                  { end: 2, suffix: "", label: "Standorte" },
                ].map((stat, i) => (
                  <div key={stat.label} className="text-center">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                    <p className="mt-2 text-xs font-medium tracking-wide text-gray">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
