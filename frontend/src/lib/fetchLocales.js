
export const fetchLocales = async (productName) => {
  try {
    const [enRes, bgRes] = await Promise.all([
      fetch("/locales/en/translation.json").then((res) => res.json()),
      fetch("/locales/bg/translation.json").then((res) => res.json()),
    ]);

    const enData = enRes.products?.[productName] || {};
    const bgData = bgRes.products?.[productName] || {};

    return {
      en: enData,
      bg: bgData,
    };
  } catch (error) {
    console.error("❌ Failed to load product locales:", error);
    return { en: {}, bg: {} };
  }
};

export default fetchLocales;