import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Logo & Tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Salon Sara Logo"
              width={44}
              height={44}
              className="brightness-0 invert"
            />
            <p className="mt-5 text-sm leading-relaxed text-white/35">
              Ihr Familienfriseur an der
              <br />
              Hauptstraße in Solingen.
              <br />
              Seit 2022.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-[0.6875rem] font-semibold tracking-[0.25em] uppercase text-gold">
              Kontakt
            </h4>
            <div className="space-y-2.5 text-sm text-white/40">
              <p>Hauptstraße 39</p>
              <p>42651 Solingen</p>
              <a
                href="tel:+4921224926647"
                className="block transition-colors duration-300 hover:text-gold"
              >
                Filiale 1: 0212 – 249 266 47
              </a>
              <a
                href="tel:+4921212858200"
                className="block transition-colors duration-300 hover:text-gold"
              >
                Filiale 2: 0212 – 128 582 00
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-5 text-[0.6875rem] font-semibold tracking-[0.25em] uppercase text-gold">
              Öffnungszeiten
            </h4>
            <div className="space-y-2.5 text-sm text-white/40">
              <p>Mo – Sa: 06:00 – 21:00</p>
              <p className="text-[0.6875rem] text-white/25">06–08 & 19–21 Uhr nur mit Termin</p>
              <p>So: Geschlossen</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-5 text-[0.6875rem] font-semibold tracking-[0.25em] uppercase text-gold">
              Social Media
            </h4>
            <div className="flex gap-3">
              {[
                {
                  href: "https://www.instagram.com/salon_s_sara/",
                  label: "Instagram",
                  icon: (
                    <>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </>
                  ),
                },
                {
                  href: "https://www.tiktok.com/@salon_s._sara",
                  label: "TikTok",
                  icon: (
                    <path
                      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.84 2.84 0 0 1 .97.17v-3.5a6.37 6.37 0 0 0-.97-.07 6.34 6.34 0 0 0 0 12.68 6.34 6.34 0 0 0 6.34-6.34V9.41a8.16 8.16 0 0 0 4.77 1.52V7.48a4.85 4.85 0 0 1-1.01-.79z"
                      fill="currentColor"
                    />
                  ),
                },
                {
                  href: "https://www.facebook.com/100188862682787",
                  label: "Facebook",
                  icon: (
                    <path
                      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                      fill="currentColor"
                    />
                  ),
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-white/40 transition-all duration-300 hover:border-gold/40 hover:text-gold"
                  aria-label={social.label}
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
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-white/25 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Salon Sara. Alle Rechte
            vorbehalten.
          </p>
          <div className="flex gap-6">
            <Link
              href="/impressum"
              className="transition-colors duration-300 hover:text-gold"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="transition-colors duration-300 hover:text-gold"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
