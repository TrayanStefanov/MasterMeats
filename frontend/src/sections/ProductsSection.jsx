import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard.jsx";

const ProductsSection = () => {
  const { t } = useTranslation();
  const title = t("products.title");
  const products = t("products.product", { returnObjects: true });

  return (
    <section id="products" className="py-4">
      <div className="container mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-accent px-6 lg:px-0 my-2">
          {title}
        </h2>
        <div className="w-1/2 h-[3px] bg-accent mx-auto rounded-full"></div>
      </div>

      <div className="container mx-auto flex flex-col gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={idx}
            product={product}
            reverse={idx % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
