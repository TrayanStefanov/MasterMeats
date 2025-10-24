import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useSmoothScrollNav = (navLinks, onClose) => {
  const [activeSection, setActiveSection] = useState(navLinks?.[0]?.href || "#");
  const throttleRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = useCallback(
    (selector) => {
      if (!selector) return;

      // If we're NOT on the homepage, navigate first
      if (location.pathname !== "/") {
        sessionStorage.setItem("scrollTarget", selector);
        navigate("/");
        if (onClose) onClose();
        return;
      }

      if (typeof window === "undefined" || typeof document === "undefined") return;
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
    [location.pathname, navigate, onClose]
  );

  // scroll after navigation to "/"
  useEffect(() => {
    const target = sessionStorage.getItem("scrollTarget");
    if (location.pathname === "/" && target) {
      setTimeout(() => {
        const section = document.querySelector(target);
        if (section) {
          const navbar = document.querySelector("nav.navbar");
          const navbarHeight = navbar?.offsetHeight || 0;
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: sectionTop - navbarHeight,
            behavior: "smooth",
          });
        }
        sessionStorage.removeItem("scrollTarget");
      }, 300); 
    }
  }, [location.pathname]);

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
      }, 100);
    };

    handleScroll();
    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (throttleRef.current) clearTimeout(throttleRef.current);
    };
  }, [navLinks]);

  return { activeSection, scrollToSection };
};
