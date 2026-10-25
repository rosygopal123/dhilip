"use client";
import React, { useState } from "react";
import { HelpCircle, ChevronDown, MessageCircle, Phone, ArrowRight, Search } from "lucide-react";

export default function HomeFAQ() {
  const faqs = [
    {
      q: "What types of projects does Danam Holdings handle?",
      a: "We handle residential villas, commercial showrooms, retail complexes, and industrial facilities — including new building construction, architectural design, structural retrofitting, MEP services, and end-to-end Turnkey EPC contracts across Madurai and South India.",
      category: "Scope & Services"
    },
    {
      q: "Do you offer turnkey construction?",
      a: "Yes. We take complete ownership of your project from soil testing, architectural 2D/3D planning, foundation, structural RCC framework, electrical/plumbing (MEP), interior woodworks, all the way to final key handover. You deal with one single dedicated engineering team.",
      category: "Turnkey EPC"
    },
    {
      q: "Can you help with design and 3D views before construction starts?",
      a: "Yes! Our in-house architectural studio prepares comprehensive 2D floor plans, 3D exterior elevations, structural reinforcement shop drawings, and photorealistic 360° interior walkthroughs so you can inspect and approve every detail before laying a single brick.",
      category: "3D & Architecture"
    },
    {
      q: "Do you prepare cost estimates and BOQs?",
      a: "Yes. We prepare 100% itemized Bill of Quantities (BOQs) with detailed rate analysis for materials (TMT steel, cement, sand, tiles) and labour. Your budget is locked with zero mid-construction price escalation surprises.",
      category: "Cost & Budget"
    },
    {
      q: "Can you repair or renovate an existing building?",
      a: "Yes. Our structural rehabilitation division handles building repair and renovation, RCC crack injection, concrete column jacketing, 5-layer terrace waterproofing, leakage remediation, painting, and complete modern facade upgrades.",
      category: "Renovation"
    },
    {
      q: "Can you manage a project that another contractor is building?",
      a: "Yes. Our Project Management Consultancy (PMC) services provide independent quality audits, steel and concrete slump testing, weekly Gantt chart progress tracking, contractor measurement verification, and client representation.",
      category: "PMC Consultancy"
    },
    {
      q: "How do I get a quote for my project?",
      a: "Simply call us, click the WhatsApp button, or submit our quick estimate modal with your plot size, location, and requirement. Our senior engineers will prepare a preliminary BOQ estimate within 24 to 48 hours free of cost.",
      category: "Process & Estimates"
    },
    {
      q: "Where is your office located in Madurai?",
      a: "Our head office is located at Plot No. 1, Gokulam Avenue, Renganayaki Ammal Street, Kamarajar Salai, Madurai – 625009. You are welcome to visit our engineering design studio for an in-person consultation.",
      category: "Location & Office"
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0); // First open by default
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenLeadModal = () => {
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const handleOpenWhatsApp = (question?: string) => {
    const text = encodeURIComponent(
      question
        ? `Hi Danam Holdings, I have a question regarding: "${question}"`
        : `Hi Danam Holdings, I have a quick construction question about my upcoming building project.`
    );
    window.open(`https://wa.me/918110006913?text=${text}`, "_blank");
  };

  return (
    <section className="py-20 bg-surface-0 border-b border-border-subtle select-none">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-forest/10 border border-brand-forest/20 text-brand-forest text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
            Frequently Asked Questions
          </h2>
          <p className="font-ui text-xs sm:text-sm text-text-secondary mt-2">
            Clear answers to help you make informed decisions before building or renovating.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions (e.g., turnkey, 3D, BOQ, cost)..."
            className="w-full bg-surface-1 border border-border-medium rounded-xl py-3 pl-11 pr-4 text-xs font-ui text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-all"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-surface-1 border border-border-medium rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-surface-0/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-forest shrink-0" />
                    <span className="font-display text-sm sm:text-base font-bold text-text-primary">
                      {faq.q}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-lg bg-surface-0 border border-border-subtle shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-brand-forest text-white" : "text-text-secondary"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border-subtle/50 font-ui animate-in fade-in duration-200">
                    <p className="mb-3">{faq.a}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-0 border border-border-subtle text-brand-forest font-semibold">
                        {faq.category}
                      </span>
                      <button
                        onClick={() => handleOpenWhatsApp(faq.q)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Clarify with an Engineer</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 rounded-2xl bg-brand-forest/5 border border-brand-forest/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-display text-base font-bold text-text-primary">
              Have a specific plot or engineering question?
            </h4>
            <p className="font-ui text-xs text-text-secondary mt-0.5">
              Speak directly with our senior civil engineering team today.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleOpenLeadModal}
              className="px-5 py-2.5 rounded-xl bg-brand-forest hover:bg-brand-forest-dark text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              Get Free Consultation
            </button>
            <a
              href="tel:+918110006913"
              className="p-2.5 rounded-xl border border-border-medium hover:border-brand-forest text-text-primary hover:text-brand-forest transition-colors"
              title="Call Us Directly"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
