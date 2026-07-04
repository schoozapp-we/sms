"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type TeacherCarouselItem = {
  id: string;
  name: string;
  department: string;
  subjects: string[];
  profileImageUrl: string;
  qualification: string;
  experience: string;
};

type TeacherCarouselProps = {
  teachers: TeacherCarouselItem[];
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function TeacherCarousel({ teachers }: TeacherCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [paused, setPaused] = useState(false);
  const carouselItems = useMemo(
    () => Array.from(new Map(teachers.map((teacher) => [teacher.id, teacher])).values()),
    [teachers]
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || teachers.length <= 1) return;

    let frame = 0;
    const tick = () => {
      if (!paused && !dragState.current.active) {
        scroller.scrollLeft += 0.45;
        const resetPoint = scroller.scrollWidth - scroller.clientWidth;
        if (resetPoint > 0 && scroller.scrollLeft >= resetPoint) {
          scroller.scrollLeft = 0;
        }
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [paused, teachers.length]);

  const scrollByCards = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft
    };
    setPaused(true);
    scroller.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || !dragState.current.active) return;
    event.preventDefault();
    const delta = event.clientX - dragState.current.startX;
    scroller.scrollLeft = dragState.current.scrollLeft - delta;
  };

  const endDrag = () => {
    dragState.current.active = false;
    window.setTimeout(() => setPaused(false), 900);
  };

  if (!teachers.length) {
    return <p className="emptyHint">Teachers will appear here after admin uploads faculty profiles.</p>;
  }

  return (
    <div className="teacherCarouselShell" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <button className="teacherCarouselNav prev" type="button" aria-label="Previous teachers" onClick={() => scrollByCards(-1)}>
        <ChevronLeft size={18} />
      </button>
      <div
        className="teacherCarousel"
        ref={scrollerRef}
        aria-label="Faculty carousel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="teacherCarouselTrack">
          {carouselItems.map((teacher) => (
            <article className="teacherSlideCard" key={teacher.id}>
              <div className="teacherSlideTop">
                <div className="teacherSlideImage">
                  {teacher.profileImageUrl ? (
                    <Image src={teacher.profileImageUrl} alt={teacher.name} fill sizes="180px" />
                  ) : (
                    <span>{initials(teacher.name)}</span>
                  )}
                </div>
                <span className="teacherBadge">{teacher.experience || "Faculty"}</span>
              </div>
              <strong>{teacher.name}</strong>
              <span>{teacher.subjects.join(", ") || teacher.department || "Faculty"}</span>
              <small>{teacher.qualification || "Profile managed by school admin"}</small>
            </article>
          ))}
        </div>
      </div>
      <button className="teacherCarouselNav next" type="button" aria-label="Next teachers" onClick={() => scrollByCards(1)}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
