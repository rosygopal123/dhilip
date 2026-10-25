"use client";
import React from "react";
import { ShieldCheck, Ruler, Scale, Clock, CheckCircle2, Award } from "lucide-react";

export default function StandardsCommitment() {
  const standards = [
    {
      num: "01",
      title: "Quality Construction",
      tagline: "IS-456 Certified Engineering",
      desc: "Good materials and sound workmanship in every structure. Fe550D TMT steel, Ultratech M25/M30 concrete, and strict curing audit logs.",
      icon: ShieldCheck,
      badges: ["Fe550D Super Ductile", "M30 Mix Certified", "28-Day Curing Log"]
    },
    {
      num: "02",
      title: "Professional Execution",
      tagline: "Senior On-Site Supervision",
      desc: "Planned schedules, supervised construction sites, daily digital progress reports, laser-level precision, and trained civil engineering teams.",
      icon: Ruler,
      badges: ["Daily WhatsApp Updates", "Laser Leveling Precision", "Safety Protocols"]
    },
    {
      num: "03",
      title: "Transparent Costing",
      tagline: "100% Itemized BOQ",
      desc: "Detailed line-item material and labour rate analysis before work starts. Zero hidden costs and locked-in milestone budgets.",
      icon: Scale,
      badges: ["Zero Price Escalation", "Transparent Rates", "Milestone Escrow"]
    },
    {
      num: "04",
      title: "Timely Completion",
      tagline: "On-Schedule Handover",
      desc: "Projects tracked closely with milestone Gantt charts so your home, showroom, or facility is delivered on the exact promised date.",
      icon: Clock,
      badges: ["180-Day Turnkey Target", "Milestone Checkpoints", "Keys Handover Ready"]
    }
  ];

  return (
    <section className="relative py-20 bg-[#09150B] text-white overflow-hidden border-y border-white/10 select-none">
      {/* Background ambient texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
        style={{ backgroundImage: "url('/images/danam/hh1.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#09150B] via-[#09150B]/90 to-[#09150B] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 mb-14">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-widest text-brand-leaf-light mb-3">
              <span className="h-px w-8 bg-brand-leaf-light" />
              <span>Our Commitment</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              The Standards We Work By
            </h2>
          </div>
          <p className="font-ui text-xs sm:text-sm text-white/70 max-w-md leading-relaxed">
            Every square foot is engineered with certified Indian Standard codes, transparent pricing, and relentless site quality supervision.
          </p>
        </div>

        {/* 4 Standards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/15 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md shadow-2xl">
          {standards.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="p-7 sm:p-8 flex flex-col justify-between border-b sm:border-b-0 border-white/15 sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 hover:bg-white/5 transition-all duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-sm font-bold tracking-widest text-[#C5A880]">
                      {st.num}
                    </span>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-brand-leaf-light group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-1">
                    {st.tagline}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-brand-leaf-light transition-colors">
                    {st.title}
                  </h3>
                  <p className="font-ui text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
                    {st.desc}
                  </p>
                </div>

                {/* Technical badges */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                  {st.badges.map((b, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/80"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-ui">
          <div className="flex items-center gap-2 text-white/80">
            <Award className="w-4 h-4 text-amber-400" />
            <span>All projects comply strictly with <strong>IS 456:2000 (Plain and Reinforced Concrete)</strong> and <strong>IS 875 (Design Loads)</strong>.</span>
          </div>
          <span className="text-brand-leaf-light font-mono text-[11px] font-semibold uppercase tracking-wider">
            Zero Cost Escalation Guarantee
          </span>
        </div>

      </div>
    </section>
  );
}
