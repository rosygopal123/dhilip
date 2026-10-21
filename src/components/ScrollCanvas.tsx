"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Configuration for frame scrubbing (Each video cleanly terminates at frame 192; frames 193-240 were unrelated filler)
const VIDEO_FRAMES = {
  1: 192,
  2: 192,
  3: 192
} as const;

const STEP = 2; // load every 2nd frame
const TOTAL_FRAMES = (VIDEO_FRAMES[1] / STEP) + (VIDEO_FRAMES[2] / STEP) + (VIDEO_FRAMES[3] / STEP); // 120 + 100 + 120 = 340

// Helper function to render a frame:
// - On Mobile: Draws blurred ambient background to fill viewport without black bars,
//   and cleanly centers the foreground 16:9 frame so the full building & architecture is 100% visible (zoomed out).
// - On Desktop: Full-bleed cinematic cover mode.
function renderFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);

  const imgWidth = img.naturalWidth || 1920;
  const imgHeight = img.naturalHeight || 1080;
  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = width / height;

  // Mobile portrait / tall viewport (aspect ratio < 0.95)
  if (canvasRatio < 0.95) {
    // 1. Draw blurred ambient background from the same image to eliminate blank voids
    ctx.save();
    if ("filter" in ctx) {
      ctx.filter = "blur(28px) brightness(0.6)";
    }
    const bgScale = Math.max(width / imgWidth, height / imgHeight);
    const bgW = imgWidth * bgScale;
    const bgH = imgHeight * bgScale;
    const bgX = (width - bgW) / 2;
    const bgY = (height - bgH) / 2;
    // Oversize slightly by 40px to eliminate any edge blur artifacts
    ctx.drawImage(img, bgX - 20, bgY - 20, bgW + 40, bgH + 40);
    ctx.restore();

    // 2. Subtle dark ambient scrim for high contrast and readability
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 3. Foreground building: Scaled by 1.36x so it is nicely zoomed in (matching ABC Builders reference) while staying perfectly centered
    const zoomScale = 1.36;
    const drawWidth = width * zoomScale;
    const drawHeight = drawWidth / imgRatio;
    const offsetX = Math.round((width - drawWidth) / 2);
    const offsetY = Math.round((height - drawHeight) / 2); // Exact vertical center!

    // Soft ambient drop-shadow behind sharp foreground image
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  } else {
    // Desktop / Landscape: Cinematic cover mode
    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }
}

export default function ScrollCanvas() {
  const { locale, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPreloadFinished, setIsPreloadFinished] = useState(false);
  
  // Track active section for progress dots
  const [activeStep, setActiveStep] = useState(0); // 0 = Design, 1 = Build, 2 = Dream
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 100

  // Preload Images with Progressive Loader and Anti-Hang Safety Timeout
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    const TARGET_CRITICAL_FRAMES = 24; // Fast launch: only need first 24 frames ready to start smoothly

    const handleSingleImageLoaded = () => {
      loadedCount++;
      const percent = Math.min(100, Math.round((loadedCount / TARGET_CRITICAL_FRAMES) * 100));
      setLoadingProgress(percent);

      if (loadedCount >= TARGET_CRITICAL_FRAMES) {
        setIsLoaded(true);
        setTimeout(() => setIsPreloadFinished(true), 400);
      }
    };

    // Safety timeout: Automatically unlock in max 2.2 seconds even on slow networks so it NEVER hangs!
    const safetyTimer = setTimeout(() => {
      setLoadingProgress(100);
      setIsLoaded(true);
      setTimeout(() => setIsPreloadFinished(true), 400);
    }, 2200);

    // Load first frame immediately for instant first paint
    const tempImg = new Image();
    tempImg.src = "/assets/video1/ezgif-frame-001.jpg";
    tempImg.onload = () => {
      handleSingleImageLoaded();
      // Pre-draw frame 0 immediately onto canvas so it is NEVER pitch black
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          renderFrameToCanvas(ctx, tempImg, canvas.width, canvas.height);
        }
      }
    };
    tempImg.onerror = handleSingleImageLoaded;

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
        img.onload = handleSingleImageLoaded;
        img.onerror = handleSingleImageLoaded;
        loadedImages.push(img);
      }
    }
    setImages(loadedImages);

    return () => clearTimeout(safetyTimer);
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

      renderFrameToCanvas(ctx, img, canvas.width, canvas.height);
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


      {/* Luxury Brand Preloader Screen (Counts 1 to 100%, Never Hangs) */}
      {!isPreloadFinished && (
        <div
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-600 ease-out select-none ${
            loadingProgress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Brand Logo & Name */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="font-display italic text-3xl md:text-5xl text-brand-leaf font-bold tracking-tight">
              Danam Holdings
            </span>
            <span className="font-ui text-[10px] md:text-xs text-white/60 tracking-widest uppercase">
              Towards Fortune Unfolding
            </span>
          </div>

          {/* Subtle Emerald / Gold Progress Line */}
          <div className="w-56 md:w-72 h-[1.5px] bg-white/10 relative overflow-hidden rounded-full">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-forest to-brand-leaf transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {/* Realtime Loading Percentage Counter */}
          <div className="mt-3 text-[11px] font-mono text-white/50 tracking-wider">
            LOADING {loadingProgress}%
          </div>
        </div>
      )}

      {/* Render Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      />

      {/* TEXT OVERLAYS - VIDEO 1 SEGMENT (0% to 33% scroll) */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-24 pb-16 sm:pb-20 md:pb-24 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none transition-opacity duration-300"
        style={{
          opacity: scrollProgress <= 30 ? (scrollProgress < 2 ? 0 : 1 - (scrollProgress - 20) / 10) : 0,
        }}
      >
        <div className="max-w-3xl flex flex-col gap-2">
          {/* Line 1 */}
          <span
            className="font-display italic text-brand-teak tracking-wider transition-all duration-500 text-xs sm:text-sm md:text-lg"
            style={{
              opacity: scrollProgress >= 2 ? 1 : 0,
              transform: `translateY(${scrollProgress >= 2 ? 0 : 10}px)`,
            }}
          >
            {t.hero.badge}
          </span>
          {/* Line 2 & 3 */}
          <h1
            className="font-display text-white text-3xl sm:text-5xl md:text-8xl leading-tight md:leading-none font-medium flex flex-col tracking-tight"
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
            className="font-ui text-xs sm:text-sm md:text-base text-white/70 mt-2 md:mt-4 leading-relaxed max-w-md line-clamp-2 sm:line-clamp-none"
            style={{
              opacity: scrollProgress >= 5 ? 1 : 0,
              transition: "opacity 0.5s ease 0.2s",
            }}
          >
            {t.hero.sub}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex items-center gap-3 sm:gap-4 mt-4 md:mt-8 pointer-events-auto"
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
        className="absolute inset-0 flex items-end md:items-center justify-end p-6 pb-24 md:p-24 pointer-events-none"
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
        className="absolute inset-0 flex flex-col items-center justify-end md:justify-center text-center p-6 pb-24 md:p-8 bg-black/40 pointer-events-none"
        style={{
          opacity: scrollProgress >= 82 ? (scrollProgress - 82) / 10 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="max-w-2xl flex flex-col gap-2">
          <span className="font-display italic text-4xl md:text-6xl text-night-glow">
            {t.hero.thisCouldBe}
          </span>
          <span className="font-display text-white text-3xl sm:text-5xl md:text-8xl tracking-tight leading-none uppercase font-semibold">
            {t.hero.yourHome}
          </span>
          <span className="font-ui text-xs text-night-glow/70 mt-6 tracking-widest uppercase">
            {t.hero.subText}
          </span>
        </div>
      </div>

      {/* Progress Dots Indicator (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex items-center gap-3 md:gap-4 z-20">
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
