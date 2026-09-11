"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
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
  "min-h-11 w-full border border-black/15 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";
const smallButtonClass =
  "inline-flex min-h-10 items-center justify-center border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-black transition hover:border-gold hover:text-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

interface OwnerDashboardProps {
  initialContent: SiteContent;
  notice?: { tone: "success" | "error"; message: string } | null;
}

function makeId(prefix: string) {
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return `${prefix}-${suffix}`.replace(/[^a-zA-Z0-9_-]/g, "");
}

function SubmitButton({ dirty }: { dirty: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || !dirty}
      className="inline-flex min-h-11 items-center justify-center bg-gold px-6 py-3 text-sm font-bold text-white transition hover:bg-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:bg-black/20"
    >
      {pending ? "Wird gespeichert …" : dirty ? "Änderungen speichern" : "Alles gespeichert"}
    </button>
  );
}

export default function OwnerDashboard({
  initialContent,
  notice,
}: OwnerDashboardProps) {
  const [content, setContent] = useState(initialContent);
  const initialSnapshot = useMemo(() => JSON.stringify(initialContent), [initialContent]);
  const payload = useMemo(() => JSON.stringify(content), [content]);
  const dirty = payload !== initialSnapshot;
  const ctaIsInUse = Boolean(
    content.announcement.ctaLabel?.trim() || content.announcement.ctaUrl?.trim(),
  );

  useEffect(() => {
    const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };

    window.addEventListener("beforeunload", warnAboutUnsavedChanges);
    return () => window.removeEventListener("beforeunload", warnAboutUnsavedChanges);
  }, [dirty]);

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
    if (!window.confirm("Diese Öffnungszeit wirklich entfernen?")) return;
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
    if (!window.confirm("Diese Gruppe mit allen Leistungen wirklich entfernen?")) return;
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
    if (!window.confirm("Diese Leistung wirklich entfernen?")) return;
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

  return (
    <div className="min-h-screen bg-[#f3efe8] pb-28 text-black">
      <header className="border-b border-white/10 bg-dark text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Salon Sara"
              width={42}
              height={42}
              className="brightness-0 invert"
            />
            <div>
              <p className="text-xs text-white/45">Besitzerbereich</p>
              <h1 className="font-semibold tracking-wide">Salon verwalten</h1>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="min-h-11 border border-white/20 px-4 py-2 text-sm text-white/75 transition hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Abmelden
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-black/15 pb-7 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-gold-dark">Hallo Samir</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Was soll heute auf die Seite?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
              Änderungen werden nach dem Speichern direkt für Besucher sichtbar.
            </p>
          </div>
          <p className="text-xs text-black/45">
            Stand: {new Date(content.updatedAt).toLocaleString("de-DE")}
          </p>
        </div>

        {notice ? (
          <div
            className={`mb-9 border-l-4 px-4 py-3 text-sm ${
              notice.tone === "success"
                ? "border-[#39745a] bg-[#e7f2ec] text-[#244f3c]"
                : "border-[#8a3048] bg-[#f7e9ed] text-[#6f263d]"
            }`}
            role={notice.tone === "error" ? "alert" : "status"}
          >
            {notice.message}
          </div>
        ) : null}

        <form action={saveContentAction}>
          <input type="hidden" name="content" value={payload} />

          <section aria-labelledby="announcement-heading" className="border-t-4 border-gold bg-white p-5 shadow-[0_16px_50px_rgba(45,35,25,0.08)] sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <h3 id="announcement-heading" className="text-2xl font-bold">Hinweis oder Aktion</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
                  Nur wenn der Schalter aktiv ist, erscheint der Banner ganz oben auf der Website.
                </p>
              </div>

              <label className="flex min-h-11 cursor-pointer items-center gap-3 border border-black/15 bg-[#f8f5ef] px-4 py-2.5 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={content.announcement.enabled}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      announcement: {
                        ...current.announcement,
                        enabled: event.target.checked,
                      },
                    }))
                  }
                  className="h-5 w-5 accent-[#B8956A]"
                />
                {content.announcement.enabled ? "Banner aktiv" : "Banner aus"}
              </label>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-semibold">
                Art des Hinweises
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
                  <option value="promotion">Aktion</option>
                  <option value="info">Allgemeiner Hinweis</option>
                  <option value="closure">Urlaub / geschlossen</option>
                </select>
              </label>

              <label className="text-sm font-semibold">
                Kurze Überschrift
                <input
                  className={`${fieldClass} mt-2`}
                  value={content.announcement.title ?? ""}
                  maxLength={100}
                  required={content.announcement.enabled}
                  placeholder="z. B. Sommeraktion"
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      announcement: { ...current.announcement, title: event.target.value },
                    }))
                  }
                />
              </label>

              <label className="text-sm font-semibold md:col-span-2">
                Nachricht
                <textarea
                  className={`${fieldClass} mt-2 min-h-28 resize-y`}
                  value={content.announcement.message}
                  maxLength={500}
                  required={content.announcement.enabled}
                  placeholder="z. B. Vom 12. bis 18. August machen wir Urlaub."
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      announcement: { ...current.announcement, message: event.target.value },
                    }))
                  }
                />
              </label>

              <label className="text-sm font-semibold">
                Link-Text (optional)
                <input
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

              <label className="text-sm font-semibold">
                Link-Ziel (optional)
                <input
                  className={`${fieldClass} mt-2`}
                  value={content.announcement.ctaUrl ?? ""}
                  maxLength={500}
                  required={ctaIsInUse}
                  placeholder="https://… oder #kontakt"
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      announcement: { ...current.announcement, ctaUrl: event.target.value },
                    }))
                  }
                />
              </label>
            </div>

            <div className="mt-8 border border-dashed border-black/20 bg-[#f8f5ef] p-3">
              <p className="mb-3 text-xs font-semibold text-black/45">Vorschau</p>
              {content.announcement.enabled ? (
                <AnnouncementBanner announcement={content.announcement} />
              ) : (
                <p className="px-3 py-4 text-sm text-black/45">Der Banner ist ausgeschaltet.</p>
              )}
            </div>
          </section>

          <section aria-labelledby="hours-heading" className="mt-14 border-t border-black/20 pt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h3 id="hours-heading" className="text-2xl font-bold">Öffnungszeiten</h3>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Diese Zeilen erscheinen im Kontaktbereich und im Seitenfuß.
                </p>
              </div>
              <button type="button" className={smallButtonClass} onClick={addHour}>
                Zeit hinzufügen
              </button>
            </div>

            <div className="mt-6 divide-y divide-black/10 border-y border-black/10 bg-white">
              {content.openingHours.map((entry, index) => (
                <div key={entry.id} className="grid gap-4 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5">
                  <label className="text-sm font-semibold">
                    Bezeichnung
                    <input
                      className={`${fieldClass} mt-2`}
                      value={entry.label}
                      maxLength={80}
                      required
                      onChange={(event) => updateHour(index, { label: event.target.value })}
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    Zeit oder Status
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
                    className={`${smallButtonClass} text-[#7d2941] hover:border-[#7d2941] hover:text-[#7d2941]`}
                    onClick={() => removeHour(index)}
                    aria-label={`${entry.label || "Öffnungszeit"} entfernen`}
                  >
                    Entfernen
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="prices-heading" className="mt-14 border-t border-black/20 pt-8">
            <h3 id="prices-heading" className="text-2xl font-bold">Leistungen & Preise</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
              Preise können als Einzelpreis oder nach Haarlänge gepflegt werden. Das Eurozeichen kann direkt mit eingegeben werden.
            </p>

            <div className="mt-8 space-y-12">
              {content.services.map((category, categoryIndex) => (
                <div key={category.id} className="border-l-4 border-black bg-white p-5 sm:p-7">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <label className="text-sm font-semibold">
                      Kategorie
                      <input
                        className={`${fieldClass} mt-2 max-w-sm text-lg font-bold`}
                        value={category.label}
                        maxLength={60}
                        required
                        onChange={(event) => updateCategoryLabel(categoryIndex, event.target.value)}
                      />
                    </label>

                    {category.lengthLabels?.length ? (
                      <div>
                        <p className="mb-2 text-sm font-semibold">Bezeichnungen der Längen</p>
                        <div className="flex flex-wrap gap-2">
                          {category.lengthLabels.map((label, labelIndex) => (
                            <label key={labelIndex} className="text-xs text-black/50">
                              <span className="sr-only">Länge {labelIndex + 1}</span>
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
                          <label className="w-full max-w-md text-sm font-semibold">
                            Gruppenname
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
                            className={`${smallButtonClass} text-[#7d2941] hover:border-[#7d2941] hover:text-[#7d2941]`}
                            onClick={() => removeGroup(categoryIndex, groupIndex)}
                          >
                            Gruppe entfernen
                          </button>
                        </div>

                        <div className="mt-5 space-y-4">
                          {group.items.map((item, itemIndex) => (
                            <div key={item.id} className="border border-black/10 bg-[#fbfaf7] p-4 sm:p-5">
                              <div className="grid gap-4 lg:grid-cols-[minmax(12rem,1.5fr)_minmax(9rem,0.7fr)_auto] lg:items-end">
                                <label className="text-sm font-semibold">
                                  Leistung
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

                                <label className="text-sm font-semibold">
                                  Preisart
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
                                    <option value="single">Ein Preis</option>
                                    <option value="lengths">Nach Länge</option>
                                  </select>
                                </label>

                                <button
                                  type="button"
                                  className={`${smallButtonClass} text-[#7d2941] hover:border-[#7d2941] hover:text-[#7d2941]`}
                                  onClick={() => removeItem(categoryIndex, groupIndex, itemIndex)}
                                >
                                  Entfernen
                                </button>
                              </div>

                              {item.prices ? (
                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                  {item.prices.map((price, priceIndex) => (
                                    <label key={priceIndex} className="text-xs font-semibold text-black/60">
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
                                <label className="mt-4 block max-w-xs text-sm font-semibold">
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

                              <label className="mt-4 block text-sm font-semibold">
                                Zusatz (optional)
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
                            className={smallButtonClass}
                            onClick={() => addItem(categoryIndex, groupIndex)}
                          >
                            Leistung hinzufügen
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className={smallButtonClass}
                      onClick={() => addGroup(categoryIndex)}
                    >
                      Gruppe hinzufügen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/15 bg-[#fffdf9]/95 px-5 py-4 shadow-[0_-10px_35px_rgba(30,24,18,0.08)] backdrop-blur sm:px-8">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <p className="text-xs text-black/55" aria-live="polite">
                {dirty ? "Noch nicht gespeicherte Änderungen" : "Alle Änderungen sind gespeichert"}
              </p>
              <SubmitButton dirty={dirty} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
