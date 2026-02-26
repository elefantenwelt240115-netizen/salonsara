export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark">
      {/* Background image — dezent, nicht verpixelt */}
      <img
        src="/images/geschäft.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover scale-105"
        style={{ filter: "brightness(0.25) saturate(0.6)" }}
      />
      {/* Dark gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.4) 40%, rgba(10,10,10,0.6) 70%, rgba(10,10,10,0.85) 100%)",
        }}
      />
      {/* Radial ambient gold light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.1)_0%,transparent_65%)]" />

      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        {/* Label — horizontal wipe */}
        <p
          className="mb-6 text-[0.6875rem] font-semibold tracking-[0.4em] text-gold uppercase animate-wipe-in"
          style={{ animationDelay: "200ms" }}
        >
          Ihr Friseur in Solingen
        </p>

        {/* Main heading — clip-path line reveal, one line */}
        <div className="overflow-hidden">
          <h1
            className="mb-6 text-[clamp(2.4rem,8vw,7rem)] font-bold leading-[0.95] tracking-[0.06em] sm:tracking-[0.14em] text-white uppercase animate-line-reveal whitespace-nowrap"
            style={{ animationDelay: "400ms", fontFamily: "var(--font-display)" }}
          >
            SALON SARA
          </h1>
        </div>

        {/* Gold line draws itself */}
        <div
          className="mb-10 h-[1px] w-16 bg-gradient-to-r from-gold/30 via-gold to-gold/30 animate-draw-line"
          style={{ animationDelay: "700ms" }}
        />

        {/* Subtitle drifts up */}
        <p
          className="mb-14 max-w-sm text-[0.9375rem] leading-relaxed text-white/50 animate-drift-up"
          style={{ animationDelay: "800ms" }}
        >
          Seit 2022 verwöhnen wir nicht nur Ihre Haare,
          <br className="hidden sm:block" />
          sondern auch Ihr Herz.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col gap-4 animate-drift-up sm:flex-row sm:gap-5"
          style={{ animationDelay: "950ms" }}
        >
          <a href="tel:+4921224926647" className="btn-primary !bg-white !text-black hover:!bg-white/90">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Jetzt Anrufen
          </a>
          <a
            href="https://wa.me/4921224926647"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !border-white/20 !text-white/80 hover:!border-gold hover:!text-gold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>

        {/* Stars */}
        <div
          className="mt-16 flex items-center gap-3 animate-drift-up"
          style={{ animationDelay: "1100ms" }}
        >
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#B8956A">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className="text-xs tracking-wide text-white/40">5.0 &middot; 989+ Bewertungen</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-drift-up" style={{ animationDelay: "1300ms" }}>
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 pt-1.5">
          <div className="h-2 w-[3px] rounded-full bg-white/30 animate-scroll-pulse" />
        </div>
      </div>
    </section>
  );
}
