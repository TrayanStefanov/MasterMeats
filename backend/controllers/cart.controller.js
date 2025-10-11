import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
	try {
		// Fetch full product details for all items in the user's cart
		const productIds = req.user.cartItems.map((item) => item.product);
		const products = await Product.find({ _id: { $in: productIds } });

		// Combine product data with quantity in grams
		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find(
				(cartItem) => cartItem.product.toString() === product._id.toString()
			);
			return {
				...product.toJSON(),
				quantityInGrams: item.quantity, 
				subtotal: (product.pricePerKg * item.quantity) / 1000, // price per kg × grams ÷ 1000
			};
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId, quantityInGrams } = req.body;
		const user = req.user;

		if (quantityInGrams < 500 || quantityInGrams % 100 !== 0) {
			return res.status(400).json({
				message: "Minimum order is 500g, and quantity must be in 100g increments.",
			});
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const existingItem = user.cartItems.find(
			(item) => item.product.toString() === productId
		);

		if (existingItem) {
			existingItem.quantity += quantityInGrams;
		} else {
			user.cartItems.push({ product: productId, quantity: quantityInGrams });
		}

		await user.save();
		res.status(200).json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (productId) {
			user.cartItems = user.cartItems.filter(
				(item) => item.product.toString() !== productId
			);
		} else {
			user.cartItems = [];
		}

		await user.save();
		res.status(200).json(user.cartItems);
	} catch (error) {
		console.log("Error in removeAllFromCart controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantityInGrams } = req.body;
		const user = req.user;

		if (quantityInGrams < 500 || quantityInGrams % 100 !== 0) {
			return res.status(400).json({
				message: "Minimum order is 500g, and quantity must be in 100g increments.",
			});
		}

		const existingItem = user.cartItems.find(
			(item) => item.product.toString() === productId
		);

		if (!existingItem) {
			return res.status(404).json({ message: "Product not found in cart" });
		}

		if (quantityInGrams === 0) {
			user.cartItems = user.cartItems.filter(
				(item) => item.product.toString() !== productId
			);
		} else {
			existingItem.quantity = quantityInGrams;
		}

		await user.save();
		res.status(200).json(user.cartItems);
	} catch (error) {
		console.log("Error in updateQuantity controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};