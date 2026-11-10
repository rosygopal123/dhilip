"use client";
import React, { useState } from "react";
import {
  Star,
  Quote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Clock,
  Play,
  Award,
  BadgeCheck,
  Building2,
  Calendar
} from "lucide-react";

export default function ClientTestimonials() {
  const testimonials = [
    {
      id: "review-1",
      name: "Er. Senthil Kumar & Meenakshi",
      role: "Homeowners (G+1 Contemporary Villa)",
      location: "Koodal Nagar, Madurai",
      handover: "Handed over in 142 Days",
      date: "October 2024",
      sqft: "2,850 Sq.Ft",
      savings: "Zero Price Escalation",
      rating: 5,
      avatarColor: "bg-emerald-600",
      initial: "S",
      image: "/images/danam/FFLiving-002.webp",
      highlight: "Delivered 8 days ahead of schedule with zero price escalation",
      review:
        "Building our first home was terrifying because everyone warned us about contractor delays and endless budget hikes. Danam Holdings gave us an itemized BOQ before digging the first pit. We had live daily WhatsApp photo updates, and we walked through our 3D model beforehand. The final bill matched the first quote to the rupee.",
      features: ["TATA Tiscon 550D Steel", "Italian Marble Finish", "Vastu Compliant Pooja"]
    },
    {
      id: "review-2",
      name: "TSR Srijaysuriya",
      role: "Property Owner & Investor",
      location: "Sikandar Chavadi, Madurai",
      handover: "Handed over in 150 Days",
      date: "August 2024",
      sqft: "3,200 Sq.Ft (G+1 Villa)",
      savings: "IS-456 Concrete Certified",
      rating: 5,
      avatarColor: "bg-amber-600",
      initial: "T",
      image: "/images/danam/about-villa.webp",
      highlight: "Neat finishing quality and rigorous on-site supervision",
      review:
        "Danam Holdings construction service is top-notch in Madurai. The senior engineer explained every milestone clearly — from column casting to 28-day curing tests. Their 3D exterior visualization saved us from making a costly mistake with the balcony facade louvers. Highly disciplined team.",
      features: ["Ultratech M25 RMC", "Acoustic UPVC Glass", "Double Balcony Deck"]
    },
    {
      id: "review-3",
      name: "K. Rengasamy",
      role: "Managing Director, Anandham Group",
      location: "Aruppukottai",
      handover: "Handed over in 10 Months",
      date: "January 2024",
      sqft: "Multi-Storey Showroom",
      savings: "Commercial EPC Scope",
      rating: 5,
      avatarColor: "bg-indigo-600",
      initial: "K",
      image: "/images/danam/l3s2jgqoz98xoktjyzvk.webp",
      highlight: "Column-free retail floor plate delivered without business downtime",
      review:
        "Good site supervision and proper planning throughout the commercial showroom construction. The clear span portal beams and heavy front shutter access were executed with laser-level precision. Progress updates were accurate and execution was completely transparent.",
      features: ["Heavy RCC Column Grids", "Fire Sprinkler Provision", "Commercial Glass Facade"]
    },
    {
      id: "review-4",
      name: "Dr. A. Venkatesh",
      role: "Senior Consultant",
      location: "K.Pudhur, Madurai",
      handover: "Handed over in 115 Days",
      date: "May 2024",
      sqft: "Healthcare Clinic Renovation",
      savings: "Turnkey EPC Contract",
      rating: 5,
      avatarColor: "bg-teal-600",
      initial: "D",
      image: "/images/danam/rvxn271huf5gcqqtdb46.webp",
      highlight: "Acoustic noise isolation & hygienic medical floor finish",
      review:
        "We appreciated the clear estimate, fixed timeline, and regular progress updates. It was easy to work with a single dedicated engineering team for the whole renovation without having to coordinate separate carpenters, electricians, and painters.",
      features: ["Saint-Gobain Acoustic Glass", "Antibacterial Wall Coating", "Concealed Medical Conduit"]
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const current = testimonials[activeIdx];

  const handleOpenLeadModal = () => {
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  return (
    <section className="py-20 bg-surface-1 border-b border-border-subtle select-none relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-brand-forest/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-forest/10 border border-brand-forest/20 text-brand-forest text-xs font-bold uppercase tracking-wider mb-3">
              <BadgeCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified Homeowner & Commercial Reviews</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
              Real Clients. Real Timelines. Zero Escalation.
            </h2>
            <p className="font-ui text-xs sm:text-sm text-text-secondary mt-2 max-w-xl">
              Hear directly from Madurai property owners, doctors, and commercial heads who built their landmark properties with Danam Holdings.
            </p>
          </div>

          {/* Google Review Badge & Nav Arrows */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-surface-0 border border-border-medium px-4 py-2 rounded-2xl shadow-xs">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <div className="text-left font-mono text-xs">
                <strong className="text-text-primary font-bold">4.9 / 5.0</strong>
                <span className="text-text-tertiary block text-[10px]">Over 350+ Projects Handed Over</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-xl bg-surface-0 border border-border-medium flex items-center justify-center text-text-primary hover:bg-brand-forest hover:text-white transition-colors cursor-pointer shadow-xs"
                title="Previous Review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-xl bg-surface-0 border border-border-medium flex items-center justify-center text-text-primary hover:bg-brand-forest hover:text-white transition-colors cursor-pointer shadow-xs"
                title="Next Review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Testimonial Card */}
        <div className="bg-surface-0 border border-border-medium rounded-3xl p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Client Story & Review (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Star rating & verified badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="ml-1.5 font-mono text-xs font-bold text-text-primary">
                    5.0 Verified Handover
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{current.savings}</span>
                </div>
              </div>

              {/* Review highlight quote */}
              <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-text-primary tracking-tight mb-3">
                "{current.highlight}"
              </h3>

              {/* Review text */}
              <p className="font-ui text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
                {current.review}
              </p>

              {/* Specs tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {current.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-xs px-3 py-1 rounded-lg bg-surface-2 text-text-primary border border-border-subtle flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-brand-forest" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Client Bio Footer */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-border-subtle">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${current.avatarColor} text-white font-display text-lg font-bold flex items-center justify-center shadow-md`}>
                  {current.initial}
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-text-primary">
                    {current.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-ui text-text-tertiary">
                    <span>{current.role}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-brand-forest font-medium">
                      <MapPin className="w-3 h-3" />
                      {current.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="font-mono text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{current.handover}</span>
                </span>
                <span className="text-[10px] font-mono text-text-tertiary block mt-1">{current.date}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Actual Project Visual & Handover Badge (5 cols) */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[1/1] border border-border-medium shadow-md group">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/20">
                {current.sqft} Built-up
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-bold uppercase mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Verified Handover Location</span>
              </div>
              <div className="font-display text-sm sm:text-base font-bold text-white">
                {current.location}
              </div>
              <div className="font-mono text-xs text-brand-leaf-light mt-0.5">
                {current.handover} · 100% On-Time
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Social Proof Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { stat: "350+", label: "Civil Projects Handed Over", sub: "Across Madurai & South TN" },
            { stat: "0%", label: "Budget Escalation Rate", sub: "Guaranteed in Legal Contract" },
            { stat: "150 Days", label: "Average Villa Turnkey Delivery", sub: "Milestone-Tracked Gantt" },
            { stat: "100%", label: "Vastu & Structural IS-456", sub: "Earthquake Zone-III Certified" }
          ].map((item, i) => (
            <div key={i} className="bg-surface-0 border border-border-subtle p-4 rounded-2xl text-center shadow-xs">
              <div className="font-display text-2xl sm:text-3xl font-bold text-brand-forest">
                {item.stat}
              </div>
              <div className="font-ui text-xs font-bold text-text-primary mt-1">
                {item.label}
              </div>
              <div className="font-mono text-[10px] text-text-tertiary mt-0.5">
                {item.sub}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
