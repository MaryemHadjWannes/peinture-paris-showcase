import { Suspense, lazy } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import LazyRender from "@/components/LazyRender";
import { CITIES, DEFAULT_CITY } from "@/data/seo";
import { Link } from "react-router-dom";

const About = lazy(() => import("@/components/About"));
const Services = lazy(() => import("@/components/Services"));
const PortfolioPreview = lazy(() => import("@/components/PortfolioPreview"));
const GoogleReviews = lazy(() => import("@/components/GoogleReviews"));
const Faq = lazy(() => import("@/components/Faq"));
const Contact = lazy(() => import("@/components/Contact"));
const Map = lazy(() => import("@/components/Map"));

const Index = () => {
  const city = DEFAULT_CITY;

  return (
    <div className="min-h-screen">
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
