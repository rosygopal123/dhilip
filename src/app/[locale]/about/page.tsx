"use client";
import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import AboutTimeline from "@/components/AboutTimeline";
import { Award, ChevronDown, FileText, Landmark, PhoneCall, ShieldCheck, QrCode, Building2, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();
  const [openRole, setOpenRole] = useState<number | null>(null);

  const toggleRole = (index: number) => {
    setOpenRole(openRole === index ? null : index);
  };

  const directors = [
    {
      initials: "RE",
      name: "R. Elangovan",
      role: "Chairman",
      focus: "Strategic Vision & Corporate Governance",
      desc: "Provides overarching strategic leadership, stakeholder engagement, and high-level corporate governance for Danam Holdings across South India."
    },
    {
      initials: "ES",
      name: "E.N. Suganth",
      role: "Managing Director",
      focus: "Project Operations & Turnkey Site Execution",
      desc: "Directs civil construction logistics, heavy machinery deployment, vendor relations, and rigorous daily site execution across Tamil Nadu."
    },
    {
      initials: "NP",
      name: "N.E. Praveen Elangovan",
      role: "Managing Director",
      focus: "Business Strategy & Client Partnerships",
      desc: "Spearheads business development, client partnerships, EPC bidding, and modern digital construction technologies."
    },
    {
      initials: "SS",
      name: "S. Sumesh",
      role: "GM – Technical",
      focus: "Structural Engineering & Quality Assurance",
      desc: "Master civil engineer overseeing structural load audits, concrete cube laboratory testing, seismic compliance, and total quality assurance."
    }
  ];

  const affiliations = [
    { name: "Junior Chamber International", short: "JCI", logo: "/images/danam/jci.webp" },
    { name: "Business Network International", short: "BNI", logo: "/images/danam/BNI_logo.webp" },
    { name: "Young Indians", short: "Yi", logo: "/images/danam/yi.webp" },
    { name: "Rotary International", short: "Rotary Club", logo: "/images/danam/rotary.jpeg" }
  ];

  const careers = [
    {
      title: "Senior Civil Engineer (Turnkey Projects)",
      location: "Madurai HQ",
      desc: "Supervise high-precision structural concrete, RCC framing, and MEP coordination for residential and commercial sites in Madurai.",
      requirements: "B.E. Civil, 5+ Years site supervision experience. IS 456 knowledge required.",
    },
    {
      title: "Quantity Surveyor & BOQ Estimator",
      location: "Madurai Office",
      desc: "Perform detailed material takeoffs, rate analysis, contractor billing verification, and tender preparation.",
      requirements: "Diploma / B.E. Civil with minimum 3 years in quantity surveying.",
    },
    {
      title: "Site Supervisor (Finishing & Interiors)",
      location: "Madurai / South TN",
      desc: "Coordinate flooring, false ceilings, UPVC window installations, waterproofing, and quality handovers.",
      requirements: "Diploma in Civil Engineering with 3+ years field execution experience.",
    },
  ];

  return (
    <div className="relative w-full pt-20">
      {/* 1. Hero Section */}
      <section className="relative py-28 flex items-center justify-center overflow-hidden bg-[#060E08] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-[1px] opacity-35 scale-105"
          style={{ backgroundImage: "url('/images/danam/hh5.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060E08]/90 via-[#060E08]/75 to-[#060E08] z-10" />

        <div className="relative z-20 text-center max-w-4xl px-6">
          <span className="text-brand-leaf-light font-mono text-xs uppercase tracking-widest mb-3 block font-bold">
            ABOUT DANAM HOLDINGS
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Building Better Spaces.<br />Creating Lasting Value.
          </h1>
          <p className="font-ui text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            A premier civil engineering & turnkey EPC construction company built on structural integrity, cost transparency, and on-time delivery across South India.
          </p>
        </div>
      </section>

      {/* 2. Background Story Section */}
      <section className="py-24 bg-surface-0 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Image */}
            <div className="lg:col-span-5 relative aspect-square overflow-hidden bg-surface-2 border border-brand-forest/20 rounded-2xl shadow-xl group">
              <img
                src="/images/danam/hh2.webp"
                alt="Danam Holdings site"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white font-mono text-[10px] px-3 py-1 tracking-wider uppercase rounded-lg border border-white/20">
                Madurai HQ • 10+ Years Excellence
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <span className="text-brand-forest font-mono text-xs uppercase tracking-widest mb-2 block font-bold">
                Our Foundation
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-6">
                Turnkey Civil Engineering Under One Roof
              </h2>
              <p className="font-ui text-sm text-text-secondary leading-relaxed mb-4">
                <strong className="text-text-primary">DANAM HOLDINGS</strong> provides complete construction and project management solutions, bringing together architectural design, civil construction, building renovation, and professional consultancy under one roof.
              </p>
              <p className="font-ui text-sm text-text-secondary leading-relaxed mb-6">
                With over a decade of hands-on civil execution and 350+ completed projects across South India, we eliminate guesswork through transparent itemized BOQ billing, senior engineer site supervision, and rigorous adherence to IS-456 structural codes.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle">
                <div>
                  <span className="font-display text-2xl md:text-3xl font-bold text-brand-forest block">10+</span>
                  <span className="text-[11px] uppercase tracking-wider text-text-tertiary font-bold">Years Experience</span>
                </div>
                <div>
                  <span className="font-display text-2xl md:text-3xl font-bold text-brand-forest block">350+</span>
                  <span className="text-[11px] uppercase tracking-wider text-text-tertiary font-bold">Completed Sites</span>
                </div>
                <div>
                  <span className="font-display text-2xl md:text-3xl font-bold text-brand-forest block">IS 456</span>
                  <span className="text-[11px] uppercase tracking-wider text-text-tertiary font-bold">Structural Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Board of Directors */}
      <section className="py-24 bg-[#09150B] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="text-brand-leaf-light font-mono text-xs uppercase tracking-widest mb-2 block font-bold">
            Leadership
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Board of Directors & Management
          </h2>
          <p className="font-ui text-xs md:text-sm text-white/70 tracking-wide mb-16 max-w-xl mx-auto">
            Direct executive oversight, technical governance, and client dedication.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {directors.map((member, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 hover:border-brand-leaf/50 p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5 shadow-lg"
              >
                {/* Initials Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-display text-xl font-bold mb-4 shadow-inner">
                  {member.initials}
                </div>
                <h4 className="font-display text-lg font-bold text-white mb-1">
                  {member.name}
                </h4>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  {member.role}
                </span>
                <span className="text-[11px] font-semibold text-brand-leaf-light mb-3">
                  {member.focus}
                </span>
                <p className="font-ui text-xs text-white/65 leading-relaxed mt-auto">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Affiliations & Industry Memberships */}
      <section className="py-20 bg-surface-1 border-b border-border-subtle text-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="text-brand-forest font-mono text-xs uppercase tracking-widest mb-2 block font-bold">
            Recognition
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-3">
            Industry & Business Forum Memberships
          </h2>
          <p className="font-ui text-xs md:text-sm text-text-secondary max-w-lg mx-auto mb-12">
            Active members of prestigious business, engineering, and youth associations.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {affiliations.map((a, idx) => (
              <div
                key={idx}
                className="bg-surface-0 border border-border-subtle p-6 rounded-2xl flex flex-col items-center justify-center hover:border-brand-forest/40 transition-all shadow-xs"
              >
                <div className="h-16 w-full flex items-center justify-center mb-3">
                  <img src={a.logo} alt={a.name} className="max-h-12 w-auto object-contain" />
                </div>
                <h4 className="font-display text-sm font-bold text-text-primary">{a.short}</h4>
                <span className="text-[10px] text-text-tertiary text-center mt-1">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Careers Section */}
      <section className="py-24 bg-surface-0">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-brand-forest font-mono text-xs uppercase tracking-widest mb-2 block text-center font-bold">
            Join Our Team
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-center mb-12">
            Build Your Career at Danam Holdings
          </h2>

          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {careers.map((c, idx) => (
              <div
                key={idx}
                className="border border-border-subtle bg-surface-1 rounded-xl overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => toggleRole(idx)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left font-display font-bold text-base text-text-primary hover:text-brand-forest transition-colors cursor-pointer"
                >
                  <span>
                    {c.title}{" "}
                    <span className="font-mono text-[10px] text-brand-forest font-bold uppercase tracking-wider ml-2">
                      ({c.location})
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openRole === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openRole === idx ? "max-h-[300px] border-t border-border-subtle" : "max-h-0"
                  }`}
                >
                  <div className="p-6 flex flex-col gap-3 text-xs font-ui text-text-secondary leading-relaxed bg-surface-0">
                    <p>{c.desc}</p>
                    <p className="font-semibold text-text-primary">Requirements: {c.requirements}</p>
                    <a
                      href={`https://wa.me/918883332499?text=Hi%20Danam%20Holdings%2C%20I%20am%20applying%20for%20the%20${encodeURIComponent(c.title)}%20role.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-brand-forest hover:bg-brand-forest-dark text-white font-bold py-2 px-4 uppercase tracking-wider font-mono text-[10px] rounded-lg self-start transition-colors"
                    >
                      Apply via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
