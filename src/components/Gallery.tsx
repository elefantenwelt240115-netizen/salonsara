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
    <section id="galerie" className="section-padding bg-warm-white">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center lg:mb-20">
          <p className="section-label">Unsere Arbeit</p>
          <h2 className="section-heading">GALERIE</h2>
          <div className="gold-line mx-auto" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl bg-cream ${item.aspect} cursor-pointer`}
            >
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <div className="font-heading text-3xl text-gold/15 lg:text-5xl">S</div>
              </div>
              <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-0 flex items-end p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="text-xs font-semibold tracking-[0.12em] text-white uppercase">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-sm text-gray">Mehr auf unseren Social-Media-Kanälen</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.instagram.com/salon_s_sara/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !py-2.5 !px-5 !text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@salon_s._sara"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !py-2.5 !px-5 !text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.84 2.84 0 0 1 .97.17v-3.5a6.37 6.37 0 0 0-.97-.07 6.34 6.34 0 0 0 0 12.68 6.34 6.34 0 0 0 6.34-6.34V9.41a8.16 8.16 0 0 0 4.77 1.52V7.48a4.85 4.85 0 0 1-1.01-.79z"/>
              </svg>
              TikTok
            </a>
            <a
              href="https://www.facebook.com/100188862682787"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !py-2.5 !px-5 !text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
