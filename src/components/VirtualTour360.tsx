"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Rotate3D,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Sun,
  Moon,
  Eye,
  CheckCircle2,
  X
} from "lucide-react";

interface Hotspot {
  id: string;
  frameIndex: number;
  xPercent: number;
  yPercent: number;
  title: string;
  category: string;
  desc: string;
  specs: string[];
}

export default function VirtualTour360() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Tour state
  const [activeTab, setActiveTab] = useState<"exterior" | "skeleton" | "night">("exterior");
  const [frameIndex, setFrameIndex] = useState<number>(30); // 0 to 119
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const TOTAL_FRAMES = 120; // 120 frames sampled at step 2

  // Cached Image elements
  const imagesRef = useRef<{ [key: string]: HTMLImageElement[] }>({
    exterior: [],
    skeleton: [],
    night: []
  });

  // Hotspots definition for architectural features
  const hotspots: Hotspot[] = [
    {
      id: "teak-facade",
      frameIndex: 25,
      xPercent: 48,
      yPercent: 42,
      title: "Burma Teak Wood Slats",
      category: "Exterior Facade",
      desc: "Seasoned Burma teak louvers designed for natural ventilation, heat reduction, and a modern tropical elevation.",
      specs: ["UV Moisture Coating", "15-Year Weather Warranty", "Termite Treated"]
    },
    {
      id: "rcc-columns",
      frameIndex: 55,
      xPercent: 52,
      yPercent: 55,
      title: "Heavy RCC Framework",
      category: "Structural Core",
      desc: "M25 grade ready-mix concrete poured around FE550D TMT steel bars for seismic earthquake resistance.",
      specs: ["Fe550D Certified Steel", "M25 RMC Grade", "Curing Log Audited"]
    },
    {
      id: "vastu-kitchen",
      frameIndex: 85,
      xPercent: 62,
      yPercent: 50,
      title: "Vastu South-East Zone",
      category: "Vastu Architecture",
      desc: "Agni corner kitchen placement optimizing natural morning daylight and traditional airflow principles.",
      specs: ["100% Vastu Compliant", "Granite Countertops", "Exhaust Ducting Included"]
    },
    {
      id: "glass-glaze",
      frameIndex: 105,
      xPercent: 38,
      yPercent: 38,
      title: "Thermal Double Glazing",
      category: "Energy Efficiency",
      desc: "Acoustically insulated UPVC double glass windows that reduce ambient road noise by 35dB.",
      specs: ["35dB Noise Cutoff", "Toughened Safety Glass", "German UPVC Profiles"]
    }
  ];

  // Preload frames for active tabs
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    const loadImagesForFolder = (folderName: string, targetArray: HTMLImageElement[]) => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const actualFrameNum = i * 2 + 1;
        const paddedNum = actualFrameNum.toString().padStart(3, "0");
        const img = new Image();
        img.src = `/assets/${folderName}/ezgif-frame-${paddedNum}.jpg`;

        const onFinish = () => {
          if (isCancelled) return;
          loadedCount++;
          if (loadedCount >= 30) {
            setImagesLoaded(true);
          }
        };

        img.onload = onFinish;
        img.onerror = onFinish;
        targetArray.push(img);
      }
    };

    if (imagesRef.current.exterior.length === 0) {
      loadImagesForFolder("video2", imagesRef.current.exterior);
      loadImagesForFolder("video1", imagesRef.current.skeleton);
      loadImagesForFolder("video3", imagesRef.current.night);
    } else {
      setImagesLoaded(true);
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  // Canvas render frame
  const drawFrame = React.useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const folderKey = activeTab;
    const frameList = imagesRef.current[folderKey];
    const safeIdx = Math.min(Math.max(0, frameIdx % TOTAL_FRAMES), TOTAL_FRAMES - 1);
    
    let img = frameList[safeIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = frameList.find((im) => im && im.complete && im.naturalWidth > 0) || frameList[0];
    }

    if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;

    canvas.width = canvas.clientWidth || 800;
    canvas.height = canvas.clientHeight || 500;

    const imgW = img.naturalWidth || 960;
    const imgH = img.naturalHeight || 540;
    const canvasW = canvas.width;
    const canvasH = canvas.height;

    const imgRatio = imgW / imgH;
    const canvasRatio = canvasW / canvasH;

    let drawW = canvasW;
    let drawH = canvasH;
    let offX = 0;
    let offY = 0;

    if (canvasRatio > imgRatio) {
      drawH = canvasW / imgRatio;
      offY = (canvasH - drawH) / 2;
    } else {
      drawW = canvasH * imgRatio;
      offX = (canvasW - drawW) / 2;
    }

    try {
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.drawImage(img, offX, offY, drawW, drawH);
    } catch (e) {
      // Safe guard against broken image frames
    }
  }, [activeTab]);

  // Re-draw canvas on frame or tab change
  useEffect(() => {
    drawFrame(frameIndex);
  }, [frameIndex, drawFrame, imagesLoaded]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => drawFrame(frameIndex);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [frameIndex, drawFrame]);

  // Auto Rotation loop
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % TOTAL_FRAMES);
    }, 70);
    return () => clearInterval(timer);
  }, [autoRotate, isDragging]);

  // Mouse & Touch Drag Handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    if (Math.abs(deltaX) > 5) {
      const stepSensitivity = 3;
      const frameDelta = Math.floor(deltaX / stepSensitivity);
      if (frameDelta !== 0) {
        setFrameIndex((prev) => {
          let next = (prev - frameDelta) % TOTAL_FRAMES;
          if (next < 0) next += TOTAL_FRAMES;
          return next;
        });
        setStartX(clientX);
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  // Active hotspots near current frame index
  const visibleHotspots = hotspots.filter((hs) => {
    const dist = Math.abs(hs.frameIndex - frameIndex);
    return dist <= 12 || dist >= TOTAL_FRAMES - 12;
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-surface-0 border border-brand-teak/30 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 select-none ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "my-8"
      }`}
    >
      {/* Top Header Bar */}
      <div className="bg-surface-2 border-b border-border-subtle p-4 md:px-8 flex flex-wrap justify-between items-center gap-4">
        {/* Title Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-teak/10 rounded-lg text-brand-teak border border-brand-teak/20">
            <Rotate3D className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-brand-teak tracking-widest uppercase font-bold">
                INTERACTIVE 360° TOUR
              </span>
              <span className="bg-brand-teak text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                USP
              </span>
            </div>
            <h3 className="font-display text-lg md:text-xl font-semibold text-text-primary">
              Pre-Construction 360° Architectural Experience
            </h3>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center bg-surface-1 p-1 rounded-xl border border-border-subtle text-xs font-ui">
          <button
            onClick={() => setActiveTab("exterior")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "exterior"
                ? "bg-brand-teak text-white shadow-md"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Exterior 360°</span>
          </button>

          <button
            onClick={() => setActiveTab("skeleton")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "skeleton"
                ? "bg-brand-teak text-white shadow-md"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Structure 360°</span>
          </button>

          <button
            onClick={() => setActiveTab("night")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "night"
                ? "bg-brand-teak text-white shadow-md"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Night Glow 360°</span>
          </button>
        </div>
      </div>

      {/* Main Canvas 360 Container */}
      <div
        className="relative w-full h-[400px] md:h-[550px] bg-black cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {/* Render Canvas */}
        <canvas ref={canvasRef} className="w-full h-full object-cover" />

        {/* Drag Direction Prompt Overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none bg-black/60 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-xs font-mono flex items-center gap-2 tracking-wider uppercase animate-pulse">
          <Rotate3D className="w-4 h-4 text-brand-teak" />
          <span>Drag Left/Right to Rotate 360°</span>
        </div>

        {/* Floating Hotspots on 360 Frame */}
        {visibleHotspots.map((hs) => (
          <div
            key={hs.id}
            style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHotspot(hs);
              }}
              className="relative group flex items-center justify-center cursor-pointer"
            >
              <span className="absolute w-8 h-8 rounded-full bg-brand-teak/40 animate-ping" />
              <span className="w-6 h-6 rounded-full bg-brand-teak border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg group-hover:scale-125 transition-transform">
                +
              </span>
              {/* Tooltip Tag */}
              <span className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white font-ui text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity border border-white/20">
                {hs.title}
              </span>
            </button>
          </div>
        ))}

        {/* Bottom Floating Control Panel */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-between items-center gap-4 pointer-events-auto bg-black/70 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
          {/* Angle Degree Indicator */}
          <div className="flex items-center gap-3 text-white font-mono text-xs">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Eye className="w-3.5 h-3.5 text-brand-teak" />
              <span>{Math.round((frameIndex / TOTAL_FRAMES) * 360)}° VIEW</span>
            </div>
            <span className="hidden sm:inline text-white/50 text-[11px]">
              240-Degree Orbital Scrubbing
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Auto-rotate Toggle */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-ui transition-colors ${
                autoRotate
                  ? "bg-brand-teak text-white"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
              }`}
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoRotate ? "Pause Auto-360" : "Auto Rotate"}</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/15 transition-colors"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Selected Hotspot Detail Drawer Modal */}
      {selectedHotspot && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md p-6 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-surface-0 border border-brand-teak/40 rounded-2xl max-w-lg w-full p-6 text-left relative shadow-2xl">
            <button
              onClick={() => setSelectedHotspot(null)}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-teak" />
              <span className="font-mono text-[10px] uppercase text-brand-teak tracking-widest font-semibold">
                {selectedHotspot.category}
              </span>
            </div>

            <h4 className="font-display text-2xl font-bold text-text-primary mb-3">
              {selectedHotspot.title}
            </h4>

            <p className="font-ui text-xs md:text-sm text-text-secondary leading-relaxed mb-6">
              {selectedHotspot.desc}
            </p>

            <div className="border-t border-border-subtle pt-4 mb-6">
              <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider mb-3 block">
                Architectural Specifications:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedHotspot.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-surface-1 border border-border-subtle px-3 py-1.5 rounded-lg text-xs font-ui text-text-primary"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-teak" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={`https://wa.me/918110006913?text=Hi%20Danam%20Holdings%2C%20I'm%20interested%20in%20learning%20more%20about%20the%20${encodeURIComponent(selectedHotspot.title)}%20specification.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-forest hover:bg-brand-forest-dark text-white w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 font-mono"
            >
              <span>Enquire About This Feature</span>
            </a>
          </div>
        </div>
      )}

      {/* Bottom VR Consultation Footer Banner */}
      <div className="bg-surface-1 border-t border-border-subtle p-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-left">
          <h4 className="font-display text-base font-semibold text-text-primary">
            Want a 3D Walkaround Consultation at our Madurai Office?
          </h4>
          <p className="font-ui text-xs text-text-secondary">
            Step inside your future project before the foundation is even excavated. Zero cost 3D consultation.
          </p>
        </div>

        <a
          href="https://wa.me/918110006913?text=Hi%20Danam%20Holdings%2C%20I%20want%20to%20book%20a%203D%20Walkthrough%20Session%20at%20your%20Madurai%20office."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-forest hover:bg-brand-forest-dark text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all duration-300 shrink-0 font-mono"
        >
          Book 3D Walkthrough
        </a>
      </div>
    </div>
  );
}
