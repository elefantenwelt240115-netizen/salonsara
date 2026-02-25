import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-dark py-16 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Salon Sara"
                width={36}
                height={36}
                className="brightness-0 invert"
              />
              <span
                className="text-lg tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Salon Sara
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Ihr Familienfriseur an der Hauptstraße in Solingen. Seit 2022.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] uppercase text-gold">
              Kontakt
            </h4>
            <div className="space-y-2 text-sm text-white/60">
              <p>Hauptstraße 39</p>
              <p>42651 Solingen</p>
              <a
                href="tel:+4921224926647"
                className="block transition-colors hover:text-gold"
              >
                0212 24 92 66 47
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] uppercase text-gold">
              Öffnungszeiten
            </h4>
            <div className="space-y-2 text-sm text-white/60">
              <p>Mo – Sa: 07:00 – 21:00</p>
              <p>So: Geschlossen</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] uppercase text-gold">
              Social Media
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/salon_s_sara/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-gold"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@salon_s._sara"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-gold"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.84 2.84 0 0 1 .97.17v-3.5a6.37 6.37 0 0 0-.97-.07 6.34 6.34 0 0 0 0 12.68 6.34 6.34 0 0 0 6.34-6.34V9.41a8.16 8.16 0 0 0 4.77 1.52V7.48a4.85 4.85 0 0 1-1.01-.79z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/100188862682787"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-gold"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Salon Sara. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <a
              href="/impressum"
              className="transition-colors hover:text-gold"
            >
              Impressum
            </a>
            <a
              href="/datenschutz"
              className="transition-colors hover:text-gold"
            >
              Datenschutz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
