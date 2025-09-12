import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard.jsx";

const ProductsSection = () => {
  const { t } = useTranslation();

  // 👇 Get localized title & product list
  const title = t("products.title");
  const products = t("products.product", { returnObjects: true });

  return (
    <section id="products" className="py-20 bg-base-200">
      <div className="container mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold">{title}</h2>
      </div>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;