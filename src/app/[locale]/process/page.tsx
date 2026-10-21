"use client";
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Compass, Calculator, ChevronDown, Upload } from "lucide-react";

export default function ProcessPage() {
  const { t } = useLanguage();
  const [activePhase, setActivePhase] = useState(1);
  const phaseRefs = useRef<HTMLDivElement[]>([]);

  // FSI Calculator state
  const [plotArea, setPlotArea] = useState("2400");
  const [zone, setZone] = useState("normal");

  // Vastu upload simulation state
  const [vastuImage, setVastuImage] = useState<string | null>(null);
  const [showVastuGrid, setShowVastuGrid] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 8-phase details mapping
  const phases = [
    { id: 1, key: "p1", img: "/assets/process_p1.png" },
    { id: 2, key: "p2", img: "/assets/process_p2.png" },
    { id: 3, key: "p3", img: "/assets/process_p3.png" },
    { id: 4, key: "p4", img: "/assets/process_p4.png" },
    { id: 5, key: "p5", img: "/assets/process_p5.png" },
    { id: 6, key: "p6", img: "/assets/process_p6.png" },
    { id: 7, key: "p7", img: "/assets/process_p7.png" },
    { id: 8, key: "p8", img: "/assets/process_p7_2.png" },
  ];

  // Scrollytelling implementation: Detect active phase on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      for (let i = 0; i < phaseRefs.current.length; i++) {
        const el = phaseRefs.current[i];
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActivePhase(i + 1);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FSI Calculations
  const calculateFSI = () => {
    const area = parseFloat(plotArea) || 0;
    const fsiVal = zone === "premium" ? 2.0 : 1.5;
    return Math.round(area * fsiVal);
  };

  // Vastu file upload simulation
  const handleVastuUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setVastuImage(event.target.result as string);
          setShowVastuGrid(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const faqs = [
    { q: t.process.faqQ1, a: t.process.faqA1 },
    { q: t.process.faqQ2, a: t.process.faqA2 },
    { q: t.process.faqQ3, a: t.process.faqA3 },
    { q: t.process.faqQ4, a: t.process.faqA4 },
  ];

  return (
    <div className="relative w-full">
      {/* 1. Hero */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/process_hero.png')" }}
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 text-center max-w-4xl px-6 pt-16">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            PROCESS
          </span>
          <h1 className="font-display text-4xl md:text-7xl font-medium tracking-tight text-white mb-4">
            {t.process.heroTitle}
          </h1>
          <p className="font-ui text-xs md:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
            {t.process.heroSub}
          </p>
        </div>
      </section>

      {/* 2. 7-Phase Scrollytelling Section */}
      <section className="py-24 bg-surface-0 relative border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Scrolling Details (60%) */}
          <div className="w-full lg:w-3/5 flex flex-col gap-0">
            {phases.map((p, idx) => {
              const phaseData = t.process.steps[idx % t.process.steps.length];
              return (
                <div
                  key={p.id}
                  ref={(el) => {
                    if (el) phaseRefs.current[idx] = el;
                  }}
                  className={`min-h-[70vh] flex flex-col justify-center text-left py-12 border-b border-border-subtle/50 last:border-b-0 transition-opacity duration-300 ${
                    activePhase === p.id ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <span className="font-display text-5xl font-bold text-brand-teak mb-2 block font-mono">
                    0{p.id}
                  </span>
                  <span className="text-text-tertiary font-mono text-[10px] tracking-wider uppercase block mb-1">
                    Step {phaseData?.step}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-6">
                    {phaseData?.title}
                  </h3>
                  <p className="font-ui text-xs md:text-sm text-text-secondary leading-relaxed mb-6">
                    {phaseData?.desc}
                  </p>

                  <div className="flex flex-col gap-4 font-ui text-[11px] bg-surface-1 p-6 border border-border-subtle">
                    <div>
                      <span className="block font-bold text-text-primary uppercase tracking-wider text-[9px] mb-1">
                        Materials / Equipment:
                      </span>
                      <span className="text-text-secondary">{(phaseData as any)?.materials || "Standard High-Grade Materials"}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-text-primary uppercase tracking-wider text-[9px] mb-1">
                        Quality Inspections:
                      </span>
                      <span className="text-text-secondary">{(phaseData as any)?.checks || "Multi-stage Structural Audit"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Image (40%) */}
          <div className="w-full lg:w-2/5 hidden lg:block select-none">
            <div className="sticky top-32 h-[50vh] w-full bg-surface-2 border border-brand-teak/20 overflow-hidden relative">
              {phases.map((p) => (
                <img
                  key={p.id}
                  src={p.img}
                  alt={`Construction Phase ${p.id}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    activePhase === p.id ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute bottom-4 left-4 bg-brand-charcoal text-white font-mono text-[9px] px-2 py-0.5 uppercase tracking-widest z-10 shadow">
                Phase {activePhase} Illustration
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. TNRERA single window approval guide & FSI Calculator */}
      <section className="py-24 bg-surface-1 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: CMDA / DTCP Guides */}
            <div className="lg:col-span-7 text-left">
              <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
                COMPLIANCE
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-text-primary mb-6">
                {t.process.tnreraTitle}
              </h2>
              <p className="font-ui text-xs md:text-sm text-text-secondary leading-relaxed mb-8">
                {t.process.tnreraText}
              </p>

              {/* RERA and approvals cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-0 p-6 border border-border-subtle">
                  <h4 className="font-display font-semibold text-base mb-2">CMDA</h4>
                  <span className="font-ui text-[10px] text-text-secondary">Chennai Metropolitan Area rules, strict high-density stilt allocations.</span>
                </div>
                <div className="bg-surface-0 p-6 border border-border-subtle">
                  <h4 className="font-display font-semibold text-base mb-2">DTCP</h4>
                  <span className="font-ui text-[10px] text-text-secondary">Panchayat layouts outside Chennai. LP registration is mandatory.</span>
                </div>
                <div className="bg-surface-0 p-6 border border-border-subtle">
                  <h4 className="font-display font-semibold text-base mb-2">Corporation</h4>
                  <span className="font-ui text-[10px] text-text-secondary">Madurai / Trichy urban licensing, water connection audits.</span>
                </div>
              </div>
            </div>

            {/* Right: FSI Calculator Card */}
            <div className="lg:col-span-5 bg-surface-0 border border-brand-teak/20 p-8 text-left shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-brand-teak" />
                <h3 className="font-display font-semibold text-lg text-text-primary uppercase tracking-wider">
                  {t.process.fsiTitle}
                </h3>
              </div>
              <p className="font-ui text-[11px] text-text-secondary mb-6">{t.process.fsiSub}</p>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase font-semibold text-text-secondary">{t.process.fsiPlot}</label>
                  <input
                    type="number"
                    value={plotArea}
                    onChange={(e) => setPlotArea(e.target.value)}
                    className="w-full bg-surface-1 border border-border-subtle p-3 font-mono text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase font-semibold text-text-secondary">{t.process.fsiZone}</label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full bg-surface-1 border border-border-subtle p-3 text-xs outline-none"
                  >
                    <option value="normal">{t.process.fsiZoneNormal}</option>
                    <option value="premium">{t.process.fsiZonePremium}</option>
                  </select>
                </div>
              </div>

              <div className="bg-surface-1 p-4 border border-border-subtle font-mono text-xs flex justify-between items-center text-text-secondary">
                <span>{t.process.fsiOutput}</span>
                <span className="font-bold text-base text-brand-teak">{calculateFSI().toLocaleString()} Sq.Ft</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Vastu Section */}
      <section data-theme="light" className="py-24 bg-[var(--bp-paper)] text-[var(--bp-ink)] relative border-b border-border-subtle">
        <div className="absolute inset-0 blueprint-grid opacity-8 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Vastu direction cards */}
            <div className="lg:col-span-7 text-left">
              <span className="text-[var(--bp-ink)]/70 font-mono text-xs uppercase tracking-widest mb-2 block">
                COMPASS GUIDE
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-6">
                {t.process.vastuTitle}
              </h2>
              <p className="font-ui text-xs md:text-sm text-text-secondary leading-relaxed mb-8">
                {t.process.vastuSub}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/60 p-5 border border-[var(--bp-ink)]/15">
                  <span className="font-display font-semibold text-brand-teak block mb-1">Entrance (North / East)</span>
                  <p className="font-ui text-[11px] text-text-secondary">{t.process.vastuEntrance}</p>
                </div>
                <div className="bg-white/60 p-5 border border-[var(--bp-ink)]/15">
                  <span className="font-display font-semibold text-brand-teak block mb-1">Kitchen (South-East)</span>
                  <p className="font-ui text-[11px] text-text-secondary">{t.process.vastuKitchen}</p>
                </div>
                <div className="bg-white/60 p-5 border border-[var(--bp-ink)]/15">
                  <span className="font-display font-semibold text-brand-teak block mb-1">Master Bedroom (South-West)</span>
                  <p className="font-ui text-[11px] text-text-secondary">{t.process.vastuMaster}</p>
                </div>
                <div className="bg-white/60 p-5 border border-[var(--bp-ink)]/15">
                  <span className="font-display font-semibold text-brand-teak block mb-1">Pooja Room (North-East)</span>
                  <p className="font-ui text-[11px] text-text-secondary">{t.process.vastuPooja}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Vastu simulated overlay upload */}
            <div className="lg:col-span-5 bg-white/80 border border-[var(--bp-ink)]/20 p-8 text-center">
              <Compass className="w-12 h-12 text-brand-teak mx-auto mb-4 animate-[spin_20s_linear_infinite]" />
              <h4 className="font-display font-semibold text-lg text-[var(--bp-ink)] mb-2">
                Simulate Vastu Grid Overlay
              </h4>
              <p className="font-ui text-[11px] text-text-secondary mb-6">
                Upload your blueprint draft to inspect room alignments locally. Stored client-side only.
              </p>

              {vastuImage ? (
                <div className="relative aspect-square w-full overflow-hidden bg-black border border-brand-teak/20 select-none">
                  {/* Floor plan draft */}
                  <img src={vastuImage} alt="Uploaded Floor Plan" className="w-full h-full object-contain opacity-70" />
                  
                  {/* Overlay grid */}
                  {showVastuGrid && (
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-white pointer-events-none select-none text-[8px] font-mono">
                      {[
                        "NW (Wind)", "North (Kubera)", "NE (Pooja)",
                        "West (Varuna)", "Center (Brahma)", "East (Indra)",
                        "SW (Master)", "South (Yama)", "SE (Kitchen)"
                      ].map((dir, dIdx) => (
                        <div key={dIdx} className="border border-brand-teak/50 flex items-center justify-center bg-brand-teak/5 p-1 text-center font-bold text-brand-teak uppercase">
                          {dir}
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setVastuImage(null);
                      setShowVastuGrid(false);
                    }}
                    className="absolute bottom-2 right-2 bg-brand-charcoal text-white text-[9px] font-mono px-2 py-1 uppercase tracking-widest cursor-pointer"
                  >
                    Clear File
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[var(--bp-ink)]/30 hover:border-brand-teak py-12 px-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/40">
                  <Upload className="w-6 h-6 text-brand-teak mb-2" />
                  <span className="font-ui text-xs font-semibold text-text-primary uppercase tracking-wider">
                    {t.process.vastuToggle}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleVastuUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="py-24 bg-surface-0 border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-6 text-left">
          <div className="text-center mb-16">
            <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
              {t.process.faqTamilName}
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-text-primary">
              {t.process.faqTitle}
            </h2>
          </div>

          <div className="flex flex-col gap-4 max-w-2xl mx-auto select-none">
            {faqs.map((f, idx) => (
              <div key={idx} className="border border-border-subtle bg-surface-1 rounded">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left font-display font-semibold text-sm md:text-base text-text-primary"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-teak transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === idx ? "max-h-[300px] border-t border-border-subtle" : "max-h-0"
                  }`}
                >
                  <div className="p-6 text-xs md:text-sm font-ui text-text-secondary leading-relaxed bg-surface-0">
                    {f.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GST Info Card */}
      <section className="py-24 bg-surface-1">
        <div className="max-w-4xl mx-auto px-6 text-center select-none">
          <div className="bg-surface-0 border border-brand-teak/20 p-8 md:p-12 text-left max-w-2xl mx-auto relative overflow-hidden">
            {/* Blueprint watermark */}
            <div className="absolute inset-0 blueprint-grid opacity-3 pointer-events-none" />

            <div className="flex justify-between items-start border-b border-border-subtle pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-1">
                  {t.process.gstTitle}
                </h3>
                <span className="font-mono text-[9px] text-text-tertiary">TAMIL NADU GST SCHEDULES (2026)</span>
              </div>
              <a
                href="#"
                className="bg-brand-teak hover:bg-brand-teal text-white font-mono text-[10px] uppercase font-semibold px-4 py-2 tracking-widest cursor-pointer"
              >
                {t.process.gstGuide}
              </a>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs text-text-secondary">
              <div className="flex justify-between border-b border-border-subtle/50 pb-2">
                <span>New Residential Construction Works Contract</span>
                <span className="font-bold text-text-primary">18%</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle/50 pb-2">
                <span>Affordable Housing Scheme projects (PMAY)</span>
                <span className="font-bold text-text-primary">5%</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle/50 pb-2">
                <span>Commercial Buildings & Plaza contracts</span>
                <span className="font-bold text-text-primary">18%</span>
              </div>
              <div className="flex justify-between text-text-tertiary">
                <span>Pure Land Purchase Transactions</span>
                <span className="font-bold text-text-tertiary">0% (GST Exempt)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
