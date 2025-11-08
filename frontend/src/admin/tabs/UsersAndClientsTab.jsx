import { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserFriends } from "react-icons/fa";

import { useTranslation } from "react-i18next";

import UsersTab from "./UsersTab";
import ClientsTab from "./ClientsTab";

const ReservationsTab = () => {
  const [activeTab, setActiveTab] = useState("clients");
  const { t: tUAC } = useTranslation("admin/usersAndClients");

  const tabs = [
    { id: "users", label: tUAC("tabs.users"), icon: <FaUsers /> },
    { id: "clients", label: tUAC("tabs.clients"), icon: <FaUserFriends /> },
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
        {activeTab === "users" && <UsersTab />}
        {activeTab === "clients" && <ClientsTab />}
      </div>
    </motion.div>
  );
};

export default ReservationsTab;
