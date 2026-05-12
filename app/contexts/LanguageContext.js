"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../../lib/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("bg");

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const t = (key) => {
    return translations[lang]?.[key] || translations["bg"]?.[key] || key;
  };

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
