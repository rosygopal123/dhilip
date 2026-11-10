"use client";
import React, { useState } from "react";
import {
  Calculator,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Home,
  Layers,
  MapPin,
  TrendingDown,
  Info
} from "lucide-react";

export default function ConstructionCostCalculator() {
  const [plotArea, setPlotArea] = useState<number>(1500);
  const [floors, setFloors] = useState<number>(2); // 1 = G, 2 = G+1, 3 = G+2
  const [constructionType, setConstructionType] = useState<"standard" | "premium" | "luxury">("premium");
  const [district, setDistrict] = useState<string>("Madurai");

  // Per sq.ft base rates (Transparent Madurai / TN civil benchmark)
  const ratesPerSqFt = {
    standard: {
      rate: 2150,
      label: "Standard Quality",
      desc: "IS-456 compliant RCC, Fe550D TMT, Coromandel/Ultratech, Kajaria 2x2 vitrified tiles, basic teakwood main door."
    },
    premium: {
      rate: 2550,
      label: "Premium Engineered (Most Popular)",
      desc: "M25 concrete mix, TATA Tiscon 550D, UPVC 35dB acoustic glass, 4x2 GVT vitrified slabs, Kohler/Jaquar fittings, 100% Vastu."
    },
    luxury: {
      rate: 3100,
      label: "Luxury Architectural",
      desc: "Double-height elevation, Saint-Gobain facade glazing, Italian marble / Statuario, Burma teakwood woodwork, smart home & solar conduit."
    }
  };

  const totalBuiltUpArea = Math.round(plotArea * (floors === 1 ? 0.85 : floors === 2 ? 1.7 : 2.4));
  const ratePerSqFt = ratesPerSqFt[constructionType].rate;
  const estimatedCost = Math.round(totalBuiltUpArea * ratePerSqFt);
  const durationMonths = floors === 1 ? 5 : floors === 2 ? 6.5 : 8.5;

  const formatLakhsCrores = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  };

  const handleWhatsAppQuote = () => {
    const text = encodeURIComponent(
      `Hi Danam Holdings, I just calculated an instant estimate on your website:
- Location: ${district}
- Plot Size: ${plotArea} Sq.Ft (${floors === 1 ? "Ground Only" : floors === 2 ? "G+1" : "G+2"})
- Total Built-Up Area: ~${totalBuiltUpArea.toLocaleString()} Sq.Ft
- Package: ${ratesPerSqFt[constructionType].label} (@ ₹${ratePerSqFt}/Sq.Ft)
- Estimated Budget: ${formatLakhsCrores(estimatedCost)}

Please share the itemized BOQ breakdown and schedule a free plot consultation.`
    );
    window.open(`https://wa.me/918883332499?text=${text}`, "_blank");
  };

  const handleOpenLeadModal = () => {
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  return (
    <section id="cost-calculator" className="py-20 bg-surface-0 border-y border-border-subtle relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-brand-forest/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Construction Cost Calculator (Madurai & TN)</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
            Know Your Construction Cost in 30 Seconds
          </h2>
          <p className="font-ui text-xs sm:text-sm text-text-secondary mt-2.5 max-w-xl mx-auto leading-relaxed">
            Zero hidden costs. Select your plot dimensions and floor plan to see realistic construction cost estimates based on genuine IS-456 market rates.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-surface-1 border border-border-medium rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            
            {/* Input 1: Plot Size Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-ui text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                  <span>1. Plot / Land Size</span>
                </label>
                <span className="font-mono text-base sm:text-lg font-bold text-brand-forest bg-surface-0 border border-border-subtle px-3 py-1 rounded-xl shadow-xs">
                  {plotArea.toLocaleString()} <span className="text-xs font-normal text-text-tertiary">Sq.Ft</span>
                </span>
              </div>
              <input
                type="range"
                min="600"
                max="5000"
                step="50"
                value={plotArea}
                onChange={(e) => setPlotArea(Number(e.target.value))}
                className="w-full h-2.5 bg-border-medium rounded-lg appearance-none cursor-pointer accent-brand-forest transition-all"
              />
              <div className="flex justify-between text-[11px] font-mono text-text-tertiary mt-1.5">
                <span>600 Sq.Ft (Tiny/Town)</span>
                <span>1,500 Sq.Ft (Standard Villa)</span>
                <span>5,000 Sq.Ft (Estate)</span>
              </div>
            </div>

            {/* Input 2: Number of Floors */}
            <div>
              <label className="font-ui text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary block mb-2.5">
                2. Number of Floors
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { val: 1, label: "Ground Only", sub: "~" + Math.round(plotArea * 0.85) + " Sq.Ft" },
                  { val: 2, label: "Ground + 1 Floor", sub: "~" + Math.round(plotArea * 1.7) + " Sq.Ft" },
                  { val: 3, label: "Ground + 2 Floors", sub: "~" + Math.round(plotArea * 2.4) + " Sq.Ft" }
                ].map((f) => (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setFloors(f.val)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      floors === f.val
                        ? "bg-brand-forest text-white border-brand-forest shadow-md scale-[1.02]"
                        : "bg-surface-0 border-border-subtle text-text-secondary hover:border-brand-forest/40 hover:text-text-primary"
                    }`}
                  >
                    <div className="font-display text-sm sm:text-base font-bold">{f.label}</div>
                    <div className={`font-mono text-[10px] mt-0.5 ${floors === f.val ? "text-brand-leaf-light" : "text-text-tertiary"}`}>
                      {f.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Material Quality Tier */}
            <div>
              <label className="font-ui text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary block mb-2.5">
                3. Construction Quality Tier
              </label>
              <div className="flex flex-col gap-2.5">
                {(Object.keys(ratesPerSqFt) as Array<keyof typeof ratesPerSqFt>).map((tierKey) => {
                  const tier = ratesPerSqFt[tierKey];
                  const isSelected = constructionType === tierKey;
                  return (
                    <div
                      key={tierKey}
                      onClick={() => setConstructionType(tierKey)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-surface-0 border-brand-forest shadow-md ring-2 ring-brand-forest/20"
                          : "bg-surface-0/60 border-border-subtle hover:bg-surface-0 hover:border-border-medium"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-brand-forest bg-brand-forest text-white" : "border-border-medium"
                        }`}>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm font-bold text-text-primary">
                              {tier.label}
                            </span>
                            {tierKey === "premium" && (
                              <span className="text-[9px] font-mono uppercase bg-amber-500/15 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                                Best Value
                              </span>
                            )}
                          </div>
                          <p className="font-ui text-xs text-text-secondary mt-1 leading-relaxed">
                            {tier.desc}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 font-mono text-sm sm:text-base font-bold text-brand-forest sm:pl-3">
                        ₹{tier.rate} <span className="text-[10px] text-text-tertiary font-normal">/Sq.Ft</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Input 4: City / District Selection */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-subtle text-xs">
              <span className="font-ui text-text-secondary font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-forest" />
                <span>Site Location Coverage:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["Madurai", "Dindigul", "Theni", "Virudhunagar", "Aruppukottai"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDistrict(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      district === d
                        ? "bg-brand-forest text-white font-bold"
                        : "bg-surface-0 border border-border-subtle text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Instant Calculation Output & Conversion Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0c180f] to-[#08120b] text-white border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Top decorative badge */}
            <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  Danam Guaranteed Estimate
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/50 bg-white/10 px-2 py-0.5 rounded">
                IS-456 Code
              </span>
            </div>

            {/* Estimated Total */}
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-white/60 block mb-1">
                Estimated Construction Budget:
              </span>
              <div className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">
                {formatLakhsCrores(estimatedCost)}
              </div>
              <div className="font-mono text-xs text-brand-leaf-light flex items-center gap-2">
                <span>≈ ₹{estimatedCost.toLocaleString()} Total</span>
                <span>•</span>
                <span>₹{ratePerSqFt}/Sq.Ft</span>
              </div>
            </div>

            {/* Specs Summary Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 space-y-2.5 text-xs font-ui">
              <div className="flex justify-between items-center text-white/80">
                <span>Total Built-Up Area:</span>
                <strong className="font-mono text-white">{totalBuiltUpArea.toLocaleString()} Sq.Ft</strong>
              </div>
              <div className="flex justify-between items-center text-white/80">
                <span>Estimated Handover Duration:</span>
                <strong className="font-mono text-amber-300">{durationMonths} Months Guaranteed</strong>
              </div>
              <div className="flex justify-between items-center text-white/80">
                <span>Price Escalation Risk:</span>
                <strong className="font-mono text-emerald-400">0% (Locked in BOQ)</strong>
              </div>
              <div className="flex justify-between items-center text-white/80">
                <span>Vastu & 3D Architectural Plan:</span>
                <strong className="font-mono text-brand-leaf-light">Included 100% Free</strong>
              </div>
            </div>

            {/* Call to Actions (Direct WhatsApp + BOQ Lead Modal) */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleWhatsAppQuote}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-ui font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Get Itemized BOQ Breakdown on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleOpenLeadModal}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-ui text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Book Free Plot Vastu & Structural Visit</span>
              </button>
            </div>

            {/* Micro Trust footnote */}
            <p className="text-[10px] font-mono text-white/40 text-center mt-5 leading-normal">
              * Estimate includes excavation, foundation, column RCC, brickwork, plastering, electrical, plumbing & exterior finishing. Zero surprise bills.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
