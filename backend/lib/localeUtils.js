import fs from "fs";
import path from "path";

const LOCALE_PATH = path.resolve(process.cwd(), "frontend/public/locales");
const SUPPORTED_LOCALES = ["en", "bg"];

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const readLocaleFile = (locale) => {
  try {
    const filePath = path.join(LOCALE_PATH, locale, "translation.json");
    ensureDir(path.dirname(filePath));

    if (!fs.existsSync(filePath)) {
      // Initialize a new translation file if missing
      fs.writeFileSync(filePath, JSON.stringify({}, null, 2), "utf8");
      return {};
    }

    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Failed to read locale file for ${locale}:`, err.message);
    return {};
  }
};

export const writeLocaleFile = (locale, data) => {
  try {
    const filePath = path.join(LOCALE_PATH, locale, "translation.json");
    ensureDir(path.dirname(filePath));

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    console.log(`Updated locale: ${locale}`);
  } catch (err) {
    console.error(`Failed to write locale file for ${locale}:`, err.message);
  }
};

export const updateLocaleKey = (name, newData) => {
  SUPPORTED_LOCALES.forEach((locale) => {
    try {
      const json = readLocaleFile(locale);
      json.products = json.products || {};

      // Merge product translation
      json.products[name] = {
        ...json.products[name],
        ...newData[locale],
      };

      writeLocaleFile(locale, json);
      console.log(`Updated "${name}" in ${locale}`);
    } catch (err) {
      console.error(`Failed to update ${locale} locale for ${name}:`, err.message);
    }
  });
};

export const deleteLocaleKey = (name) => {
  SUPPORTED_LOCALES.forEach((locale) => {
    try {
      const json = readLocaleFile(locale);
      if (json.products?.[name]) {
        delete json.products[name];
        writeLocaleFile(locale, json);
        console.log(`Deleted "${name}" from ${locale}`);
      }
    } catch (err) {
      console.error(`Failed to delete ${name} from ${locale}:`, err.message);
    }
  });
};
