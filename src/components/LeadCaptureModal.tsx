"use client";
import React, { useState, useEffect } from "react";
import { X, CheckCircle, Calculator, PhoneCall, Sparkles, Building2, Send, ArrowRight } from "lucide-react";

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"FORM" | "SUCCESS">("FORM");
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("Madurai");
  const [projectType, setProjectType] = useState("Turnkey Residential Villa");
  const [areaSqFt, setAreaSqFt] = useState("2400");
  const [budget, setBudget] = useState("₹60 Lakh - ₹1.5 Crore");
  const [message, setMessage] = useState("");
  
  // Submitted response state
  const [submittedLead, setSubmittedLead] = useState<any>(null);

  // Event listener to open modal from anywhere on website
  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener("open-lead-modal", handleOpenModal);
    return () => window.removeEventListener("open-lead-modal", handleOpenModal);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          email,
          district,
          projectType,
          budget,
          areaSqFt: `${areaSqFt} Sq.Ft`,
          message,
          source: "Quick Lead Drawer (Modal)",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedLead(data.lead);
        setStep("SUCCESS");
      }
    } catch (err) {
      console.error("Failed to submit lead:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!submittedLead) return;
    const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918883332499";
    const waText = `Hi Danam Holdings, I just requested a quick estimate (ID: ${submittedLead.id}):
- Name: ${submittedLead.name}
- District: ${submittedLead.district}
- Project: ${submittedLead.projectType} (${submittedLead.areaSqFt})
- Budget: ${submittedLead.budget}
Please share structural drawing catalog and BOQ details.`;
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(waText)}`, "_blank");
  };

  const resetForm = () => {
    setStep("FORM");
    setName("");
    setMobile("");
    setEmail("");
    setSubmittedLead(null);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Quick Trigger Badge (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-surface-0 border border-brand-forest/40 text-text-primary px-4 py-3 rounded-full shadow-xl flex items-center gap-2 hover:bg-brand-forest hover:text-white transition-all duration-300 group cursor-pointer"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-leaf opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-forest"></span>
          </span>
          <Calculator className="w-4 h-4 text-brand-forest group-hover:text-white transition-colors" />
          <span className="font-mono text-xs uppercase tracking-wider font-bold">
            Get Free Cost Estimate
          </span>
        </button>
      </div>

      {/* Slide-over Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="w-full max-w-lg bg-surface-0 h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-border-subtle p-6 md:p-8 animate-[slideInRight_0.3s_ease-out]"
          >
            {/* Header */}
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-border-subtle mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-forest/10 text-brand-forest flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-text-primary">
                      Instant Quote & Consultation
                    </h3>
                    <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest block">
                      Danam Holdings • Kamarajar Salai, Madurai
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {step === "FORM" ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-ui text-xs">
                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-text-secondary">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Saravanan R"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-surface-1 border border-border-subtle p-3 text-text-primary outline-none focus:border-brand-forest rounded-lg"
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-text-secondary">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="bg-surface-1 border border-border-subtle p-3 font-mono text-text-primary outline-none focus:border-brand-forest rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-text-secondary">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. name@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-surface-1 border border-border-subtle p-3 text-text-primary outline-none focus:border-brand-forest rounded-lg"
                      />
                    </div>
                  </div>

                  {/* District & Project Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-text-secondary">
                        Location / District *
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Madurai"
                        className="bg-surface-1 border border-border-subtle p-3 text-text-primary outline-none focus:border-brand-forest rounded-lg"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-text-secondary">
                        Project Scope *
                      </label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="bg-surface-1 border border-border-subtle p-3 text-text-primary outline-none focus:border-brand-forest rounded-lg"
                      >
                        <option value="Turnkey Residential Villa">Turnkey Residential Villa</option>
                        <option value="Commercial Showroom / Complex">Commercial Showroom / Complex</option>
                        <option value="Industrial Shed & Steel Works">Industrial Shed & Steel Works</option>
                        <option value="Building Renovation & Waterproofing">Building Renovation & Waterproofing</option>
                      </select>
                    </div>
                  </div>

                  {/* Plot Built-up Area & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-text-secondary">
                        Approx Area (Sq.Ft)
                      </label>
                      <input
                        type="number"
                        value={areaSqFt}
                        onChange={(e) => setAreaSqFt(e.target.value)}
                        className="bg-surface-1 border border-border-subtle p-3 font-mono text-text-primary outline-none focus:border-brand-forest rounded-lg"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-text-secondary">
                        Expected Budget
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="bg-surface-1 border border-border-subtle p-3 text-text-primary outline-none focus:border-brand-forest rounded-lg"
                      >
                        <option value="₹30 Lakh - ₹60 Lakh">₹30 Lakh - ₹60 Lakh</option>
                        <option value="₹60 Lakh - ₹1.5 Crore">₹60 Lakh - ₹1.5 Crore</option>
                        <option value="₹1.5 Crore - ₹3 Crore">₹1.5 Crore - ₹3 Crore</option>
                        <option value="₹3 Crore+">₹3 Crore+</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-text-secondary">
                      Project Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any specific architectural preferences or timeline..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-surface-1 border border-border-subtle p-3 text-text-primary outline-none focus:border-brand-forest rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-brand-forest hover:bg-brand-forest-dark text-white font-mono text-xs uppercase tracking-widest font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Processing Estimate...</span>
                    ) : (
                      <>
                        <span>Submit & Get Instant BOQ</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-text-primary mb-2">
                    Request Received!
                  </h3>
                  <p className="font-ui text-xs text-text-secondary max-w-sm mb-6 leading-relaxed">
                    Our civil engineering team has logged your enquiry (Ref: {submittedLead?.id}). Tap below to open WhatsApp for an instant BOQ breakdown and 3D catalog.
                  </p>

                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] cursor-pointer mb-3"
                  >
                    <Send className="w-4 h-4" />
                    <span>Open in WhatsApp</span>
                  </button>

                  <button
                    onClick={resetForm}
                    className="text-xs font-semibold text-text-tertiary hover:text-text-primary underline cursor-pointer"
                  >
                    Close & Return to Website
                  </button>
                </div>
              )}
            </div>

            {/* Footer Trust Callout */}
            <div className="border-t border-border-subtle pt-4 mt-6 flex items-center justify-between text-[11px] text-text-tertiary font-ui">
              <span>IS 456 Structural Standard</span>
              <span>100% Cost Transparency</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
