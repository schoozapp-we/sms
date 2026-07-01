import Link from "next/link";
import { Bell, BriefcaseBusiness, FileText } from "lucide-react";
import { schoolProfile } from "../data/schoolSite";

export function PublicFooter() {
  return (
    <footer className="portalFooter">
      <div>
        <strong>{schoolProfile.name}</strong>
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
