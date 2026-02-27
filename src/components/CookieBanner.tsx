"use client";

import Link from "next/link";
import { useCookieConsent } from "./CookieConsent";

export default function CookieBanner() {
  const { consent, mounted, accept, reject } = useCookieConsent();

  if (!mounted || consent !== "pending") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
      <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-white/10 bg-dark/95 shadow-2xl backdrop-blur-xl">
        <div className="h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
          <p className="flex-1 text-xs leading-relaxed text-white/50">
            Wir nutzen Cookies für Google Maps.{" "}
            <Link href="/datenschutz" className="text-gold underline underline-offset-2 hover:text-gold-light">
              Mehr erfahren
            </Link>
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={reject}
              className="rounded-full border border-white/10 px-4 py-1.5 text-[0.6875rem] font-semibold text-white/50 transition-all hover:border-white/20 hover:text-white/80"
            >
              Ablehnen
            </button>
            <button
              onClick={accept}
              className="rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1.5 text-[0.6875rem] font-semibold text-white transition-all hover:shadow-lg hover:shadow-gold/25"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
