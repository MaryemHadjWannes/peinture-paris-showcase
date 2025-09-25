import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import GoogleReviews from "@/components/GoogleReviews";
import Footer from "@/components/Footer";

const Index = () => {
  // Latitude and longitude of your position
  const lat = 50.164479209493194;
  const lng = 3.2450711288360057;

  // Google Maps embed URL with coordinates
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&hl=fr&z=15&output=embed`;

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Portfolio />
        <Services />
        <GoogleReviews />
        <Contact />

        {/* Google Map */}
        <section className="p-6">
          <h2 className="text-2xl font-bold mb-4">📍 Notre Localisation</h2>
          <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
