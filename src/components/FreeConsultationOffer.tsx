"use client";
import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  MapPin,
  FileCheck,
  Send
} from "lucide-react";

export default function FreeConsultationOffer() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [plotLocation, setPlotLocation] = useState("Madurai");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;
    setLoading(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          district: plotLocation,
          projectType: "Free Plot Vastu & Structural Visit",
          budget: "₹3,500 Consultation (Free Promo)",
          source: "Free Consultation Offer Banner"
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hi Danam Holdings, I would like to book the Free 30-Minute Plot Vastu & Structural Consultation (Worth ₹3,500) for my plot in ${plotLocation}. Please let me know available engineer slots.`
    );
    window.open(`https://wa.me/918883332499?text=${text}`, "_blank");
  };

  return (
    <section className="py-16 bg-[#08120b] text-white relative overflow-hidden border-t border-white/10 select-none">
      {/* Background ambient accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-forest/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="bg-gradient-to-r from-[#0c1c11] via-[#09170e] to-[#0d1f13] border border-emerald-500/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Top Promo Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Zero-Risk Construction Onboarding</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                Book a Free 30-Min Plot Vastu & Soil Structural Consultation
              </h2>
              <p className="font-ui text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-xl">
                Don’t sign with any contractor until you have these 4 crucial technical audits. A senior Danam Holdings civil engineer will visit your plot or review your drawings — <strong className="text-amber-300">100% Free (Usually ₹3,500)</strong>.
              </p>

              {/* 4 Deliverables included for free */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  { title: "100% Vastu Shastra Audit", desc: "Main entrance, Agni kitchen & Ishanya water alignment" },
                  { title: "Soil & Foundation Feasibility", desc: "Seismic Zone-III pile vs isolated column check" },
                  { title: "3D Elevation Conceptual Draft", desc: "First-look contemporary architectural concept" },
                  { title: "Transparent Itemized BOQ", desc: "Material & labour budget breakdown down to 1 Sq.Ft" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-white/5 border border-white/10 p-3 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-display text-xs sm:text-sm font-bold text-white">
                        {item.title}
                      </div>
                      <div className="font-ui text-[11px] text-white/60 leading-tight mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Urgency Counter Badge */}
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90">
                <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span>Only 3 site visit slots reserved per week across Madurai & surrounding districts</span>
              </div>
            </div>

            {/* Right Interactive Quick Lead Form (5 cols) */}
            <div className="lg:col-span-5 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Consultation Confirmed!
                  </h3>
                  <p className="font-ui text-xs text-white/80 leading-relaxed mb-6">
                    Our Senior Civil Engineer will call you within 2 business hours to schedule your free plot site visit & Vastu layout.
                  </p>
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-ui font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Connect on WhatsApp Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-left mb-2">
                    <span className="font-mono text-[10px] uppercase text-emerald-400 tracking-widest block font-bold">
                      Direct Senior Engineer Booking
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                      Claim Your Free Consultation
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-ui text-white/80 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Senthil Kumar"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-ui text-white/80 mb-1">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. 98421 XXXXX"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-ui text-white/80 mb-1">Plot Location / Town</label>
                    <select
                      value={plotLocation}
                      onChange={(e) => setPlotLocation(e.target.value)}
                      className="w-full bg-[#111e15] border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors"
                    >
                      <option value="Madurai (Koodal Nagar / Sikandar Chavadi)">Madurai (Koodal Nagar / Sikandar Chavadi)</option>
                      <option value="Madurai (K.Pudhur / KK Nagar / Anna Nagar)">Madurai (K.Pudhur / KK Nagar / Anna Nagar)</option>
                      <option value="Madurai (Tirunagar / Thiruparankundram)">Madurai (Tirunagar / Thiruparankundram)</option>
                      <option value="Aruppukottai / Virudhunagar">Aruppukottai / Virudhunagar</option>
                      <option value="Dindigul / Theni District">Dindigul / Theni District</option>
                      <option value="Other South TN Location">Other South TN Location</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-brand-forest hover:from-emerald-500 hover:to-brand-forest-light text-white font-ui font-bold text-xs uppercase tracking-wider shadow-lg ring-1 ring-white/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? (
                      <span>Reserving Slot...</span>
                    ) : (
                      <>
                        <span>Reserve Free Slot Now (₹0)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50 pt-1">
                    <span>✓ No spam. Direct engineer callback.</span>
                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="text-amber-300 hover:underline cursor-pointer"
                    >
                      Or WhatsApp directly →
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
