import { Routes, Route} from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./sections/HeroSection";
import ProductsSection from "./sections/ProductsSection";
import AboutSection from "./sections/AboutSection";
import ReviewsSection from "./sections/ReviewsSection";
import ContactsFAQSection from "./sections/ContactsFAQSection";
import CoreValuesSection from "./sections/CoreValuesSection";

import AuthModal from "./modals/AuthModal";
import CartModal from "./modals/CartModal";
import BackToTopButton from "./components/BackToTopButton";

import AdminPage from "./admin/AdminPage";
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
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Navbar onLoginClick={openAuthModal} onCartClick={openCartModal} />

      <main className="flex-grow relative overflow-x-hidden">
        <Routes>
          {/* Public Site */}
          <Route
            path="/"
            element={
              <div className="relative min-h-screen">
                <div className="fixed inset-0 bg-gradient-to-b from-secondary/80 via-secondary/30 to-secondary/80" />
                <div className="relative z-10">
                  <HeroSection />
                  <CoreValuesSection />
                  <ProductsSection />
                  <AboutSection />
                  <ReviewsSection />
                  <ContactsFAQSection />
                </div>
              </div>
            }
          />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

        <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
        <CartModal isOpen={cartModalOpen} onClose={closeCartModal} />
        <BackToTopButton />
      </main>

      <Footer />
    </div>
  );
}

export default App;
