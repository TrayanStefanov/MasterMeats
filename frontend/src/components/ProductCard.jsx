import { motion } from "framer-motion";

const ProductCard = ({ product, reverse = false }) => (
  <motion.div
    className={`relative flex flex-col md:flex-row items-stretch rounded-3xl overflow-hidden transition-all duration-300 bg-accent ${
      reverse ? "md:flex-row-reverse" : ""
    }`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    whileHover={{ scale: 1.01 }}
  >
    {/* Image section */}
    <div className="flex-1 relative p-4">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover object-center rounded-lg"
      />

      {product.badge && (
        <span className="absolute top-5 left-5 bg-accent text-primary-content px-4 py-1 text-xs font-bold uppercase rounded-full tracking-wider shadow-lg">
          {product.badge}
        </span>
      )}
    </div>

    {/* Text section */}
    <div className="flex-1 backdrop-blur-md text-white p-8 flex flex-col justify-between relative z-10">
      <h3 className="text-4xl font-serif font-bold mb-4 indent-4">
        {product.title}
      </h3>
      <p className="text-lg leading-relaxed mx-8">
        {product.description}
      </p>
      <div className="flex items-center justify-end gap-4">
        <span className="text-2xl font-bold">
          {product.price}
        </span>
        <button className="border border-secondary px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform shadow-md">
          {product.btnBuy}
        </button>
      </div>
    </div>
  </motion.div>
);

export default ProductCard;
