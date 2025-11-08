export const fetchLocales = async (productName) => {
  try {
    // Load both English and Bulgarian translation files for the products section
    const [enRes, bgRes] = await Promise.all([
      fetch("/locales/en/productsSection.json").then((res) => res.json()),
      fetch("/locales/bg/productsSection.json").then((res) => res.json()),
    ]);

    const enData = enRes?.[productName] || {};
    const bgData = bgRes?.[productName] || {};

    return {
      en: {
        title: enData.title || "",
        description: enData.description || "",
        ingredients: enData.ingredients || "",
        badge: enData.badge || "",
      },
      bg: {
        title: bgData.title || "",
        description: bgData.description || "",
        ingredients: bgData.ingredients || "",
        badge: bgData.badge || "",
      },
    };
  } catch (error) {
    console.error("Failed to load product locales:", error);
    return {
      en: { title: "", description: "", ingredients: "", badge: "" },
      bg: { title: "", description: "", ingredients: "", badge: "" },
    };
  }
};

export default fetchLocales;
