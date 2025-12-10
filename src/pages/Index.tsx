import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Map from "@/components/Map"; // nouveau composant
import Faq from "@/components/Faq";
import AreasServed from "@/components/AreasServed";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <br />
        <br />
        <br />
        <Hero />
        <About />
        {/*<GoogleReviews />*/}
        <Portfolio />
        <Services />
        <AreasServed />
        <Faq />
        <Contact />

        {/* Google Map */}
        <section className="p-6">
          <h2 className="text-2xl font-bold mb-4">📍 Notre Localisation</h2>
          <Map />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
