"use client";
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutTimeline() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollSection = scrollSectionRef.current;
    const container = containerRef.current;
    if (!scrollSection || !container) return;

    // Calculate total width to scroll
    const getScrollAmount = () => {
      return scrollSection.scrollWidth - window.innerWidth;
    };

    const anim = gsap.to(scrollSection, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        id: "about-timeline-trigger",
        trigger: container,
        start: "top top",
        end: () => `+=${scrollSection.scrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      anim.kill();
      const trigger = ScrollTrigger.getById("about-timeline-trigger");
      if (trigger) trigger.kill();
    };
  }, []);

  const milestones = [
    { year: "2013", img: "/assets/video1/ezgif-frame-001.jpg" },
    { year: "2015", img: "/assets/video1/ezgif-frame-060.jpg" },
    { year: "2018", img: "/assets/video1/ezgif-frame-120.jpg" },
    { year: "2020", img: "/assets/video1/ezgif-frame-180.jpg" },
    { year: "2022", img: "/assets/video2/ezgif-frame-040.jpg" },
    { year: "2024", img: "/assets/video2/ezgif-frame-120.jpg" },
    { year: "2025", img: "/assets/video2/ezgif-frame-240.jpg" },
    { year: "2026", img: "/assets/video3/ezgif-frame-240.jpg" },
  ];

  return (
    <div ref={containerRef} className="bg-surface-0 border-t border-b border-border-subtle overflow-hidden">
      <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto">
        <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
          History
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-text-primary">
          {t.about.timelineTitle}
        </h2>
      </div>

      <div className="h-[75vh] flex items-center relative">
        <div
          ref={scrollSectionRef}
          className="flex gap-8 px-6 md:px-12 py-12 absolute left-0 flex-nowrap"
          style={{ width: "max-content" }}
        >
          {milestones.map((m, idx) => {
            const milestoneData = t.about.timeline.find((item) => item.year === m.year) || t.about.timeline[idx % t.about.timeline.length];
            const isEven = idx % 2 === 0;

            return (
              <div
                key={m.year}
                className={`w-[280px] md:w-[360px] flex flex-col p-6 border border-brand-teak/20 select-none ${
                  isEven ? "bg-[var(--bp-paper)] text-[var(--bp-ink)]" : "bg-surface-0 text-text-primary"
                }`}
              >
                {/* Milestone Image */}
                <div className="aspect-video w-full overflow-hidden mb-4 bg-surface-2 border border-brand-teak/10">
                  <img
                    src={m.img}
                    alt={milestoneData?.title || m.year}
                    className="w-full h-full object-cover grayscale-30 hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                {/* Year Badge */}
                <span className="font-display text-3xl font-bold text-brand-teak mb-2 block">
                  {m.year}
                </span>
                <h4 className="font-display text-lg font-semibold tracking-tight mb-2">
                  {milestoneData?.title}
                </h4>
                <p className="font-ui text-xs leading-relaxed opacity-85">
                  {milestoneData?.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
