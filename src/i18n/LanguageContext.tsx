"use client";
import React, { createContext, useContext } from "react";
import { en, TranslationKeys } from "./translations";

type Locale = "en" | "ta";

interface LanguageContextProps {
  locale: Locale;
  t: TranslationKeys;
  switchLanguage: (_newLocale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale: _initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const locale: Locale = "en";
  const t = en;

  const switchLanguage = (_newLocale: Locale) => {
    // Locked to English
  };

  return (
    <LanguageContext.Provider value={{ locale, t, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
