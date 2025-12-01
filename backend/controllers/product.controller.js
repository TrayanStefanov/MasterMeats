import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import { updateLocaleKey, deleteLocaleKey } from "../lib/localeUtils.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find(req.query.showAll ? {} : { isActive: true });
		res.json(products);
	} catch (error) {
		console.error("Error in getAllProducts controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) return res.status(404).json({ message: "Product not found" });
		res.json(product);
	} catch (error) {
		console.error("Error in getProductById:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const {
			name,
			description,
			pricePerKg,
			images,
			category,
			stockInGrams,
			title,
			ingredients,
			badge,
		} = req.body;

		if (!name || !pricePerKg || !images?.length || !category) {
			return res
				.status(400)
				.json({ message: "Missing required fields for product creation." });
		}

		if (req.body.defaultSpiceId === "") req.body.defaultSpiceId = null;
		if (req.body.defaultSpiceMixId === "") req.body.defaultSpiceMixId = null;

		const uploadedImages = [];
		for (const img of images.slice(0, 5)) {
			if (img.startsWith("data:")) {
				const upload = await cloudinary.uploader.upload(img, {
					folder: "products",
				});
				uploadedImages.push({
					url: upload.secure_url,
					public_id: upload.public_id,
				});
			} else {
				uploadedImages.push({ url: img });
			}
		}

		const product = await Product.create({
			name,
			description: description?.en || description,
			pricePerKg,
			images: uploadedImages,
			category,
			stockInGrams: stockInGrams || null,
			defaultSpiceId: req.body.defaultSpiceId || null,
			defaultSpiceMixId: req.body.defaultSpiceMixId || null,
			isActive: req.body.isActive || false,
		});

		const i18nData = {
			en: {
				title: title?.en || name,
				description: description?.en || "",
				ingredients: ingredients?.en || "",
				badge: badge?.en || "",
			},
			bg: {
				title: title?.bg || name,
				description: description?.bg || "",
				ingredients: ingredients?.bg || "",
				badge: badge?.bg || "",
			},
		};

		updateLocaleKey(name, i18nData);
		res.status(201).json(product);
	} catch (error) {
		console.error("Error in createProduct:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const existingProduct = await Product.findById(id);
		if (!existingProduct) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Image Handling
		if (updates.images && Array.isArray(updates.images)) {
			const uploaded = [];

			// Upload new base64 images; preserve already-uploaded image objects
			for (const img of updates.images.slice(0, 5)) {
				// New images
				if (typeof img === "string" && img.startsWith("data:")) {
					const upload = await cloudinary.uploader.upload(img, {
						folder: "products",
					});
					uploaded.push({
						url: upload.secure_url,
						public_id: upload.public_id,
					});
				} else if (typeof img === "object" && img.url) {
					// Already uploaded / provided as { url, public_id } from DB
					uploaded.push(img);
				} else if (typeof img === "string" && img.startsWith("http")) {
					// Remote url string (Cloudinary url already uploaded there.)
					uploaded.push({ url: img });
				}
			}

			// Find removed images (present in DB but not in new uploaded list by public_id)
			const oldImages = existingProduct.images || [];
			const removed = oldImages.filter((old) => {
				// if an old iamge has a public_id we match on it, otherwise match on cloudinary url
				if (old.public_id) {
					return !uploaded.find((u) => u.public_id === old.public_id);
				}
				return !uploaded.find((u) => u.url === old.url);
			});

			// Delete removed from Cloudinary
			for (const img of removed) {
				try {
					if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
				} catch (err) {
					console.warn("Failed to delete Cloudinary image:", err.message);
				}
			}

			updates.images = uploaded;
		}

		// DB fields.
		if (updates.description && typeof updates.description === "object") {
			// If frontend provided a non-empty en string, use it; otherwise keep the existing DB value
			const enDesc =
				typeof updates.description.en === "string" &&
					updates.description.en.trim() !== ""
					? updates.description.en
					: existingProduct.description || "";
			updates.description = enDesc;
		}

		// If name provided as object (unlikely, but just in case) - normalize to string
		if (updates.name && typeof updates.name === "object") {
			updates.name = updates.name.en || existingProduct.name;
		}

		// For other  DB fields keep existing if not provided by frontend
		if (updates.pricePerKg === undefined) delete updates.pricePerKg;
		if (updates.category === undefined) delete updates.category;
		if (updates.stockInGrams === undefined) delete updates.stockInGrams;

		if (updates.defaultSpiceId === "") updates.defaultSpiceId = null;
		if (updates.defaultSpiceMixId === "") updates.defaultSpiceMixId = null;
		const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
			new: true,
		});

		// Build locale payloads from non-empty provided fields. Prevents overwriting with empty strings sent by frontend.
		const makeNonEmptyString = (v) =>
			typeof v === "string" && v.trim() !== "" ? v : null;

		const enLocale = {};
		const bgLocale = {};
		let shouldUpdateLocales = false;

		// If the frontend sent title as an object, check fields
		if (updates.title && typeof updates.title === "object") {
			const tEn = makeNonEmptyString(updates.title.en);
			const tBg = makeNonEmptyString(updates.title.bg);
			if (tEn !== null) {
				enLocale.title = tEn;
				shouldUpdateLocales = true;
			}
			if (tBg !== null) {
				bgLocale.title = tBg;
				shouldUpdateLocales = true;
			}
		}

		// Description: we expect frontend may send { en, bg } but DB saves en description as a fallback
		// Only update locale files description keys if non-empty strings were provided
		if (req.body.description && typeof req.body.description === "object") {
			const dEn = makeNonEmptyString(req.body.description.en);
			const dBg = makeNonEmptyString(req.body.description.bg);
			if (dEn !== null) {
				enLocale.description = dEn;
				shouldUpdateLocales = true;
			}
			if (dBg !== null) {
				bgLocale.description = dBg;
				shouldUpdateLocales = true;
			}
		}

		if (updates.ingredients && typeof updates.ingredients === "object") {
			const iEn = makeNonEmptyString(updates.ingredients.en);
			const iBg = makeNonEmptyString(updates.ingredients.bg);
			if (iEn !== null) {
				enLocale.ingredients = iEn;
				shouldUpdateLocales = true;
			}
			if (iBg !== null) {
				bgLocale.ingredients = iBg;
				shouldUpdateLocales = true;
			}
		}

		if (updates.badge && typeof updates.badge === "object") {
			const bEn = makeNonEmptyString(updates.badge.en);
			const bBg = makeNonEmptyString(updates.badge.bg);
			if (bEn !== null) {
				enLocale.badge = bEn;
				shouldUpdateLocales = true;
			}
			if (bBg !== null) {
				bgLocale.badge = bBg;
				shouldUpdateLocales = true;
			}
		}

		// If the frontend sent an entire locale object with empty strings we don't include them in the payload and preserve existing values.

		if (shouldUpdateLocales) {
			// Build the payloads only containing languages that have at least one key to update
			const i18nData = {};
			if (Object.keys(enLocale).length > 0) i18nData.en = enLocale;
			if (Object.keys(bgLocale).length > 0) i18nData.bg = bgLocale;

			try {
				// updateLocaleKey should merge/update the JSON translations on disk.
				updateLocaleKey(updatedProduct.name, i18nData);
			} catch (err) {
				console.warn("Failed to update locale key:", err.message);
			}
		}
		res.status(200).json(updatedProduct);
	} catch (error) {
		console.error("Error in updateProduct controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) return res.status(404).json({ message: "Product not found" });

		// Delete images from Cloudinary
		for (const img of product.images || []) {
			try {
				if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
			} catch (err) {
				console.warn("Error deleting image:", err.message);
			}
		}

		await Product.findByIdAndDelete(id);
		deleteLocaleKey(product.name);

		res.json({ message: "Product deleted successfully", product });
	} catch (error) {
		console.error("Error in deleteProduct controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const enableProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndUpdate(
			id,
			{ isActive: true },
			{ new: true }
		);
		if (!product) return res.status(404).json({ message: "Product not found" });
		res.json({ message: "Product enabled", product });
	} catch (error) {
		console.error("Error enabling product:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const disableProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndUpdate(
			id,
			{ isActive: false },
			{ new: true }
		);
		if (!product) return res.status(404).json({ message: "Product not found" });
		res.json({ message: "Product disabled", product });
	} catch (error) {
		console.error("Error disabling product:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};