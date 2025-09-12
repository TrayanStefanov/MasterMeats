import { motion } from "framer-motion";

const ProductCard = ({ product }) => (
  <motion.div
    className="bg-secondary border-4 border-accent shadow-md rounded-xl overflow-hidden flex flex-col"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    {/* Image */}
    <div className="relative group">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-64 object-cover"
      />
      {product.badge && (
        <span className="absolute bottom-2 left-2 badge badge-accent text-secondary">
          {product.badge}
        </span>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
    </div>

    {/* Content */}
    <div className="p-4 flex flex-col justify-between flex-1">
      <h5 className="text-xl font-bold mb-2">{product.title}</h5>
      <p className="text-sm text-neutral-content mb-4">{product.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-semibold text-lg">{product.price}</span>
        <button className="btn btn-primary">{product.btnBuy}</button>
      </div>
    </div>
  </motion.div>
);

export default ProductCard;