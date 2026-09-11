import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { getSiteContent } from "@/lib/site-content";
import { isOwnerAuthenticated } from "@/lib/owner-auth";
import OwnerDashboard from "./OwnerDashboard";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Besitzerbereich",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

type HalloPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

const dashboardNotices: Record<
  string,
  { tone: "success" | "error"; message: string }
> = {
  saved: {
    tone: "success",
    message: "Gespeichert. Die Änderungen sind jetzt auf der Website sichtbar.",
  },
  conflict: {
    tone: "error",
    message:
      "Zwischenzeitlich wurde eine neuere Version gespeichert. Bitte lade die Seite neu und trage deine Änderung noch einmal ein.",
  },
  "invalid-content": {
    tone: "error",
    message: "Ein Feld ist ungültig oder zu lang. Prüfe die Eingaben und versuche es erneut.",
  },
  storage: {
    tone: "error",
    message:
      "Die dauerhafte Speicherung ist noch nicht verbunden. Die bisherigen Inhalte wurden nicht verändert.",
  },
};

export default async function HalloPage({ searchParams }: HalloPageProps) {
  await connection();
  const { status: rawStatus } = await searchParams;
  const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;
  const authenticated = await isOwnerAuthenticated();

  if (authenticated) {
    const content = await getSiteContent();
    return (
      <OwnerDashboard
        initialContent={content}
        notice={status ? dashboardNotices[status] : null}
      />
    );
  }

  const loginFailed = status === "login-failed";
  const sessionExpired = status === "session-expired";
  const configurationMissing = status === "configuration";

  return (
    <main className="grid min-h-screen bg-dark lg:grid-cols-[minmax(0,1.1fr)_minmax(28rem,0.9fr)]">
      <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(circle at 22% 18%, rgba(184,149,106,0.45), transparent 31%), linear-gradient(135deg, transparent 45%, rgba(184,149,106,0.12))",
          }}
        />
        <div className="relative flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Salon Sara"
            width={52}
            height={52}
            className="brightness-0 invert"
          />
          <p className="font-semibold tracking-[0.16em] text-white">SALON SARA</p>
        </div>

        <div className="relative max-w-xl border-l border-gold pl-8">
          <p className="text-sm leading-7 text-white/45">Interner Besitzerbereich</p>
          <h1 className="mt-3 text-5xl font-bold leading-[1.08] tracking-tight text-white">
            Preise und Hinweise selbst pflegen.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/55">
            Änderungen werden zentral gespeichert und direkt auf der Salonseite angezeigt.
          </p>
        </div>

        <p className="relative text-xs text-white/25">Nur für den Inhaber bestimmt.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-warm-white px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Image src="/logo.png" alt="Salon Sara" width={46} height={46} />
            <Link href="/" className="text-sm text-black/50 transition hover:text-gold-dark">
              Zur Website
            </Link>
          </div>

          <p className="text-sm font-semibold text-gold-dark">Besitzerbereich</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-black">Anmelden</h2>
          <p className="mt-3 text-sm leading-6 text-black/50">
            Melde dich an, um Preise, Öffnungszeiten und den oberen Hinweisbanner zu bearbeiten.
          </p>

          {(loginFailed || sessionExpired || configurationMissing) && (
            <div className="mt-7 border-l-4 border-[#8a3048] bg-[#f7e9ed] px-4 py-3 text-sm text-[#6f263d]" role="alert">
              {configurationMissing
                ? "Die Anmeldung ist serverseitig noch nicht vollständig konfiguriert."
                : sessionExpired
                  ? "Deine Anmeldung ist abgelaufen. Bitte melde dich erneut an."
                  : "Benutzername oder Passwort ist nicht korrekt."}
            </div>
          )}

          <form action={loginAction} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-black">
              Benutzername
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                maxLength={128}
                autoFocus
                className="mt-2 min-h-12 w-full border border-black/20 bg-white px-4 py-3 text-base outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </label>

            <label className="block text-sm font-semibold text-black">
              Passwort
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                maxLength={256}
                className="mt-2 min-h-12 w-full border border-black/20 bg-white px-4 py-3 text-base outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </label>

            <button
              type="submit"
              className="mt-2 min-h-12 w-full bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Sicher anmelden
            </button>
          </form>

          <Link
            href="/"
            className="mt-8 hidden text-sm text-black/45 underline decoration-black/20 underline-offset-4 transition hover:text-gold-dark lg:inline-block"
          >
            Zurück zur Website
          </Link>
        </div>
      </section>
    </main>
  );
}
