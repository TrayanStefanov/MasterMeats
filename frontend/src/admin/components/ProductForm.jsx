import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlusCircle, FaSpinner, FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import fetchLocales from "../../lib/fetchLocales.js";
import { useProductStore } from "../../stores/useProductStore.js";
import { useSpiceStore } from "../stores/useSpiceStore.js";
import { useSpiceMixStore } from "../stores/useSpiceMixStore.js";

import ProductImageUpload from "./ProductImageUpload.jsx";
import CombinedSpiceSelector from "./CombinedSpiceSelector.jsx";

const ProductForm = ({ mode = "create", product = null, onFinish }) => {
  const { createProduct, updateProduct, loading } = useProductStore();
  const { spices, fetchSpices } = useSpiceStore();
  const { spiceMixes, fetchSpiceMixes } = useSpiceMixStore();

  const { t: tAdminProducts } = useTranslation("admin/products");
  const { t: tForms } = useTranslation("admin/forms");
  const { t: tCommon } = useTranslation("admin/common");

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
    isActive: false,
    defaultSpiceId: "",
    defaultSpiceMixId: "",
  });

  const [localizedTitle, setLocalizedTitle] = useState("");

  // Fetch spices and mixes on mount if creating or editing
  useEffect(() => {
    fetchSpices();
    fetchSpiceMixes();
  }, [fetchSpices, fetchSpiceMixes]);

  // Load product data for edit
  useEffect(() => {
    if (mode === "edit" && product) {
      (async () => {
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
          isActive: product.isActive || false,
          defaultSpiceId: product.defaultSpiceId || "",
          defaultSpiceMixId: product.defaultSpiceMixId || "",
        });

        const lang = i18next.language;
        setLocalizedTitle(
          locales[lang]?.title || product.title?.[lang] || product.name
        );
      })();
    }
  }, [mode, product]);

  useEffect(() => {
    if (mode === "edit" && product && formData.title) {
      const lang = i18next.language;
      setLocalizedTitle(
        formData.title[lang] || product.title?.[lang] || product.name
      );
    }
  }, [formData.title, mode, product]);

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
        images: [...prev.images, ...base64Images].slice(0, 5),
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
      alert(tAdminProducts("upload.alert"));
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
        isActive: false,
        defaultSpiceId: "",
        defaultSpiceMixId: "",
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
          ? tAdminProducts("editTitle", {
              name: localizedTitle || product?.name || "Product",
            })
          : tAdminProducts("createTitle")}
      </h2>

      <form
        onSubmit={handleSubmit}
        className={`space-y-6 ${
          loading ? "opacity-75 pointer-events-none" : ""
        }`}
      >
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="label">{tForms("product.nameLabel")}</label>
            <input
              type="text"
              placeholder={tForms("product.namePlaceholder")}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="input"
              required
              disabled={mode === "edit"}
            />
          </div>

          <div className="flex flex-col">
            <label className="label">{tForms("product.priceLabel")}</label>
            <input
              type="number"
              placeholder={tForms("product.pricePlaceholder")}
              value={formData.pricePerKg}
              onChange={(e) => handleChange("pricePerKg", e.target.value)}
              className="input"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="label">{tForms("product.categoryLabel")}</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="input"
              required
            >
              <option value="">
                {tForms("product.categoryDropdown.title")}
              </option>
              {Object.keys(
                tForms("product.categoryDropdown.categories", {
                  returnObjects: true,
                })
              ).map((key) => (
                <option key={key} value={key}>
                  {tForms(`product.categoryDropdown.categories.${key}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="label">{tForms("product.stock")}</label>
            <input
              type="number"
              placeholder={tForms("product.stock")}
              value={formData.stockInGrams}
              onChange={(e) => handleChange("stockInGrams", e.target.value)}
              className="input"
              min="0"
            />
          </div>
        </div>

        {/* Spice & Mix Select */}
        <div className="flex flex-col">
          <label className="label">{tForms("product.spiceChoice")}</label>
          <CombinedSpiceSelector
            spices={spices}
            mixes={spiceMixes}
            value={
              formData.defaultSpiceId
                ? { id: formData.defaultSpiceId, type: "spice" }
                : formData.defaultSpiceMixId
                ? { id: formData.defaultSpiceMixId, type: "mix" }
                : null
            }
            onChange={(val) => {
              if (!val) {
                // Clear both
                handleChange("defaultSpiceId", "");
                handleChange("defaultSpiceMixId", "");
                return;
              }

              if (val.type === "spice") {
                handleChange("defaultSpiceId", val.id);
                handleChange("defaultSpiceMixId", "");
              } else if (val.type === "mix") {
                handleChange("defaultSpiceMixId", val.id);
                handleChange("defaultSpiceId", "");
              }
            }}
          />
        </div>

        {/* Active Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
          />
          <label className="label">{tForms("product.isActive")}</label>
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
            {tForms("product.subtitle")}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* English */}
            <div className="flex flex-col text-center gap-4">
              <h4 className="text-lg font-bold text-accent-content">
                {tForms("product.langs.en.title")}
              </h4>

              <label className="label">
                {tForms("product.langs.en.titleLabel")}
              </label>
              <input
                type="text"
                placeholder={tForms("product.langs.en.titlePlaceholder")}
                value={formData.title.en}
                onChange={(e) => handleChange("title", e.target.value, "en")}
                className="input"
              />

              <label className="label">
                {tForms("product.langs.en.ingredientsLabel")}
              </label>
              <input
                type="text"
                placeholder={tForms("product.langs.en.ingredientsPlaceholder")}
                value={formData.ingredients.en}
                onChange={(e) =>
                  handleChange("ingredients", e.target.value, "en")
                }
                className="input"
              />

              <label className="label">
                {tForms("product.langs.en.badgeLabel")}
              </label>
              <input
                type="text"
                placeholder={tForms("product.langs.en.badgePlaceholder")}
                value={formData.badge.en}
                onChange={(e) => handleChange("badge", e.target.value, "en")}
                className="input"
              />

              <label className="label">
                {tForms("product.langs.en.descriptionLabel")}
              </label>
              <textarea
                placeholder={tForms("product.langs.en.descriptionPlaceholder")}
                value={formData.description.en}
                onChange={(e) =>
                  handleChange("description", e.target.value, "en")
                }
                className="input"
                rows="6"
              />
            </div>

            {/* Bulgarian */}
            <div className="flex flex-col text-center gap-4">
              <h4 className="text-lg font-bold text-accent-content">
                {tForms("product.langs.bg.title")}
              </h4>

              <label className="label">
                {tForms("product.langs.bg.titleLabel")}
              </label>
              <input
                type="text"
                placeholder={tForms("product.langs.bg.titlePlaceholder")}
                value={formData.title.bg}
                onChange={(e) => handleChange("title", e.target.value, "bg")}
                className="input"
              />

              <label className="label">
                {tForms("product.langs.bg.ingredientsLabel")}
              </label>
              <input
                type="text"
                placeholder={tForms("product.langs.bg.ingredientsPlaceholder")}
                value={formData.ingredients.bg}
                onChange={(e) =>
                  handleChange("ingredients", e.target.value, "bg")
                }
                className="input"
              />

              <label className="label">
                {tForms("product.langs.bg.badgeLabel")}
              </label>
              <input
                type="text"
                placeholder={tForms("product.langs.bg.badgePlaceholder")}
                value={formData.badge.bg}
                onChange={(e) => handleChange("badge", e.target.value, "bg")}
                className="input"
              />

              <label className="label">
                {tForms("product.langs.bg.descriptionLabel")}
              </label>
              <textarea
                placeholder={tForms("product.langs.bg.descriptionPlaceholder")}
                value={formData.description.bg}
                onChange={(e) =>
                  handleChange("description", e.target.value, "bg")
                }
                className="input"
                rows="6"
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
              {mode === "edit"
                ? tCommon("loading.updating")
                : tCommon("loading.creating")}
            </>
          ) : (
            <>
              {mode === "edit" ? <FaSave /> : <FaPlusCircle />}
              {mode === "edit"
                ? tCommon("buttons.updateProduct")
                : tCommon("buttons.createProduct")}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ProductForm;
