import { Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import LazyRender from "@/components/LazyRender";
import { CITIES, DEFAULT_CITY } from "@/data/seo";
import { Link } from "react-router-dom";
import heroImageWebp640 from "@/assets/hero-painting-640.webp";
import heroImageWebp1280 from "@/assets/hero-painting-1280.webp";
import heroImageWebp1920 from "@/assets/hero-painting.webp";

const About = lazy(() => import("@/components/About"));
const Services = lazy(() => import("@/components/Services"));
const PortfolioPreview = lazy(() => import("@/components/PortfolioPreview"));
const GoogleReviews = lazy(() => import("@/components/GoogleReviews"));
const Faq = lazy(() => import("@/components/Faq"));
const Contact = lazy(() => import("@/components/Contact"));
const Map = lazy(() => import("@/components/Map"));

const Index = () => {
  const city = DEFAULT_CITY;
  const description =
    "HN Rénovation, artisan peintre à Cambrai (59) dans le Nord : peinture intérieure et extérieure, enduits, plâtrerie, façades. Devis gratuit.";

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>HN Rénovation | Peintre à Cambrai (59) - Peinture intérieure</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hn-renovation.fr/" />
        <meta property="og:title" content="HN Rénovation | Peintre à Cambrai (59) - Peinture intérieure" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg" />
        <meta property="og:url" content="https://hn-renovation.fr/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HN Rénovation | Peintre à Cambrai (59) - Peinture intérieure" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg" />
        <link
          rel="preload"
          as="image"
          href={heroImageWebp640}
          type="image/webp"
          media="(max-width: 640px)"
        />
        <link
          rel="preload"
          as="image"
          href={heroImageWebp1280}
          type="image/webp"
          media="(min-width: 641px) and (max-width: 1280px)"
        />
        <link
          rel="preload"
          as="image"
          href={heroImageWebp1920}
          type="image/webp"
          media="(min-width: 1281px)"
        />
      </Helmet>
      <Navigation />
      <br/>
      <br/>
      <main>
        <Hero
          city={city}
          priority
          titleOverride="Entreprise de peinture à Cambrai (Nord) et alentours"
        />
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-primary mb-4">
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
            <div className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
              <div>Peinture intérieure : murs, plafonds, boiseries et finitions.</div>
              <div>Peinture extérieure : façades, pignons et protections durables.</div>
              <div>Enduits et ratissage pour des supports lisses et prêts à peindre.</div>
              <div>Plâtrerie, reprises et rénovation complète avant mise en peinture.</div>
            </div>
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
              <h2 className="text-2xl font-bold mb-4">Notre localisation à {city.name}</h2>
              <Map city={city} />
            </section>
          </Suspense>
        </LazyRender>

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
