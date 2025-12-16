import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Map from "@/components/Map";
import Footer from "@/components/Footer";
import { CITIES, getCityBySlug } from "@/data/seo";

export default function CityPage() {
  const { citySlug } = useParams();
  const city = useMemo(() => getCityBySlug(citySlug), [citySlug]);

  const canonical = `https://hn-renovation.fr/ville/${city.slug}`;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`Peintre à ${city.name} (${city.postalCode}) | HN Rénovation`}</title>
        <meta
          name="description"
          content={`HN Rénovation, artisan peintre à ${city.name} (${city.postalCode}) : peinture intérieure, peinture extérieure, enduit, plâtrerie, rénovation. Devis gratuit et finitions durables.`}
        />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <Navigation />
        <br/>
        <br/>
      <main>
        <Hero city={city} />
        <About city={city} />
        <Services city={city} />
        <Faq city={city} />
        <Contact city={city} />

        <section className="p-6">
          <h2 className="text-2xl font-bold mb-4">Notre Localisation</h2>
          <Map city={city} />
        </section>

        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-4">Autres zones d’intervention</h2>
          <p className="text-muted-foreground mb-4">Découvrez aussi nos pages locales :</p>
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
}
