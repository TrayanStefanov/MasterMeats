import { FaShoppingBasket } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { useSmoothScrollNav } from "../hooks/useSmoothScrollNav";

const CartModalEmpty = ({ onClose }) => {
  const { scrollToSection } = useSmoothScrollNav(
    [{ href: "#products" }],
    onClose
  );
  const handleStartShopping = () => scrollToSection("#products");
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center bg-primary/90 border-4 border-accent text-primary-content rounded-2xl justify-center space-y-4 py-16">
      <FaShoppingBasket className="h-24 w-24 text-primary-content/80" />
      <h3 className="text-xl lg:text-2xl 2xl:text-3xl font-semibold text-accent">
        {t("cart.empty.title")}
      </h3>
      <p className="text-primary text-sm lg:text-base 2xl:text-lg">
        {t("cart.empty.text")}
      </p>
      <button
        onClick={handleStartShopping}
        className="mt-4 rounded-lg bg-accent text-sm lg:text-base 2xl:text-lg px-6 py-2 text-secondary font-semibold 
                   hover:bg-accent/80 focus:ring-2 focus:ring-accent/50 
                   transition-all shadow-md shadow-accent/20"
      >
        {t("cart.empty.btnCTA")}
      </button>
    </div>
  );
};

export default CartModalEmpty;
