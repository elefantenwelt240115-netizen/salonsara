"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

type ConsentState = "pending" | "accepted" | "rejected";

const CookieConsentContext = createContext<{
  consent: ConsentState;
  accept: () => void;
  reject: () => void;
}>({
  consent: "pending",
  accept: () => {},
  reject: () => {},
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

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CookieConsentContext.Provider value={{ consent, accept, reject }}>
      {children}
    </CookieConsentContext.Provider>
  );
}
