import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const flags = {
  en: "🇬🇧",
  bg: "🇧🇬",
};

const LanguageSelector = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18next.language || "en");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: t("language.en.code"), label: t("language.en.label") },
    { code: t("language.bg.code"), label: t("language.bg.label") },
  ];

  const handleChange = (code) => {
    setLanguage(code);
    i18next.changeLanguage(code);
    setIsOpen(false);
  };

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
      {/* Selected Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 py-1 rounded-full text-secondary font-bold cursor-pointer relative hover:text-accent"
      >
        <span>{flags[language]}</span>
        <span>{languages.find((l) => l.code === language)?.label}</span>
        <span className="ml-1 text-lg">▾</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
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
                whileHover={{ scale: 1.05, color: "#FBBF24" }} // gold accent on hover
                onClick={() => handleChange(lang.code)}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
                  language === lang.code ? "font-bold" : ""
                }`}
              >
                <span>{flags[lang.code]}</span>
                <span>{lang.label}</span>
                {language === lang.code && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 bottom-0 h-[2px] bg-accent w-full"
                    transition={{ duration: 0.1 }}
                  />
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
