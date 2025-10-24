import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSmoothScrollNav } from "../hooks/useSmoothScrollNav";

const Footer = () => {
  const { t } = useTranslation();

  const navLinks = [
    { href: "#hero", label: t("navbar.home") },
    { href: "#products", label: t("navbar.products") },
    { href: "#about", label: t("navbar.about") },
    { href: "#contacts", label: t("navbar.contacts") },
  ];

  const { scrollToSection } = useSmoothScrollNav(navLinks);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="sticky bg-primary text-primary-content border-t border-secondary pb-10">
      <motion.div
        className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6 md:py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {/* Left: Logo & Contacts */}
        <motion.div
          className="flex flex-col gap-2 md:gap-3 text-center md:text-left"
          variants={fadeUp}
        >
          <img
            src="/logo_en.png"
            alt="Logo"
            className="w-full lg:max-w-[200px] h-full object-contain"
          />
          <p className="text-xl lg:text-2xl 2xl:text-3xl">
            {t("footer.slogan")}
          </p>
        </motion.div>

        {/* Center: Quick Nav */}
        <div className="flex flex-row justify-around">
          <motion.div
            className="flex flex-col items-center justify-around lg:justify-center gap-1 md:gap-2 text-lg 2xl:text-xl font-bold"
            variants={fadeUp}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                whileHover={{ x: 5, color: "#FBBF24" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="hover:underline cursor-pointer"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Mobile Socials */}
          <motion.div
            className="lg:hidden flex flex-col items-center justify-center gap-2 md:gap-3"
            variants={fadeUp}
          >
            <div className="flex flex-col gap-3 md:gap-4 mt-1 md:mt-2">
              {[t("footer.social-links.linkedin"), "#", "#"].map((link, i) => (
                <motion.a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.2, color: "#FBBF24" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-secondary"
                >
                  {i === 0 ? (
                    <FaLinkedinIn className="text-secondary" size={40} />
                  ) : i === 1 ? (
                    <FaFacebookF className="text-secondary" size={40} />
                  ) : (
                    <FaTwitter className="text-secondary" size={40} />
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Socials & Contact */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center gap-2 md:gap-3"
          variants={fadeUp}
        >
          <div className="flex gap-3 md:gap-4 mt-1 md:mt-2">
            {[t("footer.social-links.linkedin"), "#", "#"].map((link, i) => (
              <motion.a
                key={i}
                href={link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.2, color: "#FBBF24" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-secondary"
              >
                {i === 0 ? (
                  <FaLinkedinIn className="text-secondary" size={40} />
                ) : i === 1 ? (
                  <FaFacebookF className="text-secondary" size={40} />
                ) : (
                  <FaTwitter className="text-secondary" size={40} />
                )}
              </motion.a>
            ))}
          </div>
          <p className="flex flex-row text-lg 2xl:text-xl gap-2">
            <FaPhoneAlt className="text-lg lg:text-xl 2xl:text-2xl" />
            {t("footer.phone.note")}{" "}
            <a href={`tel:${t("footer.phone.value")}`} className="underline">
              {t("footer.phone.value")}
            </a>
          </p>
          <p className="flex flex-row text-lg 2xl:text-xl gap-2">
            <FaEnvelope className="text-lg lg:text-xl 2xl:text-2xl" />
            {t("footer.email.note")}{" "}
            <a
              href={`mailto:${t("footer.email.value1")}@${t(
                "footer.email.value2"
              )}.com`}
              className="underline"
            >
              {t("footer.email.value1")}@{t("footer.email.value2")}.com
            </a>
          </p>
        </motion.div>
      </motion.div>

      {/* Bottom */}
      <motion.div
        className="text-center text-sm md:text-lg pt-4 border-t border-secondary"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        © 2025 <span className="font-bold">Trayan Stefanov</span>. All rights
        reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
