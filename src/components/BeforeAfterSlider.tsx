"use client";
import React, { useState } from "react";

interface BeforeAfterSliderProps {
  beforeImg: string;
  afterImg: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImg,
  afterImg,
  beforeLabel = "Structure",
  afterLabel = "Completed",
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative aspect-video w-full overflow-hidden select-none bg-surface-2 border border-brand-teak/20">
      {/* Before Image (Background) */}
      <img
        src={beforeImg}
        alt="Before construction structure"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <div className="absolute top-4 left-4 bg-brand-charcoal text-white font-mono text-[9px] px-2 py-0.5 uppercase tracking-widest z-10">
        {beforeLabel}
      </div>

      {/* After Image (Overlay with clipping) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
      >
        <img
          src={afterImg}
          alt="After finished building"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute top-4 right-4 bg-brand-teak text-white font-mono text-[9px] px-2 py-0.5 uppercase tracking-widest z-10 whitespace-nowrap">
          {afterLabel}
        </div>
      </div>

      {/* Vertical Slider Divider line */}
      <div
        className="absolute inset-y-0 w-[2px] bg-brand-teak pointer-events-none z-10"
        style={{ left: `${sliderPos}%` }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-brand-teak text-white rounded-full flex items-center justify-center shadow-lg border border-white/20 text-xs font-bold">
          ↔
        </div>
      </div>

      {/* Invisible range input for drag interaction */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        aria-label="Before after comparison slider"
      />
    </div>
  );
}
