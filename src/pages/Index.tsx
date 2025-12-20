import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Map from "@/components/Map";
import Faq from "@/components/Faq";
import PortfolioPreview from "@/components/PortfolioPreview";
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
        <PortfolioPreview city={city} />
        <Faq city={city} />
        <Contact city={city} />

        <section className="p-6">
          <h2 className="text-2xl font-bold mb-4">Notre localisation à {city.name}</h2>
          <Map city={city} />
        </section>

        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-4">Zones d’intervention autour de {city.name}</h2>
          <p className="text-muted-foreground mb-4">
            Nous intervenons à {city.name} et dans les villes voisines.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CITIES.map((c) => (
              <Link
                key={c.slug}
                to={`/${c.slug}`}
                className="group rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="font-semibold text-primary group-hover:text-accent">{c.name}</div>
                <div className="text-xs text-muted-foreground">
                  {c.postalCode} • {c.department}
                </div>
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
