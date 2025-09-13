import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard.jsx";

const ProductsSection = () => {
  const { t } = useTranslation();
  const title = t("products.title");
  const products = t("products.product", { returnObjects: true });

  return (
    <section id="products" className="py-5 bg-primary">
      <div className="container mx-auto text-center my-10">
        <h2 className="text-4xl font-bold text-accent-content">{title}</h2>
      </div>

      <div className="container mx-auto flex flex-col">
        {products.map((product, idx) => (
          <ProductCard
            key={idx}
            product={product}
            reverse={idx % 2 === 1} // Alternate left/right
          />
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
