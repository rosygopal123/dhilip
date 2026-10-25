"use client";
import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Project3DExperience from "@/components/Project3DExperience";
import ProjectInteractiveModal from "@/components/ProjectInteractiveModal";
import { ALL_PROJECTS, ProjectItem } from "@/data/projectsData";
import {
  MapPin,
  Rotate3D,
  Compass,
  FileText,
  SlidersHorizontal,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDistrict, setFilterDistrict] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [modalTab, setModalTab] = useState<"3d" | "360" | "specs" | "before-after">("3d");

  const filteredProjects = ALL_PROJECTS.filter((p) => {
    const matchesType = filterType === "all" || p.type === filterType;
    const matchesDistrict = filterDistrict === "all" || p.location.includes(filterDistrict);
    return matchesType && matchesDistrict;
  });

  const openProjectModal = (project: ProjectItem, tab: "3d" | "360" | "specs" | "before-after" = "3d") => {
    setSelectedProject(project);
    setModalTab(tab);
  };

  return (
    <div className="pt-24 pb-20 bg-surface-0 min-h-screen">
      {/* Header Banner */}
      <section className="bg-surface-1 border-b border-border-subtle py-16 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-forest/10 border border-brand-forest/20 text-brand-forest text-xs font-bold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span>350+ Projects Completed Across South India</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-text-primary mb-4">
            {t.projects.heroTitle}
          </h1>
          <p className="font-ui text-sm md:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {t.projects.heroSub}
          </p>

          {/* 3D & 360 Feature Callout Banner */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 bg-surface-0 border border-border-medium px-4 py-2.5 rounded-2xl shadow-sm text-xs font-ui">
            <span className="flex items-center gap-1.5 text-brand-forest font-bold">
              <Rotate3D className="w-4 h-4 text-amber-500 animate-spin-slow" />
              <span>Interactive 3D Walkaround</span>
            </span>
            <span className="text-text-tertiary">•</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>360° Interior VR Tour on Every Project</span>
            </span>
            <span className="text-text-tertiary hidden sm:inline">•</span>
            <span className="text-text-secondary hidden sm:inline">
              Zero surprise changes · 100% architectural transparency
            </span>
          </div>
        </div>
      </section>

      {/* 3D Interactive Project Experience (Featured Walkaround) */}
      <Project3DExperience />

      {/* Filter and Portfolio Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Filters bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-border-subtle pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Projects" },
              { id: "residential", label: "Residential Villas" },
              { id: "commercial", label: "Commercial Complexes" },
              { id: "renovation", label: "Turnkey EPC & Renovation" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  filterType === tab.id
                    ? "bg-brand-forest text-white shadow-sm"
                    : "bg-surface-1 text-text-secondary hover:text-text-primary border border-border-subtle"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* District Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-ui text-text-tertiary uppercase tracking-widest hidden sm:inline">
              Location:
            </span>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-surface-1 border border-border-medium px-4 py-2 text-xs font-ui text-text-primary rounded-lg focus:outline-none focus:border-brand-forest cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="Madurai">Madurai</option>
              <option value="Aruppukottai">Aruppukottai</option>
            </select>
          </div>
        </div>

        {/* Projects Grid with Direct 3D and 360 Actions on Every Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group flex flex-col bg-surface-1 border border-border-subtle hover:border-brand-forest/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Container with 3D / 360 Interactive Action Hover Overlay */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 group">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md text-white font-mono text-[10px] px-3 py-1 uppercase tracking-wider rounded-full border border-white/20 z-10">
                  {p.badge}
                </div>

                {/* Top-Right: 3D + 360 Available Pill */}
                <div className="absolute top-3.5 right-3.5 bg-brand-forest/90 backdrop-blur-md text-white font-mono text-[9px] px-2.5 py-1 uppercase tracking-wider rounded-full border border-white/20 flex items-center gap-1 z-10">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>3D + 360° Live</span>
                </div>

                {/* Hover Quick Action Buttons Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openProjectModal(p, "3d")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-forest hover:bg-brand-forest-dark text-white text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105 shadow-lg cursor-pointer"
                    >
                      <Rotate3D className="w-3.5 h-3.5 text-amber-300" />
                      <span>3D Model</span>
                    </button>

                    <button
                      onClick={() => openProjectModal(p, "360")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0b0e14]/95 hover:bg-[#0b0e14] border border-emerald-400/60 text-emerald-300 text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105 shadow-lg cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      <span>360° Tour</span>
                    </button>
                  </div>
                </div>

                {/* Bottom title text on image */}
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white z-10 group-hover:opacity-0 transition-opacity">
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-leaf-light font-medium mb-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{p.location}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold truncate text-white">
                    {p.title}
                  </h3>
                </div>
              </div>

              {/* Card Meta Details & Direct Launch Bar */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-display text-base font-bold text-text-primary mb-1">
                    {p.title}
                  </h4>
                  <p className="font-ui text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4">
                    {p.desc}
                  </p>
                </div>

                {/* Interactive Launch Button Strip */}
                <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openProjectModal(p, "3d")}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-2 hover:bg-brand-forest hover:text-white text-text-primary text-[11px] font-semibold transition-all cursor-pointer border border-border-subtle"
                      title="Explore 3D Exterior Model"
                    >
                      <Rotate3D className="w-3 h-3 text-amber-500" />
                      <span>3D View</span>
                    </button>

                    <button
                      onClick={() => openProjectModal(p, "360")}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-2 hover:bg-brand-forest hover:text-white text-text-primary text-[11px] font-semibold transition-all cursor-pointer border border-border-subtle"
                      title="Step into 360° VR Room Tour"
                    >
                      <Compass className="w-3 h-3 text-emerald-600" />
                      <span>360° VR</span>
                    </button>
                  </div>

                  <button
                    onClick={() => openProjectModal(p, "specs")}
                    className="font-ui text-xs font-bold text-brand-forest hover:text-brand-forest-dark inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Specs</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After Transformation Slider */}
      <section className="bg-surface-1 border-t border-border-subtle py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-brand-forest font-mono text-xs uppercase tracking-widest mb-2 block font-bold">
              Engineering Progression
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-3">
              {t.projects.sliderTitle}
            </h2>
            <p className="font-ui text-sm text-text-secondary max-w-lg mx-auto">
              {t.projects.sliderDesc}
            </p>
          </div>

          <div className="bg-surface-0 border border-border-medium p-4 rounded-2xl shadow-xl">
            <BeforeAfterSlider
              beforeImg="/images/danam/hh4.webp"
              afterImg="/images/danam/about-villa.webp"
              beforeLabel="Structural RCC Skeleton (IS-456)"
              afterLabel="Turnkey Architectural Delivery"
            />
          </div>
        </div>
      </section>

      {/* Universal Interactive 3D & 360 Project Modal */}
      <ProjectInteractiveModal
        project={selectedProject}
        initialTab={modalTab}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
