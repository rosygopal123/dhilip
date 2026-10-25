"use client";
import React from "react";
import { Building2, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TrustedClients() {
  const clients = [
    {
      name: "Thangamayil Jewellery",
      category: "Retail Flagship",
      logo: "/images/logos/thanga-20mail.webp"
    },
    {
      name: "Sita Ram Jewellers",
      category: "Jewellery Elevation",
      logo: "/images/logos/sita-20ram-20jewellers.webp"
    },
    {
      name: "OYO Rooms",
      category: "Hospitality Infrastructure",
      logo: "/images/logos/oyo.webp"
    },
    {
      name: "SACS Infrastructure",
      category: "Educational Campus",
      logo: "/images/logos/sacs.png"
    },
    {
      name: "Theni Anandham",
      category: "Commercial Showroom",
      logo: "/images/logos/theni-20anantham.webp"
    },
    {
      name: "Rajmahal Aishvaryam",
      category: "Turnkey EPC Showroom",
      logo: "/images/logos/Rajmahal.jpeg"
    },
    {
      name: "MSD Commercial",
      category: "Retail Complex",
      logo: "/images/logos/msd.webp"
    }
  ];

  const affiliations = [
    { name: "BNI Member", logo: "/images/logos/BNI_logo.webp" },
    { name: "JCI International", logo: "/images/logos/jci.webp" },
    { name: "Rotary International", logo: "/images/logos/rotary.jpeg" },
    { name: "Young Indians (Yi)", logo: "/images/logos/yi.webp" }
  ];

  return (
    <section className="py-20 bg-surface-0 border-b border-border-subtle select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-forest/10 border border-brand-forest/20 text-brand-forest text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Commercial & Institutional Footprint</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Trusted by Respected Names
          </h2>
          <p className="font-ui text-xs sm:text-sm text-text-secondary mt-2">
            Leading brands, institutions, and family businesses rely on Danam Holdings for uncompromising structural execution.
          </p>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {clients.map((c, idx) => (
            <div
              key={idx}
              className="group bg-surface-1 hover:bg-surface-0 border border-border-medium hover:border-brand-forest/40 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg min-h-[140px]"
            >
              <div className="relative w-full h-14 flex items-center justify-center mb-3">
                <img
                  src={c.logo}
                  alt={c.name}
                  className="max-h-12 max-w-[130px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>
              <h4 className="font-display text-xs sm:text-sm font-bold text-text-primary text-center truncate max-w-full">
                {c.name}
              </h4>
              <span className="font-mono text-[10px] text-brand-forest tracking-wider uppercase mt-0.5">
                {c.category}
              </span>
            </div>
          ))}

          {/* Turnkey Stats Tile to round out the grid */}
          <div className="bg-brand-forest/5 border border-brand-forest/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <span className="font-display text-3xl font-bold text-brand-forest mb-1">
              350+
            </span>
            <span className="font-ui text-xs font-bold text-text-primary uppercase tracking-wider">
              Landmarks Delivered
            </span>
            <span className="font-mono text-[10px] text-text-secondary mt-1">
              Madurai & South India
            </span>
          </div>
        </div>

        {/* Corporate & Professional Affiliations Sub-Bar */}
        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
            <ShieldCheck className="w-4 h-4 text-brand-forest" />
            <span>Active Institutional & Leadership Affiliations:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {affiliations.map((a, i) => (
              <div key={i} className="flex items-center gap-2 opacity-75 hover:opacity-100 transition-opacity">
                <img
                  src={a.logo}
                  alt={a.name}
                  className="h-6 w-auto object-contain"
                />
                <span className="font-ui text-xs font-semibold text-text-primary">
                  {a.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
