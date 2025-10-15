import { React, useState } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./sections/HeroSection";
import ReviewsSection from "./sections/ReviewsSection";
import ProductsSection from "./sections/ProductsSection";
import AboutSection from "./sections/AboutSection";
import ContactsFAQSection from "./sections/ContactsFAQSection";
import CoreValuesSection from "./sections/CoreValuesSection";

import AuthModal from "./components/AuthModal";
import CartModal from "./components/CartModal";
import BackToTopButton from "./components/BackToTopButton";

import { useUserStore } from "./stores/useUserStore";

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(null);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const { user } = useUserStore();

  const openAuthModal = () => {
    if (!user) setAuthModalOpen("login");
  };
  const closeAuthModal = () => setAuthModalOpen(false);
  const openCartModal = () => setCartModalOpen(true);
  const closeCartModal = () => setCartModalOpen(false);

  return (
    <div>
      <Toaster position="top-right"/>
      <Navbar onLoginClick={openAuthModal} onCartClick={openCartModal} />
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="fixed inset-0 bg-gradient-to-b from-secondary/80 via-secondary/30 to-secondary/80" />
        <div className="relative z-10">
          <HeroSection />
          <CoreValuesSection />
          <ProductsSection />
          <AboutSection />
          <ReviewsSection />
          <ContactsFAQSection />
        </div>
        <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
        <CartModal isOpen={cartModalOpen} onClose={closeCartModal} />
        <BackToTopButton />
      </div>
      <Footer />
    </div>
  );
}

export default App;
