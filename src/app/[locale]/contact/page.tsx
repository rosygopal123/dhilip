"use client";
import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Phone, Clock, MapPin, CheckCircle, Mail, Send, ExternalLink } from "lucide-react";

export default function ContactPage() {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("Madurai");
  const [projectType, setProjectType] = useState("Turnkey Residential Villa");
  const [budget, setBudget] = useState("₹60 Lakh - ₹1.5 Crore");
  const [message, setMessage] = useState("");
  const [vastu, setVastu] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && mobile) {
      setSubmitted(true);

      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            mobile,
            email,
            district,
            projectType,
            budget,
            message,
            vastuPreferred: vastu,
            source: "Contact Page Form",
          }),
        });
      } catch (err) {
        console.error("Failed to post contact lead to CRM API:", err);
      }

      const waText = `Hi Danam Holdings, I would like to consult on a construction project:
- Name: ${name}
- Phone: ${mobile}
- Email: ${email || "N/A"}
- Location: ${district}
- Project: ${projectType}
- Estimated Budget: ${budget}
- 100% Vastu: ${vastu ? "Yes" : "No"}
- Details: ${message || "Please provide itemized BOQ and site inspection."}`;

      const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918110006913";
      const whatsappUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waText)}`;

      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1000);
    }
  };

  return (
    <div className="relative w-full pt-20">
      {/* 1. Hero Section */}
      <section className="relative py-24 flex items-center justify-center overflow-hidden bg-[#060E08] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-[1px] opacity-35 scale-105"
          style={{ backgroundImage: "url('/images/danam/hh2.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060E08]/90 via-[#060E08]/75 to-[#060E08] z-10" />

        <div className="relative z-20 text-center max-w-4xl px-6">
          <span className="text-brand-leaf-light font-mono text-xs uppercase tracking-widest mb-3 block font-bold">
            GET IN TOUCH
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Let&apos;s Discuss Your Project
          </h1>
          <p className="font-ui text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Tell us what you plan to build or renovate. Our senior civil engineering team will get back to you with next steps, 3D visualization, and transparent BOQ costing.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="py-20 bg-surface-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Information Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left">
              <div>
                <span className="text-brand-forest font-mono text-xs uppercase tracking-widest mb-2 block font-bold">
                  Corporate Office
                </span>
                <h2 className="font-display text-3xl font-bold text-text-primary mb-3">
                  We would love to hear from you
                </h2>
                <p className="font-ui text-sm text-text-secondary leading-relaxed mb-6">
                  Visit our office in Kamarajar Salai, Madurai, or contact us directly via phone, WhatsApp, or email.
                </p>
              </div>

              {/* Office Address Card */}
              <div className="bg-surface-1 border border-border-subtle p-6 rounded-2xl flex items-start gap-4 shadow-xs">
                <div className="p-3 bg-brand-forest/10 rounded-xl text-brand-forest shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block mb-1">
                    Headquarters
                  </span>
                  <address className="not-italic font-ui text-xs sm:text-sm text-text-primary leading-relaxed">
                    Plot No. 1, Gokulam Avenue,<br />
                    Renganayaki Ammal Street, Kamarajar Salai,<br />
                    Madurai – 625009, Tamil Nadu, India
                  </address>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Danam+Holdings+Gokulam+Avenue+Kamarajar+Salai+Madurai+625009"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-forest hover:underline mt-2"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone Contacts */}
              <div className="bg-surface-1 border border-border-subtle p-6 rounded-2xl flex items-start gap-4 shadow-xs">
                <div className="p-3 bg-brand-forest/10 rounded-xl text-brand-forest shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block mb-1">
                    Phone Inquiries
                  </span>
                  <div className="flex flex-col gap-1 text-sm font-bold text-text-primary">
                    <a href="tel:+918110006913" className="hover:text-brand-forest transition-colors">
                      +91 81100 06913
                    </a>
                    <a href="tel:+919597402305" className="hover:text-brand-forest transition-colors">
                      +91 95974 02305
                    </a>
                  </div>
                  <span className="text-[11px] text-text-tertiary block mt-1">Direct civil engineering desk</span>
                </div>
              </div>

              {/* Email & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-1 border border-border-subtle p-5 rounded-2xl flex items-start gap-3 shadow-xs">
                  <Mail className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block">Email</span>
                    <a href="mailto:danamholdingsepc@gmail.com" className="text-xs font-semibold text-text-primary hover:text-brand-forest transition-colors break-all">
                      danamholdingsepc@gmail.com
                    </a>
                  </div>
                </div>

                <div className="bg-surface-1 border border-border-subtle p-5 rounded-2xl flex items-start gap-3 shadow-xs">
                  <Clock className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block">Office Hours</span>
                    <span className="text-xs font-semibold text-text-primary">
                      Mon–Sat: 9:00 AM – 6:30 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Consultation Form */}
            <div className="lg:col-span-7 bg-surface-1 border border-border-medium p-8 rounded-2xl shadow-xl">
              <h3 className="font-display text-2xl font-bold text-text-primary mb-1">
                Request a Project Consultation & Quote
              </h3>
              <p className="font-ui text-xs text-text-secondary mb-6 leading-relaxed">
                Fill in your project details below to receive an itemized estimate and schedule a site evaluation.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-brand-forest/10 border border-brand-forest/30 rounded-xl space-y-3">
                  <CheckCircle className="w-12 h-12 text-brand-forest mx-auto animate-bounce" />
                  <h4 className="font-display text-2xl font-bold text-text-primary">Thank You!</h4>
                  <p className="font-ui text-xs text-text-secondary max-w-sm mx-auto">
                    Your project details have been recorded. WhatsApp will open momentarily to connect you directly with our civil engineering desk.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Saravanan R"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-surface-0 border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-brand-forest outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 98765 43210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-surface-0 border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-brand-forest outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface-0 border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-brand-forest outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1">
                        Project Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Madurai / Aruppukottai"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-surface-0 border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-brand-forest outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1">
                        Project Scope
                      </label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full bg-surface-0 border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-brand-forest outline-none transition-colors"
                      >
                        <option value="Turnkey Residential Villa">Turnkey Residential Villa</option>
                        <option value="Commercial Showroom / Complex">Commercial Showroom / Complex</option>
                        <option value="Industrial Shed & Steel Works">Industrial Shed & Steel Works</option>
                        <option value="Building Renovation & Waterproofing">Building Renovation & Waterproofing</option>
                        <option value="Interior Fit-Outs & 3D Estimation">Interior Fit-Outs & 3D Estimation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1">
                        Estimated Budget
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-surface-0 border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-brand-forest outline-none transition-colors"
                      >
                        <option value="₹30 Lakh - ₹60 Lakh">₹30 Lakh - ₹60 Lakh</option>
                        <option value="₹60 Lakh - ₹1.5 Crore">₹60 Lakh - ₹1.5 Crore</option>
                        <option value="₹1.5 Crore - ₹3 Crore">₹1.5 Crore - ₹3 Crore</option>
                        <option value="₹3 Crore+">₹3 Crore+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1">
                      Project Notes / Built-up Sq.Ft / Requirements
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share your plot size, location details, number of floors, or specific architectural ideas..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-surface-0 border border-border-subtle rounded-lg p-3 text-xs text-text-primary focus:border-brand-forest outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="vastuCheck"
                      checked={vastu}
                      onChange={(e) => setVastu(e.target.checked)}
                      className="rounded text-brand-forest focus:ring-brand-forest cursor-pointer"
                    />
                    <label htmlFor="vastuCheck" className="text-xs font-semibold text-text-secondary cursor-pointer">
                      Require 100% Vastu-Compliant Blueprint & Orientation
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 bg-brand-forest hover:bg-brand-forest-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Request via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Google Maps Office Embed */}
      <section className="h-[360px] sm:h-[420px] w-full border-t border-border-subtle">
        <iframe
          title="Danam Holdings Head Office Madurai"
          src="https://www.google.com/maps?q=Danam+Holdings+Plot+No+1+Gokulam+Avenue+Renganayaki+Ammal+St+Kamarajar+Salai+Madurai+625009&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}
