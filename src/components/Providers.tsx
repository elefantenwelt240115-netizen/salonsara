"use client";

import { CookieConsentProvider } from "./CookieConsent";
import CookieBanner from "./CookieBanner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider>
      {children}
      <CookieBanner />
    </CookieConsentProvider>
  );
}
