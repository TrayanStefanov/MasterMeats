import { React, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./sections/HeroSection";
import ReviewsSection from "./sections/ReviewsSection";
import ProductsSection from "./sections/ProductsSection";
import AboutSection from "./sections/AboutSection";
import ContactsFAQSection from "./sections/ContactsFAQSection";
import CoreValuesSection from "./sections/CoreValuesSection";

import LoginModal from "./components/LoginModal";
import SignUpModal from "./components/SignUpModal";

import { useUserStore } from "./stores/useUserStore";

function App() {
  const [authModal, setAuthModal] = useState(null);
  const { user } = useUserStore();

  const openLoginModal = () => {
    if (!user) setAuthModal("login");
  };
  const openSignUpModal = () => {
    if (!user) setAuthModal("signup");
  };

  const closeAllModals = () => setAuthModal(null);

  return (
    <div>
      <Navbar onLoginClick={openLoginModal} />
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="fixed inset-0 bg-gradient-to-b from-secondary/80 via-secondary/30  to-secondary/80" />
        <div className="relative z-10">
          <HeroSection />
          <CoreValuesSection />
          <ProductsSection />
          <AboutSection />
          <ReviewsSection />
          <ContactsFAQSection />
        </div>
        <LoginModal
          isOpen={authModal === "login"}
          onClose={closeAllModals}
          openSignUpModal={openSignUpModal}
          onLoginSuccess={closeAllModals}
        />

        <SignUpModal
          isOpen={authModal === "signup"}
          onClose={closeAllModals}
          openLoginModal={openLoginModal}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
