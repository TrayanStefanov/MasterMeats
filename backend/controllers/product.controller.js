import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import { updateLocaleKey, deleteLocaleKey } from "../lib/localeUtils.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.json(products);
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
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

		const uploadedUrls = [];
		for (const img of images.slice(0, 5)) {
			const upload = await cloudinary.uploader.upload(img, {
				folder: "products",
			});
			uploadedUrls.push(upload.secure_url);
		}

		const product = await Product.create({
			name,
			description: description?.en || description,
			pricePerKg,
			images: uploadedUrls,
			category,
			stockInGrams: stockInGrams || null,
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
		console.log("Error in createProduct controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.images?.length) {
			for (const img of product.images) {
				const publicId = img.split("/").pop().split(".")[0];
				try {
					await cloudinary.uploader.destroy(`products/${publicId}`);
				} catch (err) {
					console.warn("Error deleting image from Cloudinary:", err.message);
				}
			}
		}

		await Product.findByIdAndDelete(id);
		deleteLocaleKey(product.name);

		res.json({ message: "Product deleted successfully", product });
	} catch (error) {
		console.log("Error in deleteProduct controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
