import Hero from "../../components/Hero/Hero";
import AboutSection from "../../components/AboutSection/AboutSection";
import ServicesSection from "../../components/ServicesSection/ServicesSection";
import How from "../../components/How/How"
import Contact from "../../components/Contact/Contact"
import Footer from "../../components/Footer/Footer";



const Home = () => {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <How />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;