import React from 'react';
import { useEffect, useState } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  // Set the initial language from i18next's detected or default language
  const [language, setLanguage] = useState(i18next.language);

  const { i18n } = useTranslation();
  const {t} = useTranslation();

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    i18next.changeLanguage(selectedLanguage); // Update language in i18next
  };

  useEffect(() => {
    document.body.dir = i18next; //sets the body to ltr or rtl
  }, [i18n, i18n.language]);

  const languageOptions = [
    {
      language: t("language.en"),
      code: "en",
    },
    { language: t("language.bg"), code: "bg" },
  ];

  return (
    <select
      id="language"
      value={language}
      onChange={handleLanguageChange}
      className="p-2 bg-secondary text-primary border-primary border-2 self-center text-center focus:text-neutral-content focus:bg-neutral hover:text-neutral-content hover:bg-neutral"
    >
      {languageOptions.map((option, key) => (
        <option className='md:text-l lg:text-xl bg-secondary text-primary m-auto' value={option.code} key={key}>
          {option.language}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;