"use client";
import React from "react";
import { Phone, MessageCircle, FileSpreadsheet, ArrowUpRight } from "lucide-react";

export default function MobileQuickBar() {
  const handleOpenLeadModal = () => {
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      "Hi Danam Holdings, I would like to consult with an engineer regarding my plot construction / renovation project."
    );
    window.open(`https://wa.me/918110006913?text=${text}`, "_blank");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-[#0a0f0d]/95 backdrop-blur-xl border-t border-white/15 px-3 py-2.5 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-between gap-2">
        {/* Call Button */}
        <a
          href="tel:+918110006913"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-1 border border-white/15 text-white text-xs font-semibold hover:bg-white/10 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp Button */}
        <button
          onClick={handleOpenWhatsApp}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/40 transition-colors cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>WhatsApp</span>
        </button>

        {/* Free BOQ Lead Modal Button with Accent */}
        <button
          onClick={handleOpenLeadModal}
          className="flex-1.2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-brand-forest text-white text-xs font-bold uppercase tracking-wider shadow-lg ring-1 ring-white/20 active:scale-95 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
          <span>Free BOQ</span>
        </button>
      </div>
    </div>
  );
}
