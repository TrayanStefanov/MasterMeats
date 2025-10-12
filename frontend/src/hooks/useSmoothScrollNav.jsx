import { useCallback, useEffect, useState } from "react";

/**
 * A reusable hook for smooth scrolling navigation with active section tracking.
 * 
 * @param {Array<{ href: string }>} navLinks - Array of links (e.g. [{ href: "#hero" }, ...])
 * @param {Function} [onClose] - Optional callback (e.g. close mobile menu)
 * @returns {{ activeSection: string, scrollToSection: (selector: string) => void }}
 */
export const useSmoothScrollNav = (navLinks, onClose) => {
  const [activeSection, setActiveSection] = useState(navLinks?.[0]?.href || "#");

  const scrollToSection = useCallback(
    (selector) => {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      if (!selector) return;

      const targetSection = document.querySelector(selector);
      if (!targetSection) return;

      const navbar = document.querySelector("nav.navbar");
      const navbarHeight = navbar?.offsetHeight || 0;

      const sectionTop =
        targetSection.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: sectionTop - navbarHeight,
        behavior: "smooth",
      });

      if (onClose) onClose();
    },
    [onClose]
  );

  // Track which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (const link of navLinks) {
        const ele = document.querySelector(link.href);
        if (ele) {
          const top = ele.offsetTop;
          const bottom = top + ele.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(link.href);
            break;
          }
        }
      }
    };

    handleScroll(); // initialize
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  return { activeSection, scrollToSection };
};
