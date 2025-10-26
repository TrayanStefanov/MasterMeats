import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
	{
		url: { type: String, required: true },
		public_id: { type: String },
	},
	{ _id: false }
);

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
		images: {
			type: [imageSchema],
			validate: {
				validator: (arr) => arr.length > 0 && arr.length <= 5,
				message: "You must upload between 1 and 5 images",
			},
			required: [true, "At least one image is required"],
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
