import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import How from "./components/How/How";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import AboutSection from "./components/AboutSection/AboutSection";
import ServicesSection from "./components/ServicesSection/ServicesSection";
import Signup from "./pages/Signup/Signup";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <AboutSection />
              <ServicesSection />
              <How />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* Signup Page */}
        <Route path="/signup" element={
          <>
          <Signup />
          <Footer/>
          </>
        } />

        

      </Routes>
    </>
    
  );
}

export default App;