import Link from "next/link";

export const metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Salon Sara – Friseur in Solingen. Informationen zum Umgang mit Ihren Daten.",
  alternates: { canonical: "/datenschutz" },
};

export default function Datenschutz() {
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
          Datenschutz
        </h1>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-12">
        <div className="space-y-8 text-sm leading-relaxed text-gray">
          <div>
            <h2 className="mb-3 text-lg text-black" style={{ fontFamily: "var(--font-display)" }}>
              1. Datenschutz auf einen Blick
            </h2>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber,
              was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg text-black" style={{ fontFamily: "var(--font-display)" }}>
              2. Verantwortlicher
            </h2>
            <p>
              Ekrem Salijevic
              <br />
              Friseursalon Salon Sara
              <br />
              Hauptstraße 39
              <br />
              42651 Solingen
              <br />
              Telefon: 0212 24 92 66 47
              <br />
              E-Mail: info@salonsara.de
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg text-black" style={{ fontFamily: "var(--font-display)" }}>
              3. Datenerfassung auf dieser Website
            </h2>
            <p>
              <strong className="text-black">Server-Log-Dateien:</strong> Der
              Provider der Seiten erhebt und speichert automatisch
              Informationen in so genannten Server-Log-Dateien, die Ihr
              Browser automatisch an uns übermittelt. Dies sind: Browsertyp
              und Browserversion, verwendetes Betriebssystem, Referrer URL,
              Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage
              und IP-Adresse.
            </p>
            <p className="mt-3">
              Diese Daten werden nicht mit anderen Datenquellen
              zusammengeführt. Grundlage für die Datenverarbeitung ist Art. 6
              Abs. 1 lit. f DSGVO.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg text-black" style={{ fontFamily: "var(--font-display)" }}>
              4. Google Maps
            </h2>
            <p>
              Diese Seite nutzt den Kartendienst Google Maps. Anbieter ist
              die Google Ireland Limited, Gordon House, Barrow Street, Dublin
              4, Irland. Beim Aufruf einer Seite mit eingebetteter Google
              Maps Karte wird eine Verbindung zu den Servern von Google
              hergestellt.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg text-black" style={{ fontFamily: "var(--font-display)" }}>
              5. Ihre Rechte
            </h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über
              Herkunft, Empfänger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein
              Recht, die Berichtigung oder Löschung dieser Daten zu
              verlangen. Hierzu sowie zu weiteren Fragen zum Thema
              Datenschutz können Sie sich jederzeit an uns wenden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
