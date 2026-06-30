import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const socials = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook, className: "socialFacebook" },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram, className: "socialInstagram" },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube, className: "socialYoutube" },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter, className: "socialTwitter" }
];

export function SocialRail() {
  return (
    <aside className="socialRail" aria-label="Social media links">
      {socials.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href={item.href}
            className={item.className}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
          >
            <Icon size={18} />
          </a>
        );
      })}
    </aside>
  );
}
