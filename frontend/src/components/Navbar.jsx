import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaShoppingBasket, FaUser } from "react-icons/fa";
import LanguageSelector from "./LanguageSelector.jsx";
import MobileMenu from "./MobileMenu.jsx";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../stores/useUserStore";

const Navbar = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const { t } = useTranslation();

  const { user, logout } = useUserStore();

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
    <nav className="navbar h-24 bg-primary text-primary-content shadow-md sticky top-0 z-50 backdrop-blur-lg opacity-90">
      <div className="w-full lg:w-4/5 mx-auto flex items-center justify-between font-emphasis-heading">
        <div className="w-28 h-14 lg:w-40 lg:h-28 bg-contain bg-no-repeat bg-center">
          <img
            src="/logo_en.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Desktop Nav Links */}
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
                className={`transition-colors ${activeSection === link.href ? "text-accent" : ""
                }`}
              >
                {link.label}
              </a>
              {activeSection === link.href && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-0 h-[2px] bg-accent w-full"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-1 lg:gap-4 mx-4">
          <button 
          className="btn btn-ghost btn-circle"
            aria-label="Shopping Basket"
          >
            <FaShoppingBasket className="w-6 h-6" />
          </button>

          {user ? (
            <div className="flex flex-row items-end gap-3 me-4">
              <span className="hidden md:inline font-medium">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="text-accent hover:text-accent/80 font-bold text-xl"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn btn-ghost btn-circle mx-4"
              onClick={onLoginClick}
            >
              <div className="flex flex-row me-4 items-center gap-1">

              <FaUser className="w-5 h-5" />
              <span className="hidden lg:inline font-bold text-xl">Login</span>
              </div>
            </button>
          )}

          <LanguageSelector />
          {/* Mobile Menu Toggle */}
          <button
            className="btn btn-ghost md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            <span className="material-icons">{isOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {/* Portal-based Mobile Menu */}
      <MobileMenu
        isOpen={isOpen}
        navLinks={navLinks}
        activeSection={activeSection}
        onClose={() => setIsOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
