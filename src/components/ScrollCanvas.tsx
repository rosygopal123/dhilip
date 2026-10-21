"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Configuration for frame scrubbing
const VIDEO_FRAMES = {
  1: 240,
  2: 200,
  3: 240
} as const;

const STEP = 2; // load every 2nd frame
const TOTAL_FRAMES = (VIDEO_FRAMES[1] / STEP) + (VIDEO_FRAMES[2] / STEP) + (VIDEO_FRAMES[3] / STEP); // 120 + 100 + 120 = 340

export default function ScrollCanvas() {
  const { locale, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Track active section for progress dots
  const [activeStep, setActiveStep] = useState(0); // 0 = Design, 1 = Build, 2 = Dream
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 100

  // Preload Images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];

    // Load first frame immediately for LCP and set loaded state to trigger ScrollTrigger setup
    const tempImg = new Image();
    tempImg.src = "/assets/video1/ezgif-frame-001.jpg";
    tempImg.onload = () => {
      setIsLoaded(true);
    };
    tempImg.onerror = () => {
      setIsLoaded(true);
    };

    // Populate arrays dynamically based on video lengths
    for (let v = 1; v <= 3; v++) {
      const framesCount = VIDEO_FRAMES[v as 1 | 2 | 3];
      const subsetSize = framesCount / STEP;
      for (let i = 0; i < subsetSize; i++) {
        const actualFrameNum = i * STEP + 1;
        const paddedNum = actualFrameNum.toString().padStart(3, "0");
        const url = `/assets/video${v}/ezgif-frame-${paddedNum}.jpg`;
        const img = new Image();
        img.src = url;
        loadedImages.push(img);
      }
    }
    setImages(loadedImages);
  }, []);

  // Canvas Drawing & ScrollTrigger Sync
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // GSAP ScrollTrigger timeline configuration
    const scrollIndexObj = { frame: 0 };

    // Handle canvas sizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(scrollIndexObj.frame);
    };

    const drawFrame = (index: number) => {
      const idx = Math.min(Math.max(0, Math.floor(index)), TOTAL_FRAMES - 1);
      let img = images[idx];
      if (!img || !img.complete) {
        // Fallback to closest loaded image to avoid flicker
        let found = false;
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prevIdx = idx - offset;
          const nextIdx = idx + offset;
          if (prevIdx >= 0 && images[prevIdx] && images[prevIdx].complete) {
            img = images[prevIdx];
            found = true;
            break;
          }
          if (nextIdx < TOTAL_FRAMES && images[nextIdx] && images[nextIdx].complete) {
            img = images[nextIdx];
            found = true;
            break;
          }
        }
        if (!found) return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cover scaling
      const imgWidth = img.naturalWidth || 1920;
      const imgHeight = img.naturalHeight || 1080;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Timeline to scrub frames
    const timeline = gsap.timeline({
      scrollTrigger: {
        id: "hero-scroll-canvas-trigger",
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1.2, // lag coefficient for cinematic feel
        onUpdate: (self) => {
          setScrollProgress(self.progress * 100);
          if (self.progress < 0.33) {
            setActiveStep(0);
          } else if (self.progress < 0.66) {
            setActiveStep(1);
          } else {
            setActiveStep(2);
          }
        },
      },
    });

    // Scrub frames
    timeline.to(scrollIndexObj, {
      frame: TOTAL_FRAMES - 1,
      ease: "none",
      onUpdate: () => {
        drawFrame(scrollIndexObj.frame);
      },
    });

    // Trigger update on page load/mount
    drawFrame(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      timeline.kill();
      const trigger = ScrollTrigger.getById("hero-scroll-canvas-trigger");
      if (trigger) trigger.kill();
    };
  }, [isLoaded, images]);

  // Handle dot click transitions
  const scrollToPercent = (percent: number) => {
    const scrollPos = window.innerHeight * 3 * percent;
    window.scrollTo({
      top: scrollPos,
      behavior: "smooth"
    });
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden select-none">


      {/* Render Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      />

      {/* TEXT OVERLAYS - VIDEO 1 SEGMENT (0% to 33% scroll) */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-8 md:p-24 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none transition-opacity duration-300"
        style={{
          opacity: scrollProgress <= 30 ? (scrollProgress < 2 ? 0 : 1 - (scrollProgress - 20) / 10) : 0,
        }}
      >
        <div className="max-w-3xl flex flex-col gap-2">
          {/* Line 1 */}
          <span
            className="font-display italic text-brand-teak tracking-wider transition-all duration-500 text-sm md:text-lg"
            style={{
              opacity: scrollProgress >= 2 ? 1 : 0,
              transform: `translateY(${scrollProgress >= 2 ? 0 : 10}px)`,
            }}
          >
            {t.hero.badge}
          </span>
          {/* Line 2 & 3 */}
          <h1
            className="font-display text-white text-5xl md:text-8xl leading-none font-medium flex flex-col tracking-tight"
            style={{
              opacity: scrollProgress >= 3 ? 1 : 0,
              transform: `scale(${scrollProgress >= 3 ? 1 : 0.96})`,
              transition: "transform 0.5s ease, opacity 0.5s ease",
            }}
          >
            <span>{t.hero.line2}</span>
            <span className="italic font-light text-white/90">{t.hero.line3}</span>
          </h1>
          {/* Line 4 */}
          <p
            className="font-ui text-sm md:text-base text-white/70 mt-4 leading-relaxed max-w-md"
            style={{
              opacity: scrollProgress >= 5 ? 1 : 0,
              transition: "opacity 0.5s ease 0.2s",
            }}
          >
            {t.hero.sub}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex items-center gap-4 mt-8 pointer-events-auto"
            style={{
              opacity: scrollProgress >= 8 ? 1 : 0,
              transition: "opacity 0.5s ease 0.4s",
            }}
          >
            <Link
              href={`/${locale}/projects`}
              className="bg-brand-teak hover:bg-brand-teal text-text-primary font-semibold px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              {t.hero.ctaProjects}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="border border-white hover:bg-white hover:text-black text-white font-semibold px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              {t.hero.ctaEstimate}
            </Link>
          </div>
        </div>
      </div>

      {/* Blueprint Grid Faint Overlay (0 to 8% scroll) */}
      <div
        className="absolute inset-0 blueprint-grid pointer-events-none transition-opacity duration-300"
        style={{
          opacity: scrollProgress >= 2 && scrollProgress <= 8 ? (8 - scrollProgress) * 0.01 : 0,
        }}
      />

      {/* TEXT OVERLAYS - VIDEO 2 SEGMENT (33% to 66% scroll) */}
      <div
        className="absolute inset-0 flex items-center justify-end p-8 md:p-24 pointer-events-none"
        style={{
          opacity: scrollProgress >= 48 && scrollProgress <= 60 ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div className="text-right max-w-md">
          <span className="font-display italic text-2xl md:text-4xl text-white/90">
            {t.hero.everyDetail}
          </span>
        </div>
      </div>

      {/* TEXT OVERLAYS - VIDEO 3 SEGMENT (66% to 100% scroll) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/30 pointer-events-none"
        style={{
          opacity: scrollProgress >= 82 ? (scrollProgress - 82) / 10 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="max-w-2xl flex flex-col gap-2">
          <span className="font-display italic text-4xl md:text-6xl text-night-glow">
            {t.hero.thisCouldBe}
          </span>
          <span className="font-display text-white text-5xl md:text-8xl tracking-tight leading-none uppercase font-semibold">
            {t.hero.yourHome}
          </span>
          <span className="font-ui text-xs text-night-glow/70 mt-6 tracking-widest uppercase">
            {t.hero.subText}
          </span>
        </div>
      </div>

      {/* Progress Dots Indicator (Bottom-Right) */}
      <div className="absolute bottom-10 right-10 flex items-center gap-4 z-20">
        {[
          { name: t.hero.design, percent: 0.15 },
          { name: t.hero.build, percent: 0.5 },
          { name: t.hero.dream, percent: 0.9 },
        ].map((step, idx) => (
          <button
            key={step.name}
            onClick={() => scrollToPercent(step.percent)}
            className="flex flex-col items-end gap-1 group cursor-pointer"
          >
            <span
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                activeStep === idx
                  ? "bg-brand-teak border-transparent scale-125"
                  : "border-white/50 bg-transparent group-hover:bg-white/30"
              }`}
            />
            <span
              className={`font-ui text-[9px] uppercase tracking-widest transition-opacity duration-300 ${
                activeStep === idx ? "opacity-100 text-brand-teak" : "opacity-0 group-hover:opacity-75 text-white"
              }`}
            >
              {step.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
