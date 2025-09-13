import React from 'react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HeroSection from './sections/HeroSection'
import ReviewsSection from './sections/ReviewsSection'
import ProductsSection from './sections/ProductsSection'
import AboutSection from './sections/AboutSection'
import ContactsFAQSection from './sections/ContactsFAQSection'
import CoreValuesSection from './sections/CoreValuesSection'

function App() {
  return (
    <div  className=''>
      <Navbar />
      <HeroSection />
      <CoreValuesSection />
      <ProductsSection />
      <AboutSection />
      <ReviewsSection />
      <ContactsFAQSection />
      <Footer />
    </div>
  )
}

export default App
