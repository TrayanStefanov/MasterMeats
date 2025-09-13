import React from "react";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-content pb-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6 md:py-10">
  {/* Left */}
  <div className="flex flex-col gap-2 md:gap-3 text-center md:text-left">
    <h2 className="text-lg md:text-xl font-bold">{t("navbar.logo")}</h2>
    <p className="text-xs md:text-sm">{t("footer.slogan")}</p>
    <p className="text-xs md:text-sm">
      {t("footer.phone.note")}{" "}
      <a href={`tel:${t("footer.phone.value")}`} className="underline">
        {t("footer.phone.value")}
      </a>
    </p>
    <p className="text-xs md:text-sm">
      {t("footer.email.note")}{" "}
      <a
        href={`mailto:${t("footer.email.value1")}@${t("footer.email.value2")}.com`}
        className="underline"
      >
        {t("footer.email.value1")}@{t("footer.email.value2")}.com
      </a>
    </p>
  </div>

  {/* Center: Socials */}
  <div className="flex flex-col items-center gap-2 md:gap-3">
    <h3 className="text-md md:text-lg font-bold">{t("footer.social")}</h3>
    <div className="flex gap-3 md:gap-4 mt-1 md:mt-2">
      <a
        href={t("footer.social-links.linkedin")}
        target="_blank"
        rel="noreferrer"
        className="hover:text-secondary transition-colors"
      >
        <FaLinkedinIn size={18} />
      </a>
      <a href="#" className="hover:text-secondary transition-colors">
        <FaFacebookF size={18} />
      </a>
      <a href="#" className="hover:text-secondary transition-colors">
        <FaTwitter size={18} />
      </a>
    </div>
  </div>

  {/* Right: Quick Links */}
  <div className="flex flex-col items-center md:items-end gap-1 md:gap-2 text-xs md:text-sm font-bold">
    <a href="#hero" className="hover:underline">
      {t("navbar.home")}
    </a>
    <a href="#products" className="hover:underline">
      {t("navbar.products")}
    </a>
    <a href="#about" className="hover:underline">
      {t("navbar.about")}
    </a>
    <a href="#contacts" className="hover:underline">
      {t("navbar.contacts")}
    </a>
  </div>
</div>


      {/* Bottom */}
      <div className="text-center text-sm border-t border-secondary pt-4">
        © 2025 <span className="font-bold">Trayan Stefanov</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
