  import { useState } from "react";
  import { motion } from "framer-motion";
  import { FaPlusCircle, FaSpinner, FaUpload } from "react-icons/fa";
  import { useProductStore } from "../stores/useProductStore";
  import ProductImageUpload from "./ProductImageUpload";

  const categories = ["fillet"];

  const CreateProductForm = () => {
    const [newProduct, setNewProduct] = useState({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });

    const { createProduct, loading } = useProductStore();

    const handleSubmit = async (e) => {
      e.preventDefault();
      await createProduct(newProduct);
      setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setNewProduct({ ...newProduct, image: reader.result });
        reader.readAsDataURL(file);
      }
    };

    return (
      <motion.div
        className="bg-accent/10 backdrop-blur-md border border-accent/30 rounded-3xl p-8 max-w-xl mx-auto shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-secondary mb-6">Create New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full bg-gray-800/60 border border-accent/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            required
          />

          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full bg-gray-800/60 border border-accent/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            rows="3"
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-full bg-gray-800/60 border border-accent/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            step="0.01"
            required
          />

          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="w-full bg-gray-800/60 border border-accent/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-gray-700/60 px-4 py-2 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-600/60 transition-colors">
              <FaUpload className="inline-block mr-2" />
              {/* Image Upload */}
          <ProductImageUpload
            image={newProduct.image}
            onChange={handleImageChange}
          />
            </label>
            {newProduct.image && <span className="text-sm text-gray-400">Image uploaded</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-accent text-gray-900 font-medium rounded-xl shadow-md hover:bg-accent/80 transition disabled:opacity-50"
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
