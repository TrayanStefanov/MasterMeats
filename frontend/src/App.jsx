import React from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./sections/HeroSection";
import ReviewsSection from "./sections/ReviewsSection";
import ProductsSection from "./sections/ProductsSection";
import AboutSection from "./sections/AboutSection";
import ContactsFAQSection from "./sections/ContactsFAQSection";
import CoreValuesSection from "./sections/CoreValuesSection";

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/80 via-secondary/30  to-secondary/80" />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <CoreValuesSection />
        <ProductsSection />
        <AboutSection />
        <ReviewsSection />
        <ContactsFAQSection />
        <Footer />
      </div>
    </div>
  );
}

export default App;
