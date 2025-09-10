import React from 'react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HeroSection from './sections/HeroSection'
import ReviewsSection from './sections/ReviewsSection'
import ProductsSection from './sections/ProductsSection'
import AboutSection from './sections/AboutSection'
import ContactsSection from './sections/ContactsSection'
import CoreValuesSection from './sections/CoreValuesSection'

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CoreValuesSection />
      <ProductsSection />
      <AboutSection />
      <ReviewsSection />
      <ContactsSection />
      <Footer />
    </div>
  )
}

export default App
