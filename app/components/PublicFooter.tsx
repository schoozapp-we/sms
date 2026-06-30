import Link from "next/link";
import { Bell, BriefcaseBusiness, FileText } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="portalFooter">
      <div>
        <strong>Bright Future Senior Secondary School</strong>
        <span>Home | About | Academics | Admission | Facilities | Gallery | Contact</span>
      </div>
      <div className="portalFooterActions">
        <Link href="/admin/login">
          <BriefcaseBusiness size={14} /> Admin Panel
        </Link>
        <Link href="/admission">
          <Bell size={14} /> Admission Updates
        </Link>
        <Link href="/academics">
          <FileText size={14} /> Academic Plan
        </Link>
      </div>
    </footer>
  );
}
