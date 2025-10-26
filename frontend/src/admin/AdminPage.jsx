import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlusCircle, FaBoxOpen, FaChartBar } from "react-icons/fa";

import ProductTab from "./ProductTab";
/* import AnalyticsTab from "./AnalyticsTab"; */
import { useProductStore } from "../stores/useProductStore";

const tabs = [
  { id: "products", label: "Products", icon: <FaBoxOpen /> },
  { id: "analytics", label: "Analytics", icon: <FaChartBar /> },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-secondary/80 via-secondary/40 to-secondary/80 p-8">
      <motion.h1
        className="text-3xl lg:text-4xl 2xl:text-6xl font-bold text-accent mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Admin Dashboard
      </motion.h1>

      <div className="flex gap-4 mb-8 flex-wrap justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-primary/90 text-accent-content shadow-lg shadow-accent-content/50"
                : "bg-primary/90 text-primary-content hover:bg-primary/80"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl bg-primary/80 border-4 border-accent rounded-2xl p-8 shadow-xl">
        {activeTab === "products" && <ProductTab />}
        {activeTab === "analytics" && <div className="text-secondary">Analytics</div>}
        {/* <AnalyticsTab /> */}
      </div>
    </div>
  );
};

export default AdminPage;
