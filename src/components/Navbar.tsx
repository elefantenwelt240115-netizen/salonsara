"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const navLinks = [
  { href: "#ueber-uns", label: "Über uns" },
  { href: "#preise", label: "Preise" },
  { href: "#galerie", label: "Galerie" },
  { href: "#bewertungen", label: "Bewertungen" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 shadow-[0_1px_24px_rgba(0,0,0,0.06)] backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="#" className="relative z-[60]">
            <Image
              src="/logo.png"
              alt="Salon Sara"
              width={42}
              height={42}
              className={`transition-all duration-500 ${scrolled ? "" : "brightness-0 invert"}`}
            />
          </a>

          <div className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-300 hover:text-gold ${
                  scrolled ? "text-black/70" : "text-white/70"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a href="tel:+4921224926647" className="btn-gold !py-2.5 !px-6 !text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Termin
            </a>
          </div>

          {/* Elegant burger icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 lg:hidden"
            aria-label="Menü"
          >
            <div className="flex h-5 w-6 flex-col justify-between">
              <span
                className={`block h-[1.5px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] ${
                  menuOpen
                    ? "translate-y-[9px] rotate-45 bg-black"
                    : scrolled ? "bg-black" : "bg-white"
                }`}
              />
              <span
                className={`block h-[1.5px] w-4 self-end rounded-full transition-all duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] ${
                  menuOpen
                    ? "w-6 -translate-y-[0.5px] -rotate-45 bg-black"
                    : scrolled ? "bg-black" : "bg-white"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-warm-white transition-all duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          <Image src="/logo.png" alt="Salon Sara" width={56} height={56} className="mb-4" />
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-heading text-2xl tracking-[0.08em] text-black transition-colors duration-300 hover:text-gold"
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.5s ease, transform 0.5s ease, color 0.3s",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+4921224926647"
            onClick={() => setMenuOpen(false)}
            className="btn-gold mt-6"
          >
            Jetzt Anrufen
          </a>
        </div>
      </div>
    </>
  );
}
