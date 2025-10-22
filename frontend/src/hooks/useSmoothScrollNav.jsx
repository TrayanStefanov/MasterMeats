import { useCallback, useEffect, useState, useRef } from "react";

export const useSmoothScrollNav = (navLinks, onClose) => {
  const [activeSection, setActiveSection] = useState(navLinks?.[0]?.href || "#");
  const throttleRef = useRef(null);

  const scrollToSection = useCallback(
    (selector) => {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      if (!selector) return;

      const targetSection = document.querySelector(selector);
      if (!targetSection) return;

      const navbar = document.querySelector("nav.navbar");
      const navbarHeight = navbar?.offsetHeight || 0;

      const sectionTop = targetSection.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: sectionTop - navbarHeight,
        behavior: "smooth",
      });

      if (onClose) onClose();
    },
    [onClose]
  );

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

    const throttledScroll = () => {
      if (throttleRef.current) return;
      throttleRef.current = setTimeout(() => {
        handleScroll();
        throttleRef.current = null;
      }, 100); // runs every 100ms max
    };

    handleScroll(); // initialize once
    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (throttleRef.current) clearTimeout(throttleRef.current);
    };
  }, [navLinks]);

  return { activeSection, scrollToSection };
};
