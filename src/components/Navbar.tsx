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
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-warm-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <a href="#" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Salon Sara Logo"
              width={40}
              height={40}
              className={`transition-all duration-500 ${
                scrolled ? "" : "brightness-0 invert"
              }`}
            />
            <span
              className={`font-[var(--font-serif)] text-lg tracking-[0.2em] uppercase transition-colors duration-500 ${
                scrolled ? "text-black" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Salon Sara
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors duration-300 hover:text-gold ${
                  scrolled ? "text-black" : "text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+4921224926647"
              className="flex items-center gap-2 rounded-none border border-gold bg-transparent px-5 py-2.5 text-sm tracking-wide text-gold transition-all hover:bg-gold hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Anrufen
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-60 flex flex-col gap-1.5 lg:hidden"
            aria-label="Menü"
          >
            <span
              className={`block h-[2px] w-6 transition-all duration-300 ${
                menuOpen
                  ? "translate-y-[5px] rotate-45 bg-black"
                  : scrolled
                    ? "bg-black"
                    : "bg-white"
              }`}
            />
            <span
              className={`block h-[2px] w-6 transition-all duration-300 ${
                menuOpen
                  ? "opacity-0"
                  : scrolled
                    ? "bg-black"
                    : "bg-white"
              }`}
            />
            <span
              className={`block h-[2px] w-6 transition-all duration-300 ${
                menuOpen
                  ? "-translate-y-[5px] -rotate-45 bg-black"
                  : scrolled
                    ? "bg-black"
                    : "bg-white"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-warm-white transition-all duration-500 lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          <Image
            src="/logo.png"
            alt="Salon Sara"
            width={60}
            height={60}
            className="mb-4"
          />
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl tracking-[0.15em] text-black transition-colors hover:text-gold"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+4921224926647"
            className="mt-4 border border-gold px-8 py-3 text-sm tracking-widest text-gold transition-all hover:bg-gold hover:text-white"
          >
            JETZT ANRUFEN
          </a>
        </div>
      </div>
    </>
  );
}
