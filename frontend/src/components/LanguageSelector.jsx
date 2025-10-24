import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18next.language || "en");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", label: t("language.en.label") },
    { code: "bg", label: t("language.bg.label") },
  ];

  const handleChange = (code) => {
    localStorage.removeItem("i18nextLng"); // clear cache
    i18next.changeLanguage(code);
    setLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleLanguageChange = (lng) => setLanguage(lng);
    i18next.on("languageChanged", handleLanguageChange);
    return () => i18next.off("languageChanged", handleLanguageChange);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Dropdown */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 py-1 rounded-full text-secondary font-bold cursor-pointer text-lg lg:text-xl 2xl:text-2xl hover:text-accent"
        >
          <span>{languages.find((l) => l.code === language)?.label}</span>
          <span className="ml-1">▾</span>
        </button>

        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-32 bg-secondary text-primary rounded-lg shadow-lg overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <motion.li
                key={lang.code}
                whileHover={{ scale: 1.05, color: "#FBBF24" }}
                onClick={() => handleChange(lang.code)}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-accent ${
                  language === lang.code ? "font-bold text-xl" : ""
                }`}
              >
                <span>{lang.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* Mobile Language*/}
      <div className="flex md:hidden items-center gap-1 lg:gap-4">
        {languages.map((lang, idx) => (
          <React.Fragment key={lang.code}>
            <button
              onClick={() => handleChange(lang.code)}
              className={`flex items-center text-lg font-bold transition-colors ${
                language === lang.code
                  ? "text-accent"
                  : "text-secondary hover:text-accent-content"
              }`}
            >
              <span>{lang.code.toUpperCase()}</span>
            </button>
            {idx < languages.length - 1 && (
              <div className="w-px h-6 bg-secondary" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
