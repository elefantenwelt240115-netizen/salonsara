export default function Contact() {
  return (
    <section id="kontakt" className="bg-warm-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-gold uppercase">
            So finden Sie uns
          </p>
          <h2
            className="text-3xl tracking-[0.15em] text-black uppercase sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Kontakt
          </h2>
          <div className="mx-auto mt-4 h-[1px] w-16 bg-gold" />
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Map */}
          <div className="relative aspect-square overflow-hidden bg-cream lg:aspect-auto lg:min-h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2505.5!2d7.0833!3d51.1667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDA5JzU4LjgiTiA3wrAwNCc1OC44IkU!5e0!3m2!1sde!2sde!4v1"
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

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <div className="space-y-10">
              {/* Address */}
              <div>
                <h3 className="mb-3 text-xs tracking-[0.2em] text-gold uppercase">
                  Adresse
                </h3>
                <p className="text-lg text-black" style={{ fontFamily: "var(--font-serif)" }}>
                  Salon Sara
                </p>
                <p className="mt-1 text-sm text-gray">
                  Hauptstraße 39
                  <br />
                  42651 Solingen
                </p>
              </div>

              {/* Opening Hours */}
              <div>
                <h3 className="mb-3 text-xs tracking-[0.2em] text-gold uppercase">
                  Öffnungszeiten
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray">Montag – Samstag</span>
                    <span className="text-black">07:00 – 21:00 Uhr</span>
                  </div>
                  <div className="h-[1px] bg-gray-light" />
                  <div className="flex justify-between">
                    <span className="text-gray">Sonntag</span>
                    <span className="text-black">Geschlossen</span>
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div>
                <h3 className="mb-3 text-xs tracking-[0.2em] text-gold uppercase">
                  Kontakt
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:+4921224926647"
                    className="flex items-center gap-3 text-sm text-black transition-colors hover:text-gold"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    0212 24 92 66 47
                  </a>
                  <a
                    href="https://wa.me/4921224926647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-black transition-colors hover:text-gold"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp schreiben
                  </a>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <a
                  href="tel:+4921224926647"
                  className="flex items-center justify-center gap-2 bg-black px-8 py-4 text-xs tracking-[0.2em] text-white uppercase transition-all hover:bg-gold"
                >
                  Jetzt Anrufen
                </a>
                <a
                  href="https://wa.me/4921224926647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-black px-8 py-4 text-xs tracking-[0.2em] text-black uppercase transition-all hover:border-gold hover:text-gold"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
