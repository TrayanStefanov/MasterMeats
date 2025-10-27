import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlusCircle, FaSpinner, FaSave } from "react-icons/fa";

import fetchLocales from "../../lib/fetchLocales.js";
import { useProductStore } from "../../stores/useProductStore.js";
import ProductImageUpload from "./ProductImageUpload.jsx";

const categories = ["fillet", "loin", "ham"];

const CreateProductForm = ({ mode = "create", product = null, onFinish }) => {
  const { createProduct, updateProduct, loading } = useProductStore();

  const [formData, setFormData] = useState({
    name: "",
    pricePerKg: "",
    category: "",
    stockInGrams: "",
    images: [],
    title: { en: "", bg: "" },
    description: { en: "", bg: "" },
    ingredients: { en: "", bg: "" },
    badge: { en: "", bg: "" },
  });

  useEffect(() => {
  if (mode === "edit" && product) {
    (async () => {
      // Fetch translations from /public/locales
      const locales = await fetchLocales(product.name);

      setFormData({
        name: product.name || "",
        pricePerKg: product.pricePerKg || "",
        category: product.category || "",
        stockInGrams: product.stockInGrams || "",
        images: product.images || [],
        title: {
          en: locales.en.title || product.title?.en || "",
          bg: locales.bg.title || product.title?.bg || "",
        },
        description: {
          en: locales.en.description || product.description?.en || "",
          bg: locales.bg.description || product.description?.bg || "",
        },
        ingredients: {
          en: locales.en.ingredients || product.ingredients?.en || "",
          bg: locales.bg.ingredients || product.ingredients?.bg || "",
        },
        badge: {
          en: locales.en.badge || product.badge?.en || "",
          bg: locales.bg.badge || product.badge?.bg || "",
        },
      });
    })();
  }
}, [mode, product]);

  const handleChange = (field, value, lang = null) => {
    if (lang) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((base64Images) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images].slice(0, 5), // max 5
      }));
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.images.length) {
      alert("Please upload at least one image.");
      return;
    }

    if (mode === "edit" && product) {
      await updateProduct(product._id, formData);
    } else {
      await createProduct(formData);
    }

    if (mode === "create") {
      setFormData({
        name: "",
        pricePerKg: "",
        category: "",
        stockInGrams: "",
        images: [],
        title: { en: "", bg: "" },
        description: { en: "", bg: "" },
        ingredients: { en: "", bg: "" },
        badge: { en: "", bg: "" },
      });
    }

    if (typeof onFinish === "function") onFinish();
  };

  return (
    <motion.div
      className="p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl lg:text-3xl font-semibold text-secondary text-center mb-6">
        {mode === "edit"
          ? `Editing: ${product?.name || "Product"}`
          : "Create New Product"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className={`space-y-6 ${
          loading ? "opacity-75 pointer-events-none" : ""
        }`}
      >
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product name (internal key)"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20 focus:ring-2 focus:ring-accent outline-none"
            required
            disabled={mode === "edit"} // can't rename existing product
          />

          <input
            type="number"
            placeholder="Price per kg"
            value={formData.pricePerKg}
            onChange={(e) => handleChange("pricePerKg", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20 focus:ring-2 focus:ring-accent outline-none"
            step="0.01"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20 focus:ring-2 focus:ring-accent outline-none"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Stock in grams"
            value={formData.stockInGrams}
            onChange={(e) => handleChange("stockInGrams", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20 focus:ring-2 focus:ring-accent outline-none"
            min="0"
          />
        </div>

        {/* Images */}
        <ProductImageUpload
          images={formData.images}
          onChange={handleImageChange}
          onRemove={handleRemoveImage}
        />

        {/* Translations */}
        <div className="border-t-4 border-accent-content/60 pt-6">
          <h3 className="text-2xl font-semibold text-secondary text-center mb-4">
            Localized Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* English */}
            <div className="flex flex-col text-center gap-4">
              <h4 className="text-lg font-bold text-accent-content">
                🇬🇧 English
              </h4>
              <input
                type="text"
                placeholder="Title"
                value={formData.title.en}
                onChange={(e) => handleChange("title", e.target.value, "en")}
                className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
                required
              />
              <input
                type="text"
                placeholder="Ingredients"
                value={formData.ingredients.en}
                onChange={(e) =>
                  handleChange("ingredients", e.target.value, "en")
                }
                className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
              />
              <input
                type="text"
                placeholder="Badge (e.g., New, Sale)"
                value={formData.badge.en}
                onChange={(e) => handleChange("badge", e.target.value, "en")}
                className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
              />
              <textarea
                placeholder="Description"
                value={formData.description.en}
                onChange={(e) =>
                  handleChange("description", e.target.value, "en")
                }
                className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
                rows="7"
              />
            </div>

            {/* Bulgarian */}
            <div className="flex flex-col text-center gap-4">
              <h4 className="text-lg font-bold text-accent-content">
                🇧🇬 Български
              </h4>
              <input
                type="text"
                placeholder="Заглавие"
                value={formData.title.bg}
                onChange={(e) => handleChange("title", e.target.value, "bg")}
                className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
                required
              />
              <input
                type="text"
                placeholder="Съставки"
                value={formData.ingredients.bg}
                onChange={(e) =>
                  handleChange("ingredients", e.target.value, "bg")
                }
                className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
              />
              <input
                type="text"
                placeholder="Значка (напр. Ново, Промоция)"
                value={formData.badge.bg}
                onChange={(e) => handleChange("badge", e.target.value, "bg")}
                className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
              />
              <textarea
                placeholder="Описание"
                value={formData.description.bg}
                onChange={(e) =>
                  handleChange("description", e.target.value, "bg")
                }
                className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
                rows="7"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-accent text-accent-content font-medium rounded-xl shadow-md hover:bg-accent/80 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              {mode === "edit" ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              {mode === "edit" ? <FaSave /> : <FaPlusCircle />}
              {mode === "edit" ? "Update Product" : "Create Product"}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
