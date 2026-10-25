"use client";
import React, { useState } from "react";
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";

export default function ClientTestimonials() {
  const testimonials = [
    {
      id: "review-1",
      name: "TSR srijaysuriya",
      initial: "T",
      role: "Property Owner",
      project: "Residential Luxury Villa EPC",
      location: "Madurai",
      time: "Recent Handover",
      rating: 5,
      review: "Danam Holdings construction service is good. The team explained every stage clearly and completed on schedule. Well organized supervision and the finishing quality was neat without any issues.",
      highlight: "Completed on schedule · Neat finishing quality"
    },
    {
      id: "review-2",
      name: "K. Rengasamy",
      initial: "K",
      role: "Commercial Director",
      project: "Commercial Flagship Showroom",
      location: "Aruppukottai",
      time: "Verified Client",
      rating: 5,
      review: "Good site supervision and proper planning. The work was handled in an organised way from start to handover. Progress updates were accurate and execution was completely transparent.",
      highlight: "Accurate progress updates · 100% transparent execution"
    },
    {
      id: "review-3",
      name: "Dr. A. Venkatesh",
      initial: "D",
      role: "Senior Consultant",
      project: "Healthcare Building Renovation",
      location: "Madurai",
      time: "Verified Medical Project",
      rating: 5,
      review: "We appreciated the clear estimate and regular progress updates. It was easy to work with a single dedicated engineering team for the whole renovation project. Highly recommended.",
      highlight: "Single dedicated team · Clear estimate"
    },
    {
      id: "review-4",
      name: "P. Sundararajan",
      initial: "P",
      role: "Villa Owner",
      project: "Contemporary G+1 Residence",
      location: "K.Pudhur, Madurai",
      time: "Turnkey Delivery",
      rating: 5,
      review: "From 2D structural drawings and 3D exterior views to final key handover, there was zero cost escalation. They adhered strictly to the agreed BOQ and TATA Tiscon steel specifications.",
      highlight: "Zero cost escalation · Strict BOQ adherence"
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="py-20 bg-surface-1 border-b border-border-subtle select-none relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-brand-forest/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-forest/10 border border-brand-forest/20 text-brand-forest text-xs font-bold uppercase tracking-wider mb-3">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Verified Client Reviews</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
              What Our Clients Say
            </h2>
            <p className="font-ui text-xs sm:text-sm text-text-secondary mt-2 max-w-xl">
              Hear directly from homeowners, commercial directors, and doctors who trusted Danam Holdings with their milestone buildings.
            </p>
          </div>

          {/* Rating Aggregate Pill */}
          <div className="bg-surface-0 border border-border-medium rounded-2xl p-4 sm:px-6 flex items-center gap-4 shadow-sm">
            <div className="text-center border-r border-border-subtle pr-4">
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-brand-forest block leading-none">
                4.9
              </span>
              <span className="text-[10px] font-mono uppercase text-text-secondary">out of 5.0</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                ))}
              </div>
              <span className="text-xs font-ui font-semibold text-text-primary block">
                350+ Projects Handed Over
              </span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className="bg-surface-0 border border-border-medium hover:border-brand-forest/40 rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-brand-forest/10 group-hover:text-brand-forest/20 transition-colors pointer-events-none" />

              <div>
                {/* Rating stars & badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Project</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="font-ui text-sm sm:text-base text-text-primary leading-relaxed mb-6 italic">
                  "{t.review}"
                </p>

                {/* Key Takeaway Pill */}
                <div className="mb-6">
                  <span className="inline-block text-[11px] font-mono px-2.5 py-1 rounded-lg bg-surface-1 border border-border-subtle text-brand-forest font-semibold">
                    ✓ {t.highlight}
                  </span>
                </div>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-border-subtle flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-forest/10 text-brand-forest font-bold flex items-center justify-center font-display text-sm border border-brand-forest/20">
                    {t.initial}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-text-primary">
                      {t.name}
                    </h4>
                    <span className="font-ui text-xs text-text-secondary block">
                      {t.project} · {t.location}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-[10px] text-text-secondary hidden sm:inline">
                  {t.time}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
