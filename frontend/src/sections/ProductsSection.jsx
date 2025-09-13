import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard.jsx";

const ProductsSection = () => {
  const { t } = useTranslation();
  const title = t("products.title");
  const products = t("products.product", { returnObjects: true });

  return (
    <section id="products" className="py-20 bg-base-100">
      <div className="container mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold">{title}</h2>
      </div>

      <div className="container mx-auto flex flex-col gap-16">
        {products.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
