"use client";

import Link from "next/link";
import { useCookieConsent } from "./CookieConsent";

export default function CookieBanner() {
  const { consent, accept, reject } = useCookieConsent();

  if (consent !== "pending") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-dark/95 shadow-2xl backdrop-blur-xl">
        {/* Gold accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="p-5 sm:p-6">
          {/* Icon + heading */}
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B8956A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" />
                <path d="M16 15.5v.01" />
                <path d="M12 12v.01" />
                <path d="M11 17v.01" />
                <path d="M7 14v.01" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">
              Cookies & Datenschutz
            </h3>
          </div>

          {/* Text */}
          <p className="mb-5 text-[0.8125rem] leading-relaxed text-white/50">
            Wir nutzen Cookies für Google Maps, damit Sie unseren Salon leichter
            finden. Weitere Infos in unserer{" "}
            <Link
              href="/datenschutz"
              className="text-gold underline underline-offset-2 transition-colors hover:text-gold-light"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={reject}
              className="rounded-full border border-white/10 px-5 py-2.5 text-xs font-semibold tracking-wide text-white/60 transition-all hover:border-white/20 hover:text-white/80"
            >
              Nur Notwendige
            </button>
            <button
              onClick={accept}
              className="rounded-full bg-gradient-to-r from-gold to-gold-dark px-6 py-2.5 text-xs font-semibold tracking-wide text-white transition-all hover:shadow-lg hover:shadow-gold/25"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
