"use client";
import React, { useState, useEffect } from "react";
import { MessageSquare, X, Send, Calendar, Calculator, UserCheck } from "lucide-react";

export default function WhatsAppFloat() {
  const [pulse, setPulse] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState("Turnkey Construction");

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    const interval = setInterval(() => {
      setPulse(true);
      timerId = setTimeout(() => setPulse(false), 2000);
    }, 8000);

    return () => {
      clearInterval(interval);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const handleLaunchWhatsApp = async (customText?: string) => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918110006913";
    const textToSend =
      customText ||
      `Hi Danam Holdings, I would like to inquire about a civil construction / turnkey project in Madurai / South India. (Service: ${intent})`;

    // Automatically log lead event if phone is provided
    if (phone) {
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || "WhatsApp Lead",
            mobile: phone,
            district: "Madurai",
            projectType: intent,
            source: "WhatsApp Floating Widget",
          }),
        });
      } catch (e) {
        console.error("WhatsApp lead logging error:", e);
      }
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(whatsappUrl, "_blank");
    setOpenDrawer(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Quick Action Drawer */}
      {openDrawer && (
        <div className="mb-4 w-80 bg-surface-0 border border-brand-forest/20 shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex justify-between items-center mb-3 border-b border-border-subtle pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-ui text-xs font-bold text-text-primary uppercase tracking-wider">
                Danam Holdings Desk
              </span>
            </div>
            <button
              onClick={() => setOpenDrawer(false)}
              className="text-text-tertiary hover:text-text-primary p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="font-ui text-[11px] text-text-secondary mb-3 leading-relaxed">
            Connect directly with our senior civil engineering team on WhatsApp.
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-col gap-1.5 mb-4">
            <button
              onClick={() =>
                handleLaunchWhatsApp(
                  "Hi Danam Holdings, I would like a Cost Estimate & BOQ for my construction project."
                )
              }
              className="w-full text-left font-ui text-xs px-3 py-2 bg-surface-1 hover:bg-brand-forest hover:text-white transition-colors border border-border-subtle flex items-center gap-2"
            >
              <Calculator className="w-3.5 h-3.5 text-brand-forest" />
              <span>Request Cost Estimate & BOQ</span>
            </button>

            <button
              onClick={() =>
                handleLaunchWhatsApp(
                  "Hi Danam Holdings, I would like to schedule a site inspection in Madurai/Tamil Nadu."
                )
              }
              className="w-full text-left font-ui text-xs px-3 py-2 bg-surface-1 hover:bg-brand-forest hover:text-white transition-colors border border-border-subtle flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-forest" />
              <span>Schedule Free Site Inspection</span>
            </button>

            <button
              onClick={() =>
                handleLaunchWhatsApp(
                  "Hi Danam Holdings, I would like to view your 3D Architectural Renders & Projects."
                )
              }
              className="w-full text-left font-ui text-xs px-3 py-2 bg-surface-1 hover:bg-brand-forest hover:text-white transition-colors border border-border-subtle flex items-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-forest" />
              <span>Request 3D Villa Experience</span>
            </button>
          </div>

          {/* Lead Quick Capture input */}
          <div className="space-y-2 border-t border-border-subtle pt-3">
            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full font-ui text-xs px-3 py-1.5 bg-surface-1 border border-border-subtle focus:border-brand-forest focus:outline-none"
            />
            <input
              type="tel"
              placeholder="WhatsApp Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full font-ui text-xs px-3 py-1.5 bg-surface-1 border border-border-subtle focus:border-brand-forest focus:outline-none"
            />
            <button
              onClick={() => handleLaunchWhatsApp()}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-ui text-xs font-semibold uppercase tracking-wider py-2 flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Start WhatsApp Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Button */}
      <button
        onClick={() => setOpenDrawer(!openDrawer)}
        className={`group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 select-none ${
          pulse ? "ring-4 ring-[#25D366]/40" : ""
        }`}
        aria-label="Contact Danam Holdings via WhatsApp"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-[#25D366] rounded-full" />
        </div>
        <span className="font-ui text-xs font-bold tracking-wide uppercase pr-1">
          Chat With Engineer
        </span>
      </button>
    </div>
  );
}
