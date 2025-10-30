import { useState } from "react";
import { motion } from "framer-motion";
import { FaStore, FaGlobe } from "react-icons/fa";
import OnlineReservationsTab from "./OnlineReservationsTab";
import IRLReservationsTab from "./IRLReservationsTab";

const ReservationsTab = () => {
  const [activeTab, setActiveTab] = useState("irl");

  const tabs = [
    { id: "irl", label: "IRL Reservations", icon: <FaStore /> },
    { id: "online", label: "Online Reservations", icon: <FaGlobe /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Sub-tabs */}
      <div className="flex gap-4 mb-6 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-accent text-accent-content shadow-md"
                : "bg-secondary/50 text-secondary-content hover:bg-secondary/70"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active content */}
      <div>
        {activeTab === "irl" && <IRLReservationsTab />}
        {activeTab === "online" && <OnlineReservationsTab />}
      </div>
    </motion.div>
  );
};

export default ReservationsTab;
