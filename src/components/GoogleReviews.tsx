import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink } from "lucide-react";
import { GoogleReview, useGoogleReviews } from "@/hooks/useGoogleReviews";

type Review = GoogleReview;

const Stars = ({ value }: { value: number }) => {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="inline-flex items-center gap-1" aria-label={`Note ${v} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < v ? "text-accent" : "text-muted-foreground/35"}`}
        />
      ))}
    </div>
  );
};

const clamp = (s: string, max = 140) =>
  s.length > max ? s.slice(0, max - 1).trim() + "…" : s;

const itemVariants = {
  offscreen: { opacity: 0, y: 16 },
  onscreen: { opacity: 1, y: 0 },
};

const GoogleReviews: React.FC<{ max?: number }> = ({ max = 4 }) => {
  const { data } = useGoogleReviews();
  const reviews: Review[] = data?.reviews ?? [];
  const summary = data?.summary ?? {};
  const googleMapsUrl: string | undefined = data?.googleMapsUrl;

  const preview = React.useMemo(() => {
    const withText = reviews.filter((r) => r.text && r.text.trim().length > 0);
    return (withText.length ? withText : reviews).slice(0, max);
  }, [reviews, max]);

  const ratingText =
    typeof summary.rating === "number" ? summary.rating.toFixed(1) : "—";
  const countText =
    typeof summary.totalReviews === "number" ? `${summary.totalReviews} avis` : "Avis";

  return (
    <section id="avis" className="py-10 bg-gradient-to-b from-secondary/20 via-white/70 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header centered like FAQ */}
            <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4 sm:mb-5">
                <Star className="h-5 w-5 text-accent" />
                <span className="text-accent font-medium text-sm sm:text-base">
                Avis Google
                </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">
                Ce que disent nos clients
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {ratingText} / 5 • {countText} — avis authentiques publiés sur Google.
            </p>

            {/* Buttons centered */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button asChild className="rounded-xl">
                <Link to="/avis">
                    Tous les avis
                </Link>
                </Button>

                {googleMapsUrl ? (
                <Button asChild variant="outline" className="rounded-xl">
                    <a href={googleMapsUrl} target="_blank" rel="noreferrer">
                    Google Maps <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
                ) : null}
            </div>
            </div>


          {/* Grid compact */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {preview.map((r, idx) => (
              <motion.div
                key={`${r.authorName}-${idx}`}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.25 }}
                variants={itemVariants}
              >
                <Card className="h-full border-border/50 bg-white/70 hover:shadow-md transition">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-heading text-primary truncate">
                        {r.authorName}
                      </CardTitle>
                      <Badge className="bg-accent/12 text-accent shadow-none">
                        <span className="text-xs">Google</span>
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <Stars value={r.rating} />
                      {r.relativeDate ? (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {r.relativeDate}
                        </span>
                      ) : null}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {r.text ? clamp(r.text, 150) : "Avis sans commentaire."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Footer link removed to avoid duplicate button */}
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
