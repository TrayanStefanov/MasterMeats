import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

const MobileMenu = ({ isOpen, navLinks, activeSection, onClose }) => {
  // Close menu on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null; // SSR check

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Mobile Menu */}
          <motion.nav
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed top-0 left-0 w-full h-screen bg-primary text-primary-content z-50 flex flex-col justify-center items-center gap-8 text-xl font-bold"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-primary-content text-3xl p-2 rounded-full hover:bg-white/20 transition"
              aria-label="Close menu"
            >
              <IoClose />
            </button>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { transition: { staggerChildren: 0.1 } },
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="flex flex-col gap-6"
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileTap={{ scale: 1.1 }}
                  className={`transition-colors ${
                    activeSection === link.href ? "text-accent text-3xl" : ""
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MobileMenu;
