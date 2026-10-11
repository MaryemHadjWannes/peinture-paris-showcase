import { Suspense, lazy, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import LazyRender from "@/components/LazyRender";
import { CITIES } from "@/data/seo";
import { getCityMeta } from "@/data/routeMeta";
import SeoHead from "@/components/SeoHead";
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

  return (
    <div className="min-h-screen">
      <SeoHead meta={getCityMeta(city)} />

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
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Intervention autour de {city.name}</h2>
            <p className="text-muted-foreground mb-4">
              Nous intervenons aussi dans les communes proches : {city.nearby?.join(", ")}.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {city.nearby?.map((name) => (
                <div
                  key={name}
                  className="rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm"
                >
                  <p className="font-semibold text-primary">{name}</p>
                </div>
              ))}
            </div>
          </div>
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
