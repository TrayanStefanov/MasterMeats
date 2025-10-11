import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		pricePerKg: {
			type: Number,
			required: [true, "Price per kilogram is required"],
			min: [0, "Price must be a positive number"],
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		category: {
			type: String,
			required: true,
		},
		stockInGrams: {
			type: Number,
			min: [0, "Stock cannot be negative"],
			default: null,
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
