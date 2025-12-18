import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Map from "@/components/Map";
import Faq from "@/components/Faq";
import { CITIES, DEFAULT_CITY } from "@/data/seo";
import { Link } from "react-router-dom";

const Index = () => {
  const city = DEFAULT_CITY;

  return (
    <div className="min-h-screen">
      <Navigation />
      <br/>
      <br/>
      <main>
        <Hero city={city} priority />
        <About city={city} />
        <Services city={city} />
        <Faq city={city} />
        <Contact city={city} />

        <section className="p-6">
          <h2 className="text-2xl font-bold mb-4">Notre Localisation</h2>
          <Map city={city} />
        </section>

        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-4">Zones d’intervention</h2>
          <p className="text-muted-foreground mb-4">
            Nous intervenons à {city.name} et dans les villes voisines.
          </p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <Link key={c.slug} to={`/ville/${c.slug}`} className="text-sm underline hover:text-accent">
                {c.name} ({c.postalCode})
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
