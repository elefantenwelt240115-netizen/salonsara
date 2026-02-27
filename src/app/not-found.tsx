import Link from "next/link";

export const metadata = {
  title: "Seite nicht gefunden",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark px-6 text-center">
      {/* Animated Scissors */}
      <div className="relative mb-10">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-scissors"
        >
          {/* Left blade */}
          <g className="origin-center animate-scissors-left">
            <ellipse cx="35" cy="85" rx="14" ry="14" stroke="#B8956A" strokeWidth="2.5" fill="none" />
            <line x1="45" y1="75" x2="75" y2="30" stroke="#B8956A" strokeWidth="3" strokeLinecap="round" />
          </g>
          {/* Right blade */}
          <g className="origin-center animate-scissors-right">
            <ellipse cx="85" cy="85" rx="14" ry="14" stroke="#B8956A" strokeWidth="2.5" fill="none" />
            <line x1="75" y1="75" x2="45" y2="30" stroke="#B8956A" strokeWidth="3" strokeLinecap="round" />
          </g>
          {/* Pivot */}
          <circle cx="60" cy="52" r="4" fill="#B8956A" />
        </svg>

        {/* Falling hair strands */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-6 w-[2px] rounded-full bg-gold/40 animate-hair-fall"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  height: `${14 + i * 4}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 404 Text */}
      <h1
        className="mb-4 text-[clamp(4rem,15vw,8rem)] font-bold leading-none tracking-[0.1em] text-white/10"
        style={{ fontFamily: "var(--font-display)" }}
      >
        404
      </h1>

      <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">
        Hier ist leider nichts...
      </h2>
      <p className="mb-10 max-w-sm text-sm leading-relaxed text-white/40">
        Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.
        Aber keine Sorge – ein guter Schnitt ist nur einen Klick entfernt.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="btn-primary !bg-white !text-black hover:!bg-white/90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Zurück zur Startseite
      </Link>

      {/* Gold line */}
      <div className="mt-16 h-[1px] w-16 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </div>
  );
}
