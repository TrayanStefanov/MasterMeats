import React from "react";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaTwitter, FaPhone } from "react-icons/fa";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-content py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Left */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">{t("navbar.logo")}</h2>
          <p className="text-sm">{t("footer.slogan")}</p>
          <p className="text-sm">
            {t("footer.phone.note")}{" "}
            <a href={`tel:${t("footer.phone.value")}`} className="underline">
              {t("footer.phone.value")}
            </a>
          </p>
          <p className="text-sm">
            {t("footer.email.note")}{" "}
            <a
              href={`mailto:${t("footer.email.value1")}@${t("footer.email.value2")}.com`}
              className="underline"
            >
              {t("footer.email.value1")}@{t("footer.email.value2")}.com
            </a>
          </p>
        </div>

        {/* Center*/}
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-lg font-bold">{t("footer.social")}</h3>
          <div className="flex gap-4 mt-2">
            <a
              href={t("footer.social-links.linkedin")}
              target="_blank"
              rel="noreferrer"
              className="hover:text-secondary"
            >
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-secondary">
              <FaTwitter size={20} />
            </a>
            <a href={`tel:${t("footer.phone.value")}`} className="hover:text-secondary">
              <FaPhone size={20} />
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-3">
          <ul className="flex flex-col gap-1">
            <li>
              <a href="#hero" className="hover:underline">
                {t("navbar.home")}
              </a>
            </li>
            <li>
              <a href="#products" className="hover:underline">
                {t("navbar.products")}
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline">
                {t("navbar.about")}
              </a>
            </li>
            <li>
              <a href="#contacts" className="hover:underline">
                {t("navbar.contacts")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-sm mt-8 border-t border-base-200 pt-4">
        © 2025 <span className="font-bold">Trayan Stefanov</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
