"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import ScrollCanvas from "@/components/ScrollCanvas";
import Project3DExperience from "@/components/Project3DExperience";
import InteriorTour360 from "@/components/InteriorTour360";
import StandardsCommitment from "@/components/StandardsCommitment";
import TrustedClients from "@/components/TrustedClients";
import ClientTestimonials from "@/components/ClientTestimonials";
import HomeFAQ from "@/components/HomeFAQ";
import MobileQuickBar from "@/components/MobileQuickBar";
import { ChevronRight, Star, ShieldCheck, Award, Building2, CheckCircle2 } from "lucide-react";

// Custom Stat Counter Component
function StatCard({ number, label, suffix = "" }: { number: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = number;
          if (start === end) return;
          
          const totalDuration = 2000;
          const incrementTime = Math.max(Math.floor(totalDuration / end), 30);
          
          const timer = setInterval(() => {
            start += Math.ceil(end / 60);
            if (start >= end) {
              clearInterval(timer);
              setCount(end);
            } else {
              setCount(start);
            }
          }, incrementTime);

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, [number]);

  return (
    <div
      ref={cardRef}
      className="bg-surface-0 border border-brand-forest/20 p-8 flex flex-col justify-between min-h-[160px] text-left hover:border-brand-forest transition-all duration-300 shadow-sm rounded-xl select-none"
    >
      <span className="font-display text-4xl md:text-5xl font-bold text-brand-forest mb-2">
        {count}
        {suffix}
      </span>
      <span className="font-ui text-xs md:text-sm text-text-primary uppercase tracking-wider font-semibold whitespace-pre-line">
        {label}
      </span>
    </div>
  );
}

export default function HomePage() {
  const { locale, t } = useLanguage();

  const handleOpenLeadModal = () => {
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const danamFeaturedProjects = [
    {
      title: "Rajmahal Aishvaryam",
      img: "/images/danam/ddhvrktrjjjln58schqk.webp",
      location: "Madurai",
      type: "Turnkey EPC Showroom",
      scope: "Landmark Commercial"
    },
    {
      title: "Theni Anandham",
      img: "/images/danam/l3s2jgqoz98xoktjyzvk.webp",
      location: "Aruppukottai",
      type: "Commercial Complex",
      scope: "Retail Flagship"
    },
    {
      title: "SACS Landmark",
      img: "/images/danam/rvxn271huf5gcqqtdb46.webp",
      location: "K.Pudhur, Madurai",
      type: "Civil Infrastructure",
      scope: "Turnkey Civil"
    },
    {
      title: "Ocean Peacock SR",
      img: "/images/danam/FFLiving-002.webp",
      location: "Madurai",
      type: "Luxury Residential Villa",
      scope: "Contemporary Architecture"
    }
  ];

  return (
    <div className="relative w-full">
      {/* 1. Scroll-Scrubbed Canvas Hero */}
      <section id="hero-section" className="w-full">
        <ScrollCanvas />
      </section>

      {/* 2. Hero Unpin CTA & Stats Section */}
      <section className="relative py-20 blueprint-grid text-center overflow-hidden border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-forest/10 border border-brand-forest/20 text-brand-forest text-xs font-bold uppercase tracking-wider mb-4">
              Building Better Spaces • Creating Lasting Value
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
              {t.hero.ready}
            </h2>
            <p className="font-ui text-sm md:text-base text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
              Tell us what you plan to build or renovate. Our senior civil engineering team will guide you with transparent BOQ pricing and 3D architectural models.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={handleOpenLeadModal}
                className="bg-brand-forest hover:bg-brand-forest-dark text-white font-bold px-7 py-3.5 rounded-lg text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer"
              >
                Request a Free Quote
              </button>
              <Link
                href={`/${locale}/projects`}
                className="border border-brand-forest hover:bg-brand-forest hover:text-white text-brand-forest font-bold px-7 py-3.5 rounded-lg text-xs uppercase tracking-widest transition-all duration-300"
              >
                Explore 3D Projects
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <StatCard number={350} suffix="+" label="Completed Projects Across South India" />
            <StatCard number={10} suffix="+" label="Years of Civil Engineering Excellence" />
            <StatCard number={100} suffix="%" label="Structural Integrity & On-Time Delivery" />
            <StatCard number={4} suffix=" Steps" label="Milestone-Driven Engineering Process" />
          </div>
        </div>
      </section>

      {/* 3. Interactive 3D Project Experience (Exterior Walkaround) */}
      <Project3DExperience />

      {/* 4. 360° Interior Room-by-Room Architectural Walkthrough */}
      <InteriorTour360 />

      {/* 4. Core Offerings Grid */}
      <section className="py-24 bg-surface-0 border-b border-border-subtle text-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="text-brand-forest font-mono text-xs uppercase tracking-widest mb-2 block font-bold">
            Our Expertise
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-3">
            {t.services.title}
          </h2>
          <p className="font-ui text-sm text-text-secondary tracking-wide mb-16 max-w-xl mx-auto">
            Design, Civil Construction, Structural Steel, Interiors & Renovation — All Under One Roof.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Civil Construction */}
            <Link
              href={`/${locale}/services`}
              className="relative aspect-video lg:aspect-[4/5] overflow-hidden group select-none block rounded-2xl shadow-md border border-border-subtle"
            >
              <img
                src="/images/danam/hh2.webp"
                alt="Civil construction"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent group-hover:via-black/35 transition-colors duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-left text-white z-10">
                <span className="text-brand-leaf-light font-mono text-[11px] tracking-widest uppercase mb-1.5 font-bold">
                  Phase 01
                </span>
                <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-brand-leaf-light transition-colors">
                  Civil Construction
                </h3>
                <p className="font-ui text-xs text-white/80 line-clamp-3 leading-relaxed mb-4">
                  Turnkey residential houses, luxury villas, commercial retail buildings, and industrial facilities.
                </p>
                <div className="flex items-center gap-1 text-xs text-brand-leaf-light font-bold uppercase tracking-widest mt-auto">
                  <span>Explore Offerings</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Card 2: Structural Works */}
            <Link
              href={`/${locale}/services`}
              className="relative aspect-video lg:aspect-[4/5] overflow-hidden group select-none block rounded-2xl shadow-md border border-border-subtle"
            >
              <img
                src="/images/danam/hh4.webp"
                alt="Structural steel & RCC"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent group-hover:via-black/35 transition-colors duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-left text-white z-10">
                <span className="text-brand-leaf-light font-mono text-[11px] tracking-widest uppercase mb-1.5 font-bold">
                  Phase 02
                </span>
                <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-brand-leaf-light transition-colors">
                  Structural & Steel Works
                </h3>
                <p className="font-ui text-xs text-white/80 line-clamp-3 leading-relaxed mb-4">
                  Seismic-resistant RCC frames, structural steel erection, mezzanine floors, and PEB industrial sheds.
                </p>
                <div className="flex items-center gap-1 text-xs text-brand-leaf-light font-bold uppercase tracking-widest mt-auto">
                  <span>Explore Offerings</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Card 3: 3D Design & Interior */}
            <Link
              href={`/${locale}/services`}
              className="relative aspect-video lg:aspect-[4/5] overflow-hidden group select-none block rounded-2xl shadow-md border border-border-subtle"
            >
              <img
                src="/images/danam/hh1.webp"
                alt="3D Design & Interiors"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent group-hover:via-black/35 transition-colors duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-left text-white z-10">
                <span className="text-brand-leaf-light font-mono text-[11px] tracking-widest uppercase mb-1.5 font-bold">
                  Phase 03
                </span>
                <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-brand-leaf-light transition-colors">
                  3D Design & Turnkey Fit-Outs
                </h3>
                <p className="font-ui text-xs text-white/80 line-clamp-3 leading-relaxed mb-4">
                  2D floor plans, realistic 3D elevation renders, MEP engineering, and premium interior woodworks.
                </p>
                <div className="flex items-center gap-1 text-xs text-brand-leaf-light font-bold uppercase tracking-widest mt-auto">
                  <span>Explore Offerings</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. The Standards We Work By (IS-456, BOQ, On-Time Handover) */}
      <StandardsCommitment />

      {/* 6. Landmark Completed Projects */}
      <section className="py-24 bg-surface-1 text-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="text-brand-forest font-mono text-xs uppercase tracking-widest mb-2 block font-bold">
            Portfolio Showcase
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary tracking-tight mb-3">
            Landmark Completed Deliveries
          </h2>
          <p className="font-ui text-sm text-text-secondary max-w-xl mx-auto mb-16">
            A snapshot of our 350+ completed projects across Madurai and South India.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {danamFeaturedProjects.map((p, idx) => (
              <div key={idx} className="flex flex-col text-left group">
                <div className="relative aspect-[3/2] w-full overflow-hidden mb-4 bg-stone-900 rounded-2xl shadow-md border border-border-subtle">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-sm text-white font-mono text-[9px] px-3 py-1 uppercase tracking-widest rounded-full border border-white/20">
                    {p.type}
                  </div>
                </div>
                <div className="flex justify-between items-start px-1">
                  <div>
                    <h4 className="font-display text-lg md:text-xl font-bold text-text-primary group-hover:text-brand-forest transition-colors">
                      {p.title}
                    </h4>
                    <span className="font-ui text-xs text-text-secondary">
                      {p.location} • {p.scope}
                    </span>
                  </div>
                  <Link
                    href={`/${locale}/projects`}
                    className="text-xs text-brand-forest border-b border-transparent group-hover:border-brand-forest transition-all duration-300 font-bold tracking-wider uppercase flex items-center gap-1"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-forest hover:bg-brand-forest-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <span>Explore All 350+ Projects</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Trusted By Respected Names (Client Brand Logos Grid & Affiliations) */}
      <TrustedClients />

      {/* 8. What Our Clients Say (Verified Client Reviews & 4.9★ Rating) */}
      <ClientTestimonials />

      {/* 9. Frequently Asked Questions (FAQ Accordion with Search) */}
      <HomeFAQ />

      {/* 10. Affiliations & Certifications Marquee */}
      <section className="py-7 bg-[#060E08] overflow-hidden select-none border-y border-white/10">
        <div className="flex animate-[marquee_35s_linear_infinite] whitespace-nowrap gap-12 text-white/85 items-center text-xs font-mono tracking-widest uppercase">
          {[...Array(3)].map((_, listIdx) => (
            <React.Fragment key={listIdx}>
              <span className="text-brand-leaf-light font-bold">DANAM HOLDINGS</span>
              <span className="text-amber-400">•</span>
              <span>IS 456 STRUCTURAL CODE</span>
              <span className="text-amber-400">•</span>
              <span>JCI MEMBER</span>
              <span className="text-amber-400">•</span>
              <span>BNI MEMBER</span>
              <span className="text-amber-400">•</span>
              <span>YOUNG INDIANS (YI)</span>
              <span className="text-amber-400">•</span>
              <span>ROTARY INTERNATIONAL</span>
              <span className="text-amber-400">•</span>
              <span>10+ YEARS EXCELLENCE</span>
              <span className="text-amber-400">•</span>
              <span>350+ PROJECTS HANDED OVER</span>
              <span className="text-amber-400">•</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="relative py-28 bg-[#09150B] text-white text-center overflow-hidden">
        <img
          src="/images/danam/hh5.webp"
          alt="Danam landmark site"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09150B]/90 via-[#09150B]/80 to-[#09150B] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-brand-leaf-light text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
            Start Your Milestone Today
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Ready to turn your plot into a landmark?
          </h2>
          <p className="font-ui text-sm md:text-base text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
            Experience complete cost transparency, certified IS-code engineering, and lifetime peace of mind.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleOpenLeadModal}
              className="bg-brand-forest hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 w-full sm:w-auto shadow-xl cursor-pointer"
            >
              Get Free Estimate & BOQ
            </button>
            <Link
              href={`/${locale}/contact`}
              className="border border-white/40 hover:bg-white hover:text-black text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 w-full sm:w-auto"
            >
              Contact Our Engineers
            </Link>
          </div>
        </div>
      </section>

      {/* 12. Floating Mobile Quick-Action Bar (Call + WhatsApp + Free BOQ) */}
      <MobileQuickBar />
    </div>
  );
}
