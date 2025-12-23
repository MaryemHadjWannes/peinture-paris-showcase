import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, ExternalLink, MessageSquareQuote, ArrowRight } from "lucide-react";
import { GoogleReview, useGoogleReviews } from "@/hooks/useGoogleReviews";

type Review = GoogleReview;

const Stars = ({ value }: { value: number }) => {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="inline-flex items-center gap-1" aria-label={`Note ${v} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < v ? "text-accent" : "text-muted-foreground/40"}`} />
      ))}
    </div>
  );
};

// Si tes dates sont relatives, on ne peut pas trier parfaitement par date.
// Ici: tri par note / ou “avec texte d’abord”. Si tu ajoutes des dates ISO plus tard, on pourra trier “récents”.
type SortKey = "best" | "worst" | "withTextFirst";

const sortReviews = (items: Review[], sort: SortKey) => {
  const copy = [...items];
  if (sort === "best") return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  if (sort === "worst") return copy.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
  return copy.sort((a, b) => Number(!!b.text) - Number(!!a.text));
};

const Avis: React.FC = () => {
  const { data } = useGoogleReviews();
  const reviews: Review[] = data?.reviews ?? [];
  const summary = data?.summary ?? {};
  const googleMapsUrl: string | undefined = data?.googleMapsUrl;
  const ogImage = "https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg";

  const [sort, setSort] = React.useState<SortKey>("withTextFirst");

  const allSorted = React.useMemo(() => sortReviews(reviews, sort), [reviews, sort]);
  const withTextSorted = React.useMemo(
    () => sortReviews(reviews.filter((r) => r.text && r.text.trim().length > 0), sort),
    [reviews, sort]
  );

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Avis clients | HN Rénovation</title>
        <meta
          name="description"
          content="Avis clients HN Rénovation : retours sur la qualité des travaux, la propreté du chantier et le sérieux de l’équipe."
        />
        <link rel="canonical" href="https://hn-renovation.fr/avis" />
        <meta property="og:title" content="Avis clients | HN Rénovation" />
        <meta
          property="og:description"
          content="Avis clients HN Rénovation : retours sur la qualité des travaux, la propreté du chantier et le sérieux de l’équipe."
        />
        <meta property="og:url" content="https://hn-renovation.fr/avis" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Avis clients | HN Rénovation" />
        <meta
          name="twitter:description"
          content="Avis clients HN Rénovation : retours sur la qualité des travaux, la propreté du chantier et le sérieux de l’équipe."
        />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <Navigation />
      <br />
      <br />

      <main>
        {/* Header / Hero-like */}
        <section className="py-16 bg-gradient-to-b from-secondary/35 via-white/70 to-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
                <MessageSquareQuote className="h-5 w-5 text-accent" />
                <span className="text-accent font-medium">Avis clients</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Tous les avis
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Découvrez les retours de nos clients sur la{" "}
                <strong className="text-primary font-semibold">qualité</strong> de nos finitions, la propreté du
                chantier et notre sérieux.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Card className="border-border/50 bg-white/70 shadow-sm">
                  <CardContent className="py-3 px-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center">
                      <Star className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-primary">
                        {typeof summary.rating === "number" ? summary.rating.toFixed(1) : "—"} / 5
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {typeof summary.totalReviews === "number" ? `${summary.totalReviews} avis` : "Avis Google"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {googleMapsUrl ? (
                  <Button asChild className="rounded-xl">
                    <a href={googleMapsUrl} target="_blank" rel="noreferrer">
                      Voir sur Google Maps <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : null}

                <Button asChild variant="outline" className="rounded-xl">
                  <a href="/#contact">
                    Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Controls + List */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold mb-4">
                Avis Google et témoignages clients
              </h2>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <Tabs defaultValue="withText" className="w-full md:w-auto">
                  <TabsList className="rounded-xl">
                    <TabsTrigger value="withText">Avec commentaire</TabsTrigger>
                    <TabsTrigger value="all">Tous</TabsTrigger>
                  </TabsList>

                  {/* Tri */}
                  <div className="mt-4 md:mt-0 md:ml-4 inline-block">
                    <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                      <SelectTrigger className="w-[240px] rounded-xl">
                        <SelectValue placeholder="Trier..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="withTextFirst">Mettre en avant les commentaires</SelectItem>
                        <SelectItem value="best">Meilleure note</SelectItem>
                        <SelectItem value="worst">Moins bonne note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <TabsContent value="withText" className="mt-6">
                    <ReviewsGrid items={withTextSorted} />
                  </TabsContent>

                  <TabsContent value="all" className="mt-6">
                    <ReviewsGrid items={allSorted} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const ReviewsGrid: React.FC<{ items: Review[] }> = ({ items }) => {
  if (!items.length) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Aucun avis à afficher pour le moment.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((r, idx) => (
        <motion.div
          key={`${r.authorName}-${idx}`}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="h-full border-border/50 bg-white/70 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-lg font-heading text-primary truncate">
                    {r.authorName}
                  </CardTitle>
                  {r.authorMeta ? (
                    <div className="text-xs text-muted-foreground">{r.authorMeta}</div>
                  ) : null}
                  <div className="mt-2 flex items-center gap-2">
                    <Stars value={r.rating} />
                    {r.relativeDate ? (
                      <span className="text-xs text-muted-foreground">{r.relativeDate}</span>
                    ) : null}
                  </div>
                </div>

                <Badge className="bg-accent/15 text-accent shadow-none">Google</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {r.title ? <div className="font-medium text-primary">{r.title}</div> : null}

              {r.text ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Avis sans commentaire.</p>
              )}

              {r.visited ? (
                <div className="text-xs text-muted-foreground">
                  Visité: <span className="font-medium">{r.visited}</span>
                </div>
              ) : null}

              {r.ownerReply?.text ? (
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold">Réponse du propriétaire</div>
                    {r.ownerReply.relativeDate ? (
                      <div className="text-xs text-muted-foreground">{r.ownerReply.relativeDate}</div>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{r.ownerReply.text}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default Avis;
