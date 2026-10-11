import { Suspense, lazy } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import LazyRender from "@/components/LazyRender";
import { CITIES, DEFAULT_CITY, cityPath } from "@/data/seo";
import { HOME_META } from "@/data/routeMeta";
import SeoHead from "@/components/SeoHead";
import { Link } from "react-router-dom";

const About = lazy(() => import("@/components/About"));
const Services = lazy(() => import("@/components/Services"));
const PortfolioPreview = lazy(() => import("@/components/PortfolioPreview"));
const GoogleReviews = lazy(() => import("@/components/GoogleReviews"));
const Faq = lazy(() => import("@/components/Faq"));
const Contact = lazy(() => import("@/components/Contact"));
const Map = lazy(() => import("@/components/Map"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  const city = DEFAULT_CITY;
  return (
    <div className="min-h-screen">
      <SeoHead meta={HOME_META} />
      <Navigation />
      <br/>
      <br/>
      <main>
        <Hero
          city={city}
          priority
          titleOverride="Entreprise de peinture à Cambrai (Nord) et alentours"
        />
        <LazyRender minHeight="560px">
          <Suspense fallback={null}>
            <PortfolioPreview city={city} />
          </Suspense>
        </LazyRender>
        <LazyRender minHeight="420px">
          <Suspense fallback={null}>
            <GoogleReviews />
          </Suspense>
        </LazyRender>
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="subsection-title text-primary mb-4">
              Peinture à Cambrai (Nord) : services de rénovation intérieure et extérieure
            </h2>
            <p className="text-muted-foreground mb-4">
              HN Rénovation est une entreprise et artisan peintre à Cambrai (59), au cœur du Nord, spécialisée dans la
              rénovation et la décoration des maisons et locaux professionnels. Nous intervenons aussi dans les
              alentours (Douai, Valenciennes, Caudry, Arras) pour des chantiers soignés et durables.
            </p>
            <p className="text-muted-foreground mb-6">
              Nos services couvrent la peinture intérieure, la peinture extérieure, les enduits et la plâtrerie, avec
              une préparation rigoureuse des supports, des finitions propres et un devis gratuit.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 text-sm sm:text-base text-muted-foreground">
              {[
                "Peinture intérieure : murs, plafonds, boiseries et finitions.",
                "Peinture extérieure : façades, pignons et protections durables.",
                "Enduits et ratissage pour des supports lisses et prêts à peindre.",
                "Plâtrerie, reprises et rénovation complète avant mise en peinture.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-strong" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
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
            <section className="container mx-auto px-4 py-12">
              <div className="max-w-6xl mx-auto">
                <h2 className="subsection-title mb-6">Notre localisation à {city.name}</h2>
                <Map city={city} />
              </div>
            </section>
          </Suspense>
        </LazyRender>

        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="subsection-title mb-4">Zones d’intervention autour de {city.name}</h2>
            <p className="text-muted-foreground mb-4">
              Nous intervenons à {city.name} et dans les villes voisines.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CITIES.map((c) => (
                <Link
                  key={c.slug}
                  to={cityPath(c)}
                  className="group rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="font-semibold text-primary group-hover:text-accent-strong">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.postalCode} • {c.department}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <LazyRender minHeight="480px" rootMargin="200px">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </LazyRender>
    </div>
  );
};

export default Index;
