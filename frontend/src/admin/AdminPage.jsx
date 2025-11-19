import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { FaBoxOpen, FaChartBar, FaUsers } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { MdFactory } from "react-icons/md";

import { useTranslation } from "react-i18next";

import { useProductStore } from "../stores/useProductStore";

const ProductTab = lazy(() => import("./tabs/ProductTab"));
const ReservationsTab = lazy(() => import("./tabs/ReservationsTab"));
const UsersAndClientsTab = lazy(() => import("./tabs/UsersAndClientsTab"));
const ProductionTab = lazy(() => import("./tabs/ProductionTab"));
// const AnalyticsTab = lazy(() => import("./tabs/AnalyticsTab"));

const AdminPage = () => {
  const { t: tCommon } = useTranslation("admin/common");
  const tabs = [
    { id: "products", label: tCommon("tabs.products"), icon: <FaBoxOpen /> },
    {
      id: "reservations",
      label: tCommon("tabs.reservations"),
      icon: <FiBox />,
    },
    {
      id: "usersAndClients",
      label: tCommon("tabs.usersAndClients"),
      icon: <FaUsers />,
    },
    { id: "production", label: tCommon("tabs.production"), icon: <MdFactory /> },
    { id: "analytics", label: tCommon("tabs.analytics"), icon: <FaChartBar /> },
  ];
  const [activeTab, setActiveTab] = useState("products");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-secondary/80 via-secondary/40 to-secondary/80 p-8">
      <motion.h1
        className="text-3xl lg:text-4xl 2xl:text-6xl text-accent mb-8 text-center font-emphasis-heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-extrabold">{tCommon("title")}</p>
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
        <Suspense
          fallback={
            <p className="text-center text-secondary/70 py-8">
              Loading {activeTab}...
            </p>
          }
        >
          {activeTab === "products" && <ProductTab />}
          {activeTab === "reservations" && <ReservationsTab />}
          {activeTab === "usersAndClients" && <UsersAndClientsTab />}
          {activeTab === "production" && <ProductionTab />}
          {activeTab === "analytics" && (
            <div className="text-center text-secondary/70 py-12">
              Analytics tab coming soon!
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default AdminPage;
