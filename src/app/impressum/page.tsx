import Link from "next/link";

export const metadata = {
  title: "Impressum",
  description: "Impressum von Salon Sara – Friseur in Solingen. Angaben gemäß § 5 TMG.",
  alternates: { canonical: "/impressum" },
};

export default function Impressum() {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-dark py-20 text-center">
        <Link
          href="/"
          className="mb-6 inline-block text-xs tracking-[0.3em] text-gold uppercase hover:text-gold-light"
        >
          &larr; Zurück zur Startseite
        </Link>
        <h1
          className="text-3xl tracking-[0.15em] text-white uppercase sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Impressum
        </h1>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-12">
        <div className="space-y-8 text-sm leading-relaxed text-gray">
          <div>
            <h2 className="mb-3 text-lg text-black" style={{ fontFamily: "var(--font-display)" }}>
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              Ekrem Salijevic
              <br />
              Friseursalon Salon Sara
              <br />
              Hauptstraße 39
              <br />
              42651 Solingen
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg text-black" style={{ fontFamily: "var(--font-display)" }}>
              Kontakt
            </h2>
            <p>
              Telefon: 0212 24 92 66 47
              <br />
              E-Mail: info@salonsara.de
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg text-black" style={{ fontFamily: "var(--font-display)" }}>
              Umsatzsteuer-ID
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a
              Umsatzsteuergesetz: Wird nachgereicht.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg text-black" style={{ fontFamily: "var(--font-display)" }}>
              Streitschlichtung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit. Wir sind nicht bereit oder
              verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg text-black" style={{ fontFamily: "var(--font-display)" }}>
              Haftung für Inhalte
            </h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
