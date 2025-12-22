import { Suspense, lazy, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import LazyRender from "@/components/LazyRender";
import { CITIES } from "@/data/seo";
import NotFound from "@/pages/NotFound";

const About = lazy(() => import("@/components/About"));
const Services = lazy(() => import("@/components/Services"));
const GoogleReviews = lazy(() => import("@/components/GoogleReviews"));
const Faq = lazy(() => import("@/components/Faq"));
const Contact = lazy(() => import("@/components/Contact"));
const Map = lazy(() => import("@/components/Map"));

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
        <Hero city={city} priority />
        <LazyRender minHeight="320px">
          <Suspense fallback={null}>
            <About city={city} />
          </Suspense>
        </LazyRender>
        <LazyRender minHeight="520px">
          <Suspense fallback={null}>
            <Services city={city} />
          </Suspense>
        </LazyRender>
        <LazyRender minHeight="420px">
          <Suspense fallback={null}>
            <GoogleReviews />
          </Suspense>
        </LazyRender>
        <LazyRender minHeight="360px">
          <Suspense fallback={null}>
            <Faq city={city} />
          </Suspense>
        </LazyRender>
        <LazyRender minHeight="520px">
          <Suspense fallback={null}>
            <Contact city={city} />
          </Suspense>
        </LazyRender>

        <LazyRender minHeight="420px">
          <Suspense fallback={null}>
            <section className="p-6">
              <h2 className="text-2xl font-bold mb-4">Intervention et localisation à {city.name}</h2>
              <Map city={city} />
            </section>
          </Suspense>
        </LazyRender>

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
