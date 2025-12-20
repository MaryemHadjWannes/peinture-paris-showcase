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
import { CITIES } from "@/data/seo";
import NotFound from "@/pages/NotFound";

export default function CityPage() {
  const { citySlug } = useParams();
  const city = useMemo(() => CITIES.find((c) => c.slug === citySlug), [citySlug]);

  if (!city) {
    return <NotFound />;
  }

  const canonical = `https://hn-renovation.fr/${city.slug}`;
  const ogImage = "https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg";

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`Peintre à ${city.name} (${city.postalCode}) | HN Rénovation`}</title>
        <meta
          name="description"
          content={`HN Rénovation, artisan peintre à ${city.name} (${city.postalCode}) : peinture intérieure, peinture extérieure, enduit, plâtrerie, rénovation. Devis gratuit et finitions durables.`}
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`Peintre à ${city.name} (${city.postalCode}) | HN Rénovation`} />
        <meta
          property="og:description"
          content={`HN Rénovation, artisan peintre à ${city.name} (${city.postalCode}) : peinture intérieure, peinture extérieure, enduit, plâtrerie, rénovation. Devis gratuit et finitions durables.`}
        />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Peintre à ${city.name} (${city.postalCode}) | HN Rénovation`} />
        <meta
          name="twitter:description"
          content={`HN Rénovation, artisan peintre à ${city.name} (${city.postalCode}) : peinture intérieure, peinture extérieure, enduit, plâtrerie, rénovation. Devis gratuit et finitions durables.`}
        />
        <meta name="twitter:image" content={ogImage} />
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
          <h2 className="text-2xl font-bold mb-4">Intervention et localisation à {city.name}</h2>
          <Map city={city} />
        </section>

        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-4">Autres zones d’intervention près de {city.name}</h2>
          <p className="text-muted-foreground mb-4">Découvrez aussi nos pages locales :</p>
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
}
