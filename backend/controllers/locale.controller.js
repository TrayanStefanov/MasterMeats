import {
  updateLocaleKey,
  deleteLocaleKey,
} from "../lib/localeUtils.js";

export const updateLocale = async (req, res) => {
  try {
    const { name, newData } = req.body;

    if (!name || !newData) {
      return res.status(400).json({ message: "Missing name or newData" });
    }

    updateLocaleKey(name, newData);
    res.status(200).json({ message: "Locale updated successfully" });
  } catch (error) {
    console.error("Error updating locale:", error.message);
    res.status(500).json({ message: "Failed to update locale", error: error.message });
  }
};

export const removeLocaleKey = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: "Missing product name" });
    }

    deleteLocaleKey(name);
    res.status(200).json({ message: "Locale key deleted successfully" });
  } catch (error) {
    console.error("Error deleting locale key:", error.message);
    res.status(500).json({ message: "Failed to delete locale key", error: error.message });
  }
};
