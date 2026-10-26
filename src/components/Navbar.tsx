"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import { Menu, X, Sun, Moon, PhoneCall } from "lucide-react";

export default function Navbar() {
  const { locale, t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "night">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "night") || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "night" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const navLinks = [
    { name: t.nav.home, href: `/${locale}` },
    { name: t.nav.about, href: `/${locale}/about` },
    { name: t.nav.services, href: `/${locale}/services` },
    { name: t.nav.projects, href: `/${locale}/projects` },
    { name: t.nav.process, href: `/${locale}/process` },
    { name: t.nav.contact, href: `/${locale}/contact` },
  ];

  const handleOpenLeadModal = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const useWhiteText = theme === "night" || !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-surface-0/95 backdrop-blur-md py-3 shadow-md border-b border-border-subtle"
          : "bg-gradient-to-b from-black/60 via-black/20 to-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center">
        {/* Brand Logo & Name */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5 sm:gap-3 select-none group">
          <img
            src="/images/danam/dhlogo.webp"
            alt="Danam Holdings Logo"
            className="h-9 sm:h-11 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-2xl font-bold tracking-tight text-white group-hover:text-brand-leaf-light transition-colors leading-tight">
              <span className="text-brand-leaf-light">Danam</span> <span className={scrolled && theme === "light" ? "text-brand-forest-dark" : "text-white"}>Holdings</span>
            </span>
            <span className={`font-ui text-[8px] sm:text-[9px] font-semibold tracking-[0.14em] uppercase transition-colors ${
              scrolled && theme === "light" ? "text-text-secondary" : "text-white/80"
            }`}>
              Towards Fortune Unfoldings
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`font-ui text-xs tracking-wider uppercase whitespace-nowrap transition-colors py-1 ${
                isActive(link.href)
                  ? "text-brand-leaf font-bold border-b-2 border-brand-leaf"
                  : useWhiteText
                    ? "text-white/90 hover:text-brand-leaf-light"
                    : "text-text-primary/90 hover:text-brand-forest font-medium"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
          {/* Quick Call */}
          <a
            href="tel:+918883332499"
            className={`flex items-center gap-1.5 font-ui text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              useWhiteText
                ? "text-white/90 hover:text-brand-leaf-light bg-white/10 hover:bg-white/20"
                : "text-brand-forest hover:text-brand-forest-dark bg-brand-forest/10"
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>+91 88833 32499</span>
          </a>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 border rounded-full transition-all cursor-pointer ${
              useWhiteText
                ? "border-white/20 hover:bg-white/10 text-white"
                : "border-border-subtle hover:bg-surface-2 text-brand-forest"
            }`}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* CTA Estimate button */}
          <button
            onClick={handleOpenLeadModal}
            className="bg-brand-forest hover:bg-brand-forest-dark text-white px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            {t.nav.getQuote}
          </button>
        </div>

        {/* Mobile menu & theme controls */}
        <div className="flex lg:hidden items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className={`p-2 border rounded-full transition-colors cursor-pointer ${
              useWhiteText ? "border-white/20 text-white" : "border-border-subtle text-brand-forest"
            }`}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 border rounded-lg transition-colors cursor-pointer ${
              useWhiteText ? "border-white/20 text-white" : "border-border-subtle text-text-primary"
            }`}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-surface-0 border-b border-border-medium px-6 py-5 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3.5 mb-5 font-ui text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-1.5 transition-colors ${
                  isActive(link.href)
                    ? "text-brand-forest font-bold"
                    : "text-text-primary hover:text-brand-forest"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 pt-3 border-t border-border-subtle">
            <a
              href="tel:+918883332499"
              className="flex items-center justify-center gap-2 py-2.5 bg-surface-1 border border-border-subtle rounded-lg text-xs font-bold text-brand-forest"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call +91 88833 32499</span>
            </a>

            <button
              onClick={(e) => {
                setMobileOpen(false);
                handleOpenLeadModal(e);
              }}
              className="w-full py-3 bg-brand-forest text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md"
            >
              {t.nav.getQuote}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
