"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(
        [
          ".sectionIntro p",
          ".sectionHead p",
          ".homeSectionCenter p",
          ".sectionIntro h2",
          ".sectionHead h2",
          ".homeSectionCenter h2",
          ".sectionIntro > span",
          ".homeSectionCenter > span",
          ".systemServiceList > div",
          ".programGrid article",
          ".facilityGrid article",
          ".newsPanel",
          ".achievementPanel",
          ".galleryGrid article",
          ".teacherShowcaseCard",
          ".downloadPanel",
          ".featureListPanel",
          ".portalMiniCard",
          ".contactSection",
          ".footerGrid > section"
        ].join(",")
      )
    );
    if (!items.length) return;
    items.forEach((item) => item.classList.add("revealItem"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("isVisible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return null;
}
