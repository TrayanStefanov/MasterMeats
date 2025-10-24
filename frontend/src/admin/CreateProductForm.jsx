import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlusCircle, FaSpinner } from "react-icons/fa";
import { useProductStore } from "../stores/useProductStore";
import ProductImageUpload from "./ProductImageUpload";

const categories = ["fillet"];

const CreateProductForm = () => {
  const { createProduct, loading } = useProductStore();

  const [newProduct, setNewProduct] = useState({
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

  const handleChange = (field, value, lang = null) => {
    if (lang) {
      setNewProduct((prev) => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value },
      }));
    } else {
      setNewProduct((prev) => ({ ...prev, [field]: value }));
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
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images].slice(0, 5), // max 5
      }));
    });
  };

  const handleRemoveImage = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProduct.images.length) {
      alert("Please upload at least one image.");
      return;
    }

    await createProduct(newProduct);

    setNewProduct({
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
  };

  return (
    <motion.div
      className=" p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-secondary text-center mb-6">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* MongoDB Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product name (internal key)"
            value={newProduct.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            required
          />

          <input
            type="number"
            placeholder="Price per kg"
            value={newProduct.pricePerKg}
            onChange={(e) => handleChange("pricePerKg", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            step="0.01"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={newProduct.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
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
            value={newProduct.stockInGrams}
            onChange={(e) => handleChange("stockInGrams", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            min="0"
          />
        </div>

        <ProductImageUpload
          images={newProduct.images}
          onChange={handleImageChange}
          onRemove={handleRemoveImage}
        />

        {/* i18n Info */}
        <div className="border-t-4 border-accent-content/60 pt-6">
          <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-secondary text-center  mb-4">
            Localized Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col text-center gap-4">
              <h4 className="text-lg lg:text-xl 2xl:text-2xl font-bold text-accent-content text-center mb-2">
                🇬🇧 English
              </h4>
              <input
                type="text"
                placeholder="Title"
                value={newProduct.title.en}
                onChange={(e) => handleChange("title", e.target.value, "en")}
                className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                required
              />
              <input
                type="text"
                placeholder="Ingredients"
                value={newProduct.ingredients.en}
                onChange={(e) =>
                  handleChange("ingredients", e.target.value, "en")
                }
                className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
              />
              <input
                type="text"
                placeholder="Badge (e.g., New, Sale)"
                value={newProduct.badge.en}
                onChange={(e) => handleChange("badge", e.target.value, "en")}
                className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
              />
              <textarea
                placeholder="Description"
                value={newProduct.description.en}
                onChange={(e) =>
                  handleChange("description", e.target.value, "en")
                }
                className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                rows="7"
              />
            </div>

            <div className="flex flex-col text-center gap-4">
              <h4 className="text-lg lg:text-xl 2xl:text-2xl font-bold text-accent-content text-center mb-2">
                🇧🇬 Български
              </h4>
              <input
                type="text"
                placeholder="Заглавие"
                value={newProduct.title.bg}
                onChange={(e) => handleChange("title", e.target.value, "bg")}
                className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                required
              />
              <input
                type="text"
                placeholder="Съставки"
                value={newProduct.ingredients.bg}
                onChange={(e) =>
                  handleChange("ingredients", e.target.value, "bg")
                }
                className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
              />
              <input
                type="text"
                placeholder="Значка (напр. Ново, Промоция)"
                value={newProduct.badge.bg}
                onChange={(e) => handleChange("badge", e.target.value, "bg")}
                className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
              />
              <textarea
                placeholder="Описание"
                value={newProduct.description.bg}
                onChange={(e) =>
                  handleChange("description", e.target.value, "bg")
                }
                className="w-full p-3 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                rows="7"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-accent text-accent-content font-medium rounded-xl shadow-md hover:bg-accent/80 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Creating...
            </>
          ) : (
            <>
              <FaPlusCircle /> Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
