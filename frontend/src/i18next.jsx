import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "bg",
    debug: true,
    supportedLngs: ["en", "bg"],
    ns: [
      "aboutSection",
      "faq",
      "coreValuesSection",
      "homeSection",
      "productsSection",
      "common",
      "auth",
      "cart",
      "admin/common",
      "admin/products",
      "admin/reservations",
      "admin/forms",
    ],
    defaultNS: "common",
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    interpolation: {
      escapeValue: false,
    },
  });
