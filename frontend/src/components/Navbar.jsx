import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBars, FaShoppingBasket } from "react-icons/fa";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("#hero");
  const { t } = useTranslation();

  const navLinks = [
    { href: "#hero", label: t("navbar.home") },
    { href: "#products", label: t("navbar.products") },
    { href: "#about", label: t("navbar.about") },
    { href: "#contacts", label: t("navbar.contacts") },
  ];

  // Scroll tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      navLinks.forEach((link) => {
        const ele = document.querySelector(link.href);
        if (ele) {
          const top = ele.offsetTop;
          const bottom = top + ele.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(link.href);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hoverVariants = {
    hover: { scale: 1.1, y: -2, color: "#FBBF24" },
  };

  return (
    <nav className="navbar h-24 bg-primary text-primary-content shadow-md shadow-primary-content sticky top-0 z-50 backdrop-blur-lg opacity-90">
      <div className="w-3/4 mx-auto flex items-center">
        {/* Logo Placeholder */}
        <motion.div
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 h-12 bg-contain bg-no-repeat bg-center"
        >
          <FaBars className="w-12 h-12" />
        </motion.div>

        {/* Desktop */}
        <ul className="hidden md:flex ml-auto gap-6 font-bold text-xl">
          {navLinks.map((link) => (
            <motion.li
              key={link.href}
              variants={hoverVariants}
              whileHover="hover"
              className="relative"
            >
              <a
                href={link.href}
                className={`transition-colors ${
                  activeSection === link.href ? "text-accent" : ""
                }`}
              >
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4 ml-4">
          <LanguageSelector />
          <button className="btn btn-ghost btn-circle">
            <FaShoppingBasket className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
