"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

type ConsentState = "pending" | "accepted" | "rejected";

const CookieConsentContext = createContext<{
  consent: ConsentState;
  mounted: boolean;
  accept: () => void;
  reject: () => void;
  reset: () => void;
}>({
  consent: "pending",
  mounted: false,
  accept: () => {},
  reject: () => {},
  reset: () => {},
});

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}

const STORAGE_KEY = "salon-sara-cookie-consent";

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>("pending");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    }
    setMounted(true);
  }, []);

  const accept = useCallback(() => {
    setConsent("accepted");
    localStorage.setItem(STORAGE_KEY, "accepted");
  }, []);

  const reject = useCallback(() => {
    setConsent("rejected");
    localStorage.setItem(STORAGE_KEY, "rejected");
  }, []);

  const reset = useCallback(() => {
    setConsent("pending");
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <CookieConsentContext.Provider value={{ consent, mounted, accept, reject, reset }}>
      {children}
    </CookieConsentContext.Provider>
  );
}
