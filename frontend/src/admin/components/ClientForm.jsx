import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientStore } from "../stores/useClientStore";
import { useTranslation } from "react-i18next";

const ClientForm = ({ client, setClient }) => {
  const { t: tForms } = useTranslation("admin/forms");
  const { clients } = useClientStore();

  const [tagInput, setTagInput] = useState("");
  const wrapperRef = useRef(null);

  const handleChange = (field, value) => {
    setClient((prev) => ({ ...prev, [field]: value }));
  };

  const allTags = useMemo(() => {
    const tags = new Set();
    clients.forEach((c) => c.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [clients]);

  const filteredSuggestions = useMemo(() => {
    if (!tagInput) return [];
    return allTags
      .filter(
        (t) =>
          t.toLowerCase().startsWith(tagInput.toLowerCase()) &&
          !client.tags?.includes(t)
      )
      .slice(0, 6);
  }, [tagInput, allTags, client.tags]);

  const handleAddTag = (e, tagOverride = null) => {
    e?.preventDefault?.();
    const tag = (tagOverride || tagInput).trim();
    if (!tag) return;
    if (!client.tags?.includes(tag)) {
      handleChange("tags", [...(client.tags || []), tag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    handleChange(
      "tags",
      client.tags.filter((t) => t !== tagToRemove)
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setTagInput("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="border-t-4 border-accent-content/60 pt-6" ref={wrapperRef}>
      <h3 className="text-2xl font-semibold text-secondary text-center mb-4">
        {tForms("client.title")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            {tForms("client.nameLabel")}
          </label>
          <input
            type="text"
            placeholder={tForms("client.namePlaceholder")}
            value={client.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            {tForms("client.phoneLabel")}
          </label>
          <input
            type="text"
            placeholder={tForms("client.phonePlaceholder")}
            value={client.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-secondary text-sm mb-1">
            {tForms("client.emailLabel")}
          </label>
          <input
            type="email"
            placeholder={tForms("client.emailPlaceholder")}
            value={client.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
          />
        </div>
        <div className="flex flex-col md:col-span-2 mb-6">
          <label className="text-secondary text-sm mb-1">
            {tForms("client.tagsLabel", { defaultValue: "Tags" })}
          </label>

          <div className="flex flex-wrap items-center gap-2 p-3 rounded-md bg-secondary border border-accent/20">
            {client.tags?.length > 0 ? (
              client.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-accent-content/20 text-primary px-2 py-1 rounded-full text-xs flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-accent-content/70 hover:text-accent-content text-xs"
                  >
                    ✕
                  </button>
                </span>
              ))
            ) : (
              <span className="text-primary/40 text-sm italic">
                {tForms("client.noTags", { defaultValue: "No tags yet" })}
              </span>
            )}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
              placeholder={tForms("client.tagsPlaceholder", {
                defaultValue: "Type and press Enter...",
              })}
              className="flex-1 w-full p-3 bg-transparent text-primary outline-none text-sm"
            />
          </div>

          <AnimatePresence>
            {filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-wrap gap-2 mt-2"
              >
                {filteredSuggestions.map((tag) => (
                  <button
                    key={tag}
                    onClick={(e) => handleAddTag(e, tag)}
                    className="px-3 py-1 bg-accent-content/10 text-primary rounded-full text-xs hover:bg-accent-content/30 transition"
                  >
                    + {tag}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notes */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-secondary text-sm mb-1">
            {tForms("client.notesLabel")}
          </label>
          <textarea
            placeholder={tForms("client.notesPlaceholder")}
            value={client.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            rows="3"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientForm;
