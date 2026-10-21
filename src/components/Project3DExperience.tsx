"use client";
import React, { useState } from "react";
import {
  Rotate3D,
  Sparkles,
  Layers,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Compass,
  ArrowRight,
  ExternalLink,
  Info,
  Camera,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";

export interface Project3DItem {
  id: string;
  title: string;
  tagline: string;
  category: "Residential Villa" | "Commercial Complex" | "Turnkey EPC";
  location: string;
  builtUpArea: string;
  sketchfabId: string;
  embedUrl: string;
  directUrl: string;
  thumbnail: string;
  specs: {
    structure: string;
    steel: string;
    concrete: string;
    vastu: string;
    floors: string;
    handoverTime: string;
  };
  highlights: string[];
}

// Config array: easily swap or add more models as client provides them!
export const PROJECT_3D_LIST: Project3DItem[] = [
  {
    id: "luxury-villa-01",
    title: "Modern Luxury Villa Elevation",
    tagline: "Contemporary 4BHK architectural design with Burma teak louvers and terrace deck",
    category: "Residential Villa",
    location: "Kamarajar Salai / KK Nagar, Madurai",
    builtUpArea: "4,650 Sq.Ft (G+2)",
    sketchfabId: "d8e6be2601474f7d8cb7d06f8566f01a",
    embedUrl: "https://sketchfab.com/models/d8e6be2601474f7d8cb7d06f8566f01a/embed?autostart=1&preload=1&transparent=1&ui_hint=0&ui_infos=0&ui_controls=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_watermark=0&ui_ar=0&ui_vr=0&ui_annotations=0",
    directUrl: "https://sketchfab.com/3d-models/modern-luxury-villa-house-building-d8e6be2601474f7d8cb7d06f8566f01a",
    thumbnail: "/images/danam/about-villa.webp",
    specs: {
      structure: "Seismic Zone-III Earthquake Resistant RCC Frame",
      steel: "Fe550D High-Ductility TMT Rebars",
      concrete: "M25 Ready-Mix Concrete Matrix with Lab Cube Audits",
      vastu: "100% Vastu-Compliant East Entrance & Agni Kitchen",
      floors: "G+2 Floors with Double-Height Living Room",
      handoverTime: "150 Days Handover Guarantee"
    },
    highlights: [
      "Natural Teak Wood Louver facade for tropical heat barrier",
      "Acoustic UPVC double-glazed panoramic windows (35dB noise cutoff)",
      "Dedicated Pooja Room in Ishanya (North-East) corner",
      "Rooftop terrace garden ready for 5kW Solar array & waterproof membrane"
    ]
  },
  {
    id: "contemporary-residence-02",
    title: "Architectural Contemporary Home",
    tagline: "Ultra-modern open plan residence with cantilevered balcony & landscaped courtyard",
    category: "Residential Villa",
    location: "Anna Nagar / Iyer Bungalow, Madurai",
    builtUpArea: "3,800 Sq.Ft (G+1)",
    sketchfabId: "2b9e6717a0ef457685dc41ce994ffabf",
    embedUrl: "https://sketchfab.com/models/2b9e6717a0ef457685dc41ce994ffabf/embed?autostart=1&preload=1&transparent=1&ui_hint=0&ui_infos=0&ui_controls=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_watermark=0&ui_ar=0&ui_vr=0&ui_annotations=0",
    directUrl: "https://sketchfab.com/3d-models/modern-house-2b9e6717a0ef457685dc41ce994ffabf",
    thumbnail: "/images/danam/ddhvrktrjjjln58schqk.webp",
    specs: {
      structure: "Engineered Monolithic Shear Wall + Column RCC",
      steel: "TATA Tiscon 550D Super Ductile",
      concrete: "Ultratech M30 High-Strength Concrete",
      vastu: "North-Facing Auspicious Main Door Layout",
      floors: "G+1 with Skylight Central Atrium",
      handoverTime: "180 Days Turnkey Handover"
    },
    highlights: [
      "Thermal-break aluminum sliding glass envelopes",
      "Rainwater harvesting & groundwater recharge pit integrated",
      "Concealed copper electrical conduit with surge protection",
      "Anti-skid Italian marble finish in common living zones"
    ]
  }
];

export default function Project3DExperience() {
  const [selectedProject, setSelectedProject] = useState<Project3DItem>(PROJECT_3D_LIST[0]);
  const [activeView, setActiveView] = useState<"3d" | "photos" | "specs">("3d");
  const [is3dLoaded, setIs3dLoaded] = useState(true);
  const [showGestureHint, setShowGestureHint] = useState<boolean>(true);
  const [modelZoom, setModelZoom] = useState<number>(0.84); // 0.84x CSS scale: perfectly zoomed out to show full house, compound walls & roof deck
  const sectionRef = React.useRef<HTMLDivElement>(null);

  // Pure client-side zoom controls (No external script injection, 100% CSP-safe & zero console errors)
  const zoomCameraOut = () => {
    setModelZoom((prev) => Math.max(0.55, Number((prev - 0.12).toFixed(2))));
  };

  const zoomCameraIn = () => {
    setModelZoom((prev) => Math.min(1.35, Number((prev + 0.12).toFixed(2))));
  };

  const realProjects = [
    { name: "Rajmahal Aishvaryam", loc: "Madurai", img: "/images/danam/ddhvrktrjjjln58schqk.webp", tag: "Turnkey EPC" },
    { name: "Theni Anandham", loc: "Aruppukottai", img: "/images/danam/l3s2jgqoz98xoktjyzvk.webp", tag: "Commercial" },
    { name: "Ocean Peacock SR", loc: "Madurai", img: "/images/danam/FFLiving-002.webp", tag: "Luxury Residential" },
    { name: "SACS Landmark", loc: "K.Pudhur, Madurai", img: "/images/danam/rvxn271huf5gcqqtdb46.webp", tag: "Civil Construction" }
  ];

  const handleOpenLeadModal = () => {
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Danam Holdings, I was exploring the 3D Model of the ${selectedProject.title} and would like to consult on my land/plot construction.`
    );
    window.open(`https://wa.me/918110006913?text=${text}`, "_blank");
  };

  return (
    <section ref={sectionRef} id="project-3d-experience" className="py-12 sm:py-16 bg-surface-1 border-y border-border-subtle relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-forest/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-forest/10 border border-brand-forest/20 text-brand-forest text-xs font-bold uppercase tracking-wider mb-2.5">
              <Rotate3D className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Interactive 3D Experience</span>
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-text-primary">
              Experience Your Building in 3D
            </h2>
            <p className="font-ui text-xs md:text-sm text-text-secondary max-w-2xl mt-1.5 leading-relaxed">
              Don’t settle for flat 2D blueprints. Walk around, orbit 360°, inspect structural elevations, and verify architectural finishes before laying a single brick.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-surface-0 border border-border-medium p-1 rounded-xl shadow-xs self-stretch md:self-auto justify-between sm:justify-center overflow-x-auto gap-1">
            <button
              onClick={() => setActiveView("3d")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeView === "3d"
                  ? "bg-brand-forest text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Rotate3D className="w-3.5 h-3.5" />
              <span>Live 3D Walkaround</span>
            </button>

            <button
              onClick={() => setActiveView("photos")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeView === "photos"
                  ? "bg-brand-forest text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Project Photos</span>
            </button>

            <button
              onClick={() => setActiveView("specs")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeView === "specs"
                  ? "bg-brand-forest text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Civil Specs</span>
            </button>
          </div>
        </div>

        {/* Main Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center: Interactive 3D Viewer (Clean Framed 3D Card with White Background) */}
          <div className="lg:col-span-7 bg-white border-[1.5px] border-neutral-900 rounded-[22px] overflow-hidden shadow-md flex flex-col">
            {/* Viewer Stage: Clean Pure White Canvas Edge-to-Edge */}
            <div className="relative w-full bg-white transition-all duration-300 overflow-hidden h-[320px] sm:h-[420px] lg:h-[485px]">
              {activeView === "3d" && (
                <div className="relative w-full h-full bg-white overflow-hidden flex items-center justify-center">


                  {/* Top Status & Zoom Controls */}
                  <div className="absolute top-3 left-3 z-20 pointer-events-none select-none">
                    <div className="bg-black/75 backdrop-blur-md border border-white/20 px-2.5 sm:px-3 py-1 rounded-full text-white text-[10px] sm:text-xs font-mono flex items-center gap-1.5 tracking-wider uppercase shadow-md">
                      <Rotate3D className="w-3.5 h-3.5 text-brand-forest animate-spin-slow" />
                      <span>3D Elevation</span>
                    </div>
                  </div>

                  {/* Clean Interactive Zoom Controls in Top-Right */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-white/20 p-1 rounded-xl shadow-lg pointer-events-auto select-none">
                    <button
                      onClick={zoomCameraOut}
                      className="px-2 py-1 text-white/90 hover:text-white hover:bg-white/20 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Zoom Out (Full View)"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase hidden sm:inline">Zoom Out</span>
                    </button>
                    <button
                      onClick={zoomCameraIn}
                      className="px-2 py-1 text-white/90 hover:text-white hover:bg-white/20 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border-l border-white/20 flex items-center gap-1"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase hidden sm:inline">Zoom In</span>
                    </button>
                  </div>

                  {/* Exact White Pointer Hand & Arrows (Canvas Center, Pure Left-Right Motion) */}
                  {showGestureHint && (
                    <div
                      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none transition-opacity duration-500"
                    >
                      <div
                        className="flex items-center gap-2.5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] filter"
                        style={{
                          animation: "handPointerSway 2s ease-in-out infinite",
                        }}
                      >
                        {/* Left Arrow */}
                        <svg
                          className="w-5 h-5 text-white fill-white"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                        </svg>

                        {/* Crisp White Hand Pointer Icon */}
                        <svg
                          className="w-10 h-10 text-white fill-white"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4.5 4.5 0 0 0-9 0c0 1.56.79 2.93 2 3.74zm9.84 4.63-4.54-2.26a1.98 1.98 0 0 0-1.92.1l-.88.58V7.5a1.5 1.5 0 0 0-3 0v10.74l-3.44-.72a1.53 1.53 0 0 0-1.48.43l-.78.79 4.93 4.93c.38.38.89.59 1.42.59H17c1.02 0 1.88-.77 1.98-1.78l.48-4.8c.07-.68-.21-1.35-.62-1.81z" />
                        </svg>

                        {/* Right Arrow */}
                        <svg
                          className="w-5 h-5 text-white fill-white"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Sketchfab 3D Embed Iframe - Scaled cleanly via CSS transform for full view without any JS errors */}
                  <div
                    onMouseDown={() => setShowGestureHint(false)}
                    onTouchStart={() => setShowGestureHint(false)}
                    className="w-full h-full flex items-center justify-center overflow-hidden bg-white relative cursor-grab active:cursor-grabbing"
                  >
                    <iframe
                      id="sketchfab-viewport-iframe"
                      key={selectedProject.id}
                      title={selectedProject.title}
                      src={selectedProject.embedUrl}
                      className="w-full border-0 bg-white transition-transform duration-300 ease-out"
                      style={{
                        height: "calc(100% + 120px)",
                        marginTop: "-55px",
                        marginBottom: "-65px",
                        maxWidth: "none",
                        maxHeight: "none",
                        backgroundColor: "#ffffff",
                        transform: `scale(${modelZoom})`,
                        transformOrigin: "center center",
                      }}
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {activeView === "photos" && (
                <div className="w-full h-full p-4 grid grid-cols-2 gap-3 overflow-y-auto bg-stone-900">
                  {realProjects.map((p, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] bg-stone-900"
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-leaf-light block">
                          {p.tag}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold truncate">{p.name}</h4>
                        <span className="text-[10px] text-white/70">{p.loc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeView === "specs" && (
                <div className="w-full h-full p-6 overflow-y-auto bg-surface-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                      Engineering & Structural Blueprint
                    </h3>
                    <p className="font-ui text-xs text-text-secondary mb-6 leading-relaxed">
                      Danam Holdings strictly builds adhering to Indian Standard Civil Codes (IS 456, IS 1893 seismic criteria) with lab-certified steel and ready-mix concrete.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-forest block">
                          Structural Core
                        </span>
                        <p className="text-xs font-semibold text-text-primary mt-1">
                          {selectedProject.specs.structure}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-forest block">
                          Reinforcement Steel
                        </span>
                        <p className="text-xs font-semibold text-text-primary mt-1">
                          {selectedProject.specs.steel}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-forest block">
                          Concrete Matrix
                        </span>
                        <p className="text-xs font-semibold text-text-primary mt-1">
                          {selectedProject.specs.concrete}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-forest block">
                          Vastu Alignment
                        </span>
                        <p className="text-xs font-semibold text-text-primary mt-1">
                          {selectedProject.specs.vastu}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-brand-forest flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Certified Quality & 100% Transparency</span>
                    </span>
                    <button
                      onClick={handleOpenWhatsApp}
                      className="px-4 py-2 bg-brand-forest hover:bg-brand-forest-dark text-white rounded-lg font-ui text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Discuss Specifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Key Architectural Highlights & Direct Consultation */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Quick Details Card */}
            <div className="bg-surface-0 border border-border-medium rounded-2xl p-5 shadow-sm text-text-primary">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-gold text-[10px] font-extrabold uppercase tracking-wider mb-2">
                Featured 3D Concept
              </span>
              <h3 className="font-display text-2xl font-bold text-text-primary leading-tight">
                {selectedProject.title}
              </h3>
              <p className="font-ui text-xs text-text-secondary mt-1.5 leading-relaxed">
                {selectedProject.tagline}
              </p>

              <div className="mt-5 space-y-2.5 border-t border-border-subtle pt-4 text-xs font-ui">
                <div className="flex justify-between py-1 border-b border-border-subtle/50">
                  <span className="text-text-tertiary">Built-up Area</span>
                  <span className="font-semibold text-text-primary">{selectedProject.builtUpArea}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle/50">
                  <span className="text-text-tertiary">Location Coverage</span>
                  <span className="font-semibold text-text-primary">{selectedProject.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle/50">
                  <span className="text-text-tertiary">Handover Timeline</span>
                  <span className="font-semibold text-brand-forest">{selectedProject.specs.handoverTime}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-tertiary">Standard Code</span>
                  <span className="font-semibold text-text-primary">IS 456 Structural Compliant</span>
                </div>
              </div>

              {/* Highlights List */}
              <div className="mt-5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-primary block">
                  Design & Quality Highlights:
                </span>
                {selectedProject.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-forest shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={handleOpenLeadModal}
                  className="w-full py-3 bg-brand-forest hover:bg-brand-forest-dark text-white rounded-xl font-ui text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Quote for Similar Villa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleOpenWhatsApp}
                  className="w-full py-2.5 bg-surface-1 hover:bg-surface-2 border border-border-medium text-text-primary rounded-xl font-ui text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Client Note Banner */}
            <div className="bg-gradient-to-br from-brand-forest/10 via-brand-forest/5 to-transparent border border-brand-forest/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-forest text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
                    Custom 3D Models For Clients
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    When you provide your elevation drawing, CAD model, or 3D Sketchfab link, we plug it directly into your portfolio seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
