"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowUp, MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

export default function Footer() {
  const { locale, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#060E08] text-white/90 border-t-4 border-brand-forest pt-16 pb-8 relative overflow-hidden select-none">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 blueprint-grid-dark opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <img
                src="/images/danam/dhlogo.webp"
                alt="Danam Holdings Logo"
                className="h-12 w-auto shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
                  <span className="text-brand-leaf-light">Danam</span> Holdings
                </span>
                <span className="font-ui text-[9px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                  Towards Fortune Unfoldings
                </span>
              </div>
            </Link>

            <p className="font-ui text-xs text-white/75 leading-relaxed max-w-sm mt-2">
              Your trusted partner in civil engineering & turnkey EPC construction. Delivering structural integrity, transparent costing, and on-time project execution across South India.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://www.facebook.com/p/Danamholdingsofficial-61561735904375/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/5 hover:bg-[#1877F2] rounded-full transition-all text-white/80 hover:text-white hover:scale-105"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/p/DUnH4PfkabP/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] rounded-full transition-all text-white/80 hover:text-white hover:scale-105"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@danamholdings"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/5 hover:bg-[#FF0000] rounded-full transition-all text-white/80 hover:text-white hover:scale-105"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Affiliations Logos */}
            <div className="pt-3">
              <span className="font-ui text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                Industry & Forum Memberships
              </span>
              <div className="flex items-center gap-3">
                <img src="/images/danam/jci.webp" alt="JCI" className="h-6 w-auto object-contain bg-white/10 rounded px-1.5 py-0.5" />
                <img src="/images/danam/BNI_logo.webp" alt="BNI" className="h-6 w-auto object-contain bg-white/10 rounded px-1.5 py-0.5" />
                <img src="/images/danam/yi.webp" alt="YI" className="h-6 w-auto object-contain bg-white/10 rounded px-1.5 py-0.5" />
                <img src="/images/danam/rotary.jpeg" alt="Rotary" className="h-6 w-auto object-contain bg-white/10 rounded px-1.5 py-0.5" />
              </div>
            </div>
          </div>

          {/* Quick Pages */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-base text-brand-leaf-light font-bold mb-5 uppercase tracking-wider">
              {t.footer.sections.navigation}
            </h4>
            <div className="flex flex-col gap-2.5 font-ui text-xs text-white/75">
              <Link href={`/${locale}`} className="hover:text-brand-leaf-light transition-colors">
                {t.nav.home}
              </Link>
              <Link href={`/${locale}/about`} className="hover:text-brand-leaf-light transition-colors">
                {t.nav.about}
              </Link>
              <Link href={`/${locale}/services`} className="hover:text-brand-leaf-light transition-colors">
                {t.nav.services}
              </Link>
              <Link href={`/${locale}/projects`} className="hover:text-brand-leaf-light transition-colors">
                {t.nav.projects}
              </Link>
              <Link href={`/${locale}/process`} className="hover:text-brand-leaf-light transition-colors">
                {t.nav.process}
              </Link>
              <Link href={`/${locale}/contact`} className="hover:text-brand-leaf-light transition-colors">
                {t.nav.contact}
              </Link>
            </div>
          </div>

          {/* Core Offerings */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-base text-brand-leaf-light font-bold mb-5 uppercase tracking-wider">
              {t.footer.sections.services}
            </h4>
            <div className="flex flex-col gap-2 font-ui text-xs text-white/75">
              <span>Turnkey Civil Construction</span>
              <span>Structural Steel & RCC Framing</span>
              <span>Architectural 3D & Estimation</span>
              <span>MEP Electrical & Plumbing</span>
              <span>Interior Fit-Outs & Flooring</span>
              <span>Building Renovation & Waterproofing</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-base text-amber-400 font-bold mb-5 uppercase tracking-wider">
              Office Location
            </h4>
            <div className="flex flex-col gap-3 font-ui text-xs text-white/75">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Plot No. 1, Gokulam Avenue, Renganayaki Ammal Street, Kamarajar Salai, Madurai – 625009, Tamil Nadu
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+918110006913" className="hover:text-white transition-colors">
                    +91 81100 06913
                  </a>
                  <a href="tel:+919597402305" className="hover:text-white transition-colors">
                    +91 95974 02305
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:danamholdingsepc@gmail.com" className="hover:text-white transition-colors break-all">
                  danamholdingsepc@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower footer */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="font-ui text-white/50 text-center md:text-left flex flex-wrap items-center gap-2">
            <span>© 2026 Danam Holdings. All rights reserved.</span>
            <span>•</span>
            <span>Towards Fortune Unfoldings</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">IS-456 Standard</span>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="p-2.5 bg-white/5 hover:bg-brand-forest rounded-full transition-all border border-white/10 hover:border-transparent cursor-pointer group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 text-white/80 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
