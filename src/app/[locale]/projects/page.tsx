"use client";
import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Project3DExperience from "@/components/Project3DExperience";
import { X, MapPin, Calculator, Clock, Layers, ShieldCheck, CheckCircle2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  img: string;
  beforeImg: string;
  location: string;
  type: string;
  badge: string;
  area: string;
  year: string;
  duration: string;
  budget: string;
  desc: string;
  quote: string;
  author: string;
}

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Danam Holdings Real Landmark Projects
  const projects: Project[] = [
    {
      id: "sacs-madurai",
      title: "SACS Landmark Construction",
      img: "/images/danam/rvxn271huf5gcqqtdb46.webp",
      beforeImg: "/images/danam/hh4.webp",
      location: "K.Pudhur, Madurai",
      type: "commercial",
      badge: "Turnkey EPC",
      area: "Civil Facility",
      year: "2024",
      duration: "12 Months",
      budget: "Turnkey Civil Scope",
      desc: "Complete civil engineering and structural framework executed to IS 456 standards with high-ductility Fe550D TMT steel and ready-mix concrete.",
      quote: "Danam Holdings delivered this facility with remarkable structural discipline and transparent execution.",
      author: "SACS Management"
    },
    {
      id: "rajmahal-aishvaryam",
      title: "Rajmahal Aishvaryam",
      img: "/images/danam/ddhvrktrjjjln58schqk.webp",
      beforeImg: "/images/danam/hh2.webp",
      location: "Madurai",
      type: "commercial",
      badge: "Commercial Showroom",
      area: "Multi-Storey Showroom",
      year: "2024",
      duration: "14 Months",
      budget: "Turnkey EPC Commercial",
      desc: "Prominent retail and commercial showroom architecture featuring advanced facade cladding, reinforced heavy column grids, and modern MEP installations.",
      quote: "Exceptional speed, cost transparency, and top-tier finishing from initial 3D plans to key handover.",
      author: "Rajmahal Commercial Group"
    },
    {
      id: "theni-anandham",
      title: "Theni Anandham",
      img: "/images/danam/l3s2jgqoz98xoktjyzvk.webp",
      beforeImg: "/images/danam/hh3.webp",
      location: "Aruppukottai",
      type: "commercial",
      badge: "Commercial",
      area: "Flagship Retail Complex",
      year: "2023",
      duration: "10 Months",
      budget: "Commercial Retail",
      desc: "High-capacity commercial retail building with expansive clear floor plates, structural steel mezzanine framing, and specialized waterproofing.",
      quote: "Their itemized BOQ billing gave us total confidence throughout construction. Zero surprise expenses.",
      author: "Theni Anandham Management"
    },
    {
      id: "vinoth-bjv",
      title: "Vinoth BJV Residence",
      img: "/images/danam/qbic7zxhdojtkqcdzktv.webp",
      beforeImg: "/images/danam/hh4.webp",
      location: "Selvapuram, Madurai",
      type: "residential",
      badge: "Residential Villa",
      area: "3,600 Sq.Ft (G+2)",
      year: "2024",
      duration: "9 Months",
      budget: "Turnkey Luxury Villa",
      desc: "Contemporary residential home engineered with 100% Vastu compliance, cross-ventilation corridors, and custom exterior louvers.",
      quote: "From 3D elevations to handover, the engineers treated our home like their own masterpiece.",
      author: "Vinoth BJV, Homeowner"
    },
    {
      id: "ocean-peacock",
      title: "Ocean Peacock SR",
      img: "/images/danam/FFLiving-002.webp",
      beforeImg: "/images/danam/about-villa.webp",
      location: "Madurai",
      type: "residential",
      badge: "Luxury Villa",
      area: "4,400 Sq.Ft",
      year: "2024",
      duration: "11 Months",
      budget: "Luxury Residential",
      desc: "Architectural luxury villa showcasing double-height living ceilings, imported Italian marble, customized teak doors, and acoustic UPVC double glazing.",
      quote: "The 3D walkaround was exact. Every room and texture looks identical to the initial render.",
      author: "SR Family, Madurai"
    },
    {
      id: "hdfc-govind",
      title: "HDFC Govind Complex",
      img: "/images/danam/HDFC-20Govind-20-20001.webp",
      beforeImg: "/images/danam/hh2.webp",
      location: "HMS Colony, Madurai",
      type: "commercial",
      badge: "Financial Infrastructure",
      area: "Commercial Office",
      year: "2023",
      duration: "8 Months",
      budget: "Turnkey Commercial",
      desc: "Secured banking and corporate infrastructure building with specialized vault foundations, fire suppression MEP systems, and durable tile flooring.",
      quote: "Professional engineers with strict adherence to safety standards and timeline deadlines.",
      author: "Project Coordinator"
    },
    {
      id: "dr-rickesh",
      title: "Dr. Rickesh Residence & Clinic",
      img: "/images/danam/Dr-20rikesh-20-20001.webp",
      beforeImg: "/images/danam/hh1.webp",
      location: "Kadachanendhal, Madurai",
      type: "residential",
      badge: "Residential & Clinic",
      area: "3,200 Sq.Ft",
      year: "2023",
      duration: "9 Months",
      budget: "Turnkey Custom Villa",
      desc: "Integrated residence with private doctor's consultation clinic wing, thermal acoustic insulation, and landscaped terrace garden.",
      quote: "Very smooth process. Handed over right on time without any delay or budget inflation.",
      author: "Dr. Rickesh"
    },
    {
      id: "maruthupandiyar-nagar",
      title: "Maruthupandiyar Nagar Project",
      img: "/images/danam/marthupandiyar-20vk-20model-201.webp",
      beforeImg: "/images/danam/hh3.webp",
      location: "Madurai",
      type: "residential",
      badge: "Residential",
      area: "2,850 Sq.Ft (G+1)",
      year: "2023",
      duration: "7 Months",
      budget: "Residential House",
      desc: "Independent custom residential home completed with Grade-A materials, 53-grade cement, double-washed M-Sand, and weather-proof exterior painting.",
      quote: "Clean workmanship, daily WhatsApp updates, and polite, responsive civil engineers.",
      author: "Homeowner, Maruthupandiyar Nagar"
    },
    {
      id: "vkmp-madurai",
      title: "VKMP Project",
      img: "/images/danam/ktmpja5oicl4edkegt6v.webp",
      beforeImg: "/images/danam/hh5.webp",
      location: "Theppakulam, Madurai",
      type: "renovation",
      badge: "Turnkey EPC",
      area: "Urban Development",
      year: "2024",
      duration: "8 Months",
      budget: "Turnkey Development",
      desc: "Urban project located adjacent to iconic Theppakulam, combining durable civil engineering with functional architectural space utilization.",
      quote: "Danam Holdings has set a benchmark for civil contracting quality in Madurai.",
      author: "Project Committee"
    }
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesType = filterType === "all" || p.type === filterType;
    const matchesDistrict = filterDistrict === "all" || p.location.includes(filterDistrict);
    return matchesType && matchesDistrict;
  });

  return (
    <div className="pt-24 pb-20 bg-surface-0 min-h-screen">
      {/* Header Banner */}
      <section className="bg-surface-1 border-b border-border-subtle py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-brand-forest font-mono text-xs uppercase tracking-widest mb-3 block font-bold">
            350+ Projects Completed Across South India
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-text-primary mb-4">
            {t.projects.heroTitle}
          </h1>
          <p className="font-ui text-sm md:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {t.projects.heroSub}
          </p>
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
              { id: "renovation", label: "Turnkey EPC & Renovation" },
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className="group flex flex-col bg-surface-1 border border-border-subtle hover:border-brand-forest/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image with Tag */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85" />
                
                <div className="absolute top-3.5 left-3.5 bg-black/75 backdrop-blur-md text-white font-mono text-[10px] px-3 py-1 uppercase tracking-wider rounded-full border border-white/20">
                  {p.badge}
                </div>

                <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-leaf-light font-medium mb-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{p.location}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold group-hover:text-brand-leaf-light transition-colors truncate">
                    {p.title}
                  </h3>
                </div>
              </div>

              {/* Card Meta details */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <p className="font-ui text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4">
                  {p.desc}
                </p>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                  <span className="font-ui text-[11px] text-text-tertiary">
                    {p.area}
                  </span>
                  <span className="font-ui text-xs font-bold text-brand-forest group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>View Specifications</span>
                    <span>→</span>
                  </span>
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
              beforeLabel="Structural RCC Skeleton"
              afterLabel="Turnkey Architectural Delivery"
            />
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-surface-0 border border-border-medium rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-surface-0 border-b border-border-subtle px-6 py-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-forest font-bold block">
                  {selectedProject.badge} • {selectedProject.location}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-surface-1 rounded-full text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="rounded-xl overflow-hidden aspect-video bg-stone-900 border border-border-subtle">
                <img
                  src={selectedProject.img}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-surface-1 p-3 rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-text-tertiary uppercase block">Scope</span>
                  <span className="text-xs font-bold text-text-primary">{selectedProject.area}</span>
                </div>
                <div className="bg-surface-1 p-3 rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-text-tertiary uppercase block">Year</span>
                  <span className="text-xs font-bold text-text-primary">{selectedProject.year}</span>
                </div>
                <div className="bg-surface-1 p-3 rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-text-tertiary uppercase block">Duration</span>
                  <span className="text-xs font-bold text-text-primary">{selectedProject.duration}</span>
                </div>
                <div className="bg-surface-1 p-3 rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-text-tertiary uppercase block">Standard</span>
                  <span className="text-xs font-bold text-brand-forest">IS 456 Code</span>
                </div>
              </div>

              <div>
                <h4 className="font-display text-base font-bold text-text-primary mb-2">
                  Project Description & Engineering
                </h4>
                <p className="font-ui text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {selectedProject.desc}
                </p>
              </div>

              {/* Testimonial Quote */}
              <div className="bg-brand-forest/5 border border-brand-forest/20 p-4 rounded-xl">
                <p className="font-ui text-xs italic text-text-primary mb-2">
                  &ldquo;{selectedProject.quote}&rdquo;
                </p>
                <span className="font-ui text-[11px] font-bold text-brand-forest block">
                  — {selectedProject.author}
                </span>
              </div>

              {/* Inquire CTA */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/918110006913?text=${encodeURIComponent(
                    `Hi Danam Holdings, I was checking the ${selectedProject.title} project and would like to build a similar project.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-brand-forest hover:bg-brand-forest-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-md"
                >
                  Consult on Similar Project via WhatsApp
                </a>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    window.dispatchEvent(new CustomEvent("open-lead-modal"));
                  }}
                  className="px-6 py-3 bg-surface-1 hover:bg-surface-2 border border-border-medium rounded-xl text-xs font-bold uppercase tracking-wider text-text-primary transition-colors cursor-pointer"
                >
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
