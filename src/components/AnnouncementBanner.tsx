export type AnnouncementKind = "promotion" | "info" | "closure";

export interface Announcement {
  enabled: boolean;
  kind: AnnouncementKind;
  title?: string | null;
  message: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

interface AnnouncementBannerProps {
  announcement?: Announcement | null;
}

const bannerStyles: Record<
  AnnouncementKind,
  { label: string; container: string; badge: string; link: string }
> = {
  promotion: {
    label: "Aktion",
    container:
      "border-b border-white/20 bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-white",
    badge: "border-white/35 bg-white/10 text-white",
    link: "border-white/40 bg-white text-gold-dark hover:bg-warm-white",
  },
  info: {
    label: "Hinweis",
    container: "border-b border-gold/30 bg-dark text-white",
    badge: "border-gold/50 bg-gold/10 text-gold-light",
    link: "border-gold/60 bg-gold text-white hover:bg-gold-light",
  },
  closure: {
    label: "Geschlossen",
    container: "border-b border-white/20 bg-[#6f263d] text-white",
    badge: "border-white/35 bg-white/10 text-white",
    link: "border-white/40 bg-white text-[#6f263d] hover:bg-warm-white",
  },
};

function getSafeCtaUrl(value?: string | null) {
  if (!value) return null;

  const url = value.trim();
  if (!url || url.length > 2_048 || /[\u0000-\u001f\u007f]/.test(url)) {
    return null;
  }

  if (url.startsWith("#") || (url.startsWith("/") && !url.startsWith("//"))) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);
    return ["https:", "tel:", "mailto:"].includes(parsedUrl.protocol)
      ? url
      : null;
  } catch {
    return null;
  }
}

export default function AnnouncementBanner({
  announcement,
}: AnnouncementBannerProps) {
  if (!announcement?.enabled) return null;

  const title = announcement.title?.trim();
  const message = announcement.message.trim();
  if (!title && !message) return null;

  const styles = bannerStyles[announcement.kind] ?? bannerStyles.info;
  const ctaLabel = announcement.ctaLabel?.trim();
  const ctaUrl = ctaLabel ? getSafeCtaUrl(announcement.ctaUrl) : null;
  const opensNewWindow = ctaUrl?.startsWith("https://") ?? false;

  return (
    <aside
      aria-label="Aktuelle Mitteilung"
      className={`${styles.container} px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.12)] sm:px-6`}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:flex-wrap sm:gap-x-3">
        <span
          className={`${styles.badge} shrink-0 rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-semibold leading-5`}
        >
          {styles.label}
        </span>

        <p className="min-w-0 max-w-4xl break-words text-sm leading-5 sm:text-[0.9375rem]">
          {title ? <strong className="font-semibold">{title}</strong> : null}
          {title && message ? " — " : null}
          {message}
        </p>

        {ctaUrl ? (
          <a
            href={ctaUrl}
            className={`${styles.link} inline-flex min-h-9 max-w-full shrink-0 items-center justify-center rounded-full border px-4 py-1.5 text-center text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
            target={opensNewWindow ? "_blank" : undefined}
            rel={opensNewWindow ? "noopener noreferrer" : undefined}
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </aside>
  );
}
