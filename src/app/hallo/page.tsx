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

const updatedAtFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Berlin",
});

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
      "Eine neuere gespeicherte Version wurde geladen. Prüfen Sie kurz, ob Ihre Änderung bereits übernommen wurde. Falls nicht, führen Sie sie erneut aus und speichern Sie noch einmal.",
  },
  "invalid-content": {
    tone: "error",
    message: "Eine Eingabe fehlt oder ist zu lang. Bitte prüfen Sie die markierten Felder.",
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
        key={content.revision}
        initialContent={content}
        lastUpdatedLabel={updatedAtFormatter.format(new Date(content.updatedAt))}
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
          <p className="text-sm leading-7 text-white/65">Interner Besitzerbereich</p>
          <p className="mt-3 text-5xl font-bold leading-[1.08] tracking-tight text-white">
            Preise und Hinweise selbst pflegen.
          </p>
          <p className="mt-6 max-w-md text-base leading-7 text-white/70">
            Änderungen werden zentral gespeichert und direkt auf der Salonseite angezeigt.
          </p>
        </div>

        <p className="relative text-sm text-white/60">Nur für den Inhaber bestimmt.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-warm-white px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Image src="/logo.png" alt="Salon Sara" width={46} height={46} />
            <Link href="/" className="text-sm text-black/65 transition hover:text-gold-dark">
              Zur Website
            </Link>
          </div>

          <p className="text-sm font-semibold text-gold-dark">Besitzerbereich</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-black">Anmelden</h1>
          <p className="mt-3 text-base leading-7 text-black/65">
            Melden Sie sich an, um Preise, Öffnungszeiten und den Hinweis oben auf der Website zu
            bearbeiten.
          </p>

          {(loginFailed || sessionExpired || configurationMissing) && (
            <div className="mt-7 border-l-4 border-[#8a3048] bg-[#f7e9ed] px-5 py-4 text-base leading-6 text-[#6f263d]" role="alert">
              {configurationMissing
                ? "Die Anmeldung ist noch nicht vollständig eingerichtet. Bitte wenden Sie sich an die Person, die die Website betreut."
                : sessionExpired
                  ? "Ihre Anmeldung ist abgelaufen. Bitte melden Sie sich erneut an."
                  : "Benutzername oder Passwort ist nicht korrekt."}
            </div>
          )}

          <form action={loginAction} className="mt-8 space-y-5" noValidate>
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
              Anmelden
            </button>
          </form>

          <Link
            href="/"
            className="mt-8 hidden text-sm text-black/65 underline decoration-black/30 underline-offset-4 transition hover:text-gold-dark lg:inline-block"
          >
            Zurück zur Website
          </Link>
        </div>
      </section>
    </main>
  );
}
