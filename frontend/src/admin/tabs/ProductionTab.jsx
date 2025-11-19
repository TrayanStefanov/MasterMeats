import { useState } from "react";
import { motion } from "framer-motion";
import { GiCoolSpices, GiZigzagLeaf} from "react-icons/gi";
import { MdConveyorBelt } from "react-icons/md";
import { useTranslation } from "react-i18next";

import SpiceTab from "./SpiceTab";
import SpiceMixesTab from "./SpiceMixesTab";
import BatchesTab from "./BatchesTab";


const ProductionTab = () => {
  const [activeTab, setActiveTab] = useState("batches");
  const { t: tProduction } = useTranslation("admin/production");

  const tabs = [
    { id: "batches", label: tProduction("tabs.batches"), icon: <MdConveyorBelt /> },
    {
      id: "spiceMixes",
      label: tProduction("tabs.spiceMixes"),
      icon: <GiCoolSpices />,
    },
    { id: "spices", label: tProduction("tabs.spices"), icon: <GiZigzagLeaf /> },
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
            className={`flex items-center text-base lg:text-lg xl:text-xl gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
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
        {activeTab === "batches" && <BatchesTab />}
        {activeTab === "spiceMixes" && <SpiceMixesTab />}
        {activeTab === "spices" && <SpiceTab />}
      </div>
    </motion.div>
  );
};

export default ProductionTab;
