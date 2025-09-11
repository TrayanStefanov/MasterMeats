import { useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingBasket, FaBars } from "react-icons/fa";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { href: "#hero", label: t("navbar.home") },
    { href: "#products", label: t("navbar.products") },
    { href: "#about", label: t("navbar.about") },
    { href: "#contacts", label: t("navbar.contacts") },
  ];


  return (
    <nav className="navbar bg-primary text-primary-content shadow-md shadow-primary-content sticky top-0 z-50">
      {/* Logo TBD */}
      <motion.div
        animate={{ rotate: [8, -8, 8] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="w-28 h-12 bg-contain bg-no-repeat bg-center"
      >
        <FaBars className="w-12 h-12" />
      </motion.div>

      {/* Menu */}
      <div className="ml-auto flex items-center gap-4">
        {/* Desktop */}
        <ul className="hidden md:flex gap-6 font-bold">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:opacity-80">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <LanguageSelector />
        {/* Cart */}
        <button className="btn btn-ghost btn-circle">
          <FaShoppingBasket className="w-6 h-6" />
        </button>

        {/* Mobile Toggle */}
        <button
          className="btn btn-ghost md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="material-icons">menu</span>
        </button>
      </div>

      {/* Mobilen */}
      {isOpen && (
        <div className="absolute top-full right-0 w-48 bg-primary text-primary-content shadow-lg rounded-xl p-4 md:hidden">
          <ul className="flex flex-col gap-4 font-bold">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:opacity-80"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

