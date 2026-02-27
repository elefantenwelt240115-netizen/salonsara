"use client";

import RevealSection from "./RevealSection";

export default function Contact() {
  return (
    <section id="kontakt" className="section-padding bg-warm-white">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <RevealSection>
          <div className="mb-16 text-center lg:mb-20">
            <p className="section-label">So finden Sie uns</p>
            <h2 className="section-heading">KONTAKT</h2>
            <div className="gold-line mx-auto" />
          </div>
        </RevealSection>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Map */}
          <RevealSection variant="scale">
            <div className="relative overflow-hidden rounded-2xl bg-cream" style={{ minHeight: "400px" }}>
              <iframe
                src="https://maps.google.com/maps?q=Salon+Sara+Hauptstra%C3%9Fe+39+42651+Solingen&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Salon Sara Standort"
                className="absolute inset-0"
              />
            </div>
          </RevealSection>

          {/* Contact Info */}
          <RevealSection delay={150}>
            <div className="flex flex-col justify-center">
              <div className="space-y-8">
                {/* Address */}
                <div>
                  <h3 className="mb-2 text-[0.6875rem] font-semibold tracking-[0.25em] text-gold uppercase">Adresse</h3>
                  <p className="text-lg font-bold text-black">Salon Sara</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-gray">
                    Hauptstraße 39<br />42651 Solingen
                  </p>
                </div>

                {/* Opening Hours */}
                <div>
                  <h3 className="mb-3 text-[0.6875rem] font-semibold tracking-[0.25em] text-gold uppercase">Öffnungszeiten</h3>
                  <div className="space-y-3 text-[0.9375rem]">
                    <div className="flex justify-between rounded-xl bg-gray-lighter p-4">
                      <span className="text-gray">Montag – Samstag</span>
                      <span className="font-medium text-black">06:00 – 21:00 Uhr</span>
                    </div>
                    <div className="rounded-xl bg-gray-lighter p-4">
                      <div className="flex justify-between">
                        <span className="text-gray">Sonntag</span>
                        <span className="font-medium text-black">Geschlossen</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray/70">06:00 – 08:00 & 19:00 – 21:00 Uhr nur mit festem Termin</p>
                  </div>
                </div>

                {/* Contact Methods */}
                <div>
                  <h3 className="mb-3 text-[0.6875rem] font-semibold tracking-[0.25em] text-gold uppercase">Kontakt</h3>
                  <div className="space-y-3">
                    <a href="tel:+4921224926647" className="flex items-center gap-3 text-[0.9375rem] text-black transition-colors hover:text-gold">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-lighter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <div>
                        <span className="text-[0.6875rem] text-gray/60">Filiale 1</span>
                        <br />0212 – 249 266 47
                      </div>
                    </a>
                    <a href="tel:+4921212858200" className="flex items-center gap-3 text-[0.9375rem] text-black transition-colors hover:text-gold">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-lighter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <div>
                        <span className="text-[0.6875rem] text-gray/60">Filiale 2</span>
                        <br />0212 – 128 582 00
                      </div>
                    </a>
                    <a href="https://wa.me/4917662001566" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[0.9375rem] text-black transition-colors hover:text-gold">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-lighter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      WhatsApp schreiben
                    </a>
                    <a href="mailto:salon.sara.sg@gmail.com" className="flex items-center gap-3 text-[0.9375rem] text-black transition-colors hover:text-gold">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-lighter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2"/>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                      </div>
                      salon.sara.sg@gmail.com
                    </a>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a href="tel:+4921224926647" className="btn-primary flex-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      Filiale 1 anrufen
                    </a>
                    <a href="tel:+4921212858200" className="btn-primary flex-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      Filiale 2 anrufen
                    </a>
                  </div>
                  <a href="https://wa.me/4917662001566" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp schreiben
                  </a>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
