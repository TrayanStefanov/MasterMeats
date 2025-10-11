import { useCallback } from "react";

/**
 * Returns a function to scroll smoothly to the #products section,
 * taking the navbar height into account.
 */
export const useScrollToProducts = (onClose) => {
  const scrollToProducts = useCallback(() => {
    const productsSection = document.querySelector("#products");
    if (productsSection) {
      const navbarHeight =
        document.querySelector("nav.navbar")?.offsetHeight || 0;

      const sectionTop =
        productsSection.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: sectionTop - navbarHeight,
        behavior: "smooth",
      });
    }

    if (onClose) onClose();
  }, [onClose]);

  return scrollToProducts;
};
