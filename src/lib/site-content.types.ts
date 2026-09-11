export const ANNOUNCEMENT_KINDS = ["promotion", "info", "closure"] as const;

export type AnnouncementKind = (typeof ANNOUNCEMENT_KINDS)[number];

export interface Announcement {
  enabled: boolean;
  kind: AnnouncementKind;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price?: string;
  prices?: string[];
  note?: string;
}

export interface ServiceGroup {
  id: string;
  title: string;
  items: ServiceItem[];
}

export interface ServiceCategory {
  id: string;
  label: string;
  lengthLabels?: string[];
  groups: ServiceGroup[];
}

export const OPENING_HOURS_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type OpeningHoursDay = (typeof OPENING_HOURS_DAYS)[number];

export interface OpeningHoursEntry {
  id: string;
  label: string;
  value: string;
  /** Optional schema.org-compatible details for entries that represent actual opening hours. */
  days?: OpeningHoursDay[];
  opens?: string;
  closes?: string;
  closed?: boolean;
}

export interface SiteContent {
  revision: number;
  updatedAt: string;
  services: ServiceCategory[];
  openingHours: OpeningHoursEntry[];
  announcement: Announcement;
}

/**
 * Canonical content matching the public site before the owner dashboard was added.
 * Callers should use getSiteContent() rather than mutating this object.
 */
export const DEFAULT_SITE_CONTENT: SiteContent = {
  revision: 1,
  updatedAt: "2026-09-10T00:00:00.000Z",
  services: [
    {
      id: "category-damen",
      label: "Damen",
      lengthLabels: ["Kurz", "Mittel", "Lang"],
      groups: [
        {
          id: "group-damen-schnitt",
          title: "Schnitt",
          items: [
            {
              id: "service-damen-trockenhaarschnitt",
              name: "Trockenhaarschnitt",
              prices: ["20 €", "23 €", "25 €"],
            },
            {
              id: "service-damen-waschen-schneiden-foehnen",
              name: "Waschen, Schneiden, Föhnen",
              prices: ["30 €", "34 €", "38 €"],
            },
          ],
        },
        {
          id: "group-damen-farbe",
          title: "Farbe",
          items: [
            {
              id: "service-damen-folienstraehnen",
              name: "Foliensträhnen",
              prices: ["35 €", "48 €", "70 €"],
            },
            {
              id: "service-damen-balayage",
              name: "Balayage",
              price: "ab 160 €",
            },
            {
              id: "service-damen-ansatz-farbe",
              name: "Ansatz Farbe",
              price: "ab 30 €",
            },
            {
              id: "service-damen-global-farbe",
              name: "Global Farbe",
              prices: ["36 €", "46 €", "70 €"],
            },
          ],
        },
        {
          id: "group-damen-styling-specials",
          title: "Styling & Specials",
          items: [
            {
              id: "service-damen-dauerwelle",
              name: "Dauerwelle",
              prices: ["42 €", "65 €", "75 €"],
            },
            {
              id: "service-damen-hochsteckfrisur",
              name: "Hochsteckfrisur",
              price: "Nach Absprache",
            },
            {
              id: "service-damen-haarverlaengerung",
              name: "Haarverlängerung",
              price: "Nach Absprache",
            },
            {
              id: "service-damen-keratin-glaettung",
              name: "Keratin-Glättung",
              price: "Nach Absprache",
            },
          ],
        },
      ],
    },
    {
      id: "category-herren",
      label: "Herren",
      groups: [
        {
          id: "group-herren-schnitt",
          title: "Schnitt",
          items: [
            {
              id: "service-herren-trockenhaarschnitt",
              name: "Trockenhaarschnitt",
              price: "18 €",
            },
            {
              id: "service-herren-waschen-schneiden-foehnen",
              name: "Waschen, Schneiden, Föhnen",
              price: "20 €",
            },
          ],
        },
        {
          id: "group-herren-bart-farbe",
          title: "Bart & Farbe",
          items: [
            {
              id: "service-herren-bart-rasur",
              name: "Bart Rasur",
              price: "12 €",
            },
            {
              id: "service-herren-faerben",
              name: "Färben",
              price: "ab 20 €",
            },
          ],
        },
      ],
    },
    {
      id: "category-kosmetik",
      label: "Kosmetik",
      groups: [
        {
          id: "group-kosmetik-augenbrauen-gesicht",
          title: "Augenbrauen & Gesicht",
          items: [
            {
              id: "service-kosmetik-augenbrauen-zupfen",
              name: "Augenbrauen zupfen (mit Faden)",
              price: "8 €",
            },
            {
              id: "service-kosmetik-augenbrauen-faerben",
              name: "Augenbrauen färben",
              price: "8 €",
            },
            {
              id: "service-kosmetik-gesichtshaarentfernung",
              name: "Gesichtshaarentfernung (mit Faden)",
              price: "10 €",
            },
            {
              id: "service-kosmetik-wimpern-faerben",
              name: "Wimpern färben",
              price: "10 €",
            },
          ],
        },
      ],
    },
    {
      id: "category-kinder",
      label: "Kinder",
      groups: [
        {
          id: "group-kinder-trockenhaarschnitt",
          title: "Trockenhaarschnitt",
          items: [
            {
              id: "service-kinder-jungen-bis-12",
              name: "Jungen bis 12 Jahren",
              price: "14 €",
            },
            {
              id: "service-kinder-jungen-bis-16",
              name: "Jungen bis 16 Jahren",
              price: "16 €",
            },
            {
              id: "service-kinder-maedchen-bis-12",
              name: "Mädchen bis 12 Jahren",
              price: "16 €",
            },
            {
              id: "service-kinder-maedchen-bis-16",
              name: "Mädchen bis 16 Jahren",
              price: "18 €",
            },
          ],
        },
      ],
    },
  ],
  openingHours: [
    {
      id: "hours-appointment",
      label: "Mit Termin",
      value: "06:00 – 21:00 Uhr",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "06:00",
      closes: "21:00",
    },
    {
      id: "hours-walk-in",
      label: "Mit & ohne Termin",
      value: "08:00 – 19:00 Uhr",
    },
    {
      id: "hours-sunday",
      label: "Sonntag",
      value: "Geschlossen",
      days: ["Sunday"],
      closed: true,
    },
  ],
  announcement: {
    enabled: false,
    kind: "info",
    title: "",
    message: "",
  },
};
