import React, { useId, useState } from "react";
import { CheckCircle, Award, Palette, ShieldCheck } from "lucide-react";
import type { City } from "@/data/seo";
import { useIntersectionAnimation } from "@/hooks/useIntersectionAnimation";

type AboutProps = {
  city: City;
};

const About: React.FC<AboutProps> = ({ city }) => {
  const [expanded, setExpanded] = useState(false);
  const descId = useId();
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useIntersectionAnimation();
  const { ref: commitmentRef, isVisible: commitmentVisible } = useIntersectionAnimation();

  const features = [
    {
      icon: CheckCircle,
      title: "Qualité Supérieure",
      description: "Utilisation de matériaux premium et techniques modernes pour des finitions impeccables",
    },
    {
      icon: Award,
      title: "Équipe Passionnée",
      description: "Une équipe dévouée, formée aux dernières innovations pour vos projets",
    },
    {
      icon: Palette,
      title: "Conseils Personnalisés",
      description: "Accompagnement sur mesure pour choisir couleurs et finitions parfaites",
    },
    {
      icon: ShieldCheck,
      title: "Assurance Décennale",
      description: "Tous nos travaux sont couverts par une assurance décennale pour votre tranquillité d'esprit",
    },
  ];

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div ref={headerRef} className={`max-w-6xl mx-auto text-center mb-16 ${headerVisible ? 'animate-fade-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-6 mx-auto">
            <Award className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium">Notre Expertise</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Entreprise de peinture à {city.name} : notre savoir-faire
          </h2>

          <p className="text-xl md:text-2xl font-normal text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            HN Rénovation, artisan peintre intervenant à {city.name} ({city.postalCode}), vous accompagne pour
            la peinture intérieure, la peinture extérieure, l'enduit, la plâtrerie et la rénovation, avec
            préparation soignée, finitions durables et devis gratuit.
          </p>

          <div className="mt-8 max-w-4xl mx-auto text-left bg-card/60 backdrop-blur rounded-2xl p-6 md:p-8 border border-border/60 shadow-soft">
            <div
              id={descId}
              className={[
                "relative leading-relaxed text-muted-foreground",
                expanded ? "max-h-none" : "max-h-[10rem]",
                "md:max-h-none",
                "overflow-hidden",
              ].join(" ")}
            >
              <p>
                <strong className="text-primary">HN Rénovation</strong> est une{" "}
                <strong className="text-primary">
                  entreprise de peinture et de rénovation
                </strong>{" "}
                intervenant à{" "}
                <strong className="text-primary">
                  {city.name} ({city.postalCode})
                </strong>
                . Nous accompagnons particuliers et professionnels avec un haut niveau d'exigence sur la préparation
                des supports, les finitions et la durabilité des matériaux.
              </p>

              <p className="mt-4">
                Nous réalisons des prestations complètes :{" "}
                <strong className="text-primary">
                  enduits, ratissage des murs, application de bandes calicot et bandes armées
                </strong>
                , rattrapage des irrégularités et finitions soignées. Chaque chantier débute par une préparation
                rigoureuse des supports pour garantir un rendu esthétique et durable.
              </p>

              <p className="mt-4">
                Nous intervenons également pour la{" "}
                <strong className="text-primary">peinture extérieure</strong>{" "}
                et le{" "}
                <strong className="text-primary">ravalement de façade</strong>, avec des solutions adaptées :
                nettoyage, traitement anti-mousse, réparation des fissures et remise en état.
              </p>

              <p className="mt-4">
                <strong className="text-primary">Devis gratuit</strong>, conseils personnalisés et accompagnement
                sur mesure pour vos travaux de peinture et de rénovation.
              </p>

              {!expanded && (
                <div
                  className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/95 to-transparent md:hidden pointer-events-none"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="mt-4 flex justify-center md:hidden">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls={descId}
                className="inline-flex items-center gap-2 text-accent font-semibold px-4 py-2 rounded-full border border-accent/30 bg-accent/10 hover:bg-accent/15 transition"
              >
                {expanded ? "Voir moins" : "Voir plus"}
                <span aria-hidden="true">{expanded ? "▲" : "▼"}</span>
              </button>
            </div>
          </div>
        </div>

        <div ref={featuresRef} className={`grid md:grid-cols-4 gap-8 mb-16 ${featuresVisible ? 'animate-fade-up' : 'opacity-0'}`}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-card p-6 rounded-xl shadow-soft border border-border/50" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2 text-primary">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div ref={commitmentRef} className={`bg-primary/5 rounded-2xl p-8 border border-primary/20 text-center ${commitmentVisible ? 'animate-fade-up' : 'opacity-0'}`}>
          <h3 className="text-2xl font-heading font-semibold mb-4 text-primary">Notre Engagement</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Respect des délais, budget maîtrisé, chantier propre et suivi personnalisé, avec une garantie de satisfaction.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
