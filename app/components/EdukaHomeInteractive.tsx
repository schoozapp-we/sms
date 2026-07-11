"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Share2, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type HeroSlide = {
  eyebrow: string;
  titleStart: string;
  titleAccent: string;
  titleEnd: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  imageSrc: string;
  imagePosition: string;
  imageTone: string;
};

type TeacherItem = {
  id: string;
  name: string;
  department?: string;
  subjects?: string[];
  profileImageUrl?: string;
};

const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Welcome to Eduka!",
    titleStart: "Start Your Beautiful",
    titleAccent: "Bright",
    titleEnd: "Future",
    body: "A modern school experience with admissions, academics, notices, fees, results and parent communication in one place.",
    primaryLabel: "About More",
    primaryHref: "/about",
    secondaryLabel: "Learn More",
    secondaryHref: "/academics",
    imageSrc: "/images/eduka-hero-1.jpg",
    imagePosition: "54% center",
    imageTone: "saturate(1.05) contrast(1.03)"
  },
  {
    eyebrow: "Admissions Open",
    titleStart: "Build Smart Learning",
    titleAccent: "Digital",
    titleEnd: "Campus",
    body: "Online admission, prospectus, downloads and secure portals for students, parents, teachers and admin teams.",
    primaryLabel: "Apply Now",
    primaryHref: "/admission",
    secondaryLabel: "Portal Login",
    secondaryHref: "/portal-login",
    imageSrc: "/images/eduka-hero-2.jpg",
    imagePosition: "78% center",
    imageTone: "saturate(1.18) hue-rotate(8deg) contrast(1.06)"
  },
  {
    eyebrow: "Expert Faculty",
    titleStart: "Learn With Skilled",
    titleAccent: "Teachers",
    titleEnd: "Daily",
    body: "Structured curriculum, activities, academic calendar, progress reviews and regular school-home updates.",
    primaryLabel: "Our Teachers",
    primaryHref: "/academics",
    secondaryLabel: "Contact Us",
    secondaryHref: "/contact",
    imageSrc: "/images/eduka-hero-3.jpg",
    imagePosition: "22% center",
    imageTone: "saturate(0.95) sepia(0.12) contrast(1.08)"
  }
];

export function EdukaHeroCarousel() {
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % heroSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  const go = (direction: -1 | 1) => {
    setActive((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="edukaHero edukaHeroCarousel">
      <Image
        key={`hero-image-${active}`}
        src={slide.imageSrc}
        alt="Students walking through a bright campus"
        fill
        priority
        sizes="100vw"
        className="edukaHeroImage"
        style={{ objectPosition: slide.imagePosition, filter: slide.imageTone }}
      />
      <div className="edukaHeroShade" />
      <div className="edukaHeroPattern" aria-hidden="true" />
      <button className="heroCarouselArrow heroCarouselPrev" type="button" aria-label="Previous slide" onClick={() => go(-1)}>
        <ChevronLeft size={28} />
      </button>
      <button className="heroCarouselArrow heroCarouselNext" type="button" aria-label="Next slide" onClick={() => go(1)}>
        <ChevronRight size={28} />
      </button>

      <div className="edukaHeroInner" key={`hero-copy-${active}`}>
        <article className="edukaHeroCopy">
          <span className="edukaEyebrow"><Star size={15} /> {slide.eyebrow}</span>
          <h1>
            <span>{slide.titleStart}</span>
            <span>And <mark>{slide.titleAccent}</mark> {slide.titleEnd}</span>
          </h1>
          <p>{slide.body}</p>
          <div className="edukaHeroActions">
            <Link href={slide.primaryHref} className="heroPrimaryLink">
              {slide.primaryLabel} <ChevronRight size={17} />
            </Link>
            <Link href={slide.secondaryHref} className="heroSecondaryLink">
              {slide.secondaryLabel} <ChevronRight size={17} />
            </Link>
          </div>
          <div className="heroSlideDots" aria-label="Hero slides">
            {heroSlides.map((item, index) => (
              <button
                key={item.eyebrow}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                className={index === active ? "active" : ""}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export function EdukaTeacherSlider({ teachers }: Readonly<{ teachers: TeacherItem[] }>) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const items = useMemo(() => teachers.slice(0, 8), [teachers]);

  const scrollByCard = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>(".teacherShowcaseCard");
    scroller.scrollBy({ left: direction * ((card?.offsetWidth || 280) + 26), behavior: "smooth" });
  };

  if (!items.length) {
    return <p className="emptyHint">Teachers will appear here after admin uploads faculty profiles.</p>;
  }

  return (
    <div className="teacherSliderShell">
      <button type="button" className="teacherSliderNav teacherSliderPrev" aria-label="Previous teachers" onClick={() => scrollByCard(-1)}>
        <ChevronLeft size={20} />
      </button>
      <div className="teacherShowcaseGrid" ref={scrollerRef} aria-label="Teacher slider">
        {items.map((teacher, index) => (
          <article className="teacherShowcaseCard" key={`${teacher.id || teacher.name}-${index}`}>
            <div className="teacherShowcaseImage">
              <Image
                src={teacher.profileImageUrl || "/images/school-portal-hero.png"}
                alt={teacher.name}
                fill
                sizes="(max-width: 700px) 82vw, 280px"
                style={{ objectPosition: `${35 + (index % 4) * 14}% center` }}
              />
            </div>
            <button type="button" aria-label={`Share ${teacher.name}`}>
              <Share2 size={18} />
            </button>
            <strong>{teacher.name}</strong>
            <span>{teacher.subjects?.join(", ") || teacher.department || "Associate Professor"}</span>
          </article>
        ))}
      </div>
      <button type="button" className="teacherSliderNav teacherSliderNext" aria-label="Next teachers" onClick={() => scrollByCard(1)}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
