import AnnouncementBanner, {
  type Announcement,
} from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";

interface SiteHeaderProps {
  announcement?: Announcement | null;
}

export default function SiteHeader({ announcement }: SiteHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <AnnouncementBanner announcement={announcement} />
      <Navbar />
    </header>
  );
}
