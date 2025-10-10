import { FaShoppingBasket } from "react-icons/fa";

const CartModalEmpty = ({ onClose }) => {
  const handleStartShopping = () => {
  const productsSection = document.querySelector("#products");
  if (productsSection) {
    const navbarHeight = document.querySelector("nav.navbar")?.offsetHeight || 0;

    // Scroll to the top of the section minus navbar height
    const sectionTop = productsSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: sectionTop - navbarHeight,
      behavior: "smooth",
    });
  }

  if (onClose) onClose();
};

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16">
      <FaShoppingBasket className="h-24 w-24 text-accent/40" />
      <h3 className="text-2xl font-semibold text-accent">Your cart is empty</h3>
      <p className="text-primary-content/70">
        Looks like you haven’t added anything yet.
      </p>
      <button
        onClick={handleStartShopping}
        className="mt-4 rounded-lg bg-accent px-6 py-2 text-primary font-semibold 
                   hover:bg-accent/80 focus:ring-2 focus:ring-accent/50 
                   transition-all shadow-md shadow-accent/20"
      >
        Start Shopping
      </button>
    </div>
  );
};

export default CartModalEmpty;
