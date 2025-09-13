import { motion } from "framer-motion";

const ProductCard = ({ product }) => (
  <motion.div
    className="flex flex-col md:flex-row h-[50vh] w-full overflow-hidden"
    whileHover={{ scale: 1.01 }}
    transition={{ duration: 0.3 }}
  >
    {/* Image */}
    <div className="flex-1 h-64 md:h-full">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover object-center"
      />
      {product.badge && (
        <span className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 text-xs uppercase tracking-wide">
          {product.badge}
        </span>
      )}
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col justify-center p-6 md:p-12">
      <h3 className="text-3xl font-semibold mb-4">{product.title}</h3>
      <p className="text-base text-neutral-content mb-6">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">{product.price}</span>
        <button className="btn btn-primary">{product.btnBuy}</button>
      </div>
    </div>
  </motion.div>
);

export default ProductCard;
