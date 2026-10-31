"use client";
import React, { useState } from "react";
import { ALL_PROJECTS, ProjectItem, ProjectCadDrawing } from "@/data/projectsData";
import {
  Ruler,
  ShieldCheck,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Rotate3D,
  Sparkles,
  Maximize2,
  Building2,
  ChevronRight,
  Layers,
  MapPin
} from "lucide-react";

interface ProjectCadShowcaseProps {
  onOpenProjectModal?: (project: ProjectItem, tab: "3d" | "360" | "cad" | "specs" | "before-after") => void;
}

export default function ProjectCadShowcase({ onOpenProjectModal }: ProjectCadShowcaseProps) {
  // Select projects that have rich CAD drawings
  const cadProjects = ALL_PROJECTS.filter((p) => p.cadDrawings && p.cadDrawings.length > 0);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(cadProjects[0]?.id || "rajmahal-aishvaryam");
  const [selectedCadIdx, setSelectedCadIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"cad" | "elevation" | "asbuilt">("cad");
  const [cadZoom, setCadZoom] = useState<number>(1);
  const [cadTheme, setCadTheme] = useState<"blueprint" | "drafting">("blueprint");

  const currentProject = cadProjects.find((p) => p.id === selectedProjectId) || cadProjects[0];
  const currentCad: ProjectCadDrawing | undefined = currentProject?.cadDrawings?.[selectedCadIdx] || currentProject?.cadDrawings?.[0];

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedCadIdx(0);
    setCadZoom(1);
    setViewMode("cad");
  };

  const handleZoomIn = () => {
    setCadZoom((prev) => Math.min(2.5, Number((prev + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setCadZoom((prev) => Math.max(0.7, Number((prev - 0.25).toFixed(2))));
  };

  const handleResetZoom = () => {
    setCadZoom(1);
  };

  return (
    <section className="bg-[#070b12] text-white py-20 border-y border-white/10 relative overflow-hidden">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:28px_28px] opacity-35 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Ruler className="w-3.5 h-3.5 text-cyan-400" />
            <span>Structural Transparency • DTCP Sanctioned Blueprints</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Client CAD Blueprints & Structural Sketches
          </h2>
          <p className="font-ui text-sm md:text-base text-white/70 leading-relaxed">
            Every Danam Holdings construction begins with complete architectural engineering transparency. Inspect real 2D CAD floor plans, column grids, structural sections, and concept sketches before physical ground-breaking.
          </p>
        </div>

        {/* Project Selector Horizontal Tabs */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          {cadProjects.map((p) => {
            const isSelected = p.id === currentProject?.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectProject(p.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)] font-bold ring-1 ring-cyan-400/30"
                    : "bg-[#0e1422] text-white/60 hover:text-white hover:bg-[#141c30] border border-white/10"
                }`}
              >
                <Ruler className={`w-3.5 h-3.5 ${isSelected ? "text-cyan-400" : "text-white/40"}`} />
                <span>{p.title}</span>
                <span className="text-[10px] font-mono text-white/40 uppercase">({p.location})</span>
              </button>
            );
          })}
        </div>

        {/* Interactive CAD Workbench Studio Frame */}
        <div className="bg-[#0b101c] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl">
          {/* Studio Top Control Strip */}
          <div className="bg-[#0e1626] border-b border-white/10 px-4 sm:px-6 py-3.5 flex flex-wrap justify-between items-center gap-4">
            {/* Left: Project & Sheet Information */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                <Ruler className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {currentCad?.sheetNo || "CAD DWG"}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {currentCad?.approvalStatus || "IS-456 Certified"}
                  </span>
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold text-white mt-0.5 truncate max-w-md">
                  {currentProject?.title} — {currentCad?.title}
                </h3>
              </div>
            </div>

            {/* Center: View Mode Toggle (2D CAD vs 3D Elevation vs As-Built Handover) */}
            <div className="flex items-center bg-[#070b14] border border-white/15 p-1 rounded-2xl gap-1">
              <button
                onClick={() => setViewMode("cad")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  viewMode === "cad"
                    ? "bg-cyan-500 text-black font-bold shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>2D CAD Plan</span>
              </button>

              <button
                onClick={() => setViewMode("elevation")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  viewMode === "elevation"
                    ? "bg-brand-forest text-white font-bold shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Rotate3D className="w-3.5 h-3.5 text-amber-300" />
                <span>3D Elevation</span>
              </button>

              <button
                onClick={() => setViewMode("asbuilt")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  viewMode === "asbuilt"
                    ? "bg-emerald-600 text-white font-bold shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>As-Built Reality</span>
              </button>
            </div>

            {/* Right: Zoom & Fullscreen Launch */}
            <div className="flex items-center gap-2">
              {viewMode === "cad" && (
                <>
                  <div className="flex items-center gap-1 bg-[#070b14] border border-white/10 rounded-xl p-0.5">
                    <button
                      onClick={handleZoomOut}
                      className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono font-bold px-1 text-cyan-300 min-w-[38px] text-center">
                      {Math.round(cadZoom * 100)}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleResetZoom}
                      className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Reset View"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center bg-[#070b14] border border-white/10 rounded-xl p-0.5 text-[10px] font-mono">
                    <button
                      onClick={() => setCadTheme("blueprint")}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        cadTheme === "blueprint" ? "bg-cyan-600/40 text-cyan-300 font-bold" : "text-white/50"
                      }`}
                    >
                      Blueprint
                    </button>
                    <button
                      onClick={() => setCadTheme("drafting")}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        cadTheme === "drafting" ? "bg-white/20 text-white font-bold" : "text-white/50"
                      }`}
                    >
                      Draft
                    </button>
                  </div>
                </>
              )}

              {onOpenProjectModal && (
                <button
                  onClick={() => onOpenProjectModal(currentProject, "cad")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  title="Open in Fullscreen Interactive CAD Studio"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Studio Viewer</span>
                </button>
              )}
            </div>
          </div>

          {/* Multiple Sheets Sub-Selector Bar (If Project Has Multiple Sheets) */}
          {currentProject?.cadDrawings && currentProject.cadDrawings.length > 1 && (
            <div className="bg-[#0a0f18] px-4 sm:px-6 py-2 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Drawing Sheets:
              </span>
              {currentProject.cadDrawings.map((sheet, sIdx) => {
                const isSelected = selectedCadIdx === sIdx;
                return (
                  <button
                    key={sheet.id}
                    onClick={() => {
                      setSelectedCadIdx(sIdx);
                      setCadZoom(1);
                      setViewMode("cad");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{sheet.sheetNo}</span> — <span>{sheet.type}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Studio Canvas Display Stage */}
          <div className="relative min-h-[420px] sm:min-h-[500px] flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-[#061220]">
            {/* Viewfinder Reticles */}
            <span className="pointer-events-none absolute left-4 top-4 z-10 h-5 w-5 border-l-2 border-t-2 border-cyan-400/40" />
            <span className="pointer-events-none absolute right-4 top-4 z-10 h-5 w-5 border-r-2 border-t-2 border-cyan-400/40" />
            <span className="pointer-events-none absolute left-4 bottom-4 z-10 h-5 w-5 border-l-2 border-b-2 border-cyan-400/40" />
            <span className="pointer-events-none absolute right-4 bottom-4 z-10 h-5 w-5 border-r-2 border-b-2 border-cyan-400/40" />

            {/* MODE 1: 2D CAD Blueprint */}
            {viewMode === "cad" && currentCad && (
              <div
                className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${cadZoom})` }}
              >
                <div
                  className={`relative rounded-2xl overflow-hidden shadow-2xl border transition-all ${
                    cadTheme === "blueprint"
                      ? "border-cyan-400/60 shadow-[0_0_60px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/30"
                      : "border-white/20"
                  }`}
                >
                  <img
                    src={currentCad.dwgUrl}
                    alt={currentCad.title}
                    className={`max-w-[85vw] md:max-w-3xl max-h-[56vh] object-contain transition-all ${
                      cadTheme === "blueprint"
                        ? "contrast-125 brightness-95 filter hue-rotate-15"
                        : "contrast-110"
                    }`}
                  />

                  {/* Corner Title Stamp Box */}
                  <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md border border-cyan-400/40 p-2.5 rounded-xl text-left font-mono text-[9px] pointer-events-none max-w-[240px]">
                    <span className="text-cyan-400 font-bold block uppercase tracking-wider">DANAM HOLDINGS CIVIL EPC</span>
                    <span className="text-white font-sans text-[11px] font-bold block truncate">{currentProject.title}</span>
                    <span className="text-white/60 block">{currentCad.sheetNo} • Scale {currentCad.scale}</span>
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: 3D Elevation Perspective */}
            {viewMode === "elevation" && (
              <div className="relative max-w-3xl w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-stone-900 group">
                <img
                  src={currentProject.img}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-brand-leaf-light font-mono text-xs uppercase tracking-wider font-bold">
                    Architectural 3D Elevation
                  </span>
                  <h4 className="font-display text-xl font-bold text-white mt-1">
                    {currentProject.title}
                  </h4>
                  <p className="font-ui text-xs text-white/80 max-w-lg mt-1">
                    {currentProject.desc}
                  </p>
                  {onOpenProjectModal && (
                    <div className="mt-3">
                      <button
                        onClick={() => onOpenProjectModal(currentProject, "3d")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-forest hover:bg-brand-forest-dark text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        <Rotate3D className="w-3.5 h-3.5 text-amber-300" />
                        <span>Launch Interactive 3D Model</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODE 3: As-Built Reality Handover */}
            {viewMode === "asbuilt" && (
              <div className="relative max-w-3xl w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/40 bg-stone-900">
                <img
                  src={currentProject.img}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Turnkey As-Built Handover (IS-456 Certified)
                  </span>
                  <h4 className="font-display text-xl font-bold text-white mt-1">
                    {currentProject.title} — Completed Execution
                  </h4>
                  <p className="font-ui text-xs text-white/80 max-w-lg mt-1">
                    Built exactly to CAD specifications with zero cost escalation and on-time key delivery.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Blueprint Technical Specifications Footer */}
          {currentCad && (
            <div className="bg-[#0e1626] border-t border-white/10 p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                      {currentCad.sheetNo}
                    </span>
                    <span className="text-xs font-mono text-white/60">
                      Scale: {currentCad.scale}
                    </span>
                    <span className="text-xs font-mono text-white/40">•</span>
                    <span className="text-xs font-mono text-white/60">
                      Dimensions: {currentCad.dimensions}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-white">
                    {currentCad.title}
                  </h4>
                  <p className="font-ui text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    {currentCad.description}
                  </p>
                </div>

                {/* Key Structural Specifications Badges */}
                <div className="flex flex-col gap-2 shrink-0 w-full lg:w-auto">
                  {currentCad.keySpecs.slice(0, 3).map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 font-ui text-xs text-white/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate max-w-[340px]">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Action Strip */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>All drawings registered and approved under Tamil Nadu Town & Country Planning (DTCP) norms</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={currentCad.dwgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Full-Res Image</span>
                  </a>

                  {onOpenProjectModal && (
                    <button
                      onClick={() => onOpenProjectModal(currentProject, "cad")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Inspect in Interactive CAD Studio →</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
