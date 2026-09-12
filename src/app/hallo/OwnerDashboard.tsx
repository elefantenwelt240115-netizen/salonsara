"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import type {
  OpeningHoursEntry,
  ServiceGroup,
  ServiceItem,
  SiteContent,
} from "@/lib/site-content";
import { logoutAction, saveContentAction } from "./actions";

const fieldClass =
  "min-h-12 w-full border border-black/20 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";
const smallButtonClass =
  "inline-flex min-h-11 items-center justify-center border border-black/20 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-gold hover:text-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

interface OwnerDashboardProps {
  initialContent: SiteContent;
  lastUpdatedLabel: string;
  notice?: { tone: "success" | "error"; message: string } | null;
}

type ValidatableControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function isValidatableControl(target: EventTarget): target is ValidatableControl {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function isConnectionError(error: unknown) {
  return (
    error instanceof TypeError ||
    (error instanceof Error && /failed to fetch|network|connection|timeout/i.test(error.message))
  );
}

function makeId(prefix: string) {
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return `${prefix}-${suffix}`.replace(/[^a-zA-Z0-9_-]/g, "");
}

function SubmitButton({ dirty, saving }: { dirty: boolean; saving: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving || !dirty}
      className="inline-flex min-h-12 w-full items-center justify-center bg-gold px-7 py-3 text-base font-bold text-white transition hover:bg-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:bg-black/20 sm:w-auto"
    >
      {saving ? "Wird gespeichert …" : dirty ? "Änderungen speichern" : "Alles gespeichert"}
    </button>
  );
}

function getBannerStatus(
  current: SiteContent["announcement"],
  initial: SiteContent["announcement"],
) {
  const draftChanged = JSON.stringify(current) !== JSON.stringify(initial);

  if (current.enabled !== initial.enabled) {
    return {
      draftChanged,
      title: current.enabled
        ? "Banner wird nach dem Speichern aktiviert"
        : "Banner wird nach dem Speichern deaktiviert",
      description: "Klicken Sie unten noch auf „Änderungen speichern“.",
    };
  }

  if (draftChanged) {
    return {
      draftChanged,
      title: current.enabled
        ? "Banner ist aktiv – Änderungen noch nicht gespeichert"
        : "Banner ist nicht sichtbar – Entwurf noch nicht gespeichert",
      description: current.enabled
        ? "Der bisher gespeicherte Banner bleibt sichtbar, bis Sie die Änderungen speichern."
        : "Speichern Sie den Entwurf, damit er beim späteren Aktivieren bereit ist.",
    };
  }

  return {
    draftChanged,
    title: current.enabled
      ? "Der Banner ist auf der Website sichtbar"
      : "Der Banner ist nicht sichtbar",
    description: current.enabled
      ? "Besucher sehen ihn ganz oben auf der Website."
      : "Sie können den Inhalt in Ruhe vorbereiten und später einschalten.",
  };
}

export default function OwnerDashboard({
  initialContent,
  lastUpdatedLabel,
  notice,
}: OwnerDashboardProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const contentFormRef = useRef<HTMLFormElement>(null);
  const bannerTitleRef = useRef<HTMLInputElement>(null);
  const ctaLabelRef = useRef<HTMLInputElement>(null);
  const ctaUrlRef = useRef<HTMLInputElement>(null);
  const [optionalLinkOpen, setOptionalLinkOpen] = useState(() =>
    Boolean(
      initialContent.announcement.ctaLabel?.trim() ||
        initialContent.announcement.ctaUrl?.trim(),
    ),
  );
  const [openPriceSection, setOpenPriceSection] = useState<string | null>(
    initialContent.services[0]?.id ?? null,
  );
  const initialSnapshot = useMemo(() => JSON.stringify(initialContent), [initialContent]);
  const payload = useMemo(() => JSON.stringify(content), [content]);
  const dirty = payload !== initialSnapshot;
  const ctaIsInUse = Boolean(
    content.announcement.ctaLabel?.trim() || content.announcement.ctaUrl?.trim(),
  );
  const bannerStatus = getBannerStatus(
    content.announcement,
    initialContent.announcement,
  );

  useEffect(() => {
    const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };

    window.addEventListener("beforeunload", warnAboutUnsavedChanges);
    return () => window.removeEventListener("beforeunload", warnAboutUnsavedChanges);
  }, [dirty]);

  useEffect(() => {
    if (!content.announcement.enabled) {
      bannerTitleRef.current?.setCustomValidity("");
    }
  }, [content.announcement.enabled]);

  useEffect(() => {
    if (!ctaIsInUse) {
      ctaLabelRef.current?.setCustomValidity("");
      ctaUrlRef.current?.setCustomValidity("");
    }
  }, [ctaIsInUse]);

  async function saveContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError(null);
    setSaving(true);

    try {
      await saveContentAction(new FormData(event.currentTarget));
    } catch (error) {
      if (!isConnectionError(error)) throw error;

      setSaveError(
        "Speichern war wegen der Internetverbindung nicht möglich. Ihre Eingaben sind noch da – bitte versuchen Sie es erneut.",
      );
    } finally {
      setSaving(false);
    }
  }

  function updateHour(index: number, patch: Partial<OpeningHoursEntry>) {
    setContent((current) => ({
      ...current,
      openingHours: current.openingHours.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, ...patch } : entry,
      ),
    }));
  }

  function addHour() {
    setContent((current) => ({
      ...current,
      openingHours: [
        ...current.openingHours,
        { id: makeId("hours"), label: "Weitere Zeit", value: "" },
      ],
    }));
  }

  function removeHour(index: number) {
    const label = content.openingHours[index]?.label || "diese Zeile";
    if (
      !window.confirm(
        `„${label}“ löschen? Die Löschung wird erst nach dem Speichern endgültig.`,
      )
    ) {
      return;
    }
    setContent((current) => ({
      ...current,
      openingHours: current.openingHours.filter((_, entryIndex) => entryIndex !== index),
    }));
  }

  function updateCategoryLabel(categoryIndex: number, label: string) {
    setContent((current) => ({
      ...current,
      services: current.services.map((category, index) =>
        index === categoryIndex ? { ...category, label } : category,
      ),
    }));
  }

  function updateLengthLabel(categoryIndex: number, labelIndex: number, value: string) {
    setContent((current) => ({
      ...current,
      services: current.services.map((category, index) => {
        if (index !== categoryIndex || !category.lengthLabels) return category;
        return {
          ...category,
          lengthLabels: category.lengthLabels.map((label, currentLabelIndex) =>
            currentLabelIndex === labelIndex ? value : label,
          ),
        };
      }),
    }));
  }

  function updateGroup(categoryIndex: number, groupIndex: number, patch: Partial<ServiceGroup>) {
    setContent((current) => ({
      ...current,
      services: current.services.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              groups: category.groups.map((group, currentGroupIndex) =>
                currentGroupIndex === groupIndex ? { ...group, ...patch } : group,
              ),
            }
          : category,
      ),
    }));
  }

  function addGroup(categoryIndex: number) {
    const group: ServiceGroup = {
      id: makeId("group"),
      title: "Neue Gruppe",
      items: [],
    };

    setContent((current) => ({
      ...current,
      services: current.services.map((category, index) =>
        index === categoryIndex
          ? { ...category, groups: [...category.groups, group] }
          : category,
      ),
    }));
  }

  function removeGroup(categoryIndex: number, groupIndex: number) {
    const title =
      content.services[categoryIndex]?.groups[groupIndex]?.title || "diese Preisgruppe";
    if (
      !window.confirm(
        `Die Preisgruppe „${title}“ mit allen Leistungen löschen? Die Löschung wird erst nach dem Speichern endgültig.`,
      )
    ) {
      return;
    }
    setContent((current) => ({
      ...current,
      services: current.services.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              groups: category.groups.filter((_, currentGroupIndex) => currentGroupIndex !== groupIndex),
            }
          : category,
      ),
    }));
  }

  function updateItem(
    categoryIndex: number,
    groupIndex: number,
    itemIndex: number,
    patch: Partial<ServiceItem>,
  ) {
    setContent((current) => ({
      ...current,
      services: current.services.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              groups: category.groups.map((group, currentGroupIndex) =>
                currentGroupIndex === groupIndex
                  ? {
                      ...group,
                      items: group.items.map((item, currentItemIndex) =>
                        currentItemIndex === itemIndex ? { ...item, ...patch } : item,
                      ),
                    }
                  : group,
              ),
            }
          : category,
      ),
    }));
  }

  function changePriceMode(
    categoryIndex: number,
    groupIndex: number,
    itemIndex: number,
    mode: "single" | "lengths",
  ) {
    setContent((current) => ({
      ...current,
      services: current.services.map((category, index) => {
        if (index !== categoryIndex) return category;

        return {
          ...category,
          groups: category.groups.map((group, currentGroupIndex) => {
            if (currentGroupIndex !== groupIndex) return group;

            return {
              ...group,
              items: group.items.map((item, currentItemIndex) => {
                if (currentItemIndex !== itemIndex) return item;

                if (mode === "lengths") {
                  const numberOfPrices = Math.max(category.lengthLabels?.length ?? 3, 1);
                  const firstPrice = item.price ?? item.prices?.[0] ?? "";
                  const { price: _price, ...itemWithoutPrice } = item;
                  void _price;
                  return {
                    ...itemWithoutPrice,
                    prices: Array.from({ length: numberOfPrices }, (_, priceIndex) =>
                      item.prices?.[priceIndex] ?? (priceIndex === 0 ? firstPrice : ""),
                    ),
                  };
                }

                const firstPrice = item.price ?? item.prices?.[0] ?? "";
                const { prices: _prices, ...itemWithoutPrices } = item;
                void _prices;
                return { ...itemWithoutPrices, price: firstPrice };
              }),
            };
          }),
        };
      }),
    }));
  }

  function updateTierPrice(
    categoryIndex: number,
    groupIndex: number,
    itemIndex: number,
    priceIndex: number,
    value: string,
  ) {
    const item = content.services[categoryIndex]?.groups[groupIndex]?.items[itemIndex];
    if (!item?.prices) return;
    updateItem(categoryIndex, groupIndex, itemIndex, {
      prices: item.prices.map((price, index) => (index === priceIndex ? value : price)),
    });
  }

  function addItem(categoryIndex: number, groupIndex: number) {
    const item: ServiceItem = {
      id: makeId("service"),
      name: "Neue Leistung",
      price: "",
      note: "",
    };

    setContent((current) => ({
      ...current,
      services: current.services.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              groups: category.groups.map((group, currentGroupIndex) =>
                currentGroupIndex === groupIndex
                  ? { ...group, items: [...group.items, item] }
                  : group,
              ),
            }
          : category,
      ),
    }));
  }

  function removeItem(categoryIndex: number, groupIndex: number, itemIndex: number) {
    const name =
      content.services[categoryIndex]?.groups[groupIndex]?.items[itemIndex]?.name ||
      "diese Leistung";
    if (
      !window.confirm(
        `„${name}“ löschen? Die Löschung wird erst nach dem Speichern endgültig.`,
      )
    ) {
      return;
    }
    setContent((current) => ({
      ...current,
      services: current.services.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              groups: category.groups.map((group, currentGroupIndex) =>
                currentGroupIndex === groupIndex
                  ? {
                      ...group,
                      items: group.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex),
                    }
                  : group,
              ),
            }
          : category,
      ),
    }));
  }

  function discardChanges() {
    if (!dirty) return;
    if (!window.confirm("Alle Änderungen seit dem letzten Speichern verwerfen?")) return;
    contentFormRef.current
      ?.querySelectorAll<ValidatableControl>("input, textarea, select")
      .forEach((control) => control.setCustomValidity(""));
    setSaveError(null);
    setContent(initialContent);
  }

  return (
    <div className="min-h-screen bg-[#f3efe8] pb-48 text-black sm:pb-32">
      <header className="border-b border-white/10 bg-dark text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Salon Sara"
              width={42}
              height={42}
              className="brightness-0 invert"
            />
            <div>
              <p className="text-sm text-white/70">Besitzerbereich</p>
              <h1 className="font-semibold tracking-wide">Salon verwalten</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Website in neuem Tab ansehen
            </a>
            <form
              action={logoutAction}
              onSubmit={(event) => {
                if (
                  dirty &&
                  !window.confirm(
                    "Ihre letzten Änderungen sind noch nicht gespeichert. Trotzdem abmelden?",
                  )
                ) {
                  event.preventDefault();
                }
              }}
            >
              <button
                type="submit"
                className="min-h-11 border border-white/20 px-4 py-2 text-sm text-white/75 transition hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-7 flex flex-col justify-between gap-4 border-b border-black/15 pb-7 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-gold-dark">Hallo Samir</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Was möchten Sie ändern?</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-black/60">
              Wählen Sie unten einen Bereich. Ihre Änderungen werden erst sichtbar, wenn Sie auf
              „Änderungen speichern“ klicken.
            </p>
          </div>
          <p className="text-sm text-black/65">
            Zuletzt gespeichert: {lastUpdatedLabel}
          </p>
        </div>

        <nav aria-label="Direkt zu einem Bereich" className="mb-10">
          <p className="mb-3 text-base font-semibold">Direkt zu:</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <a
              href="#banner"
              className="border border-black/15 bg-white p-4 transition hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span className="block text-lg font-bold">Banner</span>
              <span className="mt-1 block text-sm leading-5 text-black/55">Aktionen, Urlaub oder wichtige Hinweise</span>
            </a>
            <a
              href="#oeffnungszeiten"
              className="border border-black/15 bg-white p-4 transition hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span className="block text-lg font-bold">Öffnungszeiten</span>
              <span className="mt-1 block text-sm leading-5 text-black/55">Tage und Uhrzeiten ändern</span>
            </a>
            <a
              href="#preise"
              className="border border-black/15 bg-white p-4 transition hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span className="block text-lg font-bold">Preise</span>
              <span className="mt-1 block text-sm leading-5 text-black/55">Leistungen und Preise bearbeiten</span>
            </a>
          </div>
        </nav>

        {notice ? (
          <div
            className={`mb-9 border-l-4 px-5 py-4 text-base ${
              notice.tone === "success"
                ? "border-[#39745a] bg-[#e7f2ec] text-[#244f3c]"
                : "border-[#8a3048] bg-[#f7e9ed] text-[#6f263d]"
            }`}
            role={notice.tone === "error" ? "alert" : "status"}
          >
            {notice.message}
          </div>
        ) : null}

        <form
          ref={contentFormRef}
          onSubmit={saveContent}
          onInput={(event) => {
            if (isValidatableControl(event.target)) {
              event.target.setCustomValidity("");
            }
            if (saveError) setSaveError(null);
          }}
          onInvalid={(event) => {
            const target = event.target;
            if (isValidatableControl(target) && target.validity.valueMissing) {
              target.setCustomValidity(
                target.dataset.validationMessage ?? "Bitte füllen Sie dieses Feld aus.",
              );
            }
            if (!(target instanceof HTMLElement)) return;
            const details = target.closest("details");
            if (!details) return;
            details.open = true;
            if (details.dataset.optionalLink === "true") setOptionalLinkOpen(true);
            if (details.dataset.priceSection) {
              setOpenPriceSection(details.dataset.priceSection);
            }
          }}
        >
          <input type="hidden" name="content" value={payload} />

          <section
            id="banner"
            aria-labelledby="announcement-heading"
            className="scroll-mt-6 border-t-4 border-gold bg-white p-5 shadow-[0_16px_50px_rgba(45,35,25,0.08)] sm:p-8"
          >
            <div>
              <h3 id="announcement-heading" className="text-2xl font-bold">
                Banner oben auf der Website
              </h3>
              <p className="mt-2 max-w-2xl text-base leading-7 text-black/60">
                Zeigen Sie hier eine Aktion, eine Urlaubszeit oder einen wichtigen Hinweis an.
                Erst nach dem Aktivieren und Speichern sehen Besucher den Banner.
              </p>
            </div>

            <div
              className={`mt-6 flex flex-col justify-between gap-4 border-2 p-4 sm:flex-row sm:items-center sm:p-5 ${
                content.announcement.enabled
                  ? "border-[#39745a] bg-[#e7f2ec]"
                  : "border-black/15 bg-[#f8f5ef]"
              }`}
            >
              <div aria-live="polite">
                <p className="text-base font-bold">{bannerStatus.title}</p>
                <p className="mt-1 text-sm leading-6 text-black/65">
                  {bannerStatus.description}
                </p>
              </div>
              <button
                type="button"
                className={`inline-flex min-h-12 shrink-0 items-center justify-center px-5 py-3 text-base font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  content.announcement.enabled
                    ? "border border-[#7d2941] bg-white text-[#7d2941] hover:bg-[#f7e9ed]"
                    : "bg-gold text-white hover:bg-gold-dark"
                }`}
                onClick={() =>
                  setContent((current) => ({
                    ...current,
                    announcement: {
                      ...current.announcement,
                      enabled: !current.announcement.enabled,
                    },
                  }))
                }
              >
                {content.announcement.enabled ? "Banner deaktivieren" : "Banner aktivieren"}
              </button>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <label className="text-base font-semibold">
                Was möchten Sie mitteilen?
                <select
                  className={`${fieldClass} mt-2`}
                  value={content.announcement.kind}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      announcement: {
                        ...current.announcement,
                        kind: event.target.value as SiteContent["announcement"]["kind"],
                      },
                    }))
                  }
                >
                  <option value="promotion">Angebot oder Aktion</option>
                  <option value="info">Allgemeine Information</option>
                  <option value="closure">Urlaub oder geschlossen</option>
                </select>
              </label>

              <label className="text-base font-semibold">
                Überschrift im Banner
                <input
                  ref={bannerTitleRef}
                  className={`${fieldClass} mt-2`}
                  value={content.announcement.title ?? ""}
                  maxLength={100}
                  required={content.announcement.enabled}
                  data-validation-message="Bitte geben Sie eine Überschrift für den Banner ein."
                  placeholder="z. B. Sommeraktion"
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      announcement: { ...current.announcement, title: event.target.value },
                    }))
                  }
                />
              </label>

              <label className="text-base font-semibold md:col-span-2">
                Zusätzlicher Text (optional)
                <textarea
                  className={`${fieldClass} mt-2 min-h-28 resize-y`}
                  value={content.announcement.message}
                  maxLength={500}
                  placeholder="z. B. Vom 12. bis 18. August machen wir Urlaub."
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      announcement: { ...current.announcement, message: event.target.value },
                    }))
                  }
                />
                <span className="mt-2 block text-sm font-normal leading-6 text-black/65">
                  Die Überschrift reicht aus. Dieses Feld können Sie leer lassen.
                </span>
              </label>

              <details
                className="md:col-span-2 border border-black/15 bg-[#f8f5ef] p-4"
                data-optional-link="true"
                open={optionalLinkOpen}
                onToggle={(event) => setOptionalLinkOpen(event.currentTarget.open)}
              >
                <summary className="min-h-11 cursor-pointer py-2 text-base font-bold">
                  Optional: Schaltfläche im Banner
                </summary>
                <p className="mt-1 text-sm leading-6 text-black/65">
                  Nur ausfüllen, wenn Besucher im Banner auf eine Schaltfläche klicken sollen. Dann
                  werden beide Felder benötigt.
                </p>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <label className="text-base font-semibold">
                    Text auf der Schaltfläche
                    <input
                      ref={ctaLabelRef}
                      className={`${fieldClass} mt-2`}
                      value={content.announcement.ctaLabel ?? ""}
                      maxLength={60}
                      required={ctaIsInUse}
                      placeholder="z. B. Jetzt anrufen"
                      onChange={(event) =>
                        setContent((current) => ({
                          ...current,
                          announcement: { ...current.announcement, ctaLabel: event.target.value },
                        }))
                      }
                    />
                  </label>

                  <label className="text-base font-semibold">
                    Wohin soll die Schaltfläche führen?
                    <input
                      ref={ctaUrlRef}
                      className={`${fieldClass} mt-2`}
                      value={content.announcement.ctaUrl ?? ""}
                      maxLength={500}
                      required={ctaIsInUse}
                      placeholder="z. B. #kontakt"
                      onChange={(event) =>
                        setContent((current) => ({
                          ...current,
                          announcement: { ...current.announcement, ctaUrl: event.target.value },
                        }))
                      }
                    />
                    <span className="mt-2 block text-sm font-normal leading-6 text-black/65">
                      Für den Kontaktbereich einfach <strong>#kontakt</strong> eintragen.
                    </span>
                  </label>
                </div>
              </details>
            </div>

            <div className="mt-8 border border-dashed border-black/25 bg-[#f8f5ef] p-4">
              <p className="mb-3 text-base font-bold">So sieht der Banner auf der Website aus</p>
              {content.announcement.title?.trim() || content.announcement.message.trim() ? (
                <AnnouncementBanner
                  announcement={{ ...content.announcement, enabled: true }}
                />
              ) : (
                <p className="border border-black/10 bg-white px-4 py-5 text-base text-black/65">
                  Tragen Sie zuerst eine Überschrift oder einen Text ein. Dann erscheint hier die
                  Vorschau.
                </p>
              )}
              {bannerStatus.draftChanged ? (
                <p className="mt-3 text-sm font-semibold text-[#7d5222]">
                  Nur Vorschau – Ihre Änderungen werden erst nach dem Speichern sichtbar.
                </p>
              ) : !content.announcement.enabled ? (
                <p className="mt-3 text-sm font-semibold text-[#7d2941]">
                  Nur Vorschau – dieser Banner ist noch nicht auf der Website sichtbar.
                </p>
              ) : null}
            </div>
          </section>

          <section
            id="oeffnungszeiten"
            aria-labelledby="hours-heading"
            className="mt-10 scroll-mt-6 border-t-4 border-black/70 bg-white p-5 shadow-[0_16px_50px_rgba(45,35,25,0.06)] sm:p-8"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h3 id="hours-heading" className="text-2xl font-bold">Öffnungszeiten</h3>
                <p className="mt-2 max-w-2xl text-base leading-7 text-black/60">
                  Tragen Sie links die Tage und rechts die passende Öffnungszeit ein. Auch
                  „Geschlossen“ ist möglich.
                </p>
              </div>
              <button type="button" className={`${smallButtonClass} w-full sm:w-auto`} onClick={addHour}>
                Neue Zeile hinzufügen
              </button>
            </div>

            <div className="mt-6 divide-y divide-black/10 border border-black/10 bg-[#fbfaf7]">
              {content.openingHours.map((entry, index) => (
                <div key={entry.id} className="grid gap-4 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end sm:p-5">
                  <label className="text-base font-semibold">
                    Tage oder Bezeichnung
                    <input
                      className={`${fieldClass} mt-2`}
                      value={entry.label}
                      maxLength={80}
                      required
                      placeholder="z. B. Montag bis Freitag"
                      onChange={(event) => updateHour(index, { label: event.target.value })}
                    />
                  </label>
                  <label className="text-base font-semibold">
                    Öffnungszeit oder Hinweis
                    <input
                      className={`${fieldClass} mt-2`}
                      value={entry.value}
                      maxLength={100}
                      required
                      placeholder="z. B. 08:00 – 19:00 Uhr"
                      onChange={(event) => updateHour(index, { value: event.target.value })}
                    />
                  </label>
                  <button
                    type="button"
                    className={`${smallButtonClass} w-full text-[#7d2941] hover:border-[#7d2941] hover:text-[#7d2941] md:w-auto`}
                    onClick={() => removeHour(index)}
                    aria-label={`${entry.label || "Öffnungszeit"} löschen`}
                  >
                    Zeile löschen
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section
            id="preise"
            aria-labelledby="prices-heading"
            className="mt-10 scroll-mt-6 border-t-4 border-black/70 pt-8"
          >
            <h3 id="prices-heading" className="text-2xl font-bold">Preise und Leistungen</h3>
            <p className="mt-2 max-w-2xl text-base leading-7 text-black/60">
              Öffnen Sie den gewünschten Bereich und ändern Sie dort Namen oder Preise. Das
              Eurozeichen darf direkt mit eingegeben werden.
            </p>

            <div className="mt-8 space-y-5">
              {content.services.map((category, categoryIndex) => (
                <details
                  key={category.id}
                  className="border-l-4 border-black bg-white p-5 shadow-[0_12px_35px_rgba(45,35,25,0.05)] sm:p-7"
                  data-price-section={category.id}
                  open={openPriceSection === category.id}
                  onToggle={(event) => {
                    if (event.currentTarget.open) {
                      setOpenPriceSection(category.id);
                      return;
                    }
                    setOpenPriceSection((current) =>
                      current === category.id ? null : current,
                    );
                  }}
                >
                  <summary className="cursor-pointer text-lg font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:text-xl">
                    <span>{category.label}</span>
                    <span className="mt-1 block text-sm font-normal text-black/60">
                      {category.groups.reduce((total, group) => total + group.items.length, 0)}{" "}
                      Leistungen –{" "}
                      {openPriceSection === category.id
                        ? "Bereich geöffnet"
                        : "zum Bearbeiten öffnen"}
                    </span>
                  </summary>

                  <div className="mt-6 border-t border-black/10 pt-6">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                      <label className="text-base font-semibold">
                        Überschrift auf der Website
                        <input
                          className={`${fieldClass} mt-2 max-w-sm text-lg font-bold`}
                          value={category.label}
                          maxLength={60}
                          required
                          onChange={(event) =>
                            updateCategoryLabel(categoryIndex, event.target.value)
                          }
                        />
                      </label>

                      {category.lengthLabels?.length ? (
                        <div>
                          <p className="mb-2 text-base font-semibold">Namen der Haarlängen</p>
                          <div className="flex flex-wrap gap-2">
                            {category.lengthLabels.map((label, labelIndex) => (
                              <label
                                key={labelIndex}
                                className="text-sm font-semibold text-black/65"
                              >
                                <span className="mb-1 block">Länge {labelIndex + 1}</span>
                                <input
                                  className={`${fieldClass} w-24`}
                                  value={label}
                                  maxLength={30}
                                  required
                                  onChange={(event) =>
                                    updateLengthLabel(categoryIndex, labelIndex, event.target.value)
                                  }
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>

                  <div className="mt-8 space-y-8">
                    {category.groups.map((group, groupIndex) => (
                      <div key={group.id} className="border-t border-black/15 pt-5">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                          <label className="w-full max-w-md text-base font-semibold">
                            Preisgruppe
                            <input
                              className={`${fieldClass} mt-2`}
                              value={group.title}
                              maxLength={80}
                              required
                              onChange={(event) =>
                                updateGroup(categoryIndex, groupIndex, { title: event.target.value })
                              }
                            />
                          </label>
                          <button
                            type="button"
                            className={`${smallButtonClass} w-full text-[#7d2941] hover:border-[#7d2941] hover:text-[#7d2941] sm:w-auto`}
                            onClick={() => removeGroup(categoryIndex, groupIndex)}
                            aria-label={`Preisgruppe ${group.title || "ohne Namen"} löschen`}
                          >
                            Diese Preisgruppe löschen
                          </button>
                        </div>

                        <div className="mt-5 space-y-4">
                          {group.items.map((item, itemIndex) => (
                            <div key={item.id} className="border border-black/10 bg-[#fbfaf7] p-4 sm:p-5">
                              <div className="grid gap-4 lg:grid-cols-[minmax(12rem,1.5fr)_minmax(9rem,0.7fr)_auto] lg:items-end">
                                <label className="text-base font-semibold">
                                  Name der Leistung
                                  <input
                                    className={`${fieldClass} mt-2`}
                                    value={item.name}
                                    maxLength={120}
                                    required
                                    onChange={(event) =>
                                      updateItem(categoryIndex, groupIndex, itemIndex, {
                                        name: event.target.value,
                                      })
                                    }
                                  />
                                </label>

                                <label className="text-base font-semibold">
                                  Wie wird der Preis angezeigt?
                                  <select
                                    className={`${fieldClass} mt-2`}
                                    value={item.prices ? "lengths" : "single"}
                                    onChange={(event) =>
                                      changePriceMode(
                                        categoryIndex,
                                        groupIndex,
                                        itemIndex,
                                        event.target.value as "single" | "lengths",
                                      )
                                    }
                                  >
                                    <option value="single">Ein Preis für alle</option>
                                    {category.lengthLabels?.length ? (
                                      <option value="lengths">Preise je Haarlänge</option>
                                    ) : null}
                                  </select>
                                </label>

                                <button
                                  type="button"
                                  className={`${smallButtonClass} w-full text-[#7d2941] hover:border-[#7d2941] hover:text-[#7d2941] lg:w-auto`}
                                  onClick={() => removeItem(categoryIndex, groupIndex, itemIndex)}
                                  aria-label={`Leistung ${item.name || "ohne Namen"} löschen`}
                                >
                                  Leistung löschen
                                </button>
                              </div>

                              {item.prices ? (
                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                  {item.prices.map((price, priceIndex) => (
                                    <label key={priceIndex} className="text-sm font-semibold text-black/65">
                                      {category.lengthLabels?.[priceIndex] ?? `Preis ${priceIndex + 1}`}
                                      <input
                                        className={`${fieldClass} mt-1.5`}
                                        value={price}
                                        maxLength={60}
                                        required
                                        onChange={(event) =>
                                          updateTierPrice(
                                            categoryIndex,
                                            groupIndex,
                                            itemIndex,
                                            priceIndex,
                                            event.target.value,
                                          )
                                        }
                                      />
                                    </label>
                                  ))}
                                </div>
                              ) : (
                                <label className="mt-4 block max-w-xs text-base font-semibold">
                                  Preis
                                  <input
                                    className={`${fieldClass} mt-2`}
                                    value={item.price ?? ""}
                                    maxLength={60}
                                    required
                                    placeholder="z. B. ab 30 €"
                                    onChange={(event) =>
                                      updateItem(categoryIndex, groupIndex, itemIndex, {
                                        price: event.target.value,
                                      })
                                    }
                                  />
                                </label>
                              )}

                              <label className="mt-4 block text-base font-semibold">
                                Zusätzlicher Hinweis (optional)
                                <input
                                  className={`${fieldClass} mt-2`}
                                  value={item.note ?? ""}
                                  maxLength={160}
                                  placeholder="Kurzer Hinweis zur Leistung"
                                  onChange={(event) =>
                                    updateItem(categoryIndex, groupIndex, itemIndex, {
                                      note: event.target.value,
                                    })
                                  }
                                />
                              </label>
                            </div>
                          ))}

                          <button
                            type="button"
                            className={`${smallButtonClass} w-full sm:w-auto`}
                            onClick={() => addItem(categoryIndex, groupIndex)}
                          >
                            Neue Leistung hinzufügen
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className={`${smallButtonClass} w-full sm:w-auto`}
                      onClick={() => addGroup(categoryIndex)}
                    >
                      Neue Preisgruppe hinzufügen
                    </button>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/15 bg-[#fffdf9]/95 px-5 py-4 shadow-[0_-10px_35px_rgba(30,24,18,0.08)] backdrop-blur sm:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                className={`text-base font-semibold ${
                  saveError ? "text-[#7d2941]" : dirty ? "text-[#7d5222]" : "text-[#2f654b]"
                }`}
                aria-live="assertive"
                role={saveError ? "alert" : "status"}
              >
                {saveError ??
                  (dirty
                    ? "Noch nicht gespeichert – bitte jetzt speichern."
                    : "✓ Alles ist gespeichert.")}
              </p>
              <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                {dirty ? (
                  <button
                    type="button"
                    className="inline-flex min-h-12 w-full items-center justify-center border border-black/20 bg-white px-5 py-3 text-base font-semibold text-black/70 transition hover:border-[#7d2941] hover:text-[#7d2941] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto"
                    onClick={discardChanges}
                  >
                    Änderungen verwerfen
                  </button>
                ) : null}
                <SubmitButton dirty={dirty} saving={saving} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
