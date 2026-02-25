export default function Gallery() {
  const galleryItems = [
    { id: 1, aspect: "aspect-[3/4]", label: "Balayage" },
    { id: 2, aspect: "aspect-square", label: "Herrenschnitt" },
    { id: 3, aspect: "aspect-[3/4]", label: "Braut-Styling" },
    { id: 4, aspect: "aspect-square", label: "Salon Interior" },
    { id: 5, aspect: "aspect-[3/4]", label: "Färbung" },
    { id: 6, aspect: "aspect-square", label: "Bartpflege" },
  ];

  return (
    <section id="galerie" className="bg-warm-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-gold uppercase">
            Unsere Arbeit
          </p>
          <h2
            className="text-3xl tracking-[0.15em] text-black uppercase sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Galerie
          </h2>
          <div className="mx-auto mt-4 h-[1px] w-16 bg-gold" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden bg-cream ${item.aspect} cursor-pointer`}
            >
              {/* Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <div className="text-center">
                  <div
                    className="text-3xl text-gold/20 lg:text-5xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    S
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="text-xs tracking-[0.15em] text-white uppercase">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-sm tracking-wide text-gray">
            Mehr auf unseren Social-Media-Kanälen
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://www.instagram.com/salon_s_sara/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-black transition-colors hover:text-gold"
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
              Instagram
            </a>
            <span className="text-gray-light">|</span>
            <a
              href="https://www.tiktok.com/@salon_s._sara"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-black transition-colors hover:text-gold"
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
              TikTok
            </a>
            <span className="text-gray-light">|</span>
            <a
              href="https://www.facebook.com/100188862682787"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-black transition-colors hover:text-gold"
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
              Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
